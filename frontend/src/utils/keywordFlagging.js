// Stop words to exclude from keyword extraction
const STOP_WORDS = new Set([
  'a', 'the', 'and', 'or', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'must', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their',
  'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom', 'why', 'how',
  'to', 'of', 'in', 'on', 'at', 'by', 'from', 'with', 'for', 'as', 'if', 'then',
  'an', 'but', 'not', 'no', 'yes', 'so', 'up', 'out', 'down', 'there', 'here'
])

// Extract keywords from text
export const extractKeywords = (text) => {
  if (!text) return []

  // Convert to lowercase and split into words
  const words = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 3) // Only words > 3 chars
    .filter(word => !STOP_WORDS.has(word))

  return words
}

// Get keyword frequency for a person across all their notes
export const getKeywordFrequency = (notesList) => {
  const keywords = {}

  notesList.forEach(note => {
    const extractedKeywords = extractKeywords(note.note_field_1)
    const extractedKeywords2 = extractKeywords(note.note_field_2)

    ;[...extractedKeywords, ...extractedKeywords2].forEach(keyword => {
      keywords[keyword] = (keywords[keyword] || 0) + 1
    })
  })

  // Return only keywords that appear 2+ times
  return Object.entries(keywords)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
}

// Highlight keywords in text
export const highlightKeywords = (text, keywords) => {
  if (!text || !keywords || keywords.length === 0) return text

  let highlightedText = text
  keywords.forEach(([keyword]) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
    highlightedText = highlightedText.replace(
      regex,
      `<mark style="background-color: #FFE4B5; padding: 2px 4px; border-radius: 3px;">$&</mark>`
    )
  })

  return highlightedText
}
