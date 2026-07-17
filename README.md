# Smart-Livestock-Emergency-and-Veterinary-Support-System-
Web Developments project

# Smart Livestock Emergency and Veterinary Support System

## Overview

The Smart Livestock Emergency and Veterinary Support System is a web-based application developed to improve livestock healthcare services by connecting farmers with veterinary doctors in real time.

The system enables farmers to register livestock, report emergency cases, communicate with veterinary doctors, schedule appointments, and maintain livestock health records.

---

## Problem Statement

Many livestock farmers experience delays in accessing veterinary services during emergencies. Traditional communication methods such as phone calls and physical visits often result in slow response times, leading to livestock deaths and financial losses.

---

## Proposed Solution

The system provides a centralized platform where:

- Farmers can register livestock.
- Farmers can report emergency cases.
- Veterinary doctors receive real-time notifications.
- Doctors provide medical advice.
- Farmers book appointments.
- Health records are stored digitally.

---

## Features

### Farmer
- Register account
- Login
- Register livestock
- Report emergency cases
- Chat with veterinary doctors
- View livestock health history
- Book appointments

### Veterinary Doctor
- Login
- View emergency reports
- Respond to emergencies
- Manage appointments
- Chat with farmers

### Administrator
- Manage users
- Verify veterinary doctors
- Monitor system activities
- Generate reports

---

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Spring Boot

### Database
- PostgreSQL

### Version Control
- Git
- GitHub

### Deployment
- Docker
- GitHub Actions
- Render / Railway

---

## System Architecture

Frontend (HTML, CSS, JS)

↓

REST API

↓

Backend (Spring Boot)

↓

PostgreSQL Database

---

## Installation

### Clone the repository

```bash
git clone https://github.com/2003analyst/Smart-Livestock-Emergency-and-Veterinary-Support-System-.git
```

### Enter project directory

```bash
cd Smart-Livestock-Emergency-and-Veterinary-Support-System-
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate
```

Windows

```bash
venv\Scripts\activate
```

Install packages

```bash
pip install -r requirements.txt
```

Run server

```bash
python manage.py runserver
```

---

## Project Structure

```
Smart-Livestock/
│
├── frontend/
├── backend/
├── docs/
├── README.md
├── .gitignore
└── docker-compose.yml
```

---

## Future Improvements

- AI disease prediction
- SMS notifications
- GPS farm location
- Mobile application
- Online payments

---

## Authors

- Your Name
- Registration Number
- State University of Zanzibar (SUZA)

---

## License

This project was developed for academic purposes at the State University of Zanzibar (SUZA).
