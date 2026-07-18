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

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
  }

  const body = await req.json();
  const validation = productSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { message: "Dados inválidos", errors: validation.error.errors },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({ data: validation.data });

  return NextResponse.json({ product }, { status: 201 });
}
