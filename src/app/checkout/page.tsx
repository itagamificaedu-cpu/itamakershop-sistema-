"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SafeImage from "@/components/ui/safe-image";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}

interface ShippingOption {
  method: string;
  label: string;
  price: number;
  info?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState("");

  const loadCart = useCallback(async () => {
    const res = await fetch("/api/cart");

    if (res.status === 401) {
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    if (res.ok) {
      const data = await res.json();
      setCartItems(data.cart);
    }
    setIsLoadingCart(false);
  }, [router]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchQuote = useCallback(async (cep: string) => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;

    setQuoteLoading(true);
    setQuoteError("");
    setShippingOptions([]);
    setSelectedMethod("");

    try {
      const res = await fetch("/api/shipping/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cep: digits }),
      });
      const data = await res.json();

      if (!res.ok) {
        setQuoteError(data.message || "Não foi possível calcular o frete");
        setQuoteLoading(false);
        return;
      }

      setShippingOptions(data.options);
      if (data.options.length > 0) {
        setSelectedMethod(data.options[0].method);
      }
    } catch {
      setQuoteError("Não foi possível calcular o frete. Tente novamente.");
    } finally {
      setQuoteLoading(false);
    }
  }, []);

  const handlePostalCodeBlur = () => {
    fetchQuote(formData.postalCode);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    if (!selectedMethod) {
      setFormError("Informe o CEP e escolha uma opção de entrega");
      return;
    }

    if (selectedMethod !== "PICKUP" && !formData.address) {
      setFormError("Preencha o endereço de entrega");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, deliveryMethod: selectedMethod }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || "Não foi possível iniciar o pagamento");
        setIsSubmitting(false);
        return;
      }

      window.location.href = data.initPoint;
    } catch {
      setFormError("Não foi possível iniciar o pagamento. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const shipping = shippingOptions.find((o) => o.method === selectedMethod)?.price ?? 0;
  const total = subtotal + shipping;

  if (isLoadingCart) {
    return (
      <div className="container py-24 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="text-muted-foreground mb-8">Seu carrinho está vazio.</p>
        <Button asChild>
          <Link href="/products">Ver Produtos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="flex items-center mb-8">
        <Link href="/cart" className="text-muted-foreground hover:text-foreground mr-2">
          ← Voltar ao Carrinho
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Seus Dados</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-1">
                    Nome
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-1">
                    Sobrenome
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Entrega</h2>
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium mb-1">
                  CEP
                </label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  onBlur={handlePostalCodeBlur}
                  placeholder="00000-000"
                  required
                  className="w-full max-w-xs"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Informe o CEP para ver as opções de entrega disponíveis
                </p>
              </div>

              {quoteLoading && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-r-transparent" />
                  Calculando opções de entrega...
                </p>
              )}

              {quoteError && <p className="text-sm text-red-500">{quoteError}</p>}

              {shippingOptions.length > 0 && (
                <div className="space-y-2">
                  {shippingOptions.map((option) => (
                    <label
                      key={option.method}
                      className={`flex items-center justify-between border rounded-md p-3 cursor-pointer transition-colors ${
                        selectedMethod === option.method
                          ? "border-primary bg-primary/5"
                          : "border-input"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value={option.method}
                          checked={selectedMethod === option.method}
                          onChange={() => setSelectedMethod(option.method)}
                        />
                        <div>
                          <div className="text-sm font-medium">{option.label}</div>
                          {option.info && (
                            <div className="text-xs text-muted-foreground">{option.info}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {option.price === 0 ? "Grátis" : formatPrice(option.price)}
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {selectedMethod && selectedMethod !== "PICKUP" && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium mb-1">
                      Endereço
                    </label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium mb-1">
                        Cidade
                      </label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium mb-1">
                        Estado
                      </label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === "PICKUP" && (
                <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">
                  Retire seu pedido em: Rua Brisa do Norte, 1017 — Nova Aldeota, Itapipoca/CE
                </div>
              )}
            </div>

            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {formError}
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              Você será redirecionado para o ambiente seguro do Mercado Pago para
              concluir o pagamento.
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting || !selectedMethod}
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent" />
                  Redirecionando...
                </>
              ) : (
                `Pagar ${formatPrice(total)} com Mercado Pago`
              )}
            </Button>
          </form>
        </div>

        <div>
          <div className="bg-muted/50 rounded-lg p-6 sticky top-4">
            <h2 className="text-lg font-medium mb-4">Resumo do Pedido</h2>

            <div className="max-h-80 overflow-auto space-y-4 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex space-x-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md flex-shrink-0">
                    <SafeImage
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium line-clamp-1">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                    <p className="font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span>
                  {selectedMethod
                    ? shipping === 0
                      ? "Grátis"
                      : formatPrice(shipping)
                    : "Informe o CEP"}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
