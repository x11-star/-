import React, { useState } from "react";
import { Film } from "../types";
import { Search, SlidersHorizontal, Sparkles, Send, Loader2, RefreshCw, HelpCircle, Camera, Award, Settings, CheckCircle, Plus, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DiscoverViewProps {
  films: Film[];
  onAddCustomFilm: (newFilm: Film) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

interface AIRecommendResult {
  recommendedFilm: string;
  brand: string;
  iso: number;
  settings: {
    aperture: string;
    shutterSpeed: string;
    exposureAdvice: string;
  };
  colorMood: string;
  grainCharacteristics: string;
  shootingTip: string;
  reasoning: string;
}

export default function DiscoverView({ films, onAddCustomFilm, favorites, onToggleFavorite }: DiscoverViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedIso, setSelectedIso] = useState("All");

  // AI Assistant States
  const [aiPrompt, setAiPrompt] = useState("");
  const [sceneType, setSceneType] = useState("综合人像");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIRecommendResult | null>(null);
  const [aiError, setAiError] = useState("");

  // Quick suggestions for AI
  const quickPrompts = [
    { text: "东京雨夜霓虹灯街头", type: "都市街头" },
    { text: "日系海边清爽逆光人像", type: "户外人像" },
    { text: "温暖复古的书店咖啡馆", type: "室内静物" },
    { text: "冷峻深邃的雪山与阴天松林", type: "自然风光" }
  ];

  // Filters calculation
  const filteredFilms = films.filter(film => {
    const matchesSearch = film.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          film.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          film.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBrand = selectedBrand === "All" || film.brand.toLowerCase() === selectedBrand.toLowerCase();
    
    const matchesType = selectedType === "All" || film.type === selectedType;
    
    let matchesIso = true;
    if (selectedIso !== "All") {
      if (selectedIso === "Low (<200)") matchesIso = film.iso < 200;
      else if (selectedIso === "Medium (200-400)") matchesIso = film.iso >= 200 && film.iso <= 400;
      else if (selectedIso === "High (800+)") matchesIso = film.iso >= 800;
    }

    return matchesSearch && matchesBrand && matchesType && matchesIso;
  });

  const handleAskAI = async (promptText: string, typeVal?: string) => {
    const activePrompt = promptText || aiPrompt;
    if (!activePrompt.trim()) return;

    setIsAiLoading(true);
    setAiError("");
    setAiResult(null);

    try {
      const response = await fetch("/api/ai-recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: activePrompt,
          sceneType: typeVal || sceneType
        })
      });

      if (!response.ok) {
        throw new Error("推荐系统繁忙，请稍后重试");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAiResult(data);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "未能连接到AI，请检查网络或配置");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 pb-6" id="discover-container">
      
      {/* Sparkles / Master AI Assistant Header */}
      <section className="bg-gradient-to-r from-[#1C1C1E] to-[#251A18] rounded-2xl p-5 border border-[#cc3300]/20 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#cc3300]/15 rounded-lg text-[#cc3300]">
            <Sparkles size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F5F0EB]">AI 胶片排期与选卷大师</h2>
            <p className="text-[10px] text-[#8E8E93]">基于 Gemini AI 的光线与色彩化学分析仪</p>
          </div>
        </div>

        <p className="text-xs text-[#e5e2e1] leading-relaxed">
          描述你准备拍摄的题材、光线强弱或期待的色彩氛围，AI 将为你推荐完美的胶卷配比与测光建议。
        </p>

        {/* AI Prompt Input */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <select
              value={sceneType}
              onChange={(e) => setSceneType(e.target.value)}
              className="bg-black/40 border border-[#38383A] text-xs text-[#F5F0EB] px-2.5 py-2.5 rounded-lg focus:outline-none focus:border-[#cc3300] shrink-0"
              id="ai-scene-type"
            >
              <option value="综合人像">人像</option>
              <option value="街头人文">人文</option>
              <option value="自然风光">风光</option>
              <option value="夜景弱光">夜景</option>
              <option value="室内静物">静物</option>
            </select>
            
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="例如: 清晨森林中的逆光薄雾，带些慵懒清冷氛围"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskAI(aiPrompt)}
                className="w-full bg-black/40 border border-[#38383A] text-xs text-white rounded-lg pl-3 pr-10 py-2.5 focus:outline-none focus:border-[#cc3300]"
                id="ai-prompt-input"
              />
              <button
                disabled={isAiLoading || !aiPrompt.trim()}
                onClick={() => handleAskAI(aiPrompt)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#cc3300] disabled:text-[#636366] transition-colors p-1"
                id="btn-ai-send"
              >
                {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </div>

          {/* Quick recommendations */}
          <div className="space-y-1">
            <p className="text-[10px] text-[#8E8E93] uppercase font-bold tracking-wider">灵感速递</p>
            <div className="flex flex-wrap gap-1.5" id="ai-quick-prompts">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAiPrompt(p.text);
                    setSceneType(p.type);
                    handleAskAI(p.text, p.type);
                  }}
                  className="px-2.5 py-1 bg-[#1C1C1E] border border-[#38383A] text-[10px] text-[#8E8E93] hover:text-[#F5F0EB] hover:border-[#cc3300]/50 rounded-full transition-all active:scale-95"
                >
                  {p.text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendation Result Container */}
        <AnimatePresence mode="wait">
          {isAiLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-black/30 border border-[#38383A] rounded-xl p-5 flex flex-col items-center justify-center space-y-3"
              id="ai-loading-box"
            >
              <Loader2 size={24} className="animate-spin text-[#cc3300]" />
              <p className="text-xs text-[#8E8E93] text-center font-medium animate-pulse">
                胶片化学配方配比中... 正在分析卤化银与色彩曲线...
              </p>
            </motion.div>
          )}

          {aiError && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-950/20 border border-red-900/40 rounded-xl text-xs text-[#ffb4ab]"
              id="ai-error-box"
            >
              {aiError}
            </motion.div>
          )}

          {aiResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#1C1C1E]/90 border border-[#cc3300]/30 rounded-xl p-4 space-y-4 shadow-inner"
              id="ai-result-box"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-[#cc3300] tracking-widest uppercase bg-[#cc3300]/10 px-2 py-0.5 rounded">
                    大师选卷
                  </span>
                  <h3 className="text-base font-bold text-[#F5F0EB] mt-1.5 flex items-center gap-1.5">
                    <Camera size={16} className="text-[#efbd8a]" /> {aiResult.recommendedFilm}
                  </h3>
                  <p className="text-[10px] text-[#8E8E93] font-mono mt-0.5">BRAND: {aiResult.brand} | ISO: {aiResult.iso}</p>
                </div>
                
                {/* Instant dynamic check / collection trigger */}
                {films.some(f => f.name.toLowerCase().includes(aiResult.recommendedFilm.toLowerCase())) ? (
                  <button 
                    onClick={() => {
                      const found = films.find(f => f.name.toLowerCase().includes(aiResult.recommendedFilm.toLowerCase()));
                      if (found) onToggleFavorite(found.id);
                    }}
                    className="p-1.5 bg-[#cc3300]/15 hover:bg-[#cc3300]/25 rounded-full text-[#cc3300] transition-colors"
                    title="收藏此推荐"
                  >
                    <CheckCircle size={16} />
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      // Custom add of this film from AI
                      const custom: Film = {
                        id: `custom-ai-${Date.now()}`,
                        name: aiResult.recommendedFilm,
                        brand: aiResult.brand,
                        iso: aiResult.iso,
                        type: aiResult.iso >= 400 ? "Color Negative" : "Color Negative",
                        format: "35mm",
                        description: aiResult.colorMood,
                        styleAdvice: aiResult.shootingTip,
                        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoDLe_nSBPvt4XhjwjzvQW0IGe_KEsZLQ8-Ltymg9UKIE-CcN-3vDuhjEedBAEnDnyJfyEnAzFwYTg2WwomusraX9UCDoCiLOd8bFVfTnx5gOJkUCUObyYWR57tyJj8p8Wj6JIr-Po26qHHINGx5tgCNIFXEidQonkukOqaKwzKvm9HnreiYbv4dCX2HgknymzzEAw-4PCEwgSpZnOOs8V5BvpT1qMxjh8oRBUd-NGCErVQZ2tNWNbdq6iqFx3RCqfqg6DYCL1mQD4",
                        isCustom: true,
                        simParams: {
                          contrast: 1.1,
                          saturation: 1.15,
                          warmth: 10,
                          tint: "rgba(255, 200, 100, 0.1)",
                          grain: 0.28
                        }
                      };
                      onAddCustomFilm(custom);
                    }}
                    className="text-[10px] font-bold text-[#cc3300] hover:text-white border border-[#cc3300] px-2.5 py-1 rounded-full transition-all active:scale-95 flex items-center gap-1"
                  >
                    <Plus size={10} /> 签入护照
                  </button>
                )}
              </div>

              {/* Master recommendations block */}
              <div className="grid grid-cols-2 gap-2 text-xs border-y border-[#38383A] py-3 my-1">
                <div className="space-y-0.5">
                  <p className="text-[9px] text-[#8E8E93] uppercase font-bold">测光曝光</p>
                  <p className="text-white font-medium">{aiResult.settings.exposureAdvice}</p>
                </div>
                <div className="space-y-0.5 border-l border-[#38383A] pl-3">
                  <p className="text-[9px] text-[#8E8E93] uppercase font-bold">相机参考档</p>
                  <p className="text-white font-mono">{aiResult.settings.aperture} | {aiResult.settings.shutterSpeed}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <h4 className="font-bold text-[#efbd8a]">美学分析：</h4>
                  <p className="text-[#e5e2e1] leading-relaxed">{aiResult.reasoning}</p>
                </div>
                <div>
                  <h4 className="font-bold text-[#efbd8a]">色彩与颗粒特征：</h4>
                  <p className="text-[#e5e2e1] leading-relaxed">{aiResult.colorMood} · {aiResult.grainCharacteristics}</p>
                </div>
                <div className="p-2.5 bg-black/30 border border-[#38383A]/60 rounded-lg">
                  <h4 className="font-bold text-[#cc3300] flex items-center gap-1">
                    <Award size={12} /> 大师实拍技巧：
                  </h4>
                  <p className="text-[#efbd8a]/90 leading-relaxed mt-0.5">{aiResult.shootingTip}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Directory Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-[#F5F0EB]">底片百科</h2>
          <span className="text-[10px] text-[#8E8E93] font-mono">SHOWING {filteredFilms.length} FILMS</span>
        </div>

        {/* Search & Filter bar */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
            <input
              type="text"
              placeholder="搜索胶卷品牌、型号或风格描述..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1C1C1E] border border-[#2a2a2a] rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#cc3300] transition-colors"
            />
          </div>

          {/* Mini Quick Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 max-w-full" id="filter-selectors">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-[#1C1C1E] border border-[#2a2a2a] text-[10px] text-[#8E8E93] rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value="All">品牌 (全部)</option>
              <option value="Kodak">Kodak</option>
              <option value="Fujifilm">Fujifilm</option>
              <option value="CineStill">CineStill</option>
              <option value="Ilford">Ilford</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-[#1C1C1E] border border-[#2a2a2a] text-[10px] text-[#8E8E93] rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value="All">类型 (全部)</option>
              <option value="Color Negative">彩色负片</option>
              <option value="B&W">黑白卷</option>
              <option value="Slide">反转片</option>
            </select>

            <select
              value={selectedIso}
              onChange={(e) => setSelectedIso(e.target.value)}
              className="bg-[#1C1C1E] border border-[#2a2a2a] text-[10px] text-[#8E8E93] rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value="All">感光度 (全部)</option>
              <option value="Low (<200)">低感卷 (&lt;200)</option>
              <option value="Medium (200-400)">中感卷 (200-400)</option>
              <option value="High (800+)">高感卷 (800+)</option>
            </select>
          </div>
        </div>

        {/* Directory List of filtered films */}
        <div className="space-y-2.5" id="films-catalog-list">
          {filteredFilms.length === 0 ? (
            <div className="text-center py-8 text-[#8E8E93] text-xs">
              未能找到匹配的胶卷。试试重新搜索或点击“添加胶卷”！
            </div>
          ) : (
            filteredFilms.map((film) => {
              const isFav = favorites.includes(film.id);
              return (
                <div 
                  key={film.id}
                  className="bg-[#1C1C1E] border border-[#2a2a2a] rounded-xl p-3.5 flex gap-3.5 relative group"
                >
                  <img 
                    src={film.imageUrl} 
                    alt={film.name} 
                    className="w-16 h-16 object-cover rounded-lg bg-black/40 border border-[#38383A]/40 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-xs font-bold text-[#F5F0EB] truncate">{film.name}</h3>
                      <span className="text-[8px] font-mono bg-black/40 text-[#efbd8a] border border-[#38383A] px-1.5 py-0.5 rounded uppercase shrink-0">
                        ISO {film.iso}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#8E8E93] uppercase font-mono tracking-wider">{film.brand} · {film.type} · {film.format}</p>
                    <p className="text-[11px] text-[#e5e2e1] line-clamp-2 leading-relaxed mt-1">
                      {film.description}
                    </p>
                  </div>

                  {/* Add action to quick add to Passport */}
                  <button 
                    onClick={() => onToggleFavorite(film.id)}
                    className="absolute right-3.5 bottom-3.5 p-1 bg-[#131313] group-hover:bg-[#cc3300]/10 border border-[#38383A] group-hover:border-[#cc3300]/40 rounded-full transition-all"
                  >
                    <Heart size={12} className={isFav ? "fill-[#E85D3F] text-[#E85D3F]" : "text-[#8E8E93]"} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
