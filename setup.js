const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Função para executar comandos
function runCommand(command) {
  console.log(`\n\nExecutando: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Falha ao executar: ${command}`);
    return false;
  }
}

// Instalar dependências
console.log('\n🔍 Instalando dependências...');
if (!runCommand('npm install --legacy-peer-deps')) {
  console.error('❌ Falha ao instalar dependências!');
  process.exit(1);
}

// Criar diretórios para produtos e categorias
console.log('\n🔍 Criando diretórios para imagens...');
try {
  const dirs = [
    'public/products',
    'public/categories'
  ];
  
  dirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Diretório criado: ${dir}`);
    } else {
      console.log(`ℹ️ Diretório já existe: ${dir}`);
    }
  });
} catch (error) {
  console.error('❌ Falha ao criar diretórios:', error);
}

// Gerar o Prisma Client
console.log('\n🔍 Gerando Prisma Client...');
if (!runCommand('npx prisma generate')) {
  console.error('❌ Falha ao gerar Prisma Client!');
}

// Iniciar o servidor de desenvolvimento
console.log('\n🔍 Configuração concluída!');
console.log('\n✅ Para iniciar o servidor de desenvolvimento, execute:');
console.log('npm run dev');

console.log('\n✅ Para popular o banco de dados com dados de exemplo, execute:');
console.log('npx prisma db push');
console.log('npm run seed');

console.log('\n🎉 Sua loja online está pronta para uso!'); 