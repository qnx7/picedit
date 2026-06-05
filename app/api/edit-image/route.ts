import { NextRequest, NextResponse } from 'next/server';
import { getStyleById } from '@/lib/styles';
import { MAX_FILE_SIZE } from '@/lib/utils';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType, styleId } = body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return NextResponse.json({ error: 'Missing imageBase64' }, { status: 400 });
    }
    if (!mimeType || !['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(mimeType)) {
      return NextResponse.json({ error: 'Invalid image type' }, { status: 400 });
    }
    if (!styleId) {
      return NextResponse.json({ error: 'Missing styleId' }, { status: 400 });
    }

    const estimatedBytes = (imageBase64.length * 3) / 4;
    if (estimatedBytes > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Image exceeds 10 MB limit' }, { status: 413 });
    }

    const style = getStyleById(styleId);
    if (!style) {
      return NextResponse.json({ error: 'Unknown styleId' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'IMAGE_EDITING_NOT_CONFIGURED', message: 'Add OPENAI_API_KEY to environment variables.' },
        { status: 503 }
      );
    }

    // Decode base64 → binary for the multipart upload
    const byteString = atob(imageBase64);
    const bytes = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      bytes[i] = byteString.charCodeAt(i);
    }

    // Use gpt-image-1 edit endpoint — accepts JPEG/PNG/WebP without transparency requirement
    const ext = mimeType === 'image/jpeg' || mimeType === 'image/jpg' ? 'jpg' : mimeType === 'image/webp' ? 'webp' : 'png';
    const blob = new Blob([bytes], { type: mimeType });

    const formData = new FormData();
    formData.append('model', 'gpt-image-1');
    formData.append('image[]', blob, `image.${ext}`);
    formData.append('prompt', style.prompt);
    formData.append('n', '1');
    formData.append('size', '1024x1024');

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = errData?.error?.message ?? `API error ${response.status}`;
      console.error('[edit-image] OpenAI error:', msg);
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const data = await response.json();
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) {
      return NextResponse.json({ error: 'No image returned from API' }, { status: 500 });
    }

    return NextResponse.json({ success: true, imageBase64: b64, mimeType: 'image/png' });
  } catch (err) {
    console.error('[edit-image] Unhandled error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
