'use client';

import { motion } from 'framer-motion';

const skills = {
  "Programming Languages": ["JavaScript (ES6+)", "TypeScript"],
  "Frontend Technologies": ["React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS", "Vite", "Material UI", "Shadcn UI", "Bootstrap", "Framer Motion", "Redux Toolkit", "Context API"],
  "Backend Technologies": ["Node.js", "Express.js", "Nginx", "RESTful APIs"],
  "Database Management": ["MongoDB", "NoSQL", "PostgreSQL", "Mongoose"],
  "Architecture": ["Controller-Service-Repository", "Microservice", "MVC architecture"],
  "DevOps / Cloud": ["CI/CD", "Docker", "RabbitMQ", "AWS EC2", "AWS S3", "Google Cloud", "Firebase"],
  "Tools": ["Postman", "Figma", "REST API", "Git", "VS Code", "Android Studio", "Xcode"],
  "Integrations": ["Razorpay", "Stripe", "Nodemailer", "Socket.io", "WebRTC", "S3", "JWT"]
};

export default function SkillsSection() {
  return (
    <section id="skills" className="min-h-screen w-full snap-start flex items-center justify-center bg-transparent py-24 z-10 relative">
      <div className="container mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-16 text-center"
        >
          Technical <span className="text-zinc-500">Arsenal.</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(skills).map(([category, items], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-cyan-400">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span 
                    key={skill}
                    className="px-3 py-1 text-sm bg-zinc-900/50 border border-white/10 rounded-full text-zinc-300 hover:text-white hover:border-white/30 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
