/** Fondo Punta Cana en todo el sitio público; el hero del home lo tapa con bg-black + vídeo. */
export function SitePublicBodyBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgb(255 255 255 / 0.32), rgb(255 255 255 / 0.45)), url(/punta_cana.png)",
      }}
    />
  )
}
