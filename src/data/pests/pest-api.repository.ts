import { IPestRepository } from '../../domain/pests/pest.repository';
import { PestAnalysisResult } from '../../domain/pests/pest.entity';
import { URL_BACKEND } from '../../shared/config/backend-url';

export class PestApiRepository implements IPestRepository {
    private readonly baseUrl = URL_BACKEND;

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
