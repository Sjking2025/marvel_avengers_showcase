class ThorParticles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.lightnings = [];
    this.clouds = [];
    this.active = false;
    this.opacity = 0;
    this.animationId = null;
    this.lastLightning = 0;
    
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
    this.clouds = [];
    this.lightnings = [];
    
    for (let i = 0; i < 100; i++) {
      this.particles.push(this.createRainDrop());
    }
    
    for (let i = 0; i < 8; i++) {
      this.clouds.push(this.createCloud());
    }
    
    this.lastLightning = performance.now();
  }

  createRainDrop() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      length: Math.random() * 20 + 10,
      speed: Math.random() * 15 + 10,
      alpha: Math.random() * 0.3 + 0.1
    };
  }

  createCloud() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height * 0.4,
      width: Math.random() * 200 + 100,
      height: Math.random() * 40 + 20,
      speed: Math.random() * 0.3 + 0.1,
      alpha: Math.random() * 0.15 + 0.05
    };
  }

  createLightning() {
    const startX = Math.random() * this.canvas.width;
    const segments = [];
    let x = startX;
    let y = 0;
    
    while (y < this.canvas.height * 0.7) {
      const branch = Math.random() > 0.6;
      const newX = x + (Math.random() - 0.5) * 80;
      const newY = y + Math.random() * 50 + 30;
      
      segments.push({ x1: x, y1: y, x2: newX, y2: newY, branch });
      
      if (branch && Math.random() > 0.5) {
        const branchX = newX + (Math.random() - 0.5) * 100;
        const branchY = newY + Math.random() * 40 + 20;
        segments.push({ x1: newX, y1: newY, x2: branchX, y2: branchY, branch: false });
      }
      
      x = newX;
      y = newY;
    }
    
    return {
      segments,
      alpha: 1,
      decay: Math.random() * 0.02 + 0.015
    };
  }

  update() {
    this.particles.forEach(p => {
      p.y += p.speed;
      p.x += p.speed * 0.3;
      if (p.y > this.canvas.height) {
        p.y = -p.length;
        p.x = Math.random() * this.canvas.width;
      }
    });
    
    this.clouds.forEach(c => {
      c.x += c.speed;
      if (c.x > this.canvas.width + c.width) {
        c.x = -c.width;
      }
    });
    
    if (performance.now() - this.lastLightning > 2000 && Math.random() > 0.97) {
      this.lightnings.push(this.createLightning());
      this.lastLightning = performance.now();
    }
    
    this.lightnings = this.lightnings.filter(l => {
      l.alpha -= l.decay;
      return l.alpha > 0;
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = this.opacity;
    
    this.clouds.forEach(c => {
      this.ctx.globalAlpha = this.opacity * c.alpha;
      this.ctx.fillStyle = '#1a1a24';
      this.ctx.beginPath();
      this.ctx.ellipse(c.x, c.y, c.width, c.height, 0, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    this.particles.forEach(p => {
      this.ctx.globalAlpha = this.opacity * p.alpha;
      this.ctx.strokeStyle = '#85c1e9';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(p.x, p.y);
      this.ctx.lineTo(p.x + 2, p.y + p.length);
      this.ctx.stroke();
    });
    
    this.lightnings.forEach(l => {
      this.ctx.globalAlpha = this.opacity * l.alpha;
      l.segments.forEach(seg => {
        this.ctx.strokeStyle = seg.branch ? '#5dade2' : '#f4d03f';
        this.ctx.lineWidth = seg.branch ? 2 : 3;
        this.ctx.beginPath();
        this.ctx.moveTo(seg.x1, seg.y1);
        this.ctx.lineTo(seg.x2, seg.y2);
        this.ctx.stroke();
      });
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
    this.lightnings = [];
    this.clouds = [];
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThorParticles;
}