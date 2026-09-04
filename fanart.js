const saberfanart = {
    image: "Saberfanart.png",
    likes: 0,
    artist: "Kingusama"
};

const FANART_LIKES_KEY = "mirai_fanart_likes";

function getFanArtLikes() {
    try {
        return JSON.parse(localStorage.getItem(FANART_LIKES_KEY)) || {};
    } catch {
        return {};
    }
}

function saveFanArtLikes(likes) {
    localStorage.setItem(FANART_LIKES_KEY, JSON.stringify(likes));
}

function getFanArtLikesCount() {
    const likes = getFanArtLikes();
    return likes[saberfanart.image] || 0;
}

function addFanArtLike() {
    const likes = getFanArtLikes();
    likes[saberfanart.image] = (likes[saberfanart.image] || 0) + 1;
    saveFanArtLikes(likes);
    return likes[saberfanart.image];
}

function renderHomeFanArt() {
    const container = document.getElementById("homeFanArtContainer");
    if (!container) return;

    const userLikes = getFanArtLikesCount();
    container.innerHTML = `
        <div class="fanart-sidebar-item" style="cursor: pointer;" id="homeFanArtTrigger">
            <div class="fanart-sidebar-img-wrapper">
                <img src="${saberfanart.image}" alt="Fan Art" class="fanart-sidebar-img" loading="lazy">
                <div class="fanart-sidebar-like-badge">
                    <i class="fas fa-heart"></i> <span id="fanart-sidebar-likes">${userLikes + saberfanart.likes}</span>
                </div>
            </div>
        </div>
    `;

    document.getElementById("homeFanArtTrigger").addEventListener("click", () => {
        openFanArtModal();
    });
}

function renderFanArtModalContent() {
    const container = document.getElementById("fanart-modal-grid");
    if (!container) return;

    const userLikes = getFanArtLikesCount();
    container.innerHTML = `
        <div class="fanart-modal-img-wrapper">
            <img src="${saberfanart.image}" alt="Fan Art" class="fanart-modal-img" loading="lazy" id="fanart-modal-image" style="cursor: zoom-in;">
            <button class="fanart-like-btn" id="fanart-like-btn" aria-label="Like this fan art">
                <i class="fas fa-heart"></i>
                <span class="fanart-like-count" id="fanart-like-count">${userLikes + saberfanart.likes}</span>
            </button>
        </div>
        <div class="fanart-modal-info">
            <div class="fanart-modal-artist-name">${saberfanart.artist}</div>
            <div class="fanart-modal-artist-info">
                He does comission for drawing at his Tiktok live 
                <a class="fanart-modal-tiktok" href="https://www.tiktok.com/@lolisuri69?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer">@lolisuri69</a> 
                with 1,039 follower on tiktok
            </div>
        </div>
    `;

    const modalImage = document.getElementById("fanart-modal-image");
    if (modalImage) {
        modalImage.addEventListener("click", () => {
            openFanArtFullscreen(saberfanart.image);
        });
    }

    const likeBtn = document.getElementById("fanart-like-btn");
    if (likeBtn) {
        likeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const newCount = addFanArtLike();
            const countSpan = document.getElementById("fanart-like-count");
            if (countSpan) {
                countSpan.textContent = newCount + saberfanart.likes;
            }
            likeBtn.classList.add("liked");
            setTimeout(() => likeBtn.classList.remove("liked"), 400);
        });
    }
}

function openFanArtModal() {
    const overlay = document.getElementById("fanart-modal-overlay");
    if (!overlay) return;

    renderFanArtModalContent();
    document.body.style.overflow = "hidden";
    
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            overlay.classList.add("active");
        });
    });
}

function closeFanArtModal() {
    const overlay = document.getElementById("fanart-modal-overlay");
    if (overlay) {
        overlay.classList.remove("active");
        document.body.style.overflow = "";
    }
}

function injectFanArtModalStyles() {
    if (document.getElementById("fanart-modal-styles")) return;

    const style = document.createElement("style");
    style.id = "fanart-modal-styles";
    style.textContent = `
        .fanart-sidebar-section {
            margin-bottom: 18px;
        }
        .fanart-sidebar-item {
            background: #14222b;
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 10px;
            overflow: hidden;
            transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            will-change: transform;
        }
        .fanart-sidebar-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.45);
        }
        .fanart-sidebar-img-wrapper {
            position: relative;
            width: 100%;
            aspect-ratio: 2 / 3;
            max-height: 220px;
            overflow: hidden;
            backface-visibility: hidden;
        }
        .fanart-sidebar-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            backface-visibility: hidden;
        }
        .fanart-sidebar-item:hover .fanart-sidebar-img {
            transform: scale(1.08);
        }
        .fanart-sidebar-like-badge {
            position: absolute;
            top: 6px;
            right: 6px;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(4px);
            color: #fff;
            padding: 3px 7px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 3px;
            border: 1px solid rgba(255,255,255,0.1);
        }
        .fanart-sidebar-like-badge i {
            color: #ef4444;
            font-size: 9px;
        }

        .fanart-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.88);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            z-index: 9999999;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            opacity: 1;
            pointer-events: none;
            visibility: hidden;
            transition: visibility 0s linear 0.5s;
            padding: 0;
            box-sizing: border-box;
        }
        .fanart-modal-overlay.active { pointer-events: auto; visibility: visible; transition-delay: 0s; }
        
        .fanart-modal-card {
            background: #0d151c;
            border: 1px solid #1a2936;
            color: #fff;
            border-radius: 20px 20px 0 0;
            max-width: 860px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 -15px 60px rgba(0,0,0,0.9);
            transform: translateY(100%);
            transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1);
            position: relative;
            display: flex;
            flex-direction: column;
            scrollbar-width: thin;
            scrollbar-color: #1e3040 #0d151c;
            will-change: transform;
            backface-visibility: hidden;
        }
        .fanart-modal-card::-webkit-scrollbar { width: 6px; }
        .fanart-modal-card::-webkit-scrollbar-track { background: #0d151c; }
        .fanart-modal-card::-webkit-scrollbar-thumb { background: #1e3040; border-radius: 4px; }
        .fanart-modal-card::-webkit-scrollbar-thumb:hover { background: #00a0e9; }

        .fanart-modal-overlay.active .fanart-modal-card { transform: translateY(0); }

        .fanart-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 18px 20px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .fanart-modal-title {
            color: #ffffff;
            font-size: 16px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .fanart-modal-title i {
            color: #4ed9ff;
        }
        .fanart-modal-close {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: #a0aec0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 18px;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            will-change: transform;
        }
        .fanart-modal-close:hover {
            background: #e74c3c;
            color: #fff;
            transform: scale(1.1) rotate(90deg);
        }
        .fanart-modal-body {
            padding: 24px;
            display: flex;
            gap: 24px;
            align-items: flex-start;
            flex-wrap: wrap;
        }
        .fanart-modal-img-wrapper {
            position: relative;
            width: 260px;
            flex-shrink: 0;
            aspect-ratio: 2 / 3;
            overflow: hidden;
            border-radius: 12px;
            transition: border-radius 0.3s ease;
            backface-visibility: hidden;
            animation: fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s both;
        }
        .fanart-modal-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease;
            backface-visibility: hidden;
        }
        .fanart-modal-img:hover {
            transform: scale(1.03);
        }
        .fanart-modal-info {
            flex: 1;
            min-width: 220px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            animation: fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s both;
        }
        .fanart-modal-artist-name {
            color: #ffffff;
            font-size: 18px;
            font-weight: 700;
            animation: fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both;
        }
        .fanart-modal-artist-info {
            color: #94a3b8;
            font-size: 13px;
            line-height: 1.5;
            animation: fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.25s both;
        }
        .fanart-modal-tiktok {
            color: #4ed9ff;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease, text-decoration-color 0.3s ease;
        }
        .fanart-modal-tiktok:hover {
            color: #7de5ff;
            text-decoration: underline;
            text-underline-offset: 3px;
        }
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(15px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .fanart-like-btn {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.75);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(255,255,255,0.15);
            color: #fff;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            will-change: transform;
        }
        .fanart-like-btn:hover {
            background: rgba(239, 68, 68, 0.3);
            border-color: rgba(239, 68, 68, 0.5);
            transform: scale(1.08);
        }
        .fanart-like-btn.liked {
            background: rgba(239, 68, 68, 0.4);
            border-color: #ef4444;
            animation: likePulse 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .fanart-like-btn i {
            font-size: 11px;
            color: #ef4444;
            transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .fanart-like-btn.liked i {
            transform: scale(1.3);
        }
        @keyframes likePulse {
            0% { transform: scale(1); }
            30% { transform: scale(1.2); }
            60% { transform: scale(0.95); }
            100% { transform: scale(1); }
        }
        .fanart-modal-meta {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .fanart-modal-artist {
            color: #94a3b8;
            font-size: 13px;
        }

        @media (max-width: 480px) {
            .fanart-modal-card {
                max-height: 80vh;
            }
        }

        .fanart-fullscreen-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.95);
            z-index: 99999999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            visibility: hidden;
            transition: opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), visibility 0s linear 0.4s;
            padding: 20px;
            box-sizing: border-box;
            will-change: opacity;
        }
        .fanart-fullscreen-overlay.active {
            opacity: 1;
            pointer-events: auto;
            visibility: visible;
            transition-delay: 0s;
        }
        .fanart-fullscreen-img {
            max-width: 95vw;
            max-height: 95vh;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.8);
            cursor: zoom-out;
            transform-origin: center center;
            transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            backface-visibility: hidden;
            will-change: transform;
        }
        .fanart-fullscreen-img.zoomed {
            cursor: zoom-out;
        }
        .fanart-fullscreen-overlay.zoomed-active {
            overflow: hidden;
        }
        .fanart-fullscreen-close {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 22px;
            transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            z-index: 10;
            will-change: transform;
        }
        .fanart-fullscreen-close:hover {
            background: #e74c3c;
            border-color: #e74c3c;
            transform: scale(1.15) rotate(90deg);
        }
    `;
    document.head.appendChild(style);
}

function injectFanArtFullscreen() {
    if (document.getElementById("fanart-fullscreen-overlay")) return;

    const overlay = document.createElement("div");
    overlay.className = "fanart-fullscreen-overlay";
    overlay.id = "fanart-fullscreen-overlay";
    overlay.innerHTML = `
        <button class="fanart-fullscreen-close" id="fanart-fullscreen-close-btn" aria-label="Close fullscreen">&times;</button>
        <img src="" alt="Fan Art Full View" class="fanart-fullscreen-img" id="fanart-fullscreen-img">
    `;
    document.body.appendChild(overlay);

    document.getElementById("fanart-fullscreen-close-btn").addEventListener("click", closeFanArtFullscreen);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay || e.target.classList.contains("fanart-fullscreen-img")) {
            closeFanArtFullscreen();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeFanArtFullscreen();
            closeFanArtModal();
        }
    });
}

function openFanArtFullscreen(imageSrc) {
    const overlay = document.getElementById("fanart-fullscreen-overlay");
    if (!overlay) return;

    const img = document.getElementById("fanart-fullscreen-img");
    img.src = imageSrc;
    img.style.transform = "scale(1)";
    overlay.classList.remove("zoomed-active");
    document.body.style.overflow = "hidden";
    
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            overlay.classList.add("active");
        });
    });
}

function closeFanArtFullscreen() {
    const overlay = document.getElementById("fanart-fullscreen-overlay");
    const img = document.getElementById("fanart-fullscreen-img");
    if (overlay && img) {
        overlay.classList.remove("active", "zoomed-active");
        img.style.transform = "scale(1)";
        document.body.style.overflow = "";
    }
}

function initFanArtZoom() {
    const overlay = document.getElementById("fanart-fullscreen-overlay");
    const img = document.getElementById("fanart-fullscreen-img");
    if (!overlay || !img) return;

    let scale = 1;
    const minScale = 1;
    const maxScale = 5;
    const zoomStep = 1.3;

    overlay.addEventListener("wheel", (e) => {
        if (!overlay.classList.contains("active")) return;

        e.preventDefault();
        const delta = e.deltaY > 0 ? -1 : 1;
        const newScale = Math.min(maxScale, Math.max(minScale, scale * (delta > 0 ? zoomStep : 1 / zoomStep)));

        if (newScale !== scale) {
            scale = newScale;
            requestAnimationFrame(() => {
                img.style.transform = `scale(${scale})`;
                img.style.cursor = scale > 1 ? "zoom-out" : "zoom-in";

                if (scale > 1) {
                    overlay.classList.add("zoomed-active");
                } else {
                    overlay.classList.remove("zoomed-active");
                }
            });
        }
    }, { passive: false });

    img.addEventListener("click", (e) => {
        if (!overlay.classList.contains("active")) return;
        if (scale > 1) {
            scale = 1;
            requestAnimationFrame(() => {
                img.style.transform = "scale(1)";
                img.style.cursor = "zoom-in";
                overlay.classList.remove("zoomed-active");
            });
        } else {
            closeFanArtFullscreen();
        }
    });
}

function injectFanArtModal() {
    if (document.getElementById("fanart-modal-overlay")) return;

    const overlay = document.createElement("div");
    overlay.className = "fanart-modal-overlay";
    overlay.id = "fanart-modal-overlay";
    overlay.innerHTML = `
        <div class="fanart-modal-card">
            <div class="fanart-modal-header">
                <div class="fanart-modal-title">
                    <i class="fas fa-palette"></i>
                    <span>Fan Art</span>
                </div>
                <button class="fanart-modal-close" id="fanart-modal-close-btn" aria-label="Close">&times;</button>
            </div>
            <div class="fanart-modal-body" id="fanart-modal-grid"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById("fanart-modal-close-btn").addEventListener("click", closeFanArtModal);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeFanArtModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeFanArtFullscreen();
            closeFanArtModal();
        }
    });
}

function initHomeFanArt() {
    injectFanArtModalStyles();
    injectFanArtModal();
    injectFanArtFullscreen();
    initFanArtZoom();
    renderHomeFanArt();
}

document.addEventListener("DOMContentLoaded", initHomeFanArt);
