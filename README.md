# 📘 BKU LMS Backend – Documentation
Backend của hệ thống **BKU Learning Management System (LMS)** được phát triển bằng **NestJS** và sử dụng **MySQL** làm cơ sở dữ liệu.
Dự án tuân theo kiến trúc module hoá, dễ mở rộng, có tích hợp kiểm thử kết nối DB và sử dụng JWT cho xác thực.
Lưu ý BE: Còn thiếu Gọi hàm/thủ tục: Triển khai một tính năng có gọi đến hàm hoặc thủ tục lưu trữ (ví dụ: tính doanh thu hàng tháng).
---

## ✨ 1. Yêu cầu hệ thống

Bạn cần chuẩn bị:

| Công cụ      | Phiên bản khuyến nghị  |
| ------------ | ---------------------- |
| **Node.js**  | v18+                   |
| **npm**      | v8+                    |
| **MySQL**    | v8.0+                  |
| **Git**      | bất kỳ                 |
| **Nest CLI** | `npm i -g @nestjs/cli` |

---

## 📦 2. Cài đặt dự án

Clone repository:

```bash
git clone https://github.com/MinhVuongNhat/CO2013-BKU_LMS-BE
cd lms-backend
```

Cài dependencies:

```bash
npm install
```

---

## 🔧 3. Thiết lập môi trường (.env)

Tạo file `.env` trong thư mục gốc:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_pass_here
DB_NAME=lms
JWT_SECRET=your_secret
JWT_EXPIRES=1d
PORT=3000
```

## 🗄 4. Chuẩn bị Database

Trong MySQL, tạo database:

```sql
CREATE DATABASE lms;
USE lms;
```


## ▶️ 5. Chạy Backend

### Chế độ development:

```bash
npm run start:dev
```

### Chế độ production:

```bash
npm run build
npm run start:prod
```

### Kiểm tra kết nối Database:

Ngay khi server chạy, console log sẽ hiển thị:

```
Successfully connected to MySQL
```

Nếu sai thông tin .env, bạn sẽ thấy lỗi kết nối.

---

## 🌐 6. Cách gọi API

### Dùng Postman / Thunder Client / curl

Ví dụ: lấy danh sách sinh viên

```
GET http://localhost:3000/students
```

Lấy điểm theo StudentID:

```
GET http://localhost:3000/grades/student/USR021
```

Tạo User mới:

```
POST http://localhost:3000/users
Content-Type: application/json

{
  "UserID": "USR100",
  "FirstName": "Minh",
  "LastName": "Nguyen",
  "Email": "abc@example.com",
  "Phone": "0123456789",
  "DoB": "2003-03-02"
}
```

Các API tuân theo chuẩn RESTful.

---

## 📁 7. Cấu trúc thư mục chuẩn

```
lms-backend/
├── package.json
├── tsconfig.json
├── nest-cli.json
├── .env
├── .env.example
├── .gitignore
├── README.md
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   ├── common/
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts
│   │   ├── guards/
│   │   │   └── roles.guard.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   └── interfaces/
│   │       └── user.interface.ts
│   ├── courses/
│   │   ├── course.controller.ts
│   │   ├── course.module.ts
│   │   ├── course.service.ts
│   │   ├── dto/
│   │   │   ├── create-course.dto.ts
│   │   │   └── update-course.dto.ts
│   │   └── entities/
│   │       └── course.entity.ts
│   ├── students/
│   │   ├── student.controller.ts
│   │   ├── student.module.ts
│   │   ├── student.service.ts
│   │   ├── dto/
│   │   │   ├── create-student.dto.ts
│   │   │   └── update-student.dto.ts
│   │   └── entities/
│   │       └── student.entity.ts
│   ├── grades/
│   │   ├── grade.controller.ts
│   │   ├── grade.module.ts
│   │   ├── grade.service.ts
│   │   ├── dto/
│   │   │   ├── create-grade.dto.ts
│   │   │   └── update-grade.dto.ts
│   │   └── entities/
│   │       └── grade.entity.ts
│   ├── notifications/
│   │   ├── notification.controller.ts
│   │   ├── notification.module.ts
│   │   ├── notification.service.ts
│   │   └── entities/
│   │       └── notification.entity.ts
│   ├── database/
│   │   ├── database.module.ts
│   │   ├── migrations/
│   │   └── seeds/
│   │       └── lms-seed.sql
│   └── test/
│       └── app.e2e-spec.ts
└── dist/ (generated)
```

---

## 🔐 8. Authentication – Hướng dẫn nhanh

Login:

```
POST /auth/login
{
  "email": "example@bku.edu.vn",
  "password": "123456"
}
```

Response:

```json
{
  "access_token": "..."
}
```

Gửi request có bảo vệ:

```
Authorization: Bearer <token>
```

---

## 🛠 9. Hướng dẫn phát triển cho team

### Quy tắc code:

* Tách **Controller – Service – DTO – Module**.
* Không viết SQL trong Controller.
* Sử dụng DTO cho mọi đầu vào.
* Validate dữ liệu đầu vào bằng `class-validator`.
* Viết log trên server bằng `Logger`.

### Branch workflow:

* `main`: Production
* `develop`: Development
* **Feature branches:**

  * `feature/grades-api`
  * `feature/auth`
* **Naming commit chuẩn:**

```
feat: thêm API tạo grade
fix: sửa lỗi kết nối DB
refactor: tối ưu logic service
chore: update package
```

---

## 🧪 10. Kiểm thử API nhanh

### Gọi API bằng VSCode REST Client Extension
#### Bước 1: Cài extension "REST Client"
#### Bước 2: Tạo file requests.http
GET http://localhost:3000/
Nhấn "Send Request".

### Hoặc gọi API bằng curl trong Terminal
curl http://localhost:3000/

---

## Danh sách API
### 🔐 Auth / Users Module
| API                   | Mô tả                            |
| --------------------- | -------------------------------- |
| GET /users            | Lấy danh sách tất cả người dùng  |
| GET /users/:id        | Lấy thông tin người dùng theo ID |
| POST /users           | Tạo người dùng mới               |
| PATCH /users/:id      | Cập nhật thông tin người dùng    |
| DELETE /users/:id     | Xóa người dùng                   |

### 📘 Courses Module
| API                     | Mô tả                          |
| ----------------------- | ------------------------------ |
| GET /courses            | Lấy danh sách tất cả khóa học  |
| GET /courses/:id        | Lấy thông tin khóa học theo ID |
| POST /courses           | Tạo khóa học mới               |
| PATCH /courses/:id      | Cập nhật khóa học              |
| DELETE /courses/:id     | Xóa khóa học                   |

### 🏫 Classes Module
| API                     | Mô tả                         |
| ----------------------- | ----------------------------- |
| GET /classes            | Lấy danh sách tất cả lớp học  |
| GET /classes/:id        | Lấy thông tin lớp học theo ID |
| POST /classes           | Tạo lớp học mới               |
| PATCH /classes/:id      | Cập nhật lớp học              |
| DELETE /classes/:id     | Xóa lớp học                   |

### 🧪 Assessments Module
| API                         | Mô tả                      |
| --------------------------- | -------------------------- |
| GET /assessments            | Lấy danh sách bài kiểm tra |
| GET /assessments/:id        | Lấy bài kiểm tra theo ID   |
| POST /assessments           | Tạo bài kiểm tra mới       |
| PATCH /assessments/:id      | Cập nhật bài kiểm tra      |
| DELETE /assessments/:id     | Xóa bài kiểm tra           |

### 📝 Grades Module
| API                                | Mô tả                             |
| ---------------------------------- | --------------------------------- |
| GET /grades                        | Lấy danh sách điểm                |
| GET /grades/:id                    | Lấy điểm theo ID                  |
| GET /grades/student/:studentId     | Lấy toàn bộ điểm của một học sinh |
| POST /grades                       | Tạo điểm mới                      |
| PATCH /grades/:id                  | Cập nhật điểm                     |
| DELETE /grades/:id                 | Xóa điểm                          |

### 🔔 Notifications Module
| API                                 | Mô tả                        |
| ----------------------------------- | ---------------------------- |
| GET /notifications                  | Lấy danh sách thông báo      |
| GET /notifications/:id              | Lấy thông báo theo ID        |
| GET /notifications/user/:userId     | Lấy thông báo của người dùng |
| POST /notifications                 | Tạo thông báo                |
| PATCH /notifications/:id            | Cập nhật thông báo           |
| DELETE /notifications/:id           | Xóa thông báo                |


### 🚀 Reports Module
| API                                           | Mô tả                                      |
| --------------------------------------------- | ------------------------------------------ |
| GET /reports/gpa/:studentId/:semester         | Tính GPA + xếp loại (FUNCTION)             |
| GET /reports/credits/:studentId               | Lấy tổng tín chỉ hoàn thành (FUNCTION)     |
| GET /reports/department/:deptId/:semester     | Danh sách sinh viên theo khoa (PROCEDURE)  |
| GET /reports/instructor/:instructorId         | Thống kê lớp giảng viên (PROCEDURE)        |
| GET /reports/warnings/:semester               | Sinh viên cảnh cáo học vụ (PROCEDURE)      |
| GET /reports/notifications/deadlines/send     | Gửi tự động thông báo deadline (PROCEDURE) |
