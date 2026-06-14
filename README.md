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
| 연락처 | 이메일·GitHub |

## 파일 구조

```
portfolio/
├─ index.html    # 마크업 (모든 섹션)
├─ styles.css    # 다크 모던 디자인 시스템 (CSS 변수 토큰)
├─ script.js     # 바닐라 JS (의존성 0)
└─ README.md
```

`script.js` 기능: 모바일 햄버거 내비, 스크롤 시 헤더 음영, 스크롤스파이(현재 섹션 강조),
스크롤 등장 애니메이션, 숫자 카운트업, 부드러운 앵커 스크롤, 맨 위로 버튼, 히어로 캔버스.
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
| `[이름]` | `<title>`, 헤더 로고, Hero, 소개 | 실제 이름으로 |
| `[직함]` | Hero 서브타이틀 | 예: "백엔드 개발자" |
| `[your.email@example.com]` | 연락처 이메일 (`mailto:`) | 교체 후 해당 링크의 `aria-disabled="true"` 속성을 제거하세요 |
| `og:url` (`https://yeodh10.github.io/`) | `<head>` 메타 | 실제 배포 URL로 |

- GitHub 링크는 `https://github.com/yeodh10`로 이미 설정되어 있습니다.
- 프로젝트 카드의 GitHub 버튼은 프로필을 가리킵니다. 개별 저장소 주소가 있으면 해당 링크로 바꿔 주세요.

## 배포

정적 파일만 올리면 됩니다. 대표적인 무료 방법:

- **GitHub Pages** — 이 저장소를 GitHub에 푸시한 뒤 Settings → Pages에서 브랜치(`main`)·루트(`/`)를 지정
- **Netlify / Vercel** — 폴더를 드래그&드롭하거나 저장소를 연결
- 일반 웹 호스팅 — `index.html`, `styles.css`, `script.js`를 그대로 업로드

## 기술

순수 HTML5 · CSS3(변수·Grid·Flex·clamp) · 바닐라 JavaScript.
웹폰트는 [Pretendard](https://github.com/orioncactus/pretendard)(CDN)를 사용합니다.
