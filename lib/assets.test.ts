import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('getAssetUrl', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test-project.supabase.co');
  });

  it('returns correct Supabase Storage URL', async () => {
    const { getAssetUrl } = await import('./assets');
    const url = getAssetUrl('logo1.png');
    expect(url).toBe(
      'https://test-project.supabase.co/storage/v1/object/public/assets/logo1.png'
    );
  });

  it('strips leading slash from path', async () => {
    const { getAssetUrl } = await import('./assets');
    const url = getAssetUrl('/logo1.png');
    expect(url).toBe(
      'https://test-project.supabase.co/storage/v1/object/public/assets/logo1.png'
    );
  });

  it('encodes spaces in filenames', async () => {
    const { getAssetUrl } = await import('./assets');
    const url = getAssetUrl('Asset 10.png');
    expect(url).toBe(
      'https://test-project.supabase.co/storage/v1/object/public/assets/Asset%2010.png'
    );
  });

  it('handles filenames with special characters', async () => {
    const { getAssetUrl } = await import('./assets');
    const url = getAssetUrl('BACKGROUND CIRCLES.png');
    expect(url).toBe(
      'https://test-project.supabase.co/storage/v1/object/public/assets/BACKGROUND%20CIRCLES.png'
    );
  });
});
