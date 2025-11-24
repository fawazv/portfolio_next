'use client';

import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

const projects = [
  {
    name: "Elite Hotel",
    description: "Microservices-based Hotel Management System to streamline reservations, billing, housekeeping, user management and guest management with secure authentication and integrated payments.",
    tech: ["Node.js", "Express.js", "TypeScript", "MongoDB", "React.js", "Redux", "Stripe", "Razorpay", "Docker", "Kubernetes", "GitHub Actions", "JWT"],
    github: "#",
    live: "#",
    highlight: "Built and deployed 5+ microservices using Node.js, Express, and MongoDB.",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    name: "Nxtcart",
    description: "Full-stack e-commerce application delivering a scalable shopping platform with customer features, authentication, payments, and an admin dashboard.",
    tech: ["Next.js", "React", "MongoDB", "Tailwind CSS", "Shadcn UI", "Zustand", "NextAuth", "Stripe", "PayPal"],
    github: "#",
    live: "#",
    highlight: "Implemented authentication using Auth.js (Google OAuth, Magic Link).",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    name: "Dropbox Clone",
    description: "Dropbox-inspired file storage app built with Next.js, TypeScript, and Firebase, featuring authentication, file operations, and responsive dark/light UI.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Clerk", "Firebase", "Firestore", "Zustand"],
    github: "#",
    live: "#",
    highlight: "Integrated Firebase Storage + Firestore for file uploads and metadata.",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    name: "Blog Microservices Platform",
    description: "Blog platform with Node.js, Express, MongoDB, RabbitMQ, and Docker, featuring microservices, JWT authentication, and CI/CD.",
    tech: ["Node.js", "Express", "TypeScript", "MongoDB", "RabbitMQ", "JWT", "Docker", "GitHub Actions"],
    github: "#",
    live: "#",
    highlight: "Built User, Post, and Comment services with API Gateway and RabbitMQ communication.",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  }
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="min-h-screen w-full snap-start flex items-center justify-center bg-transparent py-24 z-10 relative">
      <div className="container mx-auto px-6 h-full flex flex-col justify-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-16"
        >
          Selected <span className="text-zinc-500">Works.</span>
        </motion.h2>

        <div className="flex overflow-x-auto pb-8 gap-8 snap-x snap-mandatory scrollbar-hide">
          {projects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="min-w-[400px] md:min-w-[500px] snap-center bg-zinc-900/30 border border-white/5 rounded-3xl p-6 backdrop-blur-sm flex flex-col justify-between group hover:border-white/10 transition-colors"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">{project.name}</h3>
                  <div className="flex gap-4">
                    <a href={project.github} className="text-zinc-400 hover:text-white transition-colors"><Github size={20} /></a>
                    <a href={project.live} className="text-zinc-400 hover:text-white transition-colors"><ExternalLink size={20} /></a>
                  </div>
                </div>

                {/* Video Preview */}
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-black/50 border border-white/5 relative group-hover:border-white/20 transition-colors">
                  <video 
                    src={project.video}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    muted
                    loop
                    playsInline
                    autoPlay
                  />
                </div>
                
                <p className="text-zinc-400 leading-relaxed text-sm">{project.description}</p>
                
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-xs text-zinc-300 italic">"{project.highlight}"</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.tech.slice(0, 6).map((tech) => (
                  <span key={tech} className="text-xs px-2 py-1 bg-zinc-800 rounded-md text-zinc-400">
                    {tech}
                  </span>
                ))}
                {project.tech.length > 6 && (
                  <span className="text-xs px-2 py-1 bg-zinc-800 rounded-md text-zinc-400">
                    +{project.tech.length - 6} more
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
