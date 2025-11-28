import ffmpeg from "fluent-ffmpeg"
import { tmpdir } from "os"
import { join } from "path"
import { writeFile, readFile, unlink } from "fs/promises"

export async function compressAudio(buffer) {
  const input = join(tmpdir(), `input-${Date.now()}.mp3`)
  const output = join(tmpdir(), `output-${Date.now()}.mp3`)

  await writeFile(input, buffer)

  await new Promise((resolve, reject) => {
    ffmpeg(input)
      .audioBitrate(128)
      .save(output)
      .on("end", resolve)
      .on("error", reject)
  })

  const compressed = await readFile(output)

  await unlink(input)
  await unlink(output)

  return compressed
}
