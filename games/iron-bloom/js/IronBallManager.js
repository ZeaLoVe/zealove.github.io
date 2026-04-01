/**
 * 铁球管理器 - 管理铁球的生成和生命周期
 * 
 * 难度机制：
 * - 0-10秒：每秒生成1个铁球（累计10个）
 * - 10-20秒：每秒生成2个铁球（累计20个）
 * - 20-30秒：每秒生成3个铁球（累计30个）
 * - 30-40秒：每秒生成4个铁球（累计40个）
 * - 40-60秒：每秒生成5个铁球（累计100个）
 */
class IronBallManager {
  constructor() {
    this.balls = [];
    this.lastSpawnTime = 0;
    this.gameTime = 0;
    
    // 固定每秒生成一次
    this.spawnInterval = 1000; // 生成间隔（毫秒）
    
    // 速度分布
    this.speedDistribution = {
      slow: 0.5,
      medium: 0.3,
      fast: 0.2
    };
  }

  update(deltaTime) {
    this.gameTime += deltaTime;
    
    // 根据游戏时间调整难度
    this.adjustDifficulty();
    
    // 每秒生成新铁球
    if (this.gameTime - this.lastSpawnTime >= this.spawnInterval) {
      this.spawnBalls();
      this.lastSpawnTime = Math.floor(this.gameTime / 1000) * 1000;
    }
    
    // 更新所有铁球
    this.balls.forEach(ball => ball.update());
    
    // 移除已消失的铁球
    this.balls = this.balls.filter(ball => ball.alive && !ball.clicked);
  }

  adjustDifficulty() {
    const seconds = this.gameTime / 1000;
    
    // 根据时间调整速度分布
    if (seconds < 10) {
      this.speedDistribution = { slow: 0.8, medium: 0.15, fast: 0.05 };
    } else if (seconds < 20) {
      this.speedDistribution = { slow: 0.6, medium: 0.3, fast: 0.1 };
    } else if (seconds < 30) {
      this.speedDistribution = { slow: 0.4, medium: 0.4, fast: 0.2 };
    } else if (seconds < 40) {
      this.speedDistribution = { slow: 0.3, medium: 0.45, fast: 0.25 };
    } else if (seconds < 50) {
      this.speedDistribution = { slow: 0.2, medium: 0.4, fast: 0.4 };
    } else {
      this.speedDistribution = { slow: 0.15, medium: 0.35, fast: 0.5 };
    }
  }

  /**
   * 获取当前每秒应该生成的铁球数量
   */
  getBallsPerSecond() {
    const seconds = this.gameTime / 1000;
    
    if (seconds < 10) return 1;
    if (seconds < 20) return 2;
    if (seconds < 30) return 3;
    if (seconds < 40) return 4;
    return 5; // 40秒后每秒5个
  }

  /**
   * 批量生成铁球（每秒触发一次）
   */
  spawnBalls() {
    const count = this.getBallsPerSecond();
    const positions = this.generatePositions(count);
    
    for (let i = 0; i < count; i++) {
      const x = positions[i];
      const speed = this.getRandomSpeed();
      const ball = new IronBall(x, speed);
      this.balls.push(ball);
    }
  }

  /**
   * 生成不重叠的铁球位置
   */
  generatePositions(count) {
    const positions = [];
    const minDistance = 80; // 铁球之间的最小距离
    const padding = 60; // 边缘留白
    const maxWidth = window.innerWidth - padding * 2;
    
    for (let i = 0; i < count; i++) {
      let attempts = 0;
      let x;
      
      // 尝试找到一个不重叠的位置
      do {
        x = padding + Math.random() * maxWidth;
        attempts++;
      } while (this.isTooClose(x, positions, minDistance) && attempts < 20);
      
      positions.push(x);
    }
    
    return positions;
  }

  /**
   * 检查位置是否与其他位置太近
   */
  isTooClose(x, positions, minDistance) {
    return positions.some(pos => Math.abs(pos - x) < minDistance);
  }

  getRandomSpeed() {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [speed, probability] of Object.entries(this.speedDistribution)) {
      cumulative += probability;
      if (rand < cumulative) {
        return speed;
      }
    }
    
    return 'medium';
  }

  draw(ctx) {
    this.balls.forEach(ball => ball.draw(ctx));
  }

  /**
   * 检测滑动划线与铁球的碰撞
   * @param {Object} start - 起点 {x, y}
   * @param {Object} end - 终点 {x, y}
   * @returns {Array} 碰撞到的铁球数组
   */
  checkSwipeHit(start, end) {
    const hitBalls = [];
    
    for (let i = 0; i < this.balls.length; i++) {
      const ball = this.balls[i];
      if (!ball.alive || ball.clicked) continue;
      
      // 检测线段与圆的相交
      if (this.lineCircleIntersect(start.x, start.y, end.x, end.y, ball.x, ball.y, ball.radius + 10)) {
        ball.clicked = true;
        ball.alive = false;
        hitBalls.push(ball);
      }
    }
    
    return hitBalls;
  }

  /**
   * 线段与圆形的碰撞检测
   * @param {number} x1, y1 - 线段起点
   * @param {number} x2, y2 - 线段终点
   * @param {number} cx, cy - 圆心
   * @param {number} r - 半径
   * @returns {boolean} 是否相交
   */
  lineCircleIntersect(x1, y1, x2, y2, cx, cy, r) {
    // 向量从起点到终点
    const dx = x2 - x1;
    const dy = y2 - y1;
    
    // 向量从起点到圆心
    const fx = x1 - cx;
    const fy = y1 - cy;
    
    const a = dx * dx + dy * dy;
    const b = 2 * (fx * dx + fy * dy);
    const c = fx * fx + fy * fy - r * r;
    
    let discriminant = b * b - 4 * a * c;
    
    if (discriminant < 0) {
      // 不相交，检查圆心到线段的垂线距离
      return this.pointToSegmentDistance(cx, cy, x1, y1, x2, y2) < r;
    }
    
    discriminant = Math.sqrt(discriminant);
    
    const t1 = (-b - discriminant) / (2 * a);
    const t2 = (-b + discriminant) / (2 * a);
    
    // 检查是否有交点在线段范围内
    if ((t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1)) {
      return true;
    }
    
    // 检查端点是否在圆内
    const d1 = Math.sqrt((x1 - cx) ** 2 + (y1 - cy) ** 2);
    const d2 = Math.sqrt((x2 - cx) ** 2 + (y2 - cy) ** 2);
    
    return d1 < r || d2 < r;
  }

  /**
   * 计算点到线段的最短距离
   */
  pointToSegmentDistance(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSquared = dx * dx + dy * dy;
    
    if (lengthSquared === 0) {
      return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
    }
    
    let t = ((px - x1) * dx + (py - y1) * dy) / lengthSquared;
    t = Math.max(0, Math.min(1, t));
    
    const nearestX = x1 + t * dx;
    const nearestY = y1 + t * dy;
    
    return Math.sqrt((px - nearestX) ** 2 + (py - nearestY) ** 2);
  }

  reset() {
    this.balls = [];
    this.lastSpawnTime = 0;
    this.gameTime = 0;
  }
}
