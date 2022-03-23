import { http } from "./request";

interface StrategyInterface {
    notice_type: number
    trigger_threshold: number
    to_emails: string
    enabled_state: number
    created_at: string
}

interface StrategyListInterface {
    entries: Array<StrategyInterface>
    total_count: number
}

class StrategyService {
    getAll(params: any) {
        // return http.get<StrategyListInterface>("/strategy", {params});
        return http.get<any>("/notice_strategy", {params});
    }
    get(id: string) {
        return http.get<StrategyInterface>(`/notice_strategy/${id}`);
    }
    create(data: StrategyInterface) {
        return http.post<StrategyInterface>("/notice_strategy", data);
    }
    update(data: StrategyInterface, id: any) {
        return http.put<any>(`/notice_strategy/${id}`, data);
    }
    delete(id: any) {
        return http.delete<any>(`/notice_strategy/${id}`);
    }
    deleteAll() {
        return http.delete<any>(`/notice_strategy`);
    }
    findByTitle(title: string) {
        return http.get<Array<StrategyInterface>>(`/notice_strategy?title=${title}`);
    }
}

export default new StrategyService();
