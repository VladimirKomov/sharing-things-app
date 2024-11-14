export interface Token {
    access: string;
    refresh: string;
}

export interface CurrentUser {
    id: number;
    username: string;
}