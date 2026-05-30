type Handler = (data: any) => void;
export declare class EventBus {
    private handlers;
    on(event: string, handler: Handler): void;
    off(event: string, handler: Handler): void;
    emit(event: string, data?: any): void;
    clear(): void;
}
export {};
