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

  // Draw a single stroke with smoothing (ballpoint pen effect)
  const drawStroke = useCallback((ctx: CanvasRenderingContext2D, stroke: HandwritingStroke) => {
    if (stroke.points.length < 2) return;

    // Deep ballpoint blue color with very slight opacity for realism
    ctx.strokeStyle = 'rgba(12, 36, 97, 0.9)';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const pts = stroke.points;

    // Base properties
    const MIN_WIDTH = 1.0;
    const MAX_WIDTH = 4.0;

    // We draw segment by segment to allow dynamic line widths based on pressure
    for (let i = 0; i < pts.length - 1; i++) {
        const currentRef = pts[i];
        const nextRef = pts[i + 1];

        // Smoothly interpolate the width based on the pressure of the upcoming point
        // If pressure is undefined, use the default 0.5
        const pressure = nextRef.pressure !== undefined ? nextRef.pressure : 0.5;
        const targetWidth = MIN_WIDTH + (pressure * (MAX_WIDTH - MIN_WIDTH));

        ctx.beginPath();
        // Fallback smoothing: if no pressure device, just keep width steady
        ctx.lineWidth = targetWidth;

        if (i === 0) {
            ctx.moveTo(currentRef.x, currentRef.y);
            ctx.lineTo(nextRef.x, nextRef.y);
        } else {
            // Bezier curve using midpoint for smoothness
            const prevRef = pts[i - 1];
            const midPoint1 = { x: (prevRef.x + currentRef.x) / 2, y: (prevRef.y + currentRef.y) / 2 };
            const midPoint2 = { x: (currentRef.x + nextRef.x) / 2, y: (currentRef.y + nextRef.y) / 2 };
            
            ctx.moveTo(midPoint1.x, midPoint1.y);
            ctx.quadraticCurveTo(currentRef.x, currentRef.y, midPoint2.x, midPoint2.y);
        }

        ctx.stroke();
    }

  }, []);

  // Get canvas coordinates from pointer event with normalization for visual scaling
  const getCanvasPoint = useCallback((e: React.PointerEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: e.pressure || 0.5 };

    const rect = canvas.getBoundingClientRect();

    // Calculate the ratio between the logical canvas size and the actual visual size
    // This ensures coordinates match even when the browser scales the canvas down for mobile
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      pressure: e.pointerType === 'pen' ? (e.pressure || 0.5) : 0.5 // Default pressure for mouse/finger is 0.5
    };
  }, [width, height]);

  // Handle pointer down
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (mode !== 'write' || !allowInput) return;

    // Stylus-only check
    if (!allowFinger && e.pointerType !== 'pen') {
      return;
    }

    // Palm Rejection Check: if touch is enabled but geometry suggests a palm instead of a finger
    if (allowFinger && e.pointerType === 'touch') {
      // Typical finger has width/height < 20-30. If it's very large, it's likely a resting palm.
      // e.pressure could also be used for pens, but this is specific for touch palm rejection.
      if (e.width && e.width > 40 || e.height && e.height > 40) {
        return;
      }
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
      className={`absolute top-0 left-0 ${mode === 'write' ? 'cursor-crosshair' : 'cursor-default'} no-select`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }} // Prevent long-press menu on mobile
      style={{
        touchAction: 'none', // Strictly prevent browser scrolling
        pointerEvents: mode === 'write' ? 'auto' : 'none',
        zIndex: 10,
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
        WebkitTouchCallout: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
    />
  );
};

export default CanvasOverlay;
