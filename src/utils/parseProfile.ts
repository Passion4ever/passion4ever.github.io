import matter from 'gray-matter'
import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'
import fs from 'node:fs'
import path from 'node:path'

// 配置 KaTeX
marked.use(markedKatex({
  throwOnError: false,
  output: 'html',
}))

export interface Profile {
  name: string
  email?: string
  scholar?: string
  github?: string
  content: string  // HTML 内容
}

export function getProfile(): Profile {
  const profilePath = path.join(process.cwd(), 'src/data/profile.md')
  const fileContent = fs.readFileSync(profilePath, 'utf-8')
  const { data, content } = matter(fileContent)

  return {
    name: data.name || '',
    email: data.email,
    scholar: data.scholar,
    github: data.github,
    content: marked.parse(content) as string,
  }
}
