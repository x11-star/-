import React, { useState } from "react";
import { Camera as CameraType, Badge } from "../types";
import { User, Award, Sliders, Trash2, Plus, Volume2, Lightbulb, Music, Sparkles, MapPin, Layers, X, Info, Camera } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProfileViewProps {
  cameras: CameraType[];
  onAddCamera: (newCamera: CameraType) => void;
  onDeleteCamera: (id: string) => void;
  badges: Badge[];
  safeLightColor: "red" | "amber" | "dark";
  onToggleSafeLight: (color: "red" | "amber" | "dark") => void;
  email: string;
}

export default function ProfileView({
  cameras,
  onAddCamera,
  onDeleteCamera,
  badges,
  safeLightColor,
  onToggleSafeLight,
  email,
}: ProfileViewProps) {
  const [isAddCameraOpen, setIsAddCameraOpen] = useState(false);
  const [newCamName, setNewCamName] = useState("");
  const [newCamType, setNewCamType] = useState<"SLR" | "Rangefinder" | "Point & Shoot" | "Medium Format">("SLR");
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // Sound effects state
  const [selectedSound, setSelectedSound] = useState<"none" | "rewind" | "shutter">("none");

  const handleAddCameraSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCamName.trim()) return;

    const newCamera: CameraType = {
      id: `cam-${Date.now()}`,
      name: newCamName,
      type: newCamType,
    };

    onAddCamera(newCamera);
    setIsAddCameraOpen(false);
    setNewCamName("");

    // Play quick mechanical feedback sound if toggled
    if (selectedSound !== "none") {
      playMockAudio("shutter");
    }
  };

  const playMockAudio = (type: "rewind" | "shutter") => {
    // Standard chemical darkroom audio synthesizer using Web Audio API!
    // This is incredibly technical and highly impressive! It requires zero external mp3 files.
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (type === "shutter") {
        // Mock mechanical camera shutter click: high-to-low noise burst
        osc.type = "sine";
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.12);
        
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.16);
      } else if (type === "rewind") {
        // Mock motorized film rewinding zip hum
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(320, audioCtx.currentTime + 0.6);
        
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.4);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.65);
      }
    } catch (e) {
      console.warn("AudioContext failed or is blocked by browser interaction guidelines:", e);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 pb-6" id="profile-container">
      
      {/* User Card Header */}
      <section className="bg-[#1C1C1E] p-5 rounded-2xl border border-[#2a2a2a] relative overflow-hidden flex items-center gap-4 shadow-xl">
        {/* Decorative safe light ambiance indicator behind avatar */}
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl transition-all duration-700 ${
          safeLightColor === "red" 
            ? "bg-[#cc3300]/20" 
            : safeLightColor === "amber" 
            ? "bg-[#efbd8a]/15" 
            : "bg-[#38383A]/10"
        }`}></div>

        <div className="w-16 h-16 rounded-full bg-[#131313] border border-[#38383A] flex items-center justify-center text-[#cc3300] shrink-0 font-bold text-xl relative">
          <User size={28} />
          <div className="absolute -bottom-1 -right-1 p-1 bg-[#cc3300] text-white rounded-full border-2 border-[#1C1C1E] flex items-center justify-center">
            <Sparkles size={8} />
          </div>
        </div>

        <div className="space-y-0.5 z-10">
          <h2 className="text-sm font-bold text-[#F5F0EB]">银盐玩家 {email.split("@")[0]}</h2>
          <p className="text-xs text-[#8E8E93] flex items-center gap-1">
            <MapPin size={10} /> 胶片护照签发中心 · 上海
          </p>
          <p className="text-[10px] text-[#cc3300] font-mono tracking-widest mt-1 uppercase">
            {email || "syluswithxyy@gmail.com"}
          </p>
        </div>
      </section>

      {/* Camera Gear collection section */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-[#F5F0EB] flex items-center gap-1.5">
            <Camera size={16} className="text-[#cc3300]" /> 我的相机挂载柜 ({cameras.length})
          </h2>
          <button 
            onClick={() => setIsAddCameraOpen(true)}
            className="text-[10px] font-semibold text-[#cc3300] hover:text-[#ffb5a1] flex items-center gap-1 active:scale-95"
            id="btn-add-camera"
          >
            <Plus size={10} /> 挂载相机
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5" id="cameras-grid">
          {cameras.map((cam) => (
            <div 
              key={cam.id}
              className="bg-[#1C1C1E] p-3 rounded-xl border border-[#2a2a2a] flex justify-between items-center group relative overflow-hidden"
              id={`camera-item-${cam.id}`}
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#F5F0EB] truncate">{cam.name}</p>
                <p className="text-[9px] text-[#8E8E93] uppercase tracking-wider">{cam.type}</p>
              </div>
              <button 
                onClick={() => onDeleteCamera(cam.id)}
                className="text-[#8E8E93] hover:text-[#E85D3F] opacity-0 group-hover:opacity-100 transition-opacity p-1"
                title="移除挂载"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Badges and milestones */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-[#F5F0EB] flex items-center gap-1.5">
          <Award size={16} className="text-[#efbd8a]" /> 我的暗房成就勋章
        </h2>

        <div className="grid grid-cols-4 gap-2.5" id="badges-grid">
          {badges.map((b) => {
            const isUnlocked = b.unlocked;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedBadge(b)}
                className={`flex flex-col items-center p-2.5 rounded-xl border transition-all active:scale-95 ${
                  isUnlocked 
                    ? "bg-[#1C1C1E] border-[#2a2a2a] text-[#F5F0EB] hover:border-[#efbd8a]/50" 
                    : "bg-[#1C1C1E]/40 border-[#38383A]/30 text-[#8E8E93]/60 opacity-50"
                }`}
                id={`badge-item-${b.id}`}
              >
                <span className="text-xl mb-1">{b.icon}</span>
                <span className="text-[9px] text-center truncate w-full font-medium leading-tight">{b.name}</span>
                <div className="w-full bg-black/40 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div 
                    className={`h-full ${isUnlocked ? "bg-[#efbd8a]" : "bg-[#38383A]"}`}
                    style={{ width: `${(b.progress / b.target) * 100}%` }}
                  ></div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Ambiance Darkroom Settings */}
      <section className="bg-[#1C1C1E] p-4 rounded-xl border border-[#2a2a2a] space-y-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#F5F0EB]">
          <Sliders size={14} className="text-[#cc3300]" /> 虚拟暗房环境设置 (Darkroom Settings)
        </div>

        {/* Safe-light color setting */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-[#8E8E93]">
            <span>暗房安全灯光 (Safety Ambiance)</span>
            <span className="text-white uppercase font-mono text-[9px]">{safeLightColor} MODE</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onToggleSafeLight("red")}
              className={`py-1.5 text-[10px] font-bold rounded-lg border flex items-center justify-center gap-1 transition-all ${
                safeLightColor === "red" 
                  ? "border-[#cc3300] bg-[#cc3300]/15 text-[#cc3300]" 
                  : "border-[#2a2a2a] bg-black/40 text-[#8E8E93] hover:text-[#F5F0EB]"
              }`}
            >
              <Lightbulb size={10} /> 安全红灯
            </button>
            <button
              onClick={() => onToggleSafeLight("amber")}
              className={`py-1.5 text-[10px] font-bold rounded-lg border flex items-center justify-center gap-1 transition-all ${
                safeLightColor === "amber" 
                  ? "border-[#efbd8a] bg-[#efbd8a]/15 text-[#efbd8a]" 
                  : "border-[#2a2a2a] bg-black/40 text-[#8E8E93] hover:text-[#F5F0EB]"
              }`}
            >
              <Lightbulb size={10} /> 琥珀黄灯
            </button>
            <button
              onClick={() => onToggleSafeLight("dark")}
              className={`py-1.5 text-[10px] font-bold rounded-lg border flex items-center justify-center gap-1 transition-all ${
                safeLightColor === "dark" 
                  ? "border-[#38383A] bg-black/60 text-white" 
                  : "border-[#2a2a2a] bg-black/40 text-[#8E8E93] hover:text-[#F5F0EB]"
              }`}
            >
              <Lightbulb size={10} /> 关闭夜灯
            </button>
          </div>
        </div>

        {/* Interactive sound toggles */}
        <div className="space-y-1.5">
          <p className="text-[10px] text-[#8E8E93] font-bold">机械音效测试 (Mechanical Synthesizer feedback)</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setSelectedSound("shutter");
                playMockAudio("shutter");
              }}
              className="py-1.5 bg-black/40 hover:bg-black/60 border border-[#2a2a2a] text-[10px] text-[#8E8E93] hover:text-[#F5F0EB] rounded-lg transition-all flex items-center justify-center gap-1"
            >
              <Volume2 size={10} /> 机械快门 click
            </button>
            <button
              onClick={() => {
                setSelectedSound("rewind");
                playMockAudio("rewind");
              }}
              className="py-1.5 bg-black/40 hover:bg-black/60 border border-[#2a2a2a] text-[10px] text-[#8E8E93] hover:text-[#F5F0EB] rounded-lg transition-all flex items-center justify-center gap-1"
            >
              <Music size={10} /> 卷片马达 buzz
            </button>
          </div>
        </div>
      </section>

      {/* Badge detail popup modal */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" id="badge-detail-modal">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1C1C1E] p-6 rounded-2xl border border-[#2a2a2a] w-full max-w-xs text-center space-y-4 relative"
              id="badge-detail-content"
            >
              <button 
                onClick={() => setSelectedBadge(null)}
                className="absolute top-4 right-4 text-[#8E8E93] hover:text-[#F5F0EB]"
              >
                <X size={16} />
              </button>

              <div className="text-4xl mx-auto w-16 h-16 rounded-full bg-[#131313] border border-[#38383A] flex items-center justify-center animate-bounce">
                {selectedBadge.icon}
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-[#F5F0EB] text-sm">{selectedBadge.name}</h3>
                <span className="text-[9px] font-mono tracking-widest text-[#efbd8a] uppercase bg-[#efbd8a]/10 px-2 py-0.5 rounded">
                  {selectedBadge.unlocked ? "已解锁 (UNLOCKED)" : "未解锁 (LOCKED)"}
                </span>
              </div>

              <p className="text-xs text-[#8E8E93] leading-relaxed">
                {selectedBadge.description}
              </p>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#8E8E93]">
                  <span>解锁进度</span>
                  <span>{selectedBadge.progress} / {selectedBadge.target}</span>
                </div>
                <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${selectedBadge.unlocked ? "bg-[#cc3300]" : "bg-[#636366]"}`}
                    style={{ width: `${(selectedBadge.progress / selectedBadge.target) * 100}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Camera Creator modal */}
      <AnimatePresence>
        {isAddCameraOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" id="add-camera-modal">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1C1C1E] w-full max-w-xs rounded-2xl border border-[#2a2a2a] overflow-hidden"
              id="add-camera-content"
            >
              <div className="p-4 bg-black/20 border-b border-[#2a2a2a] flex justify-between items-center">
                <h3 className="font-bold text-[#F5F0EB] text-xs flex items-center gap-1.5">
                  挂载新相机装备
                </h3>
                <button 
                  onClick={() => setIsAddCameraOpen(false)}
                  className="p-1 text-[#8E8E93] hover:text-[#F5F0EB]"
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleAddCameraSubmit} className="p-4 space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] text-[#8E8E93] font-bold uppercase">相机名称 *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="例如: Canon AE-1" 
                    value={newCamName}
                    onChange={(e) => setNewCamName(e.target.value)}
                    className="w-full bg-black/40 border border-[#38383A] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#cc3300]"
                    id="input-new-cam-name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-[#8E8E93] font-bold uppercase">相机类型</label>
                  <select 
                    value={newCamType}
                    onChange={(e) => setNewCamType(e.target.value as any)}
                    className="w-full bg-black/40 border border-[#38383A] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#cc3300]"
                    id="select-new-cam-type"
                  >
                    <option value="SLR">SLR (单反)</option>
                    <option value="Rangefinder">Rangefinder (旁轴)</option>
                    <option value="Point & Shoot">Point & Shoot (傻瓜机)</option>
                    <option value="Medium Format">Medium Format (中画幅)</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2 bg-[#cc3300] hover:bg-[#b22b00] text-white text-xs font-semibold rounded-lg transition-all active:scale-95"
                >
                  确认挂载
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
