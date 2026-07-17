"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MinusCircle, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    inventory: number;
  };
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch("/api/cart");

    if (res.status === 401) {
      router.push("/login?callbackUrl=/cart");
      return;
    }

    if (!res.ok) {
      setError("Não foi possível carregar o carrinho.");
      setIsLoading(false);
      return;
    }

    const data = await res.json();
    setCartItems(data.cart);
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
    const res = await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, quantity }),
    });
    if (!res.ok) {
      loadCart();
    }
  };

  const removeItem = async (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
    await fetch(`/api/cart?id=${id}`, { method: "DELETE" });
  };

  const calculateSubtotal = () =>
    cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>

      {isLoading ? (
        <div className="py-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        </div>
      ) : error ? (
        <div className="py-12 text-center text-red-500">{error}</div>
      ) : cartItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="space-y-8">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-6"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-md">
                      <Image
                        src={item.product.images[0] || "/placeholder-product.jpg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/products/${item.product.id}`}
                        className="font-medium hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {formatPrice(item.product.price)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <MinusCircle className="h-4 w-4" />
                        <span className="sr-only">Diminuir quantidade</span>
                      </Button>
                      <span className="w-4 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.inventory}
                      >
                        <PlusCircle className="h-4 w-4" />
                        <span className="sr-only">Aumentar quantidade</span>
                      </Button>
                    </div>
                    <div className="font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remover item</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Resumo do Pedido</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Button className="w-full mt-6" size="lg" asChild>
              <Link href="/checkout">Finalizar Compra</Link>
            </Button>
            <div className="mt-4 text-center">
              <Link href="/products" className="text-sm text-primary hover:underline">
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center">
          <h2 className="text-xl font-medium mb-4">Seu carrinho está vazio</h2>
          <p className="mb-8 text-muted-foreground">
            Você ainda não adicionou nenhum produto ao carrinho.
          </p>
          <Button asChild>
            <Link href="/products">Ver Produtos</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
