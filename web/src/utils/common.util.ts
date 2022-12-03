export class CommonUtil {
    /**
     * Is in development.
     */
    static isDev() {
        return window.location.hostname.includes("localhost")
    }

    /**
     * Log only in development. 
     */
    static log(...args: any[]) {
        if (this.isDev()) {
            console.log(...args)
        }
    }
}