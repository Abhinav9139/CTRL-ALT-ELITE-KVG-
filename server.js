const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Offbeat destinations data
const destinations = [
  {
    name: "Valley of Flowers, India",
    experience: "nature",
    budget: 40,
    climate: "temperate",
    description:
      "A pristine national park famous for its vibrant alpine flowers and local community treks. Stay in eco-friendly guesthouses managed by villagers, supporting conservation efforts.",
    tags: ["Eco-friendly", "Community-led", "Nature"],
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60"
  },
  {
    name: "Svaneti, Georgia",
    experience: "culture",
    budget: 50,
    climate: "cold",
    description:
      "A remote mountainous region rich with medieval towers and vibrant local traditions. Experience home stays with a Svan family and enjoy authentic mountain cuisine.",
    tags: ["Local Culture", "Community-led", "Heritage"],
    image: "https://images.unsplash.com/photo-1549887535-a57d18f7eab9?auto=format&fit=crop&w=800&q=60"
  },
  {
    name: "San Juan Mountains, Colorado, USA",
    experience: "adventure",
    budget: 100,
    climate: "temperate",
    description:
      "Hidden mountain trails perfect for trekking, mountain biking, and rafting. Choose eco-lodges that partner with local guides to provide sustainable outdoor experiences.",
    tags: ["Adventure", "Eco-lodges", "Local Guides"],
    image: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=60"
  },
  {
    name: "El Nido, Palawan, Philippines",
    experience: "relaxation",
    budget: 80,
    climate: "tropical",
    description:
      "Secluded beaches and crystal-clear waters offering yoga retreats and community-led marine conservation activities. Stay at eco-resorts with zero plastic policies.",
    tags: ["Eco-resort", "Marine Conservation", "Relaxation"],
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=800&q=60"
  },
  {
    name: "Tsum Valley, Nepal",
    experience: "nature",
    budget: 60,
    climate: "cold",
    description:
      "A hidden Himalayan valley where you can learn about Buddhist culture and conservation efforts. Stay in community lodges run by locals promoting sustainable tourism.",
    tags: ["Nature", "Community Lodges", "Sustainable Tourism"],
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=60"
  },
  {
    name: "Wayanad, Kerala, India",
    experience: "culture",
    budget: 45,
    climate: "tropical",
    description:
      "Lush green landscapes with spice plantations and tribal villages. Enjoy homestays with local families and guided eco-tours that benefit the local economy.",
    tags: ["Culture", "Eco-tours", "Homestay"],
    image: "https://images.unsplash.com/photo-1528308640920-fd3ebcc3f1c7?auto=format&fit=crop&w=800&q=60"
  },
  {
    name: "Rotorua, New Zealand",
    experience: "relaxation",
    budget: 120,
    climate: "temperate",
    description:
      "Famous for geothermal hot springs, Maori culture, and eco-friendly spas. Experience community-led cultural workshops and bath in mineral-rich pools.",
    tags: ["Spa", "Maori Culture", "Eco-friendly"],
    image: "https://images.unsplash.com/photo-1506702315536-dd8b83e2dcf9?auto=format&fit=crop&w=800&q=60"
  },
  {
    name: "Azores, Portugal",
    experience: "adventure",
    budget: 110,
    climate: "temperate",
    description:
      "Remote Atlantic islands offering whale watching, hiking, and volcanic hot springs. Eco-lodges partner with locals to ensure sustainable exploration.",
    tags: ["Adventure", "Eco-lodges", "Whale Watching"],
    image: "https://images.unsplash.com/photo-1486308510493-cb66356f8777?auto=format&fit=crop&w=800&q=60"
  },
  {
    name: "Colchagua Valley, Chile",
    experience: "relaxation",
    budget: 90,
    climate: "temperate",
    description:
      "Winery region with boutique vineyards and eco-friendly tours. Visit family-run wineries and stay at countryside eco-estates promoting slow tourism.",
    tags: ["Wine", "Eco-tourism", "Community"],
    image: "https://images.unsplash.com/photo-1465156799767-5a5975e0e25e?auto=format&fit=crop&w=800&q=60"
  },
  {
    name: "Lombok, Indonesia",
    experience: "adventure",
    budget: 70,
    climate: "tropical",
    description:
      "Beaches and volcano treks with authentic Sasak village experiences. Eco-resorts support coral reef conservation and cultural preservation.",
    tags: ["Adventure", "Eco-resorts", "Culture"],
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60"
  }
];

// Serve main page (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // make sure the file is named correctly
});

// Serve results page
app.get('/results.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'results.html'));
});

// API endpoint
app.post('/api/destinations', (req, res) => {
  const { experience, budget, climate } = req.body;
  if (!experience || !budget || !climate) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const filtered = destinations.filter(dest =>
    dest.experience === experience &&
    dest.climate === climate &&
    dest.budget <= budget
  );

  res.json({ results: filtered });
});

// Slugify helper
function sanitizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Destination detail
app.get('/destination/:slug', (req, res) => {
  const destination = destinations.find(d => sanitizeName(d.name) === req.params.slug);
  if (!destination) {
    return res.status(404).send('<h1>Not Found</h1>');
  }

  const tagsHtml = destination.tags.map(tag =>
    `<span style="background:#71b280;color:#fff;padding:4px 10px;margin-right:6px;border-radius:12px;font-size:0.85rem;">${tag}</span>`
  ).join('');

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>${destination.name}</title>
      <style>
        body { font-family: Poppins, sans-serif; max-width: 600px; margin: auto; padding: 2rem; background: #f7fdfd; color: #333; }
        h1 { color: #134e5e; }
        .tags { margin-bottom: 1rem; }
        img { width: 100%; border-radius: 12px; margin-bottom: 1rem; }
        a { display: inline-block; margin-top: 1rem; color: #3498db; text-decoration: none; }
      </style>
    </head>
    <body>
      <a href="/results.html">&larr; Back to Results</a>
      <h1>${destination.name}</h1>
      <div class="tags">${tagsHtml}</div>
      ${destination.image ? `<img src="${destination.image}" alt="${destination.name}">` : ''}
      <p>${destination.description}</p>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Travel planner backend running on http://localhost:${PORT}`);
});
