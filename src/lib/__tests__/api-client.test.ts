// Must be first
jest.mock('../cache', () => ({
    cache: {
        get: jest.fn(),
        set: jest.fn(),
        remove: jest.fn(),
        clear: jest.fn()
    }
}));

// Then imports
import { api, APIError } from '../api-client';
import { cache } from '../cache';

describe('API Client', () => {
    // Mock fetch for each test
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    beforeEach(() => {
        jest.clearAllMocks();
        mockFetch.mockReset();
        // Set default successful response
        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            statusText: 'OK',
            json: async () => ({})
        });
    });

    it('uses cache for GET requests', async () => {
        const mockData = { id: 1, name: 'Test' };
        const expectedUrl = 'http://localhost:8000/api/competitors';

        // Setup cache hit
        (cache.get as jest.Mock).mockReturnValue(mockData);

        const result = await api.competitors.getAll();

        expect(result).toEqual(mockData);
        expect(cache.get).toHaveBeenCalledWith(expectedUrl);
        expect(mockFetch).not.toHaveBeenCalled();
        expect(cache.set).not.toHaveBeenCalled();
    });

    it('fetches data when cache misses', async () => {
        const mockData = { id: 1, name: 'Test' };
        const expectedUrl = 'http://localhost:8000/api/competitors';

        // Setup cache miss
        (cache.get as jest.Mock).mockReturnValue(null);

        // Setup fetch response
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            statusText: 'OK',
            json: async () => mockData
        });

        const result = await api.competitors.getAll();

        expect(result).toEqual(mockData);
        expect(mockFetch).toHaveBeenCalledWith(
            expectedUrl,
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Content-Type': 'application/json'
                })
            })
        );
        expect(cache.set).toHaveBeenCalledWith(expectedUrl, mockData);
    });

    it('handles failed requests', async () => {
        (cache.get as jest.Mock).mockReturnValue(null);

        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
            json: async () => ({ error: 'Not found' })
        });

        await expect(api.competitors.getById('1')).rejects.toThrow(APIError);
    });

    it('invalidates cache on mutations', async () => {
        const mockData = { id: 1, name: 'Test' };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            statusText: 'OK',
            json: async () => mockData
        });

        await api.competitors.create(mockData);

        expect(cache.remove).toHaveBeenCalledWith('/competitors');
        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:8000/api/competitors',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify(mockData),
                headers: expect.objectContaining({
                    'Content-Type': 'application/json'
                })
            })
        );
    });

    it('handles update operations correctly', async () => {
        const mockData = { id: 1, name: 'Updated Test' };
        const id = '1';

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            statusText: 'OK',
            json: async () => mockData
        });

        await api.competitors.update(id, mockData);

        expect(cache.remove).toHaveBeenCalledWith('/competitors');
        expect(cache.remove).toHaveBeenCalledWith(`/competitors/${id}`);
        expect(mockFetch).toHaveBeenCalledWith(
            `http://localhost:8000/api/competitors/${id}`,
            expect.objectContaining({
                method: 'PUT',
                body: JSON.stringify(mockData),
                headers: expect.objectContaining({
                    'Content-Type': 'application/json'
                })
            })
        );
    });

    it('handles delete operations correctly', async () => {
        const id = '1';
        const mockResponse = { success: true };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            statusText: 'OK',
            json: async () => mockResponse
        });

        await api.competitors.delete(id);

        expect(cache.remove).toHaveBeenCalledWith('/competitors');
        expect(mockFetch).toHaveBeenCalledWith(
            `http://localhost:8000/api/competitors/${id}`,
            expect.objectContaining({
                method: 'DELETE',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json'
                })
            })
        );
    });
});