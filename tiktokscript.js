(function() {
            const videoPlayers = document.querySelectorAll('.custom-video-player');
            const placeholders = document.querySelectorAll('.player-placeholder');
            const playerBody = document.getElementById('playerBody');

            const VIDEO_URLS = [
                "https://cdn.discordapp.com/attachments/1515410138570424320/1543024299651104838/snaptik_7678238879547280648_v3.mp4?ex=6a935cdd&is=6a920b5d&hm=867637ee9810f681e597586bc70034ef81cb716e3b2ec37783d32b22c47ed2fa&",
                "https://cdn.discordapp.com/attachments/1515410138570424320/1543023473390125197/snaptik_7679004784715762965_v3.mp4?ex=6a935c18&is=6a920a98&hm=281feeb2d6fe5f9fdc68665c2b037391454765ab08f08c09fdf129f71bc5f6d8&",
                "https://cdn.discordapp.com/attachments/1515410138570424320/1543022884757315664/snaptik_7677573855983979792_v3.mp4?ex=6a935b8b&is=6a920a0b&hm=5cde8e8269a10f4f86534cf31317f25467e9a7e0f377d95f88890600de6b6347&",
                "https://cdn.discordapp.com/attachments/1515410138570424320/1542906522449739909/snaptik_7676335001448811796_v3.mp4?ex=6a92ef2c&is=6a919dac&hm=d843ef54e3723b7898b0219349b956ac1460eb7ccd098003eac9db8698325f20&"
            ];

            videoPlayers.forEach((video, index) => {
                if (VIDEO_URLS[index]) {
                    video.src = VIDEO_URLS[index];
                    video.pause();
                    video.addEventListener('loadeddata', () => {
                        placeholders[index].style.display = 'none';
                    });
                }
            });

            function isPlayerInView() {
                const rect = playerBody.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                if (window.innerWidth > 768) {
                    return rect.top >= 0 && rect.top < windowHeight * 0.3;
                }
                return rect.top >= 50 && rect.top < windowHeight * 0.4;
            }

            function isVideoInView(container) {
                const rect = container.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                const visibleTop = Math.max(rect.top, 0);
                const visibleBottom = Math.min(rect.bottom, windowHeight);
                const visibleHeight = visibleBottom - visibleTop;
                return visibleHeight > rect.height * 0.6;
            }

            function handleVideoPlayback() {
                if (!isPlayerInView()) {
                    videoPlayers.forEach(video => video.pause());
                    return;
                }

                const containers = document.querySelectorAll('.player-video-container');
                containers.forEach(container => {
                    const video = container.querySelector('video');
                    if (isVideoInView(container)) {
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                });
            }

            window.addEventListener('scroll', handleVideoPlayback, { passive: true });
            window.addEventListener('resize', handleVideoPlayback, { passive: true });
            handleVideoPlayback();

            playerBody.addEventListener('scroll', () => {
                const containers = document.querySelectorAll('.player-video-container');
                containers.forEach(container => {
                    const rect = container.getBoundingClientRect();
                    const containerRect = playerBody.getBoundingClientRect();
                    const isVisible = rect.top < containerRect.bottom && rect.bottom > containerRect.top;
                    const video = container.querySelector('video');
                    if (isVisible && rect.top >= containerRect.top - 100 && rect.bottom <= containerRect.bottom + 100) {
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                });
            }, { passive: true });
        })();