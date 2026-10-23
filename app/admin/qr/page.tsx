"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import QRCode from "qrcode"
import { CAFE_DETAILS } from "@/lib/cafe-data"
import { Printer, ArrowLeft, Coffee, Sparkles } from "lucide-react"

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
              dark: "#140a05",
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

  return (
    <div className="min-h-screen bg-[#140a05] text-[#fbf3e6] p-4 sm:p-8 font-sans print:p-0 print:bg-white print:text-black">
      
      {/* Top Header Controls (Hidden during print) */}
      <div className="max-w-5xl mx-auto mb-8 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1e110a] p-5 sm:p-6 rounded-3xl border border-[rgba(251,243,230,0.14)] shadow-xl">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="w-9 h-9 rounded-full bg-[rgba(251,243,230,0.06)] border border-[rgba(251,243,230,0.14)] flex items-center justify-center hover:bg-[rgba(251,243,230,0.15)] text-[#fbf3e6] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="font-display text-3xl text-[#f2c98a]">
                Table QR Standees
              </h1>
            </div>
            <p className="font-mono-custom text-xs text-[#fbf3e6]/60 mt-1 ml-12">
              Printable acrylic tent cards for {CAFE_DETAILS.name} with instant table deep-linking
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-mono-custom text-xs">
              <label className="text-[#fbf3e6]/60">Tables:</label>
              <select
                value={tableCount}
                onChange={(e) => setTableCount(Number(e.target.value))}
                className="border border-[rgba(251,243,230,0.2)] rounded-xl px-3 py-1.5 bg-black/50 text-[#f2c98a] font-bold"
              >
                {[2, 4, 6, 8, 10, 12, 16, 20].map((num) => (
                  <option key={num} value={num}>
                    {num} Tables
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => window.print()}
              className="bg-[#f2c98a] hover:bg-[#edd09f] text-[#1a0f08] px-5 py-2.5 rounded-full font-mono-custom text-xs font-black flex items-center gap-2 shadow-lg transition-all active:scale-95"
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
            className="bg-[#faf3e6] text-[#1a0f08] rounded-3xl p-6 shadow-2xl border-2 border-[#1a0f08]/20 flex flex-col items-center text-center relative overflow-hidden print:shadow-none print:border-black print:break-inside-avoid"
          >
            {/* Top Brand Pill */}
            <div className="w-full bg-[#140a05] text-[#f2c98a] py-2 px-4 rounded-full text-xs font-bold tracking-wider uppercase mb-4 flex items-center justify-center gap-1.5 shadow-sm">
              <Coffee className="w-3.5 h-3.5 text-[#f2c98a]" />
              <span className="font-display text-lg tracking-normal text-[#fbf3e6]">
                Ghoont Café
              </span>
            </div>

            {/* Table Number Badge */}
            <div className="font-mono-custom text-[11px] uppercase font-bold tracking-widest text-[#8a5530]">
              DINE-IN TABLE
            </div>
            <div className="text-5xl font-display text-[#140a05] my-1">
              #{card.tableNumber}
            </div>

            {/* QR Code Container */}
            <div className="p-3.5 bg-white rounded-2xl border-2 border-dashed border-[#8a5530]/40 my-3 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.qrUrl}
                alt={`QR for Table ${card.tableNumber}`}
                className="w-44 h-44 rounded-lg object-contain"
              />
            </div>

            {/* Action instructions */}
            <div className="space-y-1">
              <div className="font-bold text-sm text-[#140a05]">
                Scan to View Menu & Order
              </div>
              <p className="text-[11px] text-[#140a05]/70 leading-tight">
                No app required · Pay via Paytm / UPI · Served to your table
              </p>
            </div>

            {/* WiFi details */}
            <div className="mt-4 pt-3 border-t border-[#1a0f08]/15 w-full font-mono-custom text-[10px] text-[#140a05]/70 flex items-center justify-between">
              <span>WiFi: <strong>{CAFE_DETAILS.wifiName}</strong></span>
              <span>Pass: <strong>{CAFE_DETAILS.wifiPass}</strong></span>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
