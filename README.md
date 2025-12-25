# Mohammed Fawaz - Full Stack Developer Portfolio

A futuristic, interactive portfolio website built with **Next.js 16**, **Tailwind CSS v4**, and **React Three Fiber**. This project pushes the boundaries of web performance and interactivity, featuring advanced 3D particle systems, physics simulations, and **AI-powered hand gesture controls**.

![Next.js 16](https://img.shields.io/badge/Next.js-16-black) ![React 19](https://img.shields.io/badge/React-19-blue) ![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-cyan) ![R3F](https://img.shields.io/badge/R3F-Fiber-orange) ![MediaPipe](https://img.shields.io/badge/AI-MediaPipe-green)

[**🔴 View Live Demo**](https://portfolio-next-three-rose-78.vercel.app/)

## ✨ Features

### 🌌 Immersive 3D Experience
- **Fluid Hero Sphere**: An interactive "Liquid Crystal" sphere powered by custom GLSL shaders that reacts to mouse movement and distortion.
- **Advanced Particle Engine**: A global system of **3,000+ particles** that morphs into different 3D shapes (Sphere, Saturn, Flower, Cube, Heart) as you navigate through sections.
- **Content-Aware Transitions**: The particle system automatically changes specific shapes to match the context of the current section (e.g., "Saturn" for the Global/About section, "Cube" for Projects).

### 🖐️ AI Gesture Control (Hand Tracking)
Interact with the website using your hands via the webcam. Powered by **MediaPipe** tasks-vision.
- **Touch-Free Scrolling**: Raise a **Peace Sign (✌️)** to grab and scroll the page vertically.
- **Celebration Mode**: Give a **Thumbs Up (👍)** to trigger a confetti explosion.
- **Shape Shfting**: Show the **"Call Me" (🤙)** gesture (Thumb & Pinky extended) to force the particles into a **Heart** shape.
- **Smart Detection**: Includes debounce and smoothing algorithims to prevent accidental triggers.

### 🎨 Modern UI/UX
- **macOS-Style Dock**: A floating navigation dock with distinct magnification and hover effects using **Framer Motion**.
- **Glassmorphism**: Extensive use of frosted glass (backdrop-filter), subtle gradients, and noise textures.
- **Snap Scrolling**: Smooth, full-screen section transitions with CSS scroll-snap.
- **Custom Cursor**: A stylized cursor that complements the dark aesthetic.

## 🚀 Tech Stack

- **Framework**: [Next.js 16 (App Router & Turbopack)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4 (Alpha)](https://tailwindcss.com/)
- **3D Graphics**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber), [Drei](https://github.com/pmndrs/drei), Custom GLSL Shaders
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Computer Vision**: [MediaPipe](https://developers.google.com/mediapipe) (Hand Tracking)
- **Language**: TypeScript

## 🕹️ Controls

### Mouse
- **Move**: Distorts 3D objects and interacts with particles.
- **Click**: Repels particles.

### Hand Gestures (Webcam Required)
| Gesture | Action |
| :--- | :--- |
| **✌️ Peace Sign** | **Scroll Mode**: Hold to grab the page, move hand up/down to scroll. |
| **👍 Thumbs Up** | **Celebration**: Triggers a confetti animation. |
| **🤙 Call Me** | **Shape Shift**: Morphs components into a Heart shape. |

## 🛠️ Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/fawazv/portfolio_next.git
    cd portfolio_next
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # Note: Requires Node.js 18+ for Next.js 16
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open your browser:**
    Navigate to [http://localhost:3000](http://localhost:3000). To test gesture controls, ensure you grant camera permissions.

## 📁 Project Structure

```bash
src/
├── app/                  # Next.js App Router pages
├── components/
│   ├── 3d/               # R3F components (FluidHero, ParticleBackground)
│   ├── layout/           # Navbar/Dock
│   ├── playground/       # Advanced Gesture & Particle Logic
│   │   ├── GestureScroll.tsx       # Scroll logic
│   │   ├── GestureCelebration.tsx  # Confetti logic
│   │   ├── ParticleEngine.tsx      # Core particle physics
│   │   └── HandTracker.ts          # MediaPipe integration
│   ├── sections/         # Full-screen content sections
│   └── ui/               # Reusable primitives
└── hooks/                # Custom hooks (useHandInput)
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
