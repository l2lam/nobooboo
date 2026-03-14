import type { Question, Topic } from '../types';
export type { Question, Topic };

export interface IDataService {
    getQuestions(topicId: string, count: number): Promise<Question[]>;
    saveTopic(topic: Topic, questions: Question[]): Promise<boolean>;
    getAllTopics(): Promise<Topic[]>;
    getTopic(id: string): Promise<Topic | null>;
    getTopicQuestions(topicId: string): Promise<Question[]>;
}
