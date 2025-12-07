-- Create Table
DROP DATABASE IF EXISTS LMS;
CREATE DATABASE LMS CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE LMS;

SET sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION';

-- 1. Department
CREATE TABLE Department (
    DeptID CHAR(6) PRIMARY KEY,
    DeptName VARCHAR(100) UNIQUE NOT NULL,
    Description TEXT,
    Contact VARCHAR(100)
) ENGINE=InnoDB;

-- 2. User
CREATE TABLE `User` (
    UserID CHAR(8) PRIMARY KEY,
    LastName VARCHAR(50) NOT NULL,
    FirstName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    Address VARCHAR(255),
    Age INT CHECK (Age BETWEEN 16 AND 100),
    DoB DATE,
    CONSTRAINT chk_email CHECK (Email LIKE '%@%.%')
) ENGINE=InnoDB;

-- 3. Student
CREATE TABLE Student (
    StudentID CHAR(8) PRIMARY KEY,
    EnrollmentYear YEAR NOT NULL,
    Major VARCHAR(100),
    DeptID CHAR(6),
    FOREIGN KEY (StudentID) REFERENCES `User`(UserID) ON DELETE CASCADE,
    FOREIGN KEY (DeptID) REFERENCES Department(DeptID)
) ENGINE=InnoDB;

-- 4. Instructor
CREATE TABLE Instructor (
    InstructorID CHAR(8) PRIMARY KEY,
    Degree VARCHAR(50),
    Position VARCHAR(50),
    DeptID CHAR(6),
    FOREIGN KEY (InstructorID) REFERENCES `User`(UserID) ON DELETE CASCADE,
    FOREIGN KEY (DeptID) REFERENCES Department(DeptID)
) ENGINE=InnoDB;

-- 5. Admin
CREATE TABLE Admin (
    AdminID CHAR(8) PRIMARY KEY,
    Role VARCHAR(50) DEFAULT 'System Admin',
    FOREIGN KEY (AdminID) REFERENCES `User`(UserID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- User Account
CREATE TABLE UserAccount (
    AccountID CHAR(8) PRIMARY KEY,
    UserID CHAR(8),
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('Admin', 'Student', 'Instructor') NOT NULL,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
        ON DELETE CASCADE
);

-- 6. Course
CREATE TABLE Course (
    CourseID CHAR(8) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description TEXT,
    Credit INT CHECK (Credit BETWEEN 1 AND 10),
    Duration INT CHECK (Duration > 0), -- duration in hours
    DeptID CHAR(6),
    FOREIGN KEY (DeptID) REFERENCES Department(DeptID)
) ENGINE=InnoDB;

-- 7. Module
CREATE TABLE Module (
    ModuleID CHAR(8) PRIMARY KEY,
    Name VARCHAR(100),
    Description TEXT,
    Duration INT CHECK (Duration > 0),
    CourseID CHAR(8),
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID)
) ENGINE=InnoDB;

-- 8. Content
CREATE TABLE Content (
    ContentID CHAR(8) PRIMARY KEY,
    Title VARCHAR(150),
    Type ENUM('Video','Document','Slide') NOT NULL,
    URL VARCHAR(255),
    Size DECIMAL(7,2), -- MB
    UploadDate DATE DEFAULT (CURRENT_DATE),
    CourseID CHAR(8),
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID)
) ENGINE=InnoDB;

-- 9. Enrollment
CREATE TABLE Enrollment (
    EnrollID CHAR(8) PRIMARY KEY,
    StudentID CHAR(8),
    CourseID CHAR(8),
    Status ENUM('Enrolled','Completed','Dropped') DEFAULT 'Enrolled',
    Semester VARCHAR(10),
    GradeFinal DECIMAL(4,2),
    Schedule VARCHAR(100),
	InstructorID CHAR(8),
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID),
	FOREIGN KEY (InstructorID) REFERENCES Instructor(InstructorID)
) ENGINE=InnoDB;

-- 10. Assessment
CREATE TABLE Assessment (
    AssessID CHAR(8) PRIMARY KEY,
    Title VARCHAR(150),
    Description TEXT,
    Deadline DATE,
    MaxScore INT CHECK (MaxScore BETWEEN 10 AND 100),
    CourseID CHAR(8),
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID)
) ENGINE=InnoDB;

-- 11. Grade
CREATE TABLE Grade (
    GradeID CHAR(8) PRIMARY KEY,
    StudentID CHAR(8),
    AssessID CHAR(8),
    Score DECIMAL(4,2) CHECK (Score BETWEEN 0 AND 10),
    GradeLetter ENUM('A+','A','A-','B+','B','B-','C+','C','C-','D+','D','D-','F'),
    DateRecorded DATE,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
    FOREIGN KEY (AssessID) REFERENCES Assessment(AssessID)
) ENGINE=InnoDB;

-- 12. Feedback
CREATE TABLE Feedback (
    FeedbackID CHAR(8) PRIMARY KEY,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Content TEXT,
    Date DATE,
    StudentID CHAR(8),
    InstructorID CHAR(8),
    CourseID CHAR(8),
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
    FOREIGN KEY (InstructorID) REFERENCES Instructor(InstructorID),
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID)
) ENGINE=InnoDB;

-- 13. Forum and relation table Forum_User
CREATE TABLE Forum (
    ForumID CHAR(8) PRIMARY KEY,
    Topic VARCHAR(200),
    Date DATE
) ENGINE=InnoDB;

CREATE TABLE Forum_User (
    ForumID CHAR(8),
    UserID CHAR(8),
    PRIMARY KEY (ForumID, UserID),
    FOREIGN KEY (ForumID) REFERENCES Forum(ForumID),
    FOREIGN KEY (UserID) REFERENCES `User`(UserID)
) ENGINE=InnoDB;

-- 14. Message
CREATE TABLE Message (
    MessageID CHAR(8) PRIMARY KEY,
    SenderID CHAR(8),
    ReceiverID CHAR(8),
    Content TEXT,
    Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Read','Unread') DEFAULT 'Unread',
    FOREIGN KEY (SenderID) REFERENCES `User`(UserID),
    FOREIGN KEY (ReceiverID) REFERENCES `User`(UserID)
) ENGINE=InnoDB;

-- 15. Notification
CREATE TABLE Notification (
    NotifID CHAR(8) PRIMARY KEY,
    Type VARCHAR(50),
    Content TEXT,
    Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Seen','Unseen') DEFAULT 'Unseen',
    UserID CHAR(8),
    FOREIGN KEY (UserID) REFERENCES `User`(UserID)
) ENGINE=InnoDB;

-- 16. Announcement
CREATE TABLE Announcement (
    AnnounceID CHAR(8) PRIMARY KEY,
    Title VARCHAR(200),
    Content TEXT,
    Date DATE DEFAULT (CURRENT_DATE),
    AdminID CHAR(8),
    FOREIGN KEY (AdminID) REFERENCES Admin(AdminID)
) ENGINE=InnoDB;

-- 17. StudentStatus
CREATE TABLE StudentStatus (
    StatusID CHAR(8) PRIMARY KEY,
    Type ENUM('Active','Graduated','Suspended'),
    EffectiveDate DATE,
    StudentID CHAR(8) UNIQUE,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID)
) ENGINE=InnoDB;

-- //////////////////////////////////////////////////
-- Insert data
-- 1. Departments
INSERT INTO Department(DeptID, DeptName, Description, Contact) VALUES
('DEP001','Mechanical Engineering','Mechanical engineering is the study of physical machines and mechanisms that may involve force and movement.','me-faculty@hcmut.edu.vn'),
('DEP002','Materials Technology','Materials Technology science is an interdisciplinary field of researching and discovering materials.','mt-faculty@hcmut.edu.vn'),
('DEP003','Electrical and Electronic Engineering','Electrical engineering is an engineering discipline concerned with the study, design, and application of equipment, devices, and systems that use electricity, electronics, and electromagnetism.','ee-faculty@hcmut.edu.vn'),
('DEP004','Applied Sciences','Applied science is the application of the scientific method and scientific knowledge to attain practical goals.','as-faculty@hcmut.edu.vn'),
('DEP005','Computer Science and Engineering','Computer Science and Engineering (CSE) is an academic subject comprising approaches of computer science and computer engineering.','cs-faculty@hcmut.edu.vn'),
('DEP006','Geological and Petroleum Engineering','Geological engineering is a discipline of engineering concerned with the application of geological science and engineering principles to fields, such as civil engineering, mining, environmental engineering, and forestry, among others. Petroleum engineering is a field of engineering concerned with the activities related to the production of hydrocarbons, which can be either crude oil or natural gas or both.','gp-faculty@hcmut.edu.vn'),
('DEP007','Transport Engineering','Transportation engineering or transport engineering is the application of technology and scientific principles to the planning, functional design, operation and management of facilities for any mode of transportation to provide for the safe, efficient, rapid, comfortable, convenient, economical, and environmentally compatible movement of people and goods transport.','te-faculty@hcmut.edu.vn'),
('DEP008','Chemical Engineering','Chemical engineering is an engineering field which deals with the study of the operation and design of chemical plants as well as methods of improving production. Chemical engineers develop economical commercial processes to convert raw materials into useful products.','chemical-faculty@hcmut.edu.vn'),
('DEP009','Civil Engineering','Civil engineering is a professional engineering discipline that deals with the design, construction, and maintenance of the physical and naturally built environment, including public works such as roads, bridges, canals, dams, airports, sewage systems, pipelines, structural components of buildings, and railways.','civil-faculty@hcmut.edu.vn'),
('DEP010','Environment and Resources','Environmental resource management or environmental management is the management of the interaction and impact of human societies on the environment.','er-faculty@hcmut.edu.vn'),
('DEP011','Industrial Management','Industrial management is a branch of engineering which facilitates the creation of management systems and integrates the diverse engineering processes. Industrial Management deals with industrial design, construction, management, and application of scientific and engineering principles to improve the entire industrial infrastructure and industrial processes.','im-faculty@hcmut.edu.vn');

-- 2. Users
INSERT INTO `User`(UserID, LastName, FirstName, Email, Phone, Address, Age, DoB) VALUES
('USR000','','sManager','sManager@hcmut.edu.vn','0900000000','HCMC, Vietnam',34,'1991-10-07'),
('USR001','Nguyen Van','Khang','nguyenvankhang@hcmut.edu.vn','0903000001','HCMC, Vietnam',32,'1993-06-15'),
('USR002','Tran Thi','Lan','tranthilan@hcmut.edu.vn','0903000002','HCMC, Vietnam',29,'1996-03-20'),
('USR003','Le Quang','Minh','lequangminh@hcmut.edu.vn','0903000003','Hanoi, Vietnam',45,'1980-09-10'),
('USR004','Pham Hong','Duc','phamhongduc@hcmut.edu.vn','0903000004','Da Nang, Vietnam',38,'1987-04-25'),
('USR005','Hoang Thi','Mai','hoangthimai@hcmut.edu.vn','0903000005','Hue, Vietnam',41,'1984-11-05'),
('USR006','Vu Van','Nam','vuvannam@hcmut.edu.vn','0903000006','Can Tho, Vietnam',35,'1990-07-12'),
('USR007','Do Thi','Hoa','dothihoa@hcmut.edu.vn','0903000007','Quang Nam, Vietnam',42,'1983-02-28'),
('USR008','Bui Xuan','Son','buixuanson@hcmut.edu.vn','0903000008','Hai Phong, Vietnam',39,'1986-12-01'),
('USR009','Dang Thi','Kim','dangthikim@hcmut.edu.vn','0903000009','Dong Nai, Vietnam',47,'1978-08-18'),
('USR010','Ngo Van','Phuc','ngovanphuc@hcmut.edu.vn','0903000010','Binh Duong, Vietnam',40,'1985-10-22'),
('USR011','Nguyen Thi','Linh','nguyenthilinh@hcmut.edu.vn','0903000011','HCMC, Vietnam',20,'2005-01-15'),
('USR012','Tran Van','Long','tranvanlong@hcmut.edu.vn','0903000012','Hanoi, Vietnam',21,'2004-03-22'),
('USR013','Le Thi','Huong','lethihuong@hcmut.edu.vn','0903000013','Da Nang, Vietnam',19,'2006-05-30'),
('USR014','Pham Van','Hieu','phamvanhieu@hcmut.edu.vn','0903000014','Can Tho, Vietnam',18,'2007-07-14'),
('USR015','Hoang Van','Tuan','hoangvantuan@hcmut.edu.vn','0903000015','Hue, Vietnam',20,'2005-09-20'),
('USR016','Vu Thi','Ngoc','vuthingoc@hcmut.edu.vn','0903000016','HCMC, Vietnam',19,'2006-11-11'),
('USR017','Do Van','Kien','dovankien@hcmut.edu.vn','0903000017','Quang Ninh, Vietnam',18,'2007-12-05'),
('USR018','Bui Thi','Lan','buithilan@hcmut.edu.vn','0903000018','Da Nang, Vietnam',21,'2004-02-17'),
('USR019','Dang Thi','Trang','dangthitrang@hcmut.edu.vn','0903000019','Khanh Hoa, Vietnam',20,'2005-04-30'),
('USR020','Ngo Van','Sy','ngovansy@hcmut.edu.vn','0903000020','Binh Phuoc, Vietnam',19,'2006-06-08'),
('USR021','Ly Thi','Bao','lythibao@hcmut.edu.vn','0903000021','HCMC, Vietnam',22,'2003-08-25'),
('USR022','Trinh Van','Thuy','trinhvanthuy@hcmut.edu.vn','0903000022','Thai Binh, Vietnam',18,'2007-10-10'),
('USR023','Huynh Thi','Khoa','huynhthikhoa@hcmut.edu.vn','0903000023','Long An, Vietnam',20,'2005-12-03'),
('USR024','Vo Van','Yen','vovanyen@hcmut.edu.vn','0903000024','Tien Giang, Vietnam',19,'2006-01-27'),
('USR025','Duong Thi','Dat','duongthidat@hcmut.edu.vn','0903000025','Ben Tre, Vietnam',21,'2004-07-19'),
('USR026','Nguyen Thi','Truc','nguyenthitruc@hcmut.edu.vn','0903000026','HCMC, Vietnam',18,'2007-03-14'),
('USR027','Tran Thi','Ngan','tranthin@hcmut.edu.vn','0903000027','Quang Ngai, Vietnam',20,'2005-05-05'),
('USR028','Le Van','Toan','levantoan@hcmut.edu.vn','0903000028','Quang Nam, Vietnam',19,'2006-09-09'),
('USR029','Pham Thi','Quynh','phamthiquynh@hcmut.edu.vn','0903000029','Dong Thap, Vietnam',18,'2007-11-21'),
('USR030','Hoang Van','Sang','hoangvansang@hcmut.edu.vn','0903000030','Vung Tau, Vietnam',21,'2004-04-04');

-- 3. Students
INSERT INTO Student(StudentID, EnrollmentYear, Major, DeptID) VALUES
('USR011',2023,'Transport Engineering','DEP007'),
('USR012',2023,'Chemical Engineering','DEP008'),
('USR013',2023,'Civil Engineering','DEP009'),
('USR014',2023,'Environment and Resources','DEP010'),
('USR015',2023,'Industrial Management','DEP011'),
('USR016',2023,'Transport Engineering','DEP007'),
('USR017',2023,'Chemical Engineering','DEP008'),
('USR018',2023,'Civil Engineering','DEP009'),
('USR019',2023,'Environment and Resources','DEP010'),
('USR020',2023,'Industrial Management','DEP011'),
('USR021',2023,'Transport Engineering','DEP007'),
('USR022',2023,'Chemical Engineering','DEP008'),
('USR023',2023,'Civil Engineering','DEP009'),
('USR024',2023,'Environment and Resources','DEP010'),
('USR025',2023,'Industrial Management','DEP011'),
('USR026',2023,'Transport Engineering','DEP007'),
('USR027',2023,'Chemical Engineering','DEP008'),
('USR028',2023,'Civil Engineering','DEP009'),
('USR029',2023,'Environment and Resources','DEP010'),
('USR030',2023,'Industrial Management','DEP011');

-- 4. Instructors
INSERT INTO Instructor(InstructorID, Degree, Position, DeptID) VALUES
('USR003','PhD','Professor','DEP004'),
('USR004','PhD','Senior Lecturer','DEP005'),
('USR005','PhD','Associate Professor','DEP005'),
('USR006','MSc','Lecturer','DEP003'),
('USR007','MSc','Lecturer','DEP011'),
('USR008','PhD','Lecturer','DEP001'),
('USR009','MSc','Lecturer','DEP002'),
('USR010','PhD','Lecturer','DEP008');

-- 5. Admins
INSERT INTO Admin(AdminID, Role) VALUES
('USR000','System Admin'),
('USR001','System Admin'),
('USR002','Content Admin');

-- User Account
INSERT INTO UserAccount(AccountID, UserID, Email, PasswordHash, Role) VALUES
('ACC001','USR000','sManager@hcmut.edu.vn','BkAdmin@','Admin'),
('ACC002','USR003','lequangminh@hcmut.edu.vn','123456','Instructor'),
('ACC003','USR004','phamhongduc@hcmut.edu.vn','123abc','Instructor'),
('ACC004','USR011','nguyenthilinh@hcmut.edu.vn','linhthi1501','Student'),
('ACC005','USR012','tranvanlong@hcmut.edu.vn','longtranhcmut.','Student'),
('ACC006','USR013','lethihuong@hcmut.edu.vn','huongle123','Student'),
('ACC007','USR014','phamvanhieu@hcmut.edu.vn','hieu3203','Student'),
('ACC008','USR015','hoangvantuan@hcmut.edu.vn','TuanHue2k5.','Student');

-- 6. Courses
INSERT INTO Course(CourseID, Name, Description, Credit, Duration, DeptID) VALUES
('CRS001','Introduction to Programming','Lap trinh co ban C/Python',3,45,'DEP005'),
('CRS002','Data Structures & Algorithms','Cau truc du lieu va giai thuat',4,60,'DEP005'),
('CRS003','Linear Algebra','Dai so tuyen tinh',3,45,'DEP004'),
('CRS004','Principles of Management','Nguyen ly quan tri hoc',3,45,'DEP011'),
('CRS005','English for Engineering','Tieng Anh ky thuat',2,30,'DEP004'),
('CRS006','Thermodynamics','Nhiet dong luc hoc',4,60,'DEP001'),
('CRS007','Material Science','Khoa hoc vat lieu',3,45,'DEP002'),
('CRS008','Circuit Theory','Ly thuyet mach dien',4,60,'DEP003'),
('CRS009','Environmental Chemistry','Hoa hoc moi truong',3,45,'DEP010'),
('CRS010','Structural Analysis','Phan tich ket cau',4,60,'DEP009'),
('CRS011','Transport Planning','Quy hoach giao thong',3,45,'DEP007'),
('CRS012','Organic Chemistry','Hoa hoc huu co',4,60,'DEP008'),
('CRS013','Database Systems','He quan tri co so du lieu',3,45,'DEP005'),
('CRS014','Machine Learning Basics','Nhap mon hoc may',3,45,'DEP005'),
('CRS015','Fluid Mechanics','Co hoc chat long',4,60,'DEP001'),
('CRS016','Project Management','Quan ly du an',3,45,'DEP011'),
('CRS017','Water Resource Engineering','Ky thuat tai nguyen nuoc',3,45,'DEP010'),
('CRS018','Construction Management','Quan ly xay dung',3,45,'DEP009');

-- 7. Modules
INSERT INTO Module(ModuleID, Name, Description, Duration, CourseID) VALUES
('MOD001','Syntax & Variables','Cu phap và bien trong C/Python',10,'CRS001'),
('MOD002','Control Flow & Loops','Cau lenh re nhanh va vong lap',12,'CRS001'),
('MOD003','Functions & OOP','Ham va lap trinh huong doi tuong',15,'CRS001'),
('MOD004','Arrays & Linked Lists','Mang va danh sach lien ket',15,'CRS002'),
('MOD005','Stacks, Queues, Trees','Ngan xep, hang doi, cay',20,'CRS002'),
('MOD006','Graph Algorithms','Thuat toan do thi',15,'CRS002'),
('MOD007','Vector & Matrix','Vector va ma tran',12,'CRS003'),
('MOD008','Eigenvalues','Gia tri rieng va vector rieng',15,'CRS003'),
('MOD009','Leadership Theories','Cac ly thuyet lanh dao',10,'CRS004'),
('MOD010','Team Building','Xay dung doi nhom',12,'CRS004'),
('MOD011','Academic Writing','Viet bao cao hoc thuat',15,'CRS005'),
('MOD012','Presentation Skills','Ky nang thuyet trinh',10,'CRS005'),
('MOD013','Heat & Energy','Nhiet va nang luong',18,'CRS006'),
('MOD014','Material Properties','Tinh chat vat lieu',15,'CRS007'),
('MOD015','Kirchhoff Laws','Dinh luat Kirchhoff',20,'CRS008');

-- 8. Content
INSERT INTO Content(ContentID, Title, Type, URL, Size, UploadDate, CourseID) VALUES
('CNT001','Lecture 01 - Intro to C','Video','https://cdn.hcmut.edu.vn/crs001/lec01.mp4',220.5,'2025-08-05','CRS001'),
('CNT002','Python Installation Guide','Document','https://cdn.hcmut.edu.vn/crs001/python-install.pdf',2.1,'2025-08-03','CRS001'),
('CNT003','Linked List Slides','Slide','https://cdn.hcmut.edu.vn/crs002/linkedlist.pptx',4.8,'2025-08-20','CRS002'),
('CNT004','Matrix Operations Handout','Document','https://cdn.hcmut.edu.vn/crs003/matrix.pdf',1.5,'2025-09-01','CRS003'),
('CNT005','Case Study - VinGroup','Document','https://cdn.hcmut.edu.vn/crs004/vingroup.pdf',3.2,'2025-09-10','CRS004'),
('CNT006','Thermodynamics Formula Sheet','Document','https://cdn.hcmut.edu.vn/crs006/formula.pdf',0.8,'2025-08-15','CRS006'),
('CNT007','Sample Midterm 2024','Document','https://cdn.hcmut.edu.vn/crs002/midterm2024.pdf',1.9,'2025-10-01','CRS002');

-- 9. Assessments
INSERT INTO Assessment(AssessID, Title, Description, Deadline, MaxScore, CourseID) VALUES
('ASG001','Lab 01 - Hello World','Nop file .c hoac .py','2025-09-15',10,'CRS001'),
('ASG002','Assignment 1 - Loops & Arrays','Bai tap mang va vong lap','2025-09-25',20,'CRS001'),
('ASG003','Midterm Exam','Dong kin - 90 phut','2025-10-20',100,'CRS002'),
('ASG004','Final Project - Sorting Visualizer','Nhom 2-3 nguoi','2025-12-10',100,'CRS002'),
('ASG005','Quiz 1 - Vectors','Quiz 15 phut tren lop','2025-09-18',20,'CRS003'),
('ASG006','Group Project - Business Plan','Nhom 4 nguoi','2025-11-20',100,'CRS004'),
('ASG007','IELTS Writing Sample','Bai luan 250 tu','2025-10-30',30,'CRS005');

-- 10. Enrollments
INSERT INTO Enrollment(EnrollID, StudentID, CourseID, Status, Semester, GradeFinal, Schedule, InstructorID) VALUES
('ENR001','USR011','CRS011','Completed','2025S1',8.4,'Mon-Wed 08:00-09:30','USR004'),
('ENR002','USR011','CRS001','Enrolled','2025S1',NULL,'Mon-Wed 10:00-11:30','USR005'),
('ENR003','USR012','CRS012','Enrolled','2025S1',NULL,'Tue-Thu 08:00-10:00','USR003'),
('ENR004','USR012','CRS009','Enrolled','2025S1',NULL,'Fri 13:30-16:30','USR004'),
('ENR005','USR013','CRS010','Enrolled','2025S1',NULL,'Mon-Wed 14:00-16:00','USR006'),
('ENR006','USR014','CRS017','Enrolled','2025S1',NULL,'Tue-Thu 14:00-16:00','USR006'),
('ENR007','USR015','CRS016','Completed','2025S1',7.8,'Fri 08:00-11:00','USR008'),
('ENR008','USR016','CRS011','Enrolled','2025S1',NULL,'Mon 08:00-11:00','USR007'),
('ENR009','USR017','CRS012','Enrolled','2025S1',NULL,'Wed 13:30-16:30','USR004'),
('ENR010','USR018','CRS010','Enrolled','2025S1',NULL,'Tue 10:00-13:00','USR005'),
('ENR011','USR019','CRS017','Enrolled','2025S1',NULL,'Thu 08:00-11:00','USR006'),
('ENR012','USR020','CRS004','Completed','2025S1',9.1,'Fri 14:00-17:00','USR009'),
('ENR013','USR021','CRS001','Enrolled','2025S1',NULL,'Mon-Wed 10:00-11:30','USR010'),
('ENR014','USR022','CRS002','Enrolled','2025S1',NULL,'Tue-Thu 13:30-15:30','USR009'),
('ENR015','USR023','CRS010','Enrolled','2025S1',NULL,'Mon 14:00-17:00','USR009'),
('ENR016','USR026','CRS011','Enrolled','2025S1',NULL,'Wed 08:00-11:00','USR008'),
('ENR017','USR027','CRS012','Enrolled','2025S1',NULL,'Tue 08:00-11:00','USR006'),
('ENR018','USR028','CRS018','Enrolled','2025S1',NULL,'Thu 13:30-16:30','USR006'),
('ENR019','USR029','CRS009','Enrolled','2025S1',NULL,'Fri 10:00-13:00','USR007'),
('ENR020','USR030','CRS016','Enrolled','2025S1',NULL,'Mon 13:30-16:30','USR007'),
('ENR021','USR011','CRS003','Enrolled','2025S1',NULL,'Tue-Thu 09:00-11:00','USR005'),
('ENR022','USR012','CRS005','Enrolled','2025S1',NULL,'Mon 13:00-16:00','USR004'),
('ENR023','USR023','CRS006','Enrolled','2025S1',NULL,'Wed 08:00-11:00','USR003'),
('ENR024','USR024','CRS007','Enrolled','2025S1',NULL,'Fri 09:00-12:00','USR008'),
('ENR025','USR015','CRS008','Completed','2025S1',8.7,'Tue-Thu 14:00-16:00','USR006'),
('ENR026','USR026','CRS013','Enrolled','2025S1',NULL,'Mon-Wed 15:00-17:00','USR009'),
('ENR027','USR017','CRS014','Enrolled','2025S1',NULL,'Thu 10:00-13:00','USR010'),
('ENR028','USR018','CRS015','Enrolled','2025S1',NULL,'Wed 14:00-17:00','USR007'),
('ENR029','USR029','CRS003','Enrolled','2025S1',NULL,'Mon-Wed 09:00-10:30','USR005'),
('ENR030','USR019','CRS014','Enrolled','2025S1',NULL,'Fri 13:00-16:00','USR010');

-- 11. Grades
INSERT INTO Grade(GradeID, StudentID, AssessID, Score, GradeLetter, DateRecorded) VALUES
('GRD001','USR011','ASG002',8.5,'B+','2025-09-26'),
('GRD002','USR012','ASG003',7.8,'B','2025-10-21'),
('GRD003','USR015','ASG006',9.2,'A','2025-11-21'),
('GRD004','USR020','ASG006',8.9,'A-','2025-11-21'),
('GRD005','USR021','ASG001',9.5,'A','2025-09-16'),
('GRD006','USR022','ASG003',6.5,'C+','2025-10-21'),
('GRD007','USR026','ASG002',8.0,'B','2025-09-26'),
('GRD008','USR013','ASG002',8.5,'D+','2025-09-26'),
('GRD009','USR014','ASG003',7.8,'F','2025-10-21'),
('GRD010','USR016','ASG006',9.2,'C-','2025-11-21'),
('GRD011','USR025','ASG006',8.9,'B-','2025-11-21'),
('GRD012','USR018','ASG001',9.5,'B','2025-09-16'),
('GRD013','USR017','ASG003',6.5,'C+','2025-10-21'),
('GRD014','USR029','ASG003',6.5,'D-','2025-10-21'),
('GRD015','USR024','ASG002',8.0,'B+','2025-09-26');

-- 12. Feedback
INSERT INTO Feedback(FeedbackID, Rating, Content, Date, StudentID, InstructorID, CourseID) VALUES
('FDB001',5,'Thay day rat nhiet tinh, vi du thuc te','2025-10-15','USR011','USR004','CRS001'),
('FDB002',4,'Bai tap hoi kho nhung hoc duoc nhieu','2025-10-22','USR022','USR005','CRS002'),
('FDB003',5,'Chi huong dan rat tan tinh','2025-11-20','USR015','USR007','CRS004'),
('FDB004',3,'Can up slide len som hon','2025-09-10','USR013','USR005','CRS010'),
('FDB005',5,'Tieng Anh cai thien ro ret','2025-10-31','USR020','USR008','CRS005');

-- 13. Forum & Forum_User
INSERT INTO Forum(ForumID, Topic, Date) VALUES
('FOR001','Hoi dap CRS001 - Lap trinh co ban','2025-08-10'),
('FOR002','Project nhom CRS002','2025-09-01'),
('FOR003','Hoi bai tap CRS011 - Giao thông','2025-09-15'),
('FOR004','Chia se tai lieu tieng Anh','2025-08-20');

INSERT INTO Forum_User(ForumID, UserID) VALUES
('FOR001','USR011'),('FOR001','USR021'),('FOR001','USR004'),
('FOR002','USR022'),('FOR002','USR005'),
('FOR003','USR016'),('FOR003','USR026'),('FOR003','USR004');

-- 14. Messages
INSERT INTO Message(MessageID, SenderID, ReceiverID, Content, Date, Status) VALUES
('MSG001','USR004','USR011','Em gui file lab 01 muon 1 ngay ạ, em xin loi thay rat nhieu.','2025-09-16 20:15:00','Read'),
('MSG002','USR011','USR004','Da em gui roi a, cam on thay!','2025-09-16 20:30:00','Read'),
('MSG003','USR005','USR022','Nhom em chua co y tuong project, mong thay goi y giup.','2025-11-01 09:10:00','Unread'),
('MSG004','USR015','USR011','Toi nay 22h-24h se co mot bai kiem tra.','2025-11-20 17:00:00','Read'),
('MSG005','USR020','USR025','Moi ban tham gia vao nhom btl, lien he minh qua sdt.','2025-11-20 17:00:00','Read');

-- 15. Notifications
INSERT INTO Notification(NotifID, Type, Content, Date, Status, UserID) VALUES
('NTF001','Grade','Diem Lab 01 da duoc cham','2025-09-27 10:00:00','Seen','USR011'),
('NTF002','Deadline','Con 3 ngay de nop Final Project CRS002','2025-12-07 08:00:00','Unseen','USR022'),
('NTF003','Announcement','Lich thi hoc ky se cong bo vao 2025-12-10','2025-12-01 09:00:00','Unseen','USR011'),
('NTF004','System','He thong se bao tri vao 23/11/2025 tu 22h','2025-11-20 17:00:00','Seen','USR001');

-- 16. Announcements
INSERT INTO Announcement(AnnounceID, Title, Content, Date, AdminID) VALUES
('ANC001','Dang ky hoc ky 2025S2','Mo dang ky từ 10-20/12/2025','2025-11-25','USR001'),
('ANC002','Hoc bong Belarus 2026','Nop ho so truoc 31/12/2025','2025-11-15','USR002'),
('ANC003','Lich nghi Tet 2026','Tu 25/01 - 05/02/2026','2025-12-20','USR001'),
('ANC004','Khai giang AI Lab moi','Tang 3 toa H6, mo cua tu 5h den 20h','2025-09-05','USR002');

-- 17. StudentStatus
INSERT INTO StudentStatus(StatusID, Type, EffectiveDate, StudentID) VALUES
('STS001','Active','2023-09-01','USR011'),
('STS002','Active','2023-09-01','USR012'),
('STS003','Active','2023-09-01','USR013'),
('STS004','Active','2023-09-01','USR014'),
('STS005','Active','2023-09-01','USR015'),
('STS006','Suspended','2025-10-01','USR022'),
('STS007','Active','2023-09-01','USR030');

-- //////////////////////////////////////////////////
-- Create Function
-- 1. Hàm tính điểm trung bình môn học của sinh viên (có tham số)
DELIMITER $$
CREATE FUNCTION GetStudentGPA(
    p_StudentID CHAR(8),
    p_Semester VARCHAR(10)
) RETURNS DECIMAL(4,2)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_GPA DECIMAL(4,2) DEFAULT 0.0;
    
    SELECT COALESCE(AVG(e.GradeFinal), 0.0) INTO v_GPA
    FROM Enrollment e
    WHERE e.StudentID = p_StudentID
      AND e.Semester = p_Semester
      AND e.GradeFinal IS NOT NULL;
    
    RETURN v_GPA;
END$$
DELIMITER ;

-- 2. Hàm trả về xếp loại học lực theo điểm trung bình
DELIMITER $$
CREATE FUNCTION GetAcademicRanking(p_GPA DECIMAL(4,2)) RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    IF p_GPA >= 9.0 THEN RETURN 'Xuat sac';
    ELSEIF p_GPA >= 8.0 THEN RETURN 'Gioi';
    ELSEIF p_GPA >= 7.0 THEN RETURN 'Kha';
    ELSEIF p_GPA >= 5.5 THEN RETURN 'Trung binh';
    ELSEIF p_GPA >= 4.0 THEN RETURN 'Yeu';
    ELSE RETURN 'Kem';
    END IF;
END$$
DELIMITER ;

-- 3. Hàm đếm số môn đang học của sinh viên
DELIMITER $$
CREATE FUNCTION CountEnrolledCourses(p_StudentID CHAR(8)) RETURNS INT
READS SQL DATA
BEGIN
    DECLARE total INT;
    SELECT COUNT(*) INTO total
    FROM Enrollment
    WHERE StudentID = p_StudentID AND Status = 'Enrolled';
    RETURN total;
END$$
DELIMITER ;

-- 4. Hàm tính tổng tín chỉ đã hoàn thành (có GradeFinal)
DELIMITER $$
CREATE FUNCTION GetCompletedCredits(p_StudentID CHAR(8)) RETURNS INT
READS SQL DATA
BEGIN
    DECLARE total_credits INT DEFAULT 0;
    SELECT COALESCE(SUM(c.Credit), 0) INTO total_credits
    FROM Enrollment e
    JOIN Course c ON e.CourseID = c.CourseID
    WHERE e.StudentID = p_StudentID 
      AND e.Status = 'Completed' 
      AND e.GradeFinal IS NOT NULL;
    RETURN total_credits;
END$$
DELIMITER ;

-- 5. Hàm kiểm tra sinh viên có bị cảnh cáo học vụ không (dưới 4.0)
DELIMITER $$
CREATE FUNCTION IsAcademicWarning(p_StudentID CHAR(8), p_Semester VARCHAR(10)) RETURNS BOOLEAN
READS SQL DATA
BEGIN
    DECLARE gpa DECIMAL(4,2);
    SET gpa = GetStudentGPA(p_StudentID, p_Semester);
    RETURN (gpa < 4.0);
END$$
DELIMITER ;

-- 6. Hàm trả về tên đầy đủ của User
DELIMITER $$
CREATE FUNCTION GetFullName(p_UserID CHAR(8)) RETURNS VARCHAR(100)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE full_name VARCHAR(100);
    SELECT CONCAT(FirstName, ' ', LastName) INTO full_name
    FROM `User` WHERE UserID = p_UserID;
    RETURN COALESCE(full_name, 'Khong tim thay');
END$$
DELIMITER ;

-- //////////////////////////////////////////////////
-- Creat Procedure
-- 1. Thủ tục lấy danh sách sinh viên theo khoa + xếp loại GPA
DELIMITER $$
CREATE PROCEDURE GetStudentsByDepartment(
    IN p_DeptID CHAR(6),
    IN p_Semester VARCHAR(10)
)
BEGIN
    SELECT 
        s.StudentID,
        GetFullName(s.StudentID) AS FullName,
        st.Major,
        GetStudentGPA(s.StudentID, p_Semester) AS GPA,
        GetAcademicRanking(GetStudentGPA(s.StudentID, p_Semester)) AS Ranking
    FROM Student st
    JOIN `User` u ON st.StudentID = u.UserID
    WHERE st.DeptID = p_DeptID
    ORDER BY GPA DESC;
END$$
DELIMITER ;

-- 2. Thủ tục thêm mới sinh viên + tự động tạo Student record
DELIMITER $$
CREATE PROCEDURE AddNewStudent(
    IN p_UserID CHAR(8),
    IN p_FirstName VARCHAR(50),
    IN p_LastName VARCHAR(50),
    IN p_Email VARCHAR(100),
    IN p_Phone VARCHAR(20),
    IN p_DoB DATE,
    IN p_DeptID CHAR(6),
    IN p_Major VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    INSERT INTO `User`(UserID, FirstName, LastName, Email, Phone, DoB, Age, Address)
    VALUES (p_UserID, p_FirstName, p_LastName, p_Email, p_Phone, p_DoB,
            YEAR(CURDATE()) - YEAR(p_DoB), 'HCMC, Vietnam');
    
    INSERT INTO Student(StudentID, EnrollmentYear, Major, DeptID)
    VALUES (p_UserID, YEAR(CURDATE()), p_Major, p_DeptID);
    
    INSERT INTO StudentStatus(StatusID, Type, EffectiveDate, StudentID)
    VALUES (CONCAT('STS', LPAD((SUBSTRING_INDEX((SELECT MAX(StatusID) FROM StudentStatus), 'S', -1) + 1), 3, '0')), 'Active', CURDATE(), p_UserID);
    
    COMMIT;
END$$
DELIMITER ;

-- 3. Thủ tục tính thống kê điểm trung bình môn học theo giảng viên
DELIMITER $$
CREATE PROCEDURE GetInstructorCourseStats(IN p_InstructorID CHAR(8))
BEGIN
    SELECT 
        c.CourseID,
        c.Name,
        COUNT(e.StudentID) AS TotalStudents,
        AVG(e.GradeFinal) AS AvgGrade,
        MAX(e.GradeFinal) AS Highest,
        MIN(e.GradeFinal) AS Lowest
    FROM Course c
    LEFT JOIN Enrollment e ON c.CourseID = e.CourseID AND e.Status = 'Completed'
    WHERE c.InstructorID = p_InstructorID
    GROUP BY c.CourseID, c.Name
    HAVING COUNT(e.StudentID) > 0
    ORDER BY AvgGrade DESC;
END$$
DELIMITER ;

-- 4. Thủ tục gửi thông báo tự động cho sinh viên sắp tới hạn nộp bài
DELIMITER $$
CREATE PROCEDURE SendDeadlineReminders()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE v_StudentID CHAR(8);
    DECLARE v_CourseName VARCHAR(100);
    DECLARE v_Title VARCHAR(150);
    DECLARE v_Deadline DATE;
    
    DECLARE cur CURSOR FOR
        SELECT e.StudentID, c.Name, a.Title, a.Deadline
        FROM Assessment a
        JOIN Course c ON a.CourseID = c.CourseID
        JOIN Enrollment e ON c.CourseID = e.CourseID
        WHERE a.Deadline BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY)
          AND e.Status = 'Enrolled';
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_StudentID, v_CourseName, v_Title, v_Deadline;
        IF done THEN LEAVE read_loop; END IF;
        
        INSERT INTO Notification(NotifID, Type, Content, UserID)
        VALUES (
            CONCAT('NTF', LPAD((SELECT COUNT(*)+1 FROM Notification), 5, '0')),
            'Deadline',
            CONCAT('Nhac nho: Bai "', v_Title, '" môn ', v_CourseName, ' sap den han: ', DATE_FORMAT(v_Deadline, '%d/%m/%Y')),
            v_StudentID
        );
    END LOOP;
    CLOSE cur;
END$$
DELIMITER ;

-- 5. Thủ tục xuất báo cáo sinh viên có nguy cơ cảnh cáo học vụ
DELIMITER $$
CREATE PROCEDURE GetWarningStudents(IN p_Semester VARCHAR(10))
BEGIN
    SELECT 
        s.StudentID,
        GetFullName(s.StudentID) AS HoTen,
        st.Major,
        GetStudentGPA(s.StudentID, p_Semester) AS GPA,
        'Canh cao hoc vu' AS TrangThai
    FROM Student st
    JOIN Enrollment e ON st.StudentID = e.StudentID
    WHERE e.Semester = p_Semester
      AND IsAcademicWarning(st.StudentID, p_Semester) = TRUE
    GROUP BY s.StudentID;
END$$
DELIMITER ;

-- 6. Thủ tục cập nhật GradeLetter tự động khi nhập Score
DELIMITER $$
CREATE PROCEDURE UpdateGradeLetter(IN p_GradeID CHAR(8))
BEGIN
    UPDATE Grade
    SET GradeLetter = CASE
        WHEN Score >= 9.5 THEN 'A+'
        WHEN Score >= 9.0 THEN 'A'
        WHEN Score >= 8.5 THEN 'A-'
        WHEN Score >= 8.0 THEN 'B+'
        WHEN Score >= 7.0 THEN 'B'
        WHEN Score >= 6.5 THEN 'B-'
        WHEN Score >= 6.0 THEN 'C+'
        WHEN Score >= 5.5 THEN 'C'
        WHEN Score >= 5.0 THEN 'C-'
        WHEN Score >= 4.5 THEN 'D+'
        WHEN Score >= 4.0 THEN 'D'
        ELSE 'F'
    END
    WHERE GradeID = p_GradeID;
END$$
DELIMITER ;

-- //////////////////////////////////////////////////
-- Create Trigger
-- 0. auto-generate ID if not provided
DELIMITER $$
CREATE TRIGGER trg_user_before_insert
BEFORE INSERT ON `User`
FOR EACH ROW
BEGIN
	DECLARE next_id INT;
    IF NEW.UserID IS NULL OR NEW.UserID = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(UserID,4) AS UNSIGNED)),0)+1 INTO next_id FROM `User`;
        SET NEW.UserID = CONCAT('USR', LPAD(next_id,3,'0'));
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_dept_before_insert
BEFORE INSERT ON Department
FOR EACH ROW
BEGIN
	DECLARE next_id INT;
    IF NEW.DeptID IS NULL OR NEW.DeptID = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(DeptID,4) AS UNSIGNED)),0)+1 INTO next_id FROM Department;
        SET NEW.DeptID = CONCAT('DEP', LPAD(next_id,3,'0'));
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_course_before_insert
BEFORE INSERT ON Course
FOR EACH ROW
BEGIN
	DECLARE next_id INT;
    IF NEW.CourseID IS NULL OR NEW.CourseID = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(CourseID,4) AS UNSIGNED)),0)+1 INTO next_id FROM Course;
        SET NEW.CourseID = CONCAT('CRS', LPAD(next_id,3,'0'));
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_module_before_insert
BEFORE INSERT ON Module
FOR EACH ROW
BEGIN
	DECLARE next_id INT;
    IF NEW.ModuleID IS NULL OR NEW.ModuleID = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(ModuleID,4) AS UNSIGNED)),0)+1 INTO next_id FROM Module;
        SET NEW.ModuleID = CONCAT('MOD', LPAD(next_id,3,'0'));
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_content_before_insert
BEFORE INSERT ON Content
FOR EACH ROW
BEGIN
	DECLARE next_id INT;
    IF NEW.ContentID IS NULL OR NEW.ContentID = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(ContentID,4) AS UNSIGNED)),0)+1 INTO next_id FROM Content;
        SET NEW.ContentID = CONCAT('CNT', LPAD(next_id,3,'0'));
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_enroll_before_insert
BEFORE INSERT ON Enrollment
FOR EACH ROW
BEGIN
	DECLARE next_id INT;
    IF NEW.EnrollID IS NULL OR NEW.EnrollID = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(EnrollID,4) AS UNSIGNED)),0)+1 INTO next_id FROM Enrollment;
        SET NEW.EnrollID = CONCAT('ENR', LPAD(next_id,3,'0'));
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_assess_before_insert
BEFORE INSERT ON Assessment
FOR EACH ROW
BEGIN
	DECLARE next_id INT;
    IF NEW.AssessID IS NULL OR NEW.AssessID = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(AssessID,4) AS UNSIGNED)),0)+1 INTO next_id FROM Assessment;
        SET NEW.AssessID = CONCAT('ASG', LPAD(next_id,3,'0'));
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_grade_before_insert
BEFORE INSERT ON Grade
FOR EACH ROW
BEGIN
	DECLARE next_id INT;
    IF NEW.GradeID IS NULL OR NEW.GradeID = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(GradeID,4) AS UNSIGNED)),0)+1 INTO next_id FROM Grade;
        SET NEW.GradeID = CONCAT('GRD', LPAD(next_id,3,'0'));
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_feedback_before_insert
BEFORE INSERT ON Feedback
FOR EACH ROW
BEGIN
	DECLARE next_id INT;
    IF NEW.FeedbackID IS NULL OR NEW.FeedbackID = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(FeedbackID,4) AS UNSIGNED)),0)+1 INTO next_id FROM Feedback;
        SET NEW.FeedbackID = CONCAT('FDB', LPAD(next_id,3,'0'));
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_forum_before_insert
BEFORE INSERT ON Forum
FOR EACH ROW
BEGIN
	DECLARE next_id INT;
    IF NEW.ForumID IS NULL OR NEW.ForumID = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(ForumID,4) AS UNSIGNED)),0)+1 INTO next_id FROM Forum;
        SET NEW.ForumID = CONCAT('FOR', LPAD(next_id,3,'0'));
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_message_before_insert
BEFORE INSERT ON Message
FOR EACH ROW
BEGIN
	DECLARE next_id INT;
    IF NEW.MessageID IS NULL OR NEW.MessageID = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(MessageID,4) AS UNSIGNED)),0)+1 INTO next_id FROM Message;
        SET NEW.MessageID = CONCAT('MSG', LPAD(next_id,3,'0'));
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_notif_before_insert
BEFORE INSERT ON Notification
FOR EACH ROW
BEGIN
	DECLARE next_id INT;
    IF NEW.NotifID IS NULL OR NEW.NotifID = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(NotifID,4) AS UNSIGNED)),0)+1 INTO next_id FROM Notification;
        SET NEW.NotifID = CONCAT('NTF', LPAD(next_id,3,'0'));
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_announce_before_insert
BEFORE INSERT ON Announcement
FOR EACH ROW
BEGIN
	DECLARE next_id INT;
    IF NEW.AnnounceID IS NULL OR NEW.AnnounceID = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(AnnounceID,4) AS UNSIGNED)),0)+1 INTO next_id FROM Announcement;
        SET NEW.AnnounceID = CONCAT('ANC', LPAD(next_id,3,'0'));
    END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER trg_status_before_insert
BEFORE INSERT ON StudentStatus
FOR EACH ROW
BEGIN
	DECLARE next_id INT;
    IF NEW.StatusID IS NULL OR NEW.StatusID = '' THEN
        SELECT IFNULL(MAX(CAST(SUBSTRING(StatusID,4) AS UNSIGNED)),0)+1 INTO next_id FROM StudentStatus;
        SET NEW.StatusID = CONCAT('STS', LPAD(next_id,3,'0'));
    END IF;
END$$
DELIMITER ;

-- 1. Tự động cập nhật Age khi cập nhật DoB
DELIMITER $$
CREATE TRIGGER trg_update_age
BEFORE UPDATE ON `User`
FOR EACH ROW
BEGIN
    IF NEW.DoB != OLD.DoB THEN
        SET NEW.Age = TIMESTAMPDIFF(YEAR, NEW.DoB, CURDATE());
    END IF;
END$$
DELIMITER ;

-- 2. Tự động sinh GradeLetter khi INSERT Grade mới
DELIMITER $$
CREATE TRIGGER trg_insert_grade_letter
BEFORE INSERT ON Grade
FOR EACH ROW
BEGIN
    SET NEW.GradeLetter = CASE
        WHEN NEW.Score >= 9.5 THEN 'A+'
        WHEN NEW.Score >= 9.0 THEN 'A'
        WHEN NEW.Score >= 8.5 THEN 'A-'
        WHEN NEW.Score >= 8.0 THEN 'B+'
        WHEN NEW.Score >= 7.0 THEN 'B'
        WHEN NEW.Score >= 6.5 THEN 'B-'
        WHEN NEW.Score >= 6.0 THEN 'C+'
        WHEN NEW.Score >= 5.5 THEN 'C'
        WHEN NEW.Score >= 5.0 THEN 'C-'
        WHEN NEW.Score >= 4.5 THEN 'D+'
        WHEN NEW.Score >= 4.0 THEN 'D'
        ELSE 'F'
    END;
END$$
DELIMITER ;

-- 3. Tự động cập nhật GradeLetter khi UPDATE Score
DELIMITER $$
CREATE TRIGGER trg_update_grade_letter
BEFORE UPDATE ON Grade
FOR EACH ROW
BEGIN
    IF NEW.Score != OLD.Score OR NEW.Score IS NOT NULL THEN
        SET NEW.GradeLetter = CASE
            WHEN NEW.Score >= 9.5 THEN 'A+'
            WHEN NEW.Score >= 9.0 THEN 'A'
            WHEN NEW.Score >= 8.5 THEN 'A-'
            WHEN NEW.Score >= 8.0 THEN 'B+'
            WHEN NEW.Score >= 7.0 THEN 'B'
            WHEN NEW.Score >= 6.5 THEN 'B-'
            WHEN NEW.Score >= 6.0 THEN 'C+'
            WHEN NEW.Score >= 5.5 THEN 'C'
            WHEN NEW.Score >= 5.0 THEN 'C-'
            WHEN NEW.Score >= 4.5 THEN 'D+'
            WHEN NEW.Score >= 4.0 THEN 'D'
            ELSE 'F'
        END;
    END IF;
END$$
DELIMITER ;

-- 4. Kiểm tra: Không cho sinh viên ghi danh quá 30 tín chỉ/học kỳ
DELIMITER $$
CREATE TRIGGER trg_check_credit_limit
BEFORE INSERT ON Enrollment
FOR EACH ROW
BEGIN
    DECLARE total_credits INT;
    SELECT COALESCE(SUM(c.Credit), 0) INTO total_credits
    FROM Enrollment e
    JOIN Course c ON e.CourseID = c.CourseID
    WHERE e.StudentID = NEW.StudentID
      AND e.Semester = NEW.Semester;
    
    SET total_credits = total_credits + (SELECT Credit FROM Course WHERE CourseID = NEW.CourseID);
    
    IF total_credits > 30 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Sinh vien khong duoc dang ky qua 30 tin chi trong mot hoc ky!';
    END IF;
END$$
DELIMITER ;

-- 5. Tự động gửi thông báo khi có điểm mới
DELIMITER $$
CREATE TRIGGER trg_notify_new_grade
AFTER INSERT ON Grade
FOR EACH ROW
BEGIN
    INSERT INTO Notification(NotifID, Type, Content, UserID)
    VALUES (
        CONCAT('NTF', LPAD((SELECT COUNT(*)+1 FROM Notification), 5, '0')),
        'Grade',
        CONCAT('Ban da co diem moi: ', NEW.Score, '/10'),
        NEW.StudentID
    );
END$$
DELIMITER ;

-- 6. Không cho xóa Course nếu đã có sinh viên ghi danh
DELIMITER $$
CREATE TRIGGER trg_prevent_delete_course
BEFORE DELETE ON Course
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM Enrollment WHERE CourseID = OLD.CourseID) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Khong the xoa mon hoc da co sinh vien ghi danh!';
    END IF;
END$$
DELIMITER ;
-- //////////////////////////////////////////////////
-- Checking
-- SELECT COUNT(*) AS DeptCount FROM Department;
-- SELECT COUNT(*) AS UserCount FROM User;
-- SELECT COUNT(*) AS CourseCount FROM Course;
