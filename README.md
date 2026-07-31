# Full-Stack Learning Management System Overview

This project is a full-stack Learning Management System (LMS) built with **Django** for the backend and **React** for the frontend. It is designed to support students, teachers, and administrators through authentication, course management, and role-based access.

## 📁 Project Structure

```text
root/
├── backend/
│   ├── config/
│   ├── courses/
│   ├── students/
│   ├── db.sqlite3
│   └── manage.py
├── frontend/
│   └── react-auth-app/
│       ├── build/
│       ├── node_modules/
│       ├── public/
│       ├── src/
│       ├── craco.config.js
│       ├── package-lock.json
│       ├── package.json
│       ├── tailwind.config.js
│       └── tsconfig.json
├── .gitignore
└── README.md
```

## 🚀 Features

- ✅ User authentication with login, signup, and role handling
- 📚 Course browsing and course management
- 🔒 Role-based access for students, teachers, and admins

## ⚙️ Tech Stack

| Layer     | Technology                    |
| --------- | ----------------------------- |
| Frontend  | React, CRACO, TypeScript      |
| Backend   | Django, Django REST Framework |
| Database  | SQLite                        |
| Auth      | JWT authentication            |
| Dev Tools | Git, GitHub, ESLint, Tailwind |

- VSCode was used as my main tool in order to write/edit code
- Git was used to deal with the version control of my website
- GitHub was used to host the code of my website
- HTML/React was used as the foundation/structure of my site
- CSS was used to style and edit the layout of my site
- Django was used to build the backend
- React was used to build the frontend

## Testing

#### Backend

```bash
cd backend
../.venv/Scripts/python.exe manage.py test
```

#### Frontend

```bash
cd frontend
cd react-auth-app
npm test -- --watch=false --runInBand
```

## Accessibility

- Accessibility WIP.

## Deployment

- Deployment WIP.

## 🛠️ Setup Instructions

#### 🔹 Backend (Django)

```bash
cd backend
python manage.py migrate
python manage.py runserver
```

#### 🔹 Frontend (React)

```bash
cd frontend/react-auth-app
npm install
npm start
```

## Credits/Validation

### Code validation was carried out using the following tools and methods:

- [HTML Validator](https://validator.w3.org/nu/#textarea)
- [CSS Validator](https://jigsaw.w3.org/css-validator/#validate_by_input)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- Django's built-in test framework for backend integration testing
