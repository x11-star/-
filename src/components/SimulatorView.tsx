import React, { useState, useRef } from "react";
import { Film, ShotLog } from "../types";
import { Upload, Sliders, Play, RefreshCw, CheckCircle, Image as ImageIcon, Camera, HelpCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface SimulatorViewProps {
  films: Film[];
  onAddShotLog: (log: ShotLog) => void;
  onIncreaseCompared: () => void;
  stats: {
    filmsCount: number;
    shotCount: number;
    comparedCount: number;
  };
}

const PRESET_SCENES = [
  {
    id: "scene-sunset",
    name: "黄金逆光 (日落)",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80",
    description: "具有丰富的暖色调，最适合模拟 Kodak Gold 200 / Portra 400。"
  },
  {
    id: "scene-neon",
    name: "霓虹夜街 (霓虹)",
    url: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=500&q=80",
    description: "赛博朋克冷暖色对比，最适合模拟 CineStill 800T 夜景光晕。"
  },
  {
    id: "scene-forest",
    name: "清晨森林 (日系)",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=500&q=80",
    description: "冷色、绿叶环境，最适合 Fuji Superia 400 的青绿质感。"
  },
  {
    id: "scene-vintage",
    name: "光影建筑 (复古)",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=500&q=80",
    description: "高反差、高明暗对比，最适合 Ilford HP5 Plus 的经典黑白颗粒。"
  }
];

export default function SimulatorView({ films, onAddShotLog, onIncreaseCompared, stats }: SimulatorViewProps) {
  const [selectedScene, setSelectedScene] = useState(PRESET_SCENES[0].url);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [selectedFilmId, setSelectedFilmId] = useState(films[0]?.id || "");
  const [sliderVal, setSliderVal] = useState(50); // Split comparison slider 0 to 100
  const [grainScale, setGrainScale] = useState(0.5); // Custom grain intensity
  const [isSuccessMessageOpen, setIsSuccessMessageOpen] = useState(false);
  const [shutterLog, setShutterLog] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedFilm = films.find(f => f.id === selectedFilmId) || films[0];

  // Image upload handling
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImage(event.target.result as string);
          onIncreaseCompared(); // Increase "compared" stat
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImage(event.target.result as string);
          onIncreaseCompared();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate CSS filter settings based on chosen film
  const getFilterStyle = (film: Film) => {
    if (!film) return {};
    const params = film.simParams;
    let filterString = "";

    if (params.grayscale) {
      filterString += "grayscale(1) ";
    }
    filterString += `contrast(${params.contrast || 1.1}) `;
    filterString += `saturate(${params.saturation || 1.15}) `;
    
    // Warmth mapping to sepia & hue-rotate
    if (params.warmth > 0) {
      filterString += `sepia(${params.warmth * 1.5}%) hue-rotate(${-params.warmth * 0.5}deg) `;
    } else if (params.warmth < 0) {
      // Cool tones mapping
      filterString += `hue-rotate(${Math.abs(params.warmth) * 0.8}deg) saturate(${1 + params.warmth * 0.01}) `;
    }

    return {
      filter: filterString.trim(),
    };
  };

  // Dynamic Tint overlay based on film style params
  const getTintStyle = (film: Film) => {
    if (!film) return {};
    return {
      backgroundColor: film.simParams.tint || "rgba(0,0,0,0)",
      mixBlendMode: "color-burn" as const,
      opacity: 0.65,
    };
  };

  const handleSaveSimulationToPassport = () => {
    if (!selectedFilm) return;

    // Trigger check-in
    const newLog: ShotLog = {
      id: `sim-log-${Date.now()}`,
      filmId: selectedFilm.id,
      filmName: selectedFilm.name,
      cameraName: "Silver Salt 虚拟暗房",
      lens: "35mm f/1.4 Art Sim",
      aperture: "f/1.4",
      shutter: "1/60s",
      location: "数字暗房模拟器",
      notes: shutterLog || `在试拍暗房中使用 ${selectedFilm.name} 进行了色彩对比与实拍模拟。`,
      date: new Date().toLocaleDateString("zh-CN")
    };

    onAddShotLog(newLog);
    onIncreaseCompared();
    setIsSuccessMessageOpen(true);
    setShutterLog("");
    setTimeout(() => setIsSuccessMessageOpen(false), 3000);
  };

  const activeImage = customImage || selectedScene;

  return (
    <div className="w-full max-w-md mx-auto space-y-6 pb-6" id="simulator-container">
      {/* Simulation viewport stage */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-[#F5F0EB]">化学暗房模拟镜 ({selectedFilm?.name})</h2>
          <span className="text-[10px] bg-black border border-[#38383A] text-[#efbd8a] px-2 py-0.5 rounded font-mono">
            GRAIN: {(selectedFilm?.simParams.grain * grainScale * 100).toFixed(0)}%
          </span>
        </div>

        {/* Visual interactive split comparison canvas */}
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative w-full aspect-[3/2] bg-black rounded-xl overflow-hidden shadow-2xl border border-[#2a2a2a] group"
          id="comparison-canvas"
        >
          {/* Base Layer: Original Image */}
          <img 
            src={activeImage} 
            alt="Original" 
            className="absolute inset-0 w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2 left-3 bg-black/60 px-2 py-0.5 rounded text-[9px] font-mono tracking-wider text-[#8E8E93] z-10 select-none">
            ORIGINAL
          </div>

          {/* Top Layer: Film Filtered Image (with dynamic sliding clip path) */}
          <div 
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{
              clipPath: `polygon(0 0, ${sliderVal}% 0, ${sliderVal}% 100%, 0 100%)`
            }}
          >
            <div className="relative w-full h-full">
              {/* Simulated Image */}
              <img 
                src={activeImage} 
                alt="Simulated Film" 
                className="absolute inset-0 w-full h-full object-cover select-none"
                style={getFilterStyle(selectedFilm)}
                referrerPolicy="no-referrer"
              />
              
              {/* Chemical Color Tint overlay */}
              <div 
                className="absolute inset-0"
                style={getTintStyle(selectedFilm)}
              ></div>

              {/* Classic Halation simulation (red glow on heavy lighting) for CineStill */}
              {selectedFilm?.simParams.halation && (
                <div className="absolute inset-0 bg-red-600/10 mix-blend-screen pointer-events-none animate-pulse duration-1000"></div>
              )}

              {/* Authentic Animated Film Grain Overlay */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  backgroundSize: "200px 200px",
                  opacity: (selectedFilm?.simParams.grain || 0.25) * grainScale * 0.7
                }}
              ></div>
            </div>
          </div>
          <div className="absolute top-2 right-3 bg-[#cc3300] px-2 py-0.5 rounded text-[9px] font-mono tracking-wider text-white z-10 select-none">
            {selectedFilm?.name.toUpperCase() || "FILM"}
          </div>

          {/* Real-time slider cursor divider handle */}
          <div 
            className="absolute top-0 bottom-0 w-[1.5px] bg-white z-20 cursor-ew-resize flex items-center justify-center pointer-events-none"
            style={{ left: `${sliderVal}%` }}
          >
            <div className="w-5 h-5 rounded-full bg-white border border-black/20 shadow flex items-center justify-center -translate-x-1/2 select-none">
              <Sliders size={10} className="text-black rotate-90" />
            </div>
          </div>

          {/* Hidden input control mapped overlay */}
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={sliderVal} 
            onChange={(e) => setSliderVal(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            id="simulation-slider"
          />
        </div>

        {/* Action guidelines */}
        <p className="text-[10px] text-[#8E8E93] text-center italic">
          拖动画面左右滑动，对比 原图 与 胶片化学显影 效果
        </p>
      </section>

      {/* Select Film for simulation */}
      <section className="space-y-3">
        <p className="text-[10px] text-[#8E8E93] uppercase font-bold tracking-wider">配比底片</p>
        <div className="grid grid-cols-3 gap-2" id="sim-film-selection">
          {films.map((f) => {
            const isSelected = f.id === selectedFilmId;
            return (
              <button
                key={f.id}
                onClick={() => {
                  setSelectedFilmId(f.id);
                  onIncreaseCompared();
                }}
                className={`py-2 px-1 text-center rounded-lg border text-[11px] font-medium transition-all truncate active:scale-95 ${
                  isSelected 
                    ? "bg-[#cc3300]/10 border-[#cc3300] text-[#cc3300]" 
                    : "bg-[#1C1C1E] border-[#2a2a2a] text-[#8E8E93] hover:text-[#F5F0EB]"
                }`}
                id={`sim-btn-${f.id}`}
              >
                {f.name.replace("Kodak ", "").replace("Fuji ", "").replace("Ilford ", "")}
              </button>
            );
          })}
        </div>
      </section>

      {/* Scene Presets & Custom File Input selection */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <p className="text-[10px] text-[#8E8E93] uppercase font-bold tracking-wider">更换底图场景</p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-[10px] font-semibold text-[#cc3300] hover:text-[#ffb5a1] flex items-center gap-1 active:scale-95"
            id="btn-upload-local"
          >
            <Upload size={10} /> 上传我的照片
          </button>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-4 gap-2" id="sim-presets-grid">
          {PRESET_SCENES.map((p) => {
            const isSelected = selectedScene === p.url && !customImage;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setCustomImage(null);
                  setSelectedScene(p.url);
                  onIncreaseCompared();
                }}
                className={`flex flex-col gap-1 items-center transition-all group ${
                  isSelected ? "opacity-100 scale-100" : "opacity-60 hover:opacity-100"
                }`}
              >
                <div className={`w-full aspect-square rounded-lg overflow-hidden border ${
                  isSelected ? "border-[#cc3300] ring-1 ring-[#cc3300]" : "border-transparent"
                }`}>
                  <img src={p.url} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-[9px] text-center truncate w-full text-[#8E8E93] group-hover:text-[#F5F0EB]">{p.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Lab Settings Tuning */}
      <section className="bg-[#1C1C1E] p-4 rounded-xl border border-[#2a2a2a] space-y-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#F5F0EB]">
          <Sliders size={14} className="text-[#cc3300]" /> 颗粒参数微调 (Granularity Lab)
        </div>
        
        {/* Grain density slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-[#8E8E93]">
            <span>卤化银结晶粗细 (Grain Density)</span>
            <span className="font-mono text-white">{(grainScale * 100).toFixed(0)}%</span>
          </div>
          <input 
            type="range" 
            min="0.1" 
            max="2" 
            step="0.1"
            value={grainScale} 
            onChange={(e) => setGrainScale(Number(e.target.value))}
            className="w-full accent-[#cc3300] h-1 bg-black/50 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Custom description log input */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[10px] text-[#8E8E93] font-bold uppercase">模拟打卡备忘录</label>
          <input
            type="text"
            placeholder="如: 在落日咖啡馆试拍，颗粒完美，红色溢出漂亮！"
            value={shutterLog}
            onChange={(e) => setShutterLog(e.target.value)}
            className="w-full bg-black/40 border border-[#38383A] text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#cc3300]"
            id="sim-log-input"
          />
        </div>

        {/* Action Button: Check-In this simulated film */}
        <button
          onClick={handleSaveSimulationToPassport}
          className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#cc3300] to-[#b22b00] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
          id="btn-save-simulation"
        >
          <CheckCircle size={14} /> 确认显影 · 打卡签入护照
        </button>

        {isSuccessMessageOpen && (
          <div className="p-2 bg-emerald-950/20 border border-emerald-900/40 text-[11px] text-[#47e266] rounded-lg text-center font-medium animate-bounce" id="sim-success-msg">
            🎉 显影成功！已将实拍打卡计入你的胶片护照历史！
          </div>
        )}
      </section>
    </div>
  );
}
