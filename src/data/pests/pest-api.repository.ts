import { IPestRepository } from '../../domain/pests/pest.repository';
import { PestAnalysisResult } from '../../domain/pests/pest.entity';

export class PestApiRepository implements IPestRepository {
    private readonly baseUrl = 'http://localhost:3100'; // NestJS changed to 3100 to avoid conflict

    async analyzeImage(file: File): Promise<PestAnalysisResult> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${this.baseUrl}/pests/analyze`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Analysis failed: ${response.statusText}`);
        }

        return response.json();
    }
}
