import React from 'react';

interface SkillsProps {
  skills: {
    Frontend: string[];
    Backend: string[];
    Database: string[];
    DevOps_Cloud: string[];
  };
}

export default function SkillsGrid({ skills }: SkillsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(skills).map(([category, items]) => (
        <div key={category} className="p-6 rounded-xl bg-zinc-900/20 border border-white/5 hover:border-white/10 transition-colors">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4 capitalize">
            {category.replace('_', ' & ')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {items.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-sm rounded-md bg-zinc-800/50 text-zinc-300 border border-white/5 hover:bg-zinc-800 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
