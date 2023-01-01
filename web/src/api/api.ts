import { Toast } from "vant"
import { CommonUtil } from "../utils/common.util";
import 'vant/es/toast/style';

interface CommonResponse<T> {
    code: number;
    msg: string;
    data: T
}

export class RestApi {

    static baseUrl = CommonUtil.isDev()
        ? `http://localhost:3000` : 'https://api.upnqhl.top/api'

    static async get<T>(path: string): Promise<T | undefined> {
        return this.safeFetch(path)
    }

    static async put<T>(path: string, body: any): Promise<T | undefined> {
        return this.safeFetch(path, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
    }

    static async post<T>(path: string, body: any): Promise<T | undefined> {
        return this.safeFetch(path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
    }

    static async delete(path: string): Promise<void> {
        await this.safeFetch(path, {
            method: 'DELETE',
        })
    }

    private static async safeFetch<T>(path: RequestInfo | URL, options?: RequestInit): Promise<T | undefined> {
        try {
            const response = await fetch(`${this.baseUrl}${path}`, options)
            const body: CommonResponse<T> = await response.json()
            if (body.code == 0) {
                return body.data
            }
            console.error(body)
            Toast.fail(body.msg)
        } catch (e) {
            console.error(e)
            Toast.fail("很坏")
        }

        return undefined
    }

}
