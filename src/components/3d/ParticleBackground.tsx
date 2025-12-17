'use client';

import ParticleSystem from '../playground/ParticleSystem';

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <ParticleSystem />
    </div>
  );
}
