declare namespace NodeJS {
    export interface ProcessEnv {
        DATABASE_URL: string;
        TWILIO_SID: string;
        TWILIO_TOKEN: string;
        TWILIO_SERVICE: string;
        TWILIO_SENDER: string;
        SENDGRID_API_KEY: string;
        SECRET_KEY: string;
        COOKIE_NAME: string;
    }
}
