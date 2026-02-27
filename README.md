# TaskFlow - AI-Powered Task Management

TaskFlow is a smart task management application that uses AI to help prioritize tasks and suggest realistic deadlines.

---

## Features

- ✅ User authentication (register/login)
- ✅ Create, read, update, and delete tasks
- ✅ AI-powered task priority analysis
- ✅ AI-suggested deadlines based on task content
- ✅ Responsive blue & white modern UI
- ✅ Real-time task status updates

---

## Tech Stack

**Backend**
- Python 3.9+
- Flask (REST API)
- Flask-SQLAlchemy (ORM)
- Flask-JWT-Extended (Authentication)
- OpenAI API and/or Gemini API (AI features)
- SQLite (or PostgreSQL, update if needed)

**Frontend**
- React 18
- React Router v6
- Axios (HTTP client)
- Custom CSS (or Tailwind, update if needed)
- Heroicons (icons)

---

## Installation

### Prerequisites

- Python 3.9+
- Node.js 16+
- (Optional) PostgreSQL 13+ (if not using SQLite)
- OpenAI API key (and/or Gemini API key)

---

### Backend Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/taskflow.git
   cd taskflow/backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in your OpenAI/Gemini API key and database URL.

5. Initialize the database:
   ```bash
   flask db upgrade
   # or if using SQLite, it may auto-create on first run
   ```

6. Run the backend server:
   ```bash
   python run.py
   ```

---

### Frontend Setup

1. Open a new terminal and go to the frontend folder:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend server:
   ```bash
   npm start
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000)

---

## AI Usage

- The backend uses OpenAI and/or Gemini APIs to:
  - Analyze task titles/descriptions and suggest a priority (1–5)
  - Suggest a realistic deadline for each task
- If no API key is provided, the app falls back to mock AI responses for demo purposes.

---

## Key Technical Decisions

- **Flask** for a lightweight, flexible Python API.
- **React** for a modern, component-based frontend.
- **JWT** for secure, stateless authentication.
- **AI Integration** to demonstrate real-world use of LLMs in productivity tools.
- **SQLite** for easy local development (can be swapped for PostgreSQL).

---

## Risks & Extension Approach

- **Risks:** API key exposure, rate limits, and cost for AI usage.
- **Extensions:** Add user registration, task categories, notifications, team collaboration, or more advanced AI features.

---

## Walkthrough Video

A 10–15 minute walkthrough video is included, covering:
- Architecture (backend, frontend, database, AI)
- Folder structure
- Technical decisions
- AI usage
- Risks and extension approach

---

## AI Guidance Files

See the `ai_guidance/` folder for:
- Prompting rules
- Agent instructions
- Coding standards

---

## License

MIT (or your chosen license)

---

**Ready to submit!**
