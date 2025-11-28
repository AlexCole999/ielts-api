import sharp from "sharp"

export async function compressImage(buffer) {
  return await sharp(buffer)
    .resize({ width: 900, withoutEnlargement: true })
    .jpeg({ quality: 75 })
    .toBuffer()
}
