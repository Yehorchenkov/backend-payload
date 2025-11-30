import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'

/**
 * Generates an excerpt from Lexical RichText content using the built-in converter.
 * @param content The Lexical RichText content object (SerializedEditorState).
 * @param maxLength The maximum length of the excerpt (including ellipsis if truncated).
 * @returns The generated excerpt string.
 */
export function generateExcerpt(
  content: SerializedEditorState | undefined | null,
  maxLength: number = 150,
): string {
  if (!content || !content.root || !content.root.children || content.root.children.length === 0) {
    return ''
  }

  const textContent = convertLexicalToPlaintext({ data: content })
  const trimmedText = textContent.trim()

  if (trimmedText.length <= maxLength) {
    return trimmedText
  }

  const ellipsis = '...'
  const maxContentLength = maxLength - ellipsis.length

  if (maxContentLength <= 0) {
    return trimmedText.substring(0, maxLength)
  }

  const truncated = trimmedText.substring(0, maxContentLength).trimEnd()
  const lastSpaceIndex = truncated.lastIndexOf(' ')

  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + ellipsis
  } else {
    return truncated + ellipsis
  }
}
