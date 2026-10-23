"use client"

import React, { useState } from "react"
import { CAFE_DETAILS } from "@/lib/cafe-data"

export function VisitSection() {
  const [name, setName] = useState("")
  const [guests, setGuests] = useState("2")
  const [slot, setSlot] = useState("Kulhad Hour · 5 pm")
  const [date, setDate] = useState("")
  const [msg, setMsg] = useState("")

  const hours = [
    ["Monday", "7:00 am – 10:00 pm"],
    ["Tuesday", "7:00 am – 10:00 pm"],
    ["Wednesday", "7:00 am – 10:00 pm"],
    ["Thursday", "7:00 am – 10:00 pm"],
    ["Friday", "7:00 am – 11:30 pm"],
    ["Saturday", "8:00 am – 11:30 pm"],
    ["Sunday", "8:00 am – 9:00 pm"],
  ]

  const todayIdx = (new Date().getDay() + 6) % 7 // Monday = 0

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setMsg("Please provide your name so our team knows who to seat.")
      return
    }
    setMsg(
      `Table for ${guests} held for ${name} (${slot}). In production this notifies the café manager!`
    )
  }

  return (
    <section id="visit" className="py-20 px-4 max-w-7xl mx-auto border-t border-[var(--line)]">
      <div className="space-y-3 mb-10">
        <span className="font-mono-custom text-xs uppercase tracking-widest text-[var(--accent)]">
          Visit
        </span>
        <h2 className="font-display text-5xl sm:text-6xl text-[var(--ink)] leading-[0.9]">
          Come for one,<br />
          stay for two.
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Hours Card */}
        <div className="ghoont-glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6">
          <table className="w-full text-xs sm:text-sm">
            <tbody>
              {hours.map(([d, h], i) => (
                <tr
                  key={d}
                  className={`border-b border-[var(--line)] ${
                    i === todayIdx ? "text-[var(--accent)] font-bold" : "text-[var(--muted)]"
                  }`}
                >
                  <td className="py-3">
                    {d}
                    {i === todayIdx && (
                      <span className="ml-2 font-mono-custom text-[10px] bg-[var(--accent)] text-[var(--on-accent)] px-1.5 py-0.5 rounded font-black uppercase">
                        Today
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right font-mono-custom">{h}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-4 border-t border-[var(--line)] space-y-1 text-xs text-[var(--muted)]">
            <strong className="text-[var(--ink)] font-bold text-sm block">
              {CAFE_DETAILS.name}
            </strong>
            <p>{CAFE_DETAILS.address}</p>
            <p className="font-mono-custom text-[var(--accent)]">
              {CAFE_DETAILS.supportPhone} · {CAFE_DETAILS.email}
            </p>
          </div>
        </div>

        {/* Right Reserve Table Form */}
        <div className="ghoont-glass rounded-3xl p-6 sm:p-8">
          <form onSubmit={handleBook} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-mono-custom uppercase tracking-wider text-[var(--faint)] block text-[11px]">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Aarav Mehta"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono-custom uppercase tracking-wider text-[var(--faint)] block text-[11px]">
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] text-xs"
              >
                <option value="1">1 Person</option>
                <option value="2">2 Persons</option>
                <option value="3">3 Persons</option>
                <option value="4">4 Persons</option>
                <option value="5-8">5 to 8 Persons</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono-custom uppercase tracking-wider text-[var(--faint)] block text-[11px]">
                Slot
              </label>
              <select
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] text-xs"
              >
                <option value="Morning · 8 am">Morning · 8 am</option>
                <option value="Brunch · 11 am">Brunch · 11 am</option>
                <option value="Kulhad Hour · 5 pm">Kulhad Hour · 5 pm</option>
                <option value="Evening · 7 pm">Evening · 7 pm</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-mono-custom uppercase tracking-wider text-[var(--faint)] block text-[11px]">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] text-xs"
              />
            </div>

            <button
              type="submit"
              className="sm:col-span-2 mt-2 w-full flex items-center justify-between bg-[var(--accent)] hover:bg-[#edd09f] text-[var(--on-accent)] py-3 px-6 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-98"
            >
              <span>Reserve a Table</span>
              <span>→</span>
            </button>

            {msg && (
              <div className="sm:col-span-2 p-3 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] font-semibold text-center">
                {msg}
              </div>
            )}
          </form>
        </div>

      </div>
    </section>
  )
}
