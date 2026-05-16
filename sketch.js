const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  return ({ context, width, height }) => {
    // Background
    context.fillStyle = '#1a1a2e';
    context.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const count = 80;
    const radius = Math.min(width, height) * 0.38;

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 2;

      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;

      // Draw lines from center to each point
      context.beginPath();
      context.moveTo(cx, cy);
      context.lineTo(x, y);
      context.strokeStyle = `hsl(${t * 360}, 80%, 65%)`;
      context.lineWidth = 1.5;
      context.globalAlpha = 0.6;
      context.stroke();

      // Draw circles at each point
      context.beginPath();
      context.arc(x, y, 8, 0, Math.PI * 2);
      context.fillStyle = `hsl(${t * 360}, 90%, 70%)`;
      context.globalAlpha = 0.9;
      context.fill();
    }

    // Center circle
    context.globalAlpha = 1;
    context.beginPath();
    context.arc(cx, cy, 20, 0, Math.PI * 2);
    context.fillStyle = '#ffffff';
    context.fill();
  };
};

canvasSketch(sketch, settings);
