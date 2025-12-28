// ============================================
// CONFIGURATION
// ============================================
const GITHUB_USERNAME = 'PiyangshuBanik';
const LEETCODE_USERNAME = 'piyangshubanik2004';

// Global observer for animations
let globalObserver = null;


// ============================================
// TESTIMONIALS DATA (WITH PHOTOS)
// ============================================
const testimonialsData = [
    {
        name: "Prof. Nikhil Aggarwal",
        company: "Chandigarh University",
        text: "Piyangshu Banik conveys quality work. He is an excellent individual and an extraordinary cooperative person. He is extremely straightforward and puts all his energy to follow through on schedule.",
        stars: 5,
        photo: "/images/nikhilsir.jpg"
    },
    {
        name: "Prof. Abhishek Tiwari",
        company: "Chandigarh University",
        text: "I've worked with many individuals who are driven by things other than the work they're doing. Piyangshu Banik is genuinely energetic about the web and the items he makes for it.",
        stars: 5,
        photo: "/images/abhishek.jpg"
    },
    {
        name: "Mr. Utkarsh Singh",
        company: "Oracle",
        text: "Piyangshu Banik is a wonderfully creative, collaborative, and gifted developer who excels at creating inclusive digital solutions.",
        stars: 5,
        photo: "/images/utkarsh.jpg"
    }
];


// ============================================
// MOBILE MENU TOGGLE
// ============================================
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link =>
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        })
    );

    window.addEventListener('resize', () => {
        if (window.innerWidth > 992) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}


// ============================================
// THEME SWITCHER
// ============================================
function initThemeSwitcher() {
    const themeSwitcher = document.getElementById('theme-switcher');
    if (!themeSwitcher) return;

    const body = document.body;
    const themeIcon = themeSwitcher.querySelector('i');

    const applyTheme = (theme) => {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
    };

    themeSwitcher.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme') || 'light';
        applyTheme(currentTheme === 'light' ? 'dark' : 'light');
    });

    applyTheme(localStorage.getItem('theme') || 'light');
}


// ============================================
// LOAD TESTIMONIALS
// ============================================
function loadTestimonials() {
    const container = document.getElementById('testimonialsContainer');
    if (!container) return;

    container.innerHTML = '';

    testimonialsData.forEach((t, index) => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.style.animationDelay = `${index * 0.1}s`;

        const starsHTML = Array(t.stars)
            .fill('<i class="fas fa-star"></i>')
            .join('');

        card.innerHTML = `
            <div class="testimonial-stars">${starsHTML}</div>
            <p class="testimonial-text">"${t.text}"</p>
            <div class="testimonial-header">
                <div class="testimonial-avatar">
                    <img src="${t.photo}" alt="${t.name}">
                </div>
                <div class="testimonial-info">
                    <h4>${t.name}</h4>
                    <p>${t.company}</p>
                </div>
            </div>
        `;

        container.appendChild(card);
    });

    observeDynamicCards();
}


// ============================================
// GITHUB STATS
// ============================================
async function fetchGitHubStats() {
    try {
        const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (!res.ok) {
            console.error('GitHub stats HTTP error:', res.status);
            return;
        }

        const data = await res.json();

        const repoCountEl = document.getElementById('repo-count');
        const followersEl = document.getElementById('github-followers');
        const contribInfo = document.getElementById('github-count');

        if (repoCountEl) repoCountEl.textContent = data.public_repos ?? 0;
        if (followersEl) followersEl.textContent = data.followers ?? 0;
        if (contribInfo) {
            // show high-level contribution text if you want
            contribInfo.innerHTML = `GitHub activity for <strong>${GITHUB_USERNAME}</strong> in the last year.`;
        }
    } catch (e) {
        console.error('GitHub stats error:', e);
    }
}


// ============================================
// GITHUB FETCH + MANUAL IMAGES MAPPING
// ============================================
async function fetchRepositories() {
    try {
        const res = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`
        );
        if (!res.ok) {
            console.error('GitHub repos HTTP error:', res.status);
            return;
        }

        const repos = await res.json();
        const container = document.getElementById('projectsContainer');
        if (!container) return;

        container.innerHTML = '';

        // MANUAL IMAGE MAPPING - Edit these paths
        const projectImages = {
            'thunder-meet-unlimited': 'images/thundercall.png',
            'portfolio': 'images/portfolio.png',
            'newportfolio': 'images/portfolio2.png',
            'deepguardextension': 'images/deepguard.png',
            'devbrowser': 'images/devbrowser.png',
            'pikabot': 'images/pikabot.png',
            // 'your-repo-name': 'images/your-image.png',
        };

        repos.forEach((repo, i) => {
            const card = document.createElement('article');
            card.className = 'project-card';
            if (repo.name === 'ThunderCall') card.classList.add('featured'); // Featured repo
            card.style.animationDelay = `${i * 0.1}s`;

            const homepage = repo.homepage && repo.homepage.trim() !== '' ? repo.homepage : '';
            const language = repo.language || 'JavaScript';
            const stars = repo.stargazers_count ?? 0;
            
            // Get manual image (case-insensitive)
            const repoNameLower = repo.name.toLowerCase();
            const manualImage = Object.keys(projectImages).find(key => 
                key.toLowerCase() === repo.name || key.toLowerCase() === repoNameLower
            ) ? projectImages[Object.keys(projectImages).find(key => key.toLowerCase() === repo.name || key.toLowerCase() === repoNameLower)] : null;

            card.innerHTML = `
                <div class="project-image">
                    <span class="project-badge">${language}</span>
                    ${manualImage ? `
                        <img src="${manualImage}" alt="${repo.name} preview" class="project-screenshot" loading="lazy"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    ` : ''}
                    <div class="project-fallback" style="display: ${manualImage ? 'none' : 'flex'}">
                        <i class="fas fa-folder"></i>
                    </div>
                </div>
                <div class="project-content">
                    <div class="project-title-row">
                        <h3 class="project-title">${repo.name}</h3>
                        <span class="project-meta">★ ${stars}</span>
                    </div>
                    <p class="project-description">
                        ${repo.description || 'No description available.'}
                    </p>
                    <div class="project-tech">
                        ${language ? `<span class="tech-tag">${language}</span>` : ''}
                    </div>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" class="project-link">
                            <i class="fab fa-github"></i> Code
                        </a>
                        ${homepage ? `
                            <a href="${homepage}" target="_blank" class="project-link">
                                <i class="fas fa-external-link-alt"></i> Live
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

        observeDynamicCards();
    } catch (e) {
        console.error('Repo fetch error:', e);
    }
}



// ============================================
// GITHUB CONTRIBUTION CALENDAR
// uses publicly available contributions API [web:61][web:73]
// ============================================
async function fetchGitHubContributions() {
    const grid = document.getElementById('githubContributionGraph');
    if (!grid) return;

    // API that returns contributions array with date + count
    const apiUrl = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}`;

    try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
            console.error('Contrib API HTTP error:', res.status);
            return;
        }

        const data = await res.json();
        if (!data || !Array.isArray(data.contributions)) {
            console.error('Invalid contribution data:', data);
            return;
        }

        // Clear grid
        grid.innerHTML = '';

        // GitHub-like calendar: 7 rows, 52 weeks
        // The API returns an array for last ~365 days; we just map into boxes
        const contributions = data.contributions; // [{date:"YYYY-MM-DD", count:Number}, ...]
        // Ensure exactly 7 * 52 = 364 cells (or less if you prefer)
        const maxCells = 7 * 52;
        const sliced = contributions.slice(-maxCells);

        // Normalize counts into levels 0-4
        const counts = sliced.map(c => c.count);
        const maxCount = Math.max(0, ...counts);
        const getLevel = (count) => {
            if (count === 0) return 0;
            if (maxCount === 0) return 0;
            const ratio = count / maxCount;
            if (ratio > 0.75) return 4;
            if (ratio > 0.5) return 3;
            if (ratio > 0.25) return 2;
            return 1;
        };

        sliced.forEach(c => {
            const box = document.createElement('div');
            box.dataset.level = String(getLevel(c.count));
            box.title = `${c.count} contributions on ${c.date}`;
            grid.appendChild(box);
        });
    } catch (e) {
        console.error('GitHub contributions error:', e);
    }
}


// ============================================
// LEETCODE STATS (EXISTING API, GUARDED)
// ============================================
async function fetchLeetCodeStats() {
    try {
        const res = await fetch(
            `https://leetcode-stats-api.herokuapp.com/${LEETCODE_USERNAME}`
        );
        if (!res.ok) {
            console.error('LeetCode HTTP error:', res.status);
            return;
        }

        const data = await res.json();
        console.log('LeetCode response:', data);

        if (data.status === 'success') {
            const totalEl = document.getElementById('leetcode-total');
            const easyEl = document.getElementById('leetcode-easy');
            const mediumEl = document.getElementById('leetcode-medium');
            const hardEl = document.getElementById('leetcode-hard');
            const rankingEl = document.getElementById('leetcode-ranking');
            const accEl = document.getElementById('leetcode-acceptance');

            if (totalEl) totalEl.textContent = data.totalSolved ?? 0;
            if (easyEl) easyEl.textContent = data.easySolved ?? 0;
            if (mediumEl) mediumEl.textContent = data.mediumSolved ?? 0;
            if (hardEl) hardEl.textContent = data.hardSolved ?? 0;
            if (rankingEl) rankingEl.textContent = data.ranking ?? 'N/A';
            if (accEl) accEl.textContent = data.acceptanceRate ?? 'N/A';
        } else {
            console.warn('LeetCode API non-success status:', data);
        }
    } catch (e) {
        console.error('LeetCode error:', e);
    }
}


// ============================================
// CONTACT FORM (EMAILJS)
// ============================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const subject = form.subject.value.trim();
        const message = form.message.value.trim();

        if (!name || !email || !subject || !message) {
            alert('Please fill all fields');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        emailjs
            .send('service_wdw95m4', 'template_3u8k3fq', {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message
            })
            .then(() => {
                alert('Message sent successfully!');
                form.reset();
            })
            .catch(err => {
                console.error('EmailJS error:', err);
                alert('Failed to send message. Try again later.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            });
    });
}


// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}


// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (scrollY >= sectionTop) {
                current = section.id;
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${current}`);
        });
    });
}


// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
function initIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    globalObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeIn 0.8s ease forwards';
                    globalObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll('.stat').forEach(el => {
        el.style.opacity = '0';
        globalObserver.observe(el);
    });
}

function observeDynamicCards() {
    if (!globalObserver) return;

    document
        .querySelectorAll('.project-card, .testimonial-card')
        .forEach(el => {
            if (!el.dataset.observed) {
                el.dataset.observed = 'true';
                el.style.opacity = '0';
                globalObserver.observe(el);
            }
        });
}


// ============================================
// INITIALIZATION
// ============================================
window.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initThemeSwitcher();
    initSmoothScroll();
    initActiveNavLink();
    initContactForm();
    initIntersectionObserver();

    loadTestimonials();
    fetchGitHubStats();
    fetchRepositories();
    fetchGitHubContributions();  // <-- this actually fills the graph
    fetchLeetCodeStats();
});
