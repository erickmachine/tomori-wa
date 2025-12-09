import fs from "fs/promises"
import path from "path"

const DB_DIR = "./database"
const SESSIONS_FILE = path.join(DB_DIR, "sessions.json")

// Garantir que o diretório existe
async function ensureDbDir() {
  try {
    await fs.access(DB_DIR)
  } catch {
    await fs.mkdir(DB_DIR, { recursive: true })
  }
}

// Carregar todas as sessões
export async function carregarSessoes() {
  await ensureDbDir()
  try {
    const data = await fs.readFile(SESSIONS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return {}
  }
}

// Salvar sessão de um usuário
export async function salvarSessao(userId, data) {
  await ensureDbDir()
  const sessoes = await carregarSessoes()
  sessoes[userId] = {
    ...sessoes[userId],
    ...data,
    ultimaAtualizacao: new Date().toISOString(),
  }
  await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessoes, null, 2))
}

// Carregar sessão de um usuário
export async function carregarSessao(userId) {
  const sessoes = await carregarSessoes()
  return sessoes[userId] || null
}

// Deletar sessão de um usuário
export async function deletarSessao(userId) {
  await ensureDbDir()
  const sessoes = await carregarSessoes()
  delete sessoes[userId]
  await fs.writeFile(SESSIONS_FILE, JSON.stringify(sessoes, null, 2))
}
