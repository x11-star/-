import React, { useState } from "react";
import { Film, ShotLog } from "../types";
import { DEFAULT_FILMS } from "../constants/films";
import { Camera, Heart, Plus, Calendar, Clock, MapPin, Eye, Film as FilmIcon, CheckCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PassportViewProps {
  films: Film[];
  onAddCustomFilm: (newFilm: Film) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  shotLogs: ShotLog[];
  onAddShotLog: (log: ShotLog) => void;
  stats: {
    filmsCount: number;
    shotCount: number;
    comparedCount: number;
  };
}

export default function PassportView({
  films,
  onAddCustomFilm,
  favorites,
  onToggleFavorite,
  shotLogs,
  onAddShotLog,
  stats,
}: PassportViewProps) {
  const [activeTab, setActiveTab] = useState<"wall" | "history">("wall");
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddLogModalOpen, setIsAddLogModalOpen] = useState(false);

  // Custom film form states
  const [customName, setCustomName] = useState("");
  const [customBrand, setCustomBrand] = useState("Kodak");
  const [customIso, setCustomIso] = useState(400);
  const [customType, setCustomType] = useState<"Color Negative" | "B&W" | "Slide">("Color Negative");
  const [customFormat, setCustomFormat] = useState("35mm");
  const [customDesc, setCustomDesc] = useState("");
  const [customAdvice, setCustomAdvice] = useState("");
  
  // Custom shot log form states
  const [logFilmId, setLogFilmId] = useState("");
  const [logCamera, setLogCamera] = useState("");
  const [logLens, setLogLens] = useState("");
  const [logAperture, setLogAperture] = useState("f/2.8");
  const [logShutter, setLogShutter] = useState("1/125s");
  const [logLocation, setLogLocation] = useState("");
  const [logNotes, setLogNotes] = useState("");

  const handleAddCustomFilmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newFilm: Film = {
      id: `custom-${Date.now()}`,
      name: customName,
      brand: customBrand,
      iso: Number(customIso),
      type: customType,
      format: customFormat,
      description: customDesc || "自定义胶卷描述...",
      styleAdvice: customAdvice || "建议在良好的光源环境下拍摄。",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoDLe_nSBPvt4XhjwjzvQW0IGe_KEsZLQ8-Ltymg9UKIE-CcN-3vDuhjEedBAEnDnyJfyEnAzFwYTg2WwomusraX9UCDoCiLOd8bFVfTnx5gOJkUCUObyYWR57tyJj8p8Wj6JIr-Po26qHHINGx5tgCNIFXEidQonkukOqaKwzKvm9HnreiYbv4dCX2HgknymzzEAw-4PCEwgSpZnOOs8V5BvpT1qMxjh8oRBUd-NGCErVQZ2tNWNbdq6iqFx3RCqfqg6DYCL1mQD4", // Default fallback Portra canister image
      isCustom: true,
      simParams: {
        contrast: 1.1,
        saturation: 1.1,
        warmth: 5,
        tint: "rgba(255, 255, 255, 0.05)",
        grain: 0.25,
        grayscale: customType === "B&W",
      },
    };

    onAddCustomFilm(newFilm);
    setIsAddModalOpen(false);
    
    // Clear form
    setCustomName("");
    setCustomDesc("");
    setCustomAdvice("");
  };

  const handleAddLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logFilmId || !logCamera) return;

    const selected = films.find(f => f.id === logFilmId);

    const newLog: ShotLog = {
      id: `log-${Date.now()}`,
      filmId: logFilmId,
      filmName: selected?.name || "未知胶卷",
      cameraName: logCamera,
      lens: logLens,
      aperture: logAperture,
      shutter: logShutter,
      location: logLocation,
      notes: logNotes,
      date: new Date().toLocaleDateString("zh-CN"),
    };

    onAddShotLog(newLog);
    setIsAddLogModalOpen(false);

    // Clear form
    setLogCamera("");
    setLogLens("");
    setLogLocation("");
    setLogNotes("");
  };

  return (
    <div className="w-full max-w-md mx-auto" id="passport-container">
      {/* StatsCard with precise tilt visual effect from guidelines */}
      <section 
        className="h-stats-card-height bg-[#1C1C1E] rounded-xl flex items-center mb-6 overflow-hidden border border-[#2a2a2a] transition-all duration-300"
        id="stats-card"
      >
        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold font-mono text-[#F5F0EB]" id="stat-films-count">{stats.filmsCount}</span>
          <span className="text-xs text-[#8E8E93]" id="stat-films-label">收藏胶卷</span>
        </div>
        <div className="h-10 w-[0.5px] bg-[#38383A]"></div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold font-mono text-[#F5F0EB]" id="stat-shots-count">{stats.shotCount}</span>
          <span className="text-xs text-[#8E8E93]" id="stat-shots-label">已打卡</span>
        </div>
        <div className="h-10 w-[0.5px] bg-[#38383A]"></div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold font-mono text-[#F5F0EB]" id="stat-compared-count">{stats.comparedCount}</span>
          <span className="text-xs text-[#8E8E93]" id="stat-compared-label">对比过</span>
        </div>
      </section>

      {/* Segmented Tab */}
      <nav className="flex h-11 bg-[#1C1C1E] rounded-full p-1 mb-6 border border-[#2a2a2a]" id="segmented-tab">
        <button 
          onClick={() => setActiveTab("wall")}
          className={`flex-1 rounded-full text-sm font-medium flex items-center justify-center transition-all ${
            activeTab === "wall" 
              ? "bg-[#cc3300] text-white shadow-md" 
              : "text-[#8E8E93] hover:text-[#F5F0EB]"
          }`}
          id="btn-tab-wall"
        >
          收藏墙
        </button>
        <button 
          onClick={() => setActiveTab("history")}
          className={`flex-1 rounded-full text-sm font-medium flex items-center justify-center transition-all ${
            activeTab === "history" 
              ? "bg-[#cc3300] text-white shadow-md" 
              : "text-[#8E8E93] hover:text-[#F5F0EB]"
          }`}
          id="btn-tab-history"
        >
          已拍清单
        </button>
      </nav>

      {/* Content based on tab */}
      <AnimatePresence mode="wait">
        {activeTab === "wall" ? (
          <motion.div 
            key="wall-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
            id="wall-content"
          >
            {/* Film Grid */}
            <div className="grid grid-cols-3 gap-3" id="film-grid">
              {films.map((film) => {
                const isFav = favorites.includes(film.id);
                return (
                  <div 
                    key={film.id}
                    className="flex flex-col gap-1.5 group cursor-pointer active:scale-95 transition-transform"
                    id={`film-card-${film.id}`}
                  >
                    <div 
                      onClick={() => setSelectedFilm(film)}
                      className="w-full aspect-[3/2] bg-[#1C1C1E] rounded-lg overflow-hidden border border-transparent group-hover:border-[#cc3300] transition-colors relative shadow-sm"
                    >
                      <img 
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          isFav ? "grayscale-0" : "grayscale group-hover:grayscale-0"
                        }`}
                        src={film.imageUrl} 
                        alt={film.name}
                        referrerPolicy="no-referrer"
                      />
                      {/* Brand Label Accent */}
                      <span className="absolute top-1 left-1 px-1 py-0.5 text-[8px] tracking-widest font-mono bg-black/60 text-white rounded scale-90 origin-top-left uppercase">
                        {film.brand}
                      </span>
                      
                      {/* Favorite/Collected Heart Badge overlay */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(film.id);
                        }}
                        className="absolute bottom-1 right-1 p-1 bg-black/40 hover:bg-black/60 rounded-full transition-colors flex items-center justify-center"
                        id={`fav-btn-${film.id}`}
                      >
                        <Heart 
                          size={12} 
                          className={isFav ? "fill-[#E85D3F] text-[#E85D3F]" : "text-white opacity-80"} 
                        />
                      </button>
                    </div>
                    <p className="text-xs font-medium text-[#F5F0EB] text-center truncate px-1">{film.name}</p>
                  </div>
                );
              })}

              {/* Add Button */}
              <div 
                onClick={() => setIsAddModalOpen(true)}
                className="flex flex-col gap-1.5 cursor-pointer active:scale-95 transition-transform"
                id="add-custom-film-card"
              >
                <div className="w-full aspect-[3/2] bg-[#1C1C1E] rounded-lg border border-dashed border-[#38383A] hover:border-[#cc3300] flex items-center justify-center transition-colors">
                  <Plus size={20} className="text-[#8E8E93]" />
                </div>
                <p className="text-xs font-medium text-[#8E8E93] text-center">添加胶卷</p>
              </div>
            </div>

            {/* Empty stats outline matching the mockup */}
            <div className="grid grid-cols-3 gap-3 mt-2 opacity-20" id="empty-placeholders">
              <div className="aspect-[3/2] bg-[#1C1C1E] rounded-lg border border-dashed border-[#38383A]"></div>
              <div className="aspect-[3/2] bg-[#1C1C1E] rounded-lg border border-dashed border-[#38383A]"></div>
              <div className="aspect-[3/2] bg-[#1C1C1E] rounded-lg border border-dashed border-[#38383A]"></div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="history-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
            id="history-content"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-[#8E8E93] tracking-wide">实拍记录 ({shotLogs.length})</h3>
              <button 
                onClick={() => setIsAddLogModalOpen(true)}
                className="text-xs font-semibold text-[#cc3300] hover:text-[#ffb5a1] flex items-center gap-1 active:scale-95 transition-all"
                id="btn-add-shot-log"
              >
                <Plus size={14} /> 新增打卡
              </button>
            </div>

            {shotLogs.length === 0 ? (
              <div className="bg-[#1C1C1E] p-8 rounded-xl text-center border border-[#2a2a2a] space-y-3" id="empty-logs">
                <Camera size={36} className="mx-auto text-[#636366]" />
                <p className="text-sm text-[#8E8E93]">暂无实拍清单。赶紧新增一条打卡或通过“试拍”模拟吧！</p>
              </div>
            ) : (
              <div className="space-y-3" id="shot-logs-list">
                {shotLogs.map((log) => {
                  const matchingFilm = films.find(f => f.id === log.filmId);
                  return (
                    <div 
                      key={log.id}
                      className="bg-[#1C1C1E] p-4 rounded-xl border border-[#2a2a2a] space-y-3 relative group overflow-hidden"
                      id={`shot-log-item-${log.id}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-[#F5F0EB] text-sm">{log.filmName}</h4>
                          <p className="text-xs text-[#8E8E93] flex items-center gap-1 mt-0.5">
                            <Camera size={12} /> {log.cameraName} {log.lens && `· ${log.lens}`}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-[#8E8E93] flex items-center gap-1">
                          <Calendar size={10} /> {log.date}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#8E8E93] bg-black/30 p-2 rounded-lg">
                        {log.aperture && (
                          <span className="flex items-center gap-1 font-mono">
                            <Info size={10} /> 光圈: {log.aperture}
                          </span>
                        )}
                        {log.shutter && (
                          <span className="flex items-center gap-1 font-mono">
                            <Clock size={10} /> 快门: {log.shutter}
                          </span>
                        )}
                        {log.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={10} /> {log.location}
                          </span>
                        )}
                      </div>

                      {log.notes && (
                        <p className="text-xs text-[#e5e2e1] leading-relaxed italic border-l-2 border-[#cc3300] pl-2">
                          “ {log.notes} ”
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Film Detail Modal */}
      <AnimatePresence>
        {selectedFilm && (
          <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" id="film-detail-modal">
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-[#1C1C1E] w-full max-w-md rounded-t-2xl sm:rounded-2xl border border-[#2a2a2a] overflow-hidden"
              id="film-detail-content"
            >
              {/* Cover Image */}
              <div className="h-48 relative">
                <img 
                  src={selectedFilm.imageUrl} 
                  alt={selectedFilm.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] to-transparent"></div>
                <button 
                  onClick={() => setSelectedFilm(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                  id="close-detail-modal"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest bg-[#cc3300] text-white rounded uppercase">
                    {selectedFilm.brand}
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1.5">{selectedFilm.name}</h2>
                </div>
              </div>

              {/* Film specifications */}
              <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-black/20 p-2 rounded-lg">
                    <p className="text-[10px] text-[#8E8E93] uppercase">感光度</p>
                    <p className="text-sm font-bold font-mono text-[#F5F0EB]">ISO {selectedFilm.iso}</p>
                  </div>
                  <div className="bg-black/20 p-2 rounded-lg">
                    <p className="text-[10px] text-[#8E8E93] uppercase">类型</p>
                    <p className="text-sm font-bold text-[#F5F0EB]">{selectedFilm.type}</p>
                  </div>
                  <div className="bg-black/20 p-2 rounded-lg">
                    <p className="text-[10px] text-[#8E8E93] uppercase">格式</p>
                    <p className="text-sm font-bold font-mono text-[#F5F0EB]">{selectedFilm.format}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-[#cc3300] tracking-wider uppercase">底片档案</h4>
                  <p className="text-xs text-[#e5e2e1] leading-relaxed">{selectedFilm.description}</p>
                </div>

                <div className="space-y-1.5 bg-black/20 p-3 rounded-xl border border-[#38383A]/30">
                  <h4 className="text-xs font-bold text-[#efbd8a] tracking-wider uppercase flex items-center gap-1">
                    <Info size={12} /> 大师曝光建议
                  </h4>
                  <p className="text-xs text-[#efbd8a]/90 leading-relaxed">{selectedFilm.styleAdvice}</p>
                </div>

                {/* Favorite Action Toggle */}
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => {
                      onToggleFavorite(selectedFilm.id);
                    }}
                    className={`flex-1 py-2.5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      favorites.includes(selectedFilm.id)
                        ? "bg-[#38383A] text-white border border-[#48484A]"
                        : "bg-gradient-to-r from-[#cc3300] to-[#b22b00] text-white shadow-lg"
                    }`}
                    id="toggle-fav-detail"
                  >
                    <Heart size={14} className={favorites.includes(selectedFilm.id) ? "fill-[#E85D3F] text-[#E85D3F]" : ""} />
                    {favorites.includes(selectedFilm.id) ? "从收藏墙移除" : "加入收藏墙"}
                  </button>

                  <button
                    onClick={() => {
                      setLogFilmId(selectedFilm.id);
                      setSelectedFilm(null);
                      setIsAddLogModalOpen(true);
                    }}
                    className="flex-1 py-2.5 rounded-full bg-[#1C1C1E] border border-[#cc3300] text-[#cc3300] hover:bg-[#cc3300]/10 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
                    id="add-log-from-detail"
                  >
                    <Camera size={14} />
                    记录这次拍摄
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Custom Film Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm" id="add-film-modal">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1C1C1E] w-full max-w-md rounded-2xl border border-[#2a2a2a] overflow-hidden"
              id="add-film-content"
            >
              <div className="p-4 bg-black/20 border-b border-[#2a2a2a] flex justify-between items-center">
                <h3 className="font-bold text-[#F5F0EB] text-sm flex items-center gap-1.5">
                  <FilmIcon size={16} className="text-[#cc3300]" /> 手工制作新胶卷
                </h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 hover:bg-black/40 rounded-full text-[#8E8E93] hover:text-[#F5F0EB]"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddCustomFilmSubmit} className="p-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-[#8E8E93] uppercase font-bold">胶卷名称 *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="例如: Kodak Ektachrome 100" 
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-black/40 border border-[#38383A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cc3300]"
                    id="input-custom-name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8E8E93] uppercase font-bold">品牌</label>
                    <select 
                      value={customBrand}
                      onChange={(e) => setCustomBrand(e.target.value)}
                      className="w-full bg-black/40 border border-[#38383A] rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-[#cc3300]"
                      id="select-custom-brand"
                    >
                      <option value="Kodak">Kodak (柯达)</option>
                      <option value="Fujifilm">Fujifilm (富士)</option>
                      <option value="Ilford">Ilford (伊尔福)</option>
                      <option value="CineStill">CineStill (电影卷)</option>
                      <option value="Foma">Foma (福马)</option>
                      <option value="Lomography">Lomography (乐魔)</option>
                      <option value="Other">Other (其他)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8E8E93] uppercase font-bold">ISO (感光度)</label>
                    <input 
                      type="number" 
                      value={customIso}
                      onChange={(e) => setCustomIso(Number(e.target.value))}
                      className="w-full bg-black/40 border border-[#38383A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cc3300]"
                      id="input-custom-iso"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8E8E93] uppercase font-bold">色彩类型</label>
                    <select 
                      value={customType}
                      onChange={(e) => setCustomType(e.target.value as any)}
                      className="w-full bg-black/40 border border-[#38383A] rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-[#cc3300]"
                      id="select-custom-type"
                    >
                      <option value="Color Negative">Color Negative (彩色负片)</option>
                      <option value="B&W">B&W (黑白胶卷)</option>
                      <option value="Slide">Slide (反转片)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8E8E93] uppercase font-bold">胶卷画幅</label>
                    <input 
                      type="text" 
                      value={customFormat}
                      onChange={(e) => setCustomFormat(e.target.value)}
                      className="w-full bg-black/40 border border-[#38383A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cc3300]"
                      id="input-custom-format"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#8E8E93] uppercase font-bold">胶片美学描述</label>
                  <textarea 
                    placeholder="简要写写它的色调、对比度或者颗粒感特点..."
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    rows={2}
                    className="w-full bg-black/40 border border-[#38383A] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#cc3300] resize-none"
                    id="input-custom-desc"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#8E8E93] uppercase font-bold">曝光与实拍建议</label>
                  <textarea 
                    placeholder="给其他伙伴一些建议，例如：适合推档拍摄、建议稍微过曝..."
                    value={customAdvice}
                    onChange={(e) => setCustomAdvice(e.target.value)}
                    rows={2}
                    className="w-full bg-black/40 border border-[#38383A] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#cc3300] resize-none"
                    id="input-custom-advice"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#cc3300] to-[#b22b00] text-white text-xs font-semibold hover:shadow-lg transition-all active:scale-95"
                  id="submit-custom-film"
                >
                  保存并签发护照
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Shot Log Modal */}
      <AnimatePresence>
        {isAddLogModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm" id="add-log-modal">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1C1C1E] w-full max-w-md rounded-2xl border border-[#2a2a2a] overflow-hidden"
              id="add-log-content"
            >
              <div className="p-4 bg-black/20 border-b border-[#2a2a2a] flex justify-between items-center">
                <h3 className="font-bold text-[#F5F0EB] text-sm flex items-center gap-1.5">
                  <Camera size={16} className="text-[#cc3300]" /> 记录新的实拍
                </h3>
                <button 
                  onClick={() => setIsAddLogModalOpen(false)}
                  className="p-1 hover:bg-black/40 rounded-full text-[#8E8E93] hover:text-[#F5F0EB]"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddLogSubmit} className="p-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-[#8E8E93] uppercase font-bold">选用胶卷 *</label>
                  <select 
                    required
                    value={logFilmId}
                    onChange={(e) => setLogFilmId(e.target.value)}
                    className="w-full bg-black/40 border border-[#38383A] rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-[#cc3300]"
                    id="select-log-film"
                  >
                    <option value="">-- 请选择胶卷 --</option>
                    {films.map(f => (
                      <option key={f.id} value={f.id}>{f.name} (ISO {f.iso})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8E8E93] uppercase font-bold">相机机身 *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="如: Leica M6" 
                      value={logCamera}
                      onChange={(e) => setLogCamera(e.target.value)}
                      className="w-full bg-black/40 border border-[#38383A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cc3300]"
                      id="input-log-camera"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8E8E93] uppercase font-bold">搭配镜头</label>
                    <input 
                      type="text" 
                      placeholder="如: Summicron 50mm f/2" 
                      value={logLens}
                      onChange={(e) => setLogLens(e.target.value)}
                      className="w-full bg-black/40 border border-[#38383A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cc3300]"
                      id="input-log-lens"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8E8E93] uppercase font-bold">拍摄光圈</label>
                    <input 
                      type="text" 
                      placeholder="如: f/2.8" 
                      value={logAperture}
                      onChange={(e) => setLogAperture(e.target.value)}
                      className="w-full bg-black/40 border border-[#38383A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cc3300]"
                      id="input-log-aperture"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-[#8E8E93] uppercase font-bold">快门速度</label>
                    <input 
                      type="text" 
                      placeholder="如: 1/125s" 
                      value={logShutter}
                      onChange={(e) => setLogShutter(e.target.value)}
                      className="w-full bg-black/40 border border-[#38383A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cc3300]"
                      id="input-log-shutter"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#8E8E93] uppercase font-bold">拍摄地点</label>
                  <input 
                    type="text" 
                    placeholder="如: 北京 798艺术区" 
                    value={logLocation}
                    onChange={(e) => setLogLocation(e.target.value)}
                    className="w-full bg-black/40 border border-[#38383A] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#cc3300]"
                    id="input-log-location"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#8E8E93] uppercase font-bold">拍摄感悟与备忘</label>
                  <textarea 
                    placeholder="记录这一卷冲洗、扫描的心得或者拍摄时的故事..."
                    value={logNotes}
                    onChange={(e) => setLogNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-black/40 border border-[#38383A] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#cc3300] resize-none"
                    id="input-log-notes"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#cc3300] hover:bg-[#b22b00] text-white text-xs font-semibold transition-all active:scale-95"
                  id="submit-shot-log"
                >
                  增加一条打卡记录
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
