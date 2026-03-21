# SheGuard - City Safety Ecosystem

A comprehensive React-based platform designed to enhance urban safety through intelligent mapping, real-time alerts, and community wellness features. SheGuard integrates a safety map with a wellness chatbot to provide users with a complete safety solution.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5+-646CFF?logo=vite)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🗺️ Safety Map
- Real-time visualization of safe zones and high-risk areas
- Interactive mapping interface for quick navigation
- Location-based safety alerts and recommendations
- Historical data visualization

### 💬 Wellness Chatbot
- AI-powered chat interface for safety advice and guidance
- Mental health support resources
- Emergency contact information
- 24/7 availability for users in need

### 📊 Dashboard
- Personalized safety statistics and insights
- User activity tracking and history
- Risk assessment reports
- Community safety trends

### 📱 Mobile App
- Responsive design optimized for mobile devices
- Push notifications for safety alerts
- Offline functionality support
- Location-based services

### 🎨 Landing Page
- Modern, responsive design
- Feature showcase and testimonials
- Sign-up and authentication
- Statistics and impact metrics

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library for building user interfaces
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Next-generation frontend build tool
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **React Hook Form** - Efficient form handling
- **Tailwind CSS** - Utility-first CSS framework

### UI Components
- **shadcn/ui** - High-quality React components
- **Radix UI** - Unstyled, accessible component primitives
- **Embla Carousel** - Carousel component

### Backend & Database
- **Supabase** - Open-source Firebase alternative
- **PostgreSQL** - Relational database
- **Edge Functions** - Serverless computing

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Unit testing framework
- **PostCSS** - CSS transformation
- **Bun** - Fast JavaScript runtime

## 📁 Project Structure

```
sheguard-city-ecosystem/
├── src/
│   ├── components/
│   │   ├── landing/          # Landing page components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── SafetyMapPreview.tsx
│   │   │   └── WellnessChatbot.tsx
│   │   ├── ui/               # Reusable UI components
│   │   ├── ThemeProvider.tsx # Dark/Light theme provider
│   │   └── NavLink.tsx
│   ├── pages/
│   │   ├── Index.tsx         # Landing page
│   │   ├── Dashboard.tsx     # User dashboard
│   │   ├── MobileApp.tsx     # Mobile app view
│   │   └── NotFound.tsx      # 404 page
│   ├── hooks/                # Custom React hooks
│   ├── integrations/
│   │   └── supabase/         # Supabase client setup
│   ├── lib/                  # Utility functions
│   ├── assets/               # Images and static files
│   ├── App.tsx               # Root component
│   └── main.tsx              # Application entry point
├── supabase/
│   ├── functions/            # Edge functions
│   │   └── wellness-chat/    # Chatbot API
│   └── migrations/           # Database migrations
├── public/                   # Static assets
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind CSS config
└── tsconfig.json            # TypeScript config
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** or **Bun** runtime
- **npm** or **bun** package manager
- A Supabase account (free tier available)
- Git for version control

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/mrigeshkoyande/She-guard.git
   cd She-guard
   ```

2. **Install dependencies**
   ```sh
   # Using npm
   npm install
   
   # Or using bun
   bun install
   ```

3. **Set up environment variables**
   ```sh
   # Create a .env file in the root directory
   cp .env.example .env.local
   ```
   
   Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Start the development server**
   ```sh
   npm run dev
   # or
   bun run dev
   ```
   
   The application will be available at `http://localhost:5173`

## 💻 Development

### Running the Development Server
```sh
npm run dev
```

### Code Linting
```sh
npm run lint
```

### View Build Preview
```sh
npm run preview
```

### Code Formatting
The project uses ESLint for code quality. Ensure all code follows the established conventions.

## 🏗️ Building for Production

```sh
# Create an optimized production build
npm run build

# Preview the production build locally
npm run preview
```

The build output will be in the `dist/` directory.

## ✅ Testing

Run the test suite:
```sh
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

Tests are written using **Vitest** and located in `src/test/`.

## 🤝 Contributing

We welcome contributions to SheGuard! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```sh
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**
   ```sh
   git commit -m "feat: description of your changes"
   ```
4. **Push to your branch**
   ```sh
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**

### Development Guidelines
- Write clean, readable code
- Use TypeScript for type safety
- Follow the existing code structure
- Add tests for new features
- Update README for significant changes
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Author

**Mrigesh Koyande**
- GitHub: [@mrigeshkoyande](https://github.com/mrigeshkoyande)
- Email: Contact via GitHub

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database and authentication by [Supabase](https://supabase.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For support, please open an issue on the [GitHub repository](https://github.com/mrigeshkoyande/She-guard/issues)

---

**Made with ❤️ for urban safety**

## 📸 Screenshots

### Dashboard
<img width="1894" height="866" alt="Screenshot 2026-03-10 102741" src="https://github.com/user-attachments/assets/887713b5-61ba-4db0-9b7c-9ec21cea9e9c" />

### Dashboard Ecosystem
<img width="1898" height="869" alt="Screenshot 2026-03-10 102820" src="https://github.com/user-attachments/assets/9a900bb5-f239-4016-98db-792b2a54e6cc" />

### Chatbot
<img width="1903" height="874" alt="Screenshot 2026-03-10 102854" src="https://github.com/user-attachments/assets/53f0201d-98df-48bf-84e1-56ea39388fa5" />

### Realtime City Navigation Map for Better Safety
<img width="1902" height="870" alt="Screenshot 2026-03-10 102923" src="https://github.com/user-attachments/assets/20f3d5a9-7318-4ac9-9c92-bca4ce2247b4" />

### Safety Heat Map
<img width="1894" height="868" alt="Screenshot 2026-03-10 102956" src="https://github.com/user-attachments/assets/ff9abed5-105f-476e-8627-1552d6f27502" />

### Crime Analysis
<img width="1890" height="867" alt="Screenshot 2026-03-10 103458" src="https://github.com/user-attachments/assets/efbe2a35-ada2-4a58-8e5d-5412e538db9a" />

### Emergency Alert
<img width="1887" height="864" alt="Screenshot 2026-03-10 103512" src="https://github.com/user-attachments/assets/aec41328-e2cb-48f2-aa31-f7b48f450ce5" />

### Community Report
<img width="1893" height="869" alt="Screenshot 2026-03-10 103529" src="https://github.com/user-attachments/assets/03e394c6-e622-4f6f-9e89-70bf3e0dd80f" />

### Safety Trends
<img width="1886" height="868" alt="Screenshot 2026-03-10 103549" src="https://github.com/user-attachments/assets/2ae5716f-94ce-42d2-b3b1-e4b9a8c22725" />

### Mobile App Start Mode
<img width="1911" height="869" alt="Screenshot 2026-03-10 103642" src="https://github.com/user-attachments/assets/ca75d58e-6254-45f7-9033-afcc30062522" />

### Mobile App Home Page
<img width="1919" height="872" alt="Screenshot 2026-03-10 103654" src="https://github.com/user-attachments/assets/067f3f6a-eb9b-4bdd-985c-abb1624f93d9" />

### Mobile App Emergency Page
<img width="1905" height="864" alt="Screenshot 2026-03-10 103709" src="https://github.com/user-attachments/assets/7f7fd471-382d-401b-9a64-06b81f27e6ce" />

### Mobile App Safe Routes Mode
<img width="1906" height="868" alt="Screenshot 2026-03-10 103754" src="https://github.com/user-attachments/assets/926e0f8b-65a0-4227-8cff-1c18cea159c2" />

### Mobile App Safety Map Mode
<img width="1919" height="867" alt="Screenshot 2026-03-10 103806" src="https://github.com/user-attachments/assets/91d8884f-b773-48a9-a5cf-3ef2d4c9e6de" />

### Mobile App Guidance Call / Emergency Call
<img width="1909" height="869" alt="Screenshot 2026-03-10 103816" src="https://github.com/user-attachments/assets/a3a225fb-d35e-4cf1-a475-7aeb88602376" />

### Mobile App Report Location
<img width="1908" height="867" alt="Screenshot 2026-03-10 103833" src="https://github.com/user-attachments/assets/f9662c0d-da8a-472e-aa4c-a16519196f81" />

### Mobile App Report Location - Reported Well
<img width="1906" height="870" alt="Screenshot 2026-03-10 103912" src="https://github.com/user-attachments/assets/5143a707-cd69-492b-b789-6f9ab4e7b46b" />

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
Dashbord 
<img width="1894" height="866" alt="Screenshot 2026-03-10 102741" src="https://github.com/user-attachments/assets/887713b5-61ba-4db0-9b7c-9ec21cea9e9c" />
Dashbord Ecosystem 
<img width="1898" height="869" alt="Screenshot 2026-03-10 102820" src="https://github.com/user-attachments/assets/9a900bb5-f239-4016-98db-792b2a54e6cc" />
Chatbot 
<img width="1903" height="874" alt="Screenshot 2026-03-10 102854" src="https://github.com/user-attachments/assets/53f0201d-98df-48bf-84e1-56ea39388fa5" />
Realtime city navigation map for better safty 
<img width="1902" height="870" alt="Screenshot 2026-03-10 102923" src="https://github.com/user-attachments/assets/20f3d5a9-7318-4ac9-9c92-bca4ce2247b4" />
Safty Heat map 
<img width="1894" height="868" alt="Screenshot 2026-03-10 102956" src="https://github.com/user-attachments/assets/ff9abed5-105f-476e-8627-1552d6f27502" />
Crime Ananaliys 
<img width="1890" height="867" alt="Screenshot 2026-03-10 103458" src="https://github.com/user-attachments/assets/efbe2a35-ada2-4a58-8e5d-5412e538db9a" />
Emergency Alert 
<img width="1887" height="864" alt="Screenshot 2026-03-10 103512" src="https://github.com/user-attachments/assets/aec41328-e2cb-48f2-aa31-f7b48f450ce5" />
Comunity report 
<img width="1893" height="869" alt="Screenshot 2026-03-10 103529" src="https://github.com/user-attachments/assets/03e394c6-e622-4f6f-9e89-70bf3e0dd80f" />
Saftey Trends 
<img width="1886" height="868" alt="Screenshot 2026-03-10 103549" src="https://github.com/user-attachments/assets/2ae5716f-94ce-42d2-b3b1-e4b9a8c22725" />
Mobile App mode Start mode 
<img width="1911" height="869" alt="Screenshot 2026-03-10 103642" src="https://github.com/user-attachments/assets/ca75d58e-6254-45f7-9033-afcc30062522" />
Mobile App Home Page 
<img width="1919" height="872" alt="Screenshot 2026-03-10 103654" src="https://github.com/user-attachments/assets/067f3f6a-eb9b-4bdd-985c-abb1624f93d9" />
Mobile App mode emergency page 
<img width="1905" height="864" alt="Screenshot 2026-03-10 103709" src="https://github.com/user-attachments/assets/7f7fd471-382d-401b-9a64-06b81f27e6ce" />
Mobile App mode safe Routes mode 
<img width="1906" height="868" alt="Screenshot 2026-03-10 103754" src="https://github.com/user-attachments/assets/926e0f8b-65a0-4227-8cff-1c18cea159c2" />
Mobile App mode Safty Map mode 
<img width="1919" height="867" alt="Screenshot 2026-03-10 103806" src="https://github.com/user-attachments/assets/91d8884f-b773-48a9-a5cf-3ef2d4c9e6de" />
Mobile App Mode Guidance Call/ Emergency call 
<img width="1909" height="869" alt="Screenshot 2026-03-10 103816" src="https://github.com/user-attachments/assets/a3a225fb-d35e-4cf1-a475-7aeb88602376" />
Mobile App mode Repote location 
<img width="1908" height="867" alt="Screenshot 2026-03-10 103833" src="https://github.com/user-attachments/assets/f9662c0d-da8a-472e-aa4c-a16519196f81" />
Mobile App mode Repote location Repoted well 
<img width="1906" height="870" alt="Screenshot 2026-03-10 103912" src="https://github.com/user-attachments/assets/5143a707-cd69-492b-b789-6f9ab4e7b46b" />

