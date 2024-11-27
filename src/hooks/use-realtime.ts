import { useEffect, useState } from 'react';
import { wsService } from '@/lib/websocket-service';

export function useRealtime<T>(type: string, initialData: T): T {
    const [data, setData] = useState<T>(initialData);

    useEffect(() => {
        wsService.subscribe(type, (newData) => {
            setData(newData);
        });

        return () => {
            wsService.unsubscribe(type);
        };
    }, [type]);

    return data;
}