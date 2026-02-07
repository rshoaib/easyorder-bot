'use client';

import confetti from 'canvas-confetti';

export const runFireworks = () => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const random = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti({
      ...defaults,
      particleCount,
      origin: { x: random(0.1, 0.3), y: mathRandom(0.1, 0.3) ? Math.random() - 0.2 : Math.random() - 0.2 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: random(0.7, 0.9), y: mathRandom(0.1, 0.3) ? Math.random() - 0.2 : Math.random() - 0.2 }
    });
  }, 250);
};

// Simple burst
export const runConfetti = () => {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function mathRandom(min: number, max: number) {
    return Math.random() * (max - min) + min;
}
