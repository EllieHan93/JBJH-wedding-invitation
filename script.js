// 이미지 모달 기능
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeBtn = document.querySelector('.modal-close');
const mainPhoto = document.getElementById('mainPhoto');
const thumbnailItems = document.querySelectorAll('.thumbnail-item');

// 사진 목록 배열 생성
const photoList = Array.from(thumbnailItems).map(item => ({
    url: item.getAttribute('data-photo'),
    alt: item.querySelector('img').alt,
    element: item
}));

// 현재 사진 인덱스
let currentPhotoIndex = 0;

// 사진 변경 함수
function changePhoto(index) {
    if (index < 0 || index >= photoList.length) return;
    
    currentPhotoIndex = index;
    const photo = photoList[index];
    
    // 메인 이미지 변경
    mainPhoto.src = photo.url;
    mainPhoto.alt = photo.alt;
    
    // 활성 썸네일 변경
    thumbnailItems.forEach(thumb => thumb.classList.remove('active'));
    photo.element.classList.add('active');
    
    // 선택한 썸네일로 스크롤 (가능한 경우)
    photo.element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

// 다음 사진
function nextPhoto() {
    const nextIndex = (currentPhotoIndex + 1) % photoList.length;
    changePhoto(nextIndex);
}

// 이전 사진
function prevPhoto() {
    const prevIndex = (currentPhotoIndex - 1 + photoList.length) % photoList.length;
    changePhoto(prevIndex);
}

// 썸네일 클릭 시 메인 이미지 변경
thumbnailItems.forEach((item, index) => {
    item.addEventListener('click', function() {
        changePhoto(index);
    });
});

// 스와이프 제스처 처리
let touchStartX = 0;
let touchEndX = 0;
let isDragging = false;
let clickStartTime = 0;
let clickStartX = 0;
let clickStartY = 0;

// 터치 이벤트
if (mainPhoto) {
    mainPhoto.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        clickStartTime = Date.now();
        clickStartX = e.touches[0].clientX;
        clickStartY = e.touches[0].clientY;
        isDragging = false;
    }, { passive: true });
    
    mainPhoto.addEventListener('touchmove', function(e) {
        isDragging = true;
    }, { passive: true });
    
    mainPhoto.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        
        touchEndX = e.changedTouches[0].clientX;
        const swipeDistance = touchStartX - touchEndX;
        const minSwipeDistance = 50; // 최소 스와이프 거리
        
        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                // 왼쪽으로 스와이프 (다음 사진)
                nextPhoto();
            } else {
                // 오른쪽으로 스와이프 (이전 사진)
                prevPhoto();
            }
        }
    }, { passive: true });
    
    // 마우스 드래그 이벤트 (데스크톱)
    let mouseStartX = 0;
    let mouseIsDown = false;
    
    mainPhoto.addEventListener('mousedown', function(e) {
        mouseStartX = e.clientX;
        mouseIsDown = true;
    });
    
    mainPhoto.addEventListener('mousemove', function(e) {
        if (!mouseIsDown) return;
        isDragging = true;
    });
    
    mainPhoto.addEventListener('mouseup', function(e) {
        if (!mouseIsDown || !isDragging) {
            mouseIsDown = false;
            isDragging = false;
            return;
        }
        
        const mouseEndX = e.clientX;
        const dragDistance = mouseStartX - mouseEndX;
        const minDragDistance = 50;
        
        if (Math.abs(dragDistance) > minDragDistance) {
            if (dragDistance > 0) {
                // 왼쪽으로 드래그 (다음 사진)
                nextPhoto();
            } else {
                // 오른쪽으로 드래그 (이전 사진)
                prevPhoto();
            }
        }
        
        mouseIsDown = false;
        isDragging = false;
    });
    
    mainPhoto.addEventListener('mouseleave', function() {
        mouseIsDown = false;
        isDragging = false;
    });
}

// 메인 이미지 클릭 시 모달로 크게 보기 (드래그가 아닐 때만)
if (mainPhoto) {
    mainPhoto.addEventListener('mousedown', function(e) {
        clickStartTime = Date.now();
        clickStartX = e.clientX;
        clickStartY = e.clientY;
    });
    
    mainPhoto.addEventListener('click', function(e) {
        // 드래그가 아니고, 짧은 클릭일 때만 모달 열기
        const clickDuration = Date.now() - clickStartTime;
        const clickDistance = Math.abs(e.clientX - clickStartX) + Math.abs(e.clientY - clickStartY);
        
        if (clickDuration < 300 && clickDistance < 10 && !isDragging) {
            modal.style.display = 'block';
            modalImg.src = this.src;
            modalImg.alt = this.alt;
            document.body.style.overflow = 'hidden';
        }
    });
    
    // 터치 클릭 처리
    mainPhoto.addEventListener('touchend', function(e) {
        const touchDuration = Date.now() - clickStartTime;
        const touch = e.changedTouches[0];
        const touchDistance = Math.abs(touch.clientX - clickStartX) + Math.abs(touch.clientY - clickStartY);
        
        // 스와이프가 아니고, 짧은 터치일 때만 모달 열기
        if (touchDuration < 300 && touchDistance < 10 && !isDragging) {
            e.preventDefault();
            modal.style.display = 'block';
            modalImg.src = this.src;
            modalImg.alt = this.alt;
            document.body.style.overflow = 'hidden';
        }
    });
}

// 모달 닫기
closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// 모달 배경 클릭 시 닫기
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// 스크롤 애니메이션 (성능 최적화)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

let animationFrameId = null;
const observer = new IntersectionObserver(function(entries) {
    // requestAnimationFrame으로 성능 최적화
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    animationFrameId = requestAnimationFrame(() => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // 한 번만 실행
            }
        });
    });
}, observerOptions);

// 애니메이션 적용할 요소들 (지연 로딩)
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.greeting, .gallery, .wedding-info, .contact, .closing, .main-photo, .thumbnail-item, .info-item, .contact-item, .parent-group');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// 페이지 로드 후 애니메이션 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
    initScrollAnimations();
}

// 부드러운 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 이미지 로딩 최적화 및 로더
function setupImageLoaders() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        const loader = img.parentElement.querySelector('.image-loader');
        
        // 이미지가 이미 로드된 경우
        if (img.complete && img.naturalHeight !== 0) {
            if (loader) loader.classList.add('hidden');
            return;
        }
        
        // 로더 표시
        if (loader) loader.classList.add('active');
        
        // 이미지 로드 완료 시 로더 숨기기
        img.addEventListener('load', function() {
            if (loader) {
                loader.classList.remove('active');
                setTimeout(() => loader.classList.add('hidden'), 300);
            }
            // 이미지 페이드인 효과
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                img.style.opacity = '1';
            }, 50);
        });
        
        // 이미지 로드 실패 시
        img.addEventListener('error', function() {
            if (loader) {
                loader.classList.remove('active');
                loader.classList.add('hidden');
            }
        });
    });
}

// Lazy loading 최적화 (개선)
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
if (lazyImages.length > 0) {
    if ('loading' in HTMLImageElement.prototype && 'IntersectionObserver' in window) {
        // 네이티브 lazy loading + Intersection Observer로 추가 최적화
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // 이미지가 뷰포트에 가까워지면 미리 로드
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px', // 뷰포트 100px 전에 미리 로드
            threshold: 0.01
        });
        
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
    } else if ('loading' in HTMLImageElement.prototype) {
        // 네이티브 lazy loading만 지원
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
    } else {
        // Lazy loading 폴리필
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px'
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// 페이지 로드 시 이미지 로더 설정
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupImageLoaders);
} else {
    setupImageLoaders();
}

// 카카오맵 초기화 (지도 사용하지 않으므로 제거됨)

// 카카오톡 링크 열기
function openKakaoTalk(url) {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    const isIOS = /iphone|ipad|ipod/i.test(userAgent.toLowerCase());
    const isAndroid = /android/i.test(userAgent.toLowerCase());
    
    // URL에서 phone 또는 id 파라미터 추출
    const phoneMatch = url.match(/phone=([^&]+)/);
    const idMatch = url.match(/[?&]id=([^&]+)/);
    const phoneNumber = phoneMatch ? phoneMatch[1] : null;
    const kakaoId = idMatch ? idMatch[1] : null;
    
    // profile 또는 chat 경로 확인
    const isProfile = url.includes('kakaotalk://profile');
    const isChat = url.includes('kakaotalk://chat');
    
    // 전화번호를 하이픈 제거한 형식으로 정규화
    let normalizedPhone = phoneNumber ? phoneNumber.replace(/[-\s]/g, '') : null;
    
    if (isMobile) {
        if (isAndroid) {
            // Android: 여러 방법 시도
            if (kakaoId) {
                // 카카오톡 ID가 있으면 ID 기반 사용
                if (isProfile) {
                    // 프로필 보기
                    window.location.href = `kakaotalk://profile?id=${kakaoId}`;
                    setTimeout(function() {
                        const intentUrl = `intent://profile?id=${kakaoId}#Intent;scheme=kakaotalk;package=com.kakao.talk;end`;
                        window.location.href = intentUrl;
                    }, 300);
                } else {
                    // 채팅방 열기
                    window.location.href = `kakaotalk://chat?id=${kakaoId}`;
                    setTimeout(function() {
                        const intentUrl = `intent://chat?id=${kakaoId}#Intent;scheme=kakaotalk;package=com.kakao.talk;end`;
                        window.location.href = intentUrl;
                    }, 300);
                }
            } else if (normalizedPhone) {
                // 전화번호 기반 시도 (여러 형식)
                // 방법 1: 일반 딥링크
                window.location.href = `kakaotalk://chat?phone=${normalizedPhone}`;
                
                // 방법 2: Intent 스킴 (fallback)
                setTimeout(function() {
                    const intentUrl = `intent://send?phone=${normalizedPhone}#Intent;scheme=kakaotalk;package=com.kakao.talk;end`;
                    window.location.href = intentUrl;
                }, 300);
            } else {
                window.location.href = url;
            }
        } else {
            // iOS: 직접 딥링크 사용
            if (kakaoId) {
                if (isProfile) {
                    window.location.href = `kakaotalk://profile?id=${kakaoId}`;
                } else {
                    window.location.href = `kakaotalk://chat?id=${kakaoId}`;
                }
            } else if (normalizedPhone) {
                window.location.href = `kakaotalk://chat?phone=${normalizedPhone}`;
            } else {
                window.location.href = url;
            }
        }
        
        // 카카오톡 앱이 열렸는지 확인 (타임아웃 제거 - 조용히 실패)
        // 전화번호 기반 딥링크는 카카오톡에서 공식 지원하지 않을 수 있음
        // 에러 메시지 없이 조용히 시도
    } else {
        // 데스크톱: 카카오톡 PC 버전 시도
        if (kakaoId) {
            if (isProfile) {
                window.location.href = `kakaotalk://profile?id=${kakaoId}`;
            } else {
                window.location.href = `kakaotalk://chat?id=${kakaoId}`;
            }
        } else if (normalizedPhone) {
            window.location.href = `kakaotalk://chat?phone=${normalizedPhone}`;
        } else {
            window.location.href = url;
        }
        
        // PC 버전은 조용히 시도 (에러 메시지 제거)
    }
}

// 전화번호 복사 기능 (전화 앱도 열 수 있도록)
function copyPhoneNumber(phoneNumber, event) {
    // 모바일에서는 전화 앱이 자동으로 열리므로 preventDefault 하지 않음
    // 데스크톱에서만 복사 기능 사용
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());
    
    if (!isMobile) {
        event.preventDefault();
        
        // 클립보드에 복사
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(phoneNumber).then(() => {
                // 복사 성공 알림
                showCopyNotification(phoneNumber + ' 복사되었습니다');
            }).catch(() => {
                // 복사 실패 시 대체 방법
                fallbackCopyPhoneNumber(phoneNumber);
            });
        } else {
            // 클립보드 API를 지원하지 않는 경우 대체 방법
            fallbackCopyPhoneNumber(phoneNumber);
        }
    }
    // 모바일에서는 tel: 링크가 자동으로 전화 앱을 열므로 그대로 진행
}

// 전화번호 복사 대체 방법
function fallbackCopyPhoneNumber(phoneNumber) {
    const textArea = document.createElement('textarea');
    textArea.value = phoneNumber;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyNotification(phoneNumber + ' 복사되었습니다');
    } catch (err) {
        // 복사 실패 시 전화 걸기
        window.location.href = `tel:${phoneNumber.replace(/[-\s]/g, '')}`;
    }
    
    document.body.removeChild(textArea);
}

// 복사 알림 표시
function showCopyNotification(message) {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.copy-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 2초 후 제거
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// 계좌번호 복사 함수
function copyAccountNumber(parentName, accountNumber, event) {
    event.preventDefault();
    
    // 계좌번호가 기본값이면 사용자에게 입력 요청
    if (accountNumber === '계좌번호를 입력해주세요') {
        const input = prompt(`${parentName}의 계좌번호를 입력해주세요:\n(예: 국민은행 123456-78-901234)`, '');
        if (!input || input.trim() === '') {
            return;
        }
        accountNumber = input.trim();
    }
    
    // 클립보드에 복사
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(accountNumber).then(() => {
            showCopyNotification(`${parentName} 계좌번호 복사되었습니다`);
        }).catch(() => {
            fallbackCopyAccountNumber(accountNumber, parentName);
        });
    } else {
        fallbackCopyAccountNumber(accountNumber, parentName);
    }
}

// 계좌번호 복사 대체 방법
function fallbackCopyAccountNumber(accountNumber, parentName) {
    const textArea = document.createElement('textarea');
    textArea.value = accountNumber;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyNotification(`${parentName} 계좌번호 복사되었습니다`);
    } catch (err) {
        showCopyNotification('계좌번호 복사에 실패했습니다');
    }
    document.body.removeChild(textArea);
}

// 음악 플레이어 기능 (지연 로딩)
const backgroundMusic = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const musicPlayer = document.getElementById('musicPlayer');
const musicIcon = musicToggle ? musicToggle.querySelector('.music-icon') : null;
const musicInfo = document.getElementById('musicInfo');

// 음악 파일 존재 여부 확인 및 자동 재생 시도
let musicFileLoaded = false;

function checkMusicFile() {
    if (!backgroundMusic) return;
    
    // 음악 소스 URL 확인
    const musicSource = document.getElementById('musicSource');
    
    // GitHub Pages 음악 파일 URL (동적으로 설정하여 직접 링크 노출 최소화)
    // 파일명을 복잡하게 하여 직접 접근을 어렵게 함
    const musicUrl = 'https://elliehan93.github.io/JBJH-wedding-invitation/music_2026_wedding_bg_audio.mp3';
    
    // 음악 URL이 없으면 플레이어 숨기기
    if (!musicUrl || musicUrl.trim() === '') {
        if (musicPlayer) {
            musicPlayer.style.display = 'none';
        }
        console.log('음악 파일 URL이 설정되지 않았습니다.');
        return;
    }
    
    // 동적으로 음악 소스 설정 (직접 HTML에 노출되지 않음)
    // audio 태그와 source 태그 모두에 설정
    if (musicSource) {
        musicSource.src = musicUrl;
    }
    backgroundMusic.src = musicUrl;
    
    // 플레이어 표시
    if (musicPlayer) {
        musicPlayer.style.display = 'flex';
    }
    
    // 음악 파일이 있는지 확인
    backgroundMusic.addEventListener('canplaythrough', function() {
        musicFileLoaded = true;
        console.log('음악 파일 로드 완료:', musicUrl);
        // 음악 파일이 로드되면 즉시 재생 시도
        tryAutoPlay();
    }, { once: true });
    
    backgroundMusic.addEventListener('loadeddata', function() {
        musicFileLoaded = true;
        console.log('음악 데이터 로드 완료');
        // 데이터가 로드되면 재생 시도 (더 빠른 시도)
        tryAutoPlay();
    }, { once: true });
    
    backgroundMusic.addEventListener('error', function(e) {
        // 음악 파일 로드 실패 - 플레이어는 표시하되 에러 표시
        console.error('음악 파일 로드 실패:', e);
        console.error('음악 파일 경로:', backgroundMusic.src);
        console.error('음악 파일 에러 코드:', backgroundMusic.error);
        musicFileLoaded = false;
        
        // 에러 메시지 표시
        if (musicInfo) {
            musicInfo.innerHTML = '<span class="music-text" style="color: #ff6b6b;">음악 파일을 불러올 수 없습니다</span>';
        }
    }, { once: true });
    
    // 실제로 로드 시도
    backgroundMusic.load();
}

// 페이지 로드 완료 후 음악 파일 확인
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        checkMusicFile();
    });
} else {
    checkMusicFile();
}

// 자동 재생 시도 함수 (여러 방법 시도)
function tryAutoPlay() {
    if (!backgroundMusic || !musicPlayer || musicPlayer.style.display === 'none') return;
    
    // 이미 재생 중이면 중단
    if (!backgroundMusic.paused) return;
    
    backgroundMusic.volume = 0.5;
    
    // 방법 1: 일반 재생 시도
    const playPromise = backgroundMusic.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            if (musicToggle) musicToggle.classList.add('playing');
            if (musicIcon) musicIcon.textContent = '⏸️';
        }).catch(error => {
            // 방법 2: muted 상태로 재생 후 unmute (일부 브라우저에서 작동)
            backgroundMusic.muted = true;
            backgroundMusic.play().then(() => {
                backgroundMusic.muted = false;
                if (musicToggle) musicToggle.classList.add('playing');
                if (musicIcon) musicIcon.textContent = '⏸️';
            }).catch(err => {
                // 자동 재생 실패 - 사용자 인터랙션 필요
                console.log('자동 재생 실패 (사용자 인터랙션 필요)');
            });
        });
    }
}

// 사용자 인터랙션 후 자동 재생 시도 (더 적극적으로)
let userInteracted = false;
let autoPlayAttempted = false;

function handleUserInteraction() {
    if (!userInteracted && backgroundMusic && backgroundMusic.paused && musicPlayer && musicPlayer.style.display !== 'none') {
        userInteracted = true;
        if (!autoPlayAttempted) {
            autoPlayAttempted = true;
            tryAutoPlay();
        }
    }
}

// 다양한 이벤트에 대해 재생 시도
const interactionEvents = ['click', 'touchstart', 'touchend', 'mousedown', 'scroll', 'keydown', 'pointerdown'];
interactionEvents.forEach(event => {
    document.addEventListener(event, handleUserInteraction, { passive: true });
});

// body 클릭도 감지
document.body.addEventListener('click', handleUserInteraction, { once: true, passive: true });

// 음악 재생/일시정지 토글
if (musicToggle && backgroundMusic) {
    musicToggle.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            // 음악 파일이 로드되지 않았으면 다시 로드 시도
            if (!musicFileLoaded && backgroundMusic.readyState === 0) {
                backgroundMusic.load();
            }
            
            const playPromise = backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    musicToggle.classList.add('playing');
                    if (musicIcon) musicIcon.textContent = '⏸️';
                    if (musicInfo) {
                        musicInfo.innerHTML = '<span class="music-text">배경음악</span>';
                    }
                }).catch(error => {
                    console.error('음악 재생 실패:', error);
                    console.error('음악 파일 경로:', backgroundMusic.src);
                    console.error('음악 파일 상태:', {
                        readyState: backgroundMusic.readyState,
                        networkState: backgroundMusic.networkState,
                        error: backgroundMusic.error
                    });
                    
                    // 사용자에게 에러 메시지 표시
                    if (musicInfo) {
                        musicInfo.innerHTML = '<span class="music-text" style="color: #ff6b6b;">재생할 수 없습니다</span>';
                    }
                    
                    // 에러 메시지 토스트 표시
                    showToast('음악을 재생할 수 없습니다. 파일 경로를 확인해주세요.');
                });
            }
        } else {
            backgroundMusic.pause();
            musicToggle.classList.remove('playing');
            if (musicIcon) musicIcon.textContent = '🎵';
        }
    });
    
    // 음악 재생 상태 추적
    backgroundMusic.addEventListener('play', function() {
        musicToggle.classList.add('playing');
        if (musicIcon) musicIcon.textContent = '⏸️';
    });
    
    backgroundMusic.addEventListener('pause', function() {
        musicToggle.classList.remove('playing');
        if (musicIcon) musicIcon.textContent = '🎵';
    });
    
    // 음악 로드 실패 시 플레이어 숨기기
    backgroundMusic.addEventListener('error', function() {
        if (musicPlayer) {
            musicPlayer.style.display = 'none';
        }
    });
}

// 카운트다운 타이머
function updateCountdown() {
    const weddingDate = new Date('2026-01-04T12:10:00');
    const now = new Date();
    const diff = weddingDate - now;
    
    if (diff <= 0) {
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// 카운트다운 초기화 및 업데이트
updateCountdown();
setInterval(updateCountdown, 1000);

// 카카오톡 SDK 초기화
function initKakaoSDK() {
    // 카카오톡 앱 키 설정 (Kakao Developers에서 발급받은 JavaScript 키)
    const KAKAO_APP_KEY = '59c7dfd20241f85002ac497cd3de1e11';
    
    if (typeof Kakao !== 'undefined' && !Kakao.isInitialized()) {
        Kakao.init(KAKAO_APP_KEY);
        console.log('카카오톡 SDK 초기화 완료');
    }
}

// 페이지 로드 시 카카오톡 SDK 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKakaoSDK);
} else {
    initKakaoSDK();
}

// 공유하기 기능 (카카오톡 공식 SDK 사용)
function shareKakao() {
    const url = window.location.href;
    const title = '💕 양진보 & 한정화 결혼합니다 💕';
    const description = '2026년 1월 4일 일요일 오후 12시 10분\n마곡보타닉파크웨딩\n\n저희 두 사람의 새로운 시작에\n소중한 분들이 함께해 주신다면\n그보다 큰 힘과 기쁨은 없을 것 같습니다.\n\n바쁘시더라도 참석해 주시어\n저희의 앞날을 따뜻하게 축복해 주시면\n더없는 기쁨이겠습니다.\n\n💌 청첩장 보러가기';
    const imageUrl = 'https://elliehan93.github.io/JBJH-wedding-invitation/photos/1.jpg';
    
    // 카카오톡 SDK가 초기화되어 있는지 확인
    if (typeof Kakao === 'undefined' || !Kakao.isInitialized()) {
        alert('카카오톡 SDK가 초기화되지 않았습니다. 앱 키를 확인해주세요.');
        console.error('카카오톡 SDK 초기화 필요');
        return;
    }
    
    // 카카오톡 공유 (기본 템플릿 사용)
    // 이미지 URL을 직접 사용 (카카오톡이 자동으로 스크랩)
    Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: title,
            description: description,
            imageUrl: imageUrl,
            imageWidth: 1200,
            imageHeight: 1600,
            link: {
                mobileWebUrl: url,
                webUrl: url,
            },
        },
        buttons: [
            {
                title: '청첩장 보기',
                link: {
                    mobileWebUrl: url,
                    webUrl: url,
                },
            },
        ],
        // 카카오톡 공유 성공 시 콜백 (선택사항)
        success: function(response) {
            console.log('카카오톡 공유 성공:', response);
        },
        fail: function(error) {
            console.error('카카오톡 공유 실패:', error);
            // 실패 시 대체 방법 시도
            fallbackKakaoShare(url, title, description);
        },
    });
}

// 카카오톡 링크 공유 (대체 방법 - SDK 사용 불가 시)
function fallbackKakaoShare(url, title, description) {
    // Web Share API 사용 (모바일에서 카카오톡 앱으로 공유)
    if (navigator.share) {
        navigator.share({
            title: title,
            text: description,
            url: url
        }).then(() => {
            console.log('공유 성공');
        }).catch((error) => {
            console.log('공유 실패:', error);
            // 최종 대체: 카카오톡 링크 공유 페이지
            const shareUrl = `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + ' - ' + description)}`;
            window.open(shareUrl, '_blank', 'width=600,height=700');
        });
    } else {
        // 카카오톡 링크 공유 페이지
        const shareUrl = `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title + ' - ' + description)}`;
        window.open(shareUrl, '_blank', 'width=600,height=700');
    }
}

function shareFacebook() {
    const url = window.location.href;
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

function copyLink() {
    const url = window.location.href;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            showToast('링크가 복사되었습니다!');
        }).catch(() => {
            fallbackCopyTextToClipboard(url);
        });
    } else {
        fallbackCopyTextToClipboard(url);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('링크가 복사되었습니다!');
    } catch (err) {
        showToast('링크 복사에 실패했습니다.');
    }
    
    document.body.removeChild(textArea);
}

function showToast(message) {
    // 간단한 토스트 메시지
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 0.9rem;
        animation: fadeInOut 2s ease-in-out;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// CSS 애니메이션 추가 (토스트용)
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateY(10px); }
        20%, 80% { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// 성능 최적화: 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 스크롤 이벤트 최적화
const optimizedScrollHandler = debounce(() => {
    // 스크롤 관련 작업
}, 100);

// 리사이즈 이벤트 최적화
const optimizedResizeHandler = debounce(() => {
    // 리사이즈 관련 작업
}, 250);

window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
window.addEventListener('resize', optimizedResizeHandler, { passive: true });

// 메모리 최적화: 사용하지 않는 리소스 정리
window.addEventListener('beforeunload', () => {
    // 이벤트 리스너 정리
    window.removeEventListener('scroll', optimizedScrollHandler);
    window.removeEventListener('resize', optimizedResizeHandler);
});

// "We are getting married" 타이핑 애니메이션
function typeWeddingText() {
    const weddingTextElement = document.getElementById('weddingText');
    if (!weddingTextElement) return;
    
    const text = 'We are getting married';
    const chars = text.split('');
    let index = 0;
    
    function typeChar() {
        if (index < chars.length) {
            const char = chars[index];
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char; // 공백 처리
            span.style.animationDelay = (index * 0.08) + 's'; // 각 글자마다 0.08초 간격
            weddingTextElement.appendChild(span);
            index++;
            setTimeout(typeChar, 80); // 80ms마다 다음 글자 (너무 느리지 않게)
        }
    }
    
    // 약간의 딜레이 후 시작
    setTimeout(() => {
        weddingTextElement.style.opacity = '1';
        typeChar();
    }, 300);
}

// 페이지 로드 후 타이핑 애니메이션 시작
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', typeWeddingText);
} else {
    typeWeddingText();
}

