const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mcrhgsyudgdgzfikbofr.supabase.co';
const BUCKET = 'hopetrust%20assets';

export function getStorageUrl(bucket: string, path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${encodeURIComponent(cleanPath)}`;
}

export function getAssetUrl(path: string): string {
  return getStorageUrl(BUCKET, path);
}

export function getLogoUrl(): string {
  return getAssetUrl('logo1.png');
}
