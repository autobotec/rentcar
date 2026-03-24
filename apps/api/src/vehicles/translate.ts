/**
 * Traduce texto usando la API pública de LibreTranslate.
 * Si falla (red, límite, etc.) devuelve el texto original.
 */
const LIBRE_URL = 'https://libretranslate.com/translate'

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string,
): Promise<string> {
  if (!text?.trim() || sourceLang === targetLang) return text
  try {
    const res = await fetch(LIBRE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
      }),
    })
    if (!res.ok) return text
    const data = (await res.json()) as { translatedText?: string }
    return data.translatedText ?? text
  } catch {
    return text
  }
}

/** Asume idioma fuente español; devuelve { es, en, fr } para brand, model, description */
export async function translateVehicleTexts(
  brand: string,
  model: string,
  description: string | null,
): Promise<{ es: { brand: string; model: string; description: string | null }; en: { brand: string; model: string; description: string | null }; fr: { brand: string; model: string; description: string | null } }> {
  const es = {
    brand: brand.trim(),
    model: model.trim(),
    description: description?.trim() || null,
  }
  const [en, fr] = await Promise.all([
    translateTo('en', es),
    translateTo('fr', es),
  ])
  return { es, en, fr }
}

async function translateTo(
  target: 'en' | 'fr',
  source: { brand: string; model: string; description: string | null },
) {
  const [brand, model, description] = await Promise.all([
    translateText(source.brand, 'es', target),
    translateText(source.model, 'es', target),
    source.description
      ? translateText(source.description, 'es', target)
      : Promise.resolve(null),
  ])
  return { brand, model, description }
}
