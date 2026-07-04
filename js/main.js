document.addEventListener('DOMContentLoaded', () => {
    // 1. Loader Logic
    const loader = document.getElementById('luxury-loader');
    const hasVisited = localStorage.getItem('gazameuble_visited');

    if (!hasVisited) {
        // Show loader and animate
        document.body.style.overflow = 'hidden'; // Prevent scrolling during loader
        const circle = document.querySelector('.progress-ring__circle');
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
        
        const percentageEl = document.getElementById('loader-percentage');
        const logoEl = document.querySelector('.loader-logo');
        
        // GSAP Timeline for Loader
        const tl = gsap.timeline({
            onComplete: () => {
                localStorage.setItem('gazameuble_visited', 'true');
                document.body.style.overflow = 'auto'; // Restore scrolling
                
                // Transition out
                gsap.to(loader, {
                    yPercent: -100,
                    duration: 1.2,
                    ease: "power4.inOut",
                    onComplete: initHeroAnimations // Start hero animations after loader
                });
            }
        });

        // Fade in logo
        tl.to(logoEl, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
        });

        // Progress ring animation
        let progress = { val: 0 };
        tl.to(progress, {
            val: 100,
            duration: 2.5,
            ease: "power2.inOut",
            onUpdate: function() {
                const percent = Math.round(progress.val);
                percentageEl.innerText = `${percent}%`;
                const offset = circumference - percent / 100 * circumference;
                circle.style.strokeDashoffset = offset;
            }
        }, "-=0.5");
        
    } else {
        // Skip loader
        loader.style.display = 'none';
        initHeroAnimations();
    }

    // 2. Set Current Year in Footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // 3. Navbar Sticky Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Product Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    gsap.fromTo(card, 
                        { opacity: 0, y: 20 }, 
                        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
                    );
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 5. GSAP Scroll Animations
    gsap.registerPlugin(ScrollTrigger);

    function initHeroAnimations() {
        const heroTl = gsap.timeline();
        
        heroTl.from(".hero-title", {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        })
        .from(".hero-subtitle", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.6")
        .from(".badge", {
            x: -20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.4")
        .from(".hero-cta .btn", {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.4")
        .from(".hero-image-wrapper", {
            x: 50,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out"
        }, "-=1.5");

        // Floating shapes animation
        gsap.to(".shape-1", {
            y: -30,
            x: 20,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        gsap.to(".shape-2", {
            y: 30,
            x: -20,
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // Parallax effect on hero image
        gsap.to("#hero-img-parallax", {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }

    // Scroll Reveals
    // Trust Section
    gsap.from(".trust-section .section-header", {
        scrollTrigger: {
            trigger: ".trust-section",
            start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8
    });

    gsap.from(".trust-card", {
        scrollTrigger: {
            trigger: ".trust-grid",
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
    });

    // Products Section
    gsap.from(".products-section .section-header", {
        scrollTrigger: {
            trigger: ".products-section",
            start: "top 80%",
        },
        x: -30,
        opacity: 0,
        duration: 0.8
    });

    gsap.from(".product-filters", {
        scrollTrigger: {
            trigger: ".products-section",
            start: "top 75%",
        },
        y: 20,
        opacity: 0,
        duration: 0.6
    });

    gsap.from(".product-card", {
        scrollTrigger: {
            trigger: ".product-grid",
            start: "top 75%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
    });

    // Location Section
    gsap.from(".location-card", {
        scrollTrigger: {
            trigger: ".location-section",
            start: "top 75%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    // 6. Animated Counters
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        ScrollTrigger.create({
            trigger: ".stats-container",
            start: "top 80%",
            once: true,
            onEnter: () => {
                const target = +counter.getAttribute('data-target');
                const duration = 2; // seconds
                
                gsap.to(counter, {
                    innerHTML: target,
                    duration: duration,
                    snap: { innerHTML: 1 },
                    ease: "power1.inOut"
                });
            }
        });
    });
});
