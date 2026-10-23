"use client"

import React, { useState, useEffect } from "react"
import QRCode from "qrcode"
import { formatINR } from "@/lib/utils"
import { X, CheckCircle2, Loader2, ShieldCheck, Smartphone, QrCode, Banknote } from "lucide-react"

interface PaytmModalProps {
  isOpen: boolean
  totalAmount: number
  tableNumber: string
  onClose: () => void
  onPaymentSuccess: (method: "PAYTM_UPI" | "COUNTER") => void
}

export function PaytmModal({
  isOpen,
  totalAmount,
  tableNumber,
  onClose,
  onPaymentSuccess,
}: PaytmModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const [paymentMode, setPaymentMode] = useState<"upi" | "apps" | "counter">("upi")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Generate UPI QR code when total changes
  useEffect(() => {
    if (isOpen && totalAmount > 0) {
      const upiUrl = `upi://pay?pa=ghoontcafe@paytm&pn=GhoontCafe&am=${totalAmount}&cu=INR&tn=Table${tableNumber}`
      QRCode.toDataURL(upiUrl, {
        width: 240,
        margin: 2,
        color: {
          dark: "#002970",
          light: "#FFFFFF",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR Generation failed", err))
    }
  }, [isOpen, totalAmount, tableNumber])

  if (!isOpen) return null

  const handleSimulatePayment = (method: "PAYTM_UPI" | "COUNTER" = "PAYTM_UPI") => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      setTimeout(() => {
        onPaymentSuccess(method)
      }, 1200)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1e110a] text-[#fbf3e6] w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-[#f2c98a]/40 animate-in zoom-in-95 duration-200">
        
        {/* Paytm Header */}
        <div className="bg-[#002970] text-white p-4 relative text-center">
          <button
            onClick={onClose}
            disabled={isProcessing || isSuccess}
            className="absolute top-3 right-3 text-white/80 hover:text-white p-1 rounded-full bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="font-black text-xl tracking-tight text-white">paytm</span>
            <span className="text-xs bg-[#00b9f5] text-[#002970] font-black px-1.5 py-0.5 rounded">
              UPI
            </span>
          </div>
          <p className="text-[11px] text-blue-100 font-mono-custom">
            Table #{tableNumber} · 100% Encrypted Gateway
          </p>
          <div className="mt-2 text-2xl font-black font-mono-custom tracking-tight text-white">
            {formatINR(totalAmount)}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-display text-2xl text-[#f2c98a]">
                Payment Received!
              </h3>
              <p className="font-mono-custom text-xs text-[#fbf3e6]/70">
                Paid {formatINR(totalAmount)} via Paytm UPI
              </p>
              <div className="inline-flex items-center gap-1 text-[11px] font-mono-custom text-emerald-300 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
                Order sent to Barista Station · Table #{tableNumber}
              </div>
            </div>
          ) : isProcessing ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-12 h-12 text-[#f2c98a] animate-spin mx-auto" />
              <p className="font-display text-xl text-[#fbf3e6]">
                Authorizing Paytm Payment...
              </p>
              <p className="font-mono-custom text-xs text-[#fbf3e6]/50">
                Connecting to NPCI UPI network
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Payment Switcher */}
              <div className="grid grid-cols-3 gap-1 bg-black/50 p-1 rounded-xl text-xs font-mono-custom font-bold border border-[rgba(251,243,230,0.14)]">
                <button
                  type="button"
                  onClick={() => setPaymentMode("upi")}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                    paymentMode === "upi"
                      ? "bg-[#f2c98a] text-[#1a0f08] shadow"
                      : "text-[#fbf3e6]/60"
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>UPI QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode("apps")}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                    paymentMode === "apps"
                      ? "bg-[#f2c98a] text-[#1a0f08] shadow"
                      : "text-[#fbf3e6]/60"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>UPI Apps</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode("counter")}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                    paymentMode === "counter"
                      ? "bg-[#f2c98a] text-[#1a0f08] shadow"
                      : "text-[#fbf3e6]/60"
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Counter</span>
                </button>
              </div>

              {/* Mode 1: UPI QR Scan */}
              {paymentMode === "upi" && (
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 bg-white rounded-2xl border-2 border-dashed border-[#002970]/30 shadow-md">
                    {qrDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={qrDataUrl}
                        alt="Paytm UPI QR"
                        className="w-44 h-44 mx-auto rounded-lg"
                      />
                    ) : (
                      <div className="w-44 h-44 flex items-center justify-center text-xs text-stone-400">
                        Generating QR...
                      </div>
                    )}
                  </div>

                  <p className="font-mono-custom text-[11px] text-[#fbf3e6]/70">
                    Scan with <span className="font-bold text-[#f2c98a]">Paytm</span>, Google Pay, PhonePe, or Cred
                  </p>

                  <button
                    onClick={() => handleSimulatePayment("PAYTM_UPI")}
                    className="w-full bg-[#f2c98a] hover:bg-[#edd09f] text-[#1a0f08] py-2.5 rounded-xl font-mono-custom text-xs font-black shadow-md transition-all active:scale-98"
                  >
                    Simulate Paytm Payment Success
                  </button>
                </div>
              )}

              {/* Mode 2: UPI Apps Direct */}
              {paymentMode === "apps" && (
                <div className="space-y-2 pt-1 font-mono-custom">
                  <button
                    onClick={() => handleSimulatePayment("PAYTM_UPI")}
                    className="w-full p-2.5 rounded-xl border border-blue-500/40 bg-blue-950/40 hover:bg-blue-900/40 text-left flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#002970] text-white font-black text-xs flex items-center justify-center">
                        paytm
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          Paytm UPI
                        </div>
                        <div className="text-[10px] text-blue-300">Fast 1-tap approval</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#f2c98a]">Pay</span>
                  </button>

                  <button
                    onClick={() => handleSimulatePayment("PAYTM_UPI")}
                    className="w-full p-2.5 rounded-xl border border-[rgba(251,243,230,0.14)] bg-black/40 hover:bg-white/5 text-left flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                        पे
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          PhonePe
                        </div>
                        <div className="text-[10px] text-stone-400">UPI App</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-400">Pay</span>
                  </button>

                  <button
                    onClick={() => handleSimulatePayment("PAYTM_UPI")}
                    className="w-full p-2.5 rounded-xl border border-[rgba(251,243,230,0.14)] bg-black/40 hover:bg-white/5 text-left flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                        G
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          Google Pay
                        </div>
                        <div className="text-[10px] text-stone-400">Instant UPI transfer</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">Pay</span>
                  </button>
                </div>
              )}

              {/* Mode 3: Pay at Counter */}
              {paymentMode === "counter" && (
                <div className="py-4 text-center space-y-3 font-mono-custom">
                  <div className="w-12 h-12 rounded-full bg-[rgba(251,243,230,0.1)] text-[#f2c98a] mx-auto flex items-center justify-center">
                    <Banknote className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#fbf3e6]">
                      Pay Cash at Counter
                    </h4>
                    <p className="text-xs text-[#fbf3e6]/60 mt-1 max-w-[260px] mx-auto">
                      Place your order now; our captain will collect payment at Table #{tableNumber} or you can pay when picking up.
                    </p>
                  </div>
                  <button
                    onClick={() => handleSimulatePayment("COUNTER")}
                    className="w-full bg-[#f2c98a] hover:bg-[#edd09f] text-[#1a0f08] py-2.5 rounded-xl text-xs font-black shadow-md transition-all"
                  >
                    Confirm Order & Pay at Counter
                  </button>
                </div>
              )}

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-1.5 pt-2 text-[10px] font-mono-custom text-[#fbf3e6]/40 border-t border-[rgba(251,243,230,0.1)]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>NPCI Approved · 256-bit Bank Grade Encryption</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
