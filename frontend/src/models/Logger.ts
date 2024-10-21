import {log} from "../config.ts";

export class Logger {
    static logError(error_text: string): void {
        log.error(`${this.getCurrentData()}: ${error_text}`)
    }

    static getCurrentData():string {
        return new Date().toISOString();
    }
}