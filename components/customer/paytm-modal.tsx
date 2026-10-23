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
      const upiUrl = `upi://pay?pa=roastbloom@paytm&pn=RoastAndBloomCafe&am=${totalAmount}&cu=INR&tn=Table${tableNumber}`
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
      // Short delay for visual checkmark before handing over
      setTimeout(() => {
        onPaymentSuccess(method)
      }, 1200)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-blue-100 dark:border-stone-800 animate-in zoom-in-95 duration-200">
        
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
            <span className="text-xs bg-[#00b9f5] text-[#002970] font-extrabold px-1.5 py-0.5 rounded">
              UPI
            </span>
          </div>
          <p className="text-[11px] text-blue-100">
            Table #{tableNumber} • 100% Secure Payment
          </p>
          <div className="mt-2 text-2xl font-black tracking-tight text-white">
            {formatINR(totalAmount)}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-extrabold text-lg text-stone-900 dark:text-stone-100">
                Payment Received!
              </h3>
              <p className="text-xs text-stone-500">
                Paid {formatINR(totalAmount)} via Paytm UPI
              </p>
              <div className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium">
                Sent to Barista Station • Table #{tableNumber}
              </div>
            </div>
          ) : isProcessing ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-12 h-12 text-[#002970] animate-spin mx-auto" />
              <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
                Connecting to Paytm Payment Gateway...
              </p>
              <p className="text-xs text-stone-400">Please do not press back or refresh</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Payment Method Switcher Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPaymentMode("upi")}
                  className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                    paymentMode === "upi"
                      ? "bg-white dark:bg-stone-900 text-[#002970] dark:text-blue-300 shadow-xs"
                      : "text-stone-500"
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
                      ? "bg-white dark:bg-stone-900 text-[#002970] dark:text-blue-300 shadow-xs"
                      : "text-stone-500"
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
                      ? "bg-white dark:bg-stone-900 text-[#002970] dark:text-blue-300 shadow-xs"
                      : "text-stone-500"
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Counter</span>
                </button>
              </div>

              {/* Mode 1: UPI QR Scan */}
              {paymentMode === "upi" && (
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 bg-white rounded-2xl border-2 border-dashed border-[#002970]/30 shadow-xs">
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

                  <p className="text-[11px] text-stone-500">
                    Scan with <span className="font-semibold text-stone-700">Paytm</span>, Google Pay, PhonePe, or Cred
                  </p>

                  <button
                    onClick={() => handleSimulatePayment("PAYTM_UPI")}
                    className="w-full bg-[#002970] hover:bg-[#001f54] text-white py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-98"
                  >
                    Simulate Successful Paytm UPI Payment
                  </button>
                </div>
              )}

              {/* Mode 2: UPI Apps Direct */}
              {paymentMode === "apps" && (
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => handleSimulatePayment("PAYTM_UPI")}
                    className="w-full p-2.5 rounded-xl border border-blue-200 dark:border-stone-700 bg-blue-50/50 dark:bg-stone-800/60 hover:bg-blue-50 text-left flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#002970] text-white font-black text-xs flex items-center justify-center">
                        paytm
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                          Paytm UPI
                        </div>
                        <div className="text-[10px] text-stone-500">Fast 1-tap approval</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#002970] dark:text-blue-300">Pay</span>
                  </button>

                  <button
                    onClick={() => handleSimulatePayment("PAYTM_UPI")}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/60 text-left flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                        पे
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                          PhonePe
                        </div>
                        <div className="text-[10px] text-stone-500">UPI ID / QR</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-indigo-600">Pay</span>
                  </button>

                  <button
                    onClick={() => handleSimulatePayment("PAYTM_UPI")}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/60 text-left flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                        G
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                          Google Pay
                        </div>
                        <div className="text-[10px] text-stone-500">Instant UPI transfer</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">Pay</span>
                  </button>
                </div>
              )}

              {/* Mode 3: Pay at Counter */}
              {paymentMode === "counter" && (
                <div className="py-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 mx-auto flex items-center justify-center">
                    <Banknote className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      Pay Cash / Card at Counter
                    </h4>
                    <p className="text-xs text-stone-500 mt-1 max-w-[260px] mx-auto">
                      Place your order now; our captain will collect payment at Table #{tableNumber} or you can pay when picking up.
                    </p>
                  </div>
                  <button
                    onClick={() => handleSimulatePayment("COUNTER")}
                    className="w-full bg-amber-700 hover:bg-amber-800 text-white py-2.5 rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    Confirm Order & Pay at Counter
                  </button>
                </div>
              )}

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-1.5 pt-2 text-[10px] text-stone-400 border-t border-stone-100 dark:border-stone-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>NPCI Approved • 256-bit Bank Grade Encryption</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
