import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validação do item do carrinho
const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

// Obter o carrinho de compras
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "You must be logged in to view your cart" },
        { status: 401 }
      );
    }

    // Busca todos os itens do carrinho para o usuário
    const cart = await prisma.cartItem.findMany({
      where: {
        cartId: session.user.id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            inventory: true,
          },
        },
      },
    });

    return NextResponse.json({ cart });
  } catch (error) {
    console.error("Error getting cart:", error);
    return NextResponse.json(
      { message: "Error getting cart" },
      { status: 500 }
    );
  }
}

// Adicionar item ao carrinho
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "You must be logged in to add items to your cart" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = cartItemSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validation.error.errors },
        { status: 400 }
      );
    }

    const { productId, quantity } = validation.data;

    // Verifica se o produto existe
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // Verifica estoque
    if (product.inventory < quantity) {
      return NextResponse.json(
        { message: "Not enough stock available" },
        { status: 400 }
      );
    }

    // Verifica se o item já existe no carrinho
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: session.user.id,
        productId,
      },
    });

    let cartItem;

    if (existingCartItem) {
      // Atualiza a quantidade
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
            },
          },
        },
      });
    } else {
      // Cria um novo item no carrinho
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: session.user.id,
          productId,
          quantity,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
            },
          },
        },
      });
    }

    return NextResponse.json(
      { message: "Item added to cart", cartItem },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { message: "Error adding item to cart" },
      { status: 500 }
    );
  }
}

// Atualizar item do carrinho
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "You must be logged in to update your cart" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    if (!body.id || typeof body.quantity !== "number" || body.quantity < 1) {
      return NextResponse.json(
        { message: "Invalid data" },
        { status: 400 }
      );
    }

    const { id, quantity } = body;

    // Verifica se o item existe
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cartId: session.user.id,
      },
      include: {
        product: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 }
      );
    }

    // Verifica estoque
    if (cartItem.product.inventory < quantity) {
      return NextResponse.json(
        { message: "Not enough stock available" },
        { status: 400 }
      );
    }

    // Atualiza a quantidade
    const updatedCartItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
          },
        },
      },
    });

    return NextResponse.json({ cartItem: updatedCartItem });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { message: "Error updating cart item" },
      { status: 500 }
    );
  }
}

// Remover item do carrinho
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "You must be logged in to remove items from your cart" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Cart item ID is required" },
        { status: 400 }
      );
    }

    // Verifica se o item existe
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cartId: session.user.id,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 }
      );
    }

    // Remove o item
    await prisma.cartItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { message: "Error removing cart item" },
      { status: 500 }
    );
  }
} 