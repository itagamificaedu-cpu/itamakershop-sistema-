"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

export default function ProductsFilters() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])

  return (
    <div className="space-y-6 sticky top-20">
      <div className="space-y-4">
        <h3 className="font-medium">Categories</h3>
        <div className="space-y-2">
          {[
            { id: "all", name: "All Categories" },
            { id: "1", name: "Electronics" },
            { id: "2", name: "Fashion" },
            { id: "3", name: "Home & Furniture" },
            { id: "4", name: "Beauty" },
            { id: "5", name: "Sports" },
            { id: "6", name: "Books" },
          ].map((category) => (
            <div key={category.id} className="flex items-center">
              <input
                type="checkbox"
                id={`category-${category.id}`}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                defaultChecked={category.id === "all"}
              />
              <label
                htmlFor={`category-${category.id}`}
                className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Price Range</h3>
        <div className="space-y-6">
          <Slider
            value={priceRange}
            min={0}
            max={1000}
            step={10}
            onValueChange={(value: [number, number]) => setPriceRange(value)}
          />
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={priceRange[0]}
              min={0}
              max={priceRange[1]}
              className="h-8"
              onChange={(e) => {
                const value = Number(e.target.value)
                setPriceRange([value, priceRange[1]])
              }}
            />
            <span>to</span>
            <Input
              type="number"
              value={priceRange[1]}
              min={priceRange[0]}
              max={1000}
              className="h-8"
              onChange={(e) => {
                const value = Number(e.target.value)
                setPriceRange([priceRange[0], value])
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Rating</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <input
                type="checkbox"
                id={`rating-${rating}`}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor={`rating-${rating}`}
                className="ml-2 flex items-center"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
                <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">
                  & Up
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Availability</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="in-stock"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              defaultChecked
            />
            <label
              htmlFor="in-stock"
              className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              In Stock
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="out-of-stock"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label
              htmlFor="out-of-stock"
              className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Out of Stock
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button className="w-full">Apply Filters</Button>
      </div>
    </div>
  )
} 