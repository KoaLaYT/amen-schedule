import { Student } from "../stores/student";
import { CommonUtil } from "../utils/common.util";
import { RestApi } from "./api"

interface StudentVo extends StudentDto {
    id: number;
}

interface StudentDto {
    name: string;
    lessonDuration: number;
    lessonFee: number;
    fontColor: string;
    backgroundColor: string;

}

export class StudentApi {
    /**
     * 学生列表.
     */
    static async summary() {
        const students: StudentVo[] = await RestApi.get("/student/summary") ?? []

        CommonUtil.log('students: ', students)

        return students.map(convert).filter(Boolean) as Student[]
    }

    /**
     * 创建学生.
     */
    static async create(dto: Student) {
        const result: StudentVo | undefined = await RestApi.post("/student", <StudentDto>{
            name: dto.name,
            lessonDuration: 45, // TODO
            lessonFee: Number(dto.fee),
            fontColor: dto.fgColor,
            backgroundColor: dto.bgColor
        })
        return convert(result)
    }

    /**
     * 更新学生. 
     */
    static async update(dto: Student) {
        const result: StudentVo | undefined = await RestApi.put(`/student/${dto.id}`, <StudentDto>{
            name: dto.name,
            lessonDuration: 45, // TODO
            lessonFee: Number(dto.fee),
            fontColor: dto.fgColor,
            backgroundColor: dto.bgColor
        })
        return convert(result)
    }
}

function convert(vo?: StudentVo) {
    if (!vo) {
        return undefined
    }

    return {
        id: vo.id,
        name: vo.name,
        fee: vo.lessonFee,
        fgColor: vo.fontColor,
        bgColor: vo.backgroundColor
    }
}