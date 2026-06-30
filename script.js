/* ==========================================
   PREMIUM INTERACTIONS & ANIMATIONS LOGIC
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // ================= MOBILE NAVIGATION =================
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");
    
    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navToggle.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Close menu when clicking on a link
        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                navToggle.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }

    // ================= SCROLL PROGRESS INDICATOR =================
    const scrollProgress = document.getElementById("scrollProgress");
    
    window.addEventListener("scroll", () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0 && scrollProgress) {
            const progress = (window.scrollY / totalHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }
    });

    // ================= LAZY DYNAMIC CUSTOM CURSOR =================
    const cursorDot = document.getElementById("cursorDot");
    const cursorGlow = document.getElementById("cursorGlow");
    
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    
    // Only activate custom cursor on non-touch devices
    if (window.innerWidth > 768 && cursorDot && cursorGlow) {
        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly move the tiny dot
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });
        
        // Lazy lag effect for the glowing spotlight halo
        const animateGlow = () => {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            
            cursorGlow.style.left = `${glowX}px`;
            cursorGlow.style.top = `${glowY}px`;
            
            requestAnimationFrame(animateGlow);
        };
        animateGlow();
        
        // Cursor hover scale-up effect
        const hoverables = document.querySelectorAll(
            "a, button, .project-card, .filter-btn, .contact-item, .cert-image-frame, .modal-close"
        );
        
        hoverables.forEach(el => {
            el.addEventListener("mouseenter", () => {
                document.body.classList.add("cursor-hover");
            });
            el.addEventListener("mouseleave", () => {
                document.body.classList.remove("cursor-hover");
            });
        });
    }

    // ================= INTERACTIVE 3D CARD TILT =================
    const tiltCards = document.querySelectorAll(".tilt-card");
    
    // Apply 3D physics tilt only to screens broader than tablets for comfort
    if (window.innerWidth > 768) {
        tiltCards.forEach(card => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x coordinate inside the card
                const y = e.clientY - rect.top;  // y coordinate inside the card
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const tiltX = -(y - centerY) / centerY * 8; // Max 8 degrees tilt
                const tiltY = (x - centerX) / centerX * 8;
                
                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
                
                // Add glowing hover reflections to cards
                card.style.boxShadow = `0 15px 45px rgba(0, 242, 254, 0.08), 
                                        inset ${-tiltY * 1.5}px ${tiltX * 1.5}px 15px rgba(255,255,255,0.03)`;
            });
            
            card.addEventListener("mouseleave", () => {
                card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
                card.style.boxShadow = "";
            });
        });
    }

    // ================= DYNAMIC PROJECTS FILTERING =================
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");
    
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove active status
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            
            const filterValue = button.getAttribute("data-filter");
            
            projectCards.forEach(card => {
                const categories = card.getAttribute("data-category") || "";
                
                if (filterValue === "all" || categories.includes(filterValue)) {
                    card.classList.remove("hide");
                    // Trigger fade in animation
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.95)";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 50);
                } else {
                    card.classList.add("hide");
                }
            });
        });
    });

    // ================= HERO HEADER TYPING EFFECT =================
    const textArray = [
        "Data Analyst",
        "Python Developer",
        "Power BI developer",
        "Machine Learning Engineer"
    ];
    
    let index = 0;
    let charIndex = 0;
    let currentText = "";
    let deleting = false;
    const typingElement = document.getElementById("typing");

    function typeEffect() {
        if (!typingElement) return;
        
        const fullText = textArray[index];
        
        if (deleting) {
            currentText = fullText.substring(0, charIndex--);
        } else {
            currentText = fullText.substring(0, charIndex++);
        }
        
        typingElement.textContent = currentText;
        
        let speed = deleting ? 40 : 80;
        
        if (!deleting && charIndex === fullText.length + 1) {
            deleting = true;
            speed = 2000; // Pause at the end of word
        } else if (deleting && charIndex === 0) {
            deleting = false;
            index = (index + 1) % textArray.length;
            speed = 400; // Brief pause before typing next word
        }
        
        setTimeout(typeEffect, speed);
    }
    
    if (typingElement) {
        typeEffect();
    }

    // ================= SCROLL REVEAL (Intersection Observer) =================
    const revealElements = document.querySelectorAll(".scroll-reveal");
    
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target); // Unobserve once animated
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: "0px 0px -50px 0px" // Trigger slightly before entering viewport
        });
        
        revealElements.forEach(el => revealObserver.observe(el));
    }
});

// ================= IMAGE / CASE STUDY MODAL MANAGEMENT =================
function openModal(title, desc, tools, link) {
    const modal = document.getElementById("modal");
    if (!modal) return;
    
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Disable background scrolling

    document.getElementById("m-title").innerText = title;
    document.getElementById("m-desc").innerText = desc;
    document.getElementById("m-tools").innerText = tools;
    
    const projectLink = document.getElementById("m-link");
    if (projectLink) {
        projectLink.href = link;
        projectLink.innerHTML = `<i class="fab fa-github"></i> Explore Repository`;
    }
}

function closeModal() {
    const modal = document.getElementById("modal");
    if (!modal) return;
    
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // Re-enable background scrolling
}

// Close modal when clicking outside of the content card
window.addEventListener("click", (e) => {
    const modal = document.getElementById("modal");
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeModal();
    }
});
