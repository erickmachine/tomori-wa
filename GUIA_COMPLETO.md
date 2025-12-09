# 📚 Guia Completo - TomoriBot WhatsApp

## 📖 Índice

1. [Instalação](#instalação)
2. [Configuração](#configuração)
3. [Uso](#uso)
4. [Personalização](#personalização)
5. [Manutenção](#manutenção)
6. [Solução de Problemas](#solução-de-problemas)
7. [FAQ](#faq)

---

## 🚀 Instalação

### Método 1: Instalação Automática (Recomendado)

\`\`\`bash
cd ~/tomoribot-whatsapp
bash install-termux.sh
\`\`\`

O script irá:
- Atualizar o sistema
- Instalar Node.js, Git e Tmux
- Instalar dependências do projeto
- Configurar ambiente

### Método 2: Instalação Manual

\`\`\`bash
# 1. Atualizar sistema
pkg update && pkg upgrade -y

# 2. Instalar dependências
pkg install nodejs-lts git tmux -y

# 3. Instalar pacotes do projeto
npm install

# 4. Criar arquivo de configuração
cp .env.example .env
\`\`\`

---

## ⚙️ Configuração

### Configurar Token do Mercado Pago

1. Acesse: https://www.mercadopago.com.br/developers
2. Vá em "Suas integrações" → "Criar aplicação"
3. Copie o **Access Token** de produção
4. Edite o arquivo `.env`:

\`\`\`bash
nano .env
\`\`\`

5. Cole seu token:
\`\`\`
MERCADOPAGO_TOKEN=SEU_TOKEN_AQUI
\`\`\`

### Personalizar Planos

Edite `config.js` para ajustar valores e recursos:

\`\`\`javascript
export const planos = [
  {
    nome: "Plano Mensal",
    preco: 20.0,  // ← Altere aqui
    duracao: "1 mês",
    recursos: [
      "Recurso 1",
      "Recurso 2"  // ← Adicione/remova recursos
    ],
    destaque: false
  },
  // ... mais planos
]
\`\`\`

### Personalizar Mensagens

Também em `config.js`:

\`\`\`javascript
export const mensagens = {
  suporte: `Seu texto de suporte aqui`,
  sobre: `Informações sobre seu bot`,
  // ...
}
\`\`\`

---

## 💻 Uso

### Iniciar o Bot

**Opção 1: Modo simples**
\`\`\`bash
npm start
\`\`\`

**Opção 2: Com tmux (mantém rodando)**
\`\`\`bash
./start-bot.sh
\`\`\`

**Opção 3: Background com nohup**
\`\`\`bash
nohup npm start > bot.log 2>&1 &
\`\`\`

### Conectar ao WhatsApp

1. Execute `npm start`
2. QR Code aparecerá no terminal
3. Abra WhatsApp → **Aparelhos conectados**
4. Toque em **Conectar um aparelho**
5. Escaneie o QR Code
6. Aguarde: "✅ Conectado ao WhatsApp com sucesso!"

### Comandos do Bot

**Para usuários finais:**
- Qualquer mensagem → Exibe menu
- `/start` → Volta ao menu principal
- `1` → Ver planos
- `2` → Suporte
- `3` → Sobre

**Fluxo de compra:**
1. Usuário envia mensagem
2. Bot mostra menu elegante
3. Usuário escolhe opção 1 (Ver Planos)
4. Bot lista planos com design bonito
5. Usuário escolhe número do plano
6. Bot mostra confirmação com detalhes
7. Usuário confirma (1)
8. Bot gera **código PIX Copia e Cola**
9. Usuário copia código e paga no banco
10. Pagamento confirmado instantaneamente

### Gerenciar Sessão Tmux

\`\`\`bash
# Ver bot rodando
tmux attach -t tomoribot

# Desconectar (mantém rodando)
Ctrl+B, depois D

# Listar sessões
tmux ls

# Parar bot
./stop-bot.sh
# ou
tmux kill-session -t tomoribot
\`\`\`

---

## 🎨 Personalização

### Adicionar Novo Plano

Em `config.js`, adicione ao array `planos`:

\`\`\`javascript
{
  nome: "🔥 Plano Vip Exclusivo",
  preco: 200.0,
  duracao: "365 dias",
  recursos: [
    "✅ Acesso vitalício",
    "👑 Suporte VIP 24/7",
    "🎁 Recursos exclusivos",
    "⚡ Prioridade máxima"
  ],
  destaque: true,
  economia: "R$ 140,00"
}
\`\`\`

### Alterar Nome do Bot

Em `.env`:
\`\`\`
BOT_NAME=MeuBot
\`\`\`

Em `config.js`, substitua todas as menções a "TomoriBot".

### Adicionar Webhook para Notificações

No `index.js`, função `gerarPagamento`, altere:

\`\`\`javascript
notification_url: "https://seu-webhook.com/notifications"
\`\`\`

Configure um servidor para receber notificações do Mercado Pago quando pagamentos forem confirmados.

### Adicionar Comandos Personalizados

Em `index.js`, na função `handleMessage`, adicione:

\`\`\`javascript
if (text.toLowerCase() === "/ajuda") {
  await sock.sendMessage(from, {
    text: "Comandos disponíveis:\n/start - Menu\n/ajuda - Esta mensagem"
  })
  return
}
\`\`\`

### Configurar Webhook para Validação Automática

Para validar pagamentos automaticamente, configure um webhook:

1. Crie um endpoint em seu servidor que receba notificações do Mercado Pago
2. No `index.js`, função `gerarPagamento`, configure:

\`\`\`javascript
notification_url: "https://seu-servidor.com/webhook/mercadopago"
\`\`\`

3. No webhook, valide o pagamento e ative a assinatura do usuário automaticamente

---

## 🔧 Manutenção

### Ver Logs

\`\`\`bash
# Logs em tempo real
tail -f bot.log

# Ver últimas 50 linhas
tail -n 50 bot.log

# Buscar erros
grep ERROR bot.log
\`\`\`

### Backup de Dados

\`\`\`bash
# Backup completo
tar -czf backup-$(date +%Y%m%d).tar.gz \
  database/ \
  auth_info_baileys/ \
  .env

# Restaurar backup
tar -xzf backup-20240309.tar.gz
\`\`\`

### Atualizar Bot

\`\`\`bash
cd ~/tomoribot-whatsapp
git pull origin main
npm install
npm start
\`\`\`

### Limpar Cache

\`\`\`bash
# Limpar sessões antigas
rm -rf database/*

# Limpar autenticação (reconectar WhatsApp)
rm -rf auth_info_baileys/

# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
\`\`\`

---

## 🆘 Solução de Problemas

### Bot não conecta ao WhatsApp

**Sintomas:** QR Code não aparece ou erro de conexão

**Soluções:**
\`\`\`bash
# 1. Limpar autenticação
rm -rf auth_info_baileys/
npm start

# 2. Verificar internet
ping -c 3 google.com

# 3. Reinstalar dependências
npm install @whiskeysockets/baileys@latest
\`\`\`

### Erro: "Module not found"

\`\`\`bash
# Reinstalar todas as dependências
rm -rf node_modules
npm cache clean --force
npm install
\`\`\`

### QR Code não aparece

\`\`\`bash
# Instalar dependências de imagem
pkg install libwebp libjpeg-turbo libpng -y

# Reinstalar qrcode-terminal
npm install qrcode-terminal@latest
\`\`\`

### Bot desconecta frequentemente

**Causas comuns:**
- Internet instável
- WhatsApp Web aberto em outro lugar
- Bateria em economia de energia

**Soluções:**
- Use conexão estável (Wi-Fi)
- Desconecte outros WhatsApp Web
- Configure Termux para não dormir:
  \`\`\`bash
  termux-wake-lock
  \`\`\`

### Erro ao gerar pagamento

\`\`\`bash
# Verificar token
cat .env | grep MERCADOPAGO

# Testar token manualmente
curl -X GET \
  'https://api.mercadopago.com/v1/payment_methods' \
  -H 'Authorization: Bearer SEU_TOKEN'
\`\`\`

### Permissão negada nos scripts

\`\`\`bash
chmod +x install-termux.sh
chmod +x start-bot.sh
chmod +x stop-bot.sh
\`\`\`

---

## ❓ FAQ

### O bot funciona em grupos?

Não, por padrão responde apenas mensagens privadas. Para ativar em grupos, remova esta validação no `index.js`:

\`\`\`javascript
if (!msg.key.remoteJid.endsWith("@s.whatsapp.net")) return
\`\`\`

### Posso usar mais de um número?

Sim, cada instalação conecta um número. Para múltiplos números, crie pastas separadas.

### O bot consome muita bateria?

Consumo moderado. Use `termux-wake-lock` e mantenha o Termux ativo.

### Por que usar PIX Copia e Cola ao invés de link?

**Vantagens:**
- Mais rápido (não precisa abrir navegador)
- Mais prático (copiar e colar no banco)
- Funciona em qualquer banco
- Menos passos para o usuário
- Maior taxa de conversão

### Como validar pagamentos automaticamente?

Configure webhooks do Mercado Pago. Quando receber notificação de pagamento aprovado, ative a assinatura do usuário automaticamente.

### O código PIX expira?

Sim, códigos PIX geralmente expiram em 30 minutos. O usuário pode solicitar um novo código digitando **2** no menu de pagamento.

### Posso hospedar em servidor?

Sim! Funciona em qualquer Linux. Adapte os comandos para seu sistema.

### O bot armazena dados dos usuários?

Sim, em `database/sessions.json`. São armazenados: ID, plano escolhido, link de pagamento e data.

### Posso aceitar outros métodos de pagamento?

Sim, mas precisa integrar outras APIs (PagSeguro, PayPal, etc.) no código.

### O bot valida automaticamente pagamentos?

Não por padrão. Você precisa configurar webhooks do Mercado Pago para validação automática.

---

## 📞 Suporte

Se precisar de ajuda:

1. Verifique este guia primeiro
2. Confira as [Issues no GitHub](https://github.com/SEU_USUARIO/tomoribot-whatsapp/issues)
3. Abra uma nova issue com detalhes do problema

---

**Desenvolvido com ❤️ para a comunidade**

*Última atualização: 2024*
