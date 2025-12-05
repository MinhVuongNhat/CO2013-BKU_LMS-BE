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

Sau khi server chạy:

```bash
curl http://localhost:3000
```

Hoặc mở Swagger (nếu team bổ sung sau):

```
http://localhost:3000/api
```

---

## Danh sách API
# 🔐 **1. Auth / User**

> Module: `users`

### ▶ **Get all users**

`GET /users`

### ▶ **Get user by ID**

`GET /users/:id`
**Params:** `id = UserID`

### ▶ **Create user**

`POST /users`
**Body:**

```json
{
  "UserID": "USR001",
  "Fullname": "Minh",
  "Role": "Student",
  "Email": "abc@gmail.com",
  "Phone": "0123456789",
  "Address": "HN"
}
```

### ▶ **Update user**

`PATCH /users/:id`

### ▶ **Delete user**

`DELETE /users/:id`

---

# 📘 **2. Course**

> Module: `courses`

### ▶ **Get all courses**

`GET /courses`

### ▶ **Get course by ID**

`GET /courses/:id`

### ▶ **Create course**

`POST /courses`

### ▶ **Update course**

`PATCH /courses/:id`

### ▶ **Delete course**

`DELETE /courses/:id`

---

# 🏫 **3. Class**

> Module: `classes`

### ▶ **Get all classes**

`GET /classes`

### ▶ **Get class by ID**

`GET /classes/:id`

### ▶ **Create class**

`POST /classes`

### ▶ **Update class**

`PATCH /classes/:id`

### ▶ **Delete class**

`DELETE /classes/:id`

---

# 🧪 **4. Assessment (Kiểm tra, bài thi)**

> Module: `assessments`

### ▶ **Get all assessments**

`GET /assessments`

### ▶ **Get assessment by ID**

`GET /assessments/:id`

### ▶ **Create assessment**

`POST /assessments`

### ▶ **Update assessment**

`PATCH /assessments/:id`

### ▶ **Delete assessment**

`DELETE /assessments/:id`

---

# 📝 **5. Grades (Điểm)**

> Module: `grades`

### ▶ **Get all grades**

`GET /grades`

### ▶ **Get grade by ID**

`GET /grades/:id`

### ▶ **Get all grades of a student**

`GET /grades/student/:studentId`

### ▶ **Create grade**

`POST /grades`

### ▶ **Update grade**

`PATCH /grades/:id`

### ▶ **Delete grade**

`DELETE /grades/:id`

---

# 📅 **6. Attendance (Điểm danh)**

> Module: `attendance`

### ▶ **Get all attendance records**

`GET /attendance`

### ▶ **Get attendance by ID**

`GET /attendance/:id`

### ▶ **Get attendance of a student**

`GET /attendance/student/:studentId`

### ▶ **Create attendance record**

`POST /attendance`

### ▶ **Update attendance**

`PATCH /attendance/:id`

### ▶ **Delete attendance**

`DELETE /attendance/:id`

---

# 📣 **7. Notifications**

> Module: `notifications`

### ▶ **Get all notifications**

`GET /notifications`

### ▶ **Get notification by ID**

`GET /notifications/:id`

### ▶ **Get notifications of a user**

`GET /notifications/user/:userId`

### ▶ **Create notification**

`POST /notifications`

### ▶ **Update notification**

`PATCH /notifications/:id`

### ▶ **Delete notification**

`DELETE /notifications/:id`

---

# 🎯 Tóm tắt theo bảng

| Module        | API                                                     |
| ------------- | ------------------------------------------------------- |
| Users         | GET all, GET by ID, POST, PATCH, DELETE                 |
| Courses       | GET all, GET by ID, POST, PATCH, DELETE                 |
| Classes       | GET all, GET by ID, POST, PATCH, DELETE                 |
| Assessments   | GET all, GET by ID, POST, PATCH, DELETE                 |
| Grades        | GET all, GET by ID, GET by student, POST, PATCH, DELETE |
| Attendance    | GET all, GET by ID, GET by student, POST, PATCH, DELETE |
| Notifications | GET all, GET by ID, GET by user, POST, PATCH, DELETE    |

