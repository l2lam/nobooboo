export function useAudio() {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  let ctx: AudioContext | null = null;

  function initCtx() {
    if (!ctx) {
      ctx = new AudioContext();
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  function playTick() {
    initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  function playStop() {
    initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  function playSuccess() {
    initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.2, ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }

  function playFail() {
    initCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.8);
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.8);
  }

  function playBooboo() {
    initCtx();
    if (!ctx) return;
    
    const now = ctx.currentTime;
    const target = ctx.destination;
    
    // Part 1: Descending "Sad" Trombone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(300, now);
    osc1.frequency.exponentialRampToValueAtTime(100, now + 1.2);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
    osc1.connect(gain1);
    gain1.connect(target);
    osc1.start(now);
    osc1.stop(now + 1.2);

    // Part 2: Dischordant "Taunt" Notes
    const audioCtx = ctx; // Closure for the loop
    [392, 349.23, 311.13, 293.66].forEach((freq, idx) => {
      const startTime = now + (idx * 0.15);
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(freq, startTime);
      gain2.gain.setValueAtTime(0.1, startTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
      osc2.connect(gain2);
      gain2.connect(target);
      osc2.start(startTime);
      osc2.stop(startTime + 0.15);
    });

    // Part 3: Low rumble/thud at the end
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(100, now + 1.0);
    osc3.frequency.exponentialRampToValueAtTime(40, now + 1.5);
    gain3.gain.setValueAtTime(0, now + 1.0);
    gain3.gain.linearRampToValueAtTime(0.3, now + 1.1);
    gain3.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
    osc3.connect(gain3);
    gain3.connect(target);
    osc3.start(now + 1.0);
    osc3.stop(now + 1.5);
  }

  return {
    initCtx,
    playTick,
    playStop,
    playSuccess,
    playFail,
    playBooboo
  };
}
