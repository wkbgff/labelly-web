import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Hover } from '../lib/Hover';
import { useMediaQuery } from '../lib/useMediaQuery';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { useReveal } from '../lib/useReveal';
import { prefersReducedMotion } from '../lib/prefersReducedMotion';
import { DEMO, stats, storeUrls } from '../site-config';

// 섹션 스타일 prop (원본 principlesDark, 기본 true → 원칙 섹션 다크 변형)
const PRINCIPLES_DARK = true;

const HERO_SCORE = 48; // 신라면(신라면 큰사발) 종합건강관리 실제 점수 47.6 반올림 (persona_scores)
const C = 201; // 히어로 점수 링 둘레
const tier = (s: number) => (s >= 70 ? '좋은 편이에요' : s >= 40 ? '보통이에요' : '주의가 필요해요');
const pillBg = (s: number) => (s >= 70 ? '#E8F6EE' : s >= 40 ? '#FBF3DD' : '#FBEAEA');
const pillFg = (s: number) => (s >= 70 ? '#0F6E56' : s >= 40 ? '#8a6100' : '#B3121C');
const ringCol = (s: number) => (s >= 70 ? '#2E9E5B' : s >= 40 ? '#B8860B' : '#E5484D');

// 데모 히스토리 상품 (자리표시자)
const PRODUCTS = [
  { name: '농심 신라면', meta: '농심 · 120g', group: '오늘' },
  { name: '농심 새우깡', meta: '농심 · 90g', group: '오늘' },
  { name: '빙그레 메로나', meta: '빙그레 · 75mL', group: '어제' },
];

// 홈 FAQ 프리뷰 (고객센터 FAQ와 별개의 간단 버전)
const HOME_FAQS = [
  { q: '점수는 어떻게 계산되나요?', a: '정해진 기준의 코드로만 계산합니다. 선택한 페르소나마다 기준이 다르며, 같은 제품·같은 페르소나라면 언제나 같은 점수가 나옵니다.' },
  { q: '브랜드 광고나 협찬이 점수에 영향을 주나요?', a: '아니요. 광고 수익과 점수 계산은 구조적으로 분리되어 있어, 브랜드는 점수에 개입할 수 없습니다.' },
  { q: '스캔했는데 상품이 없어요.', a: '앱에서 사진 2장으로 제보해 주시면, 검토 후 데이터베이스에 반영됩니다.' },
  { q: '구독은 어떻게 해지하나요?', a: 'App Store 또는 Google Play의 구독 관리에서 언제든 해지할 수 있습니다. 자세한 경로는 고객센터에서 안내합니다.' },
];

interface DemoRow {
  name: string;
  meta: string;
  group: string;
  showGroup: boolean;
  score: string;
  comment: string;
  bg: string;
  fg: string;
}

export default function Home() {
  useDocumentMeta(
    '라벨리 — 한국 식품 바코드 스캔, 목표별 건강점수',
    '바코드 스캔으로 식품 성분과 알레르기를 확인하고, 내 목표에 맞는 건강점수와 더 나은 대체상품까지 보여주는 한국 식품 전문 앱, 라벨리.',
  );
  const isMobile = useMediaQuery('(max-width: 980px)');
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const demoElRef = useRef<HTMLDivElement>(null);

  const [heroPhase, setHeroPhase] = useState(0);
  const [heroScore, setHeroScore] = useState(0);
  const [trust, setTrust] = useState([0, 0, 0]);
  const [trustDone, setTrustDone] = useState(false);
  const [step, setStep] = useState(0);
  const [dispScores, setDispScores] = useState<number[]>(DEMO[0].scores.slice());
  const [openFaq, setOpenFaq] = useState(-1);

  const stepRef = useRef(0);
  const dispRef = useRef<number[]>(DEMO[0].scores.slice());
  const rollRaf = useRef<number | null>(null);

  // 스크롤 스태거([data-reveal]) — 소개 페이지와 공용
  useReveal(rootRef);

  // 히어로 좌측 카피 스태거([data-hero]) — 마운트 직후 지연 등장
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = rootRef.current;
    if (!root) return;
    const timeouts: number[] = [];
    root.querySelectorAll<HTMLElement>('[data-hero]').forEach((el) => {
      const d = +(el.getAttribute('data-hero') || 0) * 60;
      el.style.opacity = '0';
      el.style.transform = 'translate(0px, 16px)';
      el.style.transition = 'opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1)';
      timeouts.push(
        window.setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translate(0px, 0px)';
        }, 80 + d),
      );
    });
    return () => timeouts.forEach(clearTimeout);
  }, []);

  // 히어로 스캔→결과 사이클 + 점수 카운트업
  useEffect(() => {
    if (prefersReducedMotion()) {
      setHeroPhase(3);
      setHeroScore(HERO_SCORE);
      return;
    }
    const timeouts: number[] = [];
    let scoreRaf: number | null = null;
    const animHeroScore = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / 800);
        const e = 1 - Math.pow(1 - k, 3);
        setHeroScore(Math.round(HERO_SCORE * e));
        if (k < 1) scoreRaf = requestAnimationFrame(tick);
      };
      scoreRaf = requestAnimationFrame(tick);
    };
    const S = (ms: number, fn: () => void) => timeouts.push(window.setTimeout(fn, ms));
    const cycle = () => {
      setHeroPhase(0);
      setHeroScore(0);
      S(500, () => setHeroPhase(1));
      S(1600, () => {
        setHeroPhase(2);
        animHeroScore();
      });
      S(2600, () => setHeroPhase(3));
      S(5400, () => {
        while (timeouts.length) clearTimeout(timeouts.pop()!);
        cycle();
      });
    };
    cycle();
    return () => {
      while (timeouts.length) clearTimeout(timeouts.pop()!);
      if (scoreRaf) cancelAnimationFrame(scoreRaf);
    };
  }, []);

  // 신뢰 바 카운트업 (뷰포트 진입 시 1회)
  useEffect(() => {
    const el = rootRef.current?.querySelector('[data-screen-label="신뢰 바"]');
    if (!el) return;
    const target = [stats.displayProductCount || 0, stats.allergenCount || 0, stats.personaCount || 0];
    const reduced = prefersReducedMotion();
    let raf: number | null = null;
    let done = false;
    const io = new IntersectionObserver(
      (ents) => {
        if (!ents.some((e) => e.isIntersecting) || done) return;
        io.disconnect();
        done = true;
        if (reduced) {
          setTrust(target);
          setTrustDone(true);
          return;
        }
        const t0 = performance.now();
        const tick = (now: number) => {
          const k = Math.min(1, (now - t0) / 1200);
          const e = 1 - Math.pow(1 - k, 3);
          setTrust(target.map((v) => Math.round(v * e)));
          if (k < 1) raf = requestAnimationFrame(tick);
          else {
            setTrust(target);
            setTrustDone(true);
          }
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const rollTo = useCallback((idx: number) => {
    if (idx === stepRef.current) return;
    if (prefersReducedMotion()) {
      stepRef.current = idx;
      dispRef.current = DEMO[idx].scores.slice();
      setStep(idx);
      setDispScores(dispRef.current);
      return;
    }
    const from = dispRef.current.slice();
    const to = DEMO[idx].scores;
    if (rollRaf.current) cancelAnimationFrame(rollRaf.current);
    stepRef.current = idx;
    setStep(idx);
    const t0 = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / 220);
      const e = 1 - Math.pow(1 - k, 3);
      const next = from.map((f, i) => Math.round(f + (to[i] - f) * e));
      dispRef.current = next;
      setDispScores(next);
      if (k < 1) rollRaf.current = requestAnimationFrame(tick);
    };
    rollRaf.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => () => { if (rollRaf.current) cancelAnimationFrame(rollRaf.current); }, []);

  // 데스크톱: 스크롤 진행도에 따라 페르소나 데모 전환
  useEffect(() => {
    let raf: number | null = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const el = demoElRef.current;
        if (el && !isMobile) {
          const r = el.getBoundingClientRect();
          const total = el.offsetHeight - window.innerHeight;
          if (total > 0) {
            const prog = Math.min(1, Math.max(0, -r.top / total));
            const idx = Math.min(DEMO.length - 1, Math.floor(prog * DEMO.length));
            if (idx !== stepRef.current) rollTo(idx);
          }
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMobile, rollTo]);

  const scrollToDownload = useCallback(() => {
    const el = document.getElementById('download');
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 56,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    }
  }, []);

  // 다른 페이지에서 /#download 로 진입 시 다운로드 섹션으로 스크롤
  useEffect(() => {
    if (location.hash !== '#download') return;
    const t = window.setTimeout(scrollToDownload, 0);
    return () => clearTimeout(t);
  }, [location.hash, scrollToDownload]);

  // ---- 렌더 파생값 (원본 renderVals) ----
  const d = DEMO[step];
  const scanOp = heroPhase <= 1 ? 1 : 0;
  const resultOp = heroPhase >= 2 ? 1 : 0;
  const scanCaption = heroPhase >= 1 ? '바코드를 인식하고 있어요' : '바코드를 비춰주세요';
  const scanAnim = heroPhase === 1 ? 'lbHeroScan 1000ms cubic-bezier(0.4,0,0.2,1) forwards' : 'none';
  const ringOffset = heroPhase >= 2 ? String(C * (1 - HERO_SCORE / 100)) : String(C);
  const ringColor = heroPhase >= 2 ? ringCol(HERO_SCORE) : '#EEF1F2';
  const heroScoreText = heroPhase >= 2 ? String(heroScore) : '—';
  const heroTier = heroPhase >= 2 ? tier(HERO_SCORE) : '점수 계산 중';
  const altOp = heroPhase >= 3 ? 1 : 0;
  const altY = heroPhase >= 3 ? 0 : 14;
  const progW = String(((step + 1) / DEMO.length) * 100) + '%';
  const askActive = step === DEMO.length - 1;

  const demoRows: DemoRow[] = PRODUCTS.map((p, i) => ({
    name: p.name,
    meta: p.meta,
    group: p.group,
    showGroup: i === 0 || PRODUCTS[i - 1].group !== p.group,
    score: String(dispScores[i]),
    comment: d.comments[i],
    bg: pillBg(d.scores[i]),
    fg: pillFg(d.scores[i]),
  }));

  const heroStoreBtn = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '11px 18px',
    border: '1px solid #E8EAED',
    borderRadius: 12,
    background: '#FFFFFF',
    transition: 'background 150ms ease',
  } as const;
  const heroStoreHover = { background: '#F7F8F9', color: '#111417' };

  return (
    <div ref={rootRef} style={{ minHeight: '100vh', background: '#FFFFFF', color: '#111417' }}>
      <Header isMobile={isMobile} download={{ mode: 'scroll', onClick: scrollToDownload }} />

      {/* 히어로 */}
      <section data-screen-label="히어로" style={{ maxWidth: 1080, margin: '0 auto', padding: '132px 24px 96px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}>
        <div style={{ flex: '1.2 1 420px', minWidth: 0 }}>
          <h1 data-hero="0" style={{ margin: 0, fontSize: 'clamp(38px,5.2vw,60px)', fontWeight: 800, lineHeight: 1.16, letterSpacing: '-0.02em' }}>
            복잡한 성분표,
            <br />
            다 읽지 않아도 됩니다.
          </h1>
          <p data-hero="1" style={{ margin: '24px 0 0 0', fontSize: 17, lineHeight: 1.7, color: '#646B73', maxWidth: 720 }}>
            바코드를 스캔하면 내가 고른 페르소나 기준으로 점수와 더 나은 대체상품을 바로 보여드립니다.
            <br />
            브랜드는 점수에 개입할 수 없습니다.
          </p>
          <div data-hero="2" style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Hover as="a" href={storeUrls.appStore} style={heroStoreBtn} hoverStyle={heroStoreHover}>
              <svg width="21" height="21" viewBox="0 0 384 512" fill="#111417" aria-hidden="true">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.7-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
              </svg>
              <div>
                <div style={{ fontSize: 10, color: '#8A9097', lineHeight: 1.2, whiteSpace: 'nowrap' }}>다운로드</div>
                <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.25, whiteSpace: 'nowrap' }}>App Store</div>
              </div>
            </Hover>
            <Hover as="a" href={storeUrls.googlePlay} style={heroStoreBtn} hoverStyle={heroStoreHover}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#111417" aria-hidden="true">
                <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.25-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.59.69.59 1.19s-.22.9-.57 1.18l-2.29 1.32-2.5-2.5 2.5-2.5 2.27 1.31zM6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z" />
              </svg>
              <div>
                <div style={{ fontSize: 10, color: '#8A9097', lineHeight: 1.2, whiteSpace: 'nowrap' }}>다운로드</div>
                <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.25, whiteSpace: 'nowrap' }}>Google Play</div>
              </div>
            </Hover>
          </div>
          <div data-hero="3" style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#646B73' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#087E7A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }} aria-hidden="true">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            브랜드 협찬 없음 · 공공데이터 기반
          </div>
        </div>
        <div style={{ flex: '0 0 286px', display: 'flex', justifyContent: 'center', minWidth: 0 }}>
          <HeroPhone
            scanOp={scanOp}
            resultOp={resultOp}
            scanCaption={scanCaption}
            scanAnim={scanAnim}
            ringOffset={ringOffset}
            ringColor={ringColor}
            heroScoreText={heroScoreText}
            heroTier={heroTier}
            altOp={altOp}
            altY={altY}
          />
        </div>
      </section>

      {/* 신뢰 바 (카운트업) */}
      <section data-screen-label="신뢰 바" style={{ borderTop: '1px solid #E8EAED', borderBottom: '1px solid #E8EAED', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '44px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 28 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 38, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>
              {trust[0].toLocaleString('ko-KR')}
              <span style={{ color: '#087E7A', opacity: trustDone ? 1 : 0, transition: 'opacity 500ms ease' }}>+</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>등록 상품</div>
            <div style={{ fontSize: 13, color: '#8A9097', marginTop: 2 }}>HACCP · 푸드QR 공공데이터 기반</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 38, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>
              {trust[1]}
              <span style={{ fontSize: 26 }}>종</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>법정 알레르기</div>
            <div style={{ fontSize: 13, color: '#8A9097', marginTop: 2 }}>표준명칭 기준으로만 표시</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 38, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>
              {trust[2]}
              <span style={{ fontSize: 26 }}>가지</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>페르소나</div>
            <div style={{ fontSize: 13, color: '#8A9097', marginTop: 2 }}>체중감량·혈당관리 등 내 상황에 맞는 점수 기준</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section data-screen-label="How it works" style={{ maxWidth: 1080, margin: '0 auto', padding: '110px 24px 100px 24px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#087E7A' }}>사용 방법</div>
        <h2 style={{ margin: '10px 0 0 0', fontSize: 32, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 }}>스캔부터 대체상품까지, 세 단계</h2>
        <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
          <div data-reveal={0} style={{ background: '#F7F8F9', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#087E7A', fontVariantNumeric: 'tabular-nums' }}>01</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>바코드를 스캔합니다</div>
            <div style={{ fontSize: 15, color: '#646B73', lineHeight: 1.6, marginTop: 6 }}>카메라로 바코드를 비추면 상품을 바로 인식합니다.</div>
            <div style={{ marginTop: 18, background: '#FFFFFF', border: '1px solid #E8EAED', borderRadius: 12, height: 150, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CornerBrackets size={12} inset={12} />
              <svg width="110" height="30" viewBox="0 0 120 34" aria-hidden="true">
                <g fill="#111417">
                  {[[0, 3], [6, 2], [12, 5], [20, 2], [26, 3], [33, 6], [42, 2], [48, 4], [55, 2], [60, 5], [68, 3], [74, 2], [79, 6], [88, 2], [93, 4], [100, 2], [105, 3], [111, 5]].map(([x, w], i) => (
                    <rect key={i} x={x} y="0" width={w} height="34" />
                  ))}
                </g>
              </svg>
              <div style={{ position: 'absolute', left: 14, right: 14, top: 20, height: 2.5, borderRadius: 2, background: '#0BC2BC', boxShadow: '0 0 10px rgba(11,194,188,0.5)', animation: 'lbCardScan 1000ms cubic-bezier(0.4,0,0.2,1) infinite alternate' }} />
              <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
                <span style={{ background: '#111417', color: '#FFFFFF', fontSize: 10, fontWeight: 500, padding: '4px 10px', borderRadius: 9999, whiteSpace: 'nowrap' }}>바코드 인식 중</span>
              </div>
            </div>
          </div>
          <div data-reveal={60} style={{ background: '#F7F8F9', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#087E7A', fontVariantNumeric: 'tabular-nums' }}>02</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>내 페르소나 기준 점수를 확인합니다</div>
            <div style={{ fontSize: 15, color: '#646B73', lineHeight: 1.6, marginTop: 6 }}>선택한 페르소나에 따라 같은 제품도 점수가 다릅니다.</div>
            <div style={{ marginTop: 18, background: '#FFFFFF', border: '1px solid #E8EAED', borderRadius: 12, height: 150, padding: 14, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ position: 'relative', width: 84, height: 84, flex: 'none' }}>
                <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden="true">
                  <circle cx="42" cy="42" r="35" fill="none" stroke="#EEF1F2" strokeWidth="8" />
                  <circle cx="42" cy="42" r="35" fill="none" stroke="#2E9E5B" strokeWidth="8" strokeLinecap="round" strokeDasharray="219.9" strokeDashoffset="52.8" transform="rotate(-90 42 42)" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: '#0F6E56' }}>76</div>
              </div>
              <div style={{ minWidth: 0 }}>
                <span style={{ background: '#0BC2BC', color: '#FFFFFF', fontSize: 10, fontWeight: 500, padding: '4px 10px', borderRadius: 9999, whiteSpace: 'nowrap' }}>근육증가</span>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 8 }}>무가당 그릭요거트</div>
                <div style={{ fontSize: 11, color: '#646B73', marginTop: 3 }}>단백질 함량이 우수해요</div>
              </div>
            </div>
          </div>
          <div data-reveal={120} style={{ background: '#F7F8F9', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#087E7A', fontVariantNumeric: 'tabular-nums' }}>03</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 8 }}>더 나은 대체상품까지</div>
            <div style={{ fontSize: 15, color: '#646B73', lineHeight: 1.6, marginTop: 6 }}>같은 카테고리에서 내 페르소나에 더 맞는 상품을 함께 보여드립니다.</div>
            <div style={{ marginTop: 18, background: '#FFFFFF', border: '1px solid #E8EAED', borderRadius: 12, height: 150, padding: 14, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 600, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#646B73' }}>무가당 그릭요거트</div>
                <span style={{ background: '#E8F6EE', color: '#0F6E56', fontSize: 12, fontWeight: 800, fontVariantNumeric: 'tabular-nums', padding: '3px 9px', borderRadius: 9999, flex: 'none' }}>76</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A9097" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 5v14" />
                  <path d="M19 12l-7 7-7-7" />
                </svg>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(11,194,188,0.08)', borderRadius: 10, padding: '8px 10px' }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>유기농 무가당 그릭요거트</div>
                  <div style={{ fontSize: 10, color: '#087E7A', marginTop: 1, whiteSpace: 'nowrap' }}>당류가 더 낮아요</div>
                </div>
                <span style={{ background: '#E8F6EE', color: '#0F6E56', fontSize: 12, fontWeight: 800, fontVariantNumeric: 'tabular-nums', padding: '3px 9px', borderRadius: 9999, flex: 'none' }}>87</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 페르소나 데모 (데스크톱: 스티키 스크롤 / 모바일: 칩) */}
      {!isMobile && (
        <section data-screen-label="페르소나 데모" ref={demoElRef} style={{ position: 'relative', height: '380vh', background: '#F7F8F9' }}>
          <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden', boxSizing: 'border-box', paddingTop: 56 }}>
            <div style={{ maxWidth: 1080, margin: '0 auto', width: '100%', padding: '0 24px', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', alignItems: 'stretch', gap: 'clamp(32px,5vw,64px)' }}>
                <div style={{ flex: '1 1 auto', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '6px 0' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#087E7A' }}>페르소나 점수</div>
                    <h2 style={{ margin: '12px 0 0 0', fontSize: 'clamp(28px,3vw,36px)', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 }}>같은 제품, 페르소나에 따라 다른 점수</h2>
                  </div>
                  <div>
                    {DEMO.map((p, i) => (
                      <div key={p.name} onClick={() => rollTo(i)} style={{ position: 'relative', padding: '15px 0', cursor: 'pointer' }}>
                        <div style={{ position: 'absolute', left: -16, top: '50%', width: 7, height: 7, marginTop: -3.5, borderRadius: 9999, background: '#0BC2BC', opacity: i === step ? 1 : 0, transition: 'opacity 300ms ease' }} />
                        <div style={{ fontSize: 'clamp(22px,2.4vw,28px)', fontWeight: 700, letterSpacing: '-0.01em', color: i === step ? '#111417' : '#C4C9CF', transition: 'color 300ms ease', whiteSpace: 'nowrap' }}>{p.name}</div>
                      </div>
                    ))}
                    <div style={{ fontSize: 13, color: '#8A9097', marginTop: 18 }}>저염식단 · 저탄고지 · 시니어 페르소나도 있습니다.</div>
                    <div style={{ marginTop: 22, width: 132, height: 3, borderRadius: 2, background: '#E8EAED', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 2, background: '#0BC2BC', width: progW, transition: 'width 300ms ease' }} />
                    </div>
                  </div>
                  <div style={{ opacity: askActive ? 1 : 0, transform: `translateY(${askActive ? 0 : 10}px)`, transition: 'opacity 400ms ease, transform 400ms cubic-bezier(0.16,1,0.3,1)' }}>
                    <div style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.4 }}>당신에게 맞는 페르소나는 무엇인가요?</div>
                    <Hover as="div" onClick={scrollToDownload} style={{ display: 'inline-block', marginTop: 14, background: '#111417', color: '#FFFFFF', fontSize: 14, fontWeight: 600, padding: '11px 20px', borderRadius: 9999, cursor: 'pointer', transition: 'background 150ms ease', whiteSpace: 'nowrap' }} hoverStyle={{ background: '#2A2F35' }}>
                      앱에서 페르소나 고르기
                    </Hover>
                  </div>
                </div>
                <div style={{ flex: 'none', borderRadius: 45, background: '#111417', padding: 11, boxShadow: '0 24px 64px rgba(17,20,23,0.14)' }}>
                  <div style={{ aspectRatio: '440/956', height: 'min(652px,72vh)', borderRadius: 34, background: '#FFFFFF', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <PhoneStatusBar />
                    <div style={{ flex: 'none', padding: '0 18px 12px 18px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 16, fontWeight: 700 }}>히스토리</span>
                      <span style={{ flex: 1 }} />
                      <span style={{ background: '#0BC2BC', color: '#FFFFFF', fontSize: 11, fontWeight: 500, padding: '5px 11px', borderRadius: 9999, whiteSpace: 'nowrap', flex: 'none' }}>{d.name}</span>
                    </div>
                    <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '0 18px', boxSizing: 'border-box' }}>
                      <div style={{ background: 'rgba(11,194,188,0.08)', borderRadius: 12, padding: '11px 13px', fontSize: 11, color: '#087E7A', lineHeight: 1.5 }}>페르소나를 바꾸면 지난 스캔 점수도 함께 다시 계산돼요</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                        <span style={{ background: '#111417', color: '#FFFFFF', fontSize: 10, fontWeight: 500, padding: '5px 11px', borderRadius: 9999, whiteSpace: 'nowrap' }}>최근순</span>
                        <span style={{ background: '#F0F2F3', color: '#646B73', fontSize: 10, fontWeight: 500, padding: '5px 11px', borderRadius: 9999, whiteSpace: 'nowrap' }}>점수 낮은 순</span>
                      </div>
                      <DemoHistoryRows rows={demoRows} variant="desktop" />
                      <div style={{ fontSize: 11, color: '#B4BAC0', textAlign: 'center', padding: '18px 0' }}>스캔한 상품이 여기에 쌓여요</div>
                    </div>
                    <PhoneBottomNav variant="desktop" />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 28, fontSize: 12, color: '#8A9097', lineHeight: 1.6 }}>위 화면은 이해를 돕기 위한 예시입니다. 실제 점수는 앱에서 최신 데이터 기준으로 표시됩니다. 표시된 제품명은 각 제조사의 상표이며, 라벨리는 각 제조사와 무관합니다.</div>
            </div>
          </div>
        </section>
      )}

      {isMobile && (
        <section data-screen-label="페르소나 데모 모바일" style={{ background: '#F7F8F9', padding: '72px 0' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#087E7A' }}>페르소나 점수</div>
            <h2 style={{ margin: '10px 0 0 0', fontSize: 27, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 }}>같은 제품, 페르소나에 따라 다른 점수</h2>
          </div>
          <div data-hide-scrollbar="true" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '20px 24px 4px 24px', WebkitOverflowScrolling: 'touch' }}>
            {DEMO.map((p, i) => (
              <div key={p.name} onClick={() => rollTo(i)} style={{ flex: 'none', padding: '9px 16px', borderRadius: 9999, background: i === step ? '#0BC2BC' : '#EFEFEF', color: i === step ? '#FFFFFF' : '#111417', fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 200ms ease, color 200ms ease' }}>
                {p.name}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 24px 0 24px' }}>
            <div style={{ width: '100%', maxWidth: 360, background: '#FFFFFF', border: '1px solid #E8EAED', borderRadius: 20, padding: 18, boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>히스토리</span>
                <span style={{ flex: 1 }} />
                <span style={{ background: '#0BC2BC', color: '#FFFFFF', fontSize: 11, fontWeight: 500, padding: '5px 11px', borderRadius: 9999, whiteSpace: 'nowrap', flex: 'none' }}>{d.name}</span>
              </div>
              <DemoHistoryRows rows={demoRows} variant="mobile" />
              <div style={{ marginTop: 12, fontSize: 11, color: '#8A9097', textAlign: 'center' }}>칩을 눌러 페르소나를 바꿔보세요</div>
            </div>
          </div>
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 24px 0 24px', fontSize: 12, color: '#8A9097', lineHeight: 1.6 }}>위 화면은 이해를 돕기 위한 예시입니다. 실제 점수는 앱에서 최신 데이터 기준으로 표시됩니다. 표시된 제품명은 각 제조사의 상표이며, 라벨리는 각 제조사와 무관합니다.</div>
        </section>
      )}

      {/* 원칙 */}
      {PRINCIPLES_DARK ? (
        <section data-screen-label="원칙" style={{ background: '#111417', color: '#FFFFFF' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '110px 24px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0BC2BC' }}>라벨리의 원칙</div>
            <h2 style={{ margin: '10px 0 0 0', fontSize: 32, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3, color: '#FFFFFF' }}>점수는 내부 알고리즘으로 정확하게 계산합니다</h2>
            <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
              <PrincipleCard dark icon="code" title="같은 입력, 같은 점수" desc="점수는 정해진 기준의 코드로만 계산합니다. 그때그때 달라지는 AI 판단이 아닙니다." />
              <PrincipleCard dark icon="lock" title="브랜드 개입 불가" desc="광고 수익과 점수 계산은 분리되어 있습니다. 광고나 협찬이 점수를 바꿀 수 없는 구조입니다." />
              <PrincipleCard dark icon="db" title="신뢰 높은 데이터" desc="한국식품안전관리인증원(HACCP)·식품의약품안전처(푸드QR) 공공데이터를 기반으로 합니다." />
            </div>
            <Link to="/about" style={{ display: 'inline-block', marginTop: 32, fontSize: 15, fontWeight: 600, color: '#A5ABB3' }}>점수 계산 방식 자세히 보기 →</Link>
          </div>
        </section>
      ) : (
        <section data-screen-label="원칙 라이트" style={{ background: '#F7F8F9' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto', padding: '110px 24px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#087E7A' }}>라벨리의 원칙</div>
            <h2 style={{ margin: '10px 0 0 0', fontSize: 32, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 }}>점수는 내부 알고리즘으로 정확하게 계산합니다</h2>
            <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
              <PrincipleCard icon="code" title="같은 입력, 같은 점수" desc="점수는 정해진 기준의 코드로만 계산합니다. 그때그때 달라지는 AI 판단이 아닙니다." />
              <PrincipleCard icon="lock" title="브랜드 개입 불가" desc="광고 수익과 점수 계산은 분리되어 있습니다. 광고나 협찬이 점수를 바꿀 수 없는 구조입니다." />
              <PrincipleCard icon="db" title="신뢰 높은 데이터" desc="한국식품안전관리인증원(HACCP)·식품의약품안전처(푸드QR) 공공데이터를 기반으로 합니다." />
            </div>
            <Link to="/about" style={{ display: 'inline-block', marginTop: 32, fontSize: 15, fontWeight: 600, color: '#646B73' }}>점수 계산 방식 자세히 보기 →</Link>
          </div>
        </section>
      )}

      {/* 기능 하이라이트 */}
      <section data-screen-label="기능 하이라이트" style={{ maxWidth: 1080, margin: '0 auto', padding: '120px 24px 40px 24px', display: 'flex', flexDirection: 'column', gap: 96 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}>
          <div data-reveal={0} data-reveal-x="-12" style={{ flex: '0 1 calc(50% - 24px)', minWidth: 300 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#087E7A' }}>알레르기</div>
            <h3 style={{ margin: '10px 0 0 0', fontSize: 26, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.35 }}>확실하지 않으면, 표시하지 않습니다</h3>
            <p style={{ margin: '14px 0 0 0', fontSize: 16, color: '#646B73', lineHeight: 1.7, maxWidth: 440 }}>
              법정 알레르기 21종을 표준명칭 기준으로 확인합니다. 확실하지 않은 정보는 추측해서 표시하지 않습니다.
              <br />
              다만 알레르기처럼 안전이 걸린 정보는 반드시 실제 포장의 표시사항을 함께 확인하세요.
            </p>
          </div>
          <div data-reveal={60} data-reveal-x="12" style={{ flex: '0 1 calc(50% - 24px)', minWidth: 300 }}>
            <div style={{ width: '100%', background: '#F7F8F9', borderRadius: 20, padding: 28, boxSizing: 'border-box' }}>
              <div style={{ background: '#FFFFFF', border: '1px solid #E8EAED', borderRadius: 16, padding: 16 }}>
                <div style={{ background: '#FBEAEA', border: '1px solid #f3c6c6', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 9999, background: '#B3121C', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                      <line x1="12" y1="6.5" x2="12" y2="13.5" />
                      <circle cx="12" cy="17.5" r="0.5" fill="#FFFFFF" />
                    </svg>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#B3121C' }}>난류, 대두 포함 — 등록한 알레르기 성분이에요</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                  <span style={{ background: '#FBEAEA', color: '#B3121C', fontSize: 11, fontWeight: 600, padding: '5px 11px', borderRadius: 9999 }}>난류</span>
                  <span style={{ background: '#FBEAEA', color: '#B3121C', fontSize: 11, fontWeight: 600, padding: '5px 11px', borderRadius: 9999 }}>대두</span>
                  <span style={{ background: '#EFEFEF', color: '#5e5e5e', fontSize: 11, fontWeight: 500, padding: '5px 11px', borderRadius: 9999 }}>우유</span>
                  <span style={{ background: '#EFEFEF', color: '#5e5e5e', fontSize: 11, fontWeight: 500, padding: '5px 11px', borderRadius: 9999 }}>밀</span>
                  <span style={{ background: '#EFEFEF', color: '#5e5e5e', fontSize: 11, fontWeight: 500, padding: '5px 11px', borderRadius: 9999 }}>새우</span>
                  <span style={{ background: '#EFEFEF', color: '#5e5e5e', fontSize: 11, fontWeight: 500, padding: '5px 11px', borderRadius: 9999, whiteSpace: 'nowrap' }}>+ 16종</span>
                </div>
                <div style={{ fontSize: 11, color: '#8A9097', marginTop: 12 }}>법정 알레르기 21종 · 표준명칭 기준</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48, flexDirection: 'row-reverse' }}>
          <div data-reveal={0} data-reveal-x="12" style={{ flex: '0 1 calc(50% - 24px)', minWidth: 300 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#087E7A' }}>대체상품</div>
            <h3 style={{ margin: '10px 0 0 0', fontSize: 26, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.35 }}>점수만 보여주고 끝나지 않습니다</h3>
            <p style={{ margin: '14px 0 0 0', fontSize: 16, color: '#646B73', lineHeight: 1.7, maxWidth: 440 }}>
              같은 카테고리에서 내 페르소나에 더 맞는 상품을 함께 보여드립니다.
              <br />
              낮은 점수를 확인하는 데서 멈추지 않고, 다음 선택까지 이어집니다.
            </p>
          </div>
          <div data-reveal={60} data-reveal-x="-12" style={{ flex: '0 1 calc(50% - 24px)', minWidth: 300 }}>
            <div style={{ width: '100%', background: '#F7F8F9', borderRadius: 20, padding: 28, boxSizing: 'border-box' }}>
              <div style={{ background: '#FFFFFF', border: '1px solid #E8EAED', borderRadius: 16, padding: 16 }}>
                <span style={{ display: 'inline-block', background: '#0BC2BC', color: '#FFFFFF', fontSize: 11, fontWeight: 500, padding: '5px 11px', borderRadius: 9999, whiteSpace: 'nowrap' }}>저염식단</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>농심 신라면</div>
                    <div style={{ fontSize: 11, color: '#8A9097', marginTop: 1 }}>나트륨 함량이 높은 편이에요</div>
                  </div>
                  <span style={{ background: '#FBEAEA', color: '#B3121C', fontSize: 13, fontWeight: 800, fontVariantNumeric: 'tabular-nums', padding: '5px 11px', borderRadius: 9999, flex: 'none' }}>0점</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A9097" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 5v14" />
                    <path d="M19 12l-7 7-7-7" />
                  </svg>
                </div>
                <div style={{ background: 'rgba(11,194,188,0.08)', borderRadius: 12, padding: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#087E7A' }}>더 나은 대체상품</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>농심 사리면</div>
                      <div style={{ fontSize: 11, color: '#087E7A', marginTop: 1 }}>나트륨이 더 낮아요</div>
                    </div>
                    <span style={{ background: '#FBF3DD', color: '#8a6100', fontSize: 13, fontWeight: 800, fontVariantNumeric: 'tabular-nums', padding: '5px 11px', borderRadius: 9999, flex: 'none' }}>50점</span>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: '#8A9097', marginTop: 12 }}>같은 카테고리(라면) 안에서 추천해요</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}>
          <div data-reveal={0} data-reveal-x="-12" style={{ flex: '0 1 calc(50% - 24px)', minWidth: 300 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#087E7A' }}>셀프 등록</div>
            <h3 style={{ margin: '10px 0 0 0', fontSize: 26, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.35 }}>사진 2장, 3초면 등록 요청 완료</h3>
            <p style={{ margin: '14px 0 0 0', fontSize: 16, color: '#646B73', lineHeight: 1.7, maxWidth: 440 }}>
              사진 2장이면 됩니다. 3초면 제보가 끝나고, 검토를 거쳐 데이터베이스에 반영됩니다.
              <br />
              라벨리의 상품 데이터는 사용자와 함께 자랍니다.
            </p>
          </div>
          <div data-reveal={60} data-reveal-x="12" style={{ flex: '0 1 calc(50% - 24px)', minWidth: 300 }}>
            <div style={{ width: '100%', background: '#F7F8F9', borderRadius: 20, padding: 28, boxSizing: 'border-box' }}>
              <div style={{ background: '#FFFFFF', border: '1px solid #E8EAED', borderRadius: 16, padding: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>상품을 찾지 못했어요</div>
                <div style={{ fontSize: 12, color: '#646B73', marginTop: 3 }}>사진 2장만 올리면 제보가 끝나요</div>
                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  <div style={{ flex: 1, aspectRatio: '3/4', border: '1.5px dashed #D5DADF', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8A9097" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
                      <circle cx="12" cy="13" r="3.4" />
                    </svg>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#646B73' }}>앞면</span>
                  </div>
                  <div style={{ flex: 1, aspectRatio: '3/4', border: '1.5px dashed #D5DADF', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8A9097" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="5" y="3" width="14" height="18" rx="2" />
                      <path d="M8.5 8h7" />
                      <path d="M8.5 12h7" />
                      <path d="M8.5 16h4" />
                    </svg>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#646B73' }}>뒷면</span>
                  </div>
                </div>
                <div style={{ marginTop: 14, background: '#0BC2BC', borderRadius: 9999, padding: 12, textAlign: 'center', color: '#FFFFFF', fontSize: 13, fontWeight: 500 }}>사진으로 제보하기</div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                  <span style={{ background: '#EFEFEF', color: '#5e5e5e', fontSize: 10, fontWeight: 500, padding: '4px 10px', borderRadius: 9999, whiteSpace: 'nowrap' }}>검토 후 반영돼요</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ 프리뷰 */}
      <section data-screen-label="FAQ 프리뷰" style={{ maxWidth: 760, margin: '0 auto', padding: '110px 24px' }}>
        <h2 style={{ margin: 0, fontSize: 32, fontWeight: 700, letterSpacing: '-0.01em', textAlign: 'center' }}>자주 묻는 질문</h2>
        <div style={{ marginTop: 28, borderTop: '1px solid #E8EAED' }}>
          {HOME_FAQS.map((f, i) => (
            <div key={f.q} style={{ borderBottom: '1px solid #E8EAED' }}>
              <Hover as="div" onClick={() => setOpenFaq(openFaq === i ? -1 : i)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 8px', cursor: 'pointer' }} hoverStyle={{ background: '#FAFBFB' }}>
                <div style={{ flex: 1, fontSize: 17, fontWeight: 600 }}>{f.q}</div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A9097" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 250ms ease' }} aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </Hover>
              <div style={{ overflow: 'hidden', maxHeight: openFaq === i ? 260 : 0, transition: 'max-height 320ms cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ padding: '0 8px 20px 8px', fontSize: 15, color: '#646B73', lineHeight: 1.75 }}>{f.a}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link to="/support" style={{ fontSize: 15, fontWeight: 600, color: '#646B73' }}>더 많은 질문 보기 →</Link>
        </div>
      </section>

      {/* 최종 CTA */}
      <section id="download" data-screen-label="최종 CTA" style={{ background: '#EFFBFA' }}>
        <div data-reveal={0} style={{ maxWidth: 1080, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 'clamp(30px,4.4vw,46px)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
            다음 장보기부터,
            <br />
            스캔하고 고르세요.
          </h2>
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12 }}>
            <Hover as="a" href={storeUrls.appStore} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', border: '1px solid #DCE5E4', borderRadius: 12, background: '#FFFFFF', transition: 'background 150ms ease' }} hoverStyle={{ background: '#F5FBFA', color: '#111417' }}>
              <svg width="21" height="21" viewBox="0 0 384 512" fill="#111417" aria-hidden="true">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.7-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
              </svg>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 10, color: '#8A9097', lineHeight: 1.2, whiteSpace: 'nowrap' }}>다운로드</div>
                <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.25, whiteSpace: 'nowrap' }}>App Store</div>
              </div>
            </Hover>
            <Hover as="a" href={storeUrls.googlePlay} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', border: '1px solid #DCE5E4', borderRadius: 12, background: '#FFFFFF', transition: 'background 150ms ease' }} hoverStyle={{ background: '#F5FBFA', color: '#111417' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#111417" aria-hidden="true">
                <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.25-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.59.69.59 1.19s-.22.9-.57 1.18l-2.29 1.32-2.5-2.5 2.5-2.5 2.27 1.31zM6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z" />
              </svg>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 10, color: '#8A9097', lineHeight: 1.2, whiteSpace: 'nowrap' }}>다운로드</div>
                <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.25, whiteSpace: 'nowrap' }}>Google Play</div>
              </div>
            </Hover>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ---------- 홈 전용 프레젠테이션 컴포넌트 ---------- */

function PrincipleCard({ dark, icon, title, desc }: { dark?: boolean; icon: 'code' | 'lock' | 'db'; title: string; desc: string }) {
  const cardStyle = dark
    ? { background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, padding: '28px 24px' }
    : { background: '#FFFFFF', border: '1px solid #E8EAED', borderRadius: 16, padding: '28px 24px' };
  const iconStroke = dark ? '#0BC2BC' : '#087E7A';
  const descColor = dark ? '#A5ABB3' : '#646B73';
  return (
    <div style={cardStyle}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={iconStroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {icon === 'code' && (
          <>
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </>
        )}
        {icon === 'lock' && (
          <>
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </>
        )}
        {icon === 'db' && (
          <>
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
          </>
        )}
      </svg>
      <div style={{ fontSize: 19, fontWeight: 700, marginTop: 14 }}>{title}</div>
      <div style={{ fontSize: 15, color: descColor, lineHeight: 1.65, marginTop: 8 }}>{desc}</div>
    </div>
  );
}

function CornerBrackets({ size, inset }: { size: number; inset: number }) {
  const base = { position: 'absolute' as const, width: size, height: size };
  const b = '2px solid rgba(17,20,23,0.28)';
  return (
    <>
      <div style={{ ...base, top: inset, left: inset, borderLeft: b, borderTop: b }} />
      <div style={{ ...base, top: inset, right: inset, borderRight: b, borderTop: b }} />
      <div style={{ ...base, bottom: inset, left: inset, borderLeft: b, borderBottom: b }} />
      <div style={{ ...base, bottom: inset, right: inset, borderRight: b, borderBottom: b }} />
    </>
  );
}

function PhoneStatusBar() {
  return (
    <div style={{ flex: 'none', height: 44, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px' }}>
      <span style={{ fontSize: 11, fontWeight: 600 }}>9:41</span>
      <div style={{ position: 'absolute', left: '50%', top: 11, transform: 'translateX(-50%)', width: 75, height: 22, borderRadius: 9999, background: '#111417' }} />
      <svg width="15" height="8" viewBox="0 0 22 11" aria-hidden="true">
        <rect x="0.5" y="0.5" width="18" height="10" rx="3" fill="none" stroke="#111417" strokeOpacity="0.4" />
        <rect x="2" y="2" width="12" height="7" rx="1.6" fill="#111417" />
        <path d="M20 4v3a2 2 0 0 0 0-3z" fill="#111417" fillOpacity="0.4" />
      </svg>
    </div>
  );
}

function PhoneBottomNav({ variant }: { variant: 'hero' | 'desktop' }) {
  const icon = variant === 'hero' ? 18 : 16;
  const scanW = variant === 'hero' ? 30 : 28;
  const scanH = variant === 'hero' ? 20 : 18;
  const scanIcon = variant === 'hero' ? 13 : 12;
  return (
    <div style={{ flex: 'none', height: 56, borderTop: '1px solid #EEF1F2', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: variant === 'hero' ? 9 : 10 }}>
      {variant === 'hero' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" stroke="#111417" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 10.5L12 4l8 6.5V20H4z" /></svg>
          <span style={{ fontSize: 9, fontWeight: 600 }}>홈</span>
        </div>
      ) : (
        <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" stroke="#B4BAC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 10.5L12 4l8 6.5V20H4z" /></svg>
      )}
      {variant === 'hero' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" stroke="#B4BAC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></svg>
          <span style={{ fontSize: 9, color: '#B4BAC0' }}>검색</span>
        </div>
      ) : (
        <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" stroke="#B4BAC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></svg>
      )}
      {variant === 'hero' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{ width: scanW, height: scanH, borderRadius: 9999, background: '#0BC2BC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={scanIcon} height={scanIcon} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8V5h3" /><path d="M20 8V5h-3" /><path d="M4 16v3h3" /><path d="M20 16v3h-3" /><path d="M4 12h16" /></svg>
          </div>
          <span style={{ fontSize: 9, color: '#B4BAC0' }}>스캔</span>
        </div>
      ) : (
        <div style={{ width: scanW, height: scanH, borderRadius: 9999, background: '#0BC2BC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={scanIcon} height={scanIcon} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8V5h3" /><path d="M20 8V5h-3" /><path d="M4 16v3h3" /><path d="M20 16v3h-3" /><path d="M4 12h16" /></svg>
        </div>
      )}
      {variant === 'hero' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" stroke="#B4BAC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 4h12v16l-6-4-6 4z" /></svg>
          <span style={{ fontSize: 9, color: '#B4BAC0' }}>즐겨찾기</span>
        </div>
      ) : (
        <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" stroke="#111417" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 4h12v16l-6-4-6 4z" /></svg>
      )}
      {variant === 'hero' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" stroke="#B4BAC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" /></svg>
          <span style={{ fontSize: 9, color: '#B4BAC0' }}>마이</span>
        </div>
      ) : (
        <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" stroke="#B4BAC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" /></svg>
      )}
    </div>
  );
}

function DemoHistoryRows({ rows, variant }: { rows: DemoRow[]; variant: 'desktop' | 'mobile' }) {
  const v =
    variant === 'desktop'
      ? { gap: 11, pad: '13px 0', avatar: 52, avatarR: 11, name: 14, metaMt: 2, commentMt: 3, ellipsis: true, pillPad: '6px 12px', score: 18, jeom: 11, groupPad: '14px 0 6px 0' }
      : { gap: 10, pad: '10px 0', avatar: 44, avatarR: 10, name: 13, metaMt: 1, commentMt: 2, ellipsis: false, pillPad: '6px 11px', score: 17, jeom: 10, groupPad: '10px 0 4px 0' };
  return (
    <>
      {rows.map((p, i) => (
        <div key={i}>
          {p.showGroup && <div style={{ fontSize: 11, fontWeight: 600, color: '#8A9097', padding: v.groupPad }}>{p.group}</div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: v.gap, padding: v.pad, borderBottom: '1px solid #F2F4F5' }}>
            <div style={{ width: v.avatar, height: v.avatar, borderRadius: v.avatarR, background: '#F0F2F3', flex: 'none' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: v.name, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
              <div style={{ fontSize: 11, color: '#8A9097', marginTop: v.metaMt, whiteSpace: 'nowrap' }}>{p.meta}</div>
              <div style={{ fontSize: 11, color: '#646B73', marginTop: v.commentMt, ...(v.ellipsis ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {}) }}>{p.comment}</div>
            </div>
            <div style={{ flex: 'none', display: 'flex', alignItems: 'baseline', gap: 1, background: p.bg, color: p.fg, padding: v.pillPad, borderRadius: 9999, transition: 'background 300ms ease, color 300ms ease' }}>
              <span style={{ fontSize: v.score, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{p.score}</span>
              <span style={{ fontSize: v.jeom, fontWeight: 500 }}>점</span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

interface HeroPhoneProps {
  scanOp: number;
  resultOp: number;
  scanCaption: string;
  scanAnim: string;
  ringOffset: string;
  ringColor: string;
  heroScoreText: string;
  heroTier: string;
  altOp: number;
  altY: number;
}

function HeroPhone(p: HeroPhoneProps) {
  return (
    <div style={{ width: 286, flex: 'none', borderRadius: 44, background: '#111417', padding: 11, boxShadow: '0 24px 64px rgba(17,20,23,0.16)' }}>
      <div style={{ width: 264, height: 574, borderRadius: 33, background: '#FFFFFF', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 'none', height: 44, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px' }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '-0.01em' }}>9:41</span>
          <div style={{ position: 'absolute', left: '50%', top: 11, transform: 'translateX(-50%)', width: 75, height: 22, borderRadius: 9999, background: '#111417' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="15" height="10" viewBox="0 0 18 12" fill="#111417" aria-hidden="true">
              <rect x="0" y="8" width="3" height="4" rx="1" />
              <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
              <rect x="10" y="3" width="3" height="9" rx="1" />
              <rect x="15" y="0.5" width="3" height="11.5" rx="1" opacity="0.3" />
            </svg>
            <svg width="17" height="9" viewBox="0 0 22 11" aria-hidden="true">
              <rect x="0.5" y="0.5" width="18" height="10" rx="3" fill="none" stroke="#111417" strokeOpacity="0.4" />
              <rect x="2" y="2" width="12" height="7" rx="1.6" fill="#111417" />
              <path d="M20 4v3a2 2 0 0 0 0-3z" fill="#111417" fillOpacity="0.4" />
            </svg>
          </div>
        </div>

        <div style={{ flex: 'none', padding: '2px 16px 10px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="18" height="18" viewBox="0 0 48 48" style={{ flex: 'none' }} aria-hidden="true">
            <defs>
              <mask id="lb-ph" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
                <rect width="48" height="48" rx="11.5" fill="#fff" />
                <path d="M14 14H34V24H14V34H34" fill="none" stroke="#000" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </mask>
            </defs>
            <rect width="48" height="48" rx="11.5" fill="#1A1A1A" mask="url(#lb-ph)" />
            <path d="M14 24H34" fill="none" stroke="#0BC2BC" strokeWidth="5" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 700 }}>라벨리</span>
          <span style={{ flex: 1 }} />
          <span style={{ background: '#0BC2BC', color: '#FFFFFF', fontSize: 11, fontWeight: 500, padding: '5px 11px', borderRadius: 9999, whiteSpace: 'nowrap', flex: 'none' }}>종합건강관리</span>
        </div>

        <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
          {/* 스캔 오버레이 */}
          <div style={{ position: 'absolute', inset: 0, padding: '0 16px', boxSizing: 'border-box', opacity: p.scanOp, transition: 'opacity 260ms ease' }}>
            <div style={{ height: 300, borderRadius: 16, background: '#F4F6F7', position: 'relative', overflow: 'hidden' }}>
              <CornerBrackets size={18} inset={14} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                <div style={{ width: 118, height: 118, borderRadius: 14, background: '#E4E8EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#B4BAC0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="16" rx="2.5" />
                    <circle cx="8.5" cy="9.5" r="1.8" />
                    <path d="M3 16l4.5-4 4 3.5L15 12l6 5" />
                  </svg>
                </div>
                <div style={{ fontSize: 12, color: '#8A9097' }}>{p.scanCaption}</div>
              </div>
              <div style={{ position: 'absolute', top: 14, left: 16, right: 16, height: 3, borderRadius: 2, background: '#0BC2BC', boxShadow: '0 0 14px rgba(11,194,188,0.65)', opacity: 0, animation: p.scanAnim }} />
            </div>
          </div>

          {/* 결과 오버레이 */}
          <div style={{ position: 'absolute', inset: 0, padding: '0 16px', boxSizing: 'border-box', overflow: 'hidden', opacity: p.resultOp, transition: 'opacity 300ms ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 60, height: 60, borderRadius: 12, background: '#F0F2F3', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B4BAC0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="2.5" />
                  <circle cx="8.5" cy="9.5" r="1.8" />
                  <path d="M3 16l4.5-4 4 3.5L15 12l6 5" />
                </svg>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>농심 신라면</div>
                <div style={{ fontSize: 11, color: '#8A9097', marginTop: 3, whiteSpace: 'nowrap' }}>농심 · 120g</div>
              </div>
            </div>

            <div style={{ marginTop: 12, border: '1px solid #E8EAED', borderRadius: 14, padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ position: 'relative', width: 76, height: 76, flex: 'none' }}>
                <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden="true">
                  <circle cx="38" cy="38" r="32" fill="none" stroke="#EEF1F2" strokeWidth="7" />
                  <circle cx="38" cy="38" r="32" fill="none" stroke={p.ringColor} strokeWidth="7" strokeLinecap="round" strokeDasharray="201" strokeDashoffset="201" transform="rotate(-90 38 38)" style={{ strokeDashoffset: p.ringOffset, transition: 'stroke-dashoffset 800ms cubic-bezier(0.16,1,0.3,1), stroke 300ms ease' }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 23, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: p.ringColor, transition: 'color 300ms ease' }}>{p.heroScoreText}</div>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 11, color: '#8A9097', whiteSpace: 'nowrap' }}>종합건강관리 기준</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: p.ringColor, marginTop: 3, transition: 'color 300ms ease' }}>{p.heroTier}</div>
                <div style={{ fontSize: 11, color: '#646B73', marginTop: 5 }}>라면 중 상위 53%</div>
              </div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B8860B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', marginTop: 1 }} aria-hidden="true">
                  <path d="M12 8v5" />
                  <circle cx="12" cy="16.5" r="0.6" fill="#B8860B" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
                <span style={{ fontSize: 12, color: '#111417' }}>나트륨 함량이 높은 편이에요</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2E9E5B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', marginTop: 1 }} aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span style={{ fontSize: 12, color: '#111417' }}>단백질이 어느 정도 들어있어요</span>
              </div>
            </div>

            <div style={{ marginTop: 11, marginBottom: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 9, color: '#B4BAC0' }}>100g당</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ flex: 1, background: '#F7F8F9', borderRadius: 10, padding: '9px 6px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#8A9097' }}>나트륨</div>
                <div style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>1,360mg</div>
              </div>
              <div style={{ flex: 1, background: '#F7F8F9', borderRadius: 10, padding: '9px 6px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#8A9097' }}>당류</div>
                <div style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>5g</div>
              </div>
              <div style={{ flex: 1, background: '#F7F8F9', borderRadius: 10, padding: '9px 6px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#8A9097' }}>단백질</div>
                <div style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>8g</div>
              </div>
            </div>

            <div style={{ marginTop: 12, background: 'rgba(11,194,188,0.08)', borderRadius: 14, padding: '12px 14px', opacity: p.altOp, transform: `translateY(${p.altY}px)`, transition: 'opacity 400ms cubic-bezier(0.16,1,0.3,1), transform 400ms cubic-bezier(0.16,1,0.3,1)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#087E7A' }}>더 나은 대체상품</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 7 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(11,194,188,0.14)', flex: 'none' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>농심 사리면</div>
                  <div style={{ fontSize: 11, color: '#087E7A', marginTop: 2, whiteSpace: 'nowrap' }}>나트륨이 더 낮아요</div>
                </div>
                <span style={{ background: '#FBF3DD', color: '#8a6100', fontSize: 12, fontWeight: 800, fontVariantNumeric: 'tabular-nums', padding: '4px 10px', borderRadius: 9999, flex: 'none' }}>57점</span>
              </div>
            </div>
          </div>
        </div>

        <PhoneBottomNav variant="hero" />
      </div>
    </div>
  );
}
