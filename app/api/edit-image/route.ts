import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { getStyleById } from '@/lib/styles';
import { MAX_FILE_SIZE } from '@/lib/utils';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType, styleId, format = 'post' } = body;

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
        { error: 'IMAGE_EDITING_NOT_CONFIGURED' },
        { status: 503 }
      );
    }

    const inputBuffer = Buffer.from(imageBase64, 'base64');

    // The OpenAI edit endpoint only reliably accepts 1024x1024 PNG.
    // We always send square; for Story we extend the result afterwards.
    const squarePng = await sharp(inputBuffer)
      .resize(1024, 1024, { fit: 'cover', position: 'centre' })
      .png()
      .toBuffer();

    const squareBlob = new Blob(
      [squarePng.buffer.slice(squarePng.byteOffset, squarePng.byteOffset + squarePng.byteLength) as ArrayBuffer],
      { type: 'image/png' }
    );

    const formData = new FormData();
    formData.append('model', 'gpt-image-1');
    formData.append('image[]', squareBlob, 'image.png');
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
      const msg = errData?.error?.message ?? `OpenAI API error ${response.status}`;
      console.error('[edit-image] OpenAI error:', msg);
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    const data = await response.json();
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) {
      return NextResponse.json({ error: 'No image returned from API' }, { status: 500 });
    }

    let finalBase64 = b64;

    // For Story (9:16): extend the 1024x1024 result to 1024×1820 by placing it
    // centered over a blurred version of itself — the classic Instagram story look.
    if (format === 'story') {
      const editedBuf = Buffer.from(b64, 'base64');
      const storyH = 1820; // 1024 × (16/9) ≈ 1820

      // Blurred, scaled background
      const bgBuf = await sharp(editedBuf)
        .resize(1024, storyH, { fit: 'cover', position: 'centre' })
        .blur(24)
        .png()
        .toBuffer();

      // Centre the edited square over it
      const top = Math.round((storyH - 1024) / 2);
      const storyBuf = await sharp(bgBuf)
        .composite([{ input: editedBuf, top, left: 0 }])
        .png()
        .toBuffer();

      finalBase64 = storyBuf.toString('base64');
    }

    return NextResponse.json({
      success: true,
      imageBase64: finalBase64,
      mimeType: 'image/png',
      format,
    });
  } catch (err) {
    console.error('[edit-image] Unhandled error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
