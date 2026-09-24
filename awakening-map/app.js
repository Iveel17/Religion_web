/**
 * ==============================================================================
 * Awakening & Dispersion - Core Application Logic (app.js)
 * Clean, modular Vanilla JavaScript for seamless mapping & storytelling
 * ==============================================================================
 */

// Application Global State
const state = {
  nodes: [],
  filteredNodes: [],
  currentReligion: 'all',
  activeNode: null,
  activeNodeIndex: 0,
  
  // Map Elements
  map: null,
  tileLayer: null,
  currentTileTheme: 'dark', // 'dark' | 'voyager' | 'osm'
  markersLayer: null,
  polylinesLayer: null,
  markersMap: new Map(),
  
  // Interactive Modes
  isTourRunning: false,
  tourIntervalId: null,
  isPickingCoords: false,
  
  // Audio & TTS
  isBgmPlaying: false,
  bgmAudio: new Audio(),
  bgmMode: 'auto', // 'auto' | 'buddhism' | 'christianity' | 'islam'
  bgmVolume: 0.7,
  activeBgmReligion: 'buddhism',
  isSpeaking: false,
  speechUtterance: null
};

// Tile Layer Configuration
const TILE_THEMES = {
  dark: {
    name: 'CartoDB Dark Matter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
  },
  voyager: {
    name: 'Antique Voyager Light',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
  },
  osm: {
    name: 'OpenStreetMap Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
  }
};

// ==============================================================================
// 1. Initialization
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initMap();
  bindUIEvents();
  initBgmSystem();
  renderTimelineEras();
  applyReligionFilter('all');
  
  // Select first node by default
  if (state.filteredNodes.length > 0) {
    selectNode(state.filteredNodes[0], false);
  }
});

/**
 * Load nodes from localStorage if previously edited, otherwise from data.js
 */
function loadData() {
  const savedData = localStorage.getItem('AWAKENING_MAP_DATA');
  if (savedData) {
    try {
      state.nodes = JSON.parse(savedData);
    } catch (e) {
      console.error('Failed to parse saved data, falling back to default', e);
      state.nodes = [...MAP_NODES];
    }
  } else {
    state.nodes = [...MAP_NODES];
  }
}

/**
 * Save current nodes state to localStorage and update JSON viewer
 */
function persistData() {
  localStorage.setItem('AWAKENING_MAP_DATA', JSON.stringify(state.nodes, null, 2));
  updateExportViewer();
  renderEditorTable();
}

// ==============================================================================
// 2. Leaflet Map Setup & Rendering
// ==============================================================================
function initMap() {
  // Center on ancient Afro-Eurasian cradle (Levant, Arabia, India)
  state.map = L.map('map', {
    center: [27.0, 58.0],
    zoom: 4,
    minZoom: 3,
    maxZoom: 16,
    zoomControl: false
  });

  // Add zoom control at bottom-right
  L.control.zoom({ position: 'bottomright' }).addTo(state.map);

  // Set default tile layer
  setMapTheme('dark');

  // Layers for markers and paths
  state.markersLayer = L.layerGroup().addTo(state.map);
  state.polylinesLayer = L.layerGroup().addTo(state.map);

  // Map Click Listener (for coordinate picker mode or general interactions)
  state.map.on('click', (e) => {
    if (state.isPickingCoords) {
      handlePickedCoordinates(e.latlng.lat, e.latlng.lng);
    }
  });
}

function setMapTheme(themeKey) {
  state.currentTileTheme = themeKey;
  const cfg = TILE_THEMES[themeKey];
  if (state.tileLayer) {
    state.map.removeLayer(state.tileLayer);
  }
  state.tileLayer = L.tileLayer(cfg.url, {
    attribution: cfg.attribution,
    maxZoom: 19
  }).addTo(state.map);
}

/**
 * Render Markers and Chronological Polylines for currently filtered nodes
 */
function renderMapFeatures() {
  state.markersLayer.clearLayers();
  state.polylinesLayer.clearLayers();
  state.markersMap.clear();

  // 1. Group nodes by religion for polylines
  const religionGroups = {
    buddhism: [],
    christianity: [],
    islam: []
  };

  state.filteredNodes.forEach((node) => {
    if (religionGroups[node.religion]) {
      religionGroups[node.religion].push(node);
    }

    // Create Custom HTML Pin Marker
    const religionCfg = RELIGIONS_CONFIG[node.religion] || {};
    const iconHtml = `
      <div class="custom-pin ${node.religion}" id="pin-${node.id}" title="${node.title}">
        <span>${node.step}</span>
      </div>
    `;

    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'custom-pin-container',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20]
    });

    const marker = L.marker([node.lat, node.lng], { icon: customIcon });

    // Interactive Leaflet Popup
    const popupContent = `
      <div class="map-popup-card">
        <span class="religion-pill" style="background:${religionCfg.color}; color:#fff; align-self:flex-start;">
          ${node.religionName || religionCfg.name} • STEP ${node.step}
        </span>
        <h4 class="popup-title">${node.title}</h4>
        <div class="popup-year">${node.location} (${node.year})</div>
        <p class="popup-summary">${node.summary}</p>
        <button class="btn-popup-open" onclick="window.appSelectNode('${node.id}')">View Details &amp; Audio</button>
      </div>
    `;

    marker.bindPopup(popupContent, { maxWidth: 300 });

    marker.on('click', () => {
      selectNode(node, true);
    });

    marker.addTo(state.markersLayer);
    state.markersMap.set(node.id, marker);
  });

  // 2. Draw color-coded dashed polylines for each religion
  Object.keys(religionGroups).forEach((relKey) => {
    const list = religionGroups[relKey];
    if (list.length < 2) return;

    // Sort chronologically by step
    const sorted = [...list].sort((a, b) => a.step - b.step);
    const latlngs = sorted.map(n => [n.lat, n.lng]);
    const relCfg = RELIGIONS_CONFIG[relKey];

    const polyline = L.polyline(latlngs, {
      color: relCfg.color,
      weight: 3.5,
      opacity: 0.8,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round'
    });

    polyline.addTo(state.polylinesLayer);
  });
}

// Global hook for popup action
window.appSelectNode = function(id) {
  const node = state.nodes.find(n => n.id === id);
  if (node) {
    selectNode(node, true);
    openDrawer();
  }
};

// ==============================================================================
// 3. Selection & Viewport Navigation
// ==============================================================================
function selectNode(node, panTo = true) {
  if (!node) return;
  state.activeNode = node;
  state.activeNodeIndex = state.filteredNodes.findIndex(n => n.id === node.id);

  // Update Highlight Pin
  document.querySelectorAll('.custom-pin').forEach(el => el.classList.remove('active'));
  const activePin = document.getElementById(`pin-${node.id}`);
  if (activePin) {
    activePin.classList.add('active');
  }

  // Smooth FlyTo Map Viewport
  if (panTo && state.map) {
    state.map.flyTo([node.lat, node.lng], Math.max(state.map.getZoom(), 7), {
      duration: 1.2,
      easeLinearity: 0.25
    });
  }

  // Update Quick Card UI
  updateQuickCard(node);

  // Update Bottom Timeline UI
  updateBottomTimeline(node);

  // Update Detail Drawer UI
  updateDrawerContent(node);

  // Sync BGM Soundscape to the active node's faith tradition (if in Auto mode)
  if (state.bgmMode === 'auto') {
    updateBgmTrack(node.religion, false);
  }

  // If Tour is running, trigger audio narration
  if (state.isTourRunning) {
    playNodeTTS(node);
  }
}

function updateQuickCard(node) {
  const relCfg = RELIGIONS_CONFIG[node.religion] || {};
  const badge = document.getElementById('quickReligionBadge');
  badge.textContent = node.religionName || relCfg.name;
  badge.style.background = relCfg.color;
  badge.style.color = (node.religion === 'buddhism') ? '#1e1b18' : '#ffffff';

  document.getElementById('quickStepCount').textContent = `Node ${node.step} of ${state.filteredNodes.length}`;
  document.getElementById('quickTitle').textContent = node.title;
  document.getElementById('quickMeta').innerHTML = `
    <span>📍 ${node.location}</span>
    <span>•</span>
    <span>${node.year}</span>
  `;
  document.getElementById('quickSummary').textContent = node.summary;
}

function updateBottomTimeline(node) {
  document.getElementById('currentMarkerName').textContent = `Stop ${node.step}: ${node.title} (${node.location})`;
  document.getElementById('currentMarkerYear').textContent = node.year;

  const slider = document.getElementById('timelineSlider');
  slider.max = Math.max(0, state.filteredNodes.length - 1);
  slider.value = state.activeNodeIndex >= 0 ? state.activeNodeIndex : 0;
}

function updateDrawerContent(node) {
  const relCfg = RELIGIONS_CONFIG[node.religion] || {};
  const badge = document.getElementById('drawerReligionBadge');
  badge.textContent = node.religionName || relCfg.name;
  badge.style.background = relCfg.color;
  badge.style.color = (node.religion === 'buddhism') ? '#1e1b18' : '#ffffff';

  document.getElementById('drawerStepTag').textContent = `STEP ${node.step} • ${node.leader}`;
  document.getElementById('drawerTitle').textContent = node.title;
  document.getElementById('drawerLocation').textContent = node.location;
  document.getElementById('drawerYear').textContent = node.year;
  document.getElementById('drawerCoords').textContent = `${node.lat.toFixed(4)}° N, ${node.lng.toFixed(4)}° E`;

  // External Google Maps navigation link
  const gmapLink = document.getElementById('drawerGmapLink');
  gmapLink.href = `https://www.google.com/maps/search/?api=1&query=${node.lat},${node.lng}`;

  // Image Frame
  const imgEl = document.getElementById('drawerImage');
  imgEl.src = node.imageUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80';
  imgEl.alt = node.title;

  // Text Breakdown
  document.getElementById('drawerSummary').textContent = node.summary;
  document.getElementById('drawerDesc').textContent = node.description || 'Detailed narrative in preparation.';
  document.getElementById('drawerSignificance').textContent = node.significance || 'Theological analysis in preparation.';

  // Sacred Quote Callout
  const quoteBox = document.getElementById('drawerQuoteBox');
  const quoteEl = document.getElementById('drawerQuote');
  if (node.quote) {
    quoteBox.style.display = 'block';
    quoteEl.textContent = `"${node.quote}"`;
  } else {
    quoteBox.style.display = 'none';
  }

  // Theme Soundscape info in drawer
  const soundTrackEl = document.getElementById('drawerSoundtrackName');
  if (soundTrackEl) {
    soundTrackEl.textContent = relCfg.bgmTitle;
  }

  // Reset TTS audio status
  stopTTS();
}

function openDrawer() {
  document.getElementById('detailDrawer').classList.add('open');
}

function closeDrawer() {
  document.getElementById('detailDrawer').classList.remove('open');
  stopTTS();
}

// ==============================================================================
// 4. Filtering & Timeline Synchronization
// ==============================================================================
function applyReligionFilter(religionKey) {
  state.currentReligion = religionKey;

  // Update tabs UI
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.religion === religionKey);
  });

  // Filter nodes
  if (religionKey === 'all') {
    state.filteredNodes = [...state.nodes].sort((a, b) => a.yearNumber - b.yearNumber);
  } else {
    state.filteredNodes = state.nodes
      .filter(n => n.religion === religionKey)
      .sort((a, b) => a.step - b.step);
  }

  renderMapFeatures();

  // Adjust map bounds to encompass visible nodes
  if (state.filteredNodes.length > 0) {
    const group = L.featureGroup(Array.from(state.markersMap.values()));
    state.map.fitBounds(group.getBounds().pad(0.2), { duration: 1 });
    selectNode(state.filteredNodes[0], false);
  }

  const traditionName = (religionKey === 'all') ? 'All Faith Traditions' : RELIGIONS_CONFIG[religionKey].name;
  showToast(`Displaying ${traditionName}`);
}

function navigateStep(direction) {
  if (state.filteredNodes.length === 0) return;
  let nextIdx = state.activeNodeIndex + direction;
  if (nextIdx < 0) nextIdx = state.filteredNodes.length - 1;
  if (nextIdx >= state.filteredNodes.length) nextIdx = 0;

  selectNode(state.filteredNodes[nextIdx], true);
}

function renderTimelineEras() {
  const eraChips = document.querySelectorAll('.era-chip');
  eraChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const stepTarget = parseInt(chip.dataset.step, 10);
      if (stepTarget >= 0 && stepTarget < state.filteredNodes.length) {
        selectNode(state.filteredNodes[stepTarget], true);
      }
    });
  });
}

// ==============================================================================
// 5. Documentary Tour Mode (Auto-play Walkthrough)
// ==============================================================================
function toggleTourMode() {
  if (state.isTourRunning) {
    stopTourMode();
  } else {
    startTourMode();
  }
}

function startTourMode() {
  if (state.filteredNodes.length === 0) return;
  state.isTourRunning = true;
  document.getElementById('btnTourToggle').classList.add('active');
  document.getElementById('btnPlayPauseTour').classList.add('active');
  document.getElementById('playTourIcon').textContent = '⏸';
  document.getElementById('playTourText').textContent = 'Pause Tour';
  showToast('🎬 Starting automated story tour (8.5s per location)');

  // Open drawer so the user can follow along
  openDrawer();

  // Step through automatically
  state.tourIntervalId = setInterval(() => {
    navigateStep(1);
  }, 8500);

  // Select current node
  selectNode(state.filteredNodes[state.activeNodeIndex], true);
}

function stopTourMode() {
  state.isTourRunning = false;
  if (state.tourIntervalId) {
    clearInterval(state.tourIntervalId);
    state.tourIntervalId = null;
  }
  document.getElementById('btnTourToggle').classList.remove('active');
  document.getElementById('btnPlayPauseTour').classList.remove('active');
  document.getElementById('playTourIcon').textContent = '▶';
  document.getElementById('playTourText').textContent = 'Auto Play Tour';
  stopTTS();
  showToast('Story tour paused');
}

// ==============================================================================
// 6. Web Speech API (English TTS) & Procedural Meditative BGM
// ==============================================================================
function playNodeTTS(node) {
  if (!('speechSynthesis' in window)) {
    showToast('Text-to-Speech is not supported in this browser.');
    return;
  }

  stopTTS();

  const scriptText = node.audioPrompt || `${node.year}, in ${node.location}, ${node.title}. ${node.summary} ${node.description}`;
  const utterance = new SpeechSynthesisUtterance(scriptText);
  utterance.lang = 'en-US';
  utterance.rate = 0.95; // Calm, respectful documentary cadence
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    state.isSpeaking = true;
    document.getElementById('btnTtsPlay').classList.add('speaking');
    document.getElementById('ttsBtnText').textContent = 'Narration Playing...';
    document.getElementById('audioStatusText').textContent = 'Playing';
    document.getElementById('btnAudioStop').style.display = 'inline-flex';
  };

  utterance.onend = () => {
    stopTTS();
  };

  utterance.onerror = () => {
    stopTTS();
  };

  state.speechUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

function stopTTS() {
  if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  state.isSpeaking = false;
  const playBtn = document.getElementById('btnTtsPlay');
  if (playBtn) playBtn.classList.remove('speaking');
  const txt = document.getElementById('ttsBtnText');
  if (txt) txt.textContent = 'Play Narration (TTS)';
  const stat = document.getElementById('audioStatusText');
  if (stat) stat.textContent = 'Ready';
  const stopBtn = document.getElementById('btnAudioStop');
  if (stopBtn) stopBtn.style.display = 'none';
}

/**
 * ==============================================================================
 * Authentic Sacred BGM Soundscape Engine
 * 1. Christianity: Gregorian chant, solemn choir, cathedral reverb, monophonic
 * 2. Islam: A cappella Nasheed, ambient ney flute, Arabic modal scales, desert breeze
 * 3. Buddhism: Tibetan singing bowl, deep meditative drone, bansuri flute, temple ambiance
 * ==============================================================================
 */
function initBgmSystem() {
  state.bgmAudio.loop = true;
  state.bgmAudio.volume = state.bgmVolume;

  // Initialize with Buddhism or current active faith
  updateBgmTrack(state.currentReligion === 'all' ? 'buddhism' : state.currentReligion, false);

  // Volume slider event
  const volSlider = document.getElementById('bgmVolumeSlider');
  if (volSlider) {
    volSlider.value = state.bgmVolume;
    volSlider.addEventListener('input', (e) => {
      setBgmVolume(parseFloat(e.target.value));
    });
  }

  // Track choice buttons
  document.querySelectorAll('.bgm-choice-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setBgmTrackMode(btn.dataset.track);
    });
  });

  // Close flyout on outside click
  document.addEventListener('click', (e) => {
    const widget = document.getElementById('bgmWidget');
    const flyout = document.getElementById('bgmFlyout');
    if (flyout && widget && !widget.contains(e.target)) {
      flyout.classList.remove('open');
    }
  });
}

function updateBgmTrack(religionKey, forcePlay = false) {
  const targetRel = (state.bgmMode === 'auto') ? (religionKey === 'all' ? 'buddhism' : (religionKey || 'buddhism')) : state.bgmMode;
  state.activeBgmReligion = targetRel;
  const cfg = RELIGIONS_CONFIG[targetRel] || RELIGIONS_CONFIG.buddhism;

  // Update flyout UI labels
  const badge = document.getElementById('bgmActiveTradition');
  if (badge) {
    badge.textContent = (state.bgmMode === 'auto') ? `Auto: ${cfg.name}` : cfg.name;
    badge.style.background = cfg.color;
    badge.style.color = (targetRel === 'buddhism') ? '#1e1b18' : '#ffffff';
  }

  const titleEl = document.getElementById('bgmTrackTitle');
  if (titleEl) titleEl.textContent = cfg.bgmTitle;

  const styleEl = document.getElementById('bgmTrackStyle');
  if (styleEl) styleEl.textContent = cfg.bgmStyle;

  // Track audio source update
  const currentSrc = state.bgmAudio.dataset.currentSrc;
  if (currentSrc !== cfg.bgmUrl) {
    state.bgmAudio.dataset.currentSrc = cfg.bgmUrl;
    state.bgmAudio.src = cfg.bgmUrl;
    state.bgmAudio.volume = state.bgmVolume;

    if (state.isBgmPlaying || forcePlay) {
      state.bgmAudio.play().then(() => {
        state.isBgmPlaying = true;
        updateBgmVisuals(true);
      }).catch(err => {
        console.log('Audio autoplay awaiting user gesture:', err);
      });
    }
  }
}

function toggleBgm(e) {
  // If user clicked the chevron, just open/toggle the flyout menu
  if (e && e.target && e.target.id === 'btnBgmChevron') {
    e.stopPropagation();
    const flyout = document.getElementById('bgmFlyout');
    if (flyout) flyout.classList.toggle('open');
    return;
  }

  if (state.isBgmPlaying) {
    pauseBgm();
  } else {
    playBgm();
  }
}

function playBgm() {
  const targetRel = (state.bgmMode === 'auto') ? 
    (state.activeNode ? state.activeNode.religion : (state.currentReligion === 'all' ? 'buddhism' : state.currentReligion)) : 
    state.bgmMode;
  
  const cfg = RELIGIONS_CONFIG[targetRel] || RELIGIONS_CONFIG.buddhism;
  
  if (!state.bgmAudio.src || !state.bgmAudio.src.includes(cfg.bgmUrl)) {
    state.bgmAudio.src = cfg.bgmUrl;
    state.bgmAudio.dataset.currentSrc = cfg.bgmUrl;
  }

  state.bgmAudio.volume = state.bgmVolume;
  state.bgmAudio.play().then(() => {
    state.isBgmPlaying = true;
    updateBgmVisuals(true);
    showToast(`🎵 Playing: ${cfg.bgmTitle}`);
  }).catch(err => {
    console.error('BGM play error:', err);
    showToast('Click anywhere on the page to allow audio playback');
  });
}

function pauseBgm() {
  state.bgmAudio.pause();
  state.isBgmPlaying = false;
  updateBgmVisuals(false);
  showToast('Ambient background music paused');
}

function setBgmVolume(val) {
  state.bgmVolume = Math.max(0, Math.min(1, val));
  state.bgmAudio.volume = state.bgmVolume;
  const volTxt = document.getElementById('bgmVolText');
  if (volTxt) volTxt.textContent = `${Math.round(state.bgmVolume * 100)}%`;
}

function setBgmTrackMode(mode) {
  state.bgmMode = mode;
  document.querySelectorAll('.bgm-choice-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.track === mode);
  });

  const relKey = (mode === 'auto') ? 
    (state.activeNode ? state.activeNode.religion : (state.currentReligion === 'all' ? 'buddhism' : state.currentReligion)) : 
    mode;

  updateBgmTrack(relKey, state.isBgmPlaying);
  const cfg = RELIGIONS_CONFIG[relKey] || RELIGIONS_CONFIG.buddhism;
  showToast(`Soundscape set to: ${cfg.bgmTitle}`);
}

function updateBgmVisuals(isPlaying) {
  const btn = document.getElementById('btnBgmToggle');
  const wave = document.getElementById('bgmWave');
  if (btn) btn.classList.toggle('active', isPlaying);
  if (wave) wave.style.display = isPlaying ? 'flex' : 'none';
}

// ==============================================================================
// 7. In-Browser Easy Data Editor Modal
// ==============================================================================
function openEditorModal() {
  document.getElementById('editorModalOverlay').classList.add('open');
  switchEditorTab('list');
  renderEditorTable();
  updateExportViewer();
}

function closeEditorModal() {
  document.getElementById('editorModalOverlay').classList.remove('open');
  if (state.isPickingCoords) {
    cancelCoordinatePicking();
  }
}

function switchEditorTab(tabKey) {
  document.querySelectorAll('.editor-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabKey);
  });

  document.getElementById('tabList').style.display = (tabKey === 'list') ? 'block' : 'none';
  document.getElementById('tabForm').style.display = (tabKey === 'form') ? 'block' : 'none';
  document.getElementById('tabExport').style.display = (tabKey === 'export') ? 'block' : 'none';

  if (tabKey === 'export') {
    updateExportViewer();
  }
}

function renderEditorTable() {
  const tbody = document.getElementById('editorTableBody');
  document.getElementById('editorNodeCount').textContent = state.nodes.length;
  tbody.innerHTML = '';

  state.nodes.forEach(node => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${node.step}</strong></td>
      <td><span class="religion-pill ${node.religion}">${node.religionName || node.religion}</span></td>
      <td><strong>${node.title}</strong></td>
      <td>${node.location}</td>
      <td>${node.year}</td>
      <td style="font-family:monospace; font-size:0.75rem;">${node.lat.toFixed(3)}, ${node.lng.toFixed(3)}</td>
      <td>
        <button class="table-action-btn" onclick="window.editNodeForm('${node.id}')">✏️ Edit</button>
        <button class="table-action-btn delete" onclick="window.deleteNode('${node.id}')">🗑️ Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.editNodeForm = function(nodeId) {
  const node = state.nodes.find(n => n.id === nodeId);
  if (!node) return;

  document.getElementById('formNodeId').value = node.id;
  document.getElementById('formReligion').value = node.religion;
  document.getElementById('formStep').value = node.step;
  document.getElementById('formTitle').value = node.title;
  document.getElementById('formLocation').value = node.location;
  document.getElementById('formYear').value = node.year;
  document.getElementById('formYearNumber').value = node.yearNumber;
  document.getElementById('formLat').value = node.lat;
  document.getElementById('formLng').value = node.lng;
  document.getElementById('formSummary').value = node.summary;
  document.getElementById('formDescription').value = node.description || '';
  document.getElementById('formSignificance').value = node.significance || '';
  document.getElementById('formQuote').value = node.quote || '';
  document.getElementById('formImageUrl').value = node.imageUrl || '';

  switchEditorTab('form');
};

window.deleteNode = function(nodeId) {
  if (confirm('Are you sure you want to delete this historical location?')) {
    state.nodes = state.nodes.filter(n => n.id !== nodeId);
    persistData();
    applyReligionFilter(state.currentReligion);
    showToast('Location deleted successfully');
  }
};

function handleFormSubmit(e) {
  e.preventDefault();

  const idVal = document.getElementById('formNodeId').value;
  const religionVal = document.getElementById('formReligion').value;
  const relName = RELIGIONS_CONFIG[religionVal].name;
  const leaderVal = RELIGIONS_CONFIG[religionVal].leader;

  const nodeData = {
    id: idVal || `${religionVal}-${Date.now()}`,
    religion: religionVal,
    religionName: relName,
    leader: leaderVal,
    step: parseInt(document.getElementById('formStep').value, 10),
    title: document.getElementById('formTitle').value.trim(),
    location: document.getElementById('formLocation').value.trim(),
    year: document.getElementById('formYear').value.trim(),
    yearNumber: parseInt(document.getElementById('formYearNumber').value, 10) || 0,
    lat: parseFloat(document.getElementById('formLat').value),
    lng: parseFloat(document.getElementById('formLng').value),
    summary: document.getElementById('formSummary').value.trim(),
    description: document.getElementById('formDescription').value.trim(),
    significance: document.getElementById('formSignificance').value.trim(),
    quote: document.getElementById('formQuote').value.trim(),
    imageUrl: document.getElementById('formImageUrl').value.trim()
  };

  const existingIdx = state.nodes.findIndex(n => n.id === nodeData.id);
  if (existingIdx >= 0) {
    state.nodes[existingIdx] = nodeData;
    showToast('Location updated successfully!');
  } else {
    state.nodes.push(nodeData);
    showToast('New location added successfully!');
  }

  persistData();
  applyReligionFilter(state.currentReligion);
  selectNode(nodeData, true);
  switchEditorTab('list');
}

// Coordinate Picker from Map
function startCoordinatePicking() {
  state.isPickingCoords = true;
  document.getElementById('editorModalOverlay').classList.remove('open');
  showToast('🎯 Click anywhere on the map to pick coordinates!');
}

function handlePickedCoordinates(lat, lng) {
  state.isPickingCoords = false;
  document.getElementById('formLat').value = lat.toFixed(4);
  document.getElementById('formLng').value = lng.toFixed(4);
  document.getElementById('editorModalOverlay').classList.add('open');
  switchEditorTab('form');
  showToast(`GPS Coordinates captured: (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
}

function cancelCoordinatePicking() {
  state.isPickingCoords = false;
}

// Export and Download
function updateExportViewer() {
  const viewer = document.getElementById('exportJsonViewer');
  if (viewer) {
    viewer.value = JSON.stringify(state.nodes, null, 2);
  }
}

function downloadDataJsFile() {
  const content = `/**
 * [Awakening & Dispersion] Custom Dataset (data.js)
 * Generated: ${new Date().toUTCString()}
 */

const RELIGIONS_CONFIG = ${JSON.stringify(RELIGIONS_CONFIG, null, 2)};

const MAP_NODES = ${JSON.stringify(state.nodes, null, 2)};
`;

  const blob = new Blob([content], { type: 'application/javascript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('📥 data.js downloaded! Overwrite data.js in your project folder.');
}

function copyJsonToClipboard() {
  const jsonStr = JSON.stringify(state.nodes, null, 2);
  navigator.clipboard.writeText(jsonStr).then(() => {
    showToast('📋 JSON copied to clipboard!');
  }).catch(() => {
    showToast('Failed to copy to clipboard');
  });
}

function resetDefaultData() {
  if (confirm('Reset all changes back to the original historical dataset?')) {
    localStorage.removeItem('AWAKENING_MAP_DATA');
    state.nodes = [...MAP_NODES];
    persistData();
    applyReligionFilter(state.currentReligion);
    showToast('🔄 Dataset restored to default');
  }
}

// ==============================================================================
// 8. Event Bindings & Global Listeners
// ==============================================================================
function bindUIEvents() {
  // Filter tabs
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyReligionFilter(btn.dataset.religion);
    });
  });

  // Action Tools
  document.getElementById('btnTourToggle').addEventListener('click', toggleTourMode);
  document.getElementById('btnPlayPauseTour').addEventListener('click', toggleTourMode);
  document.getElementById('btnBgmToggle').addEventListener('click', toggleBgm);

  // Map Tile Toggle
  document.getElementById('btnTileToggle').addEventListener('click', () => {
    const nextTheme = (state.currentTileTheme === 'dark') ? 'voyager' : (state.currentTileTheme === 'voyager' ? 'osm' : 'dark');
    setMapTheme(nextTheme);
    showToast(`Map Theme: ${TILE_THEMES[nextTheme].name}`);
  });

  // Editor Modal Open/Close
  document.getElementById('btnOpenEditor').addEventListener('click', openEditorModal);
  document.getElementById('btnCloseEditor').addEventListener('click', closeEditorModal);
  document.getElementById('btnModalDone').addEventListener('click', closeEditorModal);

  // Editor Tabs
  document.querySelectorAll('.editor-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchEditorTab(btn.dataset.tab));
  });

  // Editor Form & Actions
  document.getElementById('nodeEditForm').addEventListener('submit', handleFormSubmit);
  document.getElementById('btnCancelForm').addEventListener('click', () => switchEditorTab('list'));
  document.getElementById('btnPickOnMap').addEventListener('click', startCoordinatePicking);
  document.getElementById('btnDownloadDataJs').addEventListener('click', downloadDataJsFile);
  document.getElementById('btnCopyJson').addEventListener('click', copyJsonToClipboard);
  document.getElementById('btnResetDefaultData').addEventListener('click', resetDefaultData);

  // Quick Card Actions
  document.getElementById('btnQuickDetail').addEventListener('click', openDrawer);
  document.getElementById('btnQuickFly').addEventListener('click', () => {
    if (state.activeNode) {
      state.map.flyTo([state.activeNode.lat, state.activeNode.lng], 10, { duration: 1.2 });
    }
  });

  // Bottom Timeline Navigation
  document.getElementById('btnPrevNode').addEventListener('click', () => navigateStep(-1));
  document.getElementById('btnNextNode').addEventListener('click', () => navigateStep(1));

  // Slider change
  document.getElementById('timelineSlider').addEventListener('input', (e) => {
    const idx = parseInt(e.target.value, 10);
    if (idx >= 0 && idx < state.filteredNodes.length) {
      selectNode(state.filteredNodes[idx], true);
    }
  });

  // Drawer Controls
  document.getElementById('btnCloseDrawer').addEventListener('click', closeDrawer);
  document.getElementById('btnTtsPlay').addEventListener('click', () => {
    if (state.isSpeaking) {
      stopTTS();
    } else if (state.activeNode) {
      playNodeTTS(state.activeNode);
    }
  });
  document.getElementById('btnAudioStop').addEventListener('click', stopTTS);

  // Keyboard Navigation (Left / Right arrow, ESC)
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight') {
      navigateStep(1);
    } else if (e.key === 'ArrowLeft') {
      navigateStep(-1);
    } else if (e.key === 'Escape') {
      closeDrawer();
      closeEditorModal();
    }
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}
