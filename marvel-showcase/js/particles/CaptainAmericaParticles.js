class CaptainAmericaParticles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.stars = [];
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
    this.stars = [];
    
    for (let i = 0; i < 80; i++) {
      this.stars.push(this.createStar());
    }
  }

  createStar() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      twinkleOffset: Math.random() * Math.PI * 2,
      color: Math.random() > 0.7 ? '#c0392b' : (Math.random() > 0.5 ? '#5dade2' : '#ffffff')
    };
  }

  update() {
    this.stars.forEach(s => {
      s.currentAlpha = s.alpha * (0.5 + 0.5 * Math.sin(performance.now() * s.twinkleSpeed + s.twinkleOffset));
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = this.opacity;
    
    this.stars.forEach(s => {
      this.ctx.globalAlpha = this.opacity * s.currentAlpha;
      this.ctx.fillStyle = s.color;
      this.ctx.beginPath();
      this.drawStar(this.ctx, s.x, s.y, s.size);
      this.ctx.fill();
    });
    
    this.ctx.globalAlpha = 1;
  }

  drawStar(ctx, cx, cy, size) {
    const spikes = 4;
    const outerRadius = size;
    const innerRadius = size * 0.4;
    
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;
    
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;
      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
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
    this.stars = [];
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CaptainAmericaParticles;
}