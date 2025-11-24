'use client';

import { motion } from 'framer-motion';

const education = [
  {
    degree: "Bachelor of Commerce (Co-operation)",
    school: "Calicut University",
    year: "July 2020 - March 2023"
  },
  {
    degree: "Higher Secondary (Commerce with Computer Application)",
    school: "GHSS Tirurangadi",
    year: "July 2018 - April 2020"
  }
];

export default function AboutSection() {
  return (
    <section id="about" className="h-screen w-full snap-start flex items-center justify-center relative overflow-hidden bg-transparent z-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
            About <span className="text-zinc-500">Me.</span>
          </h2>
          
          <p className="text-lg text-zinc-400 leading-relaxed">
            Enthusiastic and committed self-taught Full Stack Developer with expertise in TypeScript, React.js, Next.js, Node.js, Express.js, and MongoDB. Experienced in building scalable web applications and microservices with a focus on clean code, performance, and maintainability. Strong problem-solving skills with a commitment to continuous learning and delivering high-quality solutions in fast-paced environments.
          </p>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Education</h3>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="border-l-2 border-zinc-800 pl-4">
                  <h4 className="text-white font-medium">{edu.degree}</h4>
                  <p className="text-sm text-zinc-500">{edu.school}</p>
                  <p className="text-xs text-zinc-600">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Visual/Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative h-[400px] w-full rounded-3xl bg-zinc-900/30 border border-white/5 backdrop-blur-sm flex items-center justify-center overflow-hidden"
        >
           <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
           <div className="text-center space-y-2 z-10">
             <span className="text-6xl font-bold text-white">2+</span>
             <p className="text-zinc-400 uppercase tracking-widest text-sm">Years Experience</p>
           </div>
        </motion.div>

      </div>
    </section>
  );
}
