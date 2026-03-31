/**
 * 音效管理器 - Web Audio API 生成金属质感音效
 * 每种铁花类型有独特的声音效果
 */
class AudioManager {
  constructor() {
    this.audioContext = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.log('音频系统初始化失败');
    }
  }

  /**
   * 播放击中铁球的基础音效 - 金属敲击声
   */
  playHit() {
    if (!this.initialized) this.init();
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // 主音 - 金属敲击的高频泛音
    this.playMetalHit(1500, 0.15, 0.25, now);
    
    // 泛音层 - 模拟金属共振
    this.playOvertone(3000, 0.08, 0.1, now + 0.02);
    this.playOvertone(4500, 0.05, 0.08, now + 0.03);
  }

  /**
   * 根据铁花类型播放对应音效
   */
  playFlower(flowerType) {
    if (!this.initialized) this.init();
    if (!this.audioContext) return;
    
    switch(flowerType) {
      case 'single':
        this.playSingleFlowerSound();
        break;
      case 'double':
        this.playDoubleFlowerSound();
        break;
      case 'spiral':
        this.playSpiralFlowerSound();
        break;
      case 'explosion':
        this.playExplosionFlowerSound();
        break;
      case 'meteor':
        this.playMeteorFlowerSound();
        break;
      default:
        this.playSingleFlowerSound();
    }
  }

  /**
   * 单瓣花音效 - 轻脆的金属叮声
   */
  playSingleFlowerSound() {
    const now = this.audioContext.currentTime;
    
    // 清脆的单音
    this.playMetalHit(1800, 0.2, 0.3, now);
    this.playOvertone(3600, 0.1, 0.15, now + 0.01);
    
    // 轻微的回响
    this.playMetalHit(1800, 0.08, 0.15, now + 0.08);
  }

  /**
   * 双瓣花音效 - 双音和弦
   */
  playDoubleFlowerSound() {
    const now = this.audioContext.currentTime;
    
    // 双音叠加
    this.playMetalHit(1200, 0.18, 0.35, now);
    this.playMetalHit(1800, 0.15, 0.3, now + 0.02);
    
    // 泛音
    this.playOvertone(2400, 0.08, 0.2, now + 0.05);
    this.playOvertone(3600, 0.06, 0.15, now + 0.06);
    
    // 延音
    this.playMetalHit(900, 0.06, 0.2, now + 0.15);
  }

  /**
   * 螺旋花音效 - 上升的旋转音
   */
  playSpiralFlowerSound() {
    const now = this.audioContext.currentTime;
    
    // 上升音阶
    const notes = [800, 1000, 1200, 1500, 1800];
    notes.forEach((freq, i) => {
      this.playMetalHit(freq, 0.12, 0.25, now + i * 0.06);
      this.playOvertone(freq * 2, 0.05, 0.12, now + i * 0.06 + 0.02);
    });
    
    // 旋转效果
    this.playSweep(600, 2000, 0.4, now);
  }

  /**
   * 爆炸花音效 - 强烈的金属轰鸣
   */
  playExplosionFlowerSound() {
    const now = this.audioContext.currentTime;
    
    // 冲击波 - 低频轰鸣
    this.playImpact(200, 0.3, 0.5, now);
    
    // 多层金属碰撞
    for (let i = 0; i < 5; i++) {
      const freq = 800 + Math.random() * 1500;
      this.playMetalHit(freq, 0.12, 0.2, now + i * 0.02);
    }
    
    // 高频碎片声
    for (let i = 0; i < 3; i++) {
      this.playOvertone(3000 + i * 500, 0.08, 0.12, now + 0.05 + i * 0.03);
    }
    
    // 衰减回响
    this.playImpact(150, 0.15, 0.3, now + 0.2);
  }

  /**
   * 流星花音效 - 呼啸的流星声
   */
  playMeteorFlowerSound() {
    const now = this.audioContext.currentTime;
    
    // 流星呼啸 - 频率滑动
    this.playSweep(3000, 500, 0.5, now);
    this.playSweep(2500, 400, 0.4, now + 0.05);
    
    // 金属碰撞
    this.playMetalHit(2000, 0.2, 0.35, now);
    this.playMetalHit(1500, 0.15, 0.3, now + 0.08);
    this.playMetalHit(1000, 0.1, 0.25, now + 0.16);
    
    // 尾音
    this.playOvertone(4000, 0.1, 0.2, now + 0.1);
    this.playOvertone(6000, 0.06, 0.15, now + 0.15);
  }

  /**
   * 播放新纪录音效
   */
  playNewRecord() {
    if (!this.initialized) this.init();
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    
    notes.forEach((freq, index) => {
      this.playMetalHit(freq, 0.2, 0.35, now + index * 0.12);
      this.playOvertone(freq * 2, 0.08, 0.2, now + index * 0.12 + 0.02);
    });
  }

  // ========== 底层音效生成函数 ==========

  /**
   * 金属敲击音 - 模拟金属碰撞的泛音结构
   */
  playMetalHit(freq, volume, duration, time) {
    const ctx = this.audioContext;
    
    // 主振荡器
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.7, time + duration);
    
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(time);
    osc.stop(time + duration);
    
    // 添加金属感 - 快速衰减的高频泛音
    const harmonic = ctx.createOscillator();
    const harmGain = ctx.createGain();
    
    harmonic.type = 'sine';
    harmonic.frequency.setValueAtTime(freq * 2.5, time);
    harmGain.gain.setValueAtTime(volume * 0.3, time);
    harmGain.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.3);
    
    harmonic.connect(harmGain);
    harmGain.connect(ctx.destination);
    
    harmonic.start(time);
    harmonic.stop(time + duration * 0.3);
  }

  /**
   * 泛音层 - 增加声音的明亮度
   */
  playOvertone(freq, volume, duration, time) {
    const ctx = this.audioContext;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(time);
    osc.stop(time + duration);
  }

  /**
   * 冲击波音效 - 低频震动
   */
  playImpact(freq, volume, duration, time) {
    const ctx = this.audioContext;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, time + duration);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, time);
    filter.frequency.exponentialRampToValueAtTime(200, time + duration);
    
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(time);
    osc.stop(time + duration);
  }

  /**
   * 频率滑动效果 - 呼啸声
   */
  playSweep(startFreq, endFreq, duration, time) {
    const ctx = this.audioContext;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + duration);
    
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(time);
    osc.stop(time + duration);
  }
}
