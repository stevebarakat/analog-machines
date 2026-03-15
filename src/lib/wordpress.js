// Mock WordPress/WooCommerce Data Service

const products = [
  {
    id: 1,
    name: "The Monolith",
    slug: "the-monolith",
    price: 999,
    short_description: "A single-voice monophonic powerhouse with dual VCOs and a ladder filter.",
    description: "The Monolith is our flagship monophonic synthesizer. Built with discrete circuitry, it features two voltage-controlled oscillators (VCOs) that deliver rich, warm tones. The classic ladder filter provides that signature analog growl. Perfect for basslines and soaring leads.",
    images: [
      { src: "https://placehold.co/600x400/4E342E/F5F5DC?text=The+Monolith", alt: "The Monolith Synthesizer" }
    ],
    attributes: [
      { name: "Polyphony", options: ["Monophonic"] },
      { name: "Oscillators", options: ["2x VCO"] },
      { name: "Filter", options: ["24dB Ladder"] }
    ]
  },
  {
    id: 2,
    name: "Oscillator X",
    slug: "oscillator-x",
    price: 1499,
    short_description: "4-voice paraphonic synthesizer with advanced modulation capabilities.",
    description: "Oscillator X bridges the gap between classic analog sound and modern modulation. With 4-voice paraphony, you can play chords or stack oscillators for massive unison leads. The patch bay allows for semi-modular exploration.",
    images: [
      { src: "https://placehold.co/600x400/C5A059/1a1a1a?text=Oscillator+X", alt: "Oscillator X Synthesizer" }
    ],
    attributes: [
      { name: "Polyphony", options: ["4-Voice Paraphonic"] },
      { name: "Oscillators", options: ["4x DCO"] },
      { name: "Patch Points", options: ["16x16 Matrix"] }
    ]
  },
  {
    id: 3,
    name: "Vapor Wave",
    slug: "vapor-wave",
    price: 899,
    short_description: "Hybrid digital/analog synth focused on FM synthesis and lush pads.",
    description: "Vapor Wave brings the glassy textures of the 80s into the modern era. It combines an FM digital engine with an analog chorus and filter stage. The result is a dream machine for ambient pads and crystalline bells.",
    images: [
      { src: "https://placehold.co/600x400/F5F5DC/4E342E?text=Vapor+Wave", alt: "Vapor Wave Synthesizer" }
    ],
    attributes: [
      { name: "Polyphony", options: ["8-Voice Digital"] },
      { name: "Synthesis", options: ["FM + Analog Filter"] },
      { name: "Effects", options: ["Analog Chorus"] }
    ]
  }
];

const posts = [
  {
    id: 101,
    title: "Engineering Note: The Ladder Filter",
    slug: "engineering-ladder-filter",
    date: "2023-10-15",
    excerpt: "Why we chose the transistor ladder design for The Monolith.",
    content: "The transistor ladder filter is legendary for a reason. Its 24dB/octave slope creates a punchy, resonant sound that defines the 'analog' character. In this post, we dive into the circuit topology..."
  },
  {
    id: 102,
    title: "Sourcing Components for Longevity",
    slug: "sourcing-components",
    date: "2023-11-02",
    excerpt: "We use only the highest grade potentiometers and switches.",
    content: "A synthesizer is an instrument, not a toy. That's why every knob on our devices is a metal-shaft potentiometer bolted to the chassis. No wobbly plastic shafts here..."
  }
];

export async function getProducts() {
  return products;
}

export async function getProductBySlug(slug) {
  return products.find(p => p.slug === slug);
}

export async function getPosts() {
  return posts;
}
