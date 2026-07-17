import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const validation = categorySchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { message: "Dados inválidos", errors: validation.error.errors },
      { status: 400 }
    );
  }

  const category = await prisma.category.update({
    where: { id },
    data: validation.data,
  });

  return NextResponse.json({ category });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
  }

  const { id } = await params;

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return NextResponse.json(
      { message: "Não é possível excluir: existem produtos nessa categoria" },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id } });

  return NextResponse.json({ message: "Categoria excluída" });
}
