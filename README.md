# Smart Waste Collection System — Web Admin Panel

A React/Next.js web admin panel for facility staff to manage the Smart Waste Collection System.

## Tech Stack
- Next.js 15
- React
- Tailwind CSS
- Iconify Icons

## Features
- Role-based login (Admin, Dispatcher, Finance)
- Dashboard with real-time statistics
- Household management with CRUD
- Worker and vehicle fleet management
- Schedule and route planning
- Pickup assignment and tracking
- Payment tracking and approval
- Complaints management
- Analytics and reports
- Notifications composer

## Pages
| Page | Description | Access |
|------|-------------|--------|
| Dashboard | Overview statistics and recent activity | All |
| Households | Manage registered households | Admin/Dispatcher |
| Plans | Manage collection plans and pricing | Admin |
| Workers | Manage field workers | Admin/Dispatcher |
| Vehicles | Manage vehicle fleet | Admin/Dispatcher |
| Schedules | Plan pickup routes and schedules | Admin/Dispatcher |
| Pickups | Track and manage pickups | Admin/Dispatcher |
| Payments | Track and approve payments | Admin/Finance |
| Reports | Analytics and exports | Admin/Finance |
| Complaints | Manage resident complaints | Admin/Dispatcher |
| Notifications | Send broadcast messages | Admin/Dispatcher |

## Installation

### Requirements
- Node.js 18+
- npm

### Steps
1. Clone the repository:
```bash
   git clone https://github.com/bonheurdivin/smart-waste-web.git
```
2. Install dependencies:
```bash
   cd smart-waste-web
   npm install
```
3. Run development server:
```bash
   npm run dev
```
4. Open `http://localhost:3000`

### Default Admin Credentials

Phone: +250788999999

Password: admin123

> Make sure the backend API is running before starting the web app.

## Project Structure

smart-waste-web/

├── src/

│   ├── app/

│   │   ├── (auth)/

│   │   │   └── login/

│   │   ├── (dashboard)/

│   │   │   ├── dashboard/

│   │   │   ├── households/

│   │   │   ├── workers/

│   │   │   ├── vehicles/

│   │   │   ├── schedules/

│   │   │   ├── pickups/

│   │   │   ├── payments/

│   │   │   ├── complaints/

│   │   │   ├── reports/

│   │   │   └── notifications/

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

## Author
Divin — Internship Project 2026