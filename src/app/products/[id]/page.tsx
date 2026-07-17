import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Heart, Star } from "lucide-react";
import AddToCartButton from "@/components/products/add-to-cart-button";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return {
      title: "Produto não encontrado",
      description: "O produto solicitado não foi encontrado",
    };
  }

  return {
    title: `${product.name} - ItaMakerShop`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="container py-12">
      <nav className="mb-6">
        <ol className="flex text-sm">
          <li className="flex items-center">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Início
            </Link>
            <span className="mx-2 text-muted-foreground">/</span>
          </li>
          <li className="flex items-center">
            <Link href="/products" className="text-muted-foreground hover:text-foreground">
              Produtos
            </Link>
            <span className="mx-2 text-muted-foreground">/</span>
          </li>
          <li className="font-medium text-foreground">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={product.images[0] || "/placeholder-product.jpg"}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-col space-y-6">
          <div>
            <Link
              href={`/products?category=${product.categoryId}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {product.category.name}
            </Link>
            <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">
              {product.rating?.toFixed(1)} ({product.reviews.length} avaliações)
            </span>
          </div>

          <p className="text-xl font-bold">{formatPrice(product.price)}</p>

          <div>
            <h2 className="text-lg font-semibold">Descrição</h2>
            <p className="mt-2 text-gray-500">{product.description}</p>
          </div>

          <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
            <AddToCartButton
              productId={product.id}
              disabled={product.inventory <= 0}
              size="lg"
              className="flex-1"
            />
            <Button variant="outline" size="lg" className="flex-1" disabled>
              <Heart className="mr-2 h-5 w-5" />
              Favoritos (em breve)
            </Button>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <p className="text-sm">
                <span className="font-medium">
                  {product.inventory > 0 ? "Em Estoque" : "Fora de Estoque"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold">Avaliações de Clientes</h2>

        <div className="mt-6 space-y-8">
          {product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{review.user.name}</span>
                </div>
                <p className="mt-2 text-gray-500">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Ainda não há avaliações para este produto.</p>
          )}
        </div>
      </div>
    </div>
  );
} 