import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseIntersectionObserverReturn {
  ref: RefObject<HTMLDivElement | null>;
  isVisible: boolean;
  entry: IntersectionObserverEntry | null;
}

export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn => {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = false
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        const isIntersecting = entry.isIntersecting;

        if (isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        root,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, root, rootMargin, triggerOnce]);

  return { ref, isVisible, entry };
};

// Hook for multiple elements
export const useIntersectionObserverMultiple = (
  options: UseIntersectionObserverOptions = {}
) => {
  const [visibleElements, setVisibleElements] = useState<Set<Element>>(new Set());
  const [entries, setEntries] = useState<Map<Element, IntersectionObserverEntry>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsRef = useRef<Set<Element>>(new Set());

  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = false
  } = options;

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (observerEntries) => {
        const newEntries = new Map(entries);
        const newVisibleElements = new Set(visibleElements);

        observerEntries.forEach((entry) => {
          newEntries.set(entry.target, entry);

          if (entry.isIntersecting) {
            newVisibleElements.add(entry.target);
            if (triggerOnce) {
              observerRef.current?.unobserve(entry.target);
              elementsRef.current.delete(entry.target);
            }
          } else if (!triggerOnce) {
            newVisibleElements.delete(entry.target);
          }
        });

        setEntries(newEntries);
        setVisibleElements(newVisibleElements);
      },
      {
        threshold,
        root,
        rootMargin
      }
    );

    // Observe existing elements
    elementsRef.current.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold, root, rootMargin, triggerOnce]);

  const observe = (element: Element) => {
    if (elementsRef.current.has(element)) return;

    elementsRef.current.add(element);
    observerRef.current?.observe(element);
  };

  const unobserve = (element: Element) => {
    elementsRef.current.delete(element);
    observerRef.current?.unobserve(element);

    const newEntries = new Map(entries);
    newEntries.delete(element);
    setEntries(newEntries);

    const newVisibleElements = new Set(visibleElements);
    newVisibleElements.delete(element);
    setVisibleElements(newVisibleElements);
  };

  const isVisible = (element: Element): boolean => {
    return visibleElements.has(element);
  };

  const getEntry = (element: Element): IntersectionObserverEntry | undefined => {
    return entries.get(element);
  };

  return {
    observe,
    unobserve,
    isVisible,
    getEntry,
    visibleElements: Array.from(visibleElements),
    entries: Array.from(entries.values())
  };
};

// Hook for lazy loading
export const useLazyLoading = (options: UseIntersectionObserverOptions = {}) => {
  const { ref, isVisible } = useIntersectionObserver({
    triggerOnce: true,
    threshold: 0.1,
    ...options
  });

  return { ref, shouldLoad: isVisible };
};

// Hook for infinite scrolling
export const useInfiniteScroll = (
  callback: () => void,
  options: UseIntersectionObserverOptions = {}
) => {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 1.0,
    ...options
  });

  useEffect(() => {
    if (isVisible) {
      callback();
    }
  }, [isVisible, callback]);

  return { ref };
};

// Hook for fade-in animations
export const useFadeInOnView = (options: UseIntersectionObserverOptions = {}) => {
  const { ref, isVisible } = useIntersectionObserver({
    triggerOnce: true,
    threshold: 0.1,
    ...options
  });

  return {
    ref,
    isVisible,
    className: isVisible ? 'fade-in' : 'fade-out'
  };
};