import { http } from "./request";

interface StrategyInterface {
    id?: number
    notice_type: number
    trigger_threshold: number
    to_emails: string
    enabled_state: number
    created_at?: string
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
    get(id: number) {
        return http.get<StrategyInterface>(`/notice_strategy/${id}`);
    }
    create(data: StrategyInterface) {
        return http.post<any>("/notice_strategy", data);
    }
    update(data: any, id: any) {
        return http.put<any>(`/notice_strategy/${id}`, data);
    }
    delete(id: number) {
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
