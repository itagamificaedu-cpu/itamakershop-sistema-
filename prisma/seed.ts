import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Este seed NUNCA cria usuários nem apaga dados de pedidos/contas —
// só popula o catálogo inicial (categorias) e é seguro de rodar em produção.
// Contas reais são criadas via /register. Produtos reais devem ser cadastrados
// pelo admin (painel) ou adicionados aqui manualmente antes do primeiro deploy.
async function main() {
  const existingCategories = await prisma.category.count();

  if (existingCategories > 0) {
    console.log("Catálogo já foi semeado antes, pulando.");
    return;
  }

  await prisma.category.createMany({
    data: [
      {
        name: "Impressão 3D",
        description: "Peças e produtos impressos em 3D sob medida",
      },
      {
        name: "Corte a Laser",
        description: "Peças e produtos cortados a laser sob medida",
      },
    ],
  });

  console.log("Categorias iniciais criadas. Cadastre os produtos reais antes de divulgar a loja.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
