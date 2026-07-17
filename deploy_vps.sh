#!/bin/bash
# Script de deploy do ItaMakerShop no VPS
# Execute: bash deploy_vps.sh

set -e

REPO="https://github.com/itagamificaedu-cpu/itamakershop-sistema-.git"
DIR="/root/itamakershop"

echo "=== DEPLOY ITAMAKERSHOP ==="

if [ -d "$DIR" ]; then
  echo "Atualizando repositório..."
  cd "$DIR"
  git pull origin main
else
  echo "Clonando repositório..."
  git clone "$REPO" "$DIR"
  cd "$DIR"
fi

if [ ! -f ".env" ]; then
  echo "ERRO: Arquivo .env não encontrado em $DIR"
  echo "Crie o .env baseado no .env.example antes de continuar"
  exit 1
fi

echo "Build e subindo containers..."
docker compose build itamakershop_app
docker compose up -d

echo "=== ITAMAKERSHOP NO AR ==="
echo "Acesse: https://itamakershop.itatecnologiaeducacional.tech"
