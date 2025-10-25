/**
 * AI Service for Nodeo - Enhanced hints and code analysis
 */

export interface AIHintRequest {
    code: string;
    challenge: {
        topic: string;
        title: string;
        prompt: string;
    };
    failedTests: Array<{
        description: string;
        error?: string;
    }>;
    previousHints: string[];
}

export interface AIHintResponse {
    hints: string[];
    explanation?: string;
    suggestions?: string[];
}

class AIService {
    private apiKey: string;
    private baseURL: string;

    constructor() {
        this.apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || '';
        this.baseURL = (import.meta as any).env?.VITE_AI_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
    }

    private async makeRequest(messages: any[]): Promise<string> {
        if (!this.apiKey) {
            throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your environment variables.');
        }

        const response = await fetch(this.baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // Much cheaper than GPT-4!
                messages,
                max_tokens: 500,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`AI service error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
    }

    async generateHints(request: AIHintRequest): Promise<AIHintResponse> {
        const systemPrompt = `You are an expert coding tutor helping students learn JavaScript. 
Your role is to provide helpful hints that guide students toward the solution without giving away the answer.

Guidelines:
- Be encouraging and supportive
- Focus on the specific concepts being taught (${request.challenge.topic})
- Provide 2-3 concise, actionable hints
- Avoid showing complete solutions
- Use simple, clear language
- Build on previous hints if provided`;

        const userPrompt = `Challenge: ${request.challenge.title}
Topic: ${request.challenge.topic}
Task: ${request.challenge.prompt}

Student's current code:
\`\`\`javascript
${request.code}
\`\`\`

Failed tests:
${request.failedTests.map(t => `- ${t.description}${t.error ? ` (${t.error})` : ''}`).join('\n')}

${request.previousHints.length > 0 ? `Previous hints given:\n${request.previousHints.map(h => `- ${h}`).join('\n')}\n` : ''}

Provide 2-3 helpful hints that guide the student toward the solution. Focus on the core concept and common mistakes. Be encouraging!`;

        try {
            const response = await this.makeRequest([
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]);

            // Parse the response to extract hints
            const hints = this.parseHints(response);

            return {
                hints,
                explanation: this.extractExplanation(response),
                suggestions: this.extractSuggestions(response)
            };
        } catch (error) {
            console.error('AI service error:', error);
            return {
                hints: ['AI hints are temporarily unavailable. Try the basic hints below!']
            };
        }
    }

    async analyzeCode(code: string, challenge: any): Promise<string> {
        const systemPrompt = `You are a JavaScript expert. Analyze this code and provide a brief, educational explanation of what it does and how it works.`;

        const userPrompt = `Analyze this JavaScript code for a ${challenge.topic} challenge:

\`\`\`javascript
${code}
\`\`\`

Provide a clear, educational explanation of how this code works.`;

        try {
            return await this.makeRequest([
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]);
        } catch (error) {
            console.error('AI analysis error:', error);
            return 'Code analysis is temporarily unavailable.';
        }
    }

    private parseHints(response: string): string[] {
        // Extract hints from the AI response
        const lines = response.split('\n').filter(line => line.trim());
        const hints: string[] = [];

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.match(/^\d+\./) || trimmed.startsWith('-') || trimmed.startsWith('•')) {
                hints.push(trimmed.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, ''));
            }
        }

        // If no numbered/bulleted hints found, split by sentences
        if (hints.length === 0) {
            const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 10);
            hints.push(...sentences.slice(0, 3).map(s => s.trim()));
        }

        return hints.slice(0, 3);
    }

    private extractExplanation(response: string): string | undefined {
        // Look for explanation sections
        const explanationMatch = response.match(/explanation[:\s]*(.+)/i);
        return explanationMatch ? explanationMatch[1].trim() : undefined;
    }

    private extractSuggestions(response: string): string[] {
        // Look for suggestion sections
        const suggestions: string[] = [];
        const lines = response.split('\n');

        for (const line of lines) {
            if (line.toLowerCase().includes('suggest') || line.toLowerCase().includes('try')) {
                suggestions.push(line.trim());
            }
        }

        return suggestions.slice(0, 2);
    }

    isConfigured(): boolean {
        return !!this.apiKey;
    }
}

export const aiService = new AIService();
