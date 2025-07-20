import { RestApi } from "./api";

export interface LoginDto {
    name: string;
    passwd: string;
}

export class UserApi {
    /**
     * 登陆.
     */
    static async login(name: string, passwd: string) {
        return await RestApi.post<boolean>("/user/login", <LoginDto>{
            name,
            passwd,
        });
    }
}

