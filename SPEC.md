# SPEC.md - La Quercia Edizioni

## 1. Concept & Vision

Un sito catalogo editoriale che evoca la natura, la tradizione e la qualità artigianale italiana. L'esperienza deve essere calda e accogliente come una giornata in un bosco di querce, con un senso di scoperta intellettuale legato ai puzzle e ai libri enigmistici. Il design trasmette autenticità, competenza editoriale e passione per la cultura italiana.

## 2. Design Language

### Aesthetic Direction
Stile "Naturalista Contemporaneo" - ispirato alle illustrazioni botaniche antiche e ai cataloghi editoriali di qualità. Eleganza sobria con tocchi di calore terrestre.

### Color Palette
- **Primary (Verde Bosco)**: `#2D5A3D` - foreste di querce
- **Secondary (Marrone Terra)**: `#6B4423` - corteccia e terra
- **Accent (Oro Foglie)**: `#B8860B` - foglie autunnali
- **Background Primary (Crema Antica)**: `#F5F0E6` - carta invecchiata
- **Background Secondary (Crema Scuro)**: `#E8E0D0` - ombreggiato
- **Text Primary**: `#2C2416` - inchiostro scuro
- **Text Secondary**: `#5A4A3A` - inchiostro sbiadito
- **White**: `#FFFEF9` - bianco caldo

### Typography
- **Headings**: Playfair Display (serif elegante, evoke tradizione letteraria)
- **Body**: Lato (sans-serif leggibile, moderno ma caldo)
- **Accent/Numbers**: Playfair Display Italic per dettagli

### Spatial System
- Base unit: 8px
- Spacing scale: 8, 16, 24, 32, 48, 64, 96, 128px
- Max content width: 1200px
- Section padding: 64px vertical desktop, 48px mobile
- Card gap: 24px

### Motion Philosophy
- Transizioni morbide (300-400ms ease-out)
- Hover su cards: leggero lift (translateY -4px) + shadow deepen
- Page load: fade-in sequenziale (stagger 100ms)
- Scroll: parallax sottile sull'hero (0.3x speed)
- Nessuna animazione eccessiva - eleganza discreta

### Visual Assets
- Icone: Lucide Icons (line style, stroke 1.5px)
- Immagini: placeholder con gradiente verde/marrone
- Decorazioni: linee sottili, piccoli elementi botanici (foglie di quercia stilizzate in SVG)

## 3. Layout & Structure

### Homepage
1. **Hero Section** - Video/Immagine ambientale con titolo grande sovrapposto
2. **Categorie Grid** - 6 categorie principali con icone
3. **Ultimi Arrivi** - Carousel/Grid dei 6 prodotti più recenti
4. **CTA Newsletter** - Iscrizione alla newsletter
5. **Footer** - Links, social, info

### Catalog Page
- Header con breadcrumb
- Sidebar filtri (categoria, fascia prezzo, editore)
- Griglia prodotti (3 colonne desktop, 2 tablet, 1 mobile)
- Pagination

### Product Detail Page
- Immagine copertina grande
- Titolo, autore, prezzo
- Descrizione (placeholder)
- Bottone "Acquista su Amazon"
- Prodotti correlati

### Chi Siamo
- Storia dell'editore
- Missione
- Foto/Valori

### Contatti
- Form contatto
- Info dirette (email, social)

### Responsive Strategy
- Mobile-first CSS
- Breakpoints: 480px, 768px, 1024px, 1200px
- Navigation: hamburger menu sotto 768px
- Griglia: 1 → 2 → 3 colonne

## 4. Features & Interactions

### Navigation
- Fixed header con logo + menu
- Scroll: header shrink + background opacity increase
- Mobile: hamburger con slide-in menu

### Product Cards
- Hover: lift + shadow + overlay reveal "Scopri"
- Click: naviga a product page
- Badge "Nuovo" per prodotti < 30 giorni

### Catalog Filters
- Checkbox per categoria
- Range slider per prezzo
- Click: aggiorna griglia con fade transition
- Clear filters button

### Form Contatti
- Validazione inline
- Stati: default, focus, error, success
- Submit: messaggio conferma animato

### Empty States
- Catalogo vuoto: illustrazione + "Nessun prodotto trovato"
- Errore: messaggio gentile + retry button

## 5. Component Inventory

### Header
- Logo text "La Quercia Edizioni" (Playfair Display)
- Nav links: Home, Catalogo, Chi Siamo, Contatti
- States: default, scrolled (compact), mobile-open

### Product Card
- Aspect ratio 3:4 per copertina
- Titolo (2 linee max, truncate)
- Autore
- Prezzo (badge)
- States: default, hover, nuovo

### Category Card
- Icona SVG centrata
- Nome categoria
- Count prodotti
- States: default, hover

### Button Primary
- Background: Primary green
- Text: white
- Border-radius: 4px
- States: default, hover (darken 10%), active (darken 15%), disabled

### Button Secondary
- Border: 2px Primary
- Text: Primary
- Background: transparent
- States: default, hover (fill primary), active

### Input Field
- Border: 1px secondary
- Border-radius: 4px
- Padding: 12px 16px
- States: default, focus (primary border + shadow), error (red border), disabled

### Footer
- 4 colonne: Categorie, Info, Social, Newsletter
- Background: Primary dark (#1E3D2A)
- Text: crema

## 6. Technical Approach

### Stack
- Vanilla HTML5, CSS3, JavaScript ES6+
- No framework (lean & mean)
- CSS Custom Properties for theming
- ES6 modules for JS organization

### File Structure
```
/la-quercia-edizioni
├── index.html
├── catalogo.html
├── prodotto.html
├── chi-siamo.html
├── contatti.html
├── css/
│   ├── style.css (main styles)
│   ├── variables.css (CSS custom properties)
│   └── components.css (reusable components)
├── js/
│   ├── main.js (navigation, interactions)
│   ├── catalog.js (filter, grid)
│   └── data.js (product data)
└── imgs/
```

### Data Management
- Products stored in JS array (data.js)
- CSV parsed and converted to JSON structure
- LocalStorage for filter preferences (optional)

### Performance
- Lazy loading per immagini
- CSS critical inline
- Minimal external dependencies
- Font preloading

## 7. Product Categories

### Main Categories
1. **Parole Intrecciate** - Main puzzle books
2. **Diari di Viaggio** - Travel journals
3. **Musica** - Music notebooks
4. **Quaderni** - Notebooks
5. **Diari Salute** - Health journals
6. **SUDOKU** - Sudoku puzzles

### Sub-categories (Parole Intrecciate)
- Cultura Italiana (Storia, Divina Commedia, Iliade, Odissea, Miti)
- Geografia (Campania, Giappone)
- Scienze (Corpo Umano, Astronomia)
- Stagioni (Primavera, Estate, Autunno, Inverno)
- Anni ('90, '80, '70, '60)
- Speciali (Halloween, Mindfulness, Giardinaggio, Cucina, Bibbia, Kamasutra)
