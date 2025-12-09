import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState as initAuthState,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys"
import pino from "pino"
import qrcode from "qrcode-terminal"
import { MercadoPagoConfig, Payment } from "mercadopago"
import NodeCache from "node-cache"
import { planos, mensagens } from "./config.js"
import { salvarSessao } from "./database.js"
import readline from "readline"

const logger = pino({ level: "silent" })
const cache = new NodeCache({ stdTTL: 300 })

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

let state, saveCreds

const client = new MercadoPagoConfig({
  accessToken:
    process.env.MERCADOPAGO_TOKEN || "APP_USR-1831227711276156-030912-d96aec0c9615233ea0ff3396b6a543c1-1339300911",
})

const payment = new Payment(client)

const connectToWhatsApp = async () => {
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: state,
    browser: ["TomoriBot", "Chrome", "1.0.0"],
  })

  let pairingCodeRequested = false

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr && !pairingCodeRequested) {
      console.log("\n╔═══════════════════════════════════════╗")
      console.log("║    🤖 TOMORIBOT - CONECTAR WHATSAPP   ║")
      console.log("╚═══════════════════════════════════════╝\n")
      console.log("Escolha o método de conexão:\n")
      console.log("1 - 📱 Código de Pareamento (Número de Telefone)")
      console.log("2 - 📷 QR Code (Escanear)\n")

      rl.question("Digite sua opção (1 ou 2): ", async (opcao) => {
        if (opcao === "1") {
          pairingCodeRequested = true
          rl.question("\n📱 Digite seu número com DDI (ex: 5511999999999): ", async (numeroTelefone) => {
            try {
              const numero = numeroTelefone.replace(/\D/g, "")

              if (numero.length < 10) {
                console.log("\n❌ Número inválido! Use o formato: 5511999999999")
                process.exit(1)
              }

              console.log("\n⏳ Solicitando código de pareamento...\n")

              const code = await sock.requestPairingCode(numero)

              console.log("╔═══════════════════════════════════════╗")
              console.log("║       ✅ CÓDIGO DE PAREAMENTO         ║")
              console.log("╚═══════════════════════════════════════╝\n")
              console.log(`🔑 Seu código: ${code}\n`)
              console.log("📋 Instruções:")
              console.log("1. Abra o WhatsApp no celular")
              console.log("2. Vá em Configurações → Aparelhos conectados")
              console.log("3. Toque em 'Conectar um aparelho'")
              console.log("4. Selecione 'Conectar com número de telefone'")
              console.log("5. Digite o código acima\n")
            } catch (error) {
              console.error("\n❌ Erro ao solicitar código:", error.message)
              process.exit(1)
            }
          })
        } else {
          console.log("\n🤖 TOMORIBOT - Escaneie o QR Code abaixo:\n")
          qrcode.generate(qr, { small: true })
          console.log("\n📋 Instruções:")
          console.log("1. Abra o WhatsApp no celular")
          console.log("2. Vá em Configurações → Aparelhos conectados")
          console.log("3. Toque em 'Conectar um aparelho'")
          console.log("4. Escaneie o QR Code acima\n")
        }
      })
    }

    if (connection === "close") {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log("❌ Conexão fechada. Reconectando...", shouldReconnect)

      if (shouldReconnect) {
        connectToWhatsApp()
      }
    } else if (connection === "open") {
      console.log("\n╔═══════════════════════════════════════╗")
      console.log("║   ✅ CONECTADO AO WHATSAPP COM SUCESSO   ║")
      console.log("╚═══════════════════════════════════════╝")
      console.log("🚀 TomoriBot está online e pronto para receber mensagens!\n")
      rl.close()
    }
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]

    if (!msg.key.remoteJid.endsWith("@s.whatsapp.net") || msg.key.fromMe) return

    const from = msg.key.remoteJid
    const messageText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || ""

    console.log(`📩 Nova mensagem de ${from}: ${messageText}`)

    try {
      await handleMessage(sock, from, messageText.trim())
    } catch (error) {
      console.error("❌ Erro ao processar mensagem:", error)
      await sock.sendMessage(from, {
        text: mensagens.erro,
      })
    }
  })

  return sock
}

const handleMessage = async (sock, from, text) => {
  const userState = cache.get(from) || { etapa: "inicio" }

  if (
    text.toLowerCase() === "/start" ||
    text.toLowerCase() === "oi" ||
    text.toLowerCase() === "olá" ||
    userState.etapa === "inicio"
  ) {
    await enviarMenuPrincipal(sock, from)
    cache.set(from, { etapa: "menu_principal" })
    return
  }

  if (userState.etapa === "menu_principal") {
    if (text === "1") {
      await enviarPlanos(sock, from)
      cache.set(from, { etapa: "escolher_plano" })
    } else if (text === "2") {
      await sock.sendMessage(from, { text: mensagens.suporte })
    } else if (text === "3") {
      await sock.sendMessage(from, { text: mensagens.sobre })
    } else {
      await enviarMenuPrincipal(sock, from)
    }
    return
  }

  if (userState.etapa === "escolher_plano") {
    const planoEscolhido = Number.parseInt(text)

    if (planoEscolhido >= 1 && planoEscolhido <= planos.length) {
      const plano = planos[planoEscolhido - 1]
      await confirmarPlano(sock, from, plano)
      cache.set(from, { etapa: "confirmar_plano", plano })
    } else if (text === "0") {
      await enviarMenuPrincipal(sock, from)
      cache.set(from, { etapa: "menu_principal" })
    } else {
      await sock.sendMessage(from, {
        text: "❌ Opção inválida. Por favor, escolha um número da lista.",
      })
      await enviarPlanos(sock, from)
    }
    return
  }

  if (userState.etapa === "confirmar_plano") {
    if (text === "1") {
      await gerarPagamento(sock, from, userState.plano)
      cache.set(from, { etapa: "aguardando_pagamento", plano: userState.plano })
    } else if (text === "2") {
      await enviarPlanos(sock, from)
      cache.set(from, { etapa: "escolher_plano" })
    } else {
      await confirmarPlano(sock, from, userState.plano)
    }
    return
  }

  if (userState.etapa === "aguardando_pagamento") {
    if (text === "1") {
      await sock.sendMessage(from, {
        text: "🔄 Verificando pagamento...",
      })
      await sock.sendMessage(from, {
        text: mensagens.pagamento_pendente,
      })
    } else if (text === "2") {
      await gerarPagamento(sock, from, userState.plano)
    } else if (text === "0") {
      await enviarMenuPrincipal(sock, from)
      cache.set(from, { etapa: "menu_principal" })
    }
    return
  }
}

const enviarMenuPrincipal = async (sock, from) => {
  const menu = `╔═══════════════════════════╗
║     🤖 *TOMORIBOT* 🤖     ║
╚═══════════════════════════╝

Olá! Bem-vindo ao TomoriBot! 👋

Sou seu assistente virtual para contratação de planos premium do nosso bot para WhatsApp.

┏━━━━ 📋 *MENU PRINCIPAL* ━━━━┓
┃                                                        
┃ *1* - 💎 Ver Planos e Assinar
┃ *2* - 💬 Suporte
┃ *3* - ℹ️ Sobre o TomoriBot
┃                                                        
┗━━━━━━━━━━━━━━━━━━━━━━━━┛

Digite o *número* da opção desejada:`

  await sock.sendMessage(from, { text: menu })
}

const enviarPlanos = async (sock, from) => {
  let mensagemPlanos = `╔═══════════════════════════╗
║  💎 *PLANOS TOMORIBOT* 💎  ║
╚═══════════════════════════╝

Escolha o plano ideal para você:\n\n`

  planos.forEach((plano, index) => {
    mensagemPlanos += `┏━━━━━━━━━━━━━━━━━━━━━━┓
┃ *${index + 1}. ${plano.nome}* ${plano.destaque ? "⭐" : ""}
┃ 💰 Valor: *R$ ${plano.preco.toFixed(2)}*
┃ ⏱️ Duração: ${plano.duracao}
┃ 
┃ ✨ *Recursos:*\n`

    plano.recursos.forEach((recurso) => {
      mensagemPlanos += `┃    ✓ ${recurso}\n`
    })

    mensagemPlanos += `┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n`
  })

  mensagemPlanos += `*0* - ⬅️ Voltar ao Menu\n\nDigite o *número do plano* que deseja assinar:`

  await sock.sendMessage(from, { text: mensagemPlanos })
}

const confirmarPlano = async (sock, from, plano) => {
  const mensagem = `╔═══════════════════════════╗
║   ✅ *CONFIRMAR PLANO*   ║
╚═══════════════════════════╝

Você selecionou:

🎯 *${plano.nome}*
💰 Valor: *R$ ${plano.preco.toFixed(2)}*
⏱️ Duração: ${plano.duracao}

✨ *Recursos inclusos:*
${plano.recursos.map((r) => `  ✓ ${r}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━

*1* - ✅ Confirmar e Gerar Pagamento
*2* - ⬅️ Escolher Outro Plano

Digite sua opção:`

  await sock.sendMessage(from, { text: mensagem })
}

const gerarPagamento = async (sock, from, plano) => {
  try {
    await sock.sendMessage(from, {
      text: "⏳ Gerando código PIX...",
    })

    const body = {
      transaction_amount: plano.preco,
      description: `TomoriBot - ${plano.nome}`,
      payment_method_id: "pix",
      payer: {
        email: "cliente@email.com",
        identification: {
          type: "CPF",
          number: "12345678909",
        },
      },
    }

    const response = await payment.create({ body })

    const pixCode = response.point_of_interaction?.transaction_data?.qr_code
    const pixQrBase64 = response.point_of_interaction?.transaction_data?.qr_code_base64

    if (!pixCode) {
      throw new Error("Não foi possível gerar o código PIX")
    }

    const mensagemPlano = `╔═════════════════════════════════╗
║      💎 PAGAMENTO VIA PIX 💎      ║
╚═════════════════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📦 Plano: *${plano.nome}*
┃  💰 Valor: *R$ ${plano.preco.toFixed(2)}*
┃  ⏱️  Duração: ${plano.duracao}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✨ *Recursos inclusos:*
${plano.recursos.map((r) => `   ✓ ${r}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 *Como pagar:*

1️⃣ Copie o código PIX abaixo
2️⃣ Abra o app do seu banco
3️⃣ Escolha PIX → Copia e Cola
4️⃣ Cole o código e confirme
5️⃣ Pronto! Acesso liberado automaticamente

⚡ *Pagamento instantâneo!*
🔒 *100% seguro via Mercado Pago*`

    await sock.sendMessage(from, { text: mensagemPlano })

    await new Promise((resolve) => setTimeout(resolve, 500))

    await sock.sendMessage(from, {
      text: `📱 *CÓDIGO PIX COPIA E COLA:*\n\n${pixCode}`,
    })

    await new Promise((resolve) => setTimeout(resolve, 500))

    const mensagemOpcoes = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 *Opções:*
*1* - 🔄 Verificar pagamento
*2* - 🔁 Gerar novo código
*0* - ⬅️  Menu principal`

    await sock.sendMessage(from, { text: mensagemOpcoes })

    await salvarSessao(from, {
      plano: plano.nome,
      valor: plano.preco,
      pixCode: pixCode,
      paymentId: response.id,
      data: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Erro ao gerar pagamento:", error)
    await sock.sendMessage(from, {
      text: "❌ Erro ao gerar código PIX. Por favor, tente novamente ou entre em contato com o suporte.",
    })
  }
}

console.log("🚀 Iniciando TomoriBot...\n")
const { state: s, saveCreds: sc } = await initAuthState("auth_info_baileys")
state = s
saveCreds = sc
connectToWhatsApp()
