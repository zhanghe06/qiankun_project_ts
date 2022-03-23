import { http } from "./request";

interface CertInterface {
    auth_id: string
    p_version: string
    cont_rep: string
    not_before: string
    not_after: string
    enabled_state?: number
}

interface CertListInterface {
    entries: Array<CertInterface>
    total_count: number
}

class CertService {
    getAll(params: any) {
        // return http.get<CertListInterface>("/cert", {params});
        return http.get<any>("/cert", {params});
    }
    get(id: string) {
        return http.get<CertInterface>(`/cert/${id}`);
    }
    create(data: CertInterface) {
        return http.post<CertInterface>("/cert", data);
    }
    update(data: CertInterface, id: any) {
        return http.put<any>(`/cert/${id}`, data);
    }
    delete(id: any) {
        return http.delete<any>(`/cert/${id}`);
    }
    deleteAll() {
        return http.delete<any>(`/cert`);
    }
    findByTitle(title: string) {
        return http.get<Array<CertInterface>>(`/cert?title=${title}`);
    }
}
export default new CertService();
