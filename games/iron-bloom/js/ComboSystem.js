/**
 * 连击系统 - 管理连击计数和连击特效
 */
class ComboSystem {
  constructor() {
    this.combo = 0;
    this.maxCombo = 0;
    this.lastHitTime = 0;
    this.comboTimeout = 2000; // 2秒内需要再次击中才能保持连击
    this.comboDisplay = {
      opacity: 0,
      scale: 1
    };
  }

  hit() {
    this.combo++;
    if (this.combo > this.maxCombo) {
      this.maxCombo = this.combo;
    }
    this.lastHitTime = Date.now();
    
    // 触发连击动画
    this.comboDisplay.opacity = 1;
    this.comboDisplay.scale = 1.5;
  }

  update() {
    // 检查连击是否超时
    if (this.combo > 0 && Date.now() - this.lastHitTime > this.comboTimeout) {
      this.combo = 0;
    }
    
    // 更新连击显示动画
    if (this.comboDisplay.opacity > 0) {
      this.comboDisplay.opacity -= 0.02;
      this.comboDisplay.scale += (1 - this.comboDisplay.scale) * 0.1;
    }
  }

  draw(ctx) {
    if (this.combo < 2) return;
    
    ctx.save();
    
    // 连击文字
    const text = `COMBO x${this.combo}`;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.globalAlpha = Math.min(1, this.comboDisplay.opacity + 0.5);
    
    // 发光效果
    if (this.combo >= 5) {
      ctx.shadowColor = '#FF6B35';
      ctx.shadowBlur = 20;
    }
    
    // 渐变颜色
    const gradient = ctx.createLinearGradient(
      window.innerWidth / 2 - 100, 80,
      window.innerWidth / 2 + 100, 80
    );
    
    if (this.combo >= 10) {
      gradient.addColorStop(0, '#FFD700');
      gradient.addColorStop(0.5, '#FF6B35');
      gradient.addColorStop(1, '#FFD700');
    } else if (this.combo >= 5) {
      gradient.addColorStop(0, '#FF6B35');
      gradient.addColorStop(1, '#FFD700');
    } else {
      gradient.addColorStop(0, '#FFA500');
      gradient.addColorStop(1, '#FF8C00');
    }
    
    ctx.fillStyle = gradient;
    ctx.font = `bold ${48 * this.comboDisplay.scale}px Arial`;
    
    // 绘制描边
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.strokeText(text, window.innerWidth / 2, 80);
    
    // 绘制文字
    ctx.fillText(text, window.innerWidth / 2, 80);
    
    ctx.restore();
  }

  getComboMultiplier() {
    return this.combo;
  }

  reset() {
    this.combo = 0;
    this.maxCombo = 0;
    this.lastHitTime = 0;
    this.comboDisplay = { opacity: 0, scale: 1 };
  }
}
