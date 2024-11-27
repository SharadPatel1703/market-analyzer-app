type CacheItem<T> = {
    data: T;
    timestamp: number;
};

class CacheManager {
    private cache: Map<string, CacheItem<any>>;
    private readonly TTL: number; // Time to live in milliseconds

    constructor(ttlMinutes: number = 5) {
        this.cache = new Map();
        this.TTL = ttlMinutes * 60 * 1000;
    }

    set<T>(key: string, data: T): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }

    get<T>(key: string): T | null {
        const item = this.cache.get(key);
        if (!item) return null;

        const isExpired = Date.now() - item.timestamp > this.TTL;
        if (isExpired) {
            this.cache.delete(key);
            return null;
        }

        return item.data as T;
    }

    clear(): void {
        this.cache.clear();
    }

    remove(key: string): void {
        this.cache.delete(key);
    }
}

export const cache = new CacheManager();