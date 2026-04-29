class ScrollEngine {
  constructor() {
    this.current = 0;
    this.target = 0;
    this.velocity = 0;
    this.ease = 0.08;
    this.chapters = [];
    this.activeHero = 0;
    this.locked = false;
    this.scrollContainer = null;
    this.maxScroll = 0;
    this.rafId = null;
    
    this.init();
  }

  init() {
    this.scrollContainer = document.querySelector('.scroll-container');
    if (!this.scrollContainer) return;

    this.chapters = document.querySelectorAll('.hero-chapter');
    if (this.chapters.length === 0) return;

    const chapterHeight = window.innerHeight;
    this.maxScroll = (this.chapters.length - 1) * chapterHeight;

    window.addEventListener('wheel', (e) => this.onWheel(e), { passive: false });
    window.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
    window.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
    window.addEventListener('resize', () => this.onResize());

    this.setupScrollTrigger();
    this.tick();
  }

  onWheel(e) {
    e.preventDefault();
    this.target += e.deltaY * 0.8;
    this.target = Math.max(0, Math.min(this.target, this.maxScroll));
  }

  onTouchStart(e) {
    this.touchStartY = e.touches[0].clientY;
    this.touchStartX = e.touches[0].clientX;
  }

  onTouchMove(e) {
    const deltaY = this.touchStartY - e.touches[0].clientY;
    this.target += deltaY * 0.5;
    this.target = Math.max(0, Math.min(this.target, this.maxScroll));
    this.touchStartY = e.touches[0].clientY;
  }

  onResize() {
    const chapterHeight = window.innerHeight;
    this.maxScroll = (this.chapters.length - 1) * chapterHeight;
  }

  setupScrollTrigger() {
    if (typeof gsap !== 'undefined' && gsap.ScrollTrigger) {
      gsap.registerPlugin(gsap.ScrollTrigger);
      
      this.chapters.forEach((chapter, index) => {
        gsap.to(chapter, {
          scrollTrigger: {
            trigger: chapter,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => this.setActiveHero(index),
            onEnterBack: () => this.setActiveHero(index)
          }
        });
      });
    }
  }

  setActiveHero(index) {
    if (this.activeHero === index) return;
    
    this.chapters.forEach((chapter, i) => {
      if (i === index) {
        chapter.classList.add('active');
      } else {
        chapter.classList.remove('active');
      }
    });

    this.activeHero = index;
    
    const event = new CustomEvent('heroChange', { detail: { index } });
    window.dispatchEvent(event);
  }

  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  tick() {
    this.current = this.lerp(this.current, this.target, this.ease);
    this.velocity = this.target - this.current;

    if (this.scrollContainer) {
      this.scrollContainer.style.transform = `translateY(-${this.current}px)`;
    }

    if (Math.abs(this.velocity) < 0.5 && !this.locked) {
      this.snapToNearest();
    }

    this.updateScrollProgress();
    this.rafId = requestAnimationFrame(() => this.tick());
  }

  snapToNearest() {
    const chapterHeight = window.innerHeight;
    const nearest = Math.round(this.target / chapterHeight);
    
    if (nearest !== this.activeHero && nearest >= 0 && nearest < this.chapters.length) {
      this.transitionToHero(nearest);
    }
  }

  transitionToHero(index) {
    this.locked = true;
    this.activeHero = index;

    const chapterHeight = window.innerHeight;
    const targetScroll = index * chapterHeight;

    if (typeof gsap !== 'undefined') {
      gsap.to(this, {
        target: targetScroll,
        duration: 1.2,
        ease: 'expo.inOut',
        onUpdate: () => {
          this.current = this.target;
          if (this.scrollContainer) {
            this.scrollContainer.style.transform = `translateY(-${this.current}px)`;
          }
        },
        onComplete: () => {
          this.locked = false;
        }
      });
    } else {
      this.target = targetScroll;
      this.locked = false;
    }

    this.setActiveHero(index);
  }

  updateScrollProgress() {
    const progress = this.current / this.maxScroll * 100;
    this.chapters.forEach((chapter, index) => {
      const chapterProgress = chapter.querySelector('.scroll-progress');
      if (chapterProgress && index === this.activeHero) {
        const chapterStart = index * window.innerHeight;
        const chapterEnd = (index + 1) * window.innerHeight;
        const chapterProgressVal = (this.current - chapterStart) / (chapterEnd - chapterStart) * 100;
        chapterProgress.style.width = `${Math.max(0, Math.min(100, chapterProgressVal))}%`;
      }
    });
  }

  scrollToHero(index) {
    if (index >= 0 && index < this.chapters.length) {
      this.transitionToHero(index);
    }
  }

  getActiveHero() {
    return this.activeHero;
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScrollEngine;
}