import { NextRequest, NextResponse } from 'next/server';
import { editImage, isApiConfigured } from '@/lib/image-editing';
import { getStyleById } from '@/lib/styles';
import { MAX_FILE_SIZE } from '@/lib/utils';

export const maxDuration = 60; // seconds — Vercel hobby plan max

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType, styleId } = body;

    // --- Input validation ---
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid imageBase64' }, { status: 400 });
    }
    if (!mimeType || !['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
      return NextResponse.json({ error: 'Invalid or unsupported image type' }, { status: 400 });
    }
    if (!styleId || typeof styleId !== 'string') {
      return NextResponse.json({ error: 'Missing styleId' }, { status: 400 });
    }

    // Rough size check on base64 (base64 overhead ~33%)
    const estimatedBytes = (imageBase64.length * 3) / 4;
    if (estimatedBytes > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Image exceeds 10 MB limit' }, { status: 413 });
    }

    const style = getStyleById(styleId);
    if (!style) {
      return NextResponse.json({ error: 'Unknown styleId' }, { status: 400 });
    }

    // --- API availability check ---
    if (!isApiConfigured()) {
      return NextResponse.json(
        {
          error: 'IMAGE_EDITING_NOT_CONFIGURED',
          message:
            'AI image editing is not configured. Add OPENAI_API_KEY to your environment variables.',
        },
        { status: 503 }
      );
    }

    // --- Edit ---
    const result = await editImage({
      imageBase64,
      mimeType,
      prompt: style.prompt,
      styleId,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      imageBase64: result.imageBase64,
      mimeType: result.mimeType,
    });
  } catch (err) {
    console.error('[edit-image] Unhandled error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
