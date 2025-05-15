import { renderHook } from '@testing-library/react';
import { useInfiniteScroll } from '../src/hooks/useInfiniteScroll';

describe('useInfiniteScroll', () => {
  const mockIntersectionObserver = jest.fn();
  const mockDisconnect = jest.fn();
  const mockObserve = jest.fn();

  beforeEach(() => {
    mockIntersectionObserver.mockReset();
    mockDisconnect.mockReset();
    mockObserve.mockReset();

    mockIntersectionObserver.mockImplementation(() => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
    }));

    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('membuat observer dengan konfigurasi yang benar', () => {
    const onLoadMore = jest.fn();
    renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        loading: false,
        rootMargin: '20px',
        threshold: 1.0,
      })
    );

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        root: null,
        rootMargin: '20px',
        threshold: 1.0,
      }
    );
  });

  it('memanggil onLoadMore ketika elemen terlihat dan tidak sedang loading', () => {
    const onLoadMore = jest.fn();
    renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        loading: false,
      })
    );

    const [observerCallback] = mockIntersectionObserver.mock.calls[0];
    observerCallback([{ isIntersecting: true }]);

    expect(onLoadMore).toHaveBeenCalled();
  });

  it('tidak memanggil onLoadMore ketika loading', () => {
    const onLoadMore = jest.fn();
    renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        loading: true,
      })
    );

    const [observerCallback] = mockIntersectionObserver.mock.calls[0];
    observerCallback([{ isIntersecting: true }]);

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('membersihkan observer saat unmount', () => {
    const { unmount } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore: jest.fn(),
        loading: false,
      })
    );

    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('mengamati elemen ketika ref tersedia', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore: jest.fn(),
        loading: false,
      })
    );

    const mockElement = document.createElement('div');
    result.current.loadMoreRef.current = mockElement;

    // Trigger useEffect
    const [observerCallback] = mockIntersectionObserver.mock.calls[0];
    observerCallback([{ isIntersecting: true }]);

    expect(mockObserve).toHaveBeenCalledWith(mockElement);
  });
});