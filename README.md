# 포트폴리오 웹사이트

업무(개발 프로젝트)를 한곳에서 보여주는 **다크 모던 1페이지 포트폴리오**입니다.
빌드 도구·의존성 없이 동작하는 순수 정적 사이트(HTML/CSS/JS)라 어디서든 바로 열고 배포할 수 있습니다.

## 구성 섹션

| 섹션 | 내용 |
| --- | --- |
| Hero | 이름·직함·태그라인, CTA, 헤드라인 통계, 히어로 캔버스 애니메이션(떠다니는 도형 + 고스트 커서) |
| 업무 총괄 현황 | 대시보드형 통계 카드 4개 + 역량 태그 — "업무 총괄" 센터피스 |
| 소개 | 자기소개 + 강점 요약 |
| 기술 스택 | 프론트엔드 / 백엔드·실시간 / AI·에이전트 / 데이터·자동화 / 도구·인프라 |
| 프로젝트 | ① 실시간 협업 화이트보드 ② 공공기관 보안 영업 코파일럿 에이전트 (상세 카드) |
| 개발 여정 | 두 프로젝트의 Phase 단위 진행을 세로 타임라인으로 — 점진적 설계·커밋 방법론 |
| 연락처 | 이메일(복사 버튼)·GitHub |

## 파일 구조

```
portfolio/
├─ index.html            # 마크업 (모든 섹션)
├─ styles.css            # 다크 모던 디자인 시스템 (CSS 변수 토큰)
├─ script.js             # 바닐라 JS (의존성 0)
├─ 404.html              # 다크 톤 404 페이지
├─ robots.txt            # 크롤러 허용 + Sitemap 지시
├─ sitemap.xml           # 사이트맵
├─ og-image.png          # 소셜 공유 카드(1200×630, 메타에서 참조)
├─ og-image.svg          # 공유 카드 SVG 소스
├─ apple-touch-icon.png  # iOS 홈 화면 아이콘(180×180)
└─ README.md
```

`script.js` 기능: 상단 스크롤 진행바, 모바일 햄버거 내비, 스크롤 시 헤더 음영,
스크롤스파이(현재 섹션 강조 + `aria-current`), 스크롤 등장 애니메이션, 숫자 카운트업,
부드러운 앵커 스크롤, 맨 위로 버튼, 이메일 복사, 히어로 캔버스.
`prefers-reduced-motion`을 존중하며, 캔버스는 화면 밖·탭 숨김 시 자동 정지합니다.

## 로컬에서 보기

가장 간단하게는 `index.html`을 브라우저로 열면 됩니다.
폰트 CDN·상대경로까지 정확히 확인하려면 정적 서버로 띄우는 것을 권장합니다.

```powershell
# Python 3
python -m http.server 4567 --directory .
# → http://localhost:4567

# 또는 Node
npx serve .
```

## 편집 포인트 (개인 정보 채우기)

개인 정보는 편집하기 쉬운 **플레이스홀더**로 남겨 두었습니다. `index.html`에서 검색해 교체하세요.
(편집 위치마다 `<!-- TODO: 여기 수정 -->` 주석을 달아 두었습니다.)

| 플레이스홀더 | 위치 | 비고 |
| --- | --- | --- |
| `[이름]` | `<title>`, 헤더 로고, Hero, 소개, footer, JSON-LD | 실제 이름으로 |
| `[직함]` | Hero 서브타이틀, JSON-LD `jobTitle` | 예: "백엔드 개발자" |
| `[your.email@example.com]` | 연락처 이메일 (`mailto:`) | 교체 후 해당 링크의 `aria-disabled="true"`·`tabindex="-1"` 제거 |

- **GitHub 링크는 `https://github.com/yeodh10`로 이미 설정**되어 있습니다. 프로젝트 카드의 "GitHub에서 보기"는 현재 프로필을 가리키니, 개별 저장소 주소가 있으면 교체하세요.
- **배포 도메인이 정해지면** 가정 도메인 `https://yeodh10.github.io/` 를 실제 도메인으로 일괄 교체하세요. 영향 받는 곳: `index.html`의 `canonical`·`og:url`·`og:image`·`twitter:image`, `robots.txt`의 `Sitemap`, `sitemap.xml`의 `<loc>`. (특히 `og:image`는 상대경로가 안 되므로 절대 URL이 정확해야 공유 미리보기가 깨지지 않습니다.)
- **OG 이미지에도 `[이름]`이 그려져** 있습니다. 실명 반영 시 `_oggen.py`를 열어 텍스트를 바꾸고 다시 실행하면 `og-image.png`가 재생성됩니다(로컬 전용 빌드 스크립트, 저장소에는 포함되지 않음 — Pillow 필요).

## 배포

정적 파일만 올리면 됩니다. 대표적인 무료 방법:

- **GitHub Pages** — 이 저장소를 GitHub에 푸시한 뒤 Settings → Pages에서 브랜치(`main`)·루트(`/`)를 지정
- **Netlify / Vercel** — 폴더를 드래그&드롭하거나 저장소를 연결
- 일반 웹 호스팅 — 폴더 전체를 그대로 업로드

## 기술

순수 HTML5 · CSS3(변수·Grid·Flex·clamp) · 바닐라 JavaScript.
웹폰트는 [Pretendard](https://github.com/orioncactus/pretendard) 가변폰트(dynamic-subset, CDN)를 사용합니다.
SEO·공유를 위해 Open Graph / Twitter Card 메타, JSON-LD(schema.org Person) 구조화 데이터,
`robots.txt`·`sitemap.xml`, OG 이미지(1200×630)를 포함합니다.
