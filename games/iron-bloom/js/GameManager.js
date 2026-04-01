/**
 * 游戏管理器 - 核心游戏控制器
 */
class GameManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // 初始化各个系统
    this.ironBallManager = new IronBallManager();
    this.scoreSystem = new ScoreSystem();
    this.uiManager = new UIManager();
    this.flowerEffects = [];
    
    // 游戏状态
    this.isRunning = false;
    this.lastTime = 0;
    this.gameOverBtnRect = null;
    
    // 滑动相关
    this.isSwiping = false;
    this.swipeStart = null;
    this.swipeEnd = null;
    this.swipeTrail = []; // 滑动轨迹点
    
    // 音效管理器
    this.audioManager = new AudioManager();
    
    // 绑定事件
    this.bindEvents();
    
    // 调整画布大小
    this.resizeCanvas();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    // 滑动/划线事件
    const handleStart = (e) => {
      e.preventDefault();
      
      if (this.uiManager.isGameOver) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        
        // 检查是否点击重新开始按钮
        if (this.gameOverBtnRect && 
            this.uiManager.isRestartButtonClick(x, y, this.gameOverBtnRect)) {
          this.restart();
        }
        return;
      }
      
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      
      this.isSwiping = true;
      this.swipeStart = { x, y };
      this.swipeEnd = { x, y };
      this.swipeTrail = [{ x, y, time: Date.now() }];
    };
    
    const handleMove = (e) => {
      if (!this.isSwiping) return;
      e.preventDefault();
      
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      
      this.swipeEnd = { x, y };
      this.swipeTrail.push({ x, y, time: Date.now() });
      
      // 保持轨迹不要太长
      if (this.swipeTrail.length > 20) {
        this.swipeTrail.shift();
      }
    };
    
    const handleEnd = (e) => {
      if (!this.isSwiping || !this.swipeStart || !this.swipeEnd) {
        this.isSwiping = false;
        return;
      }
      
      // 计算滑动距离
      const dx = this.swipeEnd.x - this.swipeStart.x;
      const dy = this.swipeEnd.y - this.swipeStart.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // 如果滑动距离足够长，检测碰撞
      if (distance > 30) {
        const hitBalls = this.ironBallManager.checkSwipeHit(this.swipeStart, this.swipeEnd);
        
        hitBalls.forEach((ball) => {
          this.onBallHit(ball, distance);
        });
      }
      
      this.isSwiping = false;
      this.swipeTrail = [];
    };
    
    // 触摸事件
    this.canvas.addEventListener('touchstart', handleStart, { passive: false });
    this.canvas.addEventListener('touchmove', handleMove, { passive: false });
    this.canvas.addEventListener('touchend', handleEnd);
    
    // 鼠标事件（桌面端支持）
    this.canvas.addEventListener('mousedown', handleStart);
    this.canvas.addEventListener('mousemove', handleMove);
    this.canvas.addEventListener('mouseup', handleEnd);
    
    // 窗口大小改变
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
  }

  /**
   * 根据滑动距离确定铁花类型
   */
  getFlowerTypeByDistance(distance) {
    if (distance < 100) {
      return 'single';      // 短距离：单瓣花 10分
    } else if (distance < 250) {
      return 'double';      // 中距离：双瓣花 25分
    } else if (distance < 400) {
      return 'explosion';   // 中远距离：爆炸花 40分
    } else {
      return 'meteor';      // 远距离：流星花 60分
    }
  }

  onBallHit(ball, swipeDistance) {
    // 创建铁花特效
    const flowerType = this.getFlowerTypeByDistance(swipeDistance);
    const effect = new FlowerEffect(ball.x, ball.y, flowerType);
    this.flowerEffects.push(effect);
    
    // 获得固定分数
    const baseScore = effect.getScore();
    this.scoreSystem.addScore(baseScore, ball.x, ball.y);
    
    // 播放音效
    this.audioManager.playHit();
    this.audioManager.playFlower(flowerType);
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  gameLoop(currentTime = performance.now()) {
    if (!this.isRunning) return;
    
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    
    // 更新游戏状态
    this.update(deltaTime);
    
    // 渲染
    this.render();
    
    // 继续循环
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  update(deltaTime) {
    // 更新UI
    this.uiManager.updateTime(deltaTime);
    
    // 检查游戏是否结束
    if (this.uiManager.isGameOver) {
      const isNewRecord = this.scoreSystem.saveHighScore();
      if (isNewRecord) {
        this.audioManager.playNewRecord();
      }
      return;
    }
    
    // 更新铁球
    this.ironBallManager.update(deltaTime);
    
    // 更新铁花特效
    this.flowerEffects.forEach(effect => effect.update());
    this.flowerEffects = this.flowerEffects.filter(effect => effect.alive);
    
    // 更新得分系统
    this.scoreSystem.update();
  }

  render() {
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制背景
    this.drawBackground();
    
    // 绘制滑动轨迹
    this.drawSwipeTrail();
    
    // 绘制铁球
    this.ironBallManager.draw(this.ctx);
    
    // 绘制铁花特效
    this.flowerEffects.forEach(effect => effect.draw(this.ctx));
    
    // 绘制飘分
    this.scoreSystem.draw(this.ctx);
    
    // 绘制UI
    this.uiManager.draw(this.ctx, this.scoreSystem.score, this.scoreSystem.highScore);
    
    // 绘制游戏结束界面
    if (this.uiManager.isGameOver) {
      this.gameOverBtnRect = this.uiManager.drawGameOver(
        this.ctx, 
        this.scoreSystem.score, 
        this.scoreSystem.highScore
      );
    }
  }

  drawSwipeTrail() {
    if (this.swipeTrail.length < 2) return;
    
    this.ctx.save();
    
    const now = Date.now();
    
    // 绘制轨迹线
    for (let i = 1; i < this.swipeTrail.length; i++) {
      const p1 = this.swipeTrail[i - 1];
      const p2 = this.swipeTrail[i];
      const age = now - p2.time;
      const alpha = Math.max(0, 1 - age / 300);
      
      if (alpha <= 0) continue;
      
      const gradient = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
      gradient.addColorStop(0, `rgba(255, 200, 100, ${alpha * 0.3})`);
      gradient.addColorStop(1, `rgba(255, 100, 50, ${alpha * 0.8})`);
      
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 4;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.stroke();
    }
    
    // 绘制起点和终点
    if (this.swipeStart) {
      this.ctx.fillStyle = 'rgba(255, 200, 100, 0.8)';
      this.ctx.beginPath();
      this.ctx.arc(this.swipeStart.x, this.swipeStart.y, 8, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    if (this.swipeEnd) {
      this.ctx.fillStyle = 'rgba(255, 100, 50, 0.9)';
      this.ctx.beginPath();
      this.ctx.arc(this.swipeEnd.x, this.swipeEnd.y, 6, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  drawBackground() {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#1a0a0a');
    gradient.addColorStop(0.5, '#2d1a1a');
    gradient.addColorStop(1, '#1a0a0a');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 添加星空效果
    this.drawStars();
  }

  drawStars() {
    // 简单的星空背景
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 50; i++) {
      const x = (i * 137.5) % this.canvas.width;
      const y = (i * 89.3) % this.canvas.height;
      const size = (i % 3) + 1;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  restart() {
    // 重置所有系统
    this.ironBallManager.reset();
    this.scoreSystem.reset();
    this.uiManager.reset();
    this.flowerEffects = [];
    this.gameOverBtnRect = null;
    this.isSwiping = false;
    this.swipeTrail = [];
  }
}
