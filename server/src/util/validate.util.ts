import { AppError } from "../type/common"

export class ValidateUtil {
    /**
     * basic date format (YYYY-MM-DD) check.
     */
    static checkDate(...dates: string[]) {
        const format = /\d{4}-\d{2}-\d{2}/

        for (const date of dates) {
            if (!format.test(date)) {
                AppError.throwBadParams(`Invalid date: ${date}`)
            }
        }
    }
}