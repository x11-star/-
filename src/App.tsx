import React, { useState, useEffect } from "react";
import { Film, ShotLog, Camera, Badge } from "./types";
import { DEFAULT_FILMS } from "./constants/films";
import PassportView from "./components/PassportView";
import DiscoverView from "./components/DiscoverView";
import SimulatorView from "./components/SimulatorView";
import ProfileView from "./components/ProfileView";
import { Search, Compass, BookOpen, Camera as CamIcon, User, Settings, Menu, Info, HelpCircle, Smartphone, Monitor, Wifi, Battery, Signal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const INITIAL_CAMERAS: Camera[] = [
  { id: "cam-1", name: "Leica M6", type: "Rangefinder" },
  { id: "cam-2", name: "Canon AE-1", type: "SLR" },
  { id: "cam-3", name: "Olympus Trip 35", type: "Point & Shoot" }
];

const INITIAL_LOGS: ShotLog[] = [
  {
    id: "log-1",
    filmId: "kodak-portra-400",
    filmName: "Kodak Portra 400",
    cameraName: "Leica M6",
    lens: "Summicron 50mm",
    aperture: "f/2.0",
    shutter: "1/250s",
    location: "杭州 西湖边",
    notes: "日落时分的逆光人像，Portra 400 对皮肤红润感的还原无可比拟，高光细节极为温润柔和。",
    date: "2026/06/20"
  },
  {
    id: "log-2",
    filmId: "cinestill-800t",
    filmName: "CineStill 800T",
    cameraName: "Canon AE-1",
    lens: "FD 50mm f/1.4",
    aperture: "f/1.4",
    shutter: "1/60s",
    location: "霓虹商业街",
    notes: "夜间下雨过后的街景，霓虹灯高光边缘产生了极其迷人的红色红晕，电影感拉满！",
    date: "2026/06/23"
  },
  {
    id: "log-3",
    filmId: "ilford-hp5-plus",
    filmName: "Ilford HP5 Plus",
    cameraName: "Leica M6",
    lens: "Summaron 35mm",
    aperture: "f/5.6",
    shutter: "1/125s",
    location: "上海 陕西南路",
    notes: "雨天阴影处的抓拍，HP5 的中灰色阶表现宽广，粗糙颗粒赋予了街头纪实纯正的复古灵魂。",
    date: "2026/06/24"
  }
];

const INITIAL_BADGES: Badge[] = [
  { id: "badge-1", name: "银盐初学者", description: "在护照中记录超过 1 款经典胶片。", icon: "🎞️", unlocked: true, progress: 6, target: 1 },
  { id: "badge-2", name: "微光捕手", description: "打卡或模拟拍摄 CineStill 800T 弱光夜景。", icon: "🌃", unlocked: true, progress: 1, target: 1 },
  { id: "badge-3", name: "黑白极简主义", description: "连续使用 Ilford HP5 等黑白胶卷进行抓拍。", icon: "⚫", unlocked: true, progress: 1, target: 1 },
  { id: "badge-4", name: "银盐收藏家", description: "解锁或自定义超过 10 款胶片护照。", icon: "🎖️", unlocked: false, progress: 6, target: 10 }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"discover" | "passport" | "simulator" | "profile">("passport");
  const [films, setFilms] = useState<Film[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [shotLogs, setShotLogs] = useState<ShotLog[]>([]);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [comparedCount, setComparedCount] = useState(3); // Mock initial compared count
  const [safeLightColor, setSafeLightColor] = useState<"red" | "amber" | "dark">("red");
  const [userEmail, setUserEmail] = useState("syluswithxyy@gmail.com");
  
  // Frame Mode: "iphone" (iPhone 17 Pro wrapper mockup) or "fullscreen" (full screen edge-to-edge)
  const [viewMode, setViewMode] = useState<"iphone" | "fullscreen">("iphone");

  // Load from LocalStorage or seed defaults
  useEffect(() => {
    const savedFilms = localStorage.getItem("silver-salt-films");
    const savedFavs = localStorage.getItem("silver-salt-favorites");
    const savedLogs = localStorage.getItem("silver-salt-logs");
    const savedCams = localStorage.getItem("silver-salt-cameras");
    const savedCompared = localStorage.getItem("silver-salt-compared");
    const savedSafeLight = localStorage.getItem("silver-salt-safelight");
    const savedViewMode = localStorage.getItem("silver-salt-viewmode");

    if (savedFilms) {
      setFilms(JSON.parse(savedFilms));
    } else {
      setFilms(DEFAULT_FILMS);
    }

    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    } else {
      // Default match 12 count in screenshot (select all 6 default films as favorites by default)
      setFavorites(["kodak-portra-400", "kodak-gold-200", "kodak-ektar-100", "fuji-superia-400", "cinestill-800t", "ilford-hp5-plus"]);
    }

    if (savedLogs) {
      setShotLogs(JSON.parse(savedLogs));
    } else {
      setShotLogs(INITIAL_LOGS);
    }

    if (savedCams) {
      setCameras(JSON.parse(savedCams));
    } else {
      setCameras(INITIAL_CAMERAS);
    }

    if (savedCompared) {
      setComparedCount(Number(savedCompared));
    } else {
      setComparedCount(3);
    }

    if (savedSafeLight) {
      setSafeLightColor(savedSafeLight as any);
    } else {
      setSafeLightColor("red");
    }

    if (savedViewMode) {
      setViewMode(savedViewMode as any);
    }
  }, []);

  // Write updates to LocalStorage helper
  const updateFilms = (updated: Film[]) => {
    setFilms(updated);
    localStorage.setItem("silver-salt-films", JSON.stringify(updated));
  };

  const updateFavorites = (updated: string[]) => {
    setFavorites(updated);
    localStorage.setItem("silver-salt-favorites", JSON.stringify(updated));
  };

  const updateLogs = (updated: ShotLog[]) => {
    setShotLogs(updated);
    localStorage.setItem("silver-salt-logs", JSON.stringify(updated));
  };

  const updateCameras = (updated: Camera[]) => {
    setCameras(updated);
    localStorage.setItem("silver-salt-cameras", JSON.stringify(updated));
  };

  // State trigger actions
  const handleAddCustomFilm = (newFilm: Film) => {
    const updated = [...films, newFilm];
    updateFilms(updated);
    // Automatically add custom film to favorites/collected
    updateFavorites([...favorites, newFilm.id]);
  };

  const handleToggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      updateFavorites(favorites.filter(fav => fav !== id));
    } else {
      updateFavorites([...favorites, id]);
    }
  };

  const handleAddShotLog = (newLog: ShotLog) => {
    const updated = [newLog, ...shotLogs];
    updateLogs(updated);
  };

  const handleAddCamera = (newCam: Camera) => {
    const updated = [...cameras, newCam];
    updateCameras(updated);
  };

  const handleDeleteCamera = (id: string) => {
    const updated = cameras.filter(c => c.id !== id);
    updateCameras(updated);
  };

  const handleIncreaseCompared = () => {
    const newCount = comparedCount + 1;
    setComparedCount(newCount);
    localStorage.setItem("silver-salt-compared", String(newCount));
  };

  const handleToggleSafeLight = (color: "red" | "amber" | "dark") => {
    setSafeLightColor(color);
    localStorage.setItem("silver-salt-safelight", color);
  };

  const toggleViewMode = () => {
    const next = viewMode === "iphone" ? "fullscreen" : "iphone";
    setViewMode(next);
    localStorage.setItem("silver-salt-viewmode", next);
  };

  // Badges state mapper based on current achievements progress
  const badges: Badge[] = INITIAL_BADGES.map(badge => {
    if (badge.id === "badge-1") {
      // Unlocked if films length > 1
      const count = films.length;
      return { ...badge, progress: count, unlocked: count >= badge.target };
    }
    if (badge.id === "badge-4") {
      // Unlock if total collected favorites/custom > 10
      const count = favorites.length;
      return { ...badge, progress: count, unlocked: count >= badge.target };
    }
    return badge;
  });

  // Ambiance glow styling for top header bar based on selected safeLightColor
  const getGlowStyle = () => {
    if (safeLightColor === "red") {
      return "border-b border-[#cc3300]/30 shadow-[0_4px_20px_-2px_rgba(204,51,0,0.15)]";
    }
    if (safeLightColor === "amber") {
      return "border-b border-[#efbd8a]/30 shadow-[0_4px_20px_-2px_rgba(239,189,138,0.15)]";
    }
    return "border-b border-[#2a2a2a]";
  };

  // Render Core Application Layout inside frame or full screen
  const renderAppContent = () => {
    return (
      <div className="w-full h-full flex flex-col relative bg-[#0D0D0D] overflow-hidden">
        {/* Authentic film grain overlay applied inside app container */}
        <div 
          className="absolute inset-0 pointer-events-none z-50 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "150px 150px",
          }}
          id="grain-layer"
        ></div>

        {/* Top Header Navigation */}
        <header className={`absolute top-0 w-full z-40 h-14 bg-[#0D0D0D]/90 backdrop-blur-md flex justify-between items-center px-4 transition-all duration-500 ${getGlowStyle()}`} id="app-header">
          <button className="p-1 hover:bg-white/5 rounded-full text-[#F5F0EB] transition-colors" id="btn-header-menu">
            <Menu size={20} />
          </button>
          
          <h1 className="font-bold text-sm tracking-wider text-center absolute left-1/2 -translate-x-1/2 flex items-center gap-1" id="header-title">
            我的胶片护照 <span className="text-[8px] font-mono border border-[#cc3300] px-1 py-0.5 rounded text-[#cc3300] tracking-normal uppercase shrink-0 scale-90">SILVER SALT</span>
          </h1>
          
          {/* Dynamic safe light bulb indicator on right side */}
          <button 
            onClick={() => {
              const colors: ("red" | "amber" | "dark")[] = ["red", "amber", "dark"];
              const nextIdx = (colors.indexOf(safeLightColor) + 1) % colors.length;
              handleToggleSafeLight(colors[nextIdx]);
            }}
            className="p-1.5 hover:bg-white/5 rounded-full transition-colors flex items-center justify-center relative"
            id="btn-header-safelight"
            title="切换暗房灯光"
          >
            <span className={`w-1.5 h-1.5 rounded-full absolute ${
              safeLightColor === "red" 
                ? "bg-[#cc3300] animate-pulse" 
                : safeLightColor === "amber" 
                ? "bg-[#efbd8a] animate-pulse" 
                : "bg-[#636366]"
            }`}></span>
            <span className="w-4 h-4 rounded-full border border-white/10 flex items-center justify-center"></span>
          </button>
        </header>

        {/* Main Container Stage viewport with smooth animate transition */}
        <main className="flex-1 pt-16 pb-16 px-4 overflow-y-auto w-full max-w-md mx-auto scrollbar-thin scrollbar-thumb-neutral-800" id="viewport-stage">
          <AnimatePresence mode="wait">
            {activeTab === "discover" && (
              <motion.div
                key="discover-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DiscoverView 
                  films={films}
                  onAddCustomFilm={handleAddCustomFilm}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              </motion.div>
            )}

            {activeTab === "passport" && (
              <motion.div
                key="passport-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <PassportView 
                  films={films}
                  onAddCustomFilm={handleAddCustomFilm}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  shotLogs={shotLogs}
                  onAddShotLog={handleAddShotLog}
                  stats={{
                    filmsCount: favorites.length,
                    shotCount: shotLogs.length,
                    comparedCount: comparedCount
                  }}
                />
              </motion.div>
            )}

            {activeTab === "simulator" && (
              <motion.div
                key="simulator-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SimulatorView 
                  films={films}
                  onAddShotLog={handleAddShotLog}
                  onIncreaseCompared={handleIncreaseCompared}
                  stats={{
                    filmsCount: favorites.length,
                    shotCount: shotLogs.length,
                    comparedCount: comparedCount
                  }}
                />
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                key="profile-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ProfileView 
                  cameras={cameras}
                  onAddCamera={handleAddCamera}
                  onDeleteCamera={handleDeleteCamera}
                  badges={badges}
                  safeLightColor={safeLightColor}
                  onToggleSafeLight={handleToggleSafeLight}
                  email={userEmail}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Bottom Sticky Tab Navigation Bar */}
        <nav className="absolute bottom-0 w-full z-40 h-14 bg-[#1C1C1E]/95 border-t border-[#2a2a2a] flex justify-around items-center" id="sticky-bottom-nav">
          <button 
            onClick={() => setActiveTab("discover")}
            className={`flex flex-col items-center justify-center transition-all duration-300 ${
              activeTab === "discover" ? "text-[#cc3300] scale-105 font-bold" : "text-[#8E8E93] hover:text-[#F5F0EB]"
            }`}
            id="nav-btn-discover"
          >
            <Compass size={16} />
            <span className="text-[9px] font-medium mt-1">发现</span>
          </button>

          <button 
            onClick={() => setActiveTab("passport")}
            className={`flex flex-col items-center justify-center transition-all duration-300 ${
              activeTab === "passport" ? "text-[#cc3300] scale-105 font-bold" : "text-[#8E8E93] hover:text-[#F5F0EB]"
            }`}
            id="nav-btn-passport"
          >
            <BookOpen size={16} />
            <span className="text-[9px] font-medium mt-1">护照</span>
          </button>

          <button 
            onClick={() => setActiveTab("simulator")}
            className={`flex flex-col items-center justify-center transition-all duration-300 ${
              activeTab === "simulator" ? "text-[#cc3300] scale-105 font-bold" : "text-[#8E8E93] hover:text-[#F5F0EB]"
            }`}
            id="nav-btn-simulator"
          >
            <CamIcon size={16} />
            <span className="text-[9px] font-medium mt-1">试拍</span>
          </button>

          <button 
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center justify-center transition-all duration-300 ${
              activeTab === "profile" ? "text-[#cc3300] scale-105 font-bold" : "text-[#8E8E93] hover:text-[#F5F0EB]"
            }`}
            id="nav-btn-profile"
          >
            <User size={16} />
            <span className="text-[9px] font-medium mt-1">我的</span>
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div className="bg-[#09090B] text-[#F5F0EB] min-h-screen relative flex flex-col justify-center items-center overflow-x-hidden selection:bg-[#cc3300] selection:text-white" id="app-root">
      
      {/* Absolute Header workbench dashboard for viewing options (Only visible on wide screens) */}
      <div className="hidden md:flex absolute top-4 left-6 right-6 justify-between items-center z-50 pointer-events-auto">
        <div className="flex items-center gap-2 bg-[#1C1C1E] border border-neutral-800 px-3 py-1.5 rounded-full shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[11px] font-mono tracking-wide text-neutral-400">iPhone 17 Pro 实时原型模拟器</span>
        </div>

        <div className="flex items-center gap-2 bg-[#1C1C1E] border border-neutral-800 p-1 rounded-full shadow-lg">
          <button
            onClick={() => setViewMode("iphone")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
              viewMode === "iphone"
                ? "bg-[#cc3300] text-white"
                : "text-neutral-400 hover:text-white"
            }`}
            title="切换至 iPhone 17 Pro 容器模式"
          >
            <Smartphone size={13} /> 手机原型
          </button>
          <button
            onClick={() => setViewMode("fullscreen")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
              viewMode === "fullscreen"
                ? "bg-[#cc3300] text-white"
                : "text-neutral-400 hover:text-white"
            }`}
            title="切换至全屏网页模式"
          >
            <Monitor size={13} /> 网页全屏
          </button>
        </div>
      </div>

      {/* Floating Mode Switcher for mobile preview or debuggers */}
      <div className="md:hidden fixed bottom-18 right-4 z-50">
        <button
          onClick={toggleViewMode}
          className="p-3 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-[#cc3300] rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform"
          title="切换视图模式"
        >
          {viewMode === "iphone" ? <Monitor size={16} className="text-neutral-400" /> : <Smartphone size={16} className="text-[#cc3300]" />}
        </button>
      </div>

      {/* Conditional layout wrapper */}
      {viewMode === "iphone" ? (
        <div className="relative py-8 md:py-12 w-full max-w-[420px] px-4 flex justify-center items-center" id="device-wrapper">
          {/* Simulated Physical Device: iPhone 17 Pro */}
          <div className="w-[375px] h-[812px] bg-[#000000] rounded-[52px] border-[11px] border-[#2E2E33] relative shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col transition-all duration-300 ring-2 ring-neutral-900 ring-offset-2 ring-offset-[#09090B]">
            
            {/* Top Ear Speaker & Bezel Line */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-[4px] bg-neutral-950 rounded-full z-50"></div>

            {/* Simulated Status Bar - iPhone Style */}
            <div className="h-10 bg-black/90 text-white flex justify-between items-center px-6 z-50 shrink-0 select-none text-[11px] font-medium">
              <span>19:14</span>
              
              {/* Simulated Dynamic Island for iPhone 17 Pro */}
              <div className="w-[105px] h-[25px] bg-black rounded-full flex items-center justify-between px-2 text-[9px] text-[#cc3300] scale-100 font-mono overflow-hidden shadow-inner border border-neutral-800/30">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#cc3300] animate-pulse"></span>
                  <span className="text-[8px] text-neutral-400 tracking-tight">SILVER SALT</span>
                </div>
                <div className="w-3.5 h-3.5 rounded-full bg-neutral-950 flex items-center justify-center border border-neutral-800/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-900/50"></div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Signal size={10} className="text-neutral-300" />
                <Wifi size={10} className="text-neutral-300" />
                <Battery size={13} className="text-neutral-300" />
              </div>
            </div>

            {/* Inner App Canvas Frame */}
            <div className="flex-1 relative overflow-hidden rounded-b-[42px]">
              {renderAppContent()}
            </div>

            {/* Simulated iOS Home Indicator Bar */}
            <div className="absolute bottom-1 w-full flex justify-center pb-1 z-50 pointer-events-none">
              <div className="w-32 h-[4px] bg-white/40 rounded-full"></div>
            </div>
          </div>

          {/* Device Hardware Accents: Simulated Buttons */}
          <div className="absolute left-[8px] top-[160px] w-[3px] h-[30px] bg-[#1E1E22] rounded-r z-10 border-r border-[#3E3E44]"></div> {/* Action button */}
          <div className="absolute left-[8px] top-[210px] w-[3px] h-[50px] bg-[#1E1E22] rounded-r z-10 border-r border-[#3E3E44]"></div> {/* Volume up */}
          <div className="absolute left-[8px] top-[275px] w-[3px] h-[50px] bg-[#1E1E22] rounded-r z-10 border-r border-[#3E3E44]"></div> {/* Volume down */}
          <div className="absolute right-[8px] top-[220px] w-[3px] h-[65px] bg-[#1E1E22] rounded-l z-10 border-l border-[#3E3E44]"></div> {/* Power/Side button */}
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto min-h-screen flex flex-col" id="fullscreen-app-wrapper">
          {renderAppContent()}
        </div>
      )}

      {/* Decorative background visual ambient glows for desktop mode */}
      <div className={`hidden md:block fixed top-1/4 -left-32 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${
        safeLightColor === "red" 
          ? "bg-[#cc3300]/5" 
          : safeLightColor === "amber" 
          ? "bg-[#efbd8a]/5" 
          : "bg-neutral-800/5"
      }`}></div>
      <div className={`hidden md:block fixed bottom-1/4 -right-32 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${
        safeLightColor === "red" 
          ? "bg-[#cc3300]/5" 
          : safeLightColor === "amber" 
          ? "bg-[#efbd8a]/5" 
          : "bg-neutral-800/5"
      }`}></div>
    </div>
  );
}

