# Chatwize — Gastcollege HBO (Web Presentatie)

Interactieve web-presentatie voor het gastcollege op Hogeschool Den Haag.
**Geen PowerPoint nodig** — opent in elke moderne browser.

## Openen

Dubbelklik op `index.html` → opent in je standaard browser. Klaar.

Voor nog betere weergave (en om elke browser-feature te laten werken):

```bash
# Python 3
cd presentatie-web
python -m http.server 8000
# → open http://localhost:8000 in je browser
```

## Navigatie

| Toets              | Actie                   |
|--------------------|-------------------------|
| `→` / `Space`      | Volgende slide          |
| `←`                | Vorige slide            |
| `Home`             | Eerste slide            |
| `End`              | Laatste slide           |
| `1`–`8`            | Spring direct naar dia  |
| *Klik op slide*    | Volgende slide          |
| *Swipe (mobiel)*   | Vorige / volgende       |

## Hosten op het web

De hele presentatie = statische HTML/CSS/JS = host het overal:

- **GitHub Pages** — push `presentatie-web/` naar een repo, enable Pages
- **Netlify** — drag-and-drop de map op netlify.com/drop
- **Vercel** — `vercel deploy` in deze map
- **Eigen server** — upload naar elke webhost

## Bestandsstructuur

```
presentatie-web/
├── index.html          # De 8 slides
├── css/
│   ├── style.css       # Design system + layouts
│   └── animations.css  # Alle animaties
├── js/
│   └── main.js         # Navigatie + animatie-triggers
└── assets/
    └── logo.png        # Chatwize logo
```

## Animaties per slide

1. **Cover** — Chat-bubbels verschijnen in volgorde, typing-dots pulseren
2. **Wie ben ik** — Avatar zoomt in, bullets slide-in met icons
3. **Wat is Chatwize** — Stap-kaarten + pulserende pijlen
4. **Hoe werkt** — Voorspellings-balken groeien · RAG-flow particles stromen
5. **Chatbot vs Agent** — Side-by-side fade-in
6. **Bronnen** — Bron-kaarten slide-in, wel/niet rules animeren
7. **Waarom bedrijven** — Cijfers tellen op van 0 naar target
8. **Demo** — Browser typt "chatwize.ai" letter-voor-letter
