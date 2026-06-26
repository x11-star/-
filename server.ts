import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Setup Gemini client
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", firebaseAvailable: !!process.env.GEMINI_API_KEY });
  });

  app.post("/api/ai-recommend", async (req, res) => {
    try {
      const { description, sceneType } = req.body;
      if (!description) {
        return res.status(400).json({ error: "Missing description" });
      }

      if (!ai) {
        // Fallback mock response when no API key is provided
        console.warn("GEMINI_API_KEY is missing. Using local recommendation logic.");
        return res.json({
          recommendedFilm: "Kodak Portra 400",
          brand: "Kodak",
          iso: 400,
          settings: {
            aperture: "f/2.8",
            shutterSpeed: "1/250s",
            exposureAdvice: "建议正常测光，或者稍微过曝（+1档）以获得极其粉嫩的肤色与通透干净的高光表现。"
          },
          colorMood: "温暖自然、皮肤色调极其红润通透，具有优异的宽容度，高光部分呈淡黄色。",
          grainCharacteristics: "极其微弱、沙粒感极度温和细腻，表现力均匀。",
          shootingTip: "在逆光环境下，你可以把测光点放在暗部对准人脸，让背景过曝，从而创造出温暖唯美的金色轮廓线。",
          reasoning: "为了捕捉到你描述的温馨氛围，Portra 400优秀的动态范围和温润的肤色重现能力是最佳之选。即使在大光比的阳光环境下，它也能完美拉回亮部与暗部细节。"
        });
      }

      const prompt = `你是一位世界顶级的胶片摄影大师与胶卷专家。
      
场景类型或拍摄题材：${sceneType || "综合题材"}
拍摄场景与画面描述：${description}

请根据用户的描述，推荐一款最适合的经典胶片（如：Kodak Portra 400, Kodak Gold 200, Kodak Ektar 100, Fuji Superia 400, CineStill 800T, Ilford HP5 Plus 等，也可以推荐其他知名胶卷）。
推荐必须专业、精准、富有艺术感和胶片情怀。`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "你是一个专业的胶片摄影AI顾问，对各种胶片（柯达、富士、伊尔福、乐凯、CineStill等）的历史、色彩化学、颗粒特征以及搭配相机的测光、冲洗方式有着深刻理解。你的回答总是富有摄影情怀且非常精确。必须使用简体中文进行回答。",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedFilm: { type: Type.STRING, description: "推荐的经典胶片名称" },
              brand: { type: Type.STRING, description: "胶片品牌，例如 Kodak, Fujifilm, Ilford, CineStill 等" },
              iso: { type: Type.INTEGER, description: "胶片感光度 (ISO)" },
              settings: {
                type: Type.OBJECT,
                properties: {
                  aperture: { type: Type.STRING, description: "推荐使用的光圈（例如 f/2.0, f/8）" },
                  shutterSpeed: { type: Type.STRING, description: "推荐快门速度（例如 1/125s, 1/30s 等）" },
                  exposureAdvice: { type: Type.STRING, description: "具体测光与曝光建议（例如：稍微过曝、正常测光、推档等）" }
                },
                required: ["aperture", "shutterSpeed", "exposureAdvice"]
              },
              colorMood: { type: Type.STRING, description: "色彩基调和画面氛围（例如：冷青色、温暖金黄色、高对比度黑白等）" },
              grainCharacteristics: { type: Type.STRING, description: "颗粒质感描述（例如：极度细腻、经典的粗颗粒、质感颗粒等）" },
              shootingTip: { type: Type.STRING, description: "大师级实拍技巧或对焦、构图、搭配镜头的建议" },
              reasoning: { type: Type.STRING, description: "推荐此款胶片的艺术理由与美学深度阐述" }
            },
            required: ["recommendedFilm", "brand", "iso", "settings", "colorMood", "grainCharacteristics", "shootingTip", "reasoning"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      res.json(JSON.parse(text.trim()));
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Serve static assets / Vite in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Silver Salt Server] Running on http://localhost:${PORT} under ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
