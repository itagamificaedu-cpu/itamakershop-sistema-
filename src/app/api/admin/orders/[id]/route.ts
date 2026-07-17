import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/admin-auth";

const statusSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
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
  const validation = statusSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { message: "Status inválido", errors: validation.error.errors },
      { status: 400 }
    );
  }

  // Status de pagamento (paymentStatus) nunca é alterado manualmente aqui —
  // essa informação vem só do webhook do Mercado Pago, pra evitar marcar
  // um pedido como pago sem o pagamento ter sido confirmado de verdade.
  const order = await prisma.order.update({
    where: { id },
    data: { status: validation.data.status },
  });

  return NextResponse.json({ order });
}
