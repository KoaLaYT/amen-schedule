import { RestApi } from "./api";

export interface StatVo {
    id: number;
    taughtDate: string;
    startTime: string;
    endTime: string;
    fee: number;
}

export interface StatAllVo {
    fee: number;
}

export class StatApi {
    /**
     * 获取某学生，在一段时间内上过的课.
     */
    static async summary(studentId: number, dateRange: [string, string]) {
        return (
            (await RestApi.get<StatVo[]>(
                `/stat/${studentId}?startDate=${dateRange[0]}&endDate=${dateRange[1]}`
            )) ?? []
        );
    }

    /**
     * 计算某月份的课时费.
     */
    static async all(month: string): Promise<number> {
        const result = await RestApi.get<StatAllVo>(`/stat/all?month=${month}`);
        return result?.fee || 0;
    }
}
