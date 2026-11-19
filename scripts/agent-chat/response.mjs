export const actionProtocol = 'loomata-actions-v2'
export const responseSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    message: { type: 'string', maxLength: 16000 },
    action: { type: 'string', enum: ['respond', 'list', 'read', 'write', 'design'] },
    file: { type: ['string', 'null'], maxLength: 300 },
    content: { type: ['string', 'null'], maxLength: 100000 },
    reason: { type: ['string', 'null'], maxLength: 600 },
  },
  required: ['message', 'action', 'file', 'content', 'reason'],
}
export function decodeResponse(text) {
  const v = JSON.parse(text)
  if (
    !v ||
    Object.keys(v).sort().join(',') !== 'action,content,file,message,reason' ||
    typeof v.message !== 'string' ||
    v.message.length > 16000 ||
    !['respond', 'list', 'read', 'write', 'design'].includes(v.action)
  )
    throw new Error('chat-response-invalid')
  if (
    ['respond', 'list'].includes(v.action) &&
    (v.file !== null || v.content !== null || v.reason !== null)
  )
    throw new Error('chat-response-invalid')
  if (
    v.action === 'read' &&
    (typeof v.file !== 'string' || v.file.length > 300 || v.content !== null || v.reason !== null)
  )
    throw new Error('chat-response-invalid')
  if (
    ['write', 'design'].includes(v.action) &&
    ((v.action === 'design'
      ? v.file !== null
      : typeof v.file !== 'string' || v.file.length > 300) ||
      typeof v.content !== 'string' ||
      v.content.length > 100000 ||
      typeof v.reason !== 'string' ||
      v.reason.length > 600)
  )
    throw new Error('chat-response-invalid')
  return v
}
export function displayedMessage(text) {
  try {
    return decodeResponse(text).message
  } catch {
    return text
  }
}
export function progressMessage(buffer) {
  const match = buffer.match(/^\s*\{\s*"message"\s*:\s*("(?:[^"\\]|\\.)*)/)
  if (!match) return ''
  let raw = match[1]
  if (raw.endsWith('\\')) raw = raw.slice(0, -1)
  try {
    return JSON.parse(raw + '"')
  } catch {
    return ''
  }
}
