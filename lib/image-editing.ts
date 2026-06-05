// Image editing service — swap editImage() with your real provider integration

export interface EditImageParams {
  imageBase64: string;
  mimeType: string;
  prompt: string;
  styleId: string;
}

export interface EditImageResult {
  success: boolean;
  imageBase64?: string;
  mimeType?: string;
  error?: string;
  isPlaceholder?: boolean;
}

// Returns true when a real API key is present and ready
export function isApiConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

// Primary entry point — plug your image editing provider in here
export async function editImage(params: EditImageParams): Promise<EditImageResult> {
  if (!isApiConfigured()) {
    return {
      success: false,
      error: 'IMAGE_EDITING_NOT_CONFIGURED',
      isPlaceholder: true,
    };
  }

  return editWithOpenAI(params);
}

// OpenAI DALL-E 2 image editing via the /edits endpoint
async function editWithOpenAI(params: EditImageParams): Promise<EditImageResult> {
  try {
    const { imageBase64, mimeType, prompt } = params;

    // Convert base64 to a Blob for the multipart form upload
    const byteString = atob(imageBase64);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: mimeType });

    const formData = new FormData();
    formData.append('image', blob, 'image.png');
    formData.append('prompt', prompt);
    formData.append('n', '1');
    formData.append('size', '1024x1024');
    formData.append('response_format', 'b64_json');

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
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
