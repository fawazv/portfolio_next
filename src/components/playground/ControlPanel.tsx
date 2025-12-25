
import { motion } from 'framer-motion';
import { Camera, CameraOff, Palette, Settings2, Sparkles, Heart, Flower2, Orbit, Smile, Globe, HelpCircle } from 'lucide-react';

interface ControlPanelProps {
  isCameraActive: boolean;
  onToggleCamera: () => void;
  currentTemplate: string;
  onTemplateChange: (template: string) => void;
  onColorChange: (color: string) => void;
  onShowTutorial: () => void;
}

export default function ControlPanel({
  isCameraActive,
  onToggleCamera,
  currentTemplate,
  onTemplateChange,
  onColorChange,
  onShowTutorial,
}: ControlPanelProps) {
  const templates = [
    { id: 'sphere', icon: Globe, label: 'Sphere' },
    { id: 'heart', icon: Heart, label: 'Love' },
    { id: 'flower', icon: Flower2, label: 'Nature' },
    { id: 'saturn', icon: Orbit, label: 'Cosmos' },
    { id: 'buddha', icon: Smile, label: 'Peace' },
    { id: 'fireworks', icon: Sparkles, label: 'Boom' },
  ];

  const colors = [
    '#ff4d4d', // Red
    '#ff9f43', // Orange
    '#feca57', // Yellow
    '#54a0ff', // Blue
    '#5f27cd', // Purple
    '#1dd1a1', // Teal
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-4 right-4 z-[9999] p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 w-64 text-white font-sans pointer-events-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Settings2 size={16} />
          Controls
        </h3>
        <div className="flex items-center gap-2">
        <button
          onClick={onToggleCamera}
          className={`
            p-3 rounded-full transition-all duration-300 flex items-center justify-center gap-2
            ${isCameraActive 
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 ring-1 ring-red-500/50' 
              : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 ring-1 ring-cyan-500/50'
            }
          `}
          title={isCameraActive ? "Stop Camera" : "Start Camera"}
        >
          {isCameraActive ? <CameraOff size={20} /> : <Camera size={20} />}
          <span className="text-sm font-medium hidden md:block">
            {isCameraActive ? 'Stop' : 'Start'}
          </span>
        </button>

        <button
          onClick={onShowTutorial}
          className="p-3 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors ring-1 ring-white/10"
          title="Gestures Help"
        >
          <HelpCircle size={20} />
        </button>
      </div>
      </div>

      <div className="mb-4">
        <label className="text-xs text-white/50 mb-2 block">Shape</label>
        <div className="grid grid-cols-5 gap-2">
          {templates.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTemplateChange(id)}
              className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                currentTemplate === id 
                  ? 'bg-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' 
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-white/50 mb-2 block flex items-center gap-2">
          <Palette size={12} />
          Color
        </label>
        <div className="flex justify-between">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className="w-6 h-6 rounded-full border border-white/10 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      
      {!isCameraActive && (
        <div className="mt-4 text-[10px] text-white/30 text-center border-t border-white/5 pt-2">
          Mouse interaction enabled
        </div>
      )}
    </motion.div>
  );
}
