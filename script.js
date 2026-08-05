/* ==========================================================================
   PREMIUM INTERACTIONS & NEO-CYBER ANIMATIONS ENGINE
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // ================= MOBILE NAVIGATION TOGGLE =================
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");
    
    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navToggle.classList.toggle("active");
            navMenu.classList.toggle("active");
            
            // Toggle hamburger animation
            const bars = navToggle.querySelectorAll(".bar");
            if (navToggle.classList.contains("active")) {
                bars[0].style.transform = "rotate(45deg) translate(6px, 6px)";
                bars[1].style.opacity = "0";
                bars[2].style.transform = "rotate(-45deg) translate(5px, -6px)";
            } else {
                bars[0].style.transform = "none";
                bars[1].style.opacity = "1";
                bars[2].style.transform = "none";
            }
            playAudioHaptic('click');
        });

        // Close menu when clicking on a link
        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                navToggle.classList.remove("active");
                navMenu.classList.remove("active");
                const bars = navToggle.querySelectorAll(".bar");
                bars[0].style.transform = "none";
                bars[1].style.opacity = "1";
                bars[2].style.transform = "none";
            });
        });
    }

    // ================= SCROLL PROGRESS BAR =================
    const scrollProgress = document.getElementById("scrollProgress");
    
    window.addEventListener("scroll", () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0 && scrollProgress) {
            const progress = (window.scrollY / totalHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }
    });

    // ================= CURSOR FOLLOW & SPOTLIGHT MESH =================
    const cursorDot = document.getElementById("cursorDot");
    const cursorSpotlight = document.getElementById("cursorSpotlight");
    
    let mouseX = -100, mouseY = -100;
    let spotX = -100, spotY = -100;
    
    if (window.innerWidth > 768 && cursorDot && cursorSpotlight) {
        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });
        
        // Spotlight follow delay lag
        const animateSpotlight = () => {
            spotX += (mouseX - spotX) * 0.1;
            spotY += (mouseY - spotY) * 0.1;
            
            cursorSpotlight.style.left = `${spotX}px`;
            cursorSpotlight.style.top = `${spotY}px`;
            
            requestAnimationFrame(animateSpotlight);
        };
        animateSpotlight();
        
        // Spotlight resize when hover clickable elements
        const setupCursorHovers = () => {
            const hoverElements = document.querySelectorAll(
                "a, button, .project-card, .filter-btn, .git-commit-point, .sandbox-tab-btn, .sql-opt-btn, .dash-filter-btn, .cert-card"
            );
            
            hoverElements.forEach(el => {
                el.addEventListener("mouseenter", () => {
                    document.body.classList.add("cursor-hover");
                });
                el.addEventListener("mouseleave", () => {
                    document.body.classList.remove("cursor-hover");
                });
            });
        };
        setupCursorHovers();
        window.updateCursorHovers = setupCursorHovers;
    }

    // ================= DYNAMIC VECTOR FLUID BACKGROUND CANVAS =================
    const canvas = document.getElementById("bgCanvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particles = [];
        let canvasWidth = window.innerWidth;
        let canvasHeight = window.innerHeight;
        
        class Particle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * canvasWidth;
                this.y = Math.random() * canvasHeight;
                this.vx = (Math.random() - 0.5) * 0.2;
                this.vy = (Math.random() - 0.5) * 0.2;
                this.radius = Math.random() * 2.5 + 0.5;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.color = Math.random() > 0.5 ? '#00ff87' : '#00f2fe';
            }
            
            update() {
                // Vector field calculation (slow waves)
                this.x += this.vx;
                this.y += this.vy;
                
                // Mouse interaction physics
                if (mouseX > 0 && mouseY > 0) {
                    const dx = this.x - mouseX;
                    const dy = this.y - mouseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        const force = (150 - dist) / 1500;
                        this.vx += (dx / dist) * force;
                        this.vy += (dy / dist) * force;
                    }
                }
                
                // Slow friction/damping
                this.vx *= 0.98;
                this.vy *= 0.98;
                
                // Add minor random floating motion
                this.vx += (Math.random() - 0.5) * 0.02;
                this.vy += (Math.random() - 0.5) * 0.02;
                
                // Bounce edges
                if (this.x < 0 || this.x > canvasWidth) this.vx *= -1;
                if (this.y < 0 || this.y > canvasHeight) this.vy *= -1;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.fill();
            }
        }
        
        const resizeCanvas = () => {
            canvasWidth = window.innerWidth;
            canvasHeight = window.innerHeight;
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            initParticles();
        };
        
        const initParticles = () => {
            particles = [];
            const count = Math.min(Math.floor((canvasWidth * canvasHeight) / 18000), 75);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };
        
        const animateCanvas = () => {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            
            // Subtle link connections
            ctx.strokeStyle = 'rgba(0, 242, 254, 0.03)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            requestAnimationFrame(animateCanvas);
        };
        
        if (window.innerWidth > 768) {
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            animateCanvas();
        }
    }

    // ================= HERO TEXT TYPING EFFECT =================
    const wordsList = [
        "Frontend Features",
        "Interactive Dashboards",
        
        
    ];
    let wordIdx = 0;
    let charIdx = 0;
    let currentWord = "";
    let isDeleting = false;
    const typingSpan = document.getElementById("typing");
    
    function typeSequence() {
        if (!typingSpan) return;
        
        const fullWord = wordsList[wordIdx];
        if (isDeleting) {
            currentWord = fullWord.substring(0, charIdx--);
        } else {
            currentWord = fullWord.substring(0, charIdx++);
        }
        
        typingSpan.textContent = currentWord;
        let speed = isDeleting ? 40 : 80;
        
        if (!isDeleting && charIdx === fullWord.length + 1) {
            isDeleting = true;
            speed = 1800; // Pause at typed word
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % wordsList.length;
            speed = 300; // Brief pause before starting next word
        }
        
        setTimeout(typeSequence, speed);
    }
    
    if (typingSpan) {
        typeSequence();
    }

    // ================= MACOS TERMINAL TABS TOGGLE =================
    const termTabs = document.querySelectorAll(".term-tab");
    const termPanes = document.querySelectorAll(".terminal-code-pane");
    
    termTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            termTabs.forEach(t => t.classList.remove("active"));
            termPanes.forEach(p => p.classList.remove("active"));
            
            tab.classList.add("active");
            const targetPane = document.getElementById(`term-pane-${tab.getAttribute("data-tab")}`);
            if (targetPane) {
                targetPane.classList.add("active");
            }
            playAudioHaptic('click');
        });
    });

    // ================= INTERACTIVE 3D CARD TILT =================
    const tiltCards = document.querySelectorAll(".tilt-card");
    if (window.innerWidth > 768) {
        tiltCards.forEach(card => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = -(y - centerY) / centerY * 6;
                const rotateY = (x - centerX) / centerX * 6;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
                card.style.boxShadow = `0 15px 35px rgba(0, 255, 135, 0.05), inset ${-rotateY}px ${rotateX}px 15px rgba(255,255,255,0.01)`;
            });
            
            card.addEventListener("mouseleave", () => {
                card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
                card.style.boxShadow = "";
            });
        });
    }

    // ================= BENTO GRID NUMBER COUNTERS =================
    const kpiNums = document.querySelectorAll(".kpi-num");
    
    const countNumber = (element) => {
        const target = parseFloat(element.getAttribute("data-target"));
        const duration = 1200; // ms
        const startTime = performance.now();
        
        const updateCount = (timestamp) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = target * easeOut;
            
            if (target % 1 === 0) {
                element.textContent = Math.floor(current).toString();
            } else {
                element.textContent = current.toFixed(1);
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateCount);
            }
        };
        requestAnimationFrame(updateCount);
    };

    const bentoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                kpiNums.forEach(num => countNumber(num));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const kpiContainer = document.querySelector(".card-kpi");
    if (kpiContainer) {
        bentoObserver.observe(kpiContainer);
    }

    // ================= EXPERIENCE GIT TREE BRANCH TIMELINE =================
    const gitPoints = document.querySelectorAll(".git-commit-point");
    const gitCards = document.querySelectorAll(".git-card");
    
    gitPoints.forEach(point => {
        point.addEventListener("click", () => {
            const role = point.getAttribute("data-role");
            
            gitPoints.forEach(p => p.classList.remove("active"));
            gitCards.forEach(c => c.classList.remove("active"));
            
            point.classList.add("active");
            const targetCard = document.getElementById(`role-${role}`);
            if (targetCard) {
                targetCard.classList.add("active");
            }
            playAudioHaptic('click');
        });
    });

    // Mirror card clicks back to timeline points
    gitCards.forEach(card => {
        card.addEventListener("click", () => {
            if (!card.classList.contains("active")) {
                const role = card.id.replace("role-", "");
                const matchingPoint = document.querySelector(`.git-commit-point[data-role="${role}"]`);
                if (matchingPoint) {
                    matchingPoint.click();
                }
            }
        });
    });

    // ================= PROJECTS CATEGORIES FILTERING =================
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");
    
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const filterVal = btn.getAttribute("data-filter");
            
            projectCards.forEach(card => {
                const categories = card.getAttribute("data-category") || "";
                if (filterVal === "all" || categories.includes(filterVal)) {
                    card.classList.remove("hide");
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.96)";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 50);
                } else {
                    card.classList.add("hide");
                }
            });
            playAudioHaptic('click');
        });
    });

    // ================= DYNAMIC DATA SANDBOX INTERACTION =================
    
    // Tab Toggling
    const sandboxTabs = document.querySelectorAll(".sandbox-tab-btn");
    const sandboxPanes = document.querySelectorAll(".sandbox-pane");
    
    sandboxTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            sandboxTabs.forEach(t => t.classList.remove("active"));
            sandboxPanes.forEach(p => p.classList.remove("active"));
            
            tab.classList.add("active");
            const targetPane = document.getElementById(tab.getAttribute("data-target"));
            if (targetPane) {
                targetPane.classList.add("active");
            }
            playAudioHaptic('click');
        });
    });

    // --- SUB-MODULE 1: SQL SIMULATOR ---
    const sqlOptBtns = document.querySelectorAll(".sql-opt-btn");
    const sqlCodeBlock = document.getElementById("sqlCodeBlock");
    const btnRunSQL = document.getElementById("btnRunSQL");
    const sqlStats = document.getElementById("sqlStats");
    const sqlRowCount = document.getElementById("sqlRowCount");
    const sqlTableWrapper = document.getElementById("sqlTableWrapper");
    
    const sqlQueries = {
        clv: {
            code: `SELECT 
    acquisition_channel,
    COUNT(customer_id) AS total_customers,
    ROUND(AVG(lifetime_value), 2) AS avg_clv,
    ROUND(SUM(revenue), 2) AS total_revenue
FROM customer_leads
GROUP BY acquisition_channel
ORDER BY avg_clv DESC;`,
            rows: 4,
            headers: ["acquisition_channel", "total_customers", "avg_clv", "total_revenue"],
            data: [
                ["Paid Search", "4,120", "$285.50", "$1,176,260.00"],
                ["Referral Network", "2,180", "$268.00", "$584,240.00"],
                ["Organic Social", "5,450", "$192.30", "$1,048,035.00"],
                ["Direct Traffic", "1,890", "$140.10", "$264,789.00"]
            ]
        },
        attrition: {
            code: `SELECT 
    income_range,
    COUNT(employee_id) AS total_staff,
    SUM(CASE WHEN attrition = 'Yes' THEN 1 ELSE 0 END) AS attrition_count,
    ROUND(AVG(satisfaction_level), 2) AS avg_satisfaction,
    ROUND((SUM(CASE WHEN attrition = 'Yes' THEN 1.0 ELSE 0.0 END) * 100) / COUNT(employee_id), 1) AS attrition_rate
FROM employee_hr_data
GROUP BY income_range
ORDER BY attrition_rate DESC;`,
            rows: 3,
            headers: ["income_range", "total_staff", "attrition_count", "avg_satisfaction", "attrition_rate"],
            data: [
                ["$2,000 - $4,500 (Low)", "420", "84", "3.12", "20.0%"],
                ["$4,501 - $9,000 (Mid)", "810", "65", "3.84", "8.0%"],
                ["$9,001+ (High)", "190", "9", "4.45", "4.7%"]
            ]
        },
        sales: {
            code: `SELECT 
    region,
    product_category,
    ROUND(SUM(sales_volume), 2) AS gross_sales,
    ROUND(SUM(net_profit), 2) AS total_profit,
    ROUND((SUM(net_profit) / SUM(sales_volume)) * 100, 2) AS margin_percentage
FROM transaction_ledger
GROUP BY region, product_category
ORDER BY gross_sales DESC;`,
            rows: 5,
            headers: ["region", "product_category", "gross_sales", "total_profit", "margin_percentage"],
            data: [
                ["East", "Technology", "$342,120.00", "$85,530.00", "25.0%"],
                ["North", "Furniture", "$280,140.00", "$44,822.40", "16.0%"],
                ["West", "Technology", "$240,110.00", "$55,225.30", "23.0%"],
                ["South", "Office Supplies", "$190,500.00", "$51,435.00", "27.0%"],
                ["East", "Office Supplies", "$180,200.00", "$45,050.00", "25.0%"]
            ]
        }
    };
    
    let activeQueryKey = "clv";
    let typeIntervalTimer = null;
    
    if (sqlCodeBlock) {
        sqlCodeBlock.textContent = sqlQueries[activeQueryKey].code;
    }
    
    sqlOptBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            sqlOptBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeQueryKey = btn.getAttribute("data-query");
            playAudioHaptic('click');
            
            // Animate typing into the code block
            const targetQuery = sqlQueries[activeQueryKey].code;
            if (typeIntervalTimer) clearInterval(typeIntervalTimer);
            sqlCodeBlock.textContent = "";
            let idx = 0;
            
            typeIntervalTimer = setInterval(() => {
                if (idx < targetQuery.length) {
                    sqlCodeBlock.textContent += targetQuery.charAt(idx);
                    idx += 4; // fast type chunks
                    if (idx > targetQuery.length) {
                        sqlCodeBlock.textContent = targetQuery;
                    }
                } else {
                    clearInterval(typeIntervalTimer);
                }
            }, 10);
        });
    });

    if (btnRunSQL) {
        btnRunSQL.addEventListener("click", () => {
            playAudioHaptic('click');
            btnRunSQL.disabled = true;
            btnRunSQL.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Running...`;
            if (sqlStats) {
                sqlStats.innerHTML = `Status: <span class="gradient-text">Analyzing database schemas...</span>`;
            }
            
            setTimeout(() => {
                const queryInfo = sqlQueries[activeQueryKey];
                
                if (sqlRowCount) {
                    sqlRowCount.textContent = `${queryInfo.rows} rows returned`;
                }
                
                if (sqlStats) {
                    const duration = (Math.random() * 6 + 2).toFixed(1);
                    sqlStats.innerHTML = `Status: <span style="color: #00ff87;"><i class="fas fa-check-circle"></i> Complete</span> (took ${duration}ms)`;
                }
                
                // Formulate HTML table
                let tableHTML = `<table class="sql-table"><thead><tr>`;
                queryInfo.headers.forEach(h => {
                    tableHTML += `<th>${h}</th>`;
                });
                tableHTML += `</tr></thead><tbody>`;
                queryInfo.data.forEach(row => {
                    tableHTML += `<tr>`;
                    row.forEach(cell => {
                        tableHTML += `<td>${cell}</td>`;
                    });
                    tableHTML += `</tr>`;
                });
                tableHTML += `</tbody></table>`;
                
                if (sqlTableWrapper) {
                    sqlTableWrapper.innerHTML = tableHTML;
                }
                
                btnRunSQL.disabled = false;
                btnRunSQL.innerHTML = `<i class="fas fa-play"></i> Run Query`;
                playAudioHaptic('click');
                window.updateCursorHovers();
            }, 700);
        });
    }

    // --- SUB-MODULE 2: DYNAMIC KPI DASHBOARD ---
    const dashFilterBtns = document.querySelectorAll(".dash-filter-btn");
    const kpiRevenue = document.getElementById("kpiRevenue");
    const kpiMargin = document.getElementById("kpiMargin");
    const kpiCustomers = document.getElementById("kpiCustomers");
    const kpiChurn = document.getElementById("kpiChurn");
    const dashDynamicInsight = document.getElementById("dashDynamicInsight");
    const svgBarChart = document.getElementById("svgBarChart");
    const gaugeFill = document.getElementById("gaugeFill");
    const gaugePercentText = document.getElementById("gaugePercentText");
    
    const dashboardDb = {
        regions: {
            all: { revenue: 1245800, margin: 24.8, customers: 14250, churn: 2.1, target: 82, categories: [120, 75, 90] },
            north: { revenue: 412500, margin: 21.4, customers: 4320, churn: 2.8, target: 70, categories: [50, 40, 30] },
            east: { revenue: 524000, margin: 28.5, customers: 6180, churn: 1.5, target: 94, categories: [85, 30, 42] },
            west: { revenue: 309300, margin: 23.9, customers: 3750, churn: 2.4, target: 75, categories: [35, 18, 55] }
        },
        categories: {
            all: { scale: 1 },
            tech: { scale: 0.65, marginOffset: 3.5, customerScale: 0.45, churnOffset: -0.4, targetOffset: 6 },
            furniture: { scale: 0.22, marginOffset: -6.2, customerScale: 0.28, churnOffset: 0.8, targetOffset: -12 },
            office: { scale: 0.13, marginOffset: 1.8, customerScale: 0.27, churnOffset: -0.2, targetOffset: 2 }
        }
    };
    
    let activeRegion = "all";
    let activeCategory = "all";
    
    dashFilterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const filterType = btn.parentElement.getAttribute("data-filter-type");
            const filterVal = btn.getAttribute("data-val");
            
            btn.parentElement.querySelectorAll(".dash-filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            if (filterType === "region") {
                activeRegion = filterVal;
            } else if (filterType === "category") {
                activeCategory = filterVal;
            }
            playAudioHaptic('click');
            updateSandboxMetrics();
        });
    });

    function updateSandboxMetrics() {
        const baseRegion = dashboardDb.regions[activeRegion];
        const modifier = dashboardDb.categories[activeCategory];
        
        let revenueVal = baseRegion.revenue;
        let marginVal = baseRegion.margin;
        let customerVal = baseRegion.customers;
        let churnVal = baseRegion.churn;
        let targetVal = baseRegion.target;
        
        if (activeCategory !== "all") {
            revenueVal = Math.round(baseRegion.revenue * modifier.scale);
            marginVal = parseFloat((baseRegion.margin + modifier.marginOffset).toFixed(1));
            customerVal = Math.round(baseRegion.customers * modifier.customerScale);
            churnVal = parseFloat((baseRegion.churn + modifier.churnOffset).toFixed(1));
            targetVal = baseRegion.target + modifier.targetOffset;
        }
        
        animateKPIField(kpiRevenue, revenueVal, true);
        animateKPIField(kpiMargin, marginVal, false, "%");
        animateKPIField(kpiCustomers, customerVal, false);
        animateKPIField(kpiChurn, churnVal, false, "%");
        
        // Circular gauge dashoffset update
        if (gaugeFill && gaugePercentText) {
            gaugePercentText.textContent = `${targetVal}%`;
            // stroke-dasharray = 220. offset = 220 - (220 * percentage / 100)
            const strokeOffset = 220 - (220 * targetVal / 100);
            gaugeFill.style.strokeDashoffset = strokeOffset;
        }
        
        // Redraw SVG bars
        renderSVGBars(baseRegion);
        
        // Generate insights description
        if (dashDynamicInsight) {
            let infoText = `Aggregated statistics compiled for Region: <strong>${activeRegion.toUpperCase()}</strong> and Category: <strong>${activeCategory.toUpperCase()}</strong>. `;
            if (marginVal > 25) {
                infoText += `<span style="color: var(--accent-green);">Excellent operating margin of ${marginVal}% logs strong profitability indexes.</span>`;
            } else if (churnVal > 2.3) {
                infoText += `<span style="color: #ff5f56;">Customer churn is elevated at ${churnVal}%. Action retention triggers immediately.</span>`;
            } else {
                infoText += `Operations trace within normal target thresholds. Sales conversion pipeline tracks steady.`;
            }
            dashDynamicInsight.innerHTML = infoText;
        }
    }
    
    function animateKPIField(element, targetVal, isCurrency, suffix = "") {
        if (!element) return;
        const duration = 400; // ms
        const startTime = performance.now();
        const startVal = parseFloat(element.innerText.replace(/[^0-9.]/g, "")) || 0;
        
        const step = (timestamp) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = startVal + (targetVal - startVal) * easeOut;
            
            if (isCurrency) {
                element.innerText = `$${Math.round(current).toLocaleString()}`;
            } else {
                element.innerText = current.toFixed(suffix ? 1 : 0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }
    
    function renderSVGBars(regionData) {
        if (!svgBarChart) return;
        
        const categories = ["Tech Goods", "Furniture", "Supplies"];
        let dataValues = [...regionData.categories];
        
        if (activeCategory !== "all") {
            const catMap = { tech: 0, furniture: 1, office: 2 };
            const activeIdx = catMap[activeCategory];
            dataValues = [0, 0, 0];
            dataValues[activeIdx] = regionData.categories[activeIdx] * 1.1; // scale targeted category bar slightly
        }
        
        const maxVal = 130;
        let barHTML = "";
        
        dataValues.forEach((val, idx) => {
            const barHeight = (val / maxVal) * 110;
            const yPos = 130 - barHeight;
            const xPos = 40 + idx * 135;
            const textVal = val > 0 ? `$${Math.round(val * 1000).toLocaleString()}` : "$0";
            
            barHTML += `
                <g>
                    <rect class="chart-bar-rect" x="${xPos}" y="${yPos}" width="45" height="${barHeight}" rx="5" />
                    <text class="chart-val-text" x="${xPos + 22}" y="${yPos - 6}">${textVal}</text>
                    <text class="chart-text" x="${xPos + 22}" y="148" text-anchor="middle">${categories[idx]}</text>
                </g>
            `;
        });
        
        // Base axis line
        barHTML += `<line x1="20" y1="130" x2="420" y2="130" stroke="rgba(255,255,255,0.05)" stroke-width="1" />`;
        svgBarChart.innerHTML = barHTML;
    }
    
    // Ingest default sandbox states
    updateSandboxMetrics();

    // ================= ADVANCED MODAL CASE STUDIES HUB =================
    const caseStudies = {
        ecommerce: {
            title: "E-commerce Sales Analysis",
            desc: "This comprehensive E-commerce dashboard provides rich insights into total sales, profitability curves, customer order behaviors, and regional product sales. Built by ingestion from backend SQL schemas, optimized through DAX, and delivered as an interactive diagnostic tool, it enables stakeholders to track growth metrics and forecast future product performance.",
            impact: "Enabled marketing division to pivot budget allocations, leading to a 14% increase in sales conversion within regional channels. Streamlined inventory costs by 8% through seasonal forecasting filters.",
            tools: "Power BI Desktop, SQL Server, DAX Scripting, Excel Data Pivots",
            code: `-- SQL CTE to generate sales volume groups
WITH SalesSummary AS (
    SELECT 
        customer_id,
        SUM(sales_amount) AS total_spent,
        COUNT(order_id) AS total_orders
    FROM orders_dim
    GROUP BY customer_id
)
SELECT 
    CASE 
        WHEN total_spent > 1000 THEN 'VIP Tier'
        WHEN total_spent BETWEEN 500 AND 1000 THEN 'Gold Tier'
        ELSE 'Silver Tier'
    END AS customer_value_segment,
    COUNT(customer_id) AS user_count,
    ROUND(AVG(total_spent), 2) AS average_spend
FROM SalesSummary
GROUP BY customer_value_segment;`,
            kpis: [
                "Year-over-Year (YoY) Sales growth margin",
                "Customer Acquisition Cost (CAC) vs Customer Lifetime Value (CLV)",
                "Product category return rate metrics"
            ],
            dax: `// DAX formulation for Dynamic Cumulative Sales YTD
Cumulative YTD Sales = 
TOTALYTD(
    SUM('SalesTransaction'[sales_amount]), 
    'CalendarDim'[Date]
)`
        },
        excelStore: {
            title: "Store Sales Excel System",
            desc: "A high-fidelity business intelligence dashboard engineered entirely in Excel. Utilizing pivot tables, dynamic slicers, advanced nested formulas, and custom conditional formatting to track regional store revenues, profit metrics, and seasonal customer spending cycles.",
            impact: "Helped store operations managers monitor real-time stock-out risks across 14 locations. The dashboard automated weekly reports that previously took 4 hours of manual labor down to 10 seconds of clicking refresh.",
            tools: "Excel Advanced, Pivot Tables, Dynamic Formatting, VLOOKUP & INDEX-MATCH",
            code: `=IFERROR(
    INDEX(InventoryRange, 
        MATCH(1, (Stores[StoreID]=B2) * (Stores[ProductKey]=C2), 0), 
        4
    ), 
    "Out of Stock"
)`,
            kpis: [
                "Stock Turnover Ratio by product SKU",
                "Basket size value per customer transaction",
                "Average profit margins per regional store block"
            ],
            dax: `=SUMPRODUCT(
    (StoreSales[Revenue] - StoreSales[Cost]) / StoreSales[Revenue]
) / COUNTA(StoreSales[TransactionID])`
        },
        ecommerceSalesAnalytics: {
            title: "E-Commerce Sales Analytics Dashboard",
            desc: "An end-to-end data analytics solution built using MySQL and Power BI to analyze e-commerce business performance. The project includes structured database design, advanced SQL queries (JOINs, CASE, CTEs, Window Functions), and an interactive Power BI dashboard. It provides insights into revenue trends, customer segmentation, product performance, and sales distribution across cities and payment methods.",
            impact: "Delivered actionable reports mapping customer demographics, causing the logistics team to expand delivery fleets in 3 key hot-spot cities. Consolidated transactional payment gateways, decreasing failed gateway ratios by 12%.",
            tools: "MySQL Server, Power BI, DAX Measures, Relational Data Modeling",
            code: `-- SQL Window function tracking running cumulative profit
SELECT 
    order_date,
    payment_method,
    daily_revenue,
    SUM(daily_revenue) OVER(
        PARTITION BY payment_method 
        ORDER BY order_date
    ) AS running_cumulative_revenue
FROM (
    SELECT 
        CAST(order_timestamp AS DATE) AS order_date,
        payment_gateway AS payment_method,
        SUM(final_amount) AS daily_revenue
    FROM transaction_ledger
    GROUP BY CAST(order_timestamp AS DATE), payment_gateway
) AS daily_ledger;`,
            kpis: [
                "Customer Payment Gateway Conversion Rate",
                "Cumulative Daily/Weekly Sales aggregates",
                "Failed Transaction Rate per Payment Channel"
            ],
            dax: `// DAX formula calculating Customer Purchase Frequency
Customer Purchase Frequency = 
DIVIDE(
    COUNT('SalesFact'[OrderID]), 
    DISTINCTCOUNT('SalesFact'[CustomerID])
)`
        },
        customerChurn: {
            title: "Customer Churn Classifier",
            desc: "An end-to-end Python Data Analytics and Machine Learning project that predicts customer churn using real-world telecom data. The system performs data cleaning (including TotalCharges fixing), exploratory data analysis (EDA), feature engineering, and builds a Logistic Regression model to identify customers likely to leave. The final model is deployed as an interactive Streamlit web application providing real-time churn predictions.",
            impact: "Created proactive outreach targeting flags for customer service agents. Early trials proved a 15% drop in subscriber attrition by offering retention coupons to high-risk customers.",
            tools: "Python (Pandas, Numpy), Scikit-Learn Machine Learning, Streamlit Web Server",
            code: `# Python Pipeline for telecom churn EDA and prediction
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

# Load and clean dataset
df = pd.read_csv('telecom_churn.csv')
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
df.dropna(inplace=True)

# Feature selection & splitting
X = df[['tenure', 'MonthlyCharges', 'TotalCharges']]
y = df['Churn'].apply(lambda x: 1 if x == 'Yes' else 0)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Fit Logistic Regression Model
model = LogisticRegression()
model.fit(X_train, y_train)
print(f"Model Training accuracy score: {model.score(X_test, y_test):.2%}")`,
            kpis: [
                "Receiver Operating Characteristic (ROC) AUC score",
                "Precision-Recall tradeoffs in churn classifiers",
                "Monthly Subscriber Attrition Ratio"
            ],
            dax: `// Python snippet predicting churn probability in Streamlit app
churn_probability = model.predict_proba(features_input_df)[0][1]
st.write(f"Churn Risk Probability: {churn_probability:.2%}")`
        },
        hrAnalytics: {
            title: "HR Analytics Dashboard",
            desc: "An interactive HR diagnostic tool mapping operational employee metrics. It provides real-time tracking of retention curves, demographic distribution, attrition factors, salary spreads, and individual department performances, empowering executives to make objective HR decisions.",
            impact: "Isolated key drivers of employee exit (low promotion frequency combined with mid-level tenure). Human Resource directors adjusted review processes, cutting attrition in tech departments by 9%.",
            tools: "Power BI, SQL, DAX, Power Query",
            code: `-- SQL Query to isolate high-risk tenure attrition
SELECT 
    department,
    job_role,
    AVG(years_at_company) AS average_tenure,
    COUNT(employee_id) AS total_leaving
FROM employee_roster
WHERE attrition = 'Yes' 
  AND years_since_last_promotion > 3
GROUP BY department, job_role;`,
            kpis: [
                "Employee Attrition Rate per department tier",
                "Average employee satisfaction index scores",
                "Salary equity spreads across genders and roles"
            ],
            dax: `// DAX formula for Employee Attrition Rate
Attrition Rate = 
DIVIDE(
    CALCULATE(COUNT(Employee[ID]), Employee[Status] = "Left"), 
    COUNT(Employee[ID])
)`
        },
        superStore: {
            title: "Super Store Sales Dashboard",
            desc: "A high-fidelity sales operations dashboard leveraging DAX algorithms to forecast trends, map operational product categories, audit supplier performance, and represent key regional margins with drill-down interactions.",
            impact: "Optimized logistics routes and warehouse loading targets. Supply chain managers shifted vendor pools, resulting in a 5% drop in product shipping delays.",
            tools: "Power BI, DAX Measures, Power Query Editor",
            code: `// DAX formula calculating moving monthly sales averages
Sales Moving Avg 3M = 
AVERAGEX(
    DATESINPERIOD(
        'CalendarDim'[Date],
        LASTDATE('CalendarDim'[Date]),
        -3,
        MONTH
    ),
    [Total Sales Amount]
)`,
            kpis: [
                "Moving Average Sales performance curves",
                "Order fulfillment lead time averages",
                "Regional profit margins per product category"
            ],
            dax: `// DAX calculation for product profit margins
Product Profit Margin % = 
DIVIDE(
    [Total Sales Amount] - [Total Product Costs], 
    [Total Sales Amount]
)`
        },
        hrOperational: {
            title: "HR Headcount Dashboard",
            desc: "Frosted, easy-to-use executive tracking dashboard built in Power BI to monitor employee statuses, hiring cohorts, active metrics, and internal job roles.",
            impact: "Automated standard headcount queries for executive board meetings, saving HR analysts 12 hours of presentation assembly time monthly.",
            tools: "Power BI, Excel Data Models, Power Query ETL",
            code: `// DAX Headcount calculation at selected date filter
Active Headcount = 
CALCULATE(
    COUNT('EmployeeRoster'[EmployeeID]),
    FILTER(
        'EmployeeRoster',
        'EmployeeRoster'[HireDate] <= MAX('Calendar'[Date]) &&
        (ISBLANK('EmployeeRoster'[TerminationDate]) || 'EmployeeRoster'[TerminationDate] > MAX('Calendar'[Date]))
    )
)`,
            kpis: [
                "Active staff headcount statistics",
                "Departmental gender representation percentages",
                "Average age demographics of hiring cohorts"
            ],
            dax: `// DAX calculation for monthly hiring counts
Hires This Month = 
CALCULATE(
    COUNT('EmployeeRoster'[EmployeeID]),
    USERELATIONSHIP('EmployeeRoster'[HireDate], 'Calendar'[Date])
)`
        },
        supplyChain: {
            title: "Supply Chain & Logistics Dashboard",
            desc: "A supply chain dashboard tracking inventory levels, vendor performance scores, shipping delays, and logistics cost optimization paths for high-volume retail environments.",
            impact: "Highlighted vendor bottlenecks and lead time delays, prompting the vendor management team to establish strict supplier SLAs and reduce late shipments by 18%.",
            tools: "Power BI, Excel Pivot Tables, SQL Querying",
            code: `-- SQL grouping late shipments by shipping mode
SELECT 
    ship_mode,
    COUNT(order_id) AS total_orders,
    SUM(CASE WHEN ship_date > scheduled_ship_date THEN 1 ELSE 0 END) AS late_orders,
    ROUND((SUM(CASE WHEN ship_date > scheduled_ship_date THEN 1.0 ELSE 0.0 END) / COUNT(order_id)) * 100, 2) AS delay_ratio
FROM logistics_ledger
GROUP BY ship_mode;`,
            kpis: [
                "Late Shipment Delay Ratio percentage",
                "On-Time In-Full (OTIF) vendor delivery scores",
                "Average Inventory holding costs per SKU"
            ],
            dax: `// DAX formula calculating On-Time delivery scores
On-Time Delivery % = 
DIVIDE(
    CALCULATE(COUNT(Logistics[OrderID]), Logistics[DeliveryStatus] = "On-Time"), 
    COUNT(Logistics[OrderID])
)`
        },
        socialImpact: {
            title: "Breaking The Silence Social Report",
            desc: "This high-impact dashboard raises awareness of key patterns, regional risk indicators, and temporal trends in violence statistics. Empowered with interactive geographic mapping and category sliders, it provides a clean, visual representation of social datasets.",
            impact: "Assisted non-profit groups in identifying high-vulnerability demographic sectors, aiding in localized support center resource deployment planning.",
            tools: "Power BI Desktop, GIS Mapping, Social Data Repositories",
            code: `// DAX formula tracking density statistics
Incident Ratio Per 100k = 
DIVIDE(
    [Total Incident Count],
    SUM('Demographics'[Population])
) * 100000`,
            kpis: [
                "Incident density rates per 100k population",
                "Incident counts per region category",
                "Temporal incident growth metrics over years"
            ],
            dax: `// DAX calculation for cumulative incident trends
Cumulative Incident Volume = 
CALCULATE(
    [Total Incident Count],
    FILTER(
        ALLSELECTED('Calendar'),
        'Calendar'[Date] <= MAX('Calendar'[Date])
    )
)`
        },
        aiRisk: {
            title: "AI Market Disruption Dashboard",
            desc: "A futuristic predictive index dashboard plotting automation scores across industries, aligning job roles against specific AI technical demands, and showing high-risk vs safe careers in upcoming decades.",
            impact: "Served as a guidance model for career reskilling planning programs in technical universities, mapping vulnerability trends in different administrative roles.",
            tools: "Power BI, Advanced DAX, Excel Predictive Modelling",
            code: `// DAX formula combining skills metrics to automation risk
Composite Automation Risk Score = 
AVERAGEX(
    'IndustryJobModel',
    ('IndustryJobModel'[AI_Capability_Overlap] * 0.6) + ('IndustryJobModel'[Routine_Task_Ratio] * 0.4)
)`,
            kpis: [
                "Composite Automation Vulnerability Risk Score",
                "AI capability overlap indices in job roles",
                "Routine task ratio scores per industry sector"
            ],
            dax: `// DAX formula for Safe Careers Index
Safe Career Flag = 
IF(
    [Composite Automation Risk Score] < 0.35,
    "Resilient Career",
    "High Vulnerability Risk"
)`
        },
        foodDelivery: {
            title: "Food Delivery Logistics Dashboard",
            desc: "An operational Power BI dashboard analyzing food delivery transaction metrics. It maps delivery time trends, fleet efficiencies, order cancellation ratios, customer satisfaction scores, and revenue margins by zone.",
            impact: "Isolated operational delays in specific restaurant pick-up zones, leading managers to adjust dispatch timings and cut overall delivery times by 4.2 minutes.",
            tools: "Power BI Desktop, DAX, Power Query Editor, Excel Data Ingestion",
            code: `// DAX calculation for customer satisfaction index averages
Avg CSAT Score = 
CALCULATE(
    AVERAGE('DeliveryFact'[CSAT_Score]),
    'DeliveryFact'[CSAT_Score] > 0
)`,
            kpis: [
                "Average Food Delivery Time in minutes",
                "Customer Satisfaction index (CSAT) trends",
                "Order Cancellation ratio per logistics zone"
            ],
            dax: `// DAX calculation for Late Delivery Ratio
Late Delivery Ratio % = 
DIVIDE(
    CALCULATE(COUNT('DeliveryFact'[OrderID]), 'DeliveryFact'[DeliveryTimeDiff] > 0), 
    COUNT('DeliveryFact'[OrderID])
)`
        }
    };
    
    // Tab Toggles inside modal
    const modalTabBtns = document.querySelectorAll(".modal-tab-btn");
    const modalTabPanes = document.querySelectorAll(".modal-tab-pane");
    
    modalTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            modalTabBtns.forEach(b => b.classList.remove("active"));
            modalTabPanes.forEach(p => p.classList.remove("active"));
            
            btn.classList.add("active");
            const targetTab = btn.getAttribute("data-modal-tab");
            const targetPane = document.getElementById(`modal-tab-${targetTab}`);
            if (targetPane) {
                targetPane.classList.add("active");
            }
            playAudioHaptic('click');
        });
    });

    window.openCaseStudyModal = function(projectId) {
        const study = caseStudies[projectId];
        if (!study) return;
        
        // Reset modal tabs to Overview
        modalTabBtns.forEach(b => b.classList.remove("active"));
        modalTabPanes.forEach(p => p.classList.remove("active"));
        document.querySelector('.modal-tab-btn[data-modal-tab="overview"]').classList.add("active");
        document.getElementById("modal-tab-overview").classList.add("active");
        
        // Populate metadata
        document.getElementById("m-title").innerText = study.title;
        document.getElementById("m-desc").innerText = study.desc;
        document.getElementById("m-impact").innerText = study.impact;
        document.getElementById("m-tools").innerText = study.tools;
        document.getElementById("m-code").innerText = study.code;
        document.getElementById("m-dax").innerText = study.dax;
        
        // Bullets
        const kpiContainer = document.getElementById("m-kpis");
        if (kpiContainer) {
            kpiContainer.innerHTML = "";
            study.kpis.forEach(bullet => {
                kpiContainer.innerHTML += `<li>${bullet}</li>`;
            });
        }
        
        // Dynamic Github paths
        const mLink = document.getElementById("m-link");
        if (mLink) {
            let link = "https://github.com/areesha797/";
            if (projectId === "ecommerce") link += "Analyzed-E-commerce-Sales-Data";
            else if (projectId === "ecommerceSalesAnalytics") link += "E-Commerce-Sales-Analytics";
            else if (projectId === "hrAnalytics") link += "HR-Analytics-Dashboard";
            else if (projectId === "superStore") link += "Power-BI-Sales-Dashboard";
            else if (projectId === "hrOperational") link += "HR-Dashboard";
            else if (projectId === "supplyChain") link += "Supply-Chain-Logistics-Dashboard";
            else if (projectId === "socialImpact") link += "Breaking-the-Silence-Violence-Against-Women";
            else if (projectId === "aiRisk") link += "AI-Skills-VS-Job-Risk-Dashboard";
            mLink.href = link;
        }
        
        const modal = document.getElementById("modal");
        if (modal) {
            modal.classList.add("active");
            modal.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
        }
        playAudioHaptic('click');
        window.updateCursorHovers();
    };

    window.closeModal = function() {
        const modal = document.getElementById("modal");
        if (modal) {
            modal.classList.remove("active");
            modal.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
        }
        playAudioHaptic('click');
    };

    window.addEventListener("click", (e) => {
        const modal = document.getElementById("modal");
        if (e.target === modal) window.closeModal();
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") window.closeModal();
    });

    // ================= SOUND & SYNTH ENGINE =================
    const soundToggle = document.getElementById("soundToggle");
    let isSoundOn = localStorage.getItem("portfolioSound") === "true";
    let audioCtx = null;
    
    if (soundToggle) {
        // Render initial state
        if (isSoundOn) {
            soundToggle.classList.add("active");
            soundToggle.innerHTML = `<i class="fas fa-volume-up"></i>`;
        } else {
            soundToggle.classList.remove("active");
            soundToggle.innerHTML = `<i class="fas fa-volume-mute"></i>`;
        }
        
        soundToggle.addEventListener("click", () => {
            isSoundOn = !isSoundOn;
            localStorage.setItem("portfolioSound", isSoundOn);
            
            if (isSoundOn) {
                soundToggle.classList.add("active");
                soundToggle.innerHTML = `<i class="fas fa-volume-up"></i>`;
                if (!audioCtx) {
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                }
                playAudioHaptic('click');
            } else {
                soundToggle.classList.remove("active");
                soundToggle.innerHTML = `<i class="fas fa-volume-mute"></i>`;
            }
        });
    }

    function playAudioHaptic(type) {
        if (!isSoundOn) return;
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            
            const time = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            if (type === 'hover') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1200, time);
                gainNode.gain.setValueAtTime(0.01, time);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 0.03);
                osc.start(time);
                osc.stop(time + 0.04);
            } else if (type === 'click') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(700, time);
                osc.frequency.exponentialRampToValueAtTime(120, time + 0.1);
                gainNode.gain.setValueAtTime(0.05, time);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);
                osc.start(time);
                osc.stop(time + 0.14);
            }
        } catch (err) {
            console.warn("Audio Context failed:", err);
        }
    }

    const attachHaptics = () => {
        const triggers = document.querySelectorAll(
            "a, button, .project-card, .filter-btn, .git-commit-point, .sandbox-tab-btn, .sql-opt-btn, .dash-filter-btn, .term-tab"
        );
        triggers.forEach(item => {
            item.removeEventListener("mouseenter", handleHover);
            item.removeEventListener("click", handleClick);
            
            item.addEventListener("mouseenter", handleHover);
            item.addEventListener("click", handleClick);
        });
    };
    
    const handleHover = () => playAudioHaptic('hover');
    const handleClick = () => playAudioHaptic('click');
    
    attachHaptics();
    window.updateAudioHaptics = attachHaptics;

    // ================= INTERSECTION OBSERVER FOR SCROLL REVEALS =================
    const reveals = document.querySelectorAll(".scroll-reveal");
    if (reveals.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "none";
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05 });
        
        reveals.forEach(el => {
            el.style.opacity = "0";
            const origin = el.getAttribute("data-origin") || "bottom";
            if (origin === "left") el.style.transform = "translateX(-30px)";
            else if (origin === "right") el.style.transform = "translateX(30px)";
            else el.style.transform = "translateY(30px)";
            
            el.style.transition = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
            
            revealObserver.observe(el);
        });
    }

});
