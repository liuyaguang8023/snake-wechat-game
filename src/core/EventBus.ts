type Handler = (data: any) => void;

export class EventBus {
  private handlers: Map<string, Set<Handler>> = new Map();

  on(event: string, handler: Handler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  off(event: string, handler: Handler): void {
    this.handlers.get(event)?.delete(handler);
  }

  emit(event: string, data?: any): void {
    this.handlers.get(event)?.forEach((handler) => handler(data));
  }

  clear(): void {
    this.handlers.clear();
  }
}
