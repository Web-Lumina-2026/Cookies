"use client"

import React, { useState, useEffect, useRef } from "react"
import { FLAVOR_THEMES } from "@/lib/cafe-data"
import Link from "next/link"
import { ChefHat, QrCode, MapPin, Sparkles, Star } from "lucide-react"

interface HeroSectionProps {
  tableNumber: string
  onTableChange: (newTable: string) => void
  onOpenOrder: () => void
  cartCount: number
}

export function HeroSection({
  tableNumber,
  onTableChange,
  onOpenOrder,
  cartCount,
}: HeroSectionProps) {
  const [currentFlavor, setCurrentFlavor] = useState<"kaapi" | "chai" | "matcha">("kaapi")
  const [showTableModal, setShowTableModal] = useState(false)
  const [tempTable, setTempTable] = useState(tableNumber)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  // Re-tint page theme when flavor changes
  useEffect(() => {
    const theme = FLAVOR_THEMES[currentFlavor]
    const root = document.documentElement
    Object.entries(theme.vars).forEach(([key, val]) => {
      root.style.setProperty(key, val)
    })
  }, [currentFlavor])

  // Mouse tilt effect on the hero cup
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const dx = (e.clientX - cx) / cx
      const dy = (e.clientY - cy) / cy
      setTilt({ x: dx * 18, y: -dy * 12 })
    }

    window.addEventListener("pointermove", handlePointerMove)
    return () => window.removeEventListener("pointermove", handlePointerMove)
  }, [])

  const flavor = FLAVOR_THEMES[currentFlavor]

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 py-3.5 px-4 bg-[var(--bg-outer)]/80 backdrop-blur-md border-b border-[var(--line)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="#top" className="flex items-center gap-2 text-white no-underline group">
            <svg
              className="w-7 h-7 text-[var(--accent)] group-hover:rotate-12 transition-transform duration-300"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M6 9h20l-2.5 18a2 2 0 0 1-2 1.8h-11a2 2 0 0 1-2-1.8Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M8 15h16" stroke="currentColor" strokeWidth="2" />
              <path
                d="M12 5c0-2 2-2 2-4M18 5c0-2 2-2 2-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-display text-2xl text-[var(--ink)] tracking-wide">
              Ghoont
            </span>
          </Link>

          {/* Navigation links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-[rgba(251,243,230,0.07)] border border-[rgba(251,243,230,0.18)] backdrop-blur-lg shadow-sm">
            <a
              href="#top"
              className="px-4 py-1.5 rounded-full text-xs font-bold text-[var(--accent)] bg-[rgba(0,0,0,0.4)]"
            >
              Home
            </a>
            <a
              href="#menu"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-[var(--muted)] hover:text-white transition-colors"
            >
              Menu
            </a>
            <a
              href="#build"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-[var(--muted)] hover:text-white transition-colors"
            >
              Build a Cup
            </a>
            <a
              href="#ritual"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-[var(--muted)] hover:text-white transition-colors"
            >
              Experience
            </a>
            <a
              href="#rewards"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-[var(--muted)] hover:text-white transition-colors"
            >
              Rewards
            </a>
            <a
              href="#visit"
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-[var(--muted)] hover:text-white transition-colors"
            >
              Visit
            </a>
          </nav>

          {/* Table selector & Order Button */}
          <div className="flex items-center gap-2">
            {/* Table Badge */}
            <button
              onClick={() => {
                setTempTable(tableNumber)
                setShowTableModal(true)
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(0,0,0,0.4)] border border-[var(--line)] hover:border-[var(--accent)] text-xs text-[var(--ink)] transition-colors shadow-xs"
              title="Click to change Table"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono-custom font-bold text-[var(--accent)]">
                Table {tableNumber}
              </span>
            </button>

            {/* Quick Staff Links */}
            <Link
              href="/kitchen"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[rgba(0,0,0,0.4)] border border-[var(--line)] hover:border-amber-400 text-xs font-semibold text-[var(--muted)] hover:text-white transition-colors"
              title="Open Barista Kitchen Display"
            >
              <ChefHat className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>KDS</span>
            </Link>

            <Link
              href="/admin/qr"
              className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[rgba(0,0,0,0.4)] border border-[var(--line)] hover:border-amber-400 text-xs font-semibold text-[var(--muted)] hover:text-white transition-colors"
              title="Print Table QRs"
            >
              <QrCode className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>QRs</span>
            </Link>

            {/* Your Order Drawer Trigger */}
            <button
              onClick={onOpenOrder}
              className="flex items-center gap-2.5 bg-[rgba(0,0,0,0.55)] hover:bg-[rgba(0,0,0,0.8)] border border-[var(--line)] rounded-full py-1.5 pl-3.5 pr-2 font-bold text-xs text-[var(--ink)] transition-all shadow-md active:scale-95"
            >
              <span>Your Order</span>
              <span className="w-6 h-6 rounded-full bg-[var(--accent)] text-[var(--on-accent)] font-mono-custom font-extrabold text-xs flex items-center justify-center shadow">
                {cartCount}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section
        id="top"
        ref={heroRef}
        className="relative overflow-hidden min-h-[100svh] flex flex-col justify-center pt-24 pb-16 px-4 transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 50%, var(--bg-inner) 0%, var(--bg-mid) 48%, var(--bg-outer) 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center min-h-[calc(100svh-120px)]">
          
          {/* Left Column: Big Typographic Headline */}
          <div className="flex flex-col justify-between gap-8 order-2 lg:order-1 text-center lg:text-left">
            <div className="space-y-4">
              <span className="font-mono-custom text-xs uppercase tracking-widest text-[var(--accent)] flex items-center justify-center lg:justify-start gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Slow Sips · One Ghoont at a Time
              </span>
              <h1 className="font-display text-6xl sm:text-7xl xl:text-8xl text-[var(--ink)] leading-[0.85] tracking-tight">
                Slow<br />
                <em className="italic not-italic text-[var(--accent)]">Sips</em>
              </h1>
              <p className="text-[var(--muted)] text-sm sm:text-base max-w-md mx-auto lg:mx-0 leading-relaxed font-sans">
                Filter kaapi dripped for twenty minutes. Chai boiled with whole spices.
                Matcha whisked to order. Order directly from Table {tableNumber} and pay via Paytm UPI.
              </p>
              
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <a
                  href="#menu"
                  className="inline-flex items-center gap-3 bg-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.85)] border border-[var(--line)] text-[var(--ink)] pl-5 pr-2 py-2 rounded-full font-bold text-sm transition-all shadow-lg active:scale-95 group"
                >
                  <span>Order Now</span>
                  <span className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--on-accent)] flex items-center justify-center font-bold text-lg group-hover:rotate-45 transition-transform">
                    +
                  </span>
                </a>
                <a
                  href="#build"
                  className="px-5 py-2.5 rounded-full border border-[var(--line)] hover:bg-[var(--glass-2)] text-xs font-bold text-[var(--ink)] transition-colors"
                >
                  Build Your Cup
                </a>
              </div>
            </div>

            {/* Brewing Credibility */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-4 border-t border-[var(--line)]">
              <div className="w-10 h-10 rounded-xl bg-[var(--glass)] border border-[var(--line)] flex items-center justify-center text-[var(--accent)]">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div className="text-left">
                <div className="font-mono-custom text-[10px] tracking-widest text-[var(--faint)] uppercase">
                  BREWING SINCE 2019
                </div>
                <div className="text-xs font-bold text-[var(--ink)]">
                  4.8 ★ · 2,300+ cups served each week
                </div>
              </div>
            </div>
          </div>

          {/* Center Column: The Cinematic Cutting-Chai Cup with Steam */}
          <div className="flex flex-col items-center justify-center relative order-1 lg:order-2 py-6">
            {/* Glow backdrop */}
            <div
              className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl pointer-events-none opacity-40 transition-colors duration-700"
              style={{ backgroundColor: "var(--accent)" }}
            />

            {/* Interactive Tiltable Cup */}
            <div
              className="animate-cup-bob transition-transform duration-200 ease-out"
              style={{
                transform: `perspective(900px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
              }}
            >
              <svg
                className="w-52 sm:w-64 xl:w-72 h-auto drop-shadow-[0_40px_40px_rgba(0,0,0,0.55)] overflow-visible"
                viewBox="0 0 240 340"
              >
                <defs>
                  <clipPath id="heroGlassClip">
                    <path d="M28 40h184l-19 270a12 12 0 0 1-12 11H59a12 12 0 0 1-12-11Z" />
                  </clipPath>
                  <linearGradient id="shineGrad" x1="0" x2="1">
                    <stop offset="0" stopColor="#fff" stopOpacity="0" />
                    <stop offset="0.18" stopColor="#fff" stopOpacity="0.35" />
                    <stop offset="0.3" stopColor="#fff" stopOpacity="0" />
                    <stop offset="0.78" stopColor="#fff" stopOpacity="0" />
                    <stop offset="0.88" stopColor="#fff" stopOpacity="0.18" />
                    <stop offset="1" stopColor="#fff" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="depthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#000" stopOpacity="0" />
                    <stop offset="1" stopColor="#000" stopOpacity="0.38" />
                  </linearGradient>
                </defs>

                {/* Steam animation paths */}
                <g className="text-white/40" transform="translate(0,-8)">
                  <path
                    className="steam-path-1"
                    d="M90 34c-10-14 10-20 0-36"
                    fill="none"
                    stroke="rgba(251,243,230,.32)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    className="steam-path-2"
                    d="M122 30c-12-16 12-22 0-40"
                    fill="none"
                    stroke="rgba(251,243,230,.32)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    className="steam-path-3"
                    d="M152 34c-10-14 10-20 0-36"
                    fill="none"
                    stroke="rgba(251,243,230,.32)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </g>

                {/* Glass interior */}
                <g clipPath="url(#heroGlassClip)">
                  <rect x="0" y="40" width="240" height="300" fill="rgba(255,255,255,.07)" />
                  {/* Liquid fill reacting to theme */}
                  <rect
                    x="0"
                    y="78"
                    width="240"
                    height="270"
                    style={{ fill: "var(--liquid)" }}
                    className="transition-colors duration-500"
                  />
                  <rect x="0" y="78" width="240" height="270" fill="url(#depthGrad)" />
                  {/* Foam top */}
                  <path
                    d="M0 74 Q30 64 60 74 T120 74 T180 74 T240 74 V100 H0Z"
                    style={{ fill: "var(--foam)" }}
                    className="transition-colors duration-500"
                  />
                  <g opacity="0.9">
                    <circle cx="70" cy="86" r="4" fill="#fff" opacity="0.35" />
                    <circle cx="150" cy="90" r="3" fill="#fff" opacity="0.3" />
                    <circle cx="118" cy="84" r="2.5" fill="#fff" opacity="0.4" />
                  </g>
                  {/* Cutting-chai vertical facets */}
                  <g stroke="rgba(255,255,255,.22)" strokeWidth="2">
                    <path d="M62 170L68 318M84 170L88 318M106 170L108 318M128 170L128 318M150 170L148 318M172 170L168 318M194 170L188 318" />
                  </g>
                  <rect x="0" y="40" width="240" height="300" fill="url(#shineGrad)" />
                </g>

                {/* Glass outer borders */}
                <path
                  d="M28 40h184l-19 270a12 12 0 0 1-12 11H59a12 12 0 0 1-12-11Z"
                  fill="none"
                  stroke="rgba(255,255,255,.6)"
                  strokeWidth="3"
                />
                <path
                  d="M28 40h184"
                  stroke="rgba(255,255,255,.85)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path d="M40 168h160" stroke="rgba(255,255,255,.35)" strokeWidth="2" />
              </svg>
            </div>

            {/* Cup label */}
            <div className="text-center mt-3">
              <div className="font-display text-3xl sm:text-4xl text-[var(--ink)]">
                {flavor.name}
              </div>
              <div className="font-mono-custom text-xs text-[var(--accent)] tracking-wider mt-0.5">
                {flavor.meta}
              </div>
            </div>
          </div>

          {/* Right Column: Brew Flavour Switcher & Big Headline */}
          <div className="flex flex-col justify-between items-center lg:items-end gap-8 order-3 text-center lg:text-right">
            
            {/* The 3 signature brew buttons */}
            <div className="flex flex-col items-center lg:items-end gap-3 w-full max-w-sm">
              <span className="font-mono-custom text-xs uppercase tracking-widest text-[var(--accent)]">
                Choose Signature Brew
              </span>
              <div className="flex gap-2.5 justify-center lg:justify-end">
                {[
                  { id: "kaapi", label: "Filter Kaapi", price: "₹140", color: "#6b3d1f" },
                  { id: "chai", label: "Masala Chai", price: "₹90", color: "#b8723a" },
                  { id: "matcha", label: "Iced Matcha", price: "₹220", color: "#7aa846" },
                ].map((item) => {
                  const isSelected = currentFlavor === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentFlavor(item.id as any)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 backdrop-blur-md active:scale-95 ${
                        isSelected
                          ? "bg-[rgba(251,243,230,0.14)] border-[var(--accent)] shadow-lg ring-1 ring-[var(--accent)]"
                          : "bg-[var(--glass)] border-[var(--line)] hover:border-white/30 text-[var(--muted)]"
                      }`}
                    >
                      <div
                        className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-xs font-bold shadow-inner"
                        style={{ backgroundColor: item.color }}
                      >
                        ☕
                      </div>
                      <span className="text-xs font-bold text-[var(--ink)] leading-tight">
                        {item.label}
                      </span>
                      <span className="font-mono-custom text-[11px] text-[var(--accent)]">
                        {item.price}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <h2 className="font-display text-5xl sm:text-6xl xl:text-7xl text-[var(--ink)] leading-[0.85] tracking-tight">
              Loud<br />
              <em className="italic not-italic text-[var(--accent)]">Flavour</em>
            </h2>
          </div>

        </div>
      </section>

      {/* Change Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e110a] border border-[var(--line)] rounded-3xl max-w-sm w-full p-6 text-[var(--ink)] shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[var(--glass-2)] text-[var(--accent)] flex items-center justify-center border border-[var(--line)]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-2xl text-[var(--ink)]">
                  Select Table
                </h3>
                <p className="text-xs text-[var(--muted)]">
                  Your brew will be brought to this table
                </p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-4">
              {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"].map(
                (t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTempTable(t)}
                    className={`py-2 rounded-xl text-xs font-mono-custom font-bold border transition-all ${
                      tempTable === t
                        ? "bg-[var(--accent)] text-[var(--on-accent)] border-[var(--accent)] shadow"
                        : "bg-[var(--glass)] border-[var(--line)] hover:border-[var(--accent)] text-[var(--ink)]"
                    }`}
                  >
                    {t}
                  </button>
                )
              )}
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[var(--muted)] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (tempTable) {
                    onTableChange(tempTable)
                    setShowTableModal(false)
                  }
                }}
                className="px-5 py-2 text-xs font-bold bg-[var(--accent)] text-[var(--on-accent)] rounded-full shadow"
              >
                Confirm Table {tempTable}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
