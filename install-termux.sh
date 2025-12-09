#!/data/data/com.termux/files/usr/bin/bash

# Script de instalação automática do TomoriBot no Termux
# Execute: bash install-termux.sh

clear
echo "╔════════════════════════════════════════╗"
echo "║  🤖 INSTALADOR TOMORIBOT - TERMUX 🤖  ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Verificar se está rodando no Termux
if [ ! -d "/data/data/com.termux" ]; then
    log_error "Este script deve ser executado no Termux!"
    exit 1
fi

log_info "Iniciando instalação do TomoriBot..."
echo ""

# Passo 1: Atualizar pacotes
log_info "Passo 1/5: Atualizando pacotes do sistema..."
pkg update -y && pkg upgrade -y
if [ $? -eq 0 ]; then
    log_success "Pacotes atualizados com sucesso!"
else
    log_error "Erro ao atualizar pacotes"
    exit 1
fi
echo ""

# Passo 2: Instalar Node.js e Git
log_info "Passo 2/5: Instalando Node.js LTS e Git..."
pkg install nodejs-lts git tmux -y
if [ $? -eq 0 ]; then
    log_success "Node.js, Git e Tmux instalados!"
    node --version
    npm --version
    git --version
else
    log_error "Erro ao instalar dependências"
    exit 1
fi
echo ""

# Passo 3: Instalar dependências do projeto
log_info "Passo 3/5: Instalando dependências do projeto..."
npm install
if [ $? -eq 0 ]; then
    log_success "Dependências instaladas com sucesso!"
else
    log_error "Erro ao instalar dependências do npm"
    exit 1
fi
echo ""

# Passo 4: Criar arquivo .env
log_info "Passo 4/5: Configurando variáveis de ambiente..."
if [ ! -f .env ]; then
    cp .env.example .env
    log_success "Arquivo .env criado!"
else
    log_warning "Arquivo .env já existe, mantendo configuração atual"
fi
echo ""

# Passo 5: Finalização
log_info "Passo 5/5: Finalizando instalação..."
chmod +x start-bot.sh
log_success "Permissões configuradas!"
echo ""

echo "╔════════════════════════════════════════╗"
echo "║    ✅ INSTALAÇÃO CONCLUÍDA! ✅         ║"
echo "╚════════════════════════════════════════╝"
echo ""
log_success "TomoriBot instalado com sucesso!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📌 PRÓXIMOS PASSOS:"
echo ""
echo "1️⃣  Para iniciar o bot:"
echo "   ${GREEN}npm start${NC}"
echo ""
echo "2️⃣  Para rodar em background (recomendado):"
echo "   ${GREEN}./start-bot.sh${NC}"
echo ""
echo "3️⃣  Após iniciar, escaneie o QR Code"
echo "    que aparecerá no terminal"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
log_info "Dica: Use 'tmux' para manter o bot rodando mesmo após fechar o Termux"
echo ""
