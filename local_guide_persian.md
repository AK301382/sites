# 📘 راهنمای کامل پروژه Kawesh - نسخه محلی

## 🎯 خلاصه پروژه

این پروژه یک پلتفرم مدیریتی کامل با امکانات زیر است:
- پنل مدیریت (Admin Panel)
- مدیریت مشتریان (Customer Management)
- مدیریت تیم و اکانت‌ها (Team & Account Management)
- مدیریت پرتفولیو، بلاگ، خدمات و خبرنامه

---

## 🔐 اطلاعات ورود به پنل مدیریت

### مشخصات ادمین:
- **نام کاربری:** `ashkan`
- **رمز عبور:** `acab1314ashkan`
- **ایمیل:** `ashkan.kawesh@gmail.com`
- **نقش:** Admin

---

## 🌐 آدرس‌های دسترسی

### لینک‌های اصلی:
```
🖥️  فرانت‌اند (Frontend):
https://clean-app-transfer-1.preview.emergentagent.com

📡 بک‌اند (Backend API):
https://clean-app-transfer-1.preview.emergentagent.com/api

📚 مستندات API (Swagger):
https://clean-app-transfer-1.preview.emergentagent.com/api/docs

📖 مستندات جایگزین (ReDoc):
https://clean-app-transfer-1.preview.emergentagent.com/api/redoc
```

### آدرس‌های محلی (Local):
```
🖥️  فرانت‌اند: http://localhost:3000
📡 بک‌اند: http://localhost:8001
🗄️  MongoDB: mongodb://localhost:27017
```

---

## 🚀 راه‌اندازی و اجرای پروژه

### 1. چک کردن وضعیت سرویس‌ها:
```bash
sudo supervisorctl status
```

باید همه سرویس‌ها در حالت `RUNNING` باشند:
- ✅ backend
- ✅ frontend  
- ✅ mongodb

### 2. راه‌اندازی مجدد سرویس‌ها (در صورت نیاز):
```bash
# راه‌اندازی مجدد همه سرویس‌ها
sudo supervisorctl restart all

# راه‌اندازی مجدد بک‌اند
sudo supervisorctl restart backend

# راه‌اندازی مجدد فرانت‌اند
sudo supervisorctl restart frontend
```

### 3. مشاهده لاگ‌ها:
```bash
# لاگ بک‌اند
tail -f /var/log/supervisor/backend.err.log

# لاگ فرانت‌اند  
tail -f /var/log/supervisor/frontend.err.log
```

---

## 📁 ساختار پروژه

```
/app/
├── backend/                    # بک‌اند FastAPI
│   ├── app/
│   │   ├── api/v1/            # API endpoints (نسخه 1)
│   │   │   ├── endpoints/     # فایل‌های endpoint
│   │   │   │   ├── auth.py    # احراز هویت
│   │   │   │   ├── customers.py
│   │   │   │   ├── accounts.py
│   │   │   │   ├── contacts.py
│   │   │   │   ├── newsletter.py
│   │   │   │   ├── portfolio.py
│   │   │   │   ├── blog.py
│   │   │   │   ├── services.py
│   │   │   │   └── admin/     # پنل ادمین
│   │   │   └── router.py      # مسیریابی اصلی
│   │   ├── core/              # هسته اصلی
│   │   │   ├── security.py    # امنیت و رمزنگاری
│   │   │   └── exceptions.py  # مدیریت خطاها
│   │   ├── models/            # مدل‌های دیتابیس
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── repositories/      # لایه دسترسی به دیتا
│   │   ├── services/          # لایه منطق کسب‌وکار
│   │   └── utils/             # توابع کمکی
│   ├── config/                # تنظیمات
│   │   ├── settings.py        # تنظیمات اصلی
│   │   └── logging_config.py  # تنظیمات لاگ
│   ├── middleware/            # میدلور
│   │   └── security.py        # امنیت
│   ├── scripts/               # اسکریپت‌های کمکی
│   │   ├── init_admin.py      # ساخت ادمین اولیه
│   │   └── create_indexes.py  # ساخت ایندکس‌ها
│   ├── .env                   # متغیرهای محیطی
│   ├── requirements.txt       # وابستگی‌های Python
│   └── server.py              # نقطه ورود
│
├── frontend/                  # فرانت‌اند React
│   ├── src/
│   │   ├── app/              # هسته اپلیکیشن
│   │   ├── features/         # ویژگی‌های اصلی
│   │   │   ├── auth/         # احراز هویت
│   │   │   ├── customers/    # مدیریت مشتریان
│   │   │   ├── accounts/     # مدیریت اکانت‌ها
│   │   │   ├── dashboard/    # داشبورد
│   │   │   ├── portfolio/    # پرتفولیو
│   │   │   ├── blog/         # بلاگ
│   │   │   ├── services/     # خدمات
│   │   │   ├── contact/      # تماس با ما
│   │   │   ├── newsletter/   # خبرنامه
│   │   │   └── admin/        # پنل ادمین
│   │   ├── components/       # کامپوننت‌های مشترک
│   │   │   ├── ui/           # کامپوننت‌های UI
│   │   │   ├── layout/       # لایوت
│   │   │   ├── common/       # مشترک
│   │   │   └── forms/        # فرم‌ها
│   │   ├── lib/              # کتابخانه‌ها و ابزارها
│   │   ├── store/            # مدیریت state
│   │   ├── hooks/            # React hooks
│   │   ├── App.js            # کامپوننت اصلی
│   │   └── index.js          # نقطه ورود
│   ├── public/               # فایل‌های استاتیک
│   ├── .env                  # متغیرهای محیطی
│   └── package.json          # وابستگی‌های npm
│
└── tests/                    # تست‌ها
```

---

## 🔑 API Endpoints اصلی

### احراز هویت (Authentication):
```
POST /api/auth/admin/login          # ورود ادمین
POST /api/auth/customer/login       # ورود مشتری
```

### مدیریت مشتریان (Customers):
```
POST   /api/customers/register      # ثبت‌نام مشتری جدید
GET    /api/customers/me            # اطلاعات مشتری فعلی
PUT    /api/customers/me            # ویرایش اطلاعات
PATCH  /api/customers/change-password  # تغییر رمز عبور
GET    /api/customers/dashboard/stats  # آمار داشبورد
```

### مدیریت تیم (Team Management):
```
POST   /api/accounts/invite         # دعوت عضو جدید
POST   /api/accounts/accept-invitation  # پذیرش دعوت
GET    /api/accounts                # لیست اعضای تیم
PUT    /api/accounts/{id}/role      # تغییر نقش
DELETE /api/accounts/{id}           # حذف عضو
```

### تماس با ما (Contact):
```
POST   /api/contacts                # ثبت پیام جدید
GET    /api/admin/contacts          # مشاهده پیام‌ها (ادمین)
```

### خبرنامه (Newsletter):
```
POST   /api/newsletter/subscribe    # عضویت در خبرنامه
POST   /api/newsletter/unsubscribe  # لغو عضویت
GET    /api/admin/newsletter        # لیست مشترکین (ادمین)
```

### پرتفولیو (Portfolio):
```
GET    /api/portfolio               # لیست پروژه‌ها
GET    /api/portfolio/{slug}        # جزئیات پروژه
POST   /api/admin/portfolio         # افزودن پروژه (ادمین)
```

### بلاگ (Blog):
```
GET    /api/blog                    # لیست پست‌ها
GET    /api/blog/{slug}             # جزئیات پست
POST   /api/admin/blog              # افزودن پست (ادمین)
```

### خدمات (Services):
```
POST   /api/services/inquiry        # درخواست خدمات
POST   /api/services/consultation   # رزرو مشاوره
GET    /api/admin/services          # لیست درخواست‌ها (ادمین)
```

---

## 🧪 تست API با cURL

### 1. ورود به پنل ادمین:
```bash
curl -X POST http://localhost:8001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ashkan",
    "password": "acab1314ashkan"
  }'
```

پاسخ:
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "...",
    "username": "ashkan",
    "email": "ashkan.kawesh@gmail.com",
    "role": "admin"
  }
}
```

### 2. استفاده از Token برای دسترسی:
```bash
# ذخیره توکن
TOKEN="توکن_دریافتی_از_مرحله_قبل"

# درخواست با توکن
curl -X GET http://localhost:8001/api/admin/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🗄️ مدیریت دیتابیس MongoDB

### اتصال به MongoDB:
```bash
# اتصال به MongoDB Shell
mongosh mongodb://localhost:27017/kawesh_db
```

### دستورات مفید MongoDB:
```javascript
// نمایش تمام کالکشن‌ها
show collections

// نمایش ادمین‌ها
db.admin_users.find().pretty()

// نمایش مشتریان
db.customers.find().pretty()

// حذف تمام داده‌های یک کالکشن
db.contacts.deleteMany({})

// شمارش رکوردها
db.admin_users.countDocuments()
```

---

## 🛠️ عیب‌یابی (Troubleshooting)

### مشکل: بک‌اند اجرا نمی‌شود
```bash
# چک کردن لاگ‌ها
tail -n 100 /var/log/supervisor/backend.err.log

# نصب مجدد وابستگی‌ها
cd /app/backend
pip install -r requirements.txt

# راه‌اندازی مجدد
sudo supervisorctl restart backend
```

### مشکل: فرانت‌اند لود نمی‌شود
```bash
# چک کردن لاگ‌ها
tail -n 100 /var/log/supervisor/frontend.err.log

# نصب مجدد وابستگی‌ها
cd /app/frontend
yarn install

# راه‌اندازی مجدد
sudo supervisorctl restart frontend
```

### مشکل: MongoDB متصل نمی‌شود
```bash
# چک کردن وضعیت MongoDB
sudo supervisorctl status mongodb

# راه‌اندازی مجدد MongoDB
sudo supervisorctl restart mongodb

# چک کردن اتصال
mongosh mongodb://localhost:27017
```

### مشکل: ورود ادمین کار نمی‌کند
```bash
# پاک کردن و ساخت مجدد ادمین
cd /app/backend
python3 -c "
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

async def drop_admin():
    client = AsyncIOMotorClient('mongodb://localhost:27017')
    db = client['kawesh_db']
    await db.admin_users.drop()
    print('Admin collection dropped')
    client.close()

asyncio.run(drop_admin())
"

# ساخت مجدد ادمین
python3 scripts/init_admin.py
```

---

## 📦 نصب وابستگی‌های جدید

### برای بک‌اند (Python):
```bash
cd /app/backend

# نصب پکیج جدید
pip install package_name

# به‌روزرسانی requirements.txt
pip freeze > requirements.txt
```

### برای فرانت‌اند (JavaScript):
```bash
cd /app/frontend

# نصب پکیج جدید
yarn add package_name

# نصب پکیج development
yarn add -D package_name
```

---

## 🔒 متغیرهای محیطی (Environment Variables)

### بک‌اند (.env):
```env
# اپلیکیشن
APP_NAME="Kawesh API"
DEBUG=false
ENVIRONMENT="development"

# امنیت
SECRET_KEY="6PrWkxjNcYSEE_WDPXjBo6tF0_pwkfe2Zl-LxvQceJg"
JWT_ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_HOURS=24

# ادمین
ADMIN_USERNAME="ashkan"
ADMIN_EMAIL="ashkan.kawesh@gmail.com"
ADMIN_PASSWORD="acab1314ashkan"

# دیتابیس
MONGO_URL="mongodb://localhost:27017"
DB_NAME="kawesh_db"

# CORS
CORS_ORIGINS="*"

# لاگینگ
LOG_LEVEL="INFO"
```

### فرانت‌اند (.env):
```env
REACT_APP_BACKEND_URL=https://clean-app-transfer-1.preview.emergentagent.com
WDS_SOCKET_PORT=443
```

---

## 📊 معماری پروژه

### الگوی معماری:
این پروژه از معماری **لایه‌بندی شده (Layered Architecture)** استفاده می‌کند:

```
┌─────────────────────────────────────┐
│         API Layer (Endpoints)       │  ← دریافت درخواست‌ها
├─────────────────────────────────────┤
│         Service Layer               │  ← منطق کسب‌وکار
├─────────────────────────────────────┤
│         Repository Layer            │  ← دسترسی به دیتابیس
├─────────────────────────────────────┤
│         Database (MongoDB)          │  ← ذخیره‌سازی
└─────────────────────────────────────┘
```

### جریان درخواست:
1. **Client** → درخواست HTTP
2. **API Endpoint** → دریافت و اعتبارسنجی
3. **Service** → پردازش منطق کسب‌وکار
4. **Repository** → تعامل با دیتابیس
5. **Database** → ذخیره/بازیابی داده
6. **Response** → پاسخ به کلاینت

---

## 🎨 فناوری‌های استفاده شده

### بک‌اند:
- **FastAPI** - فریم‌ورک وب
- **Motor** - درایور async MongoDB
- **Pydantic** - اعتبارسنجی داده
- **Passlib & bcrypt** - رمزنگاری رمز عبور
- **python-jose** - JWT tokens
- **python-multipart** - آپلود فایل

### فرانت‌اند:
- **React** - کتابخانه UI
- **Tailwind CSS** - فریم‌ورک CSS
- **Radix UI** - کامپوننت‌های accessible
- **React Query** - مدیریت state سرور
- **Zustand** - مدیریت state کلاینت

### دیتابیس:
- **MongoDB** - دیتابیس NoSQL

---

## 📝 نکات مهم

### امنیت:
1. ⚠️ **هرگز SECRET_KEY را در گیت قرار ندهید**
2. ⚠️ **رمزهای عبور را همیشه hash کنید**
3. ⚠️ **از HTTPS در production استفاده کنید**
4. ⚠️ **CORS را به درستی تنظیم کنید**

### بهینه‌سازی:
1. ✅ از ایندکس‌های MongoDB استفاده کنید
2. ✅ response compression را فعال کنید
3. ✅ caching را پیاده‌سازی کنید
4. ✅ query optimization انجام دهید

### مستندسازی:
1. 📚 Swagger docs در `/api/docs` موجود است
2. 📚 ReDoc در `/api/redoc` موجود است
3. 📚 کد خود را comment کنید
4. 📚 تغییرات مهم را document کنید

---

## 🚀 دستورات سریع

### شروع سریع:
```bash
# چک کردن وضعیت
sudo supervisorctl status

# راه‌اندازی همه
sudo supervisorctl start all

# توقف همه
sudo supervisorctl stop all

# راه‌اندازی مجدد همه
sudo supervisorctl restart all
```

### دیباگ سریع:
```bash
# لاگ بک‌اند
tail -f /var/log/supervisor/backend.err.log

# لاگ فرانت‌اند
tail -f /var/log/supervisor/frontend.err.log

# تست API
curl http://localhost:8001/

# تست MongoDB
mongosh mongodb://localhost:27017/kawesh_db
```

---

## 📞 پشتیبانی

اگر به مشکلی برخوردید:
1. لاگ‌ها را چک کنید
2. بخش عیب‌یابی را مطالعه کنید
3. مستندات API را بررسی کنید
4. با تیم پشتیبانی تماس بگیرید

---

**تاریخ ایجاد:** ۲۵ آبان ۱۴۰۳  
**نسخه:** 2.0.0  
**زبان:** فارسی 🇮🇷

---

💚 موفق باشید!
