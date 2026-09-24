# 🧭 Awakening & Dispersion
> **Interactive Map of the Three Great Spiritual Journeys: Gautama Buddha, Jesus Christ, and Prophet Muhammad**

---

## 🌟 Overview
**Awakening & Dispersion** is an interactive, multimedia cartographic web application visualizing the critical turning points and geographic journeys of the founders of the three world religions across ancient Afro-Eurasia (ancient India, Roman Judea/Levant, and the Arabian Peninsula):

* 🟡 **Buddhism (Gautama Buddha & Emperor Ashoka)**: 7 key nodes from Lumbini (Birth), Kapilavastu (Renunciation), Bodh Gaya (Enlightenment), Sarnath (First Turning of the Wheel of Dharma), Rajgir, Kushinagar (Mahaparinirvana), to Pataliputra (Global Buddhist missions).
* 🔴 **Christianity (Jesus Christ)**: 5 key nodes from Bethlehem (Nativity), Nazareth (Formative years), Jordan River (Baptism), Capernaum & Sea of Galilee (Sermon on the Mount), to Jerusalem (Passion, Crucifixion & Resurrection).
* 🟢 **Islam (Prophet Muhammad)**: 5 key nodes from Mecca (Birth & Al-Amin), Cave of Hira (First Revelation), Jerusalem (Isra & Mi'raj), Medina (The Hijra & First Ummah), to Mecca (Peaceful Return & Farewell Sermon).

---

## 🚀 How to Run (Zero Setup / Zero Build!)

### Option 1: Direct Double Click (Easiest)
Simply double-click [`index.html`](index.html) in Windows File Explorer to open it directly in Google Chrome, Microsoft Edge, or Firefox. No `npm install`, Node.js, or compilation required!

### Option 2: Run via Local Web Server (Recommended for Web Speech TTS)
To ensure all browser audio capabilities (SpeechSynthesis TTS) operate without local security restrictions, you can serve it with Python:
```bash
# In PowerShell / Command Prompt
python -m http.server 8000 --directory "C:\Users\hyun6\.gemini\antigravity\scratch\awakening-map"
```
Then navigate to `http://localhost:8000` in your web browser.

---

## ✏️ Super Easy to Edit & Customize (2 Methods)

### Method 1: In-Browser Interactive Editor (No Coding Required!)
1. Click the **`[✏️ Edit Data]`** button in the top-right navigation bar.
2. **Directory Tab**: View all 17 historical locations; click `Edit` or `Delete` on any row.
3. **Add / Edit Tab**:
   - Fill in the title, era, location, summary, and scripture quotation.
   - Click **`[Click map to auto-fill]`**—the map will open, and you can **simply click any place on the world map to automatically grab its exact GPS coordinates**!
4. **Export Tab**:
   - Click **`[📥 Download data.js File]`**.
   - Overwrite the existing `data.js` file in your project folder with the downloaded file. Changes are immediately permanent!

### Method 2: Direct File Editing in `data.js`
The file [`data.js`](data.js) is formatted in clean, human-readable JavaScript:
```javascript
{
  id: 'buddha-3',
  religion: 'buddhism',           // 'buddhism' | 'christianity' | 'islam'
  religionName: 'Buddhism',
  leader: 'Gautama Buddha',
  step: 3,
  title: 'Bodh Gaya: Supreme Enlightenment under the Bodhi Tree',
  location: 'Bodh Gaya, Bihar, India',
  year: 'c. 528 BCE (Age 35)',
  yearNumber: -528,               // Negative for BCE, positive for CE
  lat: 24.6959,                   // Latitude
  lng: 84.9913,                   // Longitude
  summary: '1-2 sentence core summary for popups & quick cards',
  description: 'Detailed historical narrative...',
  significance: 'Theological and philosophical meaning...',
  quote: 'Sacred scripture quotation...',
  imageUrl: 'https://...',
  audioPrompt: 'Script read aloud by the narrator...'
}
```

---

## 🎨 Key Features & Controls

1. **Top Faith Filter Buttons**:
   - `[🌐 All Faiths]` / `[🟡 Buddhism]` / `[🔴 Christianity]` / `[🟢 Islam]` instantly transitions the map camera and activates color-coded route lines.
2. **Bottom Timeline Slider & Keyboard Navigation**:
   - Drag through the centuries from 6th c. BCE to 7th c. CE.
   - Use the **`←` and `→` keyboard arrow keys** to step back and forth smoothly.
3. **🎬 Automated Story Tour (Tour Mode)**:
   - Click **`[🎬 Story Tour]`** or **`[▶ Auto Play Tour]`** to run a hands-free documentary walkthrough with automatic camera flight and narration.
4. **🎙️ Voice Narration (English TTS & Audio Fallback)**:
   - Click **`[🔊 Play Narration (TTS)]`** in the inspection drawer to hear the story spoken aloud in clear English.
5. **🎵 Authentic Sacred Soundscapes (BGM)**:
   - **Christianity**: *Gregorian chant, solemn choir, cathedral reverb, monophonic, sacred acoustic* (`audio/christianity_gregorian_choir.wav`)
   - **Islam**: *A cappella Nasheed, ambient ney flute, Arabic modal scales, soulful vocal drone, desert breeze* (`audio/islam_nasheed_ney_breeze.wav`)
   - **Buddhism**: *Tibetan singing bowl, deep meditative drone, bansuri flute, temple ambiance, Zen tranquil* (`audio/buddhism_zen_singing_bowl.wav`)
   - **Auto-Sync Mode**: Automatically transitions between these three authentic soundscapes as you explore each religion's route or run the Story Tour!
   - **Manual Soundscape Selector & Volume Slider**: Click the `[🎵 BGM ▾]` dropdown to choose a specific tradition or adjust volume.

6. **🗺️ 3 Basemap Themes**:
   - Switch between **CartoDB Dark Matter**, **Antique Voyager Light**, and **OpenStreetMap Standard**.

---

## 📂 Project Structure
```
awakening-map/
├── index.html        # Main semantic HTML structure & CDN bindings
├── style.css         # Modern glassmorphism UI, typography & responsive layouts
├── app.js            # Leaflet map engine, auto tour, BGM player, and data manager
├── data.js           # Comprehensive English dataset of the 17 historical nodes
├── audio/            # Dedicated sacred background music audio tracks (.wav)
│   ├── buddhism_zen_singing_bowl.wav
│   ├── christianity_gregorian_choir.wav
│   └── islam_nasheed_ney_breeze.wav
└── README.md         # Full project documentation & guide
```
