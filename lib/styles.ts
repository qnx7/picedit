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
      'Edit this image into a dark, cinematic Instagram aesthetic. Increase contrast, deepen shadows, reduce oversaturated colors, add a moody premium look, keep the subject realistic and natural, preserve facial identity and details.',
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
      'Edit this image into a clean minimalist Instagram aesthetic. Bright whites, airy light, soft shadows, very low saturation, clean modern look, refined lifestyle feel, preserve all natural details and subject identity.',
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
      'Edit this image into a luxury beige Instagram aesthetic. Use warm neutral tones, soft highlights, creamy shadows, elegant minimal color grading, premium lifestyle look, realistic skin tones, preserve all original details.',
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
      'Edit this image into a film grain analog photo style. Add subtle grain texture, faded film tones, slight color shift, 35mm aesthetic, nostalgic warmth, soft vignette, preserve original subject and composition.',
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
      'Edit this image into a streetwear editorial photo style. Add urban contrast, sharp details, slightly desaturated tones, fashion magazine look, clean shadows, realistic textures, preserve the original subject.',
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
      'Edit this image into a soft glow Instagram aesthetic. Add a gentle dreamy glow, soft pastel tones, light bokeh, warm luminous highlights, heavenly soft light, feminine and delicate feel, preserve original subject and details.',
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
      'Edit this image into a moody night Instagram aesthetic. Deep blue and teal tones, high contrast, dramatic shadows, city night atmosphere, cool color grading, cinematic mood, preserve subject identity and details.',
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
      'Edit this image with high contrast photo editing. Punch up the blacks and whites, increase color vibrancy, sharp crisp details, bold tones, graphic editorial look, strong visual impact, preserve subject realism.',
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
      'Edit this image into a vintage warm Instagram aesthetic. Golden warm tones, sun-faded effect, slight orange-yellow color cast, retro film warmth, nostalgic summer feel, soft highlights, preserve all original details.',
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
      'Edit this image into a polished Instagram model aesthetic. Smooth vibrant tones, beautiful skin enhancement, soft but defined lighting, social media ready look, flattering color grading, glamorous yet natural, preserve facial identity.',
  },
];

export function getStyleById(id: string): PresetStyle | undefined {
  return PRESET_STYLES.find((s) => s.id === id);
}
