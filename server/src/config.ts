export interface Config {
    port: number;
    isDev: boolean;
}

export const config: Config = {
    port: +(process.env.PORT || 3000),
    isDev: process.env.NODE_ENV == "development"
}