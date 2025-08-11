🌿 Wellness Session Platform (Frontend-Only Demo)
📖 Overview
This project is a frontend-only implementation of the Arvyax Full Stack Internship Assignment.
It demonstrates authentication flows, session management, draft saving, and publishing — using mock authentication and local storage to simulate backend functionality.

The app is fully deployed and can be used live here:
🔗 Live Demo: https://wellness-session-platform.lovable.app

✨ Features
Mock Authentication (login/register using local storage)

Protected Routes based on mock JWT tokens

View Public Wellness Sessions (predefined mock data)

Create, Edit, and Save Drafts

Publish Sessions

Auto-Save Drafts after 5 seconds of inactivity

Responsive UI built with Tailwind CSS + Shadcn UI

🛠 Tech Stack
Frontend: React + Vite + TypeScript

UI: Tailwind CSS + Shadcn UI

State Management: React Hooks + Local Storage

Auth: Mock JWT logic (no real backend)

Deployment: Lovable

⚠️ Notes on Authentication
This project does not have a backend server.
Authentication and session data are simulated:

Users are stored in local storage

Tokens are mock-generated

All API calls are mocked within the frontend code

This allows you to experience the full flow of the app without needing a live backend.
If a backend were implemented, the mock API layer could be replaced with real API endpoints.



📂 Folder Structure
public/           # Static assets
src/              # React source code
  components/     # UI components
  pages/          # Page-level components
  utils/          # Helper functions (mock APIs, auth)
index.html        # Entry HTML file
package.json      # Project dependencies
README.md         # Project documentation

🚀 Running Locally
Clone the repository
git clone https://github.com/Furqesda/wellness-session-platform.git
cd wellness-session-platform

Install dependencies
npm install

Start the development server
npm run dev

Open http://localhost:5173 in your browser.

📌 Mock API Endpoints (Simulated)
| Method | Endpoint                | Description                                            |
| ------ | ----------------------- | ------------------------------------------------------ |
| POST   | /register               | Registers a new user (local storage)                   |
| POST   | /login                  | Logs in a user, returns mock token                     |
| GET    | /sessions               | Fetches public wellness sessions                       |
| GET    | /my-sessions            | Fetches drafts & published sessions for logged-in user |
| POST   | /my-sessions/save-draft | Saves/updates a draft session                          |
| POST   | /my-sessions/publish    | Publishes a draft session                              |

📦 Deployment
The app is deployed via Lovable and automatically updates with GitHub commits.
For deployment:

Push to the connected GitHub repo.

Lovable rebuilds and redeploys automatically.

📜 License
This project is for educational/demo purposes only.
Not intended for production use without a backend.
