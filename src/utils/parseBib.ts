import * as bibtexParse from 'bibtex-parse'

export interface Paper {
  key: string
  title: string
  authors: string[]
  journal: string
  year: number
  volume?: string
  number?: string
  pages?: string
  doi?: string
  code?: string
}

export function parseBibFile(bibContent: string): Paper[] {
  const entries = bibtexParse.entries(bibContent)

  return entries.map(entry => {
    // 解析作者：将 "Last, First and Last2, First2" 格式转换为数组
    const authorsRaw = entry.AUTHOR || ''
    const authors = authorsRaw
      .split(' and ')
      .map(author => {
        const parts = author.trim().split(', ')
        if (parts.length === 2) {
          return `${parts[1]} ${parts[0]}` // "First Last" 格式
        }
        return author.trim()
      })
      .filter(a => a.length > 0)

    return {
      key: entry.key || '',
      title: entry.TITLE || '',
      authors,
      journal: entry.JOURNAL || entry.BOOKTITLE || '',
      year: parseInt(entry.YEAR || '0', 10),
      volume: entry.VOLUME,
      number: entry.NUMBER,
      pages: entry.PAGES,
      doi: entry.DOI,
      code: entry.CODE,
    }
  })
}

// 按年份分组
export function groupByYear(papers: Paper[]): { year: number; papers: Paper[] }[] {
  const grouped = new Map<number, Paper[]>()

  papers.forEach(paper => {
    const existing = grouped.get(paper.year) || []
    existing.push(paper)
    grouped.set(paper.year, existing)
  })

  // 按年份降序排列
  return Array.from(grouped.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, papers]) => ({ year, papers }))
}

// 获取期刊简称
export function getJournalAbbr(journal: string): string {
  const abbreviations: Record<string, string> = {
    'Briefings in Bioinformatics': 'Brief Bioinform',
    'Bioinformatics': 'Bioinformatics',
    'Nature': 'Nature',
    'Science': 'Science',
    'Cell': 'Cell',
    'Nature Methods': 'Nat Methods',
    'Nature Communications': 'Nat Commun',
    'Nucleic Acids Research': 'NAR',
    'PNAS': 'PNAS',
    'PLoS Computational Biology': 'PLoS Comput Biol',
  }
  return abbreviations[journal] || journal.split(' ').slice(0, 2).join(' ')
}
