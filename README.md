# Workspace Collaboration Platform – Frontend (React)

This is the **frontend** for the Workspace Collaboration Platform, built with React. It provides a modern, modular dashboard for workspace, team, AI, and API key management.

## Features

- **User Authentication**: Email/password and OAuth (Google, LinkedIn, Facebook)
- **Workspace Management**: Create, edit, delete, and switch between workspaces
- **Team Management**: Invite members, manage roles (Admin, Editor, Viewer), accept/decline invitations
- **Role-based Access**: Only Admins can edit roles or remove members (except Admins themselves)
- **AI Content Generation**: Placeholder for AI content and prompt templates
- **API Key Management**: Placeholder for managing API keys
- **Subscription Management**: View current plan, usage stats, and upgrade (UI ready for payment integration)

## Project Structure

```
src/
  pages/
    dashboard/
      components/    # Modular UI components (Header, Team, AI, API Key)
    auth/            # Auth pages (SignIn, SignUp, OAuthSuccess, etc)
  api.js             # API base URL
  App.js             # Main router
```

## Setup & Running

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Create a `.env` file in the `client` directory:
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### 3. Start the frontend
```bash
npm start
```
- The app will run at [http://localhost:3000](http://localhost:3000)

## Usage
- Register or sign in (email/password or OAuth)
- Create and manage workspaces
- Invite team members and manage their roles
- Accept invitations via email links
- Use the dashboard for AI content, prompt templates, and API key management
- View and upgrade your subscription plan

## Development Notes
- All API calls are made to the backend at `REACT_APP_API_BASE_URL`
- Modular components are in `dashboard/components/` for easy maintenance
- Role-based UI logic is enforced in the frontend, but always validate on the backend as well

# AiWorkspace-Client
