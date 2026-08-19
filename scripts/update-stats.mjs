// 라벨리 통계 갱신 스크립트 (GitHub Actions에서 실행).
// Supabase REST(PostgREST)로 COUNT만 조회(HEAD + Prefer: count=exact)해서
// public/stats.json 을 작성합니다. DB에 쓰지 않습니다(조회 전용).
//
// 인증: publishable key 기준(권한 최소화). 시크릿은 성태님이 직접 등록합니다:
//   - SUPABASE_URL              예) https://sthzmueifkgfxcixylry.supabase.co
//   - SUPABASE_PUBLISHABLE_KEY  예) sb_publishable_...
// 시크릿이 없으면 실패시키지 않고 안내 후 정상 종료(exit 0) — 사이트는 site-config.ts
// 기본값으로 정상 동작합니다.

import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'stats.json');

function setOutput(line) {
  if (process.env.GITHUB_OUTPUT) writeFileSync(process.env.GITHUB_OUTPUT, line + '\n', { flag: 'a' });
}

if (!url || !key) {
  console.log(
    '::warning::SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY 시크릿이 설정되지 않아 통계 갱신을 건너뜁니다. ' +
      '사이트는 site-config.ts 기본값으로 정상 동작합니다. (성태님이 시크릿 등록 후 재실행하세요)',
  );
  setOutput('changed=false');
  process.exit(0);
}

// PostgREST count=exact: Content-Range 헤더의 "/뒤" 값이 전체 개수.
async function countRows(query) {
  const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/${query}`, {
    method: 'HEAD',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: 'count=exact',
      Range: '0-0',
    },
  });
  if (res.status !== 200 && res.status !== 206) {
    throw new Error(`요청 실패 ${res.status} (${query})`);
  }
  const cr = res.headers.get('content-range'); // "0-0/5849" 또는 "*/5849"
  const total = cr && cr.includes('/') ? parseInt(cr.split('/')[1], 10) : NaN;
  if (!Number.isFinite(total)) throw new Error(`count 파싱 실패: content-range="${cr}" (${query})`);
  return total;
}

try {
  // 상품 수: visible_to_users IS TRUE
  const productCount = await countRows('products?select=id&visible_to_users=is.true');
  // 페르소나 수: is_filter_type = false (비건 등 필터형 제외 — 안 걸면 8로 잘못 표기됨)
  const personaCount = await countRows('personas?select=id&is_filter_type=is.false');

  let changed = true;
  if (existsSync(OUT)) {
    try {
      const prev = JSON.parse(readFileSync(OUT, 'utf8'));
      if (prev.productCount === productCount && prev.personaCount === personaCount) changed = false;
    } catch {
      /* 파싱 실패 시 새로 쓴다 */
    }
  }

  if (!changed) {
    console.log(`통계 변화 없음 (products=${productCount}, personas=${personaCount}). 파일 갱신 안 함.`);
    setOutput('changed=false');
    process.exit(0);
  }

  const next = { productCount, personaCount, updatedAt: new Date().toISOString() };
  writeFileSync(OUT, JSON.stringify(next, null, 2) + '\n', 'utf8');
  console.log(`통계 갱신 완료: products=${productCount}, personas=${personaCount}`);
  setOutput('changed=true');
  process.exit(0);
} catch (e) {
  // 시크릿은 있는데 조회에 실패한 경우는 문제를 인지할 수 있게 실패시킨다(사이트는 기존 값 유지).
  console.error('통계 조회 실패:', e.message);
  process.exit(1);
}
