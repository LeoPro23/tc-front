export interface Detection {
  pest: string;
  confidence: number;
  box: [number, number, number, number];
  model: string;
}

export interface ImageAnalysisEntry {
  id: string;
  file: File;
  previewUrl: string;
  detections: Detection[];
  models: string[];
  verified: boolean;
  verificationReason: string | null;
}

export interface AgronomicRecipe {
  product: string;
  dose: string;
  method: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ReportData {
  user: User | null;
  detection: Detection | null;
  recipe: AgronomicRecipe | null;
  date: string;
}

export interface ImageNaturalSize {
  w: number;
  h: number;
}

export interface ImageRect {
  left: number;
  top: number;
  width: number;
  height: number;
}
