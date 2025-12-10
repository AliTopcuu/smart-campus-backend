# SmartCampus - Proje Genel Bakış (Part 1)

## 📋 Proje Tanımı

SmartCampus, modern bir üniversite yönetim sistemi projesidir. Part 1 kapsamında, kullanıcı kimlik doğrulama (authentication) ve kullanıcı yönetimi (user management) modülleri geliştirilmiştir.

### Proje Amacı

Üniversite öğrencileri, akademisyenler ve yöneticiler için merkezi bir platform sağlayarak:
- Güvenli kullanıcı kimlik doğrulama
- Profil yönetimi
- Rol bazlı erişim kontrolü
- Modern ve kullanıcı dostu arayüz

## 🛠️ Teknoloji Stack'i

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 5.2
- **ORM:** Sequelize 6.37
- **Database:** PostgreSQL 14
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt (10 salt rounds)
- **File Upload:** Multer + Cloudinary
- **Email:** Nodemailer (SMTP)
- **Validation:** Yup
- **Security:** Helmet.js, CORS
- **Logging:** Morgan

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 7
- **Routing:** React Router v7
- **UI Library:** Material-UI (MUI) v7
- **Form Management:** React Hook Form
- **Validation:** Yup
- **HTTP Client:** Axios
- **State Management:** Context API + TanStack Query
- **Notifications:** React Toastify

### DevOps
- **Containerization:** Docker & Docker Compose
- **Database:** PostgreSQL 14 (containerized)

## 📁 Proje Yapısı

### Backend Yapısı
```
smart-campus-backend/
├── src/
│   ├── config/              # Konfigürasyon dosyaları
│   ├── controllers/         # Route handler'ları
│   │   └── authController.js
│   ├── middleware/          # Middleware'ler
│   │   ├── authMiddleware.js
│   │   ├── authorizeRole.js
│   │   └── validateRequest.js
│   ├── models/              # Sequelize modelleri
│   │   ├── user.js
│   │   ├── student.js
│   │   ├── faculty.js
│   │   ├── department.js
│   │   └── index.js
│   ├── routes/              # Route tanımları
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── index.js
│   ├── services/            # İş mantığı
│   │   └── authService.js
│   ├── migrations/          # Veritabanı migration'ları
│   ├── seeders/             # Seed dosyaları
│   ├── utils/               # Yardımcı fonksiyonlar
│   │   ├── jwt.js
│   │   ├── mailer.js
│   │   └── errors.js
│   ├── app.js               # Express uygulaması
│   └── server.js            # Sunucu başlatma
├── tests/                   # Test dosyaları
│   ├── unit/                # Unit testler
│   └── integration/         # Integration testler
├── Dockerfile
├── docker-compose.yml
├── package.json
├── .env.example
└── README.md
```

### Frontend Yapısı
```
smart-campus-frontend/
├── src/
│   ├── components/          # Yeniden kullanılabilir bileşenler
│   │   ├── common/          # LoadingScreen, vb.
│   │   ├── layout/          # AuthLayout, DashboardLayout
│   │   ├── navigation/      # navConfig
│   │   └── routing/         # ProtectedRoute, PublicRoute
│   ├── context/             # Context providers
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/               # Custom hooks
│   │   └── useToast.js
│   ├── pages/               # Sayfa bileşenleri
│   │   ├── auth/            # Login, Register, ForgotPassword, vb.
│   │   ├── dashboard/       # Dashboard
│   │   ├── profile/         # Profile management
│   │   ├── courses/         # Course pages
│   │   ├── grades/          # Grade pages
│   │   └── attendance/     # Attendance pages
│   ├── routes/              # Router configuration
│   ├── services/            # API service functions
│   │   ├── apiClient.js
│   │   ├── authService.js
│   │   └── userService.js
│   ├── utils/               # Utilities
│   │   ├── validationSchemas.js
│   │   ├── tokenStorage.js
│   │   └── apiError.js
│   ├── config/              # App configuration
│   ├── theme.js             # MUI theme
│   ├── App.jsx              # Root component
│   └── main.jsx             # Entry point
├── public/
├── package.json
├── .env.example
└── README.md
```

## 👥 Grup Üyeleri ve Görev Dağılımı

### Frontend Geliştirme
- **Hanife Şirin**
  - Frontend UI/UX geliştirme
  - React bileşenleri ve sayfalar
  - Kullanıcı arayüzü tasarımı
  - Frontend routing ve state management

- **Ali Ufuktan Topcu**
  - Frontend UI/UX geliştirme
  - React bileşenleri ve sayfalar
  - API entegrasyonu
  - Frontend testleri

### Backend Geliştirme
- **Rana Demirci**
  - Backend API geliştirme
  - Veritabanı tasarımı ve migration'lar
  - Authentication ve authorization implementasyonu
  - Backend servisleri ve controller'lar

- **Ali Ufuktan Topcu**
  - Backend API geliştirme
  - Route tanımları ve middleware'ler
  - Backend testleri (unit + integration)
  - API dokümantasyonu

### DevOps
- **Rana Demirci**
  - Docker containerization
  - CI/CD pipeline kurulumu
  - Deployment yapılandırması
  - Veritabanı yönetimi

- **Hanife Şirin**
  - Docker containerization
  - CI/CD pipeline kurulumu
  - Deployment yapılandırması
  - Sunucu yönetimi ve monitoring

## 🎯 Part 1 Kapsamı

### Tamamlanan Özellikler

#### Authentication (Kimlik Doğrulama)
- ✅ Kullanıcı kaydı (register)
- ✅ Email doğrulama (verify-email)
- ✅ Kullanıcı girişi (login)
- ✅ Token yenileme (refresh)
- ✅ Çıkış yapma (logout)
- ✅ Şifre sıfırlama talebi (forgot-password)
- ✅ Şifre sıfırlama (reset-password)

#### User Management (Kullanıcı Yönetimi)
- ✅ Profil görüntüleme (GET /users/me)
- ✅ Profil güncelleme (PUT /users/me)
- ✅ Şifre değiştirme (POST /users/me/change-password)
- ✅ Profil fotoğrafı yükleme (POST /users/me/profile-picture)
- ✅ Kullanıcı listesi - Admin (GET /users)

#### Veritabanı
- ✅ Users tablosu
- ✅ Students tablosu
- ✅ Faculties tablosu
- ✅ Departments tablosu
- ✅ Migration dosyaları
- ✅ Seed data (5 öğrenci, 2 akademisyen, 1 admin)

#### Frontend Sayfaları
- ✅ Login Page
- ✅ Register Page
- ✅ Email Verification Page
- ✅ Forgot Password Page
- ✅ Reset Password Page
- ✅ Dashboard Page
- ✅ Profile Page

#### Güvenlik
- ✅ JWT token authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based access control (RBAC)
- ✅ CORS yapılandırması
- ✅ Helmet.js güvenlik header'ları
- ✅ File upload validasyonu (tip ve boyut kontrolü)

#### Testing
- ✅ Unit testler (authService)
- ✅ Integration testler (Auth endpoints - 10+ test)
- ✅ Integration testler (User endpoints - 5+ test)

## 📊 Veritabanı Şeması

### Tablolar
1. **Users** - Kullanıcı ana tablosu
2. **Students** - Öğrenci bilgileri
3. **Faculties** - Akademisyen bilgileri
4. **Departments** - Bölüm bilgileri

Detaylı şema için [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) dosyasına bakın.

## 🔐 Authentication Akışı

1. **Kayıt:** Kullanıcı kayıt olur → Email doğrulama token'ı oluşturulur
2. **Email Doğrulama:** Kullanıcı email'deki linke tıklar → Hesap aktifleştirilir
3. **Giriş:** Kullanıcı giriş yapar → Access token (15 dk) + Refresh token (7 gün) alır
4. **Token Yenileme:** Access token süresi dolduğunda refresh token ile yenilenir
5. **Çıkış:** Refresh token geçersiz kılınır

## 🚀 Kurulum ve Çalıştırma

### Backend
```bash
cd smart-campus-backend
npm install
# .env dosyasını oluştur
docker-compose up -d
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm start
```

### Frontend
```bash
cd smart-campus-frontend
npm install
# .env dosyasını oluştur
npm run dev
```

Detaylı kurulum talimatları için [README.md](./README.md) dosyasına bakın.

## 📚 Dokümantasyon

- **API Dokümantasyonu:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Veritabanı Şeması:** [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
- **Kullanıcı Kılavuzu:** [../frontend/USER_MANUAL_PART1.md](../smart-campus-frontend/USER_MANUAL_PART1.md)
- **Test Raporu:** [TEST_REPORT_PART1.md](./TEST_REPORT_PART1.md)

## 🔄 Sonraki Adımlar (Part 2+)

- Course management (Ders yönetimi)
- Enrollment system (Kayıt sistemi)
- Grade management (Not yönetimi)
- Attendance system (Yoklama sistemi)
- Excuse requests (Mazeret talepleri)
- Notifications (Bildirimler)
- File management (Dosya yönetimi)

## 📄 Lisans

ISC

