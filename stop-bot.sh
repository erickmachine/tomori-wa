#!/data/data/com.termux/files/usr/bin/bash

# Script para parar o TomoriBot

clear
echo "╔════════════════════════════════════════╗"
echo "║     🛑 PARANDO TOMORIBOT 🛑           ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Verificar se o bot está rodando
if ! tmux has-session -t tomoribot 2>/dev/null; then
    echo "⚠️  Nenhuma sessão do bot encontrada!"
    echo "O bot não está rodando."
    exit 0
fi

echo "🛑 Encerrando sessão do bot..."
tmux kill-session -t tomoribot

if [ $? -eq 0 ]; then
    echo "✅ Bot parado com sucesso!"
else
    echo "❌ Erro ao parar o bot"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Para iniciar novamente, execute:"
echo "  ./start-bot.sh"
echo "ou"
echo "  npm start"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
