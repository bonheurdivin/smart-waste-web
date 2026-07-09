# Smart Waste Collection System — Web Admin Panel

A React/Next.js web admin panel for facility staff to manage the Smart Waste Collection System platform.

## 🌐 Live Demo
https://smartwastecollector.vercel.app

## 🛠️ Tech Stack
- Next.js 15
- React 18
- Tailwind CSS
- Iconify Icons
- Deployed on Vercel

## ✨ Features
- Role-based login (Admin, Dispatcher, Finance)
- Responsive design — works on desktop and mobile
- Dashboard with real-time statistics and recent activity
- Full CRUD operations on all entities
- Search and filter on all tables
- View, Edit and Delete modals
- Household management with owner assignment
- Worker registration with user account creation
- Vehicle fleet management
- Schedule and route planning
- Pickup assignment and tracking
- Payment tracking with pending/paid/unpaid flow
- Complaints management with resolve workflow
- Analytics reports with worker productivity and zone analytics
- Notifications composer
- Admin profile with photo upload
- Password change

## 📄 Pages
| Page | Description | Access |
|------|-------------|--------|
| `/login` | Admin login | Public |
| `/dashboard` | Overview + recent activity | All Staff |
| `/households` | Manage households | Admin/Dispatcher |
| `/plans` | Collection plans and pricing | Admin |
| `/workers` | Manage field workers | Admin/Dispatcher |
| `/vehicles` | Vehicle fleet management | Admin/Dispatcher |
| `/schedules` | Route and schedule planning | Admin/Dispatcher |
| `/pickups` | Pickup tracking and assignment | Admin/Dispatcher |
| `/payments` | Payment tracking and approval | Admin/Finance |
| `/reports` | Analytics and productivity reports | Admin/Finance |
| `/complaints` | Resident complaints management | Admin/Dispatcher |
| `/notifications` | Broadcast notifications | Admin/Dispatcher |
| `/profile` | Admin profile and settings | All Staff |

## 🚀 Local Installation

### Requirements
- Node.js 18+
- npm
- Backend API running locally

### Steps
1. Clone the repository:
```bash
   git clone https://github.com/bonheurdivin/smart-waste-web.git
   cd smart-waste-web
```
2. Install dependencies:
```bash
   npm install
```
3. Update API URL in all pages from:
https://smart-waste-collector.up.railway.app/api/v1
   To:
http://localhost/smart-waste-api/api/v1
4. Run development server:
```bash
   npm run dev
```
5. Open `http://localhost:3000`

## 🔐 Default Credentials
Phone: +250788999999
Password: admin123

## 📁 Project Structure
smart-waste-web/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.js
│   │   ├── (dashboard)/
│   │   │   ├── layout.js
│   │   │   ├── dashboard/
│   │   │   ├── households/
│   │   │   ├── plans/
│   │   │   ├── workers/
│   │   │   ├── vehicles/
│   │   │   ├── schedules/
│   │   │   ├── pickups/
│   │   │   ├── payments/
│   │   │   ├── reports/
│   │   │   ├── complaints/
│   │   │   ├── notifications/
│   │   │   └── profile/
│   │   ├── globals.css
│   │   └── layout.js
│   └── components/
│       ├── Sidebar.js
│       ├── TopBar.js
│       ├── DataTable.js
│       ├── StatusChip.js
│       ├── StatCard.js
│       ├── Modal.js
│       ├── FormField.js
│       ├── ViewModal.js
│       └── TableFilters.js
└── README.md

## 👨‍💻 Author
**Divin** — Internship Project 2026
- GitHub: [@bonheurdivin](https://github.com/bonheurdivin)