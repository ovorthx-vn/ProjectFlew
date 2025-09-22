# ProjectFlow

ProjectFlow is a modern, feature-rich application designed to streamline project management and enhance personal productivity. It combines a powerful project tracking system with a dedicated student workspace, all powered by a cutting-edge tech stack.

![ProjectFlow Dashboard](/link here)
*<p align="center">A preview of the ProjectFlow dashboard.</p>*

---

## ✨ Key Features

### Project Management
- **Centralized Dashboard**: View all ongoing projects at a glance with progress bars and key details.
- **Dual Views**: Organize projects in a detailed **Table View** or visualize schedules with an interactive **Timeline View**.
- **Task Management**: Create, assign, and track tasks within each project. Set statuses, start/due dates, and define dependencies between tasks.
- **AI-Powered Suggestions**: Utilize the "Suggest Team" feature to get AI-driven recommendations for task assignments based on team member roles and availability.
- **Mind Mapping**: Brainstorm and structure project ideas visually with the integrated mind map editor.
- **Project Archiving**: Completed projects are automatically moved to an archive, complete with completion notes for future reference.

### Student Workspace
- **Dedicated Workspaces**: Create separate workspaces for different subjects or areas of study.
- **Rich Note-Taking**: A large, fixed-panel text editor for comprehensive note-taking, saved automatically.
- **Quick Notes & Links**: Organize important snippets and external resources with "Quick Notes" and a "Documents" section.
- **Integrated Media**: Embed YouTube videos or playlists directly into your workspace for focused study sessions.
- **CRUD Functionality**: Easily add, edit, and delete workspaces, notes, and links.

### Team & Notifications
- **Team Management**: Add, edit, and manage your team members, including their roles and availability status.
- **Dynamic Search**: Quickly find team members by name or role.
- **Notification Center**: Stay on top of deadlines with a notification popover that highlights projects and tasks due within the next 7 days.
- **Task Calendar**: A calendar view that marks days with task deadlines, with a popover to see details.

### Customization
- **Theme Toggle**: Instantly switch between Light and Dark modes.
- **Font Selection**: Personalize the application's appearance by choosing from a selection of modern, readable fonts.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Integration**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
- **State Management**: React Context API
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js and npm (or yarn/pnpm) installed on your machine.

### Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory:
   ```bash
   cd your-project-name
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Before running the application, you'll need to set up your environment variables. Genkit uses these to connect to the Google AI services.

1. Create a `.env` file in the root of the project.
2. Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3. Add the following line to your `.env` file:
   ```
   GEMINI_API_KEY=YOUR_API_KEY_HERE
   ```

### Running the Application

1. **Start the Genkit Server** (for AI features):
   In a separate terminal, run:
   ```bash
   npm run genkit:watch
   ```
   This will start the Genkit development server and watch for changes in your AI flows.

2. **Start the Next.js Development Server**:
   In another terminal, run:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
