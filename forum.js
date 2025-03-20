// Check if user is logged in
window.onload = function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }

    if (currentUser.role === 'Admin' || currentUser.role === 'Hostel Warden') {
        window.location.href = 'admin.html';
        return;
    }

    loadPosts();
    createBackgroundAnimations();
};

// Function to create background animations (particles and starfield)
function createBackgroundAnimations() {
    // Initialize Particles
    const particlesContainer = document.getElementById('particles');
    const numParticles = 30;
    const particles = [];

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particlesContainer.appendChild(particle);
        particles.push(particle);
    }

    function drawLines() {
        const linesContainer = document.createElement('div');
        linesContainer.className = 'lines';
        particlesContainer.appendChild(linesContainer);

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const distance = Math.hypot(
                    parseFloat(particles[i].style.left) - parseFloat(particles[j].style.left),
                    parseFloat(particles[i].style.top) - parseFloat(particles[j].style.top)
                );
                if (distance < 20) {
                    const line = document.createElement('div');
                    line.className = 'line';
                    const x1 = parseFloat(particles[i].style.left);
                    const y1 = parseFloat(particles[i].style.top);
                    const x2 = parseFloat(particles[j].style.left);
                    const y2 = parseFloat(particles[j].style.top);
                    const length = Math.hypot(x1 - x2, y1 - y2);
                    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
                    line.style.width = length + 'vw';
                    line.style.left = x1 + 'vw';
                    line.style.top = y1 + 'vh';
                    line.style.transform = `rotate(${angle}deg)`;
                    linesContainer.appendChild(line);
                }
            }
        }
    }

    drawLines();

    // Initialize Starfield
    const layers = [
        document.querySelector('.starfield-layer-1'),
        document.querySelector('.starfield-layer-2'),
        document.querySelector('.starfield-layer-3')
    ];
    const starCounts = [100, 60, 40]; // Number of stars per layer

    layers.forEach((layer, index) => {
        for (let i = 0; i < starCounts[index]; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 200 + 'vw'; // Wider range for movement
            star.style.top = Math.random() * 100 + 'vh';
            star.style.animationDelay = Math.random() * 3 + 's';
            layer.appendChild(star);
        }
    });
}

// Particle styles
const particleStyles = `
    .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        animation: twinkle 5s infinite ease-in-out;
    }

    @keyframes twinkle {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.5); }
    }

    .line {
        position: absolute;
        height: 1px;
        background: rgba(255, 255, 255, 0.3);
        transform-origin: 0 0;
        animation: fadeLine 5s infinite ease-in-out;
    }

    @keyframes fadeLine {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = particleStyles;
document.head.appendChild(styleSheet);

// Load forum posts
function loadPosts() {
    let posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
    posts.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)); // Sort by net votes
    const postList = document.getElementById('forum-posts');
    postList.innerHTML = '';

    posts.forEach(post => {
        const postItem = document.createElement('li');
        postItem.classList.add('forum-post');
        postItem.innerHTML = `
            <div>
                <strong>${post.title}</strong> by ${post.author}
                <p>${post.content}</p>
                <small>Posted on ${new Date(post.timestamp).toLocaleString()}</small>
            </div>
            <div class="vote-buttons">
                <button class="vote-btn upvote" data-id="${post.id}">Upvote (${post.upvotes})</button>
                <button class="vote-btn downvote" data-id="${post.id}">Downvote (${post.downvotes})</button>
            </div>
        `;
        postList.appendChild(postItem);
    });

    document.querySelectorAll('.upvote').forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.dataset.id;
            let posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
            const post = posts.find(p => p.id === postId);
            if (post) {
                post.upvotes++;
                localStorage.setItem('forumPosts', JSON.stringify(posts));
                loadPosts();
            }
        });
    });

    document.querySelectorAll('.downvote').forEach(button => {
        button.addEventListener('click', function() {
            const postId = this.dataset.id;
            let posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
            const post = posts.find(p => p.id === postId);
            if (post) {
                post.downvotes++;
                localStorage.setItem('forumPosts', JSON.stringify(posts));
                loadPosts();
            }
        });
    });
}

// Handle new post submission
document.getElementById('forum-post-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    let posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
    const postId = Date.now().toString();
    posts.push({
        id: postId,
        title,
        content,
        author: currentUser.username,
        timestamp: Date.now(),
        upvotes: 0,
        downvotes: 0
    });
    localStorage.setItem('forumPosts', JSON.stringify(posts));

    this.reset();
    loadPosts();
});