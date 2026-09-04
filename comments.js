(function () {
    const STORAGE_KEY = 'mirai_comments';

    function getCurrentUser() {
        const email = localStorage.getItem('mirai_current_user');
        if (!email) return null;
        try {
            const users = JSON.parse(localStorage.getItem('mirai_users')) || [];
            return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
        } catch {
            return null;
        }
    }

    function getAnimeId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    function getEpisode() {
        const params = new URLSearchParams(window.location.search);
        return params.get('ep') || '1';
    }

    function getComments() {
        try {
            const allComments = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            const animeId = getAnimeId();
            const episode = getEpisode();
            const key = `${animeId}_${episode}`;
            return allComments[key] || [];
        } catch {
            return [];
        }
    }

    function saveComments(comments) {
        try {
            const allComments = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            const animeId = getAnimeId();
            const episode = getEpisode();
            const key = `${animeId}_${episode}`;
            allComments[key] = comments;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(allComments));
        } catch (e) {
            console.error('Failed to save comments:', e);
        }
    }

    function formatTime(timestamp) {
        const diff = Math.floor((Date.now() - timestamp) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        return new Date(timestamp).toLocaleDateString();
    }

    function renderComments() {
        const list = document.getElementById('commentsList');
        const count = document.getElementById('commentsCount');
        const comments = getComments();

        count.textContent = `${comments.length} comment${comments.length !== 1 ? 's' : ''}`;

        if (comments.length === 0) {
            list.innerHTML = '<p class="comments-empty">No comments yet. Be the first to comment!</p>';
            return;
        }

        list.innerHTML = comments.map(comment => `
            <div class="comment-item">
                <div class="comment-avatar">
                    ${comment.avatar
                        ? `<img src="${comment.avatar}" alt="${comment.username}">`
                        : `<div class="comment-avatar-placeholder">${comment.username.charAt(0).toUpperCase()}</div>`
                    }
                </div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-username">${comment.username}</span>
                        <span class="comment-time">${formatTime(comment.timestamp)}</span>
                    </div>
                    <p class="comment-text">${comment.text}</p>
                </div>
            </div>
        `).join('');
    }

    function postComment() {
        const input = document.getElementById('commentInput');
        const text = input.value.trim();
        if (!text) return;

        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        const comments = getComments();
        comments.unshift({
            username: user.displayName || user.firstName || 'User',
            avatar: user.avatar || '',
            text: text,
            timestamp: Date.now()
        });

        saveComments(comments);
        input.value = '';
        renderComments();
    }

    function init() {
        const user = getCurrentUser();
        const authGate = document.getElementById('commentsAuthGate');
        const form = document.getElementById('commentsForm');

        if (user) {
            authGate.style.display = 'none';
            form.style.display = 'flex';
        } else {
            authGate.style.display = 'block';
            form.style.display = 'none';
        }

        renderComments();

        document.getElementById('commentSubmitBtn').addEventListener('click', postComment);
        document.getElementById('commentInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                postComment();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
