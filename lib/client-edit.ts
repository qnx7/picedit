// Client-side image editing.
//
// On a static host (GitHub Pages) there is no server / API route, so editing
// runs directly in the browser. A key is read from NEXT_PUBLIC_OPENAI_API_KEY,
// which is baked in at build time.
//
// NOTE: Calling the OpenAI API from the browser exposes the key to users and
// may be blocked by CORS. For real production editing, deploy on a host with
// serverless functions (e.g. Vercel) and keep the key server-side. For this
// static demo, the app gracefully shows a "not configured" state when no key
// is present.

import type { EditImageParams, EditImageResult } from '@/lib/image-editing';

export function isClientApiConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_OPENAI_API_KEY);
}

export async function editImageClient(params: EditImageParams): Promise<EditImageResult> {
  const key = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  // No key configured → tell the UI to show the friendly "not configured" notice.
  if (!key) {
    return { success: false, error: 'IMAGE_EDITING_NOT_CONFIGURED', isPlaceholder: true };
  }

  try {
    const { imageBase64, mimeType, prompt } = params;

    // Decode base64 → binary Blob for the multipart upload.
    const byteString = atob(imageBase64);
    const bytes = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      bytes[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });

    const formData = new FormData();
    formData.append('image', blob, 'image.png');
    formData.append('prompt', prompt);
    formData.append('n', '1');
    formData.append('size', '1024x1024');
    formData.append('response_format', 'b64_json');

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}` },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message ?? `API error: ${response.status}`);
    }

    const data = await response.json();
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) throw new Error('No image data returned from API');

    return { success: true, imageBase64: b64, mimeType: 'image/png' };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error during image editing';
    return { success: false, error: message };
  }
}
