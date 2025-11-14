// 이미지 모달 기능
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeBtn = document.querySelector('.modal-close');
const mainPhoto = document.getElementById('mainPhoto');
const thumbnailItems = document.querySelectorAll('.thumbnail-item');

// 썸네일 클릭 시 메인 이미지 변경
thumbnailItems.forEach(item => {
    item.addEventListener('click', function() {
        const photoUrl = this.getAttribute('data-photo');
        const photoAlt = this.querySelector('img').alt;
        
        // 메인 이미지 변경
        mainPhoto.src = photoUrl;
        mainPhoto.alt = photoAlt;
        
        // 활성 썸네일 변경
        thumbnailItems.forEach(thumb => thumb.classList.remove('active'));
        this.classList.add('active');
        
        // 선택한 썸네일로 스크롤 (가능한 경우)
        this.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
});

// 메인 이미지 클릭 시 모달로 크게 보기
if (mainPhoto) {
    mainPhoto.addEventListener('click', function() {
        modal.style.display = 'block';
        modalImg.src = this.src;
        modalImg.alt = this.alt;
        document.body.style.overflow = 'hidden';
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

// Lazy loading 최적화
const images = document.querySelectorAll('img[loading="lazy"]');
if ('loading' in HTMLImageElement.prototype) {
    // 네이티브 lazy loading 지원
    images.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
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
                }
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px' // 미리 로드할 여유 공간
    });
    
    images.forEach(img => imageObserver.observe(img));
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
    // 모바일에서 카카오톡 앱 열기 시도
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    
    if (isMobile) {
        // 모바일에서는 직접 카카오톡 앱 열기
        window.location.href = url;
        
        // 카카오톡 앱이 없을 경우를 대비해 타임아웃 설정
        setTimeout(function() {
            // 앱이 열리지 않으면 카카오톡 다운로드 페이지로 이동
            if (confirm('카카오톡 앱이 설치되어 있지 않습니다. 다운로드 페이지로 이동하시겠습니까?')) {
                window.open('https://www.kakaocorp.com/service/KakaoTalk', '_blank');
            }
        }, 500);
    } else {
        // 데스크톱에서는 카카오톡 PC 버전 또는 웹 버전 안내
        alert('모바일에서 카카오톡 앱을 통해 연락해주세요.');
    }
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
    const musicUrl = musicSource ? musicSource.src : '';
    
    // 음악 URL이 없으면 플레이어 숨기기
    if (!musicUrl || musicUrl.trim() === '') {
        if (musicPlayer) {
            musicPlayer.style.display = 'none';
        }
        console.log('음악 파일 URL이 설정되지 않았습니다. index.html에서 외부 스토리지 링크를 설정해주세요.');
        return;
    }
    
    // 플레이어 표시
    if (musicPlayer) {
        musicPlayer.style.display = 'flex';
    }
    
    // 음악 파일이 있는지 확인
    backgroundMusic.addEventListener('canplaythrough', function() {
        musicFileLoaded = true;
        // 음악 파일이 로드되면 즉시 재생 시도
        tryAutoPlay();
    }, { once: true });
    
    backgroundMusic.addEventListener('loadeddata', function() {
        musicFileLoaded = true;
        // 데이터가 로드되면 재생 시도 (더 빠른 시도)
        tryAutoPlay();
    }, { once: true });
    
    backgroundMusic.addEventListener('error', function(e) {
        // 음악 파일 로드 실패 - 플레이어는 표시하되 에러 표시
        console.error('음악 파일 로드 실패:', e);
        console.error('음악 파일 경로:', backgroundMusic.src);
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

// 공유하기 기능
function shareKakao() {
    const url = window.location.href;
    const title = '양진보 & 한정화 결혼합니다';
    const description = '2026년 1월 4일 일요일 오후 12시 10분';
    
    // 카카오톡 공유 (Kakao SDK 필요하지만, 간단한 방법으로 대체)
    if (window.Kakao) {
        window.Kakao.Share.sendDefault({
            objectType: 'feed',
            content: {
                title: title,
                description: description,
                imageUrl: window.location.origin + '/og-image.jpg', // OG 이미지 URL
                link: {
                    mobileWebUrl: url,
                    webUrl: url,
                },
            },
        });
    } else {
        // 카카오톡 링크 공유 (간단한 방법)
        const shareUrl = `https://story.kakao.com/share?url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank');
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

