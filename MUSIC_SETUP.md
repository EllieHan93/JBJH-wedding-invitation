# 음악 파일 외부 스토리지 설정 가이드

## 방법 1: Google Drive 사용 (권장)

### 1단계: Google Drive에 음악 파일 업로드
1. [Google Drive](https://drive.google.com)에 로그인
2. `music.mp3` 파일을 업로드

### 2단계: 공유 링크 생성
1. 업로드한 파일을 우클릭 → "공유" 선택
2. "링크가 있는 모든 사용자" 또는 "모든 사용자" 선택
3. "링크 복사" 클릭

### 3단계: 직접 다운로드 링크로 변환
공유 링크가 다음과 같은 형식일 때:
```
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
```

다음 형식으로 변경:
```
https://drive.google.com/uc?export=download&id=FILE_ID
```

**FILE_ID 찾는 방법:**
- 공유 링크에서 `/d/` 뒤와 `/view` 앞의 긴 문자열이 FILE_ID입니다.
- 예: `https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j/view?usp=sharing`
- FILE_ID: `1a2b3c4d5e6f7g8h9i0j`
- 변환된 링크: `https://drive.google.com/uc?export=download&id=1a2b3c4d5e6f7g8h9i0j`

### 4단계: index.html에 링크 적용
`index.html` 파일에서 다음 부분을 찾아서 링크를 변경하세요:

```html
<source src="여기에_변환된_링크_붙여넣기" type="audio/mpeg">
```

---

## 방법 2: Dropbox 사용

### 1단계: Dropbox에 음악 파일 업로드
1. [Dropbox](https://www.dropbox.com)에 로그인
2. `music.mp3` 파일을 업로드

### 2단계: 공유 링크 생성
1. 업로드한 파일을 우클릭 → "공유" → "링크 복사"
2. 링크 형식: `https://www.dropbox.com/s/xxxxx/music.mp3?dl=0`

### 3단계: 직접 다운로드 링크로 변환
링크 끝의 `?dl=0`을 `?dl=1`로 변경:
```
https://www.dropbox.com/s/xxxxx/music.mp3?dl=1
```

### 4단계: index.html에 링크 적용
변환된 링크를 `index.html`에 붙여넣으세요.

---

## 방법 3: GitHub Releases 사용 (고급)

### 1단계: GitHub Releases에 파일 업로드
1. GitHub 저장소 → "Releases" → "Create a new release"
2. 음악 파일을 첨부
3. Release 생성

### 2단계: 다운로드 링크 복사
Release 페이지에서 파일의 다운로드 링크를 복사합니다.

### 3단계: index.html에 링크 적용
링크를 `index.html`에 붙여넣으세요.

---

## 방법 4: 개인 서버/호스팅 사용

자신의 웹 서버가 있다면:
1. 서버에 `music.mp3` 파일 업로드
2. 파일의 전체 URL을 `index.html`에 입력

예: `https://yourdomain.com/music.mp3`

---

## 주의사항

⚠️ **저작권 주의**
- 저작권이 있는 음악을 공개적으로 호스팅하면 문제가 될 수 있습니다.
- 개인적인 용도로만 사용하거나, 저작권 없는 음악을 사용하세요.

✅ **권장사항**
- Google Drive가 가장 간단하고 안정적입니다.
- 링크가 변경되면 `index.html`을 다시 수정해야 합니다.
- 테스트: 브라우저에서 링크를 직접 열어서 음악이 재생되는지 확인하세요.

---

## 테스트 방법

1. `index.html`에 링크를 적용한 후
2. 브라우저에서 직접 링크를 열어서 음악이 재생되는지 확인
3. 청첩장 페이지에서 음악 플레이어가 나타나는지 확인
4. 음악이 자동 재생되는지 확인

