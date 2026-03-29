/** BCP 47 para fechas (tablas admin, reservas). Sin dependencias de servidor. */
export function dateLocaleTag(locale: string): string {
  if (locale === "fr") return "fr-FR"
  if (locale === "en") return "en-US"
  return "es-DO"
}
