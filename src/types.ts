export interface Film {
  id: string;
  name: string;
  brand: string;
  iso: number;
  type: "Color Negative" | "B&W" | "Slide";
  format: string;
  description: string;
  styleAdvice: string;
  imageUrl: string;
  isCustom?: boolean;
  // Simulation params
  simParams: {
    contrast: number; // e.g. 1.15 for 115%
    saturation: number; // e.g. 1.25
    warmth: number; // e.g. -10 to +20
    tint: string; // Tailwind hex color overlay or CSS Filter style
    grain: number; // 0 to 1
    grayscale?: boolean;
    halation?: boolean;
  };
}

export interface ShotLog {
  id: string;
  filmId: string;
  filmName: string;
  cameraName: string;
  lens?: string;
  aperture?: string;
  shutter?: string;
  location?: string;
  date: string;
  notes?: string;
  imageUrl?: string;
}

export interface Camera {
  id: string;
  name: string;
  type: "SLR" | "Rangefinder" | "Point & Shoot" | "Medium Format";
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
}
