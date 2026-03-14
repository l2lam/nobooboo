import { MockDataService } from './mock/DataService';
import type { IDataService } from './types';

class ServiceFactory {
    private static dataService: IDataService;

    static initialize() {
        this.dataService = new MockDataService();
    }

    static getDataService(): IDataService {
        if (!this.dataService) {
            this.initialize();
        }
        return this.dataService;
    }
}

export default ServiceFactory;
