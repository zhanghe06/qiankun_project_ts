import { http } from "./request";

interface ConfInterface {
    server_host: string;
    server_port: number;
    from_email: string;
    from_passwd: string;
    from_name?: string;
}

class ConfService {
    get_email() {
        return http.get<any>(`/notice_conf/email`);
    }
    put_email(data: ConfInterface) {
        return http.put<any>(`/notice_conf/email`, data);
    }
}
export default new ConfService();
