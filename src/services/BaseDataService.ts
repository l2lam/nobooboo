import type { Question, QuestionTemplate, Topic } from '../types';
import { factorial, permutations, combinations } from 'mathjs';

export abstract class BaseDataService {
    protected libraryTopics: Topic[] = [];
    protected libraryQuestions: Map<string, Question[]> = new Map();

    constructor() {
        this.loadLibrary();
    }

    private loadLibrary() {
        const modules = import.meta.glob('../data/topics/*.json', { eager: true });

        for (const path in modules) {
            const content = (modules[path] as any).default;
            if (Array.isArray(content)) {
                const topicId = path.split('/').pop()?.replace('.json', '') || 'unknown';
                const topic: Topic = { id: topicId, name: topicId.replace(/-/g, ' ').toUpperCase(), isBuiltIn: true };
                this.libraryTopics.push(topic);

                const questions = content.map((q: any) => ({ ...q, topicId: topic.id }));
                this.libraryQuestions.set(topic.id, questions);
            } else if (content && typeof content === 'object') {
                const topicId = path.split('/').pop()?.replace('.json', '') || 'unknown';
                const topic: Topic = {
                    id: content.id || topicId,
                    name: content.name || 'Unknown Topic',
                    description: content.description,
                    category: content.category,
                    isBuiltIn: true
                };
                this.libraryTopics.push(topic);

                const questions = (content.questions || []).map((q: any) => ({
                    ...q,
                    topicId: topic.id
                }));
                this.libraryQuestions.set(topic.id, questions);
            }
        }
    }

    public getLibraryTopics(): Topic[] {
        return this.libraryTopics;
    }

    public getLibraryQuestions(topicId: string): Question[] {
        const templates = this.libraryQuestions.get(topicId) || [];
        return templates.map(q => this.instantiateQuestion(q));
    }

    protected instantiateQuestion(q: Question | QuestionTemplate): Question {
        const template = q as QuestionTemplate;
        if (!template.variables) {
            return q as Question;
        }

        const values: Record<string, number> = {};
        for (const [key, def] of Object.entries(template.variables)) {
            const range = def.max - def.min + 1;
            values[key] = Math.floor(Math.random() * range) + def.min;
        }

        const evaluate = (str: string): string => {
            return str.replace(/{{(.*?)}}/g, (_, expression) => {
                try {
                    if (!/^[0-9+\-*/().\sA-Za-z,?:><="']+$/.test(expression)) {
                        console.warn('Unsafe expression skipped:', expression);
                        return `{{${expression}}}`;
                    }

                    const math = { factorial, permutations, combinations };
                    const keys = [...Object.keys(values), 'math', 'factorial', 'permutations', 'combinations'];
                    const args = [...Object.values(values), math, factorial, permutations, combinations];

                    // eslint-disable-next-line no-new-func
                    const func = new Function(...keys, `return (${expression})`);
                    return func(...args).toString();
                } catch (e) {
                    console.error('Failed to eval expression:', expression, e);
                    return `{{${expression}}}`;
                }
            });
        };

        return {
            ...q,
            id: q.id + '-' + Math.random().toString(36).substr(2, 5),
            text: evaluate(q.text),
            options: q.options.map(opt => evaluate(opt))
        } as Question;
    }

    public getLibraryTopic(id: string): Topic | null {
        return this.libraryTopics.find(t => t.id === id) || null;
    }

    public async getTopicQuestions(topicId: string): Promise<Question[]> {
        return this.getLibraryQuestions(topicId);
    }
}
