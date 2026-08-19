import { useEffect, useState } from 'react';
import { computeStats, defaultStats, type SiteStats } from '../site-config';

/**
 * public/stats.json (GitHub Actions `update-stats`가 하루 1회 실제 DB 카운트로 갱신)을
 * 런타임에 읽어 실제 값으로 대체합니다. fetch 실패/부재 시 site-config 기본값을 유지해
 * 숫자가 비어 보이지 않게 합니다. (알레르기 21종은 조회 대상이 아니라 항상 하드코딩값)
 */
export function useSiteStats(): SiteStats {
  const [stats, setStats] = useState<SiteStats>(defaultStats);

  useEffect(() => {
    let alive = true;
    fetch(`${import.meta.env.BASE_URL}stats.json`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('stats.json 없음'))))
      .then((j: unknown) => {
        if (!alive || typeof j !== 'object' || j === null) return;
        const data = j as { productCount?: unknown; personaCount?: unknown };
        const pc = typeof data.productCount === 'number' ? data.productCount : defaultStats.productCount;
        const pe = typeof data.personaCount === 'number' ? data.personaCount : defaultStats.personaCount;
        setStats(computeStats(pc, pe));
      })
      .catch(() => {
        /* 폴백: 기본값 유지 */
      });
    return () => {
      alive = false;
    };
  }, []);

  return stats;
}
