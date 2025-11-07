import { useState } from 'react';

// Using Groq API - Completely FREE with fast inference
// Get your free API key at: https://console.groq.com/keys
// Free tier: Unlimited requests (with rate limits) - perfect for this use case
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateText = async (prompt: string): Promise<string | null> => {
    if (!GROQ_API_KEY) {
      setError('Groq API key not configured. Add NEXT_PUBLIC_GROQ_API_KEY to your .env.local');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile', // Fast and high quality
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Groq API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
        });
        throw new Error(
          `Groq API error (${response.status}): ${
            errorData.error?.message || response.statusText
          }`
        );
      }

      const data: GroqResponse = await response.json();
      console.log('Groq API response:', data);

      const generatedText = data.choices[0]?.message?.content || null;

      setLoading(false);
      return generatedText;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate text';
      console.error('Groq hook error:', errorMessage);
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  return { generateText, loading, error };
}

// Helper functions for specific use cases
export function useGeminiProblemHelper() {
  const { generateText, loading, error } = useGemini();

  const improveProblem = async (
    userInput: string,
    language: 'en' | 'es' = 'en',
    context?: {
      projectType?: string;
      targetUser?: string;
    }
  ) => {
    const contextInfo = context ? {
      en: `\n\nAdditional context:
${context.projectType ? `- Project type: ${context.projectType}` : ''}
${context.targetUser ? `- Target user: ${context.targetUser}` : ''}`,
      es: `\n\nContexto adicional:
${context.projectType ? `- Tipo de proyecto: ${context.projectType}` : ''}
${context.targetUser ? `- Usuario objetivo: ${context.targetUser}` : ''}`
    } : { en: '', es: '' };

    const prompts = {
      en: `You are a product strategist helping someone articulate their product idea.

User's basic idea: "${userInput}"${contextInfo.en}

Expand this into a clear, compelling problem statement (2-3 sentences) that explains:
1. WHY this problem matters
2. WHO experiences this frustration
3. WHAT is the current painful solution

Write in a professional but conversational tone. Focus on the human impact and frustration, not features.

IMPORTANT: Respond in English, even if the user's input was in another language.

Example format:
"[Target users] deserve [desired outcome] without [current pain points]. Today, [current situation] forces them to [bad consequences]. The friction is real, and the solution should be [desired quality]."

Problem statement:`,
      es: `Eres un estratega de producto ayudando a alguien a articular su idea de producto.

Idea básica del usuario: "${userInput}"${contextInfo.es}

Expande esto en una declaración de problema clara y convincente (2-3 oraciones) que explique:
1. POR QUÉ este problema importa
2. QUIÉN experimenta esta frustración
3. CUÁL es la solución dolorosa actual

Escribe en tono profesional pero conversacional. Enfócate en el impacto humano y la frustración, no en features.

IMPORTANTE: Responde en español, incluso si el input del usuario estaba en otro idioma.

Ejemplo de formato:
"[Usuarios objetivo] merecen [resultado deseado] sin [puntos de dolor actuales]. Hoy, [situación actual] los obliga a [malas consecuencias]. La fricción es real, y la solución debería ser [calidad deseada]."

Declaración del problema:`,
    };

    return generateText(prompts[language]);
  };

  return { improveProblem, loading, error };
}

export function useGeminiUserHelper() {
  const { generateText, loading, error } = useGemini();

  const improveTargetUser = async (
    userInput: string,
    language: 'en' | 'es' = 'en',
    context?: {
      projectType?: string;
      problem?: string;
    }
  ) => {
    const contextInfo = context ? {
      en: `\n\nAdditional context:
${context.projectType ? `- Project type: ${context.projectType}` : ''}
${context.problem ? `- Problem they're solving: ${context.problem}` : ''}`,
      es: `\n\nContexto adicional:
${context.projectType ? `- Tipo de proyecto: ${context.projectType}` : ''}
${context.problem ? `- Problema que resuelven: ${context.problem}` : ''}`
    } : { en: '', es: '' };

    const prompts = {
      en: `You are a product strategist helping someone define their target user.

User's basic idea: "${userInput}"${contextInfo.en}

Refine this into a specific, actionable target user description (1 concise sentence) that includes:
1. WHO they are (role/identity)
2. WHAT they're trying to accomplish
3. WHY they need this (their core need)

Be specific, not generic. Avoid "people who want..." and focus on concrete identities and needs.

IMPORTANT: Respond in English, even if the user's input was in another language.

Examples:
- "Restaurant owners managing loyalty programs who need to increase repeat customers"
- "Freelance designers juggling multiple clients who struggle to track project timelines"
- "First-time car sellers who need quick cash without losing their vehicle immediately"

Target user:`,
      es: `Eres un estratega de producto ayudando a alguien a definir su usuario objetivo.

Idea básica del usuario: "${userInput}"${contextInfo.es}

Refina esto en una descripción específica y accionable del usuario objetivo (1 oración concisa) que incluya:
1. QUIÉNES son (rol/identidad)
2. QUÉ están tratando de lograr
3. POR QUÉ necesitan esto (su necesidad central)

Sé específico, no genérico. Evita "personas que quieren..." y enfócate en identidades y necesidades concretas.

IMPORTANTE: Responde en español, incluso si el input del usuario estaba en otro idioma.

Ejemplos:
- "Dueños de restaurantes que gestionan programas de lealtad y necesitan incrementar clientes recurrentes"
- "Diseñadores freelance manejando múltiples clientes que luchan por rastrear tiempos de proyecto"
- "Vendedores de autos por primera vez que necesitan efectivo rápido sin perder su vehículo inmediatamente"

Usuario objetivo:`,
    };

    return generateText(prompts[language]);
  };

  return { improveTargetUser, loading, error };
}
