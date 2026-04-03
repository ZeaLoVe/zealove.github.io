/**
 * 铁花特效类 - 粒子系统实现铁花绽放效果
 */
class Particle {
  constructor(x, y, angle, speed, color, size, life, options = {}) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.color = color;
    this.size = size;
    this.life = life;
    this.maxLife = life;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.gravity = options.gravity !== undefined ? options.gravity : 0.05;
    this.friction = options.friction !== undefined ? options.friction : 0.985;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2;
    this.shape = options.shape || 'circle'; // circle, star, diamond
    this.trail = options.trail || false;
    this.trailPositions = [];
  }

  update() {
    // 保存轨迹
    if (this.trail && this.life > this.maxLife * 0.3) {
      this.trailPositions.push({ x: this.x, y: this.y, size: this.size });
      if (this.trailPositions.length > 5) {
        this.trailPositions.shift();
      }
    }
    
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.life--;
  }

  draw(ctx) {
    const alpha = this.life / this.maxLife;
    const currentSize = this.size * (0.3 + alpha * 0.7);
    
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    
    // 绘制轨迹
    if (this.trail && this.trailPositions.length > 0) {
      this.trailPositions.forEach((pos, i) => {
        const trailAlpha = (i / this.trailPositions.length) * alpha * 0.5;
        ctx.globalAlpha = trailAlpha;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pos.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    
    ctx.globalAlpha = alpha;
    
    // 根据形状绘制
    if (this.shape === 'star') {
      this.drawStar(ctx, currentSize);
    } else if (this.shape === 'diamond') {
      this.drawDiamond(ctx, currentSize);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentSize, 0, Math.PI * 2);
      ctx.fill();
      
      // 添加发光效果
      if (alpha > 0.5) {
        ctx.globalAlpha = alpha * 0.3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentSize * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.restore();
  }

  drawStar(ctx, size) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const outerX = Math.cos(angle) * size;
      const outerY = Math.sin(angle) * size;
      const innerAngle = angle + Math.PI / 5;
      const innerX = Math.cos(innerAngle) * size * 0.4;
      const innerY = Math.sin(innerAngle) * size * 0.4;
      
      if (i === 0) {
        ctx.moveTo(outerX, outerY);
      } else {
        ctx.lineTo(outerX, outerY);
      }
      ctx.lineTo(innerX, innerY);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawDiamond(ctx, size) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.6, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  isAlive() {
    return this.life > 0;
  }
}

/**
 * 铁花特效类
 */
class FlowerEffect {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.particles = [];
    this.alive = true;
    this.time = 0;
    this.flashOpacity = 1;
    
    this.createParticles();
  }

  createParticles() {
    const config = this.getConfig();
    
    // 根据类型创建不同的粒子效果
    switch(this.type) {
      case 'single':
        this.createSingleFlower(config);
        break;
      case 'double':
        this.createDoubleFlower(config);
        break;
      case 'spiral':
        this.createSpiralFlower(config);
        break;
      case 'explosion':
        this.createExplosionFlower(config);
        break;
      case 'meteor':
        this.createMeteorFlower(config);
        break;
      default:
        this.createSingleFlower(config);
    }
  }

  createSingleFlower(config) {
    // 单瓣花 - 简单的星形绽放
    const layers = 1;
    for (let layer = 0; layer < layers; layer++) {
      for (let i = 0; i < config.particleCount; i++) {
        const angle = (Math.PI * 2 / config.particleCount) * i + Math.random() * 0.3;
        const speed = config.radius / 30 * (0.6 + Math.random() * 0.8);
        const color = this.getColor('warm');
        const size = 4 + Math.random() * 4;
        const life = config.duration * (0.7 + Math.random() * 0.6);
        
        this.particles.push(new Particle(
          this.x, this.y, angle, speed, color, size, life,
          { shape: 'circle', gravity: 0.06 }
        ));
      }
    }
  }

  createDoubleFlower(config) {
    // 双瓣花 - 两层粒子，内外交错
    for (let layer = 0; layer < 2; layer++) {
      const layerRadius = config.radius * (0.5 + layer * 0.5);
      const particleCount = config.particleCount / 2;
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 / particleCount) * i + layer * Math.PI / particleCount;
        const speed = layerRadius / 35 * (0.7 + Math.random() * 0.6);
        const color = layer === 0 ? this.getColor('gold') : this.getColor('orange');
        const size = 5 + Math.random() * 4;
        const life = config.duration * (0.8 + Math.random() * 0.4);
        
        this.particles.push(new Particle(
          this.x, this.y, angle, speed, color, size, life,
          { shape: 'star', gravity: 0.05, friction: 0.98 }
        ));
      }
    }
  }

  createSpiralFlower(config) {
    // 螺旋花 - 旋转上升的粒子
    const arms = 5;
    const particlesPerArm = config.particleCount / arms;
    
    for (let arm = 0; arm < arms; arm++) {
      for (let i = 0; i < particlesPerArm; i++) {
        const baseAngle = (Math.PI * 2 / arms) * arm;
        const spiralAngle = baseAngle + (i / particlesPerArm) * Math.PI * 2;
        const speed = config.radius / 40 * (0.5 + i / particlesPerArm * 0.8);
        const color = this.getColor('rainbow', i / particlesPerArm);
        const size = 4 + Math.random() * 5;
        const life = config.duration * (0.7 + Math.random() * 0.5);
        
        const particle = new Particle(
          this.x, this.y, spiralAngle, speed, color, size, life,
          { shape: 'diamond', gravity: 0.03, friction: 0.99 }
        );
        particle.rotationSpeed = 0.1;
        this.particles.push(particle);
      }
    }
    
    // 中心粒子
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      const life = config.duration * 0.8;
      
      this.particles.push(new Particle(
        this.x, this.y, angle, speed, '#FFFFFF', 3, life,
        { gravity: 0.02 }
      ));
    }
  }

  createExplosionFlower(config) {
    // 爆炸花 - 向外爆发的圆形冲击波
    const waves = 3;
    
    for (let wave = 0; wave < waves; wave++) {
      setTimeout(() => {
        if (!this.alive) return;
        
        const waveParticles = config.particleCount / waves;
        for (let i = 0; i < waveParticles; i++) {
          const angle = (Math.PI * 2 / waveParticles) * i;
          const speed = config.radius / 25 * (1 + wave * 0.3) * (0.8 + Math.random() * 0.4);
          const color = wave === 0 ? '#FFFFFF' : 
                       wave === 1 ? this.getColor('orange') : 
                       this.getColor('red');
          const size = 6 + Math.random() * 5;
          const life = config.duration * (0.6 + Math.random() * 0.4);
          
          this.particles.push(new Particle(
            this.x, this.y, angle, speed, color, size, life,
            { shape: 'circle', gravity: 0.08, friction: 0.97 }
          ));
        }
      }, wave * 100);
    }
    
    // 核心闪光粒子
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 5;
      const life = config.duration * 0.5;
      
      this.particles.push(new Particle(
        this.x, this.y, angle, speed, '#FFFFFF', 4, life,
        { gravity: 0.15 }
      ));
    }
  }

  createMeteorFlower(config) {
    // 流星花 - 带尾迹的流星效果
    const trails = 8;
    const particlesPerTrail = config.particleCount / trails;
    
    for (let trail = 0; trail < trails; trail++) {
      const baseAngle = (Math.PI * 2 / trails) * trail;
      
      for (let i = 0; i < particlesPerTrail; i++) {
        const angle = baseAngle + (Math.random() - 0.5) * 0.4;
        const speed = config.radius / 50 * (0.6 + Math.random() * 0.8);
        const colorIndex = i / particlesPerTrail;
        const color = this.getColor('meteor', colorIndex);
        const size = 5 + Math.random() * 6;
        const life = config.duration * (0.8 + Math.random() * 0.4);
        
        const particle = new Particle(
          this.x, this.y, angle, speed, color, size, life,
          { shape: 'diamond', gravity: 0.04, friction: 0.988, trail: true }
        );
        this.particles.push(particle);
      }
    }
    
    // 金色核心
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      const life = config.duration * 0.6;
      
      this.particles.push(new Particle(
        this.x, this.y, angle, speed, '#FFD700', 5, life,
        { gravity: 0.06, trail: true }
      ));
    }
  }

  getColor(palette, index = 0) {
    const palettes = {
      warm: ['#FF6B35', '#FF8C00', '#FFA500', '#FFB347', '#FFCC33'],
      gold: ['#FFD700', '#FFC125', '#FFB90F', '#EEAD0E', '#CD950C'],
      orange: ['#FF4500', '#FF6347', '#FF7F24', '#FF8247', '#FF8C69'],
      red: ['#FF0000', '#FF1493', '#DC143C', '#B22222', '#8B0000'],
      rainbow: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
      meteor: ['#FFFFFF', '#FFFACD', '#FFD700', '#FFA500', '#FF8C00', '#FF6347']
    };
    
    const colors = palettes[palette] || palettes.warm;
    const i = Math.floor(index * (colors.length - 1));
    return colors[Math.min(i, colors.length - 1)];
  }

  getConfig() {
    // 铁花分值设定（根据滑动距离决定）
    // 短距离(<100px): 单瓣花 10分
    // 中距离(100-250px): 双瓣花 25分
    // 中远距离(250-400px): 爆炸花 40分
    // 远距离(>400px): 流星花 60分
    const configs = {
      single:   { particleCount: 30,  radius: 60,  duration: 90,  score: 10 },
      double:   { particleCount: 50,  radius: 80,  duration: 120, score: 25 },
      spiral:   { particleCount: 80,  radius: 100, duration: 150, score: 35 },
      explosion:{ particleCount: 120, radius: 140, duration: 100, score: 40 },
      meteor:   { particleCount: 150, radius: 180, duration: 180, score: 60 }
    };
    
    return configs[this.type] || configs.single;
  }

  update() {
    this.time++;
    this.particles.forEach(p => p.update());
    this.particles = this.particles.filter(p => p.isAlive());
    
    if (this.flashOpacity > 0) {
      this.flashOpacity -= 0.03;
    }
    
    if (this.particles.length === 0) {
      this.alive = false;
    }
  }

  draw(ctx) {
    // 绘制中心闪光
    if (this.flashOpacity > 0) {
      ctx.save();
      const config = this.getConfig();
      const flashSize = 60 + (1 - this.flashOpacity) * 40;
      
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, flashSize
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${this.flashOpacity})`);
      gradient.addColorStop(0.3, `rgba(255, 200, 100, ${this.flashOpacity * 0.6})`);
      gradient.addColorStop(1, 'rgba(255, 100, 50, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, flashSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    
    // 绘制粒子
    this.particles.forEach(p => p.draw(ctx));
  }

  getScore() {
    return this.getConfig().score;
  }
}
