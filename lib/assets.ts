const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mcrhgsyudgdgzfikbofr.supabase.co';
const BUCKET = 'hopetrust%20assets';

export function getAssetUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(cleanPath)}`;
}

export function getLogoUrl(): string {
  return getAssetUrl('logo1.png');
}
