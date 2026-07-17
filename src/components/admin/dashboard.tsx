"use client"

import { useState } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import AdminTable from "./admin-table"

// Sample data
const salesData = [
  { id: "1", date: "2023-10-01", orders: 12, revenue: 1250.99 },
  { id: "2", date: "2023-10-02", orders: 15, revenue: 1789.50 },
  { id: "3", date: "2023-10-03", orders: 8, revenue: 950.25 },
  { id: "4", date: "2023-10-04", orders: 20, revenue: 2300.75 },
  { id: "5", date: "2023-10-05", orders: 18, revenue: 1890.60 },
  { id: "6", date: "2023-10-06", orders: 14, revenue: 1450.30 },
  { id: "7", date: "2023-10-07", orders: 22, revenue: 2560.40 },
]

const recentOrders = [
  {
    id: "ord-001",
    customer: "John Doe",
    status: "Completed",
    date: "2023-10-07",
    total: 199.99,
  },
  {
    id: "ord-002",
    customer: "Jane Smith",
    status: "Processing",
    date: "2023-10-07",
    total: 349.98,
  },
  {
    id: "ord-003",
    customer: "Michael Johnson",
    status: "Shipped",
    date: "2023-10-06",
    total: 129.50,
  },
  {
    id: "ord-004",
    customer: "Emily Brown",
    status: "Pending",
    date: "2023-10-06",
    total: 89.99,
  },
  {
    id: "ord-005",
    customer: "David Wilson",
    status: "Completed",
    date: "2023-10-05",
    total: 210.75,
  },
]

const lowStockProducts = [
  {
    id: "prod-001",
    name: "Premium Wireless Headphones",
    stock: 3,
    category: "Electronics",
  },
  {
    id: "prod-002",
    name: "Stylish Watch",
    stock: 5,
    category: "Fashion",
  },
  {
    id: "prod-003",
    name: "Ultra HD Smart TV",
    stock: 2,
    category: "Electronics",
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "products" | "orders" | "categories" | "customers"
  >("dashboard")

  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0)
  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0)
  const averageOrderValue = totalRevenue / totalOrders

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <div className="space-y-4">
        <Button
          variant={activeTab === "dashboard" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("dashboard")}
        >
          <LayoutDashboard className="mr-2 h-5 w-5" />
          Dashboard
        </Button>
        <Button
          variant={activeTab === "products" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("products")}
        >
          <Package className="mr-2 h-5 w-5" />
          Products
        </Button>
        <Button
          variant={activeTab === "orders" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("orders")}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Orders
        </Button>
        <Button
          variant={activeTab === "categories" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("categories")}
        >
          <Tag className="mr-2 h-5 w-5" />
          Categories
        </Button>
        <Button
          variant={activeTab === "customers" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("customers")}
        >
          <Users className="mr-2 h-5 w-5" />
          Customers
        </Button>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {activeTab === "dashboard" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatPrice(totalRevenue)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12.5% from last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    +8.2% from last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Average Order Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatPrice(averageOrderValue)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +3.1% from last week
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Customers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">143</div>
                  <p className="text-xs text-muted-foreground">
                    +5.7% from last week
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Link href="/admin/orders">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <AdminTable
                  data={recentOrders}
                  columns={[
                    { key: "id", label: "Order ID" },
                    { key: "customer", label: "Customer" },
                    { key: "date", label: "Date" },
                    { key: "status", label: "Status" },
                    {
                      key: "total",
                      label: "Total",
                      formatter: (value) => formatPrice(value as number),
                    },
                  ]}
                />
              </CardContent>
            </Card>

            {/* Low Stock Products */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Low Stock Products</CardTitle>
                  <Link href="/admin/products">
                    <Button variant="outline" size="sm">
                      View All Products
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <AdminTable
                  data={lowStockProducts}
                  columns={[
                    { key: "id", label: "Product ID" },
                    { key: "name", label: "Product Name" },
                    { key: "category", label: "Category" },
                    {
                      key: "stock",
                      label: "Stock",
                      formatter: (value) => (
                        <span
                          className={`${
                            (value as number) <= 2
                              ? "text-red-500"
                              : "text-yellow-500"
                          } font-medium`}
                        >
                          {value as number}
                        </span>
                      ),
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "products" && (
          <div className="rounded-lg border bg-card p-8">
            <h2 className="text-2xl font-bold mb-6">Products Management</h2>
            <p className="text-muted-foreground">
              This is a placeholder for the Products management section.
              In a complete implementation, you would see a list of all products
              with options to add, edit, and delete products.
            </p>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="rounded-lg border bg-card p-8">
            <h2 className="text-2xl font-bold mb-6">Orders Management</h2>
            <p className="text-muted-foreground">
              This is a placeholder for the Orders management section.
              In a complete implementation, you would see a list of all orders
              with options to view details, update status, and process refunds.
            </p>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="rounded-lg border bg-card p-8">
            <h2 className="text-2xl font-bold mb-6">Categories Management</h2>
            <p className="text-muted-foreground">
              This is a placeholder for the Categories management section.
              In a complete implementation, you would see a list of all categories
              with options to add, edit, and delete categories.
            </p>
          </div>
        )}

        {activeTab === "customers" && (
          <div className="rounded-lg border bg-card p-8">
            <h2 className="text-2xl font-bold mb-6">Customers Management</h2>
            <p className="text-muted-foreground">
              This is a placeholder for the Customers management section.
              In a complete implementation, you would see a list of all customers
              with options to view details, manage accounts, and track activity.
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 