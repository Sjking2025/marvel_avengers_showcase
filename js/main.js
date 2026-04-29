(function() {
  'use strict';

  class MarvelShowcase {
    constructor() {
      this.scrollEngine = null;
      this.navigation = null;
      this.particleSystems = new Map();
      this.currentParticle = null;
      this.heroMap = {
        'iron-man': 'techGrid',
        'thor': 'lightning',
        'spider-man': 'cityRain',
        'black-panther': 'vibranium',
        'captain-america': 'starField'
      };
      
      this.init();
    }

    init() {
      this.initScrollEngine();
      this.initNavigation();
      this.initParticles();
      this.initCursor();
      this.initHeroReveal();
      this.initEventListeners();
      
      this.setActiveHero(0);
    }

    initScrollEngine() {
      if (typeof ScrollEngine === 'function') {
        this.scrollEngine = new ScrollEngine();
      }
    }

    initNavigation() {
      if (typeof NavigationDock === 'function') {
        this.navigation = new NavigationDock();
      }
    }

    initParticles() {
      const canvases = document.querySelectorAll('.particle-canvas');
      
      canvases.forEach(canvas => {
        const type = canvas.dataset.particleType;
        let particleSystem = null;
        
        switch(type) {
          case 'techGrid':
            if (typeof IronManParticles === 'function') {
              particleSystem = new IronManParticles(canvas);
            }
            break;
          case 'lightning':
            if (typeof ThorParticles === 'function') {
              particleSystem = new ThorParticles(canvas);
            }
            break;
          case 'cityRain':
            if (typeof SpiderManParticles === 'function') {
              particleSystem = new SpiderManParticles(canvas);
            }
            break;
          case 'vibranium':
            if (typeof BlackPantherParticles === 'function') {
              particleSystem = new BlackPantherParticles(canvas);
            }
            break;
          case 'starField':
            if (typeof CaptainAmericaParticles === 'function') {
              particleSystem = new CaptainAmericaParticles(canvas);
            }
            break;
        }
        
        if (particleSystem) {
          this.particleSystems.set(type, particleSystem);
        }
      });
    }

    initCursor() {
      const cursor = document.querySelector('.custom-cursor');
      if (!cursor) return;

      document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      });

      document.querySelectorAll('a, button, .hero-name').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
      });
    }

    initHeroReveal() {
      if (typeof gsap !== 'undefined' && gsap.ScrollTrigger) {
        gsap.registerPlugin(gsap.ScrollTrigger);
        
        const chapters = document.querySelectorAll('.hero-chapter');
        
        chapters.forEach((chapter, index) => {
          const elements = {
            name: chapter.querySelector('.hero-name'),
            realname: chapter.querySelector('.hero-realname'),
            tagline: chapter.querySelector('.hero-tagline'),
            visual: chapter.querySelector('.hero-visual'),
            description: chapter.querySelector('.hero-description'),
            abilities: chapter.querySelector('.abilities-grid'),
            badges: chapter.querySelectorAll('.ability-badge'),
            statBars: chapter.querySelectorAll('.stat-bar')
          };
          
          if (elements.name) {
            gsap.fromTo(elements.name, 
              { y: 60, opacity: 0 },
              { 
                y: 0, 
                opacity: 1, 
                duration: 1, 
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: chapter,
                  start: 'top 70%',
                  toggleActions: 'play none none reverse'
                }
              }
            );
          }
          
          if (elements.realname) {
            gsap.fromTo(elements.realname, 
              { y: 30, opacity: 0 },
              { 
                y: 0, 
                opacity: 1, 
                duration: 0.8, 
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: chapter,
                  start: 'top 70%',
                  toggleActions: 'play none none reverse'
                }
              }
            );
          }
          
          if (elements.tagline) {
            gsap.fromTo(elements.tagline, 
              { y: 30, opacity: 0 },
              { 
                y: 0, 
                opacity: 1, 
                duration: 0.8, 
                delay: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: chapter,
                  start: 'top 70%',
                  toggleActions: 'play none none reverse'
                }
              }
            );
          }
          
          if (elements.visual) {
            gsap.fromTo(elements.visual, 
              { y: 80, opacity: 0, scale: 0.9 },
              { 
                y: 0, 
                opacity: 1, 
                scale: 1,
                duration: 1, 
                delay: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: chapter,
                  start: 'top 70%',
                  toggleActions: 'play none none reverse'
                }
              }
            );
          }
          
          if (elements.description) {
            gsap.fromTo(elements.description, 
              { y: 40, opacity: 0 },
              { 
                y: 0, 
                opacity: 1, 
                duration: 0.8, 
                delay: 0.3,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: chapter,
                  start: 'top 70%',
                  toggleActions: 'play none none reverse'
                }
              }
            );
          }
          
          if (elements.badges && elements.badges.length > 0) {
            gsap.fromTo(elements.badges, 
              { y: 30, opacity: 0 },
              { 
                y: 0, 
                opacity: 1, 
                duration: 0.6, 
                stagger: 0.1,
                delay: 0.4,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: chapter,
                  start: 'top 70%',
                  toggleActions: 'play none none reverse'
                }
              }
            );
          }
          
          if (elements.statBars && elements.statBars.length > 0) {
            elements.statBars.forEach(bar => {
              const value = bar.style.getPropertyValue('--stat-value');
              if (value) {
                gsap.fromTo(bar, 
                  { width: '0%' },
                  { 
                    width: value, 
                    duration: 1.2, 
                    delay: 0.5,
                    ease: 'power3.out',
                    scrollTrigger: {
                      trigger: chapter,
                      start: 'top 70%',
                      toggleActions: 'play none none reverse'
                    }
                  }
                );
              }
            });
          }
        });
      }
    }

    initEventListeners() {
      window.addEventListener('navigateToHero', (e) => {
        this.scrollToHero(e.detail.index);
      });

      window.addEventListener('heroChange', (e) => {
        this.transitionParticles(e.detail.index);
      });
    }

    setActiveHero(index) {
      const chapters = document.querySelectorAll('.hero-chapter');
      
      chapters.forEach((chapter, i) => {
        if (i === index) {
          chapter.classList.add('active');
          const canvas = chapter.querySelector('.particle-canvas');
          if (canvas) {
            const type = canvas.dataset.particleType;
            this.playParticles(type);
          }
        } else {
          chapter.classList.remove('active');
        }
      });
    }

    scrollToHero(index) {
      if (this.scrollEngine && typeof this.scrollEngine.scrollToHero === 'function') {
        this.scrollEngine.scrollToHero(index);
      } else {
        const chapterHeight = window.innerHeight;
        window.scrollTo({
          top: index * chapterHeight,
          behavior: 'smooth'
        });
      }
      this.setActiveHero(index);
    }

    transitionParticles(index) {
      const chapters = document.querySelectorAll('.hero-chapter');
      
      chapters.forEach((chapter, i) => {
        if (i === index) {
          chapter.classList.add('active');
          const canvas = chapter.querySelector('.particle-canvas');
          if (canvas) {
            const type = canvas.dataset.particleType;
            this.playParticles(type);
          }
        } else {
          chapter.classList.remove('active');
        }
      });
    }

    playParticles(type) {
      if (this.currentParticle) {
        const current = this.particleSystems.get(this.currentParticle);
        if (current && current.fadeOut) {
          current.fadeOut();
        }
      }

      if (this.particleSystems.has(type)) {
        const system = this.particleSystems.get(type);
        if (system) {
          if (system.fadeIn) {
            system.fadeIn();
          }
          this.currentParticle = type;
        }
      }
    }

    destroy() {
      this.particleSystems.forEach(system => {
        if (system.destroy) {
          system.destroy();
        }
      });
      this.particleSystems.clear();
      
      if (this.scrollEngine && this.scrollEngine.destroy) {
        this.scrollEngine.destroy();
      }
      
      if (this.navigation && this.navigation.destroy) {
        this.navigation.destroy();
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    window.marvelShowcase = new MarvelShowcase();
  });
})();