type MessageHandler = (data: any) => void;

export class WebSocketService {
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private messageHandlers: Map<string, MessageHandler> = new Map();

    constructor(private url: string) {
        this.connect();
    }

    private connect(): void {
        try {
            this.ws = new WebSocket(this.url);

            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.reconnectAttempts = 0;
            };

            this.ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    if (message.type && this.messageHandlers.has(message.type)) {
                        this.messageHandlers.get(message.type)!(message.data);
                    }
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            };

            this.ws.onclose = () => {
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
                }
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            console.error('Error connecting to WebSocket:', error);
        }
    }

    subscribe(type: string, handler: MessageHandler): void {
        this.messageHandlers.set(type, handler);
    }

    unsubscribe(type: string): void {
        this.messageHandlers.delete(type);
    }

    send(type: string, data: any): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, data }));
        }
    }

    disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

export const wsService = new WebSocketService(
    process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws'
);