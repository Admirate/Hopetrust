const SUPABASE_URL = 'https://mcrhgsyudgdgzfikbofr.supabase.co';
const BUCKET = 'hopetrust%20assets';

export function getAssetUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(cleanPath)}`;
}
