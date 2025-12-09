# 🤖 TomoriBot - Bot WhatsApp com Pagamentos PIX

Bot profissional para WhatsApp com sistema completo de assinaturas e pagamentos via PIX (Mercado Pago).

## ✨ Funcionalidades

- 💬 **Atendimento Automático** - Responde mensagens no privado
- 💎 **Sistema de Planos** - 4 planos de assinatura elegantes
- 💳 **PIX Copia e Cola** - Pagamento instantâneo via código PIX
- 🔒 **Seguro** - Transações via Mercado Pago
- 📱 **Mobile-Friendly** - Funciona perfeitamente no Termux
- 🎨 **Interface Elegante** - Menus bonitos com emojis e bordas

## 📋 Pré-requisitos

- Android com Termux instalado
- WhatsApp instalado
- Conexão com internet

## 🚀 Instalação no Termux

### Método Rápido

\`\`\`bash
# Atualizar e instalar dependências
pkg update && pkg upgrade -y
pkg install nodejs-lts git -y

# Clonar projeto (substitua SEU_USUARIO)
git clone https://github.com/SEU_USUARIO/tomoribot-whatsapp.git
cd tomoribot-whatsapp

# Instalar e iniciar
npm install
npm start
\`\`\`

### Passo 1: Instalar Dependências

Abra o Termux e execute os comandos abaixo:

\`\`\`bash
# Atualizar pacotes
pkg update && pkg upgrade -y

# Instalar Node.js e Git
pkg install nodejs-lts git -y

# Verificar instalação
node --version
npm --version
git --version
\`\`\`

### Passo 2: Clonar o Projeto

\`\`\`bash
# Navegar para o diretório home
cd ~

# Clonar o repositório (substitua SEU_USUARIO pelo seu usuário do GitHub)
git clone https://github.com/SEU_USUARIO/tomoribot-whatsapp.git

# Entrar na pasta do projeto
cd tomoribot-whatsapp
\`\`\`

### Passo 3: Configurar o Projeto

\`\`\`bash
# Instalar dependências do projeto
npm install

# Criar arquivo de configuração
cp .env.example .env

# Editar o arquivo .env (opcional, o token já está configurado)
nano .env
\`\`\`

**Nota:** Se quiser usar um token diferente do Mercado Pago, edite o arquivo `.env` e cole seu token.

### Passo 4: Iniciar o Bot

\`\`\`bash
# Iniciar o bot
npm start
\`\`\`

### Passo 5: Conectar o WhatsApp

Após executar `npm start`, você terá **duas opções** de conexão:

#### Opção 1: Código de Pareamento (Recomendado para Termux)

1. Quando aparecer o menu, digite **1**
2. Digite seu número com DDI (exemplo: `5511999999999`)
3. Um código de 8 dígitos será exibido
4. No WhatsApp do celular:
   - Vá em **Configurações → Aparelhos conectados**
   - Toque em **Conectar um aparelho**
   - Selecione **Conectar com número de telefone**
   - Digite o código exibido no Termux
5. Aguarde a mensagem: "✅ Conectado ao WhatsApp com sucesso!"

#### Opção 2: QR Code

1. Quando aparecer o menu, digite **2**
2. Um **QR Code** aparecerá no terminal
3. Abra o WhatsApp no seu celular
4. Vá em **Configurações → Aparelhos conectados**
5. Toque em **Conectar um aparelho**
6. Escaneie o QR Code que apareceu no Termux
7. Aguarde a mensagem: "✅ Conectado ao WhatsApp com sucesso!"

**Nota:** O método de código de pareamento é mais fácil no Termux, pois não requer escanear QR Code.

## 📱 Como Usar

### Para Usuários

1. Envie qualquer mensagem para o número do bot no **privado**
2. O bot responderá com o menu principal elegante
3. Digite **1** para ver os planos disponíveis
4. Escolha um plano digitando o número correspondente
5. Confirme e receba o **código PIX Copia e Cola**
6. Abra seu banco, escolha PIX → Copia e Cola
7. Cole o código e pague instantaneamente

### Menu de Comandos

- **1** - 💎 Ver Planos e Assinar
- **2** - 💬 Suporte
- **3** - ℹ️ Sobre o TomoriBot
- **/start** - Voltar ao menu principal

## 💎 Planos Disponíveis

| Plano | Valor | Duração | Economia | Destaque |
|-------|-------|---------|----------|----------|
| **💎 Premium Mensal** | R$ 20,00 | 30 dias | - | - |
| **🌟 Premium Trimestral** | R$ 50,00 | 90 dias | R$ 10,00 | ⭐ |
| **⭐ Premium Semestral** | R$ 90,00 | 180 dias | R$ 30,00 | ⭐ |
| **🏆 Premium Anual VIP** | R$ 150,00 | 365 dias | R$ 90,00 | ⭐ |

## 🎨 Sistema de Pagamento PIX

O bot gera automaticamente um **código PIX Copia e Cola** através da API do Mercado Pago:

**Vantagens:**
- ⚡ Pagamento instantâneo
- 📱 Sem precisar sair do WhatsApp para copiar link
- 💳 Aceita qualquer banco
- 🔒 100% seguro via Mercado Pago
- ✅ Código válido por 30 minutos

**Como funciona:**
1. Usuário escolhe um plano
2. Bot gera código PIX único
3. Usuário copia o código
4. Cola no app do banco (PIX Copia e Cola)
5. Confirma pagamento
6. Acesso liberado automaticamente (com webhook configurado)

## 🔧 Personalização

### Editar Planos

Edite o arquivo `config.js` para modificar os planos:

\`\`\`bash
nano config.js
\`\`\`

Os planos agora incluem:
- Emojis elegantes (💎, 🌟, ⭐, 🏆)
- Economia destacada
- Recursos organizados com checkmarks

### Alterar Mensagens

As mensagens do bot estão em `config.js` com design elegante:

\`\`\`javascript
export const mensagens = {
  suporte: 'Sua mensagem de suporte aqui',
  sobre: 'Informações sobre seu bot',
  // ...
}
\`\`\`

### Mudar Token do Mercado Pago

\`\`\`bash
nano .env
\`\`\`

Altere a linha:
\`\`\`
MERCADOPAGO_TOKEN=SEU_TOKEN_AQUI
\`\`\`

## 🔄 Manter o Bot Online

### Opção 1: Usar tmux (Recomendado)

\`\`\`bash
# Instalar tmux
pkg install tmux -y

# Criar sessão
tmux new -s tomoribot

# Iniciar bot
npm start

# Desconectar (bot continua rodando)
# Pressione: Ctrl+B, depois D

# Reconectar à sessão
tmux attach -t tomoribot
\`\`\`

### Opção 2: Usar nohup

\`\`\`bash
# Iniciar em background
nohup npm start > bot.log 2>&1 &

# Ver logs
tail -f bot.log

# Parar o bot
pkill -f "node index.js"
\`\`\`

## 🛠️ Resolução de Problemas

### Bot não conecta ao WhatsApp

\`\`\`bash
# Limpar autenticação e tentar novamente
rm -rf auth_info_baileys
npm start

# Escolha a opção 1 (Código de Pareamento) e tente novamente
\`\`\`

### Erro ao gerar código PIX

Verifique se:
- Token do Mercado Pago está correto
- Tem saldo disponível na conta MP
- API do Mercado Pago está online

\`\`\`bash
# Testar token
curl -X GET \
  'https://api.mercadopago.com/v1/payment_methods' \
  -H 'Authorization: Bearer SEU_TOKEN'
\`\`\`

### Erro ao instalar dependências

\`\`\`bash
# Limpar cache do npm
npm cache clean --force

# Instalar novamente
npm install
\`\`\`

### QR Code não aparece

\`\`\`bash
# Instalar dependência faltante
pkg install libwebp -y

# Reiniciar bot
npm start
\`\`\`

### Bot desconecta sozinho

- Verifique sua conexão com internet
- Use tmux para manter a sessão ativa
- Não use o WhatsApp Web em outro dispositivo

### Código de pareamento não funciona

- Certifique-se de digitar o número completo com DDI (ex: 5511999999999)
- Verifique se o WhatsApp está atualizado
- Tente usar a opção de QR Code se o código não funcionar

## 🔄 Atualizações

Para atualizar o bot:

\`\`\`bash
cd ~/tomoribot-whatsapp
git pull origin main
npm install
npm start
\`\`\`

## 📊 Logs e Monitoramento

\`\`\`bash
# Ver status do bot em tempo real
tail -f bot.log

# Ver histórico de sessões
cat database/sessions.json
\`\`\`

## 🔒 Segurança

⚠️ **IMPORTANTE:**

- **NUNCA** compartilhe seu token do Mercado Pago
- **NÃO** faça commit do arquivo `.env` no GitHub
- Mantenha o arquivo `auth_info_baileys` seguro
- Use sempre a versão mais recente do Node.js
- Configure webhooks para validação automática de pagamentos

## 📝 Estrutura do Projeto

\`\`\`
tomoribot-whatsapp/
├── index.js              # Arquivo principal do bot
├── config.js             # Configurações, planos e mensagens elegantes
├── database.js           # Sistema de armazenamento
├── package.json          # Dependências
├── .env.example          # Exemplo de variáveis de ambiente
├── .gitignore           # Arquivos ignorados pelo Git
├── README.md            # Este arquivo
├── INSTALACAO_RAPIDA.md # Guia rápido
├── GUIA_COMPLETO.md     # Documentação completa
├── auth_info_baileys/   # Autenticação WhatsApp (gerado automaticamente)
└── database/            # Dados de sessões (gerado automaticamente)
\`\`\`

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do bot
2. Confira se todos os pacotes foram instalados
3. Veja as issues no GitHub
4. Abra uma nova issue com detalhes do erro

## 🤝 Contribuindo

Contribuições são bem-vindas! Abra uma issue ou pull request.

---

**Desenvolvido com ❤️ para a comunidade WhatsApp Bot**

🌟 Se este projeto te ajudou, deixe uma estrela no GitHub!
