// Shared product catalog data — source of truth for seeding and image generation.

export interface CatalogCategory {
  slug: string;
  name: string;
  icon: string; // lucide-react icon name
  description: string;
}

export interface CatalogProduct {
  slug: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  categorySlug: string;
  stock: number;
  rating: number;
  reviewCount: number;
  image: string; // /products/<slug>.png
  features: string[];
  isFeatured?: boolean;
  isDeal?: boolean;
}

export const CATEGORIES: CatalogCategory[] = [
  { slug: "electronics", name: "Electronics", icon: "Smartphone", description: "Phones, cameras, speakers and the latest gadgets." },
  { slug: "computers", name: "Computers", icon: "Laptop", description: "Laptops, monitors, and accessories for work and play." },
  { slug: "home-kitchen", name: "Home & Kitchen", icon: "Home", description: "Appliances and essentials for a smarter home." },
  { slug: "audio", name: "Audio", icon: "Headphones", description: "Headphones, earbuds, and hi-fi audio gear." },
  { slug: "wearables", name: "Wearables", icon: "Watch", description: "Smartwatches and fitness trackers on your wrist." },
  { slug: "gaming", name: "Gaming", icon: "Gamepad2", description: "Consoles, controllers, and gear for gamers." },
];

export const PRODUCTS: CatalogProduct[] = [
  // ---------- Electronics ----------
  {
    slug: "aurora-noise-cancelling-headphones",
    name: "Aurora Wireless Noise-Cancelling Headphones",
    brand: "Aurora Audio",
    description:
      "Immerse yourself in pure sound with the Aurora wireless headphones. Adaptive active noise cancellation silences the world around you, while plush memory-foam ear cushions keep you comfortable for hours. With up to 40 hours of battery life and quick charging, your music never skips a beat.",
    price: 249.99,
    compareAtPrice: 329.99,
    categorySlug: "electronics",
    stock: 48,
    rating: 4.7,
    reviewCount: 1284,
    image: "/products/aurora-noise-cancelling-headphones.png",
    features: [
      "Adaptive active noise cancellation",
      "40-hour battery life, USB-C fast charge",
      "Bluetooth 5.3 with multipoint pairing",
      "Memory-foam protein leather ear cushions",
      "Foldable travel design with hard case",
    ],
    isFeatured: true,
    isDeal: true,
  },
  {
    slug: "pulse-smart-watch-series-7",
    name: "Pulse Smart Watch Series 7",
    brand: "Pulse",
    description:
      "Track every heartbeat and every move with the Pulse Smart Watch Series 7. A vivid always-on display, blood-oxygen and ECG sensors, and 7-day battery life make it the ultimate companion for an active lifestyle. Swim-proof to 50 meters.",
    price: 329.0,
    compareAtPrice: 379.0,
    categorySlug: "electronics",
    stock: 60,
    rating: 4.6,
    reviewCount: 942,
    image: "/products/pulse-smart-watch-series-7.png",
    features: [
      "Always-on AMOLED display",
      "ECG, blood-oxygen & heart-rate sensors",
      "7-day battery life",
      "50m water resistance",
      "Built-in GPS + 100+ sport modes",
    ],
    isFeatured: true,
  },
  {
    slug: "vortex-4k-action-camera",
    name: "Vortex 4K Action Camera",
    brand: "Vortex",
    description:
      "Capture your adventures in stunning 4K60 with the Vortex action camera. Electronic image stabilization keeps footage buttery smooth, and the rugged waterproof housing lets you dive to 40 meters without a separate case.",
    price: 199.99,
    categorySlug: "electronics",
    stock: 35,
    rating: 4.4,
    reviewCount: 511,
    image: "/products/vortex-4k-action-camera.png",
    features: [
      "4K60 video & 20MP photos",
      "HyperSmooth electronic stabilization",
      "Waterproof to 40m with included housing",
      "Dual-color touchscreen",
      "Voice control & Wi-Fi sharing",
    ],
  },
  {
    slug: "sonic-bluetooth-speaker",
    name: "Sonic Bluetooth Portable Speaker",
    brand: "Sonic",
    description:
      "Big sound in a small package. The Sonic portable speaker delivers 360° room-filling audio with deep bass, IPX7 waterproofing, and 24 hours of playtime. Pair two for true stereo.",
    price: 89.99,
    compareAtPrice: 109.99,
    categorySlug: "electronics",
    stock: 120,
    rating: 4.5,
    reviewCount: 2103,
    image: "/products/sonic-bluetooth-speaker.png",
    features: [
      "360° sound with passive bass radiator",
      "IPX7 waterproof",
      "24-hour playtime",
      "Bluetooth 5.3, range up to 30m",
      "Stereo pairing of two units",
    ],
    isDeal: true,
  },

  // ---------- Computers ----------
  {
    slug: "nimbus-ultrabook-14",
    name: 'Nimbus Ultrabook 14" Laptop',
    brand: "Nimbus",
    description:
      "Power meets portability. The Nimbus Ultrabook packs a 12-core processor, 16GB RAM, and a 1TB SSD into a featherlight aluminum chassis. The 14-inch 2.8K display is color-accurate and easy on the eyes with TÜV low-blue-light certification.",
    price: 1199.0,
    compareAtPrice: 1399.0,
    categorySlug: "computers",
    stock: 22,
    rating: 4.8,
    reviewCount: 376,
    image: "/products/nimbus-ultrabook-14.png",
    features: [
      '14" 2.8K 90Hz display',
      "12-core CPU, 16GB RAM, 1TB NVMe SSD",
      "All-day 18-hour battery",
      "Aluminum unibody, 1.2kg",
      "Thunderbolt 4, Wi-Fi 6E",
    ],
    isFeatured: true,
  },
  {
    slug: "glide-wireless-mouse",
    name: "Glide Wireless Mouse",
    brand: "Glide",
    description:
      "Silent clicks, ergonomic comfort, and a silent scroll wheel. The Glide mouse connects over Bluetooth or a 2.4GHz dongle and runs for up to 18 months on a single AA battery.",
    price: 49.99,
    categorySlug: "computers",
    stock: 240,
    rating: 4.5,
    reviewCount: 1872,
    image: "/products/glide-wireless-mouse.png",
    features: [
      "Dual connectivity: Bluetooth + 2.4GHz",
      "Silent clicks",
      "18-month battery life",
      "Ambidextrous ergonomic design",
      "Adjustable DPI up to 1600",
    ],
  },
  {
    slug: "vista-27-4k-monitor",
    name: 'Vista 27" 4K Monitor',
    brand: "Vista",
    description:
      "See every detail in crisp 4K UHD. The Vista 27 delivers 99% sRGB coverage, a flicker-free panel, and a height-adjustable stand. Perfect for creators, coders, and spreadsheet warriors alike.",
    price: 379.99,
    compareAtPrice: 449.99,
    categorySlug: "computers",
    stock: 30,
    rating: 4.6,
    reviewCount: 645,
    image: "/products/vista-27-4k-monitor.png",
    features: [
      '27" 4K UHD (3840 x 2160) IPS panel',
      "99% sRGB, factory calibrated",
      "Height, tilt & swivel adjustable stand",
      "USB-C 65W power delivery",
      "Flicker-free, low-blue-light",
    ],
    isDeal: true,
  },
  {
    slug: "linkpro-usb-c-hub",
    name: "LinkPro USB-C Hub 8-in-1",
    brand: "LinkPro",
    description:
      "Turn one USB-C port into everything you need. The LinkPro hub adds HDMI 4K output, gigabit Ethernet, three USB-A ports, SD/microSD readers, and 100W pass-through charging.",
    price: 59.99,
    categorySlug: "computers",
    stock: 180,
    rating: 4.4,
    reviewCount: 980,
    image: "/products/linkpro-usb-c-hub.png",
    features: [
      "4K HDMI output at 60Hz",
      "Gigabit Ethernet",
      "3x USB-A 3.0 + SD/microSD",
      "100W USB-C power delivery passthrough",
      "Aluminum heat-dissipating shell",
    ],
  },

  // ---------- Home & Kitchen ----------
  {
    slug: "brewmaster-espresso-machine",
    name: "BrewMaster Espresso Machine",
    brand: "BrewMaster",
    description:
      "Café-quality espresso at home. The BrewMaster features a 15-bar Italian pump, integrated conical burr grinder, and a steam wand for silky microfoam. A PID controller keeps the temperature dialed in shot after shot.",
    price: 449.0,
    compareAtPrice: 549.0,
    categorySlug: "home-kitchen",
    stock: 18,
    rating: 4.7,
    reviewCount: 421,
    image: "/products/brewmaster-espresso-machine.png",
    features: [
      "15-bar Italian pump",
      "Integrated conical burr grinder",
      "PID temperature control",
      "Professional steam wand",
      "Removable 2L water reservoir",
    ],
    isFeatured: true,
    isDeal: true,
  },
  {
    slug: "crispair-air-fryer",
    name: "CrispAir Air Fryer 5.5L",
    brand: "CrispAir",
    description:
      "Crispy, guilt-free cooking with rapid air technology. The 5.5L CrispAir fits a whole family meal and features 8 one-touch presets, a dishwasher-safe basket, and a peek-through window so you never overcook.",
    price: 129.99,
    compareAtPrice: 169.99,
    categorySlug: "home-kitchen",
    stock: 90,
    rating: 4.6,
    reviewCount: 3422,
    image: "/products/crispair-air-fryer.png",
    features: [
      "5.5L family-size basket",
      "8 one-touch presets",
      "Peek-through viewing window",
      "Dishwasher-safe non-stick parts",
      "Auto shut-off & overheat protection",
    ],
    isDeal: true,
  },
  {
    slug: "roombabot-robot-vacuum",
    name: "RoombaBot Robot Vacuum Cleaner",
    brand: "RoombaBot",
    description:
      "Let a robot do the cleaning. RoombaBot maps your home with LiDAR, avoids obstacles in real time, and empties itself into a sealed base for up to 60 days. Schedule cleanings from your phone anywhere.",
    price: 299.0,
    compareAtPrice: 379.0,
    categorySlug: "home-kitchen",
    stock: 40,
    rating: 4.5,
    reviewCount: 1156,
    image: "/products/roombabot-robot-vacuum.png",
    features: [
      "LiDAR navigation & room mapping",
      "Real-time obstacle avoidance",
      "Self-emptying base (60-day capacity)",
      "App & voice control",
      "Up to 180 min runtime per charge",
    ],
    isFeatured: true,
  },
  {
    slug: "chefpro-cookware-set",
    name: "ChefPro Cookware Set 10-Piece",
    brand: "ChefPro",
    description:
      "A complete kitchen upgrade. This 10-piece stainless steel set heats evenly, works on every cooktop including induction, and is oven-safe to 260°C. Tempered-glass lids let you watch the magic happen.",
    price: 179.99,
    compareAtPrice: 229.99,
    categorySlug: "home-kitchen",
    stock: 65,
    rating: 4.6,
    reviewCount: 738,
    image: "/products/chefpro-cookware-set.png",
    features: [
      "10 pieces: pots, pans & lids",
      "Tri-ply stainless steel, induction-ready",
      "Oven-safe to 260°C",
      "Tempered glass lids",
      "Riveted ergonomic handles",
    ],
  },

  // ---------- Audio ----------
  {
    slug: "echobuds-true-wireless-earbuds",
    name: "EchoBuds True Wireless Earbuds",
    brand: "EchoBuds",
    description:
      "Punchy bass, clear calls, and all-day comfort. EchoBuds feature adaptive ANC, a wireless charging case, and 32 hours total playback. IPX5 sweat resistance makes them perfect for workouts.",
    price: 129.0,
    compareAtPrice: 159.0,
    categorySlug: "audio",
    stock: 150,
    rating: 4.5,
    reviewCount: 2890,
    image: "/products/echobuds-true-wireless-earbuds.png",
    features: [
      "Adaptive active noise cancellation",
      "32h total with wireless charging case",
      "IPX5 sweat & water resistant",
      "Four-mic clear calling",
      "Customizable EQ in app",
    ],
    isDeal: true,
  },
  {
    slug: "retrospin-vinyl-record-player",
    name: "RetroSpin Vinyl Record Player",
    brand: "RetroSpin",
    description:
      "Warm analog sound meets modern convenience. The RetroSpin turntable plays 33, 45, and 78 RPM records, streams over Bluetooth, and includes built-in stereo speakers and a headphone jack.",
    price: 249.0,
    categorySlug: "audio",
    stock: 28,
    rating: 4.4,
    reviewCount: 412,
    image: "/products/retrospin-vinyl-record-player.png",
    features: [
      "3-speed: 33 / 45 / 78 RPM",
      "Bluetooth streaming in & out",
      "Built-in stereo speakers",
      "Replaceable AT-3600 cartridge",
      "Belt-drive with anti-skate",
    ],
  },
  {
    slug: "studioone-monitor-headphones",
    name: "StudioOne Monitor Headphones",
    brand: "StudioOne",
    description:
      "Reference-grade sound for mixing and mastering. StudioOne delivers a flat, detailed frequency response, plush velour pads, and a detachable cable. Built for long studio sessions.",
    price: 179.99,
    categorySlug: "audio",
    stock: 55,
    rating: 4.7,
    reviewCount: 356,
    image: "/products/studioone-monitor-headphones.png",
    features: [
      "Studio reference frequency response",
      "50mm dynamic drivers",
      "Velour ear pads, replaceable",
      "Detachable 3m coiled cable",
      "Foldable, includes 1/4\" adapter",
    ],
  },

  // ---------- Wearables ----------
  {
    slug: "fittrack-fitness-band",
    name: "FitTrack Fitness Band",
    brand: "FitTrack",
    description:
      "Your 24/7 wellness companion. FitTrack tracks heart rate, sleep, and 20+ workouts with a slim AMOLED display and 14-day battery life. Smart notifications keep you connected without your phone.",
    price: 79.99,
    compareAtPrice: 99.99,
    categorySlug: "wearables",
    stock: 200,
    rating: 4.4,
    reviewCount: 1620,
    image: "/products/fittrack-fitness-band.png",
    features: [
      "1.1\" AMOLED touchscreen",
      "24/7 heart-rate & SpO2",
      "Sleep & stress tracking",
      "20+ sport modes",
      "14-day battery, 5ATM water resistant",
    ],
    isDeal: true,
  },
  {
    slug: "halo-smart-ring",
    name: "Halo Smart Ring Health Monitor",
    brand: "Halo",
    description:
      "Health tracking, discreetly on your finger. The Halo smart ring measures sleep stages, HRV, and recovery with research-grade sensors, all wrapped in lightweight titanium. 7-day battery, wireless charging.",
    price: 199.0,
    compareAtPrice: 249.0,
    categorySlug: "wearables",
    stock: 75,
    rating: 4.3,
    reviewCount: 289,
    image: "/products/halo-smart-ring.png",
    features: [
      "Lightweight titanium body",
      "Sleep, HRV & recovery tracking",
      "7-day battery, wireless charging",
      "No subscription required",
      "Water resistant to 100m",
    ],
  },

  // ---------- Gaming ----------
  {
    slug: "strikepad-gaming-controller",
    name: "StrikePad Wireless Gaming Controller",
    brand: "StrikePad",
    description:
      "Tournament-grade control. The StrikePad features Hall-effect sticks with zero drift, mappable back paddles, and a 1000Hz wireless mode. Compatible with PC, console, and mobile.",
    price: 69.99,
    compareAtPrice: 89.99,
    categorySlug: "gaming",
    stock: 110,
    rating: 4.6,
    reviewCount: 1340,
    image: "/products/strikepad-gaming-controller.png",
    features: [
      "Hall-effect sticks, no drift",
      "4 mappable back paddles",
      "1000Hz polling wireless",
      "Hair-trigger locks",
      "40h battery, USB-C",
    ],
    isDeal: true,
  },
  {
    slug: "glowmat-rgb-gaming-mousepad",
    name: "GlowMat RGB Gaming Mouse Pad",
    brand: "GlowMat",
    description:
      "Light up your battlestation. The GlowMat is a large, stitched-edge desk pad with 16.8M-color edge lighting, a hard-gliding micro-woven surface, and a built-in USB passthrough.",
    price: 34.99,
    categorySlug: "gaming",
    stock: 260,
    rating: 4.3,
    reviewCount: 877,
    image: "/products/glowmat-rgb-gaming-mousepad.png",
    features: [
      "900 x 400mm large desk pad",
      "16.8M-color edge RGB lighting",
      "Micro-woven low-friction surface",
      "Stitched anti-fray edges",
      "Built-in USB 2.0 passthrough",
    ],
  },
  {
    slug: "visionmax-vr-headset",
    name: "VisionMax VR Headset",
    brand: "VisionMax",
    description:
      "Step into other worlds. VisionMax delivers 4K-per-eye Pancake optics, inside-out tracking, and a featherweight 480g design. Play standalone or link to your PC for AAA VR titles.",
    price: 399.0,
    compareAtPrice: 499.0,
    categorySlug: "gaming",
    stock: 25,
    rating: 4.5,
    reviewCount: 524,
    image: "/products/visionmax-vr-headset.png",
    features: [
      "4K-per-eye Pancake lenses",
      "Inside-out 6DoF tracking",
      "120Hz refresh rate",
      "Standalone + PC link",
      "Lightweight 480g design",
    ],
    isFeatured: true,
    isDeal: true,
  },

  // ---------- Extra electronics ----------
  {
    slug: "powercore-20000-power-bank",
    name: "PowerCore 20000mAh Power Bank",
    brand: "PowerCore",
    description:
      "Keep every device charged. The PowerCore 20000 packs 20,000mAh with 30W USB-C PD, enough to recharge a phone 4 times or a small laptop once. A tiny LED display shows the exact percentage left.",
    price: 44.99,
    compareAtPrice: 59.99,
    categorySlug: "electronics",
    stock: 300,
    rating: 4.6,
    reviewCount: 5210,
    image: "/products/powercore-20000-power-bank.png",
    features: [
      "20,000mAh capacity",
      "30W USB-C PD input & output",
      "LED digital battery display",
      "Charges phone ~4 times",
      "TSA-friendly for flights",
    ],
    isDeal: true,
  },
  {
    slug: "cloudkey-mechanical-keyboard",
    name: "CloudKey Mechanical Keyboard",
    brand: "CloudKey",
    description:
      "Type on a cloud. The CloudKey is a 75% mechanical keyboard with hot-swappable switches, PBT keycaps, and per-key RGB. A gasket mount gives it a soft, thocky feel loved by enthusiasts.",
    price: 119.0,
    compareAtPrice: 149.0,
    categorySlug: "computers",
    stock: 70,
    rating: 4.7,
    reviewCount: 612,
    image: "/products/cloudkey-mechanical-keyboard.png",
    features: [
      "75% layout, gasket-mounted",
      "Hot-swappable switches",
      "PBT double-shot keycaps",
      "Per-key RGB lighting",
      "Wireless tri-mode: BT / 2.4G / USB-C",
    ],
    isFeatured: true,
  },
];
