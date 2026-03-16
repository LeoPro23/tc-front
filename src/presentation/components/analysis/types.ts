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
  targetPest: string | null;
  recipe: AgronomicRecipe | null;
  biosecurityStatus: string | null;
  biosecurityProtocol: string | null;
}

export interface AgronomicRecipe {
  product: string;
  dose: string;
  method: string;
}

export interface PerImageInterpretation {
  filename: string;
  targetPest: string;
  recipe: AgronomicRecipe;
  biosecurityStatus: string;
  biosecurityProtocol: string;
}

export interface BatchInterpretation {
  generalSummary: string;
  generalRecommendation: string;
  generalProduct: string;
  generalOperativeGuide: string;
  generalBiosecurityProtocol: string;
  perImage: PerImageInterpretation[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AgronomicContext {
  phenologicalState: string | null;
  soilQuality: string | null;
  currentClimate: string | null;
}

export interface ReportData {
  user: User | null;
  detection: Detection | null;
  recipe: AgronomicRecipe | null;
  date: string;
  imageEntries: ImageAnalysisEntry[];
  batchInterpretation: BatchInterpretation | null;
  agronomicContext: AgronomicContext | null;
  isInfected: boolean;
  bugDensity: number;
  fieldName: string | null;
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
