import { AIClient } from 'lib/baseUrlClient'

export const fetchAiSummary = async (documentUrl: string) => {
  try {
    const documentKey = extractKeyFromUrl(documentUrl)

    if (!documentKey) {
      console.error('Failed to extract key from URL:', documentUrl)
      return
    }

    const body = {
      key: documentKey,
      summary_version: 'brief',
      summary_type: 'paragraph'
    }
    const { data } = await AIClient.post(`docSummary`, {
      body: JSON.stringify(body)
    })

    return data
  } catch (err) {
    const error = err as Error & { response?: { data?: { message?: string } } }
    console.error(
      'Error fetching AI summary:',
      error.response?.data?.message || error.message
    )
    throw error
  }
}

export const extractKeyFromUrl = (url: string): string | null => {
  try {
    const regex = /(?:https:\/\/[^/]+\/)([^/]+\/[^/]+\/[^/]+\.pdf)/
    const match = url.match(regex)

    if (match) {
      return match[1]
    } else {
      console.error('Failed to match URL pattern. Check the URL format.')
      return null
    }
  } catch (error) {
    console.error('Error extracting key from URL:', error)
    return null
  }
}
