class ParticleSystem {
  constructor(canvas, config = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.config = {
      count: config.count || 50,
      speed: config.speed || 1,
      color: config.color || '#ffffff',
      opacity: config.opacity || 0.5,
      ...config
    };
    this.active = false;
    this.opacity = 0;
    this.animationId = null;
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawn(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * this.config.speed,
      vy: (Math.random() - 0.5) * this.config.speed,
      size: Math.random() * 3 + 1,
      alpha: Math.random() * this.config.opacity
    };
  }

  update() {
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = this.opacity;
    
    this.particles.forEach(p => {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.config.color;
      this.ctx.fill();
    });
    
    this.ctx.globalAlpha = 1;
  }

  fadeIn(duration = 1000) {
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      this.opacity = Math.min(elapsed / duration, 1);
      if (this.opacity < 1) {
        this.animationId = requestAnimationFrame(animate);
      } else {
        this.active = true;
        this.start();
      }
    };
    if (this.animationId) cancelAnimationFrame(this.animationId);
    requestAnimationFrame(animate);
  }

  fadeOut(duration = 600) {
    const start = performance.now();
    const initialOpacity = this.opacity;
    
    const animate = (now) => {
      const elapsed = now - start;
      this.opacity = initialOpacity * (1 - Math.min(elapsed / duration, 1));
      if (this.opacity > 0) {
        this.animationId = requestAnimationFrame(animate);
      } else {
        this.active = false;
        this.stop();
      }
    };
    if (this.animationId) cancelAnimationFrame(this.animationId);
    requestAnimationFrame(animate);
  }

  start() {
    if (this.active) return;
    this.active = true;
    this.spawn(this.config.count);
    this.animate();
  }

  stop() {
    this.active = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  animate() {
    if (!this.active) return;
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.stop();
    this.particles = [];
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ParticleSystem;
}