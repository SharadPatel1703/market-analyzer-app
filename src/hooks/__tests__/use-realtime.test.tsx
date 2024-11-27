import { renderHook, act } from '@testing-library/react';
import { useRealtime } from '../use-realtime';

const mockSubscribe = jest.fn();
const mockUnsubscribe = jest.fn();

// Mock the websocket service directly in the hook file
jest.mock('@/lib/websocket-service', () => ({
    wsService: {
        subscribe: (...args: any[]) => mockSubscribe(...args),
        unsubscribe: (...args: any[]) => mockUnsubscribe(...args),
    }
}));

describe('useRealtime', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('subscribes to websocket on mount', () => {
        const type = 'test-type';
        const initialData = { value: 'initial' };

        renderHook(() => useRealtime(type, initialData));

        expect(mockSubscribe).toHaveBeenCalledWith(type, expect.any(Function));
    });

    it('unsubscribes from websocket on unmount', () => {
        const type = 'test-type';
        const initialData = { value: 'initial' };

        const { unmount } = renderHook(() => useRealtime(type, initialData));

        act(() => {
            unmount();
        });

        expect(mockUnsubscribe).toHaveBeenCalledWith(type);
    });

    it('returns initial data', () => {
        const type = 'test-type';
        const initialData = { value: 'initial' };

        const { result } = renderHook(() => useRealtime(type, initialData));

        expect(result.current).toEqual(initialData);
    });
});