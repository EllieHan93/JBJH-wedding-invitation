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

### 3단계: GitHub Pages 활성화 (상세 가이드)

1. **GitHub 저장소 페이지로 이동**
   - 브라우저에서 GitHub 저장소 페이지 열기
   - 예: `https://github.com/사용자명/wedding-invitation`

2. **Settings 메뉴 클릭**
   - 저장소 상단 메뉴에서 "Settings" 탭 클릭
   - (코드 보기 화면의 맨 위에 있는 탭들 중 하나)

3. **Pages 메뉴 찾기**
   - 왼쪽 사이드바에서 "Pages" 클릭
   - (Settings 메뉴 안에 있음)

4. **Source 설정**
   - "Source" 섹션에서 "Deploy from a branch" 선택
   - (드롭다운 메뉴에서 선택)

5. **Branch 설정**
   - "Branch" 드롭다운에서 `main` 선택
   - "Folder" 드롭다운에서 `/ (root)` 선택
   - (이것은 루트 폴더에서 파일을 가져온다는 의미)

6. **저장**
   - "Save" 버튼 클릭

7. **대기**
   - 몇 분 정도 기다리면 배포 완료
   - 페이지 새로고침하면 초록색 체크 표시와 함께 URL이 나타남

### 4단계: 접속
- **URL 형식**: `https://사용자명.github.io/저장소명/`
- 예: `https://johndoe.github.io/wedding-invitation/`
- 몇 분 후 접속 가능 (처음에는 최대 10분 정도 걸릴 수 있음)

### 5단계: 커스텀 도메인 설정 (선택)

#### GitHub Pages에서 도메인 변경하기

1. **Settings → Pages로 이동**
   - 저장소 Settings → Pages 메뉴

2. **Custom domain 입력**
   - "Custom domain" 섹션에서 원하는 도메인 입력
   - 예: `wedding.example.com` 또는 `example.com`
   - "Save" 클릭

3. **DNS 설정 (도메인 구매한 경우) - 중요!**
   
   **서브도메인 사용 (예: wedding.jinbojeonghwa.com)**
   ```
   타입: CNAME
   이름: wedding
   값: 사용자명.github.io
   TTL: 3600 (또는 기본값)
   ```
   
   ⚠️ 중요: 
   - "이름" 필드에 `wedding`만 입력 (`.jinbojeonghwa.com` 포함하지 않음)
   - "값" 필드에 실제 GitHub 사용자명 입력 (예: `johndoe.github.io`)
   - CNAME 레코드만 추가 (A 레코드와 함께 사용하지 않음)
   
   **루트 도메인 사용 (예: jinbojeonghwa.com)**
   ```
   타입: A
   이름: @ (또는 비워두기)
   값: 
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
   
   또는 (일부 DNS 제공업체만 지원)
   ```
   타입: CNAME
   이름: @
   값: 사용자명.github.io
   ```

4. **DNS 전파 대기**
   - 보통 몇 분~24시간 소요
   - `nslookup 도메인명` 명령어로 확인 가능

5. **HTTPS 자동 활성화**
   - GitHub이 자동으로 SSL 인증서 발급
   - "Enforce HTTPS" 체크박스 활성화 (몇 시간 후 나타남)

#### 도메인 변경/제거하기
- Settings → Pages → Custom domain에서
- 다른 도메인 입력 후 Save (변경)
- 도메인 삭제 후 Save (제거)

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

## 도메인 구매 및 연결

### 무료 도메인 옵션
1. **Freenom** (`.tk`, `.ml`, `.ga`, `.cf` 등)
   - https://www.freenom.com
   - 무료로 도메인 제공 (일부 제한 있음)

2. **GitHub Student Pack** (학생인 경우)
   - Namecheap 등에서 무료 도메인 제공

### 유료 도메인 구매처
- **가비아** (한국): https://www.gabia.com
- **후이즈** (한국): https://whois.co.kr
- **Namecheap** (해외): https://www.namecheap.com
- **GoDaddy** (해외): https://www.godaddy.com
- **Netlify, Vercel**: 플랫폼에서 직접 구매 가능

### 추천 도메인명 예시
- `wedding-진보정화.com`
- `jinbo-jeonghwa.com`
- `wedding-2026.com`
- `진보정화-wedding.com`

### 도메인 가격 (참고)
- `.com`: 연간 약 $10-15 (약 1만원)
- `.kr`: 연간 약 2-3만원
- `.co.kr`: 연간 약 3-5만원

---

## 문제 해결

### ❌ "Domain's DNS record could not be retrieved" 오류

**원인**: DNS 레코드가 제대로 설정되지 않았거나 전파가 안 됨

**해결 방법**:

1. **DNS 레코드 확인**
   ```bash
   # 터미널에서 확인
   nslookup wedding.jinbojeonghwa.com
   # 또는
   dig wedding.jinbojeonghwa.com
   ```
   
2. **DNS 설정 재확인**
   - 도메인 제공업체 관리 페이지 접속
   - DNS 관리 → 레코드 추가/수정
   - **CNAME 레코드 확인**:
     - 타입: `CNAME`
     - 이름: `wedding` (서브도메인만, 도메인명 제외)
     - 값: `사용자명.github.io` (실제 GitHub 사용자명)
     - TTL: `3600` 또는 기본값

3. **일반적인 실수**
   - ❌ 이름에 `.jinbojeonghwa.com` 포함
   - ✅ 이름은 `wedding`만
   - ❌ 값에 `https://` 또는 `http://` 포함
   - ✅ 값은 `사용자명.github.io`만
   - ❌ A 레코드와 CNAME 동시 사용
   - ✅ CNAME만 사용

4. **DNS 전파 대기**
   - 변경 후 최대 24-48시간 소요
   - 보통 몇 시간 내 반영
   - 온라인 DNS 체크 도구 사용: https://dnschecker.org

5. **GitHub에서 재설정**
   - Settings → Pages → Custom domain
   - 도메인 삭제 후 다시 입력
   - Save 클릭

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

