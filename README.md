# 모바일 청첩장

## 사용 방법

1. `index.html` 파일을 브라우저에서 열기
2. 사진을 추가하려면:
   - `index.html` 파일에서 `<img src="...">` 부분의 URL을 실제 사진 경로로 변경
   - 또는 `images` 폴더를 만들고 사진을 넣은 후 경로 수정
3. 청첩장 정보 수정:
   - 신랑/신부 이름
   - 결혼식 날짜
   - 장소 및 주소
   - 부모님 이름

## 파일 구조

```
청첩장/
├── index.html      # 메인 HTML 파일
├── style.css       # 스타일시트
├── script.js       # JavaScript 기능
└── README.md       # 이 파일
```

## 사진 추가 방법

1. 프로젝트 폴더에 `images` 폴더 생성
2. 사진 7장을 `images` 폴더에 넣기 (예: `photo1.jpg`, `photo2.jpg`, ...)
3. `index.html`에서 이미지 경로 수정:
   ```html
   <img src="images/photo1.jpg" alt="사진 1" loading="lazy">
   ```

## 커스터마이징

- 색상 변경: `style.css`의 `:root` 변수 수정
- 폰트 변경: `style.css`의 `font-family` 수정
- 레이아웃 조정: `style.css`의 각 섹션 스타일 수정

