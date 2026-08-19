/*
 * 라벨리 웹 공용 상수 — 홈·소개·고객센터·회원탈퇴 페이지가 모두 이 파일 하나만 읽습니다.
 * (원본: site-config.js + 홈 페이지 DEMO 상수. 단일 소스로 통합)
 */

export interface SiteStats {
  productCount: number;
  allergenCount: number;
  personaCount: number;
  /** 100단위 내림한 표기용 상품 수 */
  displayProductCount: number;
  /** "5,800+" 형태의 표기 라벨 */
  productCountLabel: string;
}

// TODO: 24시간마다 갱신되는 실제 DB 카운트로 교체
const productCount = 5851;
const allergenCount = 21;
const personaCount = 7;

// 상품 수 표기 규칙: 100단위 내림 + 천단위 콤마 + "+"
const displayProductCount = Math.floor(productCount / 100) * 100;
const productCountLabel = displayProductCount.toLocaleString('ko-KR') + '+';

export const stats: SiteStats = {
  productCount,
  allergenCount,
  personaCount,
  displayProductCount,
  productCountLabel,
};

// TODO: 스토어 등록 후 실제 URL로 교체 (이 두 값만 채우면 전 페이지 반영)
export const storeUrls = {
  appStore: '#',
  googlePlay: '#',
} as const;

// 통신판매업 신고번호 (미신고 시 빈 문자열 — 푸터에서 값이 있을 때만 노출)
export const salesRegNo = '';

// 페르소나 점수 데모 (홈 "같은 제품, 페르소나에 따라 다른 점수" 섹션)
// 점수는 실제 프로덕션 DB(persona_scores.final_score, 반올림)에서 가져온 값입니다.
// 데모 제품명(신라면/새우깡/메로나)은 유지하되, 정확 SKU가 DB에 없어 가장 가까운 실제
// 제품의 점수를 사용: 신라면→"신라면 큰사발"(114g), 새우깡→"깐풍새우깡"(80g, 플레인
// 새우깡은 영양정보 null이라 점수 미산출), 메로나→"메로나". (2026-08-20, TASK 2-2)
// scores 배열 순서: [신라면, 새우깡, 메로나]. 코멘트는 실제 영양수치와 대조해 유지.
export interface DemoPersona {
  name: string;
  scores: number[];
  comments: string[];
}

export const DEMO: DemoPersona[] = [
  {
    name: '체중감량',
    scores: [32, 21, 53],
    comments: ['열량과 정제 탄수화물이 많아요', '지방·탄수화물 위주 간식이에요', '당류가 많이 들어있어요'],
  },
  {
    name: '근육증가',
    scores: [69, 62, 49],
    comments: ['단백질은 있지만 나트륨이 높아요', '단백질이 거의 없어요', '단백질 대비 당류가 많아요'],
  },
  {
    name: '혈당관리',
    scores: [40, 30, 52],
    comments: ['정제 탄수화물 비중이 높아요', '탄수화물 위주 구성이에요', '당류 비중이 높은 편이에요'],
  },
  {
    name: '종합건강관리',
    scores: [48, 40, 50],
    comments: ['나트륨 높음 · 단백질 보통이에요', '스낵 평균 수준의 구성이에요', '당류 외 지표는 무난한 편이에요'],
  },
];
