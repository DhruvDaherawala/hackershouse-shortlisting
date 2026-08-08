import React, { useEffect, useRef } from 'react';

export default function DotMatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Code characters pool for hacker vibe
    const chars = ['<', '>', '/', '{', '}', ';', '#', '0', '1', 'G', 'O', 'A', 'B', 'U', 'I', 'L', 'D', 'S', 'H', 'I', 'P', '2', '0', '2', '6'];
    
    let time = 0;

    const render = () => {
      time += 0.025;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep green background fill
      ctx.fillStyle = '#063725';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const spacingX = 22;
      const spacingY = 22;
      const cols = Math.ceil(canvas.width / spacingX) + 1;
      const rows = Math.ceil(canvas.height / spacingY) + 1;

      ctx.font = '11px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacingX;
          const y = r * spacingY;

          // Undulating wave equations (sine & cosine matrix waves)
          const wave1 = Math.sin(c * 0.15 + r * 0.1 - time * 2);
          const wave2 = Math.cos(c * 0.1 - r * 0.15 + time * 1.5);
          const waveCombined = (wave1 + wave2) * 0.5;

          // Pick character deterministically based on grid pos
          const charIndex = (c * 7 + r * 13) % chars.length;
          const char = chars[charIndex];

          // Compute opacity & glow intensity
          const opacity = Math.max(0.08, Math.min(0.85, 0.2 + waveCombined * 0.6));
          
          if (opacity > 0.45) {
            ctx.fillStyle = `rgba(254, 225, 1, ${opacity.toFixed(2)})`; // Bright Yellow glow
          } else if (opacity > 0.25) {
            ctx.fillStyle = `rgba(154, 201, 95, ${opacity.toFixed(2)})`; // Lime Green
          } else {
            ctx.fillStyle = `rgba(6, 85, 50, ${opacity.toFixed(2)})`; // Muted Green
          }

          // Render code character
          ctx.fillText(char, x, y);

          // Add glowing dot matrix accent on high wave points
          if (waveCombined > 0.6) {
            ctx.fillStyle = `rgba(254, 225, 1, ${(waveCombined * 0.4).toFixed(2)})`;
            ctx.beginPath();
            ctx.arc(x, y - 6, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
