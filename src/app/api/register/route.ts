import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validação com Zod
const userSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Endereço de email inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validação dos dados
    const result = userSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: "Dados inválidos", errors: result.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Verifica se o email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email já está em uso" },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = await hash(password, 10);

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    // Remove a senha do objeto retornado
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Usuário cadastrado com sucesso",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Algo deu errado" },
      { status: 500 }
    );
  }
}