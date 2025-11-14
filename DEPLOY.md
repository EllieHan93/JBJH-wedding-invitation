# 청첩장 서버 배포 가이드

## 방법 1: GitHub Pages (추천 - 무료, 간단)

### 1단계: GitHub 저장소 생성
1. GitHub에 로그인
2. 새 저장소 생성 (예: `wedding-invitation`)
3. 저장소를 Public으로 설정

### 2단계: 파일 업로드
```bash
# 현재 폴더에서 실행
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/사용자명/wedding-invitation.git
git push -u origin main
```

### 3단계: GitHub Pages 활성화
1. 저장소 Settings → Pages
2. Source: `Deploy from a branch` 선택
3. Branch: `main` 선택, `/ (root)` 선택
4. Save 클릭

### 4단계: 접속
- URL: `https://사용자명.github.io/wedding-invitation/`
- 몇 분 후 접속 가능

---

## 방법 2: Netlify (추천 - 무료, 자동 배포)

### 1단계: Netlify 가입
- https://www.netlify.com 접속
- GitHub 계정으로 로그인

### 2단계: 배포
1. "Add new site" → "Deploy manually"
2. 프로젝트 폴더를 드래그 앤 드롭
3. 자동으로 배포 완료

### 3단계: 커스텀 도메인 (선택)
- Site settings → Domain management
- 원하는 도메인 연결 가능

---

## 방법 3: Vercel (무료, 빠름)

### 1단계: Vercel 가입
- https://vercel.com 접속
- GitHub 계정으로 로그인

### 2단계: 배포
1. "Add New Project"
2. GitHub 저장소 선택 또는 폴더 업로드
3. 자동 배포 완료

---

## 방법 4: 일반 웹 호스팅

### 필요한 파일들
- `index.html`
- `style.css`
- `script.js`
- `photos/` 폴더 (모든 사진)
- `약도.jpg`
- `music.mp3` (있는 경우)

### FTP 업로드
1. 호스팅 제공업체에서 FTP 정보 확인
2. FileZilla 등 FTP 클라이언트 사용
3. 모든 파일을 `public_html` 또는 `www` 폴더에 업로드

---

## 배포 전 체크리스트

### ✅ 필수 확인 사항
- [ ] `photos/` 폴더에 모든 사진 파일 확인
  - `hero.jpg`
  - `1.jpg` ~ `6.jpg`
- [ ] `약도.jpg` 파일 확인
- [ ] 카카오톡 링크 아이디 업데이트
  - `신랑카카오톡아이디` → 실제 아이디
  - `신부카카오톡아이디` → 실제 아이디
  - `신랑아버지카카오톡아이디` → 실제 아이디
  - `신랑어머니카카오톡아이디` → 실제 아이디
  - `신부아버지카카오톡아이디` → 실제 아이디
  - `신부어머니카카오톡아이디` → 실제 아이디
- [ ] 음악 파일 (`music.mp3`) 확인 (있는 경우)
- [ ] 카카오맵 API 키 설정 (사용하는 경우)

### 📝 카카오톡 링크 아이디 찾는 방법
1. 카카오톡 앱 실행
2. 프로필 → 설정 → 계정 → 카카오계정
3. 또는 프로필에서 "카카오톡 ID" 확인

---

## 추천 배포 방법

**가장 간단한 방법**: **Netlify**
- 드래그 앤 드롭으로 즉시 배포
- 무료 HTTPS 제공
- 커스텀 도메인 연결 가능
- 자동 배포 설정 가능

**GitHub 사용자라면**: **GitHub Pages**
- 무료
- GitHub 저장소와 연동
- 버전 관리 가능

---

## 도메인 연결 (선택)

### 무료 도메인
- Freenom (`.tk`, `.ml`, `.ga` 등)
- GitHub Pages는 커스텀 도메인 지원

### 유료 도메인
- 가비아, 후이즈 등에서 구매
- Netlify, Vercel에서 직접 구매 가능

---

## 문제 해결

### 이미지가 안 보여요
- 파일 경로 확인 (`photos/` 폴더)
- 파일명 대소문자 확인
- 파일 확장자 확인 (`.jpg`, `.jpeg`, `.png`)

### 카카오톡 링크가 안 열려요
- 카카오톡 ID가 정확한지 확인
- 모바일에서 테스트 (데스크톱에서는 제한적)

### 음악이 안 나와요
- `music.mp3` 파일 경로 확인
- 브라우저 자동재생 정책 확인

