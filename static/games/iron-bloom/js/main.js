/**
 * 铁花火韵 - 游戏入口
 * 主入口文件，初始化游戏
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
  // 创建Canvas元素
  const canvas = document.createElement('canvas');
  canvas.id = 'gameCanvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.touchAction = 'none'; // 防止触摸滚动
  
  // 添加到页面
  document.body.appendChild(canvas);
  
  // 隐藏原有的app内容
  const app = document.getElementById('app');
  if (app) {
    app.style.display = 'none';
  }
  
  // 初始化游戏
  const gameManager = new GameManager(canvas);
  gameManager.start();
  
  // 防止页面滚动和缩放
  document.body.style.overflow = 'hidden';
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  
  // 防止双击缩放
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
  
  // 防止双指缩放
  document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
  });
});
