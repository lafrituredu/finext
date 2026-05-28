<div align="center">
  <img src="Frontend/public/img/FiNext.png" alt="Finext" width="200" />
</div>

## What is Finext?

**Finext** is a web platform built to help individuals, freelancers, and financial managers take full control of their finances in a simple and intelligent way. Users can track income and expenses, monitor their cash flow, set financial goals, and get a clear picture of their financial situation.

The platform also covers basic tax estimation (VAT and income tax), making it especially handy for freelancers who need visibility over their fiscal obligations. Finext brings together clarity, automation, and actionable insights all in one place.

🌐 **Live demo:** [https://finext.cat](https://finext.cat)

---

## Tech Stack

### Languages

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

---

### Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

### Backend

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)

---

### Database

![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)

---

### Libraries & Tools

![Anime.js](https://img.shields.io/badge/Anime.js-FF1461?style=for-the-badge&logo=javascript&logoColor=white)
![ApexCharts](https://img.shields.io/badge/ApexCharts-00A98F?style=for-the-badge&logo=chartdotjs&logoColor=white)
![i18next](https://img.shields.io/badge/i18next-26A69A?style=for-the-badge&logo=i18next&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)

---

## Features

- **Income & expense tracking** — Manage fixed and variable transactions with automatic monthly updates for recurring costs.
- **Cash flow visualization** — Monthly financial overview with historical views spanning 3, 6, 9, and 12 months.
- **Expense management** — Categorize expenses, tag them as personal or professional, and flag tax-deductible costs.
- **Financial goals** — Set savings targets with deadlines and track progress over time.
- **Reports & export** — Generate financial reports with visual charts and export them as PDF.
- **Tax estimation** — Calculate VAT and income tax with suggested reserves and quarterly breakdowns (Spain-focused).
- **Recurring transactions** — Define periodic fixed expenses to keep finances organized automatically.
- **Invoicing** — Create and manage issued and received invoices, with support for installment payments.
- **Secure authentication** — Login, email-verified registration, and Google OAuth.
- **Multilingual** — Available in English and Spanish via i18next.
- **Light / dark mode** — Users can switch themes from the dashboard.

---

## Project Structure

```
Finext/
├── Backend/               # REST API built with Laravel (MVC)
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   └── Middleware/
│   │   ├── Models/
│   │   └── Services/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
└── Frontend/              # SPA built with React + Vite (TypeScript)
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── ...
    └── public/
```

---

## Requirements

| Tool    | Version |
|---------|---------|
| Node.js | v25.8.2 |
| npm     | 11.12.1 |
| PHP     | 8.3.6   |
| MariaDB | 10.11.x |

---

## Getting Started

### Backend

```bash
# Navigate to the backend directory
cd Backend

# Install dependencies
composer install

# Set up the environment file
cp .env.example .env
php artisan key:generate

# Run migrations and seeders
php artisan migrate:fresh
php artisan db:seed --class=CategorySeeder

# Start the development server
php artisan serve
```

### Frontend

```bash
# Navigate to the frontend directory
cd Frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## Team

Final course project developed by:

- **Eduardo Rubio**
- **Marc Gilavert**
- **Jeremy Intriago**

School: INS Provençana · Tutor: Isabel Miralves · Submitted: May 2026
