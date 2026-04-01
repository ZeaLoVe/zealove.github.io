/**
 * 铁球类 - 控制单个铁球的飞行和行为
 */
class IronBall {
  constructor(x, speed, type = 'normal') {
    this.x = x;
    this.y = window.innerHeight + 30; // 从屏幕底部下方开始
    this.speed = speed; // 速度等级: 'slow', 'medium', 'fast'
    this.radius = 25;
    this.type = type;
    this.alive = true;
    this.clicked = false;
    this.opacity = 1;
    
    // 飞行参数
    this.velocityY = this.getVelocityBySpeed();
    this.gravity = 0.15;
    this.maxHeight = window.innerHeight * 0.7; // 最高飞到屏幕70%高度
    
    // 动画参数
    this.glowIntensity = 0;
    this.glowDirection = 1;
  }

  getVelocityBySpeed() {
    switch(this.speed) {
      case 'slow': return -8;
      case 'medium': return -10;
      case 'fast': return -12;
      default: return -10;
    }
  }

  update() {
    if (!this.alive) return;
    
    // 更新位置
    this.velocityY += this.gravity;
    this.y += this.velocityY;
    
    // 更新发光效果
    this.glowIntensity += 0.05 * this.glowDirection;
    if (this.glowIntensity >= 1 || this.glowIntensity <= 0) {
      this.glowDirection *= -1;
    }
    
    // 检查是否飞出屏幕
    if (this.y > window.innerHeight + 50) {
      this.alive = false;
    }
  }

  draw(ctx) {
    if (!this.alive || this.clicked) return;
    
    ctx.save();
    
    // 绘制发光效果
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius * 2
    );
    gradient.addColorStop(0, `rgba(255, 107, 53, ${0.3 + this.glowIntensity * 0.3})`);
    gradient.addColorStop(1, 'rgba(255, 107, 53, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制铁球主体（暗红色金属质感）
    const ballGradient = ctx.createRadialGradient(
      this.x - this.radius * 0.3, this.y - this.radius * 0.3, 0,
      this.x, this.y, this.radius
    );
    ballGradient.addColorStop(0, '#C41E3A');
    ballGradient.addColorStop(0.5, '#8B0000');
    ballGradient.addColorStop(1, '#4A0000');
    
    ctx.fillStyle = ballGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 绘制高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  isClicked(mouseX, mouseY) {
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    return dx * dx + dy * dy < (this.radius + 10) * (this.radius + 10);
  }

  getFlowerType() {
    // 根据点击位置和速度决定铁花类型（调整后概率更友好）
    const rand = Math.random();
    const relativeHeight = this.y / window.innerHeight;
    
    let flowerType = 'single';
    
    // 根据高度调整概率，稀有铁花出现概率提高
    if (relativeHeight < 0.35) {
      // 位置偏低，更容易出现螺旋花
      if (rand < 0.25) flowerType = 'spiral';
      else if (rand < 0.50) flowerType = 'double';
      else if (rand < 0.70) flowerType = 'explosion';
      else if (rand < 0.85) flowerType = 'single';
      else flowerType = 'meteor';
    } else if (relativeHeight > 0.75) {
      // 位置偏高，更容易出现流星花
      if (rand < 0.15) flowerType = 'meteor';
      else if (rand < 0.40) flowerType = 'explosion';
      else if (rand < 0.65) flowerType = 'double';
      else if (rand < 0.85) flowerType = 'spiral';
      else flowerType = 'single';
    } else {
      // 中间位置，标准分布
      if (rand < 0.30) flowerType = 'single';
      else if (rand < 0.55) flowerType = 'double';
      else if (rand < 0.75) flowerType = 'spiral';
      else if (rand < 0.90) flowerType = 'explosion';
      else flowerType = 'meteor';
    }
    
    return flowerType;
  }
}
