import AdminDashboard from "@/components/admin/dashboard"

export const metadata = {
  title: "Admin | ItaMakerShop",
  description: "Gerencie sua loja, produtos, pedidos e mais",
}

export default function AdminPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your store, products, orders, and more
          </p>
        </div>
        
        <AdminDashboard />
      </div>
    </div>
  )
} 