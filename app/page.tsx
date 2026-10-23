"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { MENU_ITEMS, MenuItem, CAFE_DETAILS } from "@/lib/cafe-data"
import { CartItem, generateCartItemId, Order } from "@/lib/order-store"
import { apiCreateOrder } from "@/lib/api"
import { HeroSection } from "@/components/ghoont/hero-section"
import { MarqueeStrip } from "@/components/ghoont/marquee-strip"
import { MenuSection } from "@/components/ghoont/menu-section"
import { CupBuilderSection } from "@/components/ghoont/cup-builder-section"
import { RitualSection } from "@/components/ghoont/ritual-section"
import { RewardsSection } from "@/components/ghoont/rewards-section"
import { VisitSection } from "@/components/ghoont/visit-section"
import { CartDrawer } from "@/components/ghoont/cart-drawer"
import { PaytmModal } from "@/components/customer/paytm-modal"
import { LiveOrderTracker } from "@/components/customer/live-order-tracker"
import { formatINR } from "@/lib/utils"
import Link from "next/link"
import { ShoppingBag, ArrowRight } from "lucide-react"

function GhoontCafeApp() {
  const searchParams = useSearchParams()
  const tableFromUrl = searchParams.get("table") || "04"

  const [tableNumber, setTableNumber] = useState(tableFromUrl)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Paytm Modal state
  const [isPaytmOpen, setIsPaytmOpen] = useState(false)
  const [pendingCheckout, setPendingCheckout] = useState<{
    cookingNotes: string
    customerName: string
    customerPhone: string
  } | null>(null)

  // Active Placed Order for Live Tracker
  const [activeOrder, setActiveOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (tableFromUrl) {
      setTableNumber(tableFromUrl)
    }
  }, [tableFromUrl])

  // Cart total counts & prices
  const cartTotalCount = cartItems.reduce((acc, i) => acc + i.quantity, 0)
  const cartSubtotal = cartItems.reduce((acc, i) => acc + i.totalPrice, 0)
  const cartGst = Math.round(cartSubtotal * 0.05 * 100) / 100
  const cartGrandTotal = Math.round(cartSubtotal + cartGst)

  // Lookup for quantities per item id
  const cartQuantities: Record<string, number> = {}
  cartItems.forEach((ci) => {
    const id = ci.menuItemId || ci.menuItem?.id
    if (id) {
      cartQuantities[id] = (cartQuantities[id] || 0) + ci.quantity
    }
  })

  // Add standard menu item
  const handleAddToCart = (item: MenuItem) => {
    const cartItemId = generateCartItemId(item, {})
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.cartItemId === cartItemId)
      if (existingIdx > -1) {
        const next = [...prev]
        next[existingIdx].quantity += 1
        next[existingIdx].totalPrice = next[existingIdx].quantity * item.price
        return next
      }
      return [
        ...prev,
        {
          cartItemId,
          menuItemId: item.id,
          name: item.name,
          menuItem: item,
          quantity: 1,
          selectedOptions: {},
          unitPrice: item.price,
          totalPrice: item.price,
        },
      ]
    })
  }

  // Add custom crafted brew from the builder
  const handleAddCustomBrew = (customItem: CartItem) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.cartItemId === customItem.cartItemId)
      if (existingIdx > -1) {
        const next = [...prev]
        next[existingIdx].quantity += 1
        next[existingIdx].totalPrice = next[existingIdx].quantity * customItem.unitPrice
        return next
      }
      return [...prev, customItem]
    })
  }

  // Update quantity in cart
  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
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

  // Proceed to Paytm Checkout
  const handleProceedToPay = (
    cookingNotes: string,
    customerName: string,
    customerPhone: string
  ) => {
    setPendingCheckout({ cookingNotes, customerName, customerPhone })
    setIsCartOpen(false)
    setIsPaytmOpen(true)
  }

  // Payment completed
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

      setCartItems([])
      setPendingCheckout(null)
      setActiveOrder(newOrder)
    } catch (e) {
      console.error("Order creation failed", e)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-outer)] text-[var(--ink)] flex flex-col font-sans transition-colors duration-700 selection:bg-[var(--accent)] selection:text-[var(--on-accent)]">
      
      {activeOrder ? (
        <div className="pt-24 pb-20 px-4 flex-1">
          <LiveOrderTracker
            order={activeOrder}
            onBackToMenu={() => setActiveOrder(null)}
          />
        </div>
      ) : (
        <>
          {/* Cinematic Hero */}
          <HeroSection
            tableNumber={tableNumber}
            onTableChange={setTableNumber}
            onOpenOrder={() => setIsCartOpen(true)}
            cartCount={cartTotalCount}
          />

          {/* Marquee Strip */}
          <MarqueeStrip />

          {/* Menu Section */}
          <MenuSection
            items={MENU_ITEMS}
            onAddToCart={handleAddToCart}
            cartQuantities={cartQuantities}
          />

          {/* Interactive Cup Builder */}
          <CupBuilderSection onAddCustomBrew={handleAddCustomBrew} />

          {/* Ritual / Experience Section */}
          <RitualSection />

          {/* Rewards Loyalty Stamp Card */}
          <RewardsSection />

          {/* Visit & Table Booking */}
          <VisitSection />

          {/* Footer */}
          <footer className="border-t border-[var(--line)] py-12 px-4 bg-[var(--bg-outer)]">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[var(--faint)]">
              <Link href="#top" className="font-display text-3xl text-[var(--ink)] no-underline">
                Ghoont
              </Link>
              <div className="text-center sm:text-left">
                {CAFE_DETAILS.name} · Filter kaapi · Masala chai · Matcha · Brewed slow
              </div>
              <div className="font-mono-custom">
                © 2026 Ghoont Café · Table QR Dine-In Platform
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Floating Bottom Cart Bar (when cart has items and not in tracker) */}
      {!activeOrder && cartTotalCount > 0 && (
        <div className="fixed bottom-5 left-4 right-4 z-40 max-w-lg mx-auto animate-in slide-in-from-bottom duration-300">
          <div className="bg-[rgba(20,10,5,0.92)] border border-[var(--accent)] text-[var(--ink)] rounded-full p-3 pl-5 shadow-2xl flex items-center justify-between backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--on-accent)] font-mono-custom font-extrabold text-xs flex items-center justify-center shadow">
                {cartTotalCount}
              </div>
              <div>
                <span className="font-mono-custom text-xs text-[var(--muted)]">
                  Table #{tableNumber} · Total:
                </span>{" "}
                <strong className="font-mono-custom text-sm text-[var(--accent)]">
                  {formatINR(cartGrandTotal)}
                </strong>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-[var(--accent)] hover:bg-[#edd09f] text-[var(--on-accent)] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow transition-all active:scale-95"
            >
              <span>View Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Slide-in Order Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        tableNumber={tableNumber}
        onUpdateQuantity={handleUpdateQuantity}
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

    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-sm font-mono-custom text-[var(--accent)]">Pouring Ghoont Café...</div>}>
      <GhoontCafeApp />
    </Suspense>
  )
}
