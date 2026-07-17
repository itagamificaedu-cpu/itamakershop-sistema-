"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/utils";

interface Order {
  id: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  orderItems: { id: string; quantity: number; product: { name: string } }[];
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
      });
      fetch("/api/orders")
        .then((res) => (res.ok ? res.json() : { orders: [] }))
        .then((data) => setOrders(data.orders))
        .finally(() => setOrdersLoading(false));
    }
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // This is a mock update - in a real app, you would call an API endpoint
      // await fetch("/api/user/profile", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setMessage({ 
        text: "Profile updated successfully", 
        type: "success" 
      });
    } catch {
      setMessage({
        text: "Failed to update profile",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="container py-12 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account information
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-muted/50 p-6 rounded-lg">
            {message.text && (
              <div
                className={`mb-4 p-4 rounded ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <Button type="submit" className="mt-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </div>

          <div className="bg-muted/50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Histórico de Pedidos</h2>
            {ordersLoading ? (
              <div className="flex justify-center py-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-r-transparent" />
              </div>
            ) : orders.length === 0 ? (
              <div className="border rounded-md p-4 text-center">
                <p className="mb-4 text-muted-foreground">
                  Você ainda não fez nenhum pedido.
                </p>
                <Button asChild>
                  <Link href="/products">Comprar Agora</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/checkout/success?order_id=${order.id}`}
                    className="block border rounded-md p-4 hover:bg-muted transition-colors"
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">Pedido #{order.id.slice(-8)}</span>
                      <span className="text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {order.orderItems.length} ite{order.orderItems.length === 1 ? "m" : "ns"} · {order.paymentStatus}
                      </span>
                      <span className="font-medium">{formatPrice(order.total)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-muted/50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 