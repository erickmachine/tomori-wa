#!/data/data/com.termux/files/usr/bin/bash

# Script para iniciar o TomoriBot com tmux

clear
echo "╔════════════════════════════════════════╗"
echo "║     🚀 INICIANDO TOMORIBOT 🚀         ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Verificar se tmux está instalado
if ! command -v tmux &> /dev/null; then
    echo "⚠️  Tmux não encontrado. Instalando..."
    pkg install tmux -y
fi

# Verificar se já existe uma sessão rodando
if tmux has-session -t tomoribot 2>/dev/null; then
    echo "⚠️  Bot já está rodando!"
    echo ""
    echo "Opções:"
    echo "1 - Visualizar bot rodando (tmux attach)"
    echo "2 - Parar bot atual e reiniciar"
    echo "3 - Cancelar"
    echo ""
    read -p "Escolha uma opção (1-3): " opcao
    
    case $opcao in
        1)
            tmux attach -t tomoribot
            ;;
        2)
            echo "🛑 Parando bot..."
            tmux kill-session -t tomoribot
            sleep 2
            ;;
        3)
            echo "❌ Cancelado"
            exit 0
            ;;
        *)
            echo "❌ Opção inválida"
            exit 1
            ;;
    esac
fi

echo "🔧 Criando sessão tmux..."
tmux new-session -d -s tomoribot "npm start"

echo ""
echo "✅ Bot iniciado com sucesso!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 COMANDOS ÚTEIS:"
echo ""
echo "• Ver bot rodando:"
echo "  tmux attach -t tomoribot"
echo ""
echo "• Desconectar (mantém bot rodando):"
echo "  Pressione: Ctrl+B, depois D"
echo ""
echo "• Parar bot:"
echo "  tmux kill-session -t tomoribot"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Aguardar 3 segundos e conectar à sessão
sleep 3
tmux attach -t tomoribot
