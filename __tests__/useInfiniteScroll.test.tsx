import { renderHook } from '@testing-library/react';
import * as React from 'react';
import { useInfiniteScroll } from '../src/hooks/useInfiniteScroll';

describe('useInfiniteScroll', () => {
  const mockIntersectionObserver = jest.fn();
  const mockDisconnect = jest.fn();
  const mockObserve = jest.fn();

  beforeEach(() => {
    mockIntersectionObserver.mockImplementation((callback) => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: jest.fn(),
      takeRecords: jest.fn(),
      root: null,
      rootMargin: '',
      thresholds: [],
    }));

    window.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('memanggil onLoadMore ketika elemen terlihat dan tidak sedang loading', () => {
    const onLoadMore = jest.fn();
    const { result } = renderHook(() =>
      useInfiniteScroll({ onLoadMore, loading: false })
    );

    expect(mockIntersectionObserver).toHaveBeenCalled();

    const [callback] = mockIntersectionObserver.mock.calls[0];
    callback([{ isIntersecting: true }]);

    expect(onLoadMore).toHaveBeenCalled();
  });

  it('tidak memanggil onLoadMore ketika sedang loading', () => {
    const onLoadMore = jest.fn();
    renderHook(() => useInfiniteScroll({ onLoadMore, loading: true }));

    const [callback] = mockIntersectionObserver.mock.calls[0];
    callback([{ isIntersecting: true }]);

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('membersihkan observer ketika komponen di-unmount', () => {
    const { unmount } = renderHook(() =>
      useInfiniteScroll({ onLoadMore: jest.fn(), loading: false })
    );

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('menggunakan rootMargin dan threshold yang diberikan', () => {
    const customRootMargin = '10px';
    const customThreshold = 0.5;

    renderHook(() =>
      useInfiniteScroll({
        onLoadMore: jest.fn(),
        loading: false,
        rootMargin: customRootMargin,
        threshold: customThreshold,
      })
    );

    const [, options] = mockIntersectionObserver.mock.calls[0];

    expect(options.rootMargin).toBe(customRootMargin);
    expect(options.threshold).toBe(customThreshold);
  });

  it('mengobservasi loadMoreRef ketika ref tersedia', () => {
    const mockElement = document.createElement('div');
    let refCallback: (element: HTMLDivElement | null) => void = () => {};

    jest.spyOn(React, 'useRef').mockImplementation(() => ({
      current: mockElement,
      set current(value: any) {
        refCallback(value);
      }
    }));

    renderHook(() =>
      useInfiniteScroll({ onLoadMore: jest.fn(), loading: false })
    );

    expect(mockObserve).toHaveBeenCalledWith(mockElement);
  });
});