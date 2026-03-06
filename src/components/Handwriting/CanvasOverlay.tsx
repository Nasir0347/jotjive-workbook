import { useEffect, useRef, useCallback, useState, useImperativeHandle, forwardRef, memo } from 'react';
import { CanvasOverlayProps, HandwritingStroke, Point } from '../../types';
import { useSession } from '../../context/SessionContext';

export interface CanvasOverlayRef {
  clear: () => void;
  toDataURL: () => string;
}

export const CanvasOverlay = memo(forwardRef<CanvasOverlayRef, CanvasOverlayProps>(({
  mode,
  initialStrokes = [],
  allowInput = true,
  onStrokesChange,
  width = 800,
  height = 1000,
  backgroundImage // New: for A-page redisplay
}, ref) => {
  const { state } = useSession();
  const allowFinger = state.allowTouch;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const strokesRef = useRef<HandwritingStroke[]>(initialStrokes);
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    clear: () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        // Also redraw background if present
        if (backgroundImage) {
          const img = new Image();
          img.onload = () => ctx.drawImage(img, 0, 0, width, height);
          img.src = backgroundImage;
        }
      }
      strokesRef.current = [];
      onStrokesChange?.([]);
    },
    toDataURL: () => {
      return canvasRef.current?.toDataURL('image/png') || '';
    }
  }));

  // Sync strokesRef when initialStrokes changes (e.g., on Clear)
  useEffect(() => {
    strokesRef.current = initialStrokes;
    if (initialStrokes.length === 0 && isReady) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        if (backgroundImage) {
          const img = new Image();
          img.onload = () => ctx.drawImage(img, 0, 0, width, height);
          img.src = backgroundImage;
        }
      }
    }
  }, [initialStrokes, isReady, width, height, backgroundImage]);

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

  // Redisplay saved strokes or background image
  useEffect(() => {
    if (isReady) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      // Clear
      ctx.clearRect(0, 0, width, height);

      // Draw background image first (Q-page capture for A-page)
      if (backgroundImage) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          // Then draw strokes on top
          initialStrokes.forEach(stroke => drawStroke(ctx, stroke));
        };
        img.src = backgroundImage;
      } else {
        // Redraw all strokes
        initialStrokes.forEach(stroke => drawStroke(ctx, stroke));
      }
    }
  }, [mode, initialStrokes, isReady, width, height, backgroundImage]);

  // Draw a single stroke with smoothing (ballpoint pen effect)
  const drawStroke = useCallback((ctx: CanvasRenderingContext2D, stroke: HandwritingStroke) => {
    if (stroke.points.length < 2) return;

    // Blue ballpoint pen color
    ctx.strokeStyle = 'rgba(0, 71, 171, 0.9)'; // Blue ballpoint pen color
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const pts = stroke.points;

    // Base properties
    const MIN_WIDTH = 1.0;
    const MAX_WIDTH = 4.0;

    for (let i = 0; i < pts.length - 1; i++) {
      const currentRef = pts[i];
      const nextRef = pts[i + 1];

      const pressure = nextRef.pressure !== undefined ? nextRef.pressure : 0.5;
      const targetWidth = MIN_WIDTH + (pressure * (MAX_WIDTH - MIN_WIDTH));

      ctx.beginPath();
      ctx.lineWidth = targetWidth;

      if (i === 0) {
        ctx.moveTo(currentRef.x, currentRef.y);
        ctx.lineTo(nextRef.x, nextRef.y);
      } else {
        const prevRef = pts[i - 1];
        const midPoint1 = { x: (prevRef.x + currentRef.x) / 2, y: (prevRef.y + currentRef.y) / 2 };
        const midPoint2 = { x: (currentRef.x + nextRef.x) / 2, y: (currentRef.y + nextRef.y) / 2 };

        ctx.moveTo(midPoint1.x, midPoint1.y);
        ctx.quadraticCurveTo(currentRef.x, currentRef.y, midPoint2.x, midPoint2.y);
      }

      ctx.stroke();
    }

  }, []);

  // Helper function to check if a stroke intersects with eraser point
  const isStrokeNearPoint = useCallback((stroke: HandwritingStroke, point: Point, radius: number): boolean => {
    // Check if any point in the stroke is within the eraser radius
    return stroke.points.some(p => {
      const dx = p.x - point.x;
      const dy = p.y - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance <= radius;
    });
  }, []);

  const getCanvasPoint = useCallback((e: React.PointerEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: e.pressure || 0.5 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      pressure: e.pointerType === 'pen' ? (e.pressure || 0.5) : 0.5
    };
  }, [width, height]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if ((mode !== 'write' && mode !== 'erase') || !allowInput) return;
    if (!allowFinger && e.pointerType !== 'pen') return;

    if (allowFinger && e.pointerType === 'touch') {
      if (e.width && e.width > 40 || e.height && e.height > 40) return;
    }

    e.preventDefault();
    isDrawingRef.current = true;
    const point = getCanvasPoint(e);

    if (mode === 'erase') {
      // Eraser mode: find and remove strokes that intersect with the eraser point
      const eraserRadius = 20; // Eraser size
      const updatedStrokes = strokesRef.current.filter(stroke => {
        return !isStrokeNearPoint(stroke, point, eraserRadius);
      });

      if (updatedStrokes.length !== strokesRef.current.length) {
        strokesRef.current = updatedStrokes;
        onStrokesChange?.(updatedStrokes);

        // Redraw canvas
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, width, height);
          if (backgroundImage) {
            const img = new Image();
            img.onload = () => {
              ctx.drawImage(img, 0, 0, width, height);
              updatedStrokes.forEach(stroke => drawStroke(ctx, stroke));
            };
            img.src = backgroundImage;
          } else {
            updatedStrokes.forEach(stroke => drawStroke(ctx, stroke));
          }
        }
      }
    } else {
      // Write mode
      currentStrokeRef.current = {
        points: [point],
        timestamp: Date.now(),
        tool: e.pointerType as 'stylus' | 'finger'
      };
    }

    canvasRef.current?.setPointerCapture(e.pointerId);
  }, [mode, allowInput, allowFinger, getCanvasPoint, onStrokesChange, width, height, backgroundImage, drawStroke, isStrokeNearPoint]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDrawingRef.current || (mode !== 'write' && mode !== 'erase')) return;
    const point = getCanvasPoint(e);
    e.preventDefault();

    if (mode === 'erase') {
      // Continue erasing strokes as we move
      const eraserRadius = 20;
      const updatedStrokes = strokesRef.current.filter(stroke => {
        return !isStrokeNearPoint(stroke, point, eraserRadius);
      });

      if (updatedStrokes.length !== strokesRef.current.length) {
        strokesRef.current = updatedStrokes;
        onStrokesChange?.(updatedStrokes);

        // Redraw canvas
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, width, height);
          if (backgroundImage) {
            const img = new Image();
            img.onload = () => {
              ctx.drawImage(img, 0, 0, width, height);
              updatedStrokes.forEach(stroke => drawStroke(ctx, stroke));
            };
            img.src = backgroundImage;
          } else {
            updatedStrokes.forEach(stroke => drawStroke(ctx, stroke));
          }
        }
      }
    } else {
      // Write mode
      if (!currentStrokeRef.current) return;
      currentStrokeRef.current.points.push(point);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && currentStrokeRef.current) {
        drawStroke(ctx, currentStrokeRef.current);
      }
    }
  }, [mode, getCanvasPoint, drawStroke, isStrokeNearPoint, onStrokesChange, width, height, backgroundImage]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    isDrawingRef.current = false;

    if (mode === 'write' && currentStrokeRef.current) {
      strokesRef.current = [...strokesRef.current, currentStrokeRef.current];
      onStrokesChange?.(strokesRef.current);
      currentStrokeRef.current = null;
    }

    canvasRef.current?.releasePointerCapture(e.pointerId);
  }, [mode, onStrokesChange]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 ${mode === 'write' ? 'cursor-crosshair' : mode === 'erase' ? 'cursor-pointer' : 'cursor-default'} no-select`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
      style={{
        touchAction: 'none',
        pointerEvents: (mode === 'write' || mode === 'erase') ? 'auto' : 'none',
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
}));

CanvasOverlay.displayName = 'CanvasOverlay';

export default CanvasOverlay;
