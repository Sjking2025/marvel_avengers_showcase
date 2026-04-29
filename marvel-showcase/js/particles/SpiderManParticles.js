class SpiderManParticles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.webStrands = [];
    this.cityLights = [];
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
    this.webStrands = [];
    this.cityLights = [];
    
    for (let i = 0; i < 150; i++) {
      this.particles.push(this.createRainDrop());
    }
    
    for (let i = 0; i < 30; i++) {
      this.cityLights.push(this.createCityLight());
    }
    
    setInterval(() => {
      if (this.active && Math.random() > 0.92) {
        this.webStrands.push(this.createWebStrand());
      }
    }, 200);
  }

  createRainDrop() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      length: Math.random() * 15 + 8,
      speed: Math.random() * 12 + 8,
      alpha: Math.random() * 0.4 + 0.1
    };
  }

  createCityLight() {
    return {
      x: Math.random() * this.canvas.width,
      y: this.canvas.height * 0.6 + Math.random() * this.canvas.height * 0.4,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.3 + 0.1,
      blinkSpeed: Math.random() * 0.02 + 0.005,
      blinkOffset: Math.random() * Math.PI * 2
    };
  }

  createWebStrand() {
    const startX = Math.random() * this.canvas.width;
    const startY = 0;
    const endY = this.canvas.height * 0.3 + Math.random() * this.canvas.height * 0.5;
    const controlX = startX + (Math.random() - 0.5) * 200;
    const controlY = endY * 0.6;
    
    return {
      startX, startY,
      controlX, controlY,
      endX: startX, endY,
      alpha: 0,
      fadeIn: 0.015,
      fadeOut: 0,
      maxAlpha: Math.random() * 0.4 + 0.2,
      phase: 'in'
    };
  }

  update() {
    this.particles.forEach(p => {
      p.y += p.speed;
      p.x += p.speed * 0.2;
      if (p.y > this.canvas.height) {
        p.y = -p.length;
        p.x = Math.random() * this.canvas.width;
      }
    });
    
    this.cityLights.forEach(l => {
      l.alpha = l.baseAlpha * (0.5 + 0.5 * Math.sin(performance.now() * l.blinkSpeed + l.blinkOffset));
      l.baseAlpha = l.alpha;
    });
    
    this.webStrands = this.webStrands.filter(w => {
      if (w.phase === 'in') {
        w.alpha += w.fadeIn;
        if (w.alpha >= w.maxAlpha) {
          w.phase = 'out';
        }
      } else {
        w.alpha -= w.fadeOut;
        if (w.alpha <= 0) {
          w.alpha = 0;
          w.phase = 'out';
          w.fadeOut = 0.008;
        }
      }
      return w.alpha > 0 || w.phase === 'in';
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = this.opacity;
    
    this.cityLights.forEach(l => {
      this.ctx.globalAlpha = this.opacity * l.alpha;
      this.ctx.fillStyle = '#f4d03f';
      this.ctx.beginPath();
      this.ctx.arc(l.x, l.y, l.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    this.particles.forEach(p => {
      this.ctx.globalAlpha = this.opacity * p.alpha;
      this.ctx.strokeStyle = 'rgba(41, 128, 185, 0.6)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y);
      this.ctx.lineTo(p.x + 1, p.y + p.length);
      this.ctx.stroke();
    });
    
    this.webStrands.forEach(w => {
      this.ctx.globalAlpha = this.opacity * w.alpha;
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(w.startX, w.startY);
      this.ctx.quadraticCurveTo(w.controlX, w.controlY, w.endX, w.endY);
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
    this.webStrands = [];
    this.cityLights = [];
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SpiderManParticles;
}