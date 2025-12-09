# ⚡ Instalação Rápida - TomoriBot

## 📱 Comandos Completos para Termux

Copie e cole estes comandos no Termux:

### 1️⃣ Instalar Requisitos

\`\`\`bash
pkg update && pkg upgrade -y && pkg install nodejs-lts git tmux -y
\`\`\`

### 2️⃣ Clonar e Configurar

\`\`\`bash
cd ~ && git clone https://github.com/SEU_USUARIO/tomoribot-whatsapp.git && cd tomoribot-whatsapp && npm install
\`\`\`

### 3️⃣ Iniciar Bot

\`\`\`bash
npm start
\`\`\`

## 🔐 Escolher Método de Conexão

### Opção 1: Código de Pareamento (Recomendado)

1. Digite **1** quando aparecer o menu
2. Informe seu número com DDI (ex: 5511999999999)
3. Copie o código de 8 dígitos que aparecerá
4. No WhatsApp:
   - **Configurações → Aparelhos conectados**
   - **Conectar um aparelho**
   - **Conectar com número de telefone**
   - Digite o código
5. Pronto! ✅

### Opção 2: QR Code

1. Digite **2** quando aparecer o menu
2. QR Code aparecerá no terminal
3. Abra WhatsApp → **Aparelhos conectados**
4. **Conectar um aparelho**
5. Escaneie o QR Code
6. Pronto! ✅

## 🔄 Manter Online (Opcional)

\`\`\`bash
# Criar sessão tmux
tmux new -s bot

# Iniciar
npm start

# Desconectar sem fechar (Ctrl+B, depois D)
# Reconectar: tmux attach -t bot
\`\`\`

## ✅ Verificar se Está Funcionando

1. Envie uma mensagem para o número do bot
2. Bot deve responder com o menu
3. Digite **1** para ver os planos

## 🆘 Problemas?

\`\`\`bash
# Limpar e reiniciar
rm -rf auth_info_baileys node_modules
npm install
npm start
\`\`\`

---

**Pronto! Seu bot está online! 🚀**
