<<<<<<< HEAD
# Gov_portal
a website which has all the links to the government websites and steps are given for the user so it is easier for them to navigate through the process
=======
# Unavoidable – AI-Assisted Government Process Navigator

A production-quality React.js web application for navigating Indian government processes step by step.

---

## Tech Stack

- **React 18** (Functional Components + Hooks)
- **Vite** (build tool)
- **React Router v6** (client-side routing)
- **Axios** (API layer)
- **Plain CSS** (`src/style.css` — no Tailwind, no MUI)

---

## Project Structure

```
src/
├── pages/
│   ├── Login.jsx          # Phase 2 – Login page
│   ├── Register.jsx       # Phase 2 – Register page
│   ├── Dashboard.jsx      # Phase 3 – Service selection
│   └── Process.jsx        # Phase 4–7 – Steps, Docs, Vault, AI
│
├── components/
│   ├── Navbar.jsx         # Top navigation bar
│   ├── ServiceCard.jsx    # Clickable service card
│   ├── StepList.jsx       # Numbered step guide
│   ├── DocumentUpload.jsx # Drag & drop file upload zone
│   ├── DocumentList.jsx   # Vault document list
│   ├── DocumentStatus.jsx # Validation result + formatter
│   └── AIHelper.jsx       # AI chat interface
│
├── services/
│   └── api.js             # Axios instance + all API calls (mocked)
│
├── utils/
│   └── auth.js            # JWT token helpers (localStorage)
│
├── style.css              # Global CSS (all classes)
├── App.jsx                # Route definitions
└── main.jsx               # React entry point
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

App runs at → **http://localhost:5173**

### 3. Build for production

```bash
npm run build
npm run preview
```

---

## Routes

| Route | Page | Auth required |
|---|---|---|
| `/login` | Login | No |
| `/register` | Register | No |
| `/dashboard` | Service selection | Yes |
| `/process/:service` | Process + Docs + AI | Yes |

Valid `:service` values: `aadhaar`, `driving`, `passport`, `pan`

---

## Connecting a Real Backend

All API calls are in `src/services/api.js`. Each function has a comment showing the real Axios call to uncomment:

```js
// Replace mock with:
// return api.post('/login', { email, password })

// Replace mock with:
// return api.get(`/services/${serviceName}`)

// Replace mock with:
// const form = new FormData(); form.append('file', file)
// return api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
```

Set your backend URL in a `.env` file:

```env
VITE_API_URL=https://your-backend.com/api
```

---

## Features by Phase

| Phase | Feature |
|---|---|
| 1 | Vite + React project setup, routing |
| 2 | Login + Register with validation + JWT |
| 3 | Dashboard with 4 government service cards |
| 4 | Process page: step-by-step guide + required docs |
| 5 | Document Vault: upload, view, remove |
| 6 | Document Status: size/format validation + fix tools |
| 7 | AI Helper: context-aware chat for process questions |

---

## Demo Credentials

Email: `demo@example.com`  
Password: `password123`

(Any valid email + 6+ char password works in mock mode)
>>>>>>> 74cb4da (Initial commit)
