const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || ""

export function LocalBusinessJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "EsAnibal Rent Car",
    description: "Alquiler de coches en República Dominicana. Punta Cana, Santo Domingo y más.",
    ...(SITE_URL && { url: SITE_URL }),
    areaServed: {
      "@type": "Country",
      name: "Dominican Republic",
    },
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  currency,
  url,
}: {
  name: string
  description: string | null
  image: string | undefined
  price: number
  currency: string
  url: string
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description || name,
    ...(image && { image }),
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
    },
    url,
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
