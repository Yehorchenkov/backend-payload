import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical' // Import the correct type
import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext' // Import the utility

/**
 * Generates an excerpt from Lexical RichText content using the built-in converter.
 * @param content The Lexical RichText content object (SerializedEditorState).
 * @param maxLength The maximum length of the excerpt.
 * @returns The generated excerpt string.
 */
export function generateExcerpt(
  content: SerializedEditorState | undefined | null, // Use the correct type
  maxLength: number = 150,
): string {
  // Check if content or its root exists and has children
  if (!content || !content.root || !content.root.children || content.root.children.length === 0) {
    return ''
  }

  // Convert the Lexical state to plain text
  // Pass the whole content object as 'data'
  const textContent = convertLexicalToPlaintext({ data: content })

  // Trim any leading/trailing whitespace from the conversion
  const trimmedText = textContent.trim()

  if (trimmedText.length <= maxLength) {
    return trimmedText
  }

  // Truncate and add ellipsis
  const truncated = trimmedText.substring(0, maxLength).trimEnd()
  // Ensure we don't cut words in half
  const lastSpaceIndex = truncated.lastIndexOf(' ')
  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...'
  } else {
    // Handle cases where the truncated text has no spaces (very long word)
    return truncated + '...'
  }
}
