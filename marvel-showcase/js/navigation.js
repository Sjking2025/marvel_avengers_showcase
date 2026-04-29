class NavigationDock {
  constructor() {
    this.dock = null;
    this.items = [];
    this.activeHero = 0;
    this.heroMap = {
      'iron-man': 0,
      'thor': 1,
      'spider-man': 2,
      'black-panther': 3,
      'captain-america': 4
    };
    
    this.init();
  }

  init() {
    this.dock = document.querySelector('.navigation-dock');
    if (!this.dock) return;

    this.items = this.dock.querySelectorAll('.dock-item');
    
    this.items.forEach((item, index) => {
      item.addEventListener('click', () => this.onItemClick(index));
      item.addEventListener('keydown', (e) => this.onKeyDown(e, index));
      item.addEventListener('mouseenter', () => this.onHover(index));
      item.addEventListener('mouseleave', () => this.onLeave(index));
    });

    window.addEventListener('heroChange', (e) => this.onHeroChange(e));
    
    this.setActive(0);
  }

  onItemClick(index) {
    const event = new CustomEvent('navigateToHero', { 
      detail: { index } 
    });
    window.dispatchEvent(event);
  }

  onKeyDown(e, index) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.onItemClick(index);
    }
  }

  onHover(index) {
    this.items[index].classList.add('hovering');
    this.updateCursor(true);
  }

  onLeave(index) {
    this.items[index].classList.remove('hovering');
    this.updateCursor(false);
  }

  onHeroChange(e) {
    this.setActive(e.detail.index);
  }

  setActive(index) {
    this.activeHero = index;
    
    this.items.forEach((item, i) => {
      if (i === index) {
        item.classList.add('active');
        item.setAttribute('aria-current', 'true');
      } else {
        item.classList.remove('active');
        item.removeAttribute('aria-current');
      }
    });

    this.updateHeroAccent(index);
  }

  updateHeroAccent(index) {
    const heroChapters = document.querySelectorAll('.hero-chapter');
    heroChapters.forEach((chapter, i) => {
      if (i === index) {
        const accentColor = chapter.style.getPropertyValue('--hero-accent') || '#e74c3c';
        this.dock.style.setProperty('--hero-accent', accentColor);
      }
    });
  }

  updateCursor(isHovering) {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
      if (isHovering) {
        cursor.classList.add('hovering');
      } else {
        cursor.classList.remove('hovering');
      }
    }
  }

  getActiveIndex() {
    return this.activeHero;
  }

  destroy() {
    this.items.forEach(item => {
      item.removeEventListener('click', this.onItemClick);
      item.removeEventListener('mouseenter', this.onHover);
      item.removeEventListener('mouseleave', this.onLeave);
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = NavigationDock;
}