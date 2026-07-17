import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
});

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
  }

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
  }

  const body = await req.json();
  const validation = categorySchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { message: "Dados inválidos", errors: validation.error.errors },
      { status: 400 }
    );
  }

  const existing = await prisma.category.findUnique({ where: { name: validation.data.name } });
  if (existing) {
    return NextResponse.json({ message: "Já existe uma categoria com esse nome" }, { status: 400 });
  }

  const category = await prisma.category.create({ data: validation.data });

  return NextResponse.json({ category }, { status: 201 });
}
