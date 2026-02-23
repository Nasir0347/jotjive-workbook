import { HandwritingStroke, Point } from '../types';

/**
 * Render a single stroke to canvas context
 */
export function renderStroke(
  ctx: CanvasRenderingContext2D, 
  stroke: HandwritingStroke,
  options: {
    color?: string;
    width?: number;
    opacity?: number;
  } = {}
): void {
  const { 
    color = '#000000', 
    width = 2.5, 
    opacity = 1 
  } = options;

  if (stroke.points.length < 2) return;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  stroke.points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });

  ctx.stroke();
  ctx.restore();
}

/**
 * Render multiple strokes to canvas
 */
export function renderStrokes(
  canvas: HTMLCanvasElement,
  strokes: HandwritingStroke[],
  options?: {
    color?: string;
    width?: number;
    opacity?: number;
  }
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  strokes.forEach(stroke => renderStroke(ctx, stroke, options));
}

/**
 * Clear canvas
 */
export function clearCanvas(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Smooth stroke points using simple moving average
 */
export function smoothStroke(stroke: HandwritingStroke, factor: number = 0.5): HandwritingStroke {
  if (stroke.points.length < 3) return stroke;

  const smoothed: Point[] = [];
  const points = stroke.points;

  // Keep first point
  smoothed.push(points[0]);

  // Smooth middle points
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    smoothed.push({
      x: curr.x * (1 - factor) + (prev.x + next.x) / 2 * factor,
      y: curr.y * (1 - factor) + (prev.y + next.y) / 2 * factor
    });
  }

  // Keep last point
  smoothed.push(points[points.length - 1]);

  return {
    ...stroke,
    points: smoothed
  };
}

/**
 * Calculate stroke bounding box
 */
export function getStrokeBounds(stroke: HandwritingStroke): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  const xs = stroke.points.map(p => p.x);
  const ys = stroke.points.map(p => p.y);

  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}

/**
 * Serialize strokes to JSON (for export if needed in future)
 */
export function serializeStrokes(strokes: HandwritingStroke[]): string {
  return JSON.stringify(strokes);
}

/**
 * Deserialize strokes from JSON
 */
export function deserializeStrokes(json: string): HandwritingStroke[] {
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}
