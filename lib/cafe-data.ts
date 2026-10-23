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
  category: "hot-coffee" | "cold-coffee" | "tea-chai" | "bites-bakery" | "desserts"
  price: number
  description: string
  image: string
  isVeg: boolean
  bestseller?: boolean
  calories?: string
  prepTime?: string
  customizations?: CustomizationGroup[]
}

export const CATEGORIES = [
  { id: "all", name: "All Items", icon: "Coffee" },
  { id: "hot-coffee", name: "Hot Brews", icon: "Flame" },
  { id: "cold-coffee", name: "Cold Brews & Frappes", icon: "CupSoda" },
  { id: "tea-chai", name: "Artisan Teas & Chai", icon: "Sparkles" },
  { id: "bites-bakery", name: "Bakery & Toasties", icon: "UtensilsCrossed" },
  { id: "desserts", name: "Desserts", icon: "CakeSlice" },
] as const

const MILK_OPTIONS: CustomizationGroup = {
  id: "milk",
  name: "Milk Preference",
  required: true,
  defaultOptionId: "regular",
  options: [
    { id: "regular", name: "Toned Dairy Milk", price: 0 },
    { id: "oat", name: "Oat Milk (Plant-based)", price: 45 },
    { id: "almond", name: "Almond Milk", price: 50 },
    { id: "skim", name: "Skimmed Milk", price: 0 },
  ],
}

const SWEETNESS_OPTIONS: CustomizationGroup = {
  id: "sweetness",
  name: "Sweetness Level",
  required: true,
  defaultOptionId: "regular",
  options: [
    { id: "regular", name: "Regular Sweet", price: 0 },
    { id: "less", name: "Less Sweet (50%)", price: 0 },
    { id: "sugar-free", name: "Stevia (Zero Sugar)", price: 15 },
    { id: "no-sugar", name: "No Added Sugar", price: 0 },
  ],
}

const SHOT_OPTIONS: CustomizationGroup = {
  id: "shots",
  name: "Espresso Strength",
  required: false,
  options: [
    { id: "extra-shot", name: "Add Extra Double Shot", price: 40 },
    { id: "decaf", name: "Decaf Blend", price: 25 },
  ],
}

export const CAFE_DETAILS = {
  name: "Roast & Bloom Artisanal Café",
  tagline: "Specialty Indian Estate Beans • Freshly Baked",
  gstin: "07AAACR1234F1Z8",
  fssai: "10020011000452",
  address: "Plot 42, Indiranagar 100ft Road, Bengaluru",
  supportPhone: "+91 98765 43210",
  wifiName: "RoastBloom_Guest",
  wifiPass: "coffeelove2026",
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "sea-salt-cold-brew",
    name: "Sea Salt Caramel Cold Brew",
    category: "cold-coffee",
    price: 245,
    description: "16-hour slow steeped Chikmagalur Arabica topped with handcrafted vanilla sea salt cold foam.",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    bestseller: true,
    calories: "160 kcal",
    prepTime: "3-5 mins",
    customizations: [MILK_OPTIONS, SWEETNESS_OPTIONS, SHOT_OPTIONS],
  },
  {
    id: "south-indian-filter",
    name: "Estate Filter Coffee (Brass Dabarah)",
    category: "hot-coffee",
    price: 135,
    description: "Authentic 80:20 Arabica & Chicory decoction frothed with thickened full-cream milk in traditional brassware.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    bestseller: true,
    calories: "110 kcal",
    prepTime: "2-4 mins",
    customizations: [SWEETNESS_OPTIONS],
  },
  {
    id: "hazelnut-frappe",
    name: "Crunchy Hazelnut Velvet Frappe",
    category: "cold-coffee",
    price: 265,
    description: "Espresso blended with roasted hazelnut spread, dairy, ice crystals, and chocolate wafer crispies.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    bestseller: true,
    calories: "320 kcal",
    prepTime: "5 mins",
    customizations: [MILK_OPTIONS, SWEETNESS_OPTIONS],
  },
  {
    id: "spanish-latte",
    name: "Artisan Spanish Cortado Latte",
    category: "hot-coffee",
    price: 220,
    description: "Bold double-shot espresso layered with silky textured milk and Spanish condensed milk sweetness.",
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    calories: "190 kcal",
    prepTime: "4 mins",
    customizations: [MILK_OPTIONS, SHOT_OPTIONS],
  },
  {
    id: "vietnamese-iced",
    name: "Vietnamese Shakerato Iced Coffee",
    category: "cold-coffee",
    price: 230,
    description: "Strong dark roast shaken over crystal ice with sweetened condensed milk. Intense and creamy.",
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    calories: "185 kcal",
    prepTime: "3 mins",
    customizations: [SWEETNESS_OPTIONS],
  },
  {
    id: "flat-white",
    name: "Silk Microfoam Flat White",
    category: "hot-coffee",
    price: 210,
    description: "Velvety steamed whole milk poured over a ristretto espresso extraction with delicate latte art.",
    image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    calories: "130 kcal",
    prepTime: "3 mins",
    customizations: [MILK_OPTIONS, SHOT_OPTIONS],
  },
  {
    id: "kulhad-masala-chai",
    name: "Ginger Elaichi Kulhad Chai",
    category: "tea-chai",
    price: 110,
    description: "Slow-simmered Assam whole leaf tea with freshly crushed ginger, green cardamom, and lemongrass served in clay cup.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    bestseller: true,
    calories: "95 kcal",
    prepTime: "4 mins",
    customizations: [SWEETNESS_OPTIONS],
  },
  {
    id: "hibiscus-mint-tea",
    name: "Sparkling Hibiscus Mint Cold Brew Tea",
    category: "tea-chai",
    price: 185,
    description: "Sun-dried Egyptian hibiscus flowers infused cold with fresh garden mint and a hint of Himalayan pink salt.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    calories: "65 kcal",
    prepTime: "2 mins",
    customizations: [SWEETNESS_OPTIONS],
  },
  {
    id: "matcha-latte",
    name: "Kyoto Ceremonial Iced Matcha",
    category: "tea-chai",
    price: 260,
    description: "First-harvest ceremonial grade Japanese green tea whisked smooth with oat milk and subtle agave.",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    calories: "140 kcal",
    prepTime: "4 mins",
    customizations: [MILK_OPTIONS, SWEETNESS_OPTIONS],
  },
  {
    id: "chilli-cheese-toast",
    name: "Mumbai Spiced Chilli Cheese Toasties",
    category: "bites-bakery",
    price: 195,
    description: "Artisan sourdough topped with sharp aged cheddar, mozzarella, bell peppers, green chillies, and oregano glaze.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    bestseller: true,
    calories: "280 kcal",
    prepTime: "8 mins",
  },
  {
    id: "butter-croissant",
    name: "French Flaky Butter Croissant",
    category: "bites-bakery",
    price: 165,
    description: "72-layer laminated European butter pastry, warm, crisp on the crust, honeycomb soft inside.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    calories: "240 kcal",
    prepTime: "3 mins",
  },
  {
    id: "paneer-focaccia",
    name: "Tandoori Paneer Rosemary Focaccia",
    category: "bites-bakery",
    price: 240,
    description: "Charcoal grilled malai paneer cubes, mint aioli, pickled onions in olive oil rosemary focaccia bread.",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    calories: "380 kcal",
    prepTime: "8 mins",
  },
  {
    id: "belgian-brownie",
    name: "Warm Belgian Fudge Brownie with Gelato",
    category: "desserts",
    price: 210,
    description: "Dense 70% dark Belgian cocoa brownie served sizzling warm with Madagascar vanilla bean scoop.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    isVeg: true,
    bestseller: true,
    calories: "340 kcal",
    prepTime: "4 mins",
  },
]
