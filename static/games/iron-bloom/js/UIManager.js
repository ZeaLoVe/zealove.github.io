/**
 * UI管理器 - 管理游戏界面元素
 */
class UIManager {
  constructor() {
    this.time = 60;
    this.isGameOver = false;
    this.showTutorial = true;
    this.tutorialOpacity = 1;
  }

  draw(ctx, score, highScore) {
    this.drawScore(ctx, score, highScore);
    this.drawTimer(ctx);
    
    if (this.showTutorial) {
      this.drawTutorial(ctx);
    }
  }

  drawScore(ctx, score, highScore) {
    ctx.save();
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'left';
    
    // 当前分数
    ctx.fillStyle = '#FFD700';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeText(`分数: ${score}`, 20, 40);
    ctx.fillText(`分数: ${score}`, 20, 40);
    
    // 最高分
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#FFA500';
    ctx.strokeText(`最高: ${highScore}`, 20, 70);
    ctx.fillText(`最高: ${highScore}`, 20, 70);
    
    ctx.restore();
  }

  drawTimer(ctx) {
    ctx.save();
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'right';
    
    // 根据剩余时间改变颜色
    let color;
    if (this.time > 30) {
      color = '#4CAF50';
    } else if (this.time > 10) {
      color = '#FFA500';
    } else {
      color = '#FF0000';
      // 最后10秒闪烁
      if (Math.floor(Date.now() / 500) % 2 === 0) {
        ctx.globalAlpha = 0.5;
      }
    }
    
    ctx.fillStyle = color;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeText(`${Math.ceil(this.time)}`, window.innerWidth - 20, 50);
    ctx.fillText(`${Math.ceil(this.time)}`, window.innerWidth - 20, 50);
    
    ctx.restore();
  }

  drawTutorial(ctx) {
    ctx.save();
    ctx.globalAlpha = this.tutorialOpacity;
    
    // 提示框
    const boxWidth = 300;
    const boxHeight = 80;
    const boxX = (window.innerWidth - boxWidth) / 2;
    const boxY = window.innerHeight - 150;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 10);
    ctx.fill();
    
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('滑动屏幕划线撞击铁球', window.innerWidth / 2, boxY + 35);
    ctx.fillText('距离越远，铁花越绚丽！', window.innerWidth / 2, boxY + 65);
    
    ctx.restore();
    
    // 自动淡出
    if (this.showTutorial) {
      setTimeout(() => {
        this.tutorialOpacity = Math.max(0, this.tutorialOpacity - 0.02);
        if (this.tutorialOpacity === 0) {
          this.showTutorial = false;
        }
      }, 3000);
    }
  }

  drawGameOver(ctx, score, highScore) {
    ctx.save();
    
    // 半透明背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    
    // 结算框
    const boxWidth = 400;
    const boxHeight = 500;
    const boxX = (window.innerWidth - boxWidth) / 2;
    const boxY = (window.innerHeight - boxHeight) / 2;
    
    // 绘制背景框
    ctx.fillStyle = '#1a0a0a';
    ctx.strokeStyle = '#FF6B35';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 20);
    ctx.fill();
    ctx.stroke();
    
    // 标题
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FF6B35';
    ctx.fillText('游戏结束', window.innerWidth / 2, boxY + 60);
    
    // 分数
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`得分: ${score}`, window.innerWidth / 2, boxY + 140);
    
    // 最高分
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#FFA500';
    ctx.fillText(`最高分: ${highScore}`, window.innerWidth / 2, boxY + 190);
    
    // 新纪录标识
    if (score >= highScore && score > 0) {
      ctx.font = 'bold 32px Arial';
      ctx.fillStyle = '#FF0000';
      ctx.fillText('🎉 新纪录！', window.innerWidth / 2, boxY + 260);
    }
    
    // 重新开始按钮
    const btnWidth = 200;
    const btnHeight = 60;
    const btnX = (window.innerWidth - btnWidth) / 2;
    const btnY = boxY + 340;
    
    ctx.fillStyle = '#FF6B35';
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnWidth, btnHeight, 10);
    ctx.fill();
    
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#FFF';
    ctx.fillText('再来一局', window.innerWidth / 2, btnY + 40);
    
    ctx.restore();
    
    // 返回按钮位置供点击检测
    return { btnX, btnY, btnWidth, btnHeight };
  }

  updateTime(deltaTime) {
    if (!this.isGameOver) {
      this.time -= deltaTime / 1000;
      if (this.time <= 0) {
        this.time = 0;
        this.isGameOver = true;
      }
    }
  }

  isRestartButtonClick(x, y, btnRect) {
    return x >= btnRect.btnX && 
           x <= btnRect.btnX + btnRect.btnWidth &&
           y >= btnRect.btnY && 
           y <= btnRect.btnY + btnRect.btnHeight;
  }

  reset() {
    this.time = 60;
    this.isGameOver = false;
    this.showTutorial = true;
    this.tutorialOpacity = 1;
  }
}
