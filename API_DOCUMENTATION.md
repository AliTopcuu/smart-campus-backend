# API Documentation (Part 1)

**Base URL:** `http://localhost:5000/api/v1`

## Authentication Endpoints

### POST `/auth/register`
Kullanıcı kaydı oluşturur.

**Request Body:**
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string",
  "role": "student" | "faculty" | "admin",
  "department": "string (optional, required for student/faculty)",
  "studentNumber": "string (optional, required for student)",
  "termsAccepted": boolean
}
```

**Response:** `201 Created`
```json
{
  "message": "Registration successful. Check your email to verify your account.",
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "phone": null,
    "avatarUrl": null,
    "studentNumber": "S123456",
    "department": "Computer Science"
  }
}
```

**Validation Rules:**
- `fullName`: Minimum 3 karakter
- `email`: Geçerli email formatı, unique
- `password`: Minimum 8 karakter, en az 1 büyük harf, en az 1 rakam
- `confirmPassword`: `password` ile eşleşmeli
- `role`: "student", "faculty" veya "admin"
- `termsAccepted`: true olmalı

**Error Responses:**
- `400`: Validation hatası
- `400`: Email zaten kullanılıyor

### POST `/auth/verify-email`
Email doğrulama token'ı ile hesabı aktifleştirir.

**Request Body:**
```json
{
  "token": "string"
}
```

**Response:** `200 OK`
```json
{
  "message": "Email verified"
}
```

**Error Responses:**
- `400`: Geçersiz token
- `400`: Token süresi dolmuş

### POST `/auth/login`
Kullanıcı girişi yapar.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "rememberMe": boolean (optional)
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "phone": null,
    "avatarUrl": null,
    "studentNumber": "S123456",
    "department": "Computer Science"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `401`: Geçersiz email/şifre
- `401`: Email doğrulanmamış hesap

**Token Süreleri:**
- Access Token: 15 dakika
- Refresh Token: 7 gün
- Remember Me: Token'lar localStorage'da saklanır (aksi halde sessionStorage)

### POST `/auth/refresh`
Access token'ı yeniler.

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401`: Geçersiz refresh token
- `401`: Refresh token süresi dolmuş veya iptal edilmiş

### POST `/auth/logout`
Kullanıcı çıkışı yapar.

**Request Body (optional):**
```json
{
  "refreshToken": "string"
}
```

**Response:** `204 No Content`

**Not:** Body döndürülmez. Refresh token opsiyonel olarak gönderilirse geçersiz kılınır.

### POST `/auth/forgot-password`
Şifre sıfırlama email'i gönderir.

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:** `200 OK`
```json
{
  "message": "If the account exists, a reset link has been sent."
}
```

**Not:** Güvenlik nedeniyle, email kayıtlı olsa da olmasa da aynı mesaj döndürülür.

**Not:** Reset token 24 saat geçerlidir.

### POST `/auth/reset-password`
Şifre sıfırlama token'ı ile yeni şifre belirler.

**Request Body:**
```json
{
  "token": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

**Response:** `200 OK`
```json
{
  "message": "Şifre başarıyla güncellendi."
}
```

## User Endpoints

### GET `/users/me`
Kullanıcının kendi profil bilgilerini getirir.

**Headers:** `Authorization: Bearer <accessToken>`

**Response:** `200 OK`
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "phone": "+905551234567",
  "avatarUrl": "https://res.cloudinary.com/...",
  "studentNumber": "S123456",
  "department": "Computer Science"
}
```

**Error Responses:**
- `401`: Token bulunamadı veya geçersiz

### PUT `/users/me`
Kullanıcının kendi profil bilgilerini günceller.

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "fullName": "string (optional)",
  "phone": "string (optional)"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "fullName": "John Doe Updated",
  "email": "john@example.com",
  "role": "student",
  "phone": "+905551234567",
  "avatarUrl": null,
  "studentNumber": "S123456",
  "department": "Computer Science"
}
```

**Error Responses:**
- `401`: Token bulunamadı veya geçersiz
- `400`: Validation hatası

### POST `/users/me/change-password`
Kullanıcının şifresini değiştirir.

**Headers:** `Authorization: Bearer <accessToken>`

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response:** `200 OK`
```json
{
  "message": "Şifre başarıyla güncellendi."
}
```

### POST `/users/me/profile-picture`
Kullanıcının profil fotoğrafını yükler.

**Headers:** `Authorization: Bearer <accessToken>`, `Content-Type: multipart/form-data`

**Request Body:**
- `file`: File (jpg/png, max 5MB)

**Response:** `200 OK`
```json
{
  "avatarUrl": "https://res.cloudinary.com/cloud_name/image/upload/v1234567890/smart-campus-profiles/abc123.jpg"
}
```

**File Requirements:**
- Format: JPG, PNG, JPEG
- Max Size: 5MB
- Upload: Cloudinary (otomatik resize 500x500)

**Error Responses:**
- `401`: Token bulunamadı veya geçersiz
- `400`: Dosya bulunamadı
- `400`: Geçersiz dosya formatı veya boyutu

### GET `/users`
Admin kullanıcılar için kullanıcı listesi getirir.

**Headers:** `Authorization: Bearer <accessToken>`

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `role`: string (optional, filter by role)
- `department`: string (optional, filter by department)
- `search`: string (optional, search in fullName/email)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "phone": null,
      "avatarUrl": null,
      "studentNumber": "S123456",
      "department": "Computer Science"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

**Error Responses:**
- `401`: Token bulunamadı veya geçersiz
- `403`: Admin yetkisi gerekli

## Error Responses

Tüm endpoint'ler hata durumunda aşağıdaki formatı kullanır:

**400 Bad Request:**
```json
{
  "message": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
  "message": "Unauthorized. Please login."
}
```

**403 Forbidden:**
```json
{
  "message": "Access denied. Insufficient permissions."
}
```

**404 Not Found:**
```json
{
  "message": "Resource not found."
}
```

**500 Internal Server Error:**
```json
{
  "message": "Internal server error."
}
```

## Authentication

Çoğu endpoint için `Authorization` header'ında Bearer token gereklidir:

```
Authorization: Bearer <accessToken>
```

Token süresi dolduğunda, `refresh` endpoint'i kullanılarak yeni access token alınabilir.

