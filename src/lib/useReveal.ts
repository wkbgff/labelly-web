import { useEffect, type RefObject } from 'react';
import { prefersReducedMotion } from './prefersReducedMotion';

/*
 * 스크롤 스태거 등장(원본 setupReveals의 [data-reveal] 처리)을 그대로 재현.
 * - 첫 화면에 이미 보이는 요소는 숨기지 않고 그대로 둡니다.
 * - 화면 아래 요소는 opacity 0 / translate(x,16px)로 숨겼다가 뷰포트 진입 시 data-reveal(ms) 만큼
 *   지연 후 등장시킵니다. data-reveal-x 로 가로 오프셋을 줄 수 있습니다.
 * - prefers-reduced-motion 시 아무것도 하지 않아 요소가 처음부터 보입니다.
 * opacity/transform 은 DOM에 직접 세팅하므로, 해당 요소의 JSX style 에는 이 속성들을 넣지 않습니다.
 */
export function useReveal(rootRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = rootRef.current;
    if (!root) return;

    const timeouts: number[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const t = en.target as HTMLElement;
          io.unobserve(t);
          const d = +(t.getAttribute('data-reveal') || 0);
          timeouts.push(
            window.setTimeout(() => {
              t.style.opacity = '1';
              t.style.transform = 'translate(0px, 0px)';
            }, d),
          );
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.1 },
    );

    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    els.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight - 40) return;
      const x = el.getAttribute('data-reveal-x') || '0';
      el.style.opacity = '0';
      el.style.transform = `translate(${x}px, 16px)`;
      el.style.transition =
        'opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1)';
      io.observe(el);
    });

    return () => {
      timeouts.forEach(clearTimeout);
      io.disconnect();
    };
  }, [rootRef]);
}
