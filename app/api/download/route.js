import { promises as fs } from 'fs'
import path from 'path'

export async function GET(req) {
  try {
    // Get the correct path to the font file
    const filePath = path.join(process.cwd(), 'public', 'MY.woff2')

    // Read the file
    const fileBuffer = await fs.readFile(filePath)

    // Set the appropriate headers
    const headers = new Headers()
    headers.set('Content-Type', 'font/woff2')
    headers.set('Content-Disposition', 'attachment; filename="IRANSansXV.woff2"')

    // Return the file as a response
    return new Response(fileBuffer, {
      headers: headers,
      status: 200,
    })
  } catch (error) {
    console.error(error)
    return new Response('Failed to download font', { status: 500 })
  }
}
