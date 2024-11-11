import {log} from "../config.ts";


export class Logger {
    static logError(error_text: string): void {
        log.error(`ERROR: ${this.getCurrentData()}: ${error_text}`)
    }

    static logResponse(response_text: string): void {
        log.info(`RES: ${this.getCurrentData()}: ${response_text}`)
    }

    static logRequest(request_text: string): void {
        log.info(`REQ: ${this.getCurrentData()}: ${request_text}`)
    }

    static getCurrentData(): string {
        return new Date().toISOString();
    }
}