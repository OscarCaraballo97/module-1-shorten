const CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const CODE_LENGTH = 6

export function generateShortCode(): string {
  let code = ""
  for (let i = 0; i < CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * CHARACTERS.length)
    code += CHARACTERS[randomIndex]
  }
  return code
}
