import React, { useRef, useState, useEffect } from "react";
import chroma from "chroma-js";

const SIZE = 300;

function ColorWheelSelector({ onPolygonSelect }) {
  const canvasRef = useRef(null);
  const [polygon, setPolygon] = useState([]);

  useEffect(() => {
    drawColorWheel();
    drawPolygon();
  }, [polygon]);

  // Draw the color wheel
  const drawColorWheel = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(SIZE, SIZE);
    const data = imageData.data;

    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const dx = x - SIZE / 2;
        const dy = y - SIZE / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > SIZE / 2) continue;

        const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 180;
        const sat = distance / (SIZE / 2);
        const [r, g, b] = chroma.hsv(angle, sat, 1).rgb();

        const idx = (y * SIZE + x) * 4;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // Draw the polygon and its points
  const drawPolygon = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (polygon.length === 0) return;

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(polygon[0].x, polygon[0].y);

    for (let i = 1; i < polygon.length; i++) {
      ctx.lineTo(polygon[i].x, polygon[i].y);
    }

    ctx.closePath();
    ctx.stroke();

    // Draw point indicators
    polygon.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    });
  };

  // Handle user clicking to add polygon points
  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPolygon((prev) => [...prev, { x, y }]);
  };

  // Finish polygon and send it up to the parent
  const handleFinishPolygon = () => {
    const rgbPolygon = polygon.map(({ x, y }) => {
      const dx = x - SIZE / 2;
      const dy = y - SIZE / 2;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 180;
      const sat = Math.sqrt(dx * dx + dy * dy) / (SIZE / 2);
      const [r, g, b] = chroma.hsv(angle, sat, 1).rgb();
      return [r, g, b];
    });

    onPolygonSelect(rgbPolygon); // Send polygon to parent
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        style={{ borderRadius: "50%", cursor: "crosshair" }}
        onClick={handleClick}
      />
      <br />
      <button onClick={handleFinishPolygon} disabled={polygon.length < 3}>
        ✅ Use Selected Polygon
      </button>
      <button onClick={() => setPolygon([])}>❌ Reset</button>
    </div>
  );
}

export default ColorWheelSelector;