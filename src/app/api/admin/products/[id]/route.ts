import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  images: z.array(z.string()).min(1),
  categoryId: z.string().min(1),
  featured: z.boolean().optional().default(false),
  inventory: z.number().int().min(0),
  weightKg: z.number().positive().optional().default(0.3),
  heightCm: z.number().positive().optional().default(3),
  widthCm: z.number().positive().optional().default(16),
  lengthCm: z.number().positive().optional().default(20),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return NextResponse.json({ message: "Produto não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ product });
}

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
  const validation = productSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { message: "Dados inválidos", errors: validation.error.errors },
      { status: 400 }
    );
  }

  const product = await prisma.product.update({
    where: { id },
    data: validation.data,
  });

  return NextResponse.json({ product });
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

  const hasOrders = await prisma.orderItem.findFirst({ where: { productId: id } });
  if (hasOrders) {
    return NextResponse.json(
      { message: "Não é possível excluir: este produto já tem pedidos associados. Desative o estoque em vez de excluir." },
      { status: 409 }
    );
  }

  await prisma.cartItem.deleteMany({ where: { productId: id } });
  await prisma.wishlistItem.deleteMany({ where: { productId: id } });
  await prisma.review.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ message: "Produto excluído" });
}
