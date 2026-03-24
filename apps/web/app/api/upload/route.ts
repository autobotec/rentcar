import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")
const MAX_SIZE_BYTES = 4 * 1024 * 1024 // 4 MB
const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".svg"]
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]

function getExt(name: string): string {
  const ext = path.extname(name).toLowerCase()
  return ext || ""
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "Falta el archivo 'file'" },
        { status: 400 }
      )
    }

    const ext = getExt(file.name)
    if (!ALLOWED_EXT.includes(ext)) {
      return NextResponse.json(
        {
          error: `Formato no permitido. Use: ${ALLOWED_EXT.join(", ")}`,
        },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    if (buffer.length > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "El archivo no puede superar 4 MB" },
        { status: 400 }
      )
    }

    const type = file.type?.toLowerCase()
    if (type && !ALLOWED_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Tipo de imagen no permitido. Use JPG, PNG, WEBP o SVG." },
        { status: 400 }
      )
    }

    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    await mkdir(UPLOAD_DIR, { recursive: true })
    const filePath = path.join(UPLOAD_DIR, safeName)
    await writeFile(filePath, buffer)
    const url = `/uploads/${safeName}`
    return NextResponse.json({ url })
  } catch (err) {
    console.error("Upload error:", err)
    return NextResponse.json(
      { error: "Error al subir el archivo" },
      { status: 500 }
    )
  }
}

