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

// Toggle between login and sign-up forms
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const toggleLink = document.getElementById('toggle-link');
const toggleMessage = document.getElementById('toggle-message');
const authTitle = document.getElementById('auth-title');

toggleLink.addEventListener('click', function(event) {
    event.preventDefault();
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        toggleMessage.textContent = "Don't have an account?";
        toggleLink.textContent = 'Sign up';
        authTitle.textContent = 'Login';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        toggleMessage.textContent = 'Already have an account?';
        toggleLink.textContent = 'Login';
        authTitle.textContent = 'Sign Up';
    }
});

// Handle sign-up
signupForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const role = document.getElementById('signup-role').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];

    const userExists = users.some(user => user.username === username || user.email === email);
    if (userExists) {
        alert('Username or email already exists!');
        return;
    }

    users.push({ username, email, password, role });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Sign-up successful! Please login.');
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
    toggleMessage.textContent = "Don't have an account?";
    toggleLink.textContent = 'Sign up';
    authTitle.textContent = 'Login';
    signupForm.reset();
});

// Handle login
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        alert('Invalid username or password!');
    }
});

// Create background animations on page load
window.onload = createBackgroundAnimations;