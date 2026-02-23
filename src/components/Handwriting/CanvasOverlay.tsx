import { useEffect, useRef, useCallback, useState } from 'react';
import { CanvasOverlayProps, HandwritingStroke, Point } from '../../types';
import { useSession } from '../../context/SessionContext';

export const CanvasOverlay: React.FC<CanvasOverlayProps> = ({
  mode,
  initialStrokes = [],
  allowInput = true,
  onStrokesChange,
  width = 800,
  height = 1000
}) => {
  const { state } = useSession();
  const allowFinger = state.allowTouch;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const strokesRef = useRef<HandwritingStroke[]>(initialStrokes);

  // Sync strokesRef when initialStrokes changes (e.g., on Clear)
  useEffect(() => {
    strokesRef.current = initialStrokes;
    if (initialStrokes.length === 0 && isReady) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
      }
    }
  }, [initialStrokes, isReady, width, height]);

  const currentStrokeRef = useRef<HandwritingStroke | null>(null);
  const isDrawingRef = useRef(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    setIsReady(true);
  }, [width, height]);

  // Redisplay saved strokes
  useEffect(() => {
    if (mode === 'redisplay' && isReady) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      // Clear and redraw all strokes
      ctx.clearRect(0, 0, width, height);
      initialStrokes.forEach(stroke => drawStroke(ctx, stroke));
    }
  }, [mode, initialStrokes, isReady, width, height]);

  // Draw a single stroke
  const drawStroke = useCallback((ctx: CanvasRenderingContext2D, stroke: HandwritingStroke) => {
    if (stroke.points.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;

    stroke.points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });

    ctx.stroke();
  }, []);

  // Get canvas coordinates from pointer event with normalization for visual scaling
  const getCanvasPoint = useCallback((e: React.PointerEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    // Calculate the ratio between the logical canvas size and the actual visual size
    // This ensures coordinates match even when the browser scales the canvas down for mobile
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }, [width, height]);

  // Handle pointer down
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (mode !== 'write' || !allowInput) return;

    // Stylus-only check
    if (!allowFinger && e.pointerType !== 'pen') {
      return;
    }

    e.preventDefault();
    isDrawingRef.current = true;

    const point = getCanvasPoint(e);
    currentStrokeRef.current = {
      points: [point],
      timestamp: Date.now(),
      tool: e.pointerType as 'stylus' | 'finger'
    };

    // Capture pointer
    canvasRef.current?.setPointerCapture(e.pointerId);
  }, [mode, allowInput, allowFinger, getCanvasPoint]);

  // Handle pointer move
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDrawingRef.current || mode !== 'write') return;
    if (!currentStrokeRef.current) return;

    e.preventDefault();

    const point = getCanvasPoint(e);
    currentStrokeRef.current.points.push(point);

    // Draw current stroke
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && currentStrokeRef.current) {
      drawStroke(ctx, currentStrokeRef.current);
    }
  }, [mode, getCanvasPoint, drawStroke]);

  // Handle pointer up
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDrawingRef.current || mode !== 'write') return;

    e.preventDefault();
    isDrawingRef.current = false;

    if (currentStrokeRef.current) {
      strokesRef.current = [...strokesRef.current, currentStrokeRef.current];
      onStrokesChange?.(strokesRef.current);
      currentStrokeRef.current = null;
    }

    canvasRef.current?.releasePointerCapture(e.pointerId);
  }, [mode, onStrokesChange]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 ${mode === 'write' ? 'cursor-crosshair' : 'cursor-default'}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        touchAction: 'none',
        pointerEvents: mode === 'write' ? 'auto' : 'none',
        zIndex: 10,
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
        WebkitTouchCallout: 'none'
      }}
    />
  );
};

export default CanvasOverlay;
