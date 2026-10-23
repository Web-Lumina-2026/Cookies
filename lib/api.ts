import { Order, OrderStatus, CartItem, getSavedOrders, saveOrders, createNewOrder, updateOrderStatus as localUpdateStatus } from "./order-store"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

export interface VendorStats {
  totalRevenue: number
  totalOrders: number
  activeOrders: number
  readyOrders: number
  servedOrders: number
  avgOrderValue: number
}

// Fetch all orders (with fallback to local storage)
export async function apiGetOrders(status?: string): Promise<Order[]> {
  try {
    const url = status ? `${API_BASE}/orders?status=${status}` : `${API_BASE}/orders`
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) throw new Error("API returned non-200")
    const data = await res.json()
    return data
  } catch {
    // Graceful offline/local fallback
    return getSavedOrders()
  }
}

// Fetch single order for live tracking
export async function apiGetOrderById(orderId: string): Promise<Order | null> {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}`, { cache: "no-store" })
    if (!res.ok) throw new Error("Order not found")
    return await res.json()
  } catch {
    const local = getSavedOrders().find((o) => o.id === orderId)
    return local || null
  }
}

// Create new order
export async function apiCreateOrder(payload: {
  tableNumber: string
  items: CartItem[]
  subtotal: number
  gstAmount: number
  totalAmount: number
  paymentMethod: "PAYTM_UPI" | "PHONEPE" | "GPAY" | "COUNTER"
  paymentStatus: "PAID" | "PENDING_COUNTER"
  customerName?: string
  customerPhone?: string
  cookingNotes?: string
}): Promise<Order> {
  // Format items for backend schema
  const formattedItems = payload.items.map((i) => ({
    cartItemId: i.cartItemId,
    menuItemId: i.menuItemId || i.menuItem?.id || "",
    name: i.name || i.menuItem?.name || "Artisanal Item",
    quantity: i.quantity,
    selectedOptions: i.selectedOptions,
    unitPrice: i.unitPrice,
    totalPrice: i.totalPrice,
  }))

  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableNumber: payload.tableNumber,
        items: formattedItems,
        subtotal: payload.subtotal,
        gstAmount: payload.gstAmount,
        totalAmount: payload.totalAmount,
        paymentMethod: payload.paymentMethod,
        paymentStatus: payload.paymentStatus,
        customerName: payload.customerName || "",
        customerPhone: payload.customerPhone || "",
        cookingNotes: payload.cookingNotes || "",
      }),
    })

    if (!res.ok) throw new Error("Failed to create order on server")
    const order = await res.json()
    // Also sync to local storage & broadcast channel
    const currentOrders = getSavedOrders()
    saveOrders([order, ...currentOrders.filter((o) => o.id !== order.id)])
    return order
  } catch (e) {
    console.warn("Backend API unreachable, using client offline store:", e)
    return createNewOrder({
      tableNumber: payload.tableNumber,
      items: payload.items,
      subtotal: payload.subtotal,
      gstAmount: payload.gstAmount,
      totalAmount: payload.totalAmount,
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentStatus,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      cookingNotes: payload.cookingNotes,
      status: "received",
    })
  }
}

// Update order status (KDS actions)
export async function apiUpdateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) throw new Error("Failed to patch status")
  } catch (e) {
    console.warn("Could not patch status to API, updating locally:", e)
  }
  // Always update locally for instant UI responsiveness
  localUpdateStatus(orderId, status)
}

// Get vendor dashboard stats
export async function apiGetStats(): Promise<VendorStats> {
  try {
    const res = await fetch(`${API_BASE}/stats`, { cache: "no-store" })
    if (res.ok) return await res.json()
  } catch {}

  const orders = getSavedOrders()
  const rev = orders.reduce((acc, o) => acc + o.totalAmount, 0)
  return {
    totalRevenue: Math.round(rev),
    totalOrders: orders.length,
    activeOrders: orders.filter((o) => o.status === "received" || o.status === "brewing").length,
    readyOrders: orders.filter((o) => o.status === "ready").length,
    servedOrders: orders.filter((o) => o.status === "served").length,
    avgOrderValue: orders.length ? Math.round(rev / orders.length) : 0,
  }
}
