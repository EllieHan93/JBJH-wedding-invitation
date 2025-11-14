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

// 스크롤 애니메이션 (개선)
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // 각 요소에 약간의 딜레이를 주어 순차적으로 나타나게 함
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 50);
            observer.unobserve(entry.target); // 한 번만 실행
        }
    });
}, observerOptions);

// 애니메이션 적용할 요소들
const animateElements = document.querySelectorAll('.greeting, .gallery, .wedding-info, .contact, .closing, .main-photo, .thumbnail-item, .info-item, .contact-item, .parent-group');
animateElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

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

// 카카오맵 초기화
function initMap() {
    // 주소를 여기에 입력하세요 (예: '서울특별시 강남구 테헤란로 152')
    const address = '서울 강서구 마곡중앙5로 6';
    
    // 카카오맵 API가 로드되었는지 확인
    if (typeof kakao === 'undefined' || !kakao.maps) {
        console.log('카카오맵 API를 로드할 수 없습니다. API 키를 확인해주세요.');
        return;
    }
    
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    // 주소로 좌표 검색
    const geocoder = new kakao.maps.services.Geocoder();
    
    geocoder.addressSearch(address, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            
            // 지도 생성
            const map = new kakao.maps.Map(mapContainer, {
                center: coords,
                level: 3 // 지도 확대 레벨 (1-14, 숫자가 작을수록 확대)
            });
            
            // 마커 생성
            const marker = new kakao.maps.Marker({
                position: coords,
                map: map
            });
            
            // 인포윈도우 생성
            const infowindow = new kakao.maps.InfoWindow({
                content: '<div style="width:180px;text-align:center;padding:6px 0;">마곡보타닉파크웨딩</div>'
            });
            infowindow.open(map, marker);
        } else {
            // 주소 검색 실패 시 기본 위치 (서울시청)
            const defaultCoords = new kakao.maps.LatLng(37.5665, 126.9780);
            const map = new kakao.maps.Map(mapContainer, {
                center: defaultCoords,
                level: 3
            });
            console.log('주소를 찾을 수 없습니다. 주소를 확인해주세요.');
        }
    });
}

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

// 음악 플레이어 기능
const backgroundMusic = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = musicToggle ? musicToggle.querySelector('.music-icon') : null;

// 자동 재생 시도 함수
function tryAutoPlay() {
    if (backgroundMusic) {
        backgroundMusic.volume = 0.5; // 볼륨 50%로 설정
        backgroundMusic.play().then(() => {
            if (musicToggle) musicToggle.classList.add('playing');
            if (musicIcon) musicIcon.textContent = '⏸️';
        }).catch(error => {
            // 자동 재생 실패 시 조용히 처리 (브라우저 정책)
            console.log('자동 재생 실패 (사용자 인터랙션 필요):', error);
        });
    }
}

// 페이지 로드 후 자동 재생 시도
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(tryAutoPlay, 500);
    });
} else {
    setTimeout(tryAutoPlay, 500);
}

// 사용자 인터랙션 후 자동 재생 시도 (스크롤, 클릭 등)
let userInteracted = false;
const interactionEvents = ['click', 'touchstart', 'scroll', 'keydown'];
interactionEvents.forEach(event => {
    document.addEventListener(event, function() {
        if (!userInteracted && backgroundMusic && backgroundMusic.paused) {
            userInteracted = true;
            tryAutoPlay();
        }
    }, { once: true });
});

// 음악 재생/일시정지 토글
if (musicToggle && backgroundMusic) {
    musicToggle.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            backgroundMusic.play().then(() => {
                musicToggle.classList.add('playing');
                if (musicIcon) musicIcon.textContent = '⏸️';
            }).catch(error => {
                console.log('음악 재생 실패:', error);
            });
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
        const musicPlayer = document.getElementById('musicPlayer');
        if (musicPlayer) {
            musicPlayer.style.display = 'none';
        }
    });
}

// 페이지 로드 후 지도 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
} else {
    // 카카오맵 API 로드를 기다림
    if (typeof kakao !== 'undefined' && kakao.maps) {
        initMap();
    } else {
        // API 로드를 기다림
        window.addEventListener('load', function() {
            setTimeout(initMap, 500);
        });
    }
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

