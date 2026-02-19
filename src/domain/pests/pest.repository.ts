import { PestAnalysisResult } from './pest.entity';

export interface IPestRepository {
    analyzeImage(file: File): Promise<PestAnalysisResult>;
}
