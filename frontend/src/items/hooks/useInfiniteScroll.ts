import { useCallback, useRef } from 'react';

//custom hook for handing infinite scrolling
const useInfiniteScroll = (
    loading: boolean,
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    onNextPage: () => void,
    onPreviousPage: () => void
) => {
    const observer = useRef<IntersectionObserver | null>(null);

    //load next page if the end (scroll down)
    const lastItemRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading || !hasNextPage) return;

            //disconnect observer
            if (observer.current) observer.current.disconnect();

            //new observer
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    onNextPage();
                }
            });

            //observe the new nod
            if (node) observer.current.observe(node);
        },
        [loading, hasNextPage, onNextPage]
    );

    //load the previous page (scroll up)
    const firstItemRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading || !hasPreviousPage) return;

            //disconnect observer
            if (observer.current) observer.current.disconnect();

            //new observer
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    onPreviousPage();
                }
            });

            //observe the new nod
            if (node) observer.current.observe(node);
        },
        [loading, hasPreviousPage, onPreviousPage]
    );

    return { lastItemRef, firstItemRef };
};

export default useInfiniteScroll;