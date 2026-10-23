export interface CustomizationOption {
  id: string
  name: string
  price: number
}

export interface CustomizationGroup {
  id: string
  name: string
  required: boolean
  options: CustomizationOption[]
  defaultOptionId?: string
}

export interface MenuItem {
  id: string
  name: string
  category: "Coffee" | "Chai" | "Cold" | "Bites" | string
  price: number
  description: string
  image: string
  isVeg: boolean
  bestseller?: boolean
  tags?: string[]
  calories?: string
  prepTime?: string
  customizations?: CustomizationGroup[]
}

export const CATEGORIES = [
  { id: "All", name: "All Items" },
  { id: "Coffee", name: "Coffee" },
  { id: "Chai", name: "Chai" },
  { id: "Cold", name: "Cold" },
  { id: "Bites", name: "Bites" },
] as const

export const CAFE_DETAILS = {
  name: "Ghoont Café",
  tagline: "Slow Sips · Loud Flavour · Brewed Slow One Ghoont at a Time",
  gstin: "29AABCG1234F1Z8",
  fssai: "10020011000452",
  address: "14 Courtyard Lane, Sector 7 Market",
  supportPhone: "+91 98100 00000",
  email: "hello@ghoont.cafe",
  wifiName: "Ghoont_Guest",
  wifiPass: "slowsips2026",
}

export const FLAVOR_THEMES = {
  kaapi: {
    name: "Filter Kaapi",
    meta: "₹140 · 180 ml · decoction + frothed milk",
    price: 140,
    vars: {
      "--bg-inner": "#8a5530",
      "--bg-mid": "#3b2213",
      "--bg-outer": "#140a05",
      "--accent": "#f2c98a",
      "--liquid": "#6b3d1f",
      "--foam": "#e2c08f",
    },
  },
  chai: {
    name: "Masala Chai",
    meta: "₹90 · 150 ml · ginger, elaichi, laung",
    price: 90,
    vars: {
      "--bg-inner": "#b5621f",
      "--bg-mid": "#55250a",
      "--bg-outer": "#190a03",
      "--accent": "#ffc27a",
      "--liquid": "#b8723a",
      "--foam": "#ecd3aa",
    },
  },
  matcha: {
    name: "Iced Matcha",
    meta: "₹220 · 300 ml · ceremonial grade, oat milk",
    price: 220,
    vars: {
      "--bg-inner": "#4e8a3e",
      "--bg-mid": "#1b3a19",
      "--bg-outer": "#071107",
      "--accent": "#d6eba8",
      "--liquid": "#7aa846",
      "--foam": "#dcebc0",
    },
  },
}

export const BUILDER_OPTS = {
  base: [
    { id: "kaapi", v: "Filter Kaapi", p: 140, l: "#6b3d1f", f: "#e2c08f" },
    { id: "chai", v: "Masala Chai", p: 90, l: "#b8723a", f: "#ecd3aa" },
    { id: "matcha", v: "Matcha", p: 220, l: "#7aa846", f: "#dcebc0" },
    { id: "coldbrew", v: "Cold Brew", p: 190, l: "#3a1f10", f: "#7a5233" },
  ],
  milk: [
    { id: "full", v: "Full cream", p: 0 },
    { id: "oat", v: "Oat Milk", p: 40 },
    { id: "almond", v: "Almond Milk", p: 50 },
    { id: "nomilk", v: "No milk", p: 0 },
  ],
  vessel: [
    { id: "glass", v: "Cutting Glass", p: 0 },
    { id: "kulhad", v: "Clay Kulhad", p: 10 },
    { id: "davara", v: "Steel Davara", p: 0 },
    { id: "togo", v: "To-go cup", p: 15 },
  ],
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "m1",
    name: "Filter Kaapi",
    category: "Coffee",
    price: 140,
    description: "Chicory-blend decoction, full-cream milk, pulled until frothy. Served in a steel davara set.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    bestseller: true,
    tags: ["Bestseller", "Hot"],
    prepTime: "3 mins",
  },
  {
    id: "m2",
    name: "Jaggery Cold Brew",
    category: "Coffee",
    price: 190,
    description: "Steeped 18 hours, finished with gud syrup and a pinch of sea salt.",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    tags: ["Iced", "Slow Steeped"],
    prepTime: "2 mins",
  },
  {
    id: "m3",
    name: "Mysore Cappuccino",
    category: "Coffee",
    price: 170,
    description: "Double shot from Chikmagalur estate beans, velvety microfoam.",
    image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    tags: ["Estate Beans"],
    prepTime: "4 mins",
  },
  {
    id: "m4",
    name: "Tender Coconut Latte",
    category: "Coffee",
    price: 230,
    description: "Espresso over coconut water ice and oat milk. Light and nutty.",
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    tags: ["New", "Plant Based"],
    prepTime: "4 mins",
  },
  {
    id: "m5",
    name: "Masala Chai",
    category: "Chai",
    price: 90,
    description: "Assam CTC boiled with fresh ginger, elaichi, laung and black pepper.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    bestseller: true,
    tags: ["Bestseller", "Boiled Fresh"],
    prepTime: "4 mins",
  },
  {
    id: "m6",
    name: "Kulhad Chai",
    category: "Chai",
    price: 60,
    description: "Our masala chai, poured into a fresh terracotta clay kulhad. Best between 4 and 6.",
    image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    tags: ["Kulhad Hour"],
    prepTime: "3 mins",
  },
  {
    id: "m7",
    name: "Kashmiri Kahwa",
    category: "Chai",
    price: 150,
    description: "Green tea, saffron, cinnamon and crushed almonds. Light, golden and fragrant.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    tags: ["Saffron", "No Milk"],
    prepTime: "3 mins",
  },
  {
    id: "m8",
    name: "Gur Adrak Chai",
    category: "Chai",
    price: 110,
    description: "Organic jaggery instead of white sugar, double crushed ginger. Rich and warming.",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    tags: ["Seasonal", "Immunity"],
    prepTime: "4 mins",
  },
  {
    id: "m9",
    name: "Iced Matcha",
    category: "Cold",
    price: 220,
    description: "Ceremonial-grade Japanese matcha whisked smooth over oat milk and clear crystal ice.",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    bestseller: true,
    tags: ["Bestseller", "Ceremonial"],
    prepTime: "3 mins",
  },
  {
    id: "m10",
    name: "Kokum Soda",
    category: "Cold",
    price: 120,
    description: "Sour-sweet Konkan kokum fruit syrup, black salt, cumin and chilled sparkling water.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    tags: ["Iced", "Sparkling"],
    prepTime: "2 mins",
  },
  {
    id: "m11",
    name: "Rose Falooda Frappe",
    category: "Cold",
    price: 210,
    description: "Rose petal syrup, soaked sabja basil seeds, condensed milk and vanilla bean ice cream.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    tags: ["Thick Frappe"],
    prepTime: "4 mins",
  },
  {
    id: "m12",
    name: "Bun Maska",
    category: "Bites",
    price: 80,
    description: "Soft Irani bakery bun, salted Amul butter, lightly toasted with a dusting of sugar.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    bestseller: true,
    tags: ["Bestseller", "Irani Classic"],
    prepTime: "2 mins",
  },
  {
    id: "m13",
    name: "Paneer Tikka Sandwich",
    category: "Bites",
    price: 190,
    description: "Tandoori smoked paneer, spicy mint coriander chutney and pickled onions on grilled sourdough.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    tags: ["Warm Grilled"],
    prepTime: "7 mins",
  },
  {
    id: "m14",
    name: "Banana Walnut Cake",
    category: "Bites",
    price: 130,
    description: "Baked every morning with ripe bananas and toasted walnuts. One thick slice, served warm.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    tags: ["Fresh Baked"],
    prepTime: "2 mins",
  },
  {
    id: "m15",
    name: "Masala Fries",
    category: "Bites",
    price: 140,
    description: "Twice-fried crisp potato fries, tossed in Mumbai chaat masala and spicy peri-peri.",
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    tags: ["Spicy", "Crispy"],
    prepTime: "6 mins",
  },
]
