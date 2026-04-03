/**
 * 得分系统 - 管理分数和得分动画
 */
class ScoreSystem {
  constructor() {
    this.score = 0;
    this.highScore = this.loadHighScore();
    this.floatingScores = [];
  }

  addScore(baseScore, x, y) {
    // 固定分值，无连击加成
    this.score += baseScore;
    
    // 创建飘分动画
    this.floatingScores.push({
      x: x,
      y: y,
      score: baseScore,
      opacity: 1,
      offsetY: 0,
      scale: 1.5
    });
    
    return baseScore;
  }

  update() {
    this.floatingScores.forEach(fs => {
      fs.offsetY -= 2;
      fs.opacity -= 0.02;
      fs.scale *= 0.98;
    });
    
    this.floatingScores = this.floatingScores.filter(fs => fs.opacity > 0);
  }

  draw(ctx) {
    ctx.save();
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    
    this.floatingScores.forEach(fs => {
      ctx.globalAlpha = fs.opacity;
      ctx.fillStyle = '#FFD700';
      ctx.font = `bold ${Math.floor(28 * fs.scale)}px Arial`;
      
      // 绘制描边
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.strokeText(`+${fs.score}`, fs.x, fs.y + fs.offsetY);
      
      // 绘制文字
      ctx.fillText(`+${fs.score}`, fs.x, fs.y + fs.offsetY);
    });
    
    ctx.restore();
  }

  loadHighScore() {
    try {
      return parseInt(localStorage.getItem('ironFlowerHighScore') || '0');
    } catch (e) {
      return 0;
    }
  }

  saveHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      try {
        localStorage.setItem('ironFlowerHighScore', this.highScore.toString());
      } catch (e) {
        console.log('无法保存最高分');
      }
      return true;
    }
    return false;
  }

  reset() {
    this.score = 0;
    this.floatingScores = [];
  }
}
