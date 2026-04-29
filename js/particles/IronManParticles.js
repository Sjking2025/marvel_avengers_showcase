class IronManParticles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.sparks = [];
    this.grids = [];
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

  spawn() {
    this.particles = [];
    this.sparks = [];
    this.grids = [];
    
    const gridSize = 60;
    for (let x = 0; x < this.canvas.width + gridSize; x += gridSize) {
      for (let y = 0; y < this.canvas.height + gridSize; y += gridSize) {
        this.grids.push({
          x, y,
          size: gridSize,
          alpha: Math.random() * 0.1 + 0.02
        });
      }
    }
    
    for (let i = 0; i < 30; i++) {
      this.particles.push(this.createParticle());
    }
    
    setInterval(() => {
      if (this.active && Math.random() > 0.7) {
        this.sparks.push(this.createSpark());
      }
    }, 100);
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.3 + 0.1,
      hue: Math.random() > 0.5 ? 0xe74c3c : 0xf39c12
    };
  }

  createSpark() {
    const x = Math.random() * this.canvas.width;
    const y = Math.random() * this.canvas.height;
    return {
      x, y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      size: Math.random() * 3 + 2,
      alpha: 1,
      life: 1,
      decay: Math.random() * 0.03 + 0.02
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
    
    this.sparks = this.sparks.filter(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;
      s.vy += 0.2;
      return s.life > 0;
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = this.opacity;
    
    this.ctx.strokeStyle = '#e74c3c';
    this.ctx.lineWidth = 1;
    this.grids.forEach(g => {
      this.ctx.globalAlpha = this.opacity * g.alpha;
      this.ctx.beginPath();
      this.ctx.moveTo(g.x, g.y);
      this.ctx.lineTo(g.x + g.size, g.y);
      this.ctx.moveTo(g.x, g.y);
      this.ctx.lineTo(g.x, g.y + g.size);
      this.ctx.stroke();
    });
    
    this.particles.forEach(p => {
      this.ctx.globalAlpha = this.opacity * p.alpha;
      this.ctx.fillStyle = p.hue === 0xe74c3c ? '#e74c3c' : '#f39c12';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    this.sparks.forEach(s => {
      this.ctx.globalAlpha = this.opacity * s.alpha * s.life;
      this.ctx.fillStyle = '#f39c12';
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(s.x - s.vx * 2, s.y - s.vy * 2);
      this.ctx.strokeStyle = '#e74c3c';
      this.ctx.stroke();
    });
    
    this.ctx.globalAlpha = 1;
  }

  fadeIn(duration = 1000) {
    const start = performance.now();
    const animate = (now) => {
      this.opacity = Math.min((now - start) / duration, 1);
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
      this.opacity = initialOpacity * (1 - Math.min((now - start) / duration, 1));
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
    this.spawn();
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
    this.sparks = [];
    this.grids = [];
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = IronManParticles;
}