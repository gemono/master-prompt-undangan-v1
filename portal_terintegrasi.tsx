import React, { useState, useEffect } from 'react';
import { 
  Lock, Shield, User, Key, LogOut, Users, Activity, 
  Database, AlertTriangle, CheckCircle, Settings, 
  Copy, Sparkles, Layout, Palette, ShieldAlert, CheckCircle2
} from 'lucide-react';

// =====================================================================
// 1. DATA LIBRARY & ENGINES (UNTUK MASTER PROMPT BUILDER)
// =====================================================================
const FOLD_LAYOUTS = {
  1: ["Centered Monogram", "Hero Portrait", "Arch Window", "Classic Frame", "Editorial Column", "Minimal White Space", "Floral Top & Bottom", "Golden Ratio", "Vertical Story", "Luxury Crest"],
  2: ["Cover + Details", "Split Story", "Editorial Spread", "Portrait + Information", "Timeline Spread", "Floral Garden", "Luxury Crest Spread", "Arch Window Spread", "Golden Ratio Spread", "Panoramic Scene"],
  3: ["Story Journey", "Timeline Accordion", "Cinematic Scene", "Panoramic Spread", "Gate Reveal", "Editorial Magazine", "Cultural Ceremony", "Photo Gallery", "Passport Travel", "Luxury Royal Experience"]
};
const COMPOSITIONS = ["Symmetrical", "Asymmetrical", "Editorial", "Golden Ratio", "Z Pattern", "Modular Grid"];
const TYPOGRAPHY_STYLES = ["Elegant Serif (Classic & Formal)", "Modern Sans-Serif (Clean & Minimal)", "Romantic Script (Handwritten & Flowing)", "Classic Calligraphy (Traditional)", "Vintage Display (Retro/Thematic)", "Playful & Quirky (Fun Theme)"];
const TEXTURE_MATERIALS = ["Matte Premium Paper (Smooth)", "Textured Watercolor Paper (Artistic)", "Glossy/UV Spot (Modern Shine)", "Vellum / Translucent Layer (Elegant)", "Velvet with Gold Foil (Luxury)", "Rustic Linen (Natural/Earthy)", "Pearlescent / Shimmer Paper (Glamour)"];
const CAMERA_LIGHTING = ["2D Flat Vector (No Shadows, Clean)", "Top-Down Flatlay (Natural Daylight)", "Macro Photography (Soft Bokeh/Depth of Field)", "3D Isometric (Studio Lighting)", "Cinematic Dramatic Lighting (Mood/Contrast)", "Bright & Airy (High Key Lighting)"];
const STYLE_CATEGORIES = ["Formal - Elegan", "Ilustratif - Dekoratif", "Minimalis Modern", "Tematik - Custom Concept", "Tradisional - Kultural"];
const STYLE_VARIANTS = {
  "Formal - Elegan": ["Arsitektur Monogram Kerajaan", "Sistem Undangan Serif Imperial", "Layout Editorial Mewah Klasik", "Desain Seremoni Beludru Emas", "Komposisi Bingkai Aristokrat", "Gaya Undangan Heritage Classic", "Konsep Border Berlian Formal", "Elegansi Minimal Prestise", "Layout Pernikahan Lambang Platinum", "Arsitektur Elegan Victoria", "Komposisi Dasi Hitam Mewah", "Desain Luxury Ivory Abadi", "Elegansi Emboss Signature", "Sistem Tipografi Regal Modern", "Layout Floral Opulen", "Gaya Undangan Gala Eksekutif", "Arsitektur White Space Premium", "Konsep Kerajaan Chateau Royale", "Desain Editorial Harmoni Emas", "Template Formal Sapphire Luxury"],
  "Ilustratif - Dekoratif": ["Undangan Floral Watercolor", "Layout Botani Gambar Tangan", "Gaya Ilustrasi Pastel Romantis", "Konsep Pernikahan Sketsa Vintage", "Desain Garden Party Whimsical", "Sistem Undangan Doodle Lembut", "Komposisi Floral Art Nouveau", "Layout Pernikahan Artistik Boho", "Gaya Seremoni Kartun Lucu", "Undangan Line Art Elegan", "Konsep Pernikahan Fairytale Fantasy", "Desain Bingkai Bunga Rustic", "Undangan Editorial Sapuan Cat", "Gaya Ilustrasi Kupu-Kupu Lembut", "Layout Artistik Tema Alam", "Konsep Floral Watercolor Dreamy", "Undangan Romansa Storybook", "Komposisi Dekoratif Pena Tinta", "Desain Bloom Luxury Artistik", "Gaya Perayaan Ilustratif Kreatif"],
  "Minimalis Modern": ["Undangan Clean Nordic", "Layout Editorial Putih Bersih", "Konsep Minimal Beige Lembut", "Gaya Pernikahan Sans Serif Modern", "Sistem Layout Grid Elegan", "Desain Luxury Garis Monoline", "Komposisi Scandinavian Calm", "Layout Pernikahan Tone Netral", "Konsep Bingkai Arch Minimal", "Tipografi Kontemporer Bersih", "Undangan Aksen Emas Minimalis", "Gaya Editorial Ivory Space", "Desain Seremoni Pastel Lembut", "Layout Zen Jepang Minimalis", "Komposisi White Space Modern", "Minimalis Botani Kontemporer", "Gaya Undangan Geometri Bersih", "Luxury Hitam Putih Minimal", "Undangan Editorial Bayangan Halus", "Romansa Minimalis Modern"],
  "Tematik - Custom Concept": ["Undangan Passport Vintage Travel", "Konsep Pernikahan Poster Film", "Gaya Party Retro 90an", "Konsep Fantasy Galaksi Luar Angkasa", "Layout Romansa Gothic Gelap", "Undangan Luxury Casino Royale", "Desain Tropical Beach Summer", "Konsep Seremoni Ala Hogwarts", "Undangan Kerajaan Fantasy", "Konsep Pernikahan Cyberpunk Neon", "Layout Editorial Cafe Paris", "Gaya Perayaan Rustic Campfire", "Undangan Estetik Old Money", "Layout Party Karnaval Festival", "Desain Pernikahan Anime Inspired", "Gaya Seremoni Futuristik Sci-Fi", "Konsep Winter Wonderland", "Undangan Tiket Konser Musik", "Editorial Party Yacht Mewah", "Layout Pernikahan Kastil Dongeng"],
  "Tradisional - Kultural": ["Undangan Batik Kerajaan Jawa", "Gaya Seremoni Heritage Bali", "Layout Etnik Floral Sunda", "Konsep Pernikahan Nusantara Klasik", "Desain Ornamen Islami Arabesque", "Bingkai Emas Tradisional Melayu", "Gaya Undangan Wayang Vintage", "Layout Pernikahan Minangkabau Mewah", "Konsep Elegan Budaya Bugis", "Sistem Heritage Toraja", "Undangan Royal Mughal India", "Desain Luxury Ottoman Islami", "Layout Pernikahan Oriental China", "Gaya Ornamen Istana Persia", "Konsep Tradisional Washi Jepang", "Desain Seremoni Hanbok Korea", "Undangan Motif Royal Thailand", "Gaya Pernikahan Mosaic Maroko", "Komposisi Tekstil Etnik Kuno", "Undangan Editorial Budaya Klasik"]
};

// =====================================================================
// 2. KOMPONEN: MASTER PROMPT BUILDER (MODUL INTERNAL)
// =====================================================================
function PromptBuilderModule() {
  const [activeTab, setActiveTab] = useState(1);
  const [activeLayout, setActiveLayout] = useState(FOLD_LAYOUTS[1][0]);
  const [pages, setPages] = useState([]);
  const [globalConfig, setGlobalConfig] = useState({
    topic: 'Pernikahan',
    composition: COMPOSITIONS[0],
    typographyStyle: TYPOGRAPHY_STYLES[0],
    material: TEXTURE_MATERIALS[0],
    cameraSetup: CAMERA_LIGHTING[0],
    styleCategory: STYLE_CATEGORIES[0],
    styleVariant: STYLE_VARIANTS[STYLE_CATEGORIES[0]][0],
    bgPrimary: '#ffffff',
    bgSecondary: '#f3f4f6',
    fontPrimary: '#111827',
    fontSecondary: '#4b5563',
    notes: '',
    dimWidth: 21,
    dimHeight: 29.7,
    dimUnit: 'cm',
    hasArabic: false,
    mandatoryPrompt: 'Professional Graphic Design, High Quality Print, Masterpiece, Exact Text Rendering, STRICTLY ANTI TYPO, Perfect Spelling',
    negativePrompt: 'CGI, 3D render, plastic, fake, bad text, typo, deformed, low resolution, blurry, watermark, bad anatomy, misspellings'
  });
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const newPages = Array.from({ length: activeTab }, (_, i) => ({
      id: i + 1,
      imgToImg: false,
      sections: { s1: '', s2: '', s3: '' }
    }));
    setPages(newPages);
    setActiveLayout(FOLD_LAYOUTS[activeTab][0]);
  }, [activeTab]);

  const handlePageChange = (pageIndex, field, value, sectionId = null) => {
    const updatedPages = [...pages];
    if (sectionId) updatedPages[pageIndex].sections[sectionId] = value;
    else updatedPages[pageIndex][field] = value;
    setPages(updatedPages);
  };

  const handleGlobalChange = (field, value) => {
    setGlobalConfig(prev => {
      const newConfig = { ...prev, [field]: value };
      if (field === 'styleCategory') newConfig.styleVariant = STYLE_VARIANTS[value][0];
      return newConfig;
    });
  };

  const totalWidthMm = globalConfig.dimUnit === 'cm' ? (globalConfig.dimWidth || 0) * 10 : (globalConfig.dimWidth || 0);
  const panelWidthMm = totalWidthMm / activeTab;
  const isImprecise = activeTab > 1 && (panelWidthMm % 1 !== 0);
  const panelWidthDisplay = globalConfig.dimUnit === 'cm' ? (panelWidthMm / 10) : panelWidthMm;

  const buildPrompt = () => {
    const foldName = activeTab === 1 ? 'SINGLE FOLD' : activeTab === 2 ? 'BI-FOLD' : 'TRI-FOLD';
    let prompt = `MASTER PROMPT INFOGRAFIS : DESAIN UNDANGAN ${globalConfig.topic ? globalConfig.topic.toUpperCase() : 'UMUM'} (${foldName})\n`;
    prompt += `DOMAIN TOPIC: Undangan ${globalConfig.topic || 'Umum'}\n`;
    prompt += `MANDATORY KEYWORDS: [${globalConfig.mandatoryPrompt}]\n`;
    prompt += `CAMERA & LIGHTING: ${globalConfig.cameraSetup}\n`;
    prompt += `ASPECT RATIO / DIMENSION: ${globalConfig.dimWidth}x${globalConfig.dimHeight} ${globalConfig.dimUnit}\n`;
    if (activeTab > 1) {
        prompt += `PANEL WIDTH (FOLD): ${Number.isInteger(panelWidthDisplay) ? panelWidthDisplay : panelWidthDisplay.toFixed(2)} ${globalConfig.dimUnit} per panel\n`;
    }
    prompt += `STYLE: ${globalConfig.styleVariant} (${globalConfig.styleCategory}).\n`;
    prompt += `GLOBAL LAYOUT STRUCTURE: ${activeLayout} Layout\n`;
    prompt += `KONSISTENSI VISUAL BRAND:\n`;
    prompt += `- Komposisi: ${globalConfig.composition}\n`;
    prompt += `- Tipografi Induk: ${globalConfig.typographyStyle}\n`;
    prompt += `- Tekstur & Material: ${globalConfig.material}\n`;
    prompt += `- Palette Background: ${globalConfig.bgPrimary} (Primary), ${globalConfig.bgSecondary} (Secondary)\n`;
    prompt += `- Palette Typography: ${globalConfig.fontPrimary} (Primary), ${globalConfig.fontSecondary} (Secondary)\n\n`;

    const dynamicHeaders = ["SECTION 1:", "SECTION 2:", "SECTION 3:"];

    pages.forEach((page, index) => {
      if (activeTab > 1) {
        prompt += `=====================================\n[START OF PAGE ${index + 1}]\n`;
        prompt += `IMAGE TO IMAGE MODE: ${page.imgToImg ? 'ON' : 'OFF'}\n\n`;
        dynamicHeaders.push(`[START OF PAGE ${index + 1}]`, `[END OF PAGE ${index + 1}]`);
      } else {
        prompt += `IMAGE TO IMAGE MODE: ${page.imgToImg ? 'ON' : 'OFF'}\n\n`;
      }
      prompt += `SECTION 1: HEADER (Top Area)\nTEXT/VISUAL: ${page.sections.s1 || '[Isi detail Header/Nama]'}\n\n`;
      prompt += `SECTION 2: CONTENT BODY (Middle Area)\nTEXT/VISUAL: ${page.sections.s2 || '[Isi detail Waktu, Tempat, Pesan]'}\n\n`;
      prompt += `SECTION 3: FOOTER (Bottom Area)\nTEXT/VISUAL: ${page.sections.s3 || '[Isi detail RSVP/Penutup]'}\n\n`;
      if (activeTab > 1) prompt += `[END OF PAGE ${index + 1}]\n\n`;
    });

    if (globalConfig.notes) {
      prompt += `CATATAN TAMBAHAN:\n${globalConfig.notes}\n\n`;
      dynamicHeaders.push(`CATATAN TAMBAHAN:`);
    }

    prompt += `### AI OUTPUT COMPLIANCE RULES\n`;
    prompt += `- **Enable Advanced Text Rendering**: Ensure all text inside quotes (Titles, Descriptions) is rendered with absolute clarity and correct spelling.\n`;
    prompt += `- **STRICTLY ANTI TYPO**: Prioritize text accuracy based on the provided script. Double-check every single letter. ZERO spelling mistakes allowed.\n`;
    if (globalConfig.hasArabic) {
      prompt += `- **ARABIC SCRIPT ENFORCEMENT**: STRICT MANDATE! The design contains Arabic text/calligraphy. You MUST render the Arabic script perfectly. Preserve the correct strokes, dots, and ligatures without morphing, breaking, or reversing the characters. Treat Arabic text as sacred geometry.\n`;
    }
    prompt += `- **STRICT METADATA EXCLUSION**: The following technical labels are **INTERNAL INSTRUCTIONS ONLY**. Do NOT render them as visual text inside the image.\n`;
    const forbiddenList = [...new Set(dynamicHeaders)].map(h => `"${h}"`).join(", ");
    prompt += `> **FORBIDDEN WORDS:** [${forbiddenList}]\n`;
    prompt += `- **Visual Hierarchy**: Ensure the Main Title is the largest, followed by content text.\n`;
    prompt += `- **Density Check**: Fill empty spaces with relevant background textures or small icons related to the topic; do not leave vast white spaces.\n`;
    prompt += `- **8K Resolution Output**: Use high-definition assets; no blurry edges.\n`;
    prompt += `- **Precise Layout**: Strictly follow the region distribution defined above.\n\n`;
    prompt += `REQUIREMENTS:\n`;
    prompt += `- **Model**: Use a model capable of high-fidelity text rendering (e.g., Ideogram 2.0 / Flux / Nano Banana Pro "Thinking").\n`;
    prompt += `- **Color Accuracy**: Stick strictly to the Palette defined above.\n\n`;
    prompt += `NEGATIVE PROMPT:\n[${globalConfig.negativePrompt}]`;

    setGeneratedPrompt(prompt);
    setIsCopied(false);
  };

  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = generatedPrompt;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) { console.error('Gagal menyalin teks', error); }
    document.body.removeChild(textArea);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <header className="border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-3">
          <Sparkles className="text-emerald-400" />
          MASTER PROMPT BUILDER
        </h1>
        <p className="text-gray-400 mt-1 text-sm">Modul Desain Undangan Terintegrasi</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 space-y-6">
          {/* TOPIK ACARA */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-sm">
            <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase flex items-center gap-2">
              <Sparkles size={14} className="text-blue-400"/> Topik / Jenis Acara
            </label>
            <input type="text" value={globalConfig.topic} onChange={(e) => handleGlobalChange('topic', e.target.value)} placeholder="Contoh: Pernikahan, Khitanan, Ulang Tahun..." className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500" />
          </div>

          <div className="flex space-x-2 bg-gray-900 p-1 rounded-xl">
            {[1, 2, 3].map((num) => (
              <button key={num} onClick={() => setActiveTab(num)} className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${activeTab === num ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800'}`}>
                {num === 1 ? 'TAB 1: Single Fold' : num === 2 ? 'TAB 2: Bi Fold' : 'TAB 3: Tri Fold'}
              </button>
            ))}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
            <div className="bg-gray-950 p-4 rounded-lg border border-gray-800 mb-2">
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase flex items-center gap-2"><Layout size={14}/> Master Layout ({activeTab === 1 ? 'Single' : activeTab === 2 ? 'Bi' : 'Tri'} Fold)</label>
              <select value={activeLayout} onChange={(e) => setActiveLayout(e.target.value)} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:outline-none">
                {FOLD_LAYOUTS[activeTab].map(l => <option key={l} value={l}>{l} Layout</option>)}
              </select>
            </div>

            {pages.map((page, index) => (
              <div key={page.id} className="space-y-4 pb-8 border-b border-gray-800 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2"><Layout size={18}/> {activeTab === 1 ? 'CANVAS AREA' : `PAGE ${page.id} (${activeTab === 2 ? 'Bi-Fold' : 'Tri-Fold'})`}</h3>
                  <label className="flex items-center cursor-pointer gap-3">
                    <span className="text-sm font-medium text-gray-400">IMG TO IMG</span>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={page.imgToImg} onChange={(e) => handlePageChange(index, 'imgToImg', e.target.checked)} />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${page.imgToImg ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${page.imgToImg ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                  </label>
                </div>
                <div className="grid gap-4 mt-4">
                  {[{ id: 's1', label: 'SECTION 1 : HEADER / VISUAL UTAMA', ph: 'Detail Header...' }, { id: 's2', label: 'SECTION 2 : BODY / INFORMASI', ph: 'Detail Acara...' }, { id: 's3', label: 'SECTION 3 : FOOTER / PENUTUP', ph: 'Detail RSVP...' }].map(sec => (
                    <div key={sec.id}>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">{sec.label}</label>
                      <textarea value={page.sections[sec.id]} onChange={(e) => handlePageChange(index, 'sections', e.target.value, sec.id)} placeholder={sec.ph} rows={2} className="w-full bg-gray-950 border border-gray-700 text-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-5 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2 mb-4"><Palette size={18}/> GLOBAL SETTINGS</h3>
            
            <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
              <label className="block text-xs font-semibold text-gray-500 mb-3 uppercase flex items-center gap-2"><ShieldAlert size={14} className="text-orange-400"/> Advanced AI Controls</label>
              <label className="flex items-center cursor-pointer gap-3 p-2 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-700 transition">
                <input type="checkbox" checked={globalConfig.hasArabic} onChange={(e) => handleGlobalChange('hasArabic', e.target.checked)} className="w-5 h-5 rounded" />
                <span className="text-sm font-semibold text-gray-300">Terdapat Teks Arabic / Kaligrafi</span>
              </label>
            </div>

            <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
              <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Dimensi Total (L x T)</label>
              <div className="flex gap-2">
                <input type="number" value={globalConfig.dimWidth} onChange={(e) => handleGlobalChange('dimWidth', parseFloat(e.target.value))} className="w-full bg-gray-800 border-gray-700 text-white rounded-lg p-2.5 text-sm" placeholder="Lebar" />
                <span className="text-gray-500 self-center">x</span>
                <input type="number" value={globalConfig.dimHeight} onChange={(e) => handleGlobalChange('dimHeight', parseFloat(e.target.value))} className="w-full bg-gray-800 border-gray-700 text-white rounded-lg p-2.5 text-sm" placeholder="Tinggi" />
                <select value={globalConfig.dimUnit} onChange={(e) => handleGlobalChange('dimUnit', e.target.value)} className="w-24 bg-gray-800 border-gray-700 text-white rounded-lg p-2.5 text-sm">
                  <option value="cm">cm</option><option value="mm">mm</option>
                </select>
              </div>
              {activeTab > 1 && (
                <div className={`mt-3 p-3 rounded-lg text-xs ${isImprecise ? 'bg-yellow-900/20 border-yellow-700/50 text-yellow-500' : 'bg-gray-800 text-gray-300'}`}>
                  <span className="block font-semibold">ℹ️ Lebar potongan: {Number.isInteger(panelWidthDisplay) ? panelWidthDisplay : panelWidthDisplay.toFixed(2)} {globalConfig.dimUnit}/Panel</span>
                  {isImprecise && <span className="block mt-1">⚠️ <strong>WARNING:</strong> Total lebar tidak bisa dibagi rata untuk {activeTab} lipatan.</span>}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-2 uppercase">Komposisi & Tipografi</label>
                <select value={globalConfig.composition} onChange={(e) => handleGlobalChange('composition', e.target.value)} className="w-full bg-gray-800 border-gray-700 text-white rounded-lg p-2.5 text-sm mb-2">{COMPOSITIONS.map(c => <option key={c} value={c}>{c}</option>)}</select>
                <select value={globalConfig.typographyStyle} onChange={(e) => handleGlobalChange('typographyStyle', e.target.value)} className="w-full bg-gray-800 border-gray-700 text-white rounded-lg p-2.5 text-sm">{TYPOGRAPHY_STYLES.map(c => <option key={c} value={c}>{c}</option>)}</select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-2 uppercase">Material & Lighting</label>
                <select value={globalConfig.material} onChange={(e) => handleGlobalChange('material', e.target.value)} className="w-full bg-gray-800 border-gray-700 text-white rounded-lg p-2.5 text-sm mb-2">{TEXTURE_MATERIALS.map(c => <option key={c} value={c}>{c}</option>)}</select>
                <select value={globalConfig.cameraSetup} onChange={(e) => handleGlobalChange('cameraSetup', e.target.value)} className="w-full bg-gray-800 border-gray-700 text-white rounded-lg p-2.5 text-sm border-l-4 border-l-purple-500">{CAMERA_LIGHTING.map(c => <option key={c} value={c}>{c}</option>)}</select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2 uppercase">Style Category</label>
                <select value={globalConfig.styleCategory} onChange={(e) => handleGlobalChange('styleCategory', e.target.value)} className="w-full bg-gray-800 border-gray-700 text-white rounded-lg p-2.5 text-sm">{STYLE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2 uppercase">Style Variant</label>
                <select value={globalConfig.styleVariant} onChange={(e) => handleGlobalChange('styleVariant', e.target.value)} className="w-full bg-gray-800 border-gray-700 text-white rounded-lg p-2.5 text-sm">{STYLE_VARIANTS[globalConfig.styleCategory].map(c => <option key={c} value={c}>{c}</option>)}</select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-3 uppercase">Color Palette</label>
              <div className="grid grid-cols-2 gap-2">
                {[{ id: 'bgPrimary', label: 'BG Prim' }, { id: 'bgSecondary', label: 'BG Sec' }, { id: 'fontPrimary', label: 'Font Prim' }, { id: 'fontSecondary', label: 'Font Sec' }].map(color => (
                  <div key={color.id} className="flex items-center gap-2 bg-gray-950 p-2 rounded-lg border border-gray-800">
                    <input type="color" value={globalConfig[color.id]} onChange={(e) => handleGlobalChange(color.id, e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-transparent border-0" />
                    <span className="text-xs text-gray-400">{color.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <textarea value={globalConfig.notes} onChange={(e) => handleGlobalChange('notes', e.target.value)} placeholder="Instruksi tambahan untuk AI..." rows={2} className="w-full bg-gray-950 border border-gray-700 text-gray-200 rounded-lg p-3 text-sm focus:outline-none" />
            </div>

            <button onClick={buildPrompt} className="w-full py-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg transition-transform transform hover:-translate-y-1 flex justify-center items-center gap-2">
              <Settings size={20} /> GENERATE MASTER PROMPT
            </button>
          </div>
        </div>
      </div>

      {generatedPrompt && (
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-gray-800 px-6 py-3 border-b border-gray-700 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-300">OUTPUT MARKDOWN (READY TO COPY)</span>
            <button onClick={copyToClipboard} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">
              {isCopied ? <CheckCircle2 size={16} className="text-green-400"/> : <Copy size={16} />}
              {isCopied ? 'COPIED!' : 'COPY PROMPT'}
            </button>
          </div>
          <div className="p-6 overflow-auto max-h-[600px] bg-[#0d1117]">
            <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">{generatedPrompt}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================================
// 3. KOMPONEN UTAMA: PORTAL KEAMANAN & DASHBOARD
// =====================================================================
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard'); // 'dashboard' atau 'prompt_builder'

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        setUserRole('admin');
        setIsAuthenticated(true);
        setActiveMenu('dashboard');
      } else if (username === 'member' && password === 'member123') {
        setUserRole('member');
        setIsAuthenticated(true);
        setActiveMenu('dashboard');
      } else {
        setError('Kredensial tidak valid.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername('');
    setPassword('');
  };

  // --- LAYAR LOGIN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 font-sans text-gray-100">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden relative">
          <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600"></div>
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-800 p-4 rounded-full border border-gray-700 shadow-inner">
                <Shield size={40} className="text-emerald-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-white mb-2">SECURE PORTAL</h2>
            <p className="text-gray-400 text-center text-sm mb-8">Otentikasi & Akses Alat Cerdas</p>
            {error && (
              <div className="mb-6 p-3 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
                <AlertTriangle size={18} /><span>{error}</span>
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">ID Pengguna</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User size={18} className="text-gray-500" /></div>
                  <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500" placeholder="admin / member" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Kata Sandi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Key size={18} className="text-gray-500" /></div>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500" placeholder="••••••••" />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg shadow-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50">
                {isLoading ? <span className="animate-pulse">MEMVERIFIKASI...</span> : <><Lock size={18} /> OTORISASI AKSES</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- LAYAR DASHBOARD UTAMA ---
  return (
    <div className="h-screen bg-gray-950 font-sans text-gray-100 flex flex-col md:flex-row overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <Shield className={userRole === 'admin' ? "text-emerald-400" : "text-blue-400"} />
          <div>
            <h1 className="font-bold text-white tracking-wider">SYSTEM_CORE</h1>
            <p className="text-xs text-gray-500 uppercase">{userRole} PANEL</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-2">Menu Utama</div>
          <button 
            onClick={() => setActiveMenu('dashboard')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeMenu === 'dashboard' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Database size={18} /> Beranda / Ikhtisar
          </button>
          
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-6">Modul Cerdas</div>
          <button 
            onClick={() => setActiveMenu('prompt_builder')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors border ${activeMenu === 'prompt_builder' ? 'bg-blue-900/20 border-blue-500/50 text-blue-400' : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Sparkles size={18} /> Master Prompt Builder
          </button>
          
          {userRole === 'admin' && (
            <>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-6">Sistem Admin</div>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"><Users size={18} /> Kelola Pengguna</button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"><Activity size={18} /> Log Keamanan</button>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3 bg-red-950/30 text-red-400 hover:bg-red-900/50 hover:text-red-300 rounded-lg transition-colors border border-red-900/50">
            <LogOut size={18} /> AKHIRI SESI
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto relative">
        
        {/* Render Konten Berdasarkan Menu Aktif */}
        {activeMenu === 'dashboard' ? (
          <div className="animate-in fade-in duration-300">
            <header className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">Selamat Datang, {username}</h2>
                <p className="text-gray-400">Pilih menu di samping untuk memulai.</p>
              </div>
              <div className="bg-gray-900 px-4 py-2 rounded-lg border border-gray-800 text-sm flex items-center gap-2">
                 Status: <span className={`font-bold uppercase ${userRole === 'admin' ? 'text-emerald-400' : 'text-blue-400'}`}>{userRole}</span>
              </div>
            </header>

            {userRole === 'admin' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-sm">
                  <h3 className="text-gray-400 font-semibold mb-2">Total Prompt Dibuat</h3>
                  <p className="text-4xl font-bold text-white">842</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-sm">
                  <h3 className="text-gray-400 font-semibold mb-2">Member Aktif (Bulan Ini)</h3>
                  <p className="text-4xl font-bold text-blue-400">124</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-xl border border-emerald-900/30 shadow-sm">
                  <h3 className="text-gray-400 font-semibold mb-2">Status Sistem</h3>
                  <p className="text-4xl font-bold text-emerald-400">OPTIMAL</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-sm text-center">
                <div className="inline-block p-4 bg-blue-900/20 rounded-full mb-4">
                  <Sparkles size={40} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Akses Modul Cerdas Tersedia</h3>
                <p className="text-gray-400 max-w-lg mx-auto mb-6">
                  Akun Anda telah diotorisasi untuk menggunakan fitur pembuat prompt AI. Silakan klik menu <strong>"Master Prompt Builder"</strong> di bilah navigasi kiri untuk mulai mendesain.
                </p>
                <button 
                  onClick={() => setActiveMenu('prompt_builder')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Buka Master Prompt
                </button>
              </div>
            )}
          </div>
        ) : activeMenu === 'prompt_builder' ? (
          /* MERENDER MODUL MASTER PROMPT BUILDER KETIKA MENU DIKLIK */
          <PromptBuilderModule />
        ) : null}
      </main>

    </div>
  );
}