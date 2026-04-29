class BlackPantherParticles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.crystals = [];
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
    this.crystals = [];
    
    for (let i = 0; i < 40; i++) {
      this.crystals.push(this.createCrystal());
    }
  }

  createCrystal() {
    const size = Math.random() * 20 + 10;
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      alpha: Math.random() * 0.4 + 0.2,
      color: Math.random() > 0.5 ? '#8e44ad' : '#17a589'
    };
  }

  update() {
    this.crystals.forEach(c => {
      c.x += c.vx;
      c.y += c.vy;
      c.rotation += c.rotationSpeed;
      c.pulse += c.pulseSpeed;
      
      if (c.x < -c.size) c.x = this.canvas.width + c.size;
      if (c.x > this.canvas.width + c.size) c.x = -c.size;
      if (c.y < -c.size) c.y = this.canvas.height + c.size;
      if (c.y > this.canvas.height + c.size) c.y = -c.size;
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = this.opacity;
    
    this.crystals.forEach(c => {
      const glow = 0.5 + 0.5 * Math.sin(c.pulse);
      this.ctx.globalAlpha = this.opacity * c.alpha * glow;
      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate(c.rotation);
      this.ctx.fillStyle = c.color;
      this.ctx.beginPath();
      this.ctx.moveTo(0, -c.size / 2);
      this.ctx.lineTo(c.size / 2, 0);
      this.ctx.lineTo(0, c.size / 2);
      this.ctx.lineTo(-c.size / 2, 0);
      this.ctx.closePath();
      this.ctx.fill();
      this.ctx.strokeStyle = c.color;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
      this.ctx.restore();
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
    this.crystals = [];
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BlackPantherParticles;
}