"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { MENU_ITEMS, MenuItem, CustomizationOption, CAFE_DETAILS } from "@/lib/cafe-data"
import { CartItem, generateCartItemId, calculateUnitPrice, Order } from "@/lib/order-store"
import { apiCreateOrder } from "@/lib/api"
import { TableHeader } from "@/components/customer/table-header"
import { MenuGrid } from "@/components/customer/menu-grid"
import { ItemModal } from "@/components/customer/item-modal"
import { CartSheet } from "@/components/customer/cart-sheet"
import { PaytmModal } from "@/components/customer/paytm-modal"
import { LiveOrderTracker } from "@/components/customer/live-order-tracker"
import { formatINR } from "@/lib/utils"
import { ShoppingBag, ArrowRight, ShieldCheck, Heart } from "lucide-react"

function CafeOrderingApp() {
  const searchParams = useSearchParams()
  const tableFromUrl = searchParams.get("table") || "04"

  const [tableNumber, setTableNumber] = useState(tableFromUrl)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isVegOnly, setIsVegOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Customization Modal state
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null)

  // Paytm Payment Modal state
  const [isPaytmOpen, setIsPaytmOpen] = useState(false)
  const [pendingCheckout, setPendingCheckout] = useState<{
    cookingNotes: string
    customerName: string
    customerPhone: string
  } | null>(null)

  // Active placed order for Live Tracker
  const [activeOrder, setActiveOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (tableFromUrl) {
      setTableNumber(tableFromUrl)
    }
  }, [tableFromUrl])

  // Filter menu items
  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesVeg = !isVegOnly || item.isVeg
    const matchesSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesVeg && matchesSearch
  })

  // Cart quantity lookup
  const cartQuantities: Record<string, number> = {}
  cartItems.forEach((ci) => {
    const id = ci.menuItemId || ci.menuItem?.id
    if (id) {
      cartQuantities[id] = (cartQuantities[id] || 0) + ci.quantity
    }
  })

  const cartTotalCount = cartItems.reduce((acc, i) => acc + i.quantity, 0)
  const cartSubtotal = cartItems.reduce((acc, i) => acc + i.totalPrice, 0)
  const cartGst = Math.round(cartSubtotal * 0.05 * 100) / 100
  const cartGrandTotal = Math.round(cartSubtotal + cartGst)

  // Handle item selection from grid
  const handleItemSelect = (item: MenuItem) => {
    // If item has customizations, open modal
    if (item.customizations && item.customizations.length > 0) {
      setCustomizingItem(item)
    } else {
      // Add directly
      handleAddDirectly(item)
    }
  }

  const handleAddDirectly = (item: MenuItem) => {
    const unitPrice = item.price
    const cartItemId = generateCartItemId(item, {})

    setCartItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.cartItemId === cartItemId)
      if (existingIdx > -1) {
        const next = [...prev]
        next[existingIdx].quantity += 1
        next[existingIdx].totalPrice = next[existingIdx].quantity * unitPrice
        return next
      }
      return [
        ...prev,
        {
          cartItemId,
          menuItem: item,
          quantity: 1,
          selectedOptions: {},
          unitPrice,
          totalPrice: unitPrice,
        },
      ]
    })
  }

  // Handle customized add
  const handleAddCustomized = (
    item: MenuItem,
    selectedOptions: Record<string, CustomizationOption>,
    quantity: number
  ) => {
    const unitPrice = calculateUnitPrice(item, selectedOptions)
    const cartItemId = generateCartItemId(item, selectedOptions)

    setCartItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.cartItemId === cartItemId)
      if (existingIdx > -1) {
        const next = [...prev]
        next[existingIdx].quantity += quantity
        next[existingIdx].totalPrice = next[existingIdx].quantity * unitPrice
        return next
      }
      return [
        ...prev,
        {
          cartItemId,
          menuItem: item,
          quantity,
          selectedOptions,
          unitPrice,
          totalPrice: unitPrice * quantity,
        },
      ]
    })
  }

  // Update item quantity in cart
  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    setCartItems((prev) => {
      if (newQty <= 0) {
        return prev.filter((i) => i.cartItemId !== cartItemId)
      }
      return prev.map((item) => {
        if (item.cartItemId === cartItemId) {
          return {
            ...item,
            quantity: newQty,
            totalPrice: newQty * item.unitPrice,
          }
        }
        return item
      })
    })
  }

  // Proceed from cart sheet to Paytm payment modal
  const handleProceedToPay = (
    cookingNotes: string,
    customerName: string,
    customerPhone: string
  ) => {
    setPendingCheckout({ cookingNotes, customerName, customerPhone })
    setIsCartOpen(false)
    setIsPaytmOpen(true)
  }

  // On payment success: post order to FastAPI and switch to Live Tracker
  const handlePaymentSuccess = async (paymentMethod: "PAYTM_UPI" | "COUNTER") => {
    setIsPaytmOpen(false)

    try {
      const newOrder = await apiCreateOrder({
        tableNumber,
        items: cartItems,
        subtotal: cartSubtotal,
        gstAmount: cartGst,
        totalAmount: cartGrandTotal,
        paymentMethod: paymentMethod === "COUNTER" ? "COUNTER" : "PAYTM_UPI",
        paymentStatus: paymentMethod === "COUNTER" ? "PENDING_COUNTER" : "PAID",
        customerName: pendingCheckout?.customerName || "",
        customerPhone: pendingCheckout?.customerPhone || "",
        cookingNotes: pendingCheckout?.cookingNotes || "",
      })

      // Clear cart & show tracker
      setCartItems([])
      setPendingCheckout(null)
      setActiveOrder(newOrder)
    } catch (err) {
      console.error("Order submission failed", err)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <TableHeader
        tableNumber={tableNumber}
        onTableChange={setTableNumber}
        isVegOnly={isVegOnly}
        onToggleVegOnly={setIsVegOnly}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 pb-28">
        {activeOrder ? (
          <LiveOrderTracker
            order={activeOrder}
            onBackToMenu={() => setActiveOrder(null)}
          />
        ) : (
          <>
            {/* Promotional Banner */}
            <div className="mb-4 bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-white rounded-2xl p-4 shadow-sm flex items-center justify-between border border-amber-800">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-amber-800 px-2 py-0.5 rounded-full text-amber-200">
                  Specialty Coffee Week
                </span>
                <h2 className="font-serif font-bold text-base sm:text-lg mt-1">
                  Chikmagalur Single Estate Cold Brews
                </h2>
                <p className="text-xs text-amber-200/80 mt-0.5">
                  Steeped for 16 hours. 100% Arabica. Customize with Oat / Almond milk.
                </p>
              </div>
              <div className="hidden sm:block text-right">
                <span className="text-xs font-semibold text-amber-300">Fast Table Service</span>
                <div className="text-[11px] text-stone-300">Avg prep time: 4 mins</div>
              </div>
            </div>

            {/* Menu Items Grid */}
            <MenuGrid
              items={filteredItems}
              category={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onItemSelect={handleItemSelect}
              cartQuantities={cartQuantities}
            />
          </>
        )}
      </main>

      {/* Floating Bottom Cart Bar */}
      {!activeOrder && cartTotalCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto animate-in slide-in-from-bottom duration-200">
          <div className="bg-[#002970] text-white rounded-2xl p-3.5 shadow-2xl flex items-center justify-between border border-blue-400/30">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-stone-900 font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {cartTotalCount}
                </span>
              </div>
              <div>
                <div className="text-xs font-medium text-blue-200">
                  Table #{tableNumber} • {cartTotalCount} items
                </div>
                <div className="text-base font-extrabold tracking-tight">
                  {formatINR(cartGrandTotal)}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-white hover:bg-blue-50 text-[#002970] px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95"
            >
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Item Customizer Modal */}
      <ItemModal
        item={customizingItem}
        isOpen={!!customizingItem}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={handleAddCustomized}
      />

      {/* Slide-in Cart Sheet */}
      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        tableNumber={tableNumber}
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={() => setCartItems([])}
        onProceedToPay={handleProceedToPay}
      />

      {/* Paytm / UPI Payment Gateway Modal */}
      <PaytmModal
        isOpen={isPaytmOpen}
        totalAmount={cartGrandTotal}
        tableNumber={tableNumber}
        onClose={() => setIsPaytmOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Footer Branding for local vendors */}
      <footer className="mt-auto border-t border-stone-200 dark:border-stone-800 bg-[#f4efe6] dark:bg-stone-950 py-6 px-4 text-center text-xs text-stone-500">
        <div className="max-w-md mx-auto space-y-1.5">
          <p className="font-semibold text-stone-700 dark:text-stone-300">
            {CAFE_DETAILS.name}
          </p>
          <p>{CAFE_DETAILS.address} • FSSAI Lic: {CAFE_DETAILS.fssai}</p>
          <p className="text-[11px] text-stone-400">
            Powered by WebLumina QR Dining Platform • Instant Paytm UPI Payments
          </p>
        </div>
      </footer>

    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm font-semibold">Loading café menu...</div>}>
      <CafeOrderingApp />
    </Suspense>
  )
}
