"use client"

import { MenuItem, CustomizationOption } from "./cafe-data"

export interface CartItem {
  cartItemId: string
  menuItem?: MenuItem
  menuItemId?: string
  name?: string
  quantity: number
  selectedOptions: Record<string, CustomizationOption>
  unitPrice: number
  totalPrice: number
}

export type OrderStatus = "received" | "brewing" | "ready" | "served"

export interface Order {
  id: string
  orderNumber: number
  tableNumber: string
  items: CartItem[]
  subtotal: number
  gstAmount: number // 5% GST
  totalAmount: number
  paymentMethod: "PAYTM_UPI" | "PHONEPE" | "GPAY" | "COUNTER"
  paymentStatus: "PAID" | "PENDING_COUNTER"
  customerName?: string
  customerPhone?: string
  cookingNotes?: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
}

const ORDERS_STORAGE_KEY = "roast_bloom_cafe_orders"
const CURRENT_ORDER_KEY = "roast_bloom_current_order"

// Helper to calculate unit price based on customizations
export function calculateUnitPrice(item: MenuItem, selectedOptions: Record<string, CustomizationOption>): number {
  let total = item.price
  for (const option of Object.values(selectedOptions)) {
    total += option.price
  }
  return total
}

// Generate unique cart item id based on item and chosen options
export function generateCartItemId(item: MenuItem, selectedOptions: Record<string, CustomizationOption>): string {
  const optionsKey = Object.entries(selectedOptions)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([groupId, opt]) => `${groupId}:${opt.id}`)
    .join("|")
  return `${item.id}_${optionsKey}`
}

// Seed initial orders if empty so vendor demo immediately has realistic data!
export function getSavedOrders(): Order[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY)
    if (!raw) {
      const demoOrders: Order[] = [
        {
          id: "ORD-101",
          orderNumber: 101,
          tableNumber: "02",
          items: [
            {
              cartItemId: "sea-salt-cold-brew_demo",
              menuItem: {
                id: "sea-salt-cold-brew",
                name: "Sea Salt Caramel Cold Brew",
                category: "cold-coffee",
                price: 245,
                description: "16-hour slow steeped Chikmagalur Arabica...",
                image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
                isVeg: true,
              },
              quantity: 1,
              selectedOptions: {
                milk: { id: "oat", name: "Oat Milk", price: 45 },
                sweetness: { id: "less", name: "Less Sweet", price: 0 },
              },
              unitPrice: 290,
              totalPrice: 290,
            },
            {
              cartItemId: "chilli-cheese-toast_demo",
              menuItem: {
                id: "chilli-cheese-toast",
                name: "Mumbai Spiced Chilli Cheese Toasties",
                category: "bites-bakery",
                price: 195,
                description: "Artisan sourdough...",
                image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
                isVeg: true,
              },
              quantity: 1,
              selectedOptions: {},
              unitPrice: 195,
              totalPrice: 195,
            },
          ],
          subtotal: 485,
          gstAmount: 24.25,
          totalAmount: 509,
          paymentMethod: "PAYTM_UPI",
          paymentStatus: "PAID",
          customerName: "Aarav Sharma",
          customerPhone: "+91 98450 12345",
          cookingNotes: "Please make the toast extra crispy!",
          status: "brewing",
          createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
        },
        {
          id: "ORD-102",
          orderNumber: 102,
          tableNumber: "05",
          items: [
            {
              cartItemId: "south-indian-filter_demo",
              menuItem: {
                id: "south-indian-filter",
                name: "Estate Filter Coffee (Brass Dabarah)",
                category: "hot-coffee",
                price: 135,
                description: "Authentic 80:20 Arabica...",
                image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
                isVeg: true,
              },
              quantity: 2,
              selectedOptions: {
                sweetness: { id: "regular", name: "Regular Sweet", price: 0 },
              },
              unitPrice: 135,
              totalPrice: 270,
            },
          ],
          subtotal: 270,
          gstAmount: 13.5,
          totalAmount: 284,
          paymentMethod: "PAYTM_UPI",
          paymentStatus: "PAID",
          customerName: "Priya V.",
          cookingNotes: "Super hot please",
          status: "ready",
          createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        },
      ]
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(demoOrders))
      return demoOrders
    }
    return JSON.parse(raw)
  } catch (e) {
    console.error("Failed to parse orders from localStorage", e)
    return []
  }
}

export function saveOrders(orders: Order[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
  // Broadcast update to other tabs (kitchen/customer)
  try {
    const channel = new BroadcastChannel("roast_bloom_orders")
    channel.postMessage({ type: "ORDERS_UPDATED", orders })
    channel.close()
  } catch {
    // Fallback if BroadcastChannel unsupported
    window.dispatchEvent(new Event("storage"))
  }
}

export function createNewOrder(orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">): Order {
  const existing = getSavedOrders()
  const orderNumber = existing.length > 0 ? Math.max(...existing.map((o) => o.orderNumber || 100)) + 1 : 101
  const id = `ORD-${orderNumber}`
  const now = new Date().toISOString()

  const newOrder: Order = {
    ...orderData,
    id,
    orderNumber,
    createdAt: now,
    updatedAt: now,
  }

  const updatedOrders = [newOrder, ...existing]
  saveOrders(updatedOrders)
  
  if (typeof window !== "undefined") {
    localStorage.setItem(CURRENT_ORDER_KEY, JSON.stringify(newOrder))
  }

  return newOrder
}

export function updateOrderStatus(orderId: string, status: OrderStatus): void {
  const orders = getSavedOrders()
  const updated = orders.map((o) => {
    if (o.id === orderId) {
      return { ...o, status, updatedAt: new Date().toISOString() }
    }
    return o
  })
  saveOrders(updated)

  // Also update active order if currently viewed
  if (typeof window !== "undefined") {
    const active = localStorage.getItem(CURRENT_ORDER_KEY)
    if (active) {
      const activeObj: Order = JSON.parse(active)
      if (activeObj.id === orderId) {
        activeObj.status = status
        localStorage.setItem(CURRENT_ORDER_KEY, JSON.stringify(activeObj))
      }
    }
  }
}

export function getActiveOrder(): Order | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(CURRENT_ORDER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
