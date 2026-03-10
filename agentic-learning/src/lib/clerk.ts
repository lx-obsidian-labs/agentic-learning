export function getOptimizedImageUrl(
  imageUrl: string | null | undefined,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    fit?: 'scale-down' | 'crop';
  } = {}
): string | undefined {
  if (!imageUrl) return undefined;

  const { width = 200, height = 200, quality = 85, fit = 'crop' } = options;

  const params = new URLSearchParams();
  params.set('width', width.toString());
  params.set('height', height.toString());
  params.set('quality', quality.toString());
  params.set('fit', fit);

  return `${imageUrl}?${params.toString()}`;
}
