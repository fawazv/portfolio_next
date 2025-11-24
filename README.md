# Mohammed Fawaz - Full Stack Developer Portfolio

A modern, high-performance portfolio website built with Next.js 16, Tailwind CSS v4, and React Three Fiber.

![Portfolio Preview](https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4)

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (Alpha)
- **3D Graphics:** [React Three Fiber](https://docs.pmnd.rs/react-three-fiber), [Drei](https://github.com/pmndrs/drei)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Language:** TypeScript

## ✨ Features

- **Single Page Application (SPA):** Smooth scroll navigation with snap-scrolling sections.
- **3D Hero Section:** Interactive "Liquid Crystal" sphere with mouse-following distortion and hover effects.
- **Particle Background:** Global 3D particle system that persists across sections.
- **macOS-style Dock:** Floating navigation dock with magnification effects.
- **Video Previews:** Project and Skill cards feature video previews on hover.
- **Glassmorphism:** Modern UI design with frosted glass effects and subtle gradients.
- **Responsive Design:** Fully optimized for all device sizes.

## 🛠️ Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/fawazv/portfolio_next.git
    cd portfolio_next
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    *Note: This project uses `tailwindcss@next` and related packages.*

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the result.

## 📁 Project Structure

- `src/app`: App Router pages and layouts.
- `src/components/3d`: 3D components (FluidHero, ParticleBackground).
- `src/components/layout`: Layout components (Navbar).
- `src/components/sections`: Full-screen section components (About, Skills, Projects, Contact).
- `src/components/ui`: Reusable UI components.

## 🎨 Customization

- **Projects:** Update the `projects` array in `src/components/sections/ProjectsSection.tsx`.
- **Skills:** Update the `skills` array in `src/components/sections/SkillsSection.tsx`.
- **Videos:** Replace the placeholder video URLs with your own project demos.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
