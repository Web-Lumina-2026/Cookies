"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import QRCode from "qrcode"
import { CAFE_DETAILS } from "@/lib/cafe-data"
import { Printer, ArrowLeft, QrCode, Sparkles, Coffee } from "lucide-react"

interface TableCard {
  tableNumber: string
  qrUrl: string
  targetUrl: string
}

export default function AdminQRGeneratorPage() {
  const [tableCount, setTableCount] = useState(6)
  const [tableCards, setTableCards] = useState<TableCard[]>([])
  const [origin, setOrigin] = useState("http://localhost:3000")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin)
    }
  }, [])

  useEffect(() => {
    async function generateQRs() {
      const cards: TableCard[] = []
      for (let i = 1; i <= tableCount; i++) {
        const tableNum = i < 10 ? `0${i}` : `${i}`
        const targetUrl = `${origin}/?table=${tableNum}`
        try {
          const qrUrl = await QRCode.toDataURL(targetUrl, {
            width: 300,
            margin: 2,
            color: {
              dark: "#2b1f1d",
              light: "#FFFFFF",
            },
          })
          cards.push({ tableNumber: tableNum, qrUrl, targetUrl })
        } catch (err) {
          console.error(err)
        }
      }
      setTableCards(cards)
    }

    generateQRs()
  }, [tableCount, origin])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 p-4 sm:p-8 font-sans print:p-0 print:bg-white">
      
      {/* Top Header Controls (Hidden during print) */}
      <div className="max-w-5xl mx-auto mb-6 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-stone-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="text-stone-500 hover:text-stone-900 p-1 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 dark:text-stone-100">
                Table QR Standee Generator
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-1 ml-7">
              Printable acrylic tent cards with table deep-linking for {CAFE_DETAILS.name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <label className="text-stone-600 dark:text-stone-400">Tables:</label>
              <select
                value={tableCount}
                onChange={(e) => setTableCount(Number(e.target.value))}
                className="border rounded-lg px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold"
              >
                {[2, 4, 6, 8, 10, 12, 16, 20].map((num) => (
                  <option key={num} value={num}>
                    {num} Tables
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePrint}
              className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Table Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Cards Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
        {tableCards.map((card) => (
          <div
            key={card.tableNumber}
            className="bg-white text-stone-900 rounded-3xl p-6 shadow-md border-2 border-stone-200 flex flex-col items-center text-center relative overflow-hidden print:shadow-none print:border-stone-800 print:break-inside-avoid"
          >
            {/* Top Accent Pill */}
            <div className="w-full bg-amber-900 text-amber-100 py-1.5 px-3 rounded-full text-[11px] font-bold tracking-wider uppercase mb-4 flex items-center justify-center gap-1.5">
              <Coffee className="w-3.5 h-3.5 text-amber-300" />
              <span>{CAFE_DETAILS.name}</span>
            </div>

            {/* Table Number Badge */}
            <div className="text-xs uppercase font-extrabold tracking-widest text-amber-800">
              Dine-In Table
            </div>
            <div className="text-4xl font-serif font-black text-stone-900 mb-3">
              #{card.tableNumber}
            </div>

            {/* QR Code Container */}
            <div className="p-3 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-300 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.qrUrl}
                alt={`QR for Table ${card.tableNumber}`}
                className="w-44 h-44 rounded-lg object-contain"
              />
            </div>

            {/* Call to action text */}
            <div className="space-y-1">
              <div className="font-bold text-sm text-stone-900">
                Scan to View Menu & Order
              </div>
              <p className="text-[11px] text-stone-500 leading-tight">
                No app required • Instant Paytm / UPI Checkout
              </p>
            </div>

            {/* WiFi Details */}
            <div className="mt-4 pt-3 border-t border-stone-200 w-full text-[10px] text-stone-500 flex items-center justify-between">
              <span>WiFi: <strong className="text-stone-800">{CAFE_DETAILS.wifiName}</strong></span>
              <span>Pass: <strong className="text-stone-800">{CAFE_DETAILS.wifiPass}</strong></span>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
