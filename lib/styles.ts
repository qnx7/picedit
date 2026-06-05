// Instagram preset style definitions with AI editing prompts

export interface PresetStyle {
  id: string;
  name: string;
  description: string;
  mood: string;
  emoji: string;
  gradient: string;
  accentColor: string;
  prompt: string;
}

export const PRESET_STYLES: PresetStyle[] = [
  {
    id: 'dark-aesthetic',
    name: 'Dark Aesthetic',
    description: 'Cinematic shadows and deep moody tones',
    mood: 'Mysterious · Premium',
    emoji: '🖤',
    gradient: 'from-gray-900 via-gray-800 to-gray-700',
    accentColor: '#6b7280',
    prompt:
      'Enhance this photo with a dark moody color grade. Deepen the shadows slightly, reduce brightness by a small amount, add subtle cool undertones, increase contrast gently, and reduce oversaturation. Keep everything in the photo exactly as it is — same people, same scene, same composition. Only adjust the color grading and lighting mood. The result should look like a professional dark Instagram edit.',
  },
  {
    id: 'clean-minimal',
    name: 'Clean Minimal',
    description: 'Airy whites, soft light, calm composition',
    mood: 'Calm · Refined',
    emoji: '🤍',
    gradient: 'from-slate-100 via-white to-gray-100',
    accentColor: '#94a3b8',
    prompt:
      'Enhance this photo with a clean minimal color grade. Slightly brighten the image, lift the shadows a touch, reduce saturation gently for a calm airy look, and soften highlights. Keep everything in the photo exactly as it is — same people, same scene, same composition. Only adjust the color grading and lighting. The result should look like a clean bright minimal Instagram photo.',
  },
  {
    id: 'luxury-beige',
    name: 'Luxury Beige',
    description: 'Warm neutrals, creamy highlights, elegant tones',
    mood: 'Elegant · Warm',
    emoji: '🍂',
    gradient: 'from-amber-100 via-orange-50 to-yellow-100',
    accentColor: '#d97706',
    prompt:
      'Enhance this photo with a warm beige luxury color grade. Add subtle warm golden tones, soften the highlights to a creamy look, bring up shadows slightly with warm fill, and reduce cool colors. Keep everything in the photo exactly as it is — same people, same scene, same composition. Only adjust the color grading. The result should feel like a high-end lifestyle Instagram photo.',
  },
  {
    id: 'film-grain',
    name: 'Film Grain',
    description: 'Analog texture, faded film, 35mm nostalgia',
    mood: 'Nostalgic · Textured',
    emoji: '📽️',
    gradient: 'from-yellow-900 via-amber-800 to-orange-900',
    accentColor: '#b45309',
    prompt:
      'Enhance this photo with a subtle analog film color grade. Add very light grain texture, slightly fade the blacks, add a gentle warm color shift, and soften contrast slightly for a film photography feel. Keep everything in the photo exactly as it is — same people, same scene, same composition. Only adjust the color grading and texture. The result should look like it was shot on 35mm film.',
  },
  {
    id: 'streetwear-editorial',
    name: 'Streetwear Editorial',
    description: 'Urban contrast, sharp fashion mag look',
    mood: 'Bold · Urban',
    emoji: '🏙️',
    gradient: 'from-zinc-900 via-zinc-700 to-stone-600',
    accentColor: '#71717a',
    prompt:
      'Enhance this photo with an editorial streetwear color grade. Sharpen the image slightly, add a touch more contrast, desaturate colors subtly for a fashion magazine tone, and deepen shadows just a little. Keep everything in the photo exactly as it is — same people, same scene, same composition. Only adjust the color grading. The result should look like a professional fashion editorial photo.',
  },
  {
    id: 'soft-glow',
    name: 'Soft Glow',
    description: 'Dreamy light, pastel warmth, heavenly softness',
    mood: 'Dreamy · Soft',
    emoji: '✨',
    gradient: 'from-pink-200 via-purple-100 to-indigo-100',
    accentColor: '#a78bfa',
    prompt:
      'Enhance this photo with a soft dreamy glow color grade. Gently brighten highlights, add very subtle warm pink or lavender tones, slightly soften the overall image, and lift shadows for an airy glowing look. Keep everything in the photo exactly as it is — same people, same scene, same composition. Only adjust the color grading and soft light. The result should feel dreamy and soft like a high-end Instagram photo.',
  },
  {
    id: 'moody-night',
    name: 'Moody Night',
    description: 'Deep blues, city lights, nocturnal energy',
    mood: 'Intense · Nocturnal',
    emoji: '🌙',
    gradient: 'from-blue-950 via-indigo-900 to-violet-900',
    accentColor: '#4f46e5',
    prompt:
      'Enhance this photo with a moody night color grade. Add subtle cool blue and teal tones, deepen shadows slightly, increase contrast a touch, and reduce warm colors a little. Keep everything in the photo exactly as it is — same people, same scene, same composition. Only adjust the color grading. The result should feel like a cinematic nighttime Instagram photo.',
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    description: 'Punchy blacks, vivid colors, graphic pop',
    mood: 'Vibrant · Punchy',
    emoji: '⚡',
    gradient: 'from-red-600 via-orange-500 to-yellow-400',
    accentColor: '#ef4444',
    prompt:
      'Enhance this photo with a punchy high-contrast color grade. Increase contrast moderately, deepen blacks slightly, boost color vibrancy a little, and sharpen the image subtly. Keep everything in the photo exactly as it is — same people, same scene, same composition. Only adjust the color grading. The result should look bold and vibrant like a professional Instagram photo with strong visual impact.',
  },
  {
    id: 'vintage-warm',
    name: 'Vintage Warm',
    description: 'Golden hour, sun-faded warmth, retro charm',
    mood: 'Retro · Golden',
    emoji: '🌅',
    gradient: 'from-orange-400 via-amber-300 to-yellow-300',
    accentColor: '#f59e0b',
    prompt:
      'Enhance this photo with a warm vintage color grade. Add a gentle golden-orange warmth, slightly fade the blacks, lift highlights to a warm glow, and add very subtle retro tones. Keep everything in the photo exactly as it is — same people, same scene, same composition. Only adjust the color grading. The result should feel warm and sun-kissed like a nostalgic golden hour Instagram photo.',
  },
  {
    id: 'instagram-model',
    name: 'Instagram Model Look',
    description: 'Flawless skin, vibrant pop, social-ready glam',
    mood: 'Glamorous · Vibrant',
    emoji: '💫',
    gradient: 'from-rose-400 via-pink-300 to-fuchsia-300',
    accentColor: '#ec4899',
    prompt:
      'Enhance this photo with a polished Instagram model color grade. Brighten the image slightly, smooth and even out skin tones subtly, add a gentle warm glow to highlights, boost colors a little for a vibrant flattering look. Keep everything in the photo exactly as it is — same people, same scene, same composition. Only adjust the color grading and light. The result should look polished and social-media ready.',
  },
];

export function getStyleById(id: string): PresetStyle | undefined {
  return PRESET_STYLES.find((s) => s.id === id);
}
