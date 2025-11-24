'use client';

import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Phone } from 'lucide-react';

export default function ContactSection() {
  return (
    <section id="contact" className="h-screen w-full snap-start flex items-center justify-center bg-transparent z-10 relative">
      <div className="container mx-auto px-6 text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
            Let's <span className="text-zinc-500">Connect.</span>
          </h2>
          
          <p className="text-lg text-zinc-400">
            I'm currently open to new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>

          <div className="flex justify-center gap-6">
             <a href="#" className="p-4 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all hover:scale-110">
               <Mail size={24} />
             </a>
             <a href="#" className="p-4 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all hover:scale-110">
               <Linkedin size={24} />
             </a>
             <a href="#" className="p-4 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all hover:scale-110">
               <Github size={24} />
             </a>
             <a href="#" className="p-4 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all hover:scale-110">
               <Phone size={24} />
             </a>
          </div>

          <div className="pt-12">
            <a href="mailto:example@email.com" className="px-8 py-4 rounded-full bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-colors">
              Say Hello
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
