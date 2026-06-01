import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Camera, Image as ImageIcon, Wand2, Download, AlertCircle, 
  RefreshCw, Sun, Moon, Palette, Maximize, Sparkles, Layers, 
  ExternalLink, PencilLine, Square, RectangleHorizontal, 
  RectangleVertical, Video, Box, Trees, Layout, Info, Smartphone,
  Trash2, RotateCcw, MessageSquare, MousePointer2, ZoomIn, X, Minus, Plus,
  Eraser, ChevronRight, Menu, LayoutGrid, PencilRuler, ChevronLeft,
  LayoutTemplate, Type, Target, ShieldBan, Store, UserCircle,
  BrainCircuit, CheckCircle2, ImagePlus, Monitor, PenTool, MessageSquarePlus,
  Text as TextIcon, Columns, Frame, Droplets, PaintBucket, FileText,
  Terminal, BookOpen, ShieldAlert, Copy,
  Zap, Crosshair, Bot, Loader2, Tag, Edit3, ListOrdered, Hexagon, FileImage
} from 'lucide-react';

const apiKey = ""; // API Key otomatis disediakan oleh sistem

// --- Shared Utility Functions ---
const fetchWithRetry = async (url, options, retries = 5, backoff = 1000) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (err) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw err;
  }
};

// --- CONSTANTS FOR LOGO DESIGNER ---
const PERSONALITIES = [
  "Tegas (Bold)", "Premium/Mewah", "Ramah/Friendly", "Religius/Syariah", 
  "Modern/Tech", "Tradisional/Heritage", "Minimalis", "Ceria/Playful", 
  "Maskulin", "Feminin", "Korporat/Profesional", "Organik/Natural"
];

const LOGO_STYLES = [
  { id: 'wordmark', label: 'Wordmark', desc: 'Fokus pada teks nama', icon: 'T' },
  { id: 'lettermark', label: 'Lettermark', desc: 'Inisial/Singkatan', icon: 'HB' },
  { id: 'icon_text', label: 'Icon + Text', desc: 'Simbol dengan teks', icon: '★T' },
  { id: 'emblem', label: 'Emblem', desc: 'Teks di dalam simbol', icon: '🛡️' },
  { id: 'abstract', label: 'Abstract', desc: 'Simbol bentuk abstrak', icon: '🌀' },
  { id: 'pictorial', label: 'Pictorial', desc: 'Simbol gambar nyata', icon: '🍎' },
  { id: 'mascot', label: 'Mascot', desc: 'Karakter/Maskot', icon: '🦊' },
  { id: 'badge', label: 'Badge', desc: 'Gaya lencana/stempel', icon: '🏅' }
];

const FONT_STYLES = [
  { id: 'serif', label: 'Serif', desc: 'Klasik & Berwibawa' },
  { id: 'sans-serif', label: 'Sans-Serif', desc: 'Modern & Bersih' },
  { id: 'script', label: 'Script', desc: 'Elegan & Mengalir' },
  { id: 'display', label: 'Display', desc: 'Unik & Menonjol' },
  { id: 'modern', label: 'Modern', desc: 'Futuristik & Tajam' },
  { id: 'handwritten', label: 'Handwritten', desc: 'Personal & Artistik' }
];

const COLOR_TYPES = [
  { id: 'solid', label: 'Solid Color', desc: 'Satu warna dominan', icon: '●' },
  { id: 'gradient', label: 'Gradient', desc: 'Kombinasi gradasi modern', icon: '◐' }
];

const GRADIENT_PRESETS = [
  { id: 'sunset', label: 'Sunset', colors: 'Orange to Purple', css: 'from-orange-400 to-purple-600' },
  { id: 'ocean', label: 'Ocean', colors: 'Blue to Teal', css: 'from-blue-600 to-teal-400' },
  { id: 'nature', label: 'Nature', colors: 'Emerald to Lime', css: 'from-emerald-600 to-lime-400' },
  { id: 'berry', label: 'Berry', colors: 'Pink to Red', css: 'from-pink-500 to-red-600' },
  { id: 'midnight', label: 'Midnight', colors: 'Indigo to Black', css: 'from-indigo-600 to-slate-900' },
  { id: 'gold', label: 'Luxury', colors: 'Gold to Amber', css: 'from-yellow-400 to-amber-600' },
  { id: 'tech', label: 'Cyber', colors: 'Cyan to Violet', css: 'from-cyan-400 to-violet-600' },
  { id: 'fire', label: 'Heat', colors: 'Red to Yellow', css: 'from-red-600 to-yellow-400' }
];

// --- Component: Logo Studio ---
const LogoStudio = ({ onZoom }) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    brandName: "",
    industry: "",
    personality: [],
    customInstructions: "", 
    logoStyle: "icon_text",
    fontStyle: "sans-serif",
    colorType: "solid",
    colorPalette: "#4f46e5", 
    gradientStyle: "Blue to Teal", 
    renderMode: "logo", 
    uploadedLogo: null,
    mockupContext: "Kantor Modern",
    customMockupMedia: ""
  });

  const handlePersonalityToggle = (p) => {
    setFormData(prev => ({
      ...prev,
      personality: prev.personality.includes(p) 
        ? prev.personality.filter(item => item !== p)
        : [...prev.personality, p].slice(-5)
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setResults([]);

    try {
      if (formData.renderMode === 'logo') {
        let colorInstruction = "";
        if (formData.colorType === 'solid') {
          colorInstruction = `dominant single solid color of ${formData.colorPalette}`;
        } else {
          colorInstruction = `modern vibrant gradient color scheme (${formData.gradientStyle})`;
        }

        const prompt = `Professional high-quality logo for a brand named "${formData.brandName}" in the ${formData.industry} industry. 
        Logo Style: ${formData.logoStyle}. 
        Typography/Font Style: ${formData.fontStyle}. 
        Personality traits: ${formData.personality.join(", ")}. 
        Color Theme: ${colorInstruction}. 
        Specific User Instructions: ${formData.customInstructions}.
        Clean minimalist design, vector style, flat illustration, solid white background, high resolution, centered composition.`;
        
        const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instances: [{ prompt }], parameters: { sampleCount: 4 } })
        });

        const images = response.predictions.map(p => `data:image/png;base64,${p.bytesBase64Encoded}`);
        setResults(images);
      } else {
        const mockupPrompt = `Professional 3D high-end brand mockup for the provided logo. Place the logo realistically on ${formData.mockupContext}. Cinematic lighting, studio quality, sharp details. Context: ${formData.customMockupMedia}`;
        const logoBase64 = formData.uploadedLogo.split(',')[1];
        
        const promises = Array.from({ length: 4 }).map(async (_, i) => {
          const res = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: `${mockupPrompt} - variation ${i + 1}` },
                  { inlineData: { mimeType: "image/png", data: logoBase64 } }
                ]
              }],
              generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
            })
          });
          return `data:image/png;base64,${res.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data}`;
        });

        const images = await Promise.all(promises);
        setResults(images);
      }
    } catch (err) {
      setError("Gagal menghasilkan visual. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4 text-white shadow-lg">
          <PencilRuler size={24} />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight uppercase">Logo & Brand Studio</h1>
        <p className="text-slate-500 text-sm mt-2 font-medium opacity-80">Rancang identitas visual brand Anda dengan teknologi AI tercanggih.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Langkah {step} dari 2</span>
            <div className="flex gap-1">
              {[1, 2].map(i => (
                <div key={i} className={`h-1 w-8 rounded-full transition-all ${step >= i ? 'bg-blue-600' : 'bg-slate-100'}`} />
              ))}
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Type size={14} /> Nama Brand & Industri
                </label>
                <input 
                  type="text" 
                  placeholder="Nama Brand Anda..." 
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-bold"
                  value={formData.brandName}
                  onChange={e => setFormData({...formData, brandName: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Industri (Cth: Kuliner, Teknologi)..." 
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-medium text-sm"
                  value={formData.industry}
                  onChange={e => setFormData({...formData, industry: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <BrainCircuit size={14} /> Karakter Brand (Maks 5)
                </label>
                <div className="flex flex-wrap gap-2">
                  {PERSONALITIES.map(p => (
                    <button
                      key={p}
                      onClick={() => handlePersonalityToggle(p)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${formData.personality.includes(p) ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <FileText size={14} /> Instruksi Khusus (Optional)
                </label>
                <textarea
                  placeholder="Contoh: Tolong sertakan elemen daun, hindari warna merah, buat agar terlihat futuristik..."
                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-medium text-xs h-24 resize-none"
                  value={formData.customInstructions}
                  onChange={e => setFormData({...formData, customInstructions: e.target.value})}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-500 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
              <div className="flex p-1 bg-slate-100 rounded-2xl sticky top-0 z-10">
                <button 
                  onClick={() => setFormData({...formData, renderMode: 'logo'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${formData.renderMode === 'logo' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                >
                  <Palette size={16} /> Logo Baru
                </button>
                <button 
                  onClick={() => setFormData({...formData, renderMode: 'mockup'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${formData.renderMode === 'mockup' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                >
                  <Box size={16} /> Mockup Produk
                </button>
              </div>

              {formData.renderMode === 'logo' ? (
                <div className="space-y-6">
                  {/* Gaya Logo */}
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2"><LayoutGrid size={12}/> Gaya Logo</label>
                    <div className="grid grid-cols-2 gap-3">
                      {LOGO_STYLES.map(s => (
                        <button
                          key={s.id}
                          onClick={() => setFormData({...formData, logoStyle: s.id})}
                          className={`p-3 rounded-2xl border text-left transition-all ${formData.logoStyle === s.id ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 hover:border-blue-200'}`}
                        >
                          <div className="text-xs font-bold text-slate-800 flex items-center gap-2"><span className="opacity-50">{s.icon}</span> {s.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gaya Font */}
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2"><TextIcon size={12}/> Gaya Font</label>
                    <div className="grid grid-cols-2 gap-3">
                      {FONT_STYLES.map(f => (
                        <button
                          key={f.id}
                          onClick={() => setFormData({...formData, fontStyle: f.id})}
                          className={`p-3 rounded-2xl border text-left transition-all ${formData.fontStyle === f.id ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 hover:border-blue-200'}`}
                        >
                          <div className="text-xs font-bold text-slate-800">{f.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tipe Warna Logo */}
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2"><Droplets size={12}/> Palet Warna</label>
                    
                    {/* Switch Solid / Gradient */}
                    <div className="flex gap-2 mb-4">
                      {COLOR_TYPES.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setFormData({...formData, colorType: c.id})}
                          className={`flex-1 p-3 rounded-xl border text-center transition-all ${formData.colorType === c.id ? 'border-blue-600 bg-blue-600 text-white shadow-md' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                        >
                          <div className="flex items-center justify-center gap-2 text-xs font-bold">
                            {c.icon} {c.label}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Kontrol Warna Solid */}
                    {formData.colorType === 'solid' && (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Pilih Warna Kustom</label>
                        <div className="flex items-center gap-3">
                          <input 
                            type="color" 
                            value={formData.colorPalette}
                            onChange={(e) => setFormData({...formData, colorPalette: e.target.value})}
                            className="h-12 w-12 rounded-xl border-2 border-white shadow-sm cursor-pointer"
                          />
                          <div className="flex-1">
                            <input 
                              type="text" 
                              value={formData.colorPalette}
                              onChange={(e) => setFormData({...formData, colorPalette: e.target.value})}
                              className="w-full p-3 rounded-xl border border-slate-200 text-sm font-mono font-bold uppercase"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Kontrol Gradasi */}
                    {formData.colorType === 'gradient' && (
                      <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2">
                        {GRADIENT_PRESETS.map(g => (
                          <button
                            key={g.id}
                            onClick={() => setFormData({...formData, gradientStyle: g.colors})}
                            className={`group relative h-16 rounded-2xl overflow-hidden border-2 transition-all ${formData.gradientStyle === g.colors ? 'border-blue-600 scale-[0.98]' : 'border-transparent hover:scale-[0.98]'}`}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-r ${g.css}`}></div>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                              <span className="text-white font-bold text-xs shadow-sm">{g.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Unggah Logo Anda</label>
                  <div className="h-32 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden">
                    {formData.uploadedLogo ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <img src={formData.uploadedLogo} className="max-h-full max-w-full object-contain p-4" />
                        <button onClick={() => setFormData({...formData, uploadedLogo: null})} className="absolute top-2 right-2 p-1 bg-white shadow-md rounded-lg text-red-500 hover:bg-red-50"><Trash2 size={14}/></button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center cursor-pointer">
                        <Upload className="text-slate-300 mb-1" size={24} />
                        <span className="text-[10px] font-bold text-slate-400">Pilih File (PNG Transparan Disarankan)</span>
                        <input type="file" className="hidden" accept="image/*" onChange={e => {
                          const reader = new FileReader();
                          reader.onload = (event) => setFormData({...formData, uploadedLogo: event.target.result});
                          reader.readAsDataURL(e.target.files[0]);
                        }} />
                      </label>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase">Konteks Mockup</label>
                    <select value={formData.mockupContext} onChange={e => setFormData({...formData, mockupContext: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none">
                      <option>Kantor Modern</option>
                      <option>Toko/Etalase</option>
                      <option>Kemasan Produk</option>
                      <option>Media Sosial</option>
                      <option>Stationery (Alat Tulis)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 mt-auto pt-4 border-t border-slate-50 bg-white">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                <ChevronLeft size={18} /> Kembali
              </button>
            )}
            {step < 2 ? (
              <button onClick={() => setStep(2)} disabled={!formData.brandName} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                Lanjut <ChevronRight size={18} />
              </button>
            ) : (
              <button onClick={handleGenerate} disabled={isGenerating} className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <><Wand2 size={18} /> Render Sekarang</>}
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-100/50 rounded-[2.5rem] p-6 min-h-[500px] flex flex-col">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Galeri Hasil Render</h2>
            
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((url, i) => (
                  <div key={i} className="group relative aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-white">
                    <img src={url} className="w-full h-full object-cover transition-all group-hover:scale-110" alt={`Logo var ${i}`} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button 
                        onClick={() => onZoom(url)}
                        className="p-3 bg-white rounded-xl text-blue-600 hover:scale-110 transition-transform"
                        title="Zoom Preview"
                      >
                        <ZoomIn size={20} />
                      </button>
                      <button onClick={() => { const a = document.createElement('a'); a.href = url; a.download = `brand-${i}.png`; a.click(); }} className="p-3 bg-white rounded-xl text-blue-600 hover:scale-110 transition-transform"><Download size={20} /></button>
                      <button onClick={() => window.open(url)} className="p-3 bg-white rounded-xl text-blue-600 hover:scale-110 transition-transform"><ExternalLink size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : isGenerating ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="relative mb-6">
                  <RefreshCw className="animate-spin text-blue-600" size={64} />
                  <Sparkles className="absolute -top-4 -right-4 text-yellow-500 animate-pulse" size={32} />
                </div>
                <p className="font-black text-slate-800 tracking-tighter text-xl uppercase">AI Sedang Merancang...</p>
                <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">Kami sedang menggabungkan konsep desain dengan teknologi AI untuk hasil terbaik.</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-20 py-20">
                <LayoutTemplate size={80} className="text-slate-400 mb-4" />
                <p className="font-black uppercase tracking-[0.2em] text-sm">Belum Ada Visual</p>
              </div>
            )}
          </div>
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">{error}</div>}
        </div>
      </div>
    </div>
  );
};

// --- Component: AI Upscale & Photo Restorer ---
const PhotoRestorer = ({ onZoom }) => {
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [restoredImage, setRestoredImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(3/4); 
  const [userInstruction, setUserInstruction] = useState("");
  
  const ADS_STYLES = [
    { id: 'S1', label: 'Premium Luxury Commercial', desc: 'Elegant cinematic luxury, premium spacing, gold accents.', material: 'Brushed Titanium, Polished Marble' },
    { id: 'S2', label: 'Bold Pop Art Promo', desc: 'Aggressive energetic retail, high contrast, oversized typography.', material: 'Glossy Plastic, Vibrant Gradients' },
    { id: 'S3', label: 'Hyper-realistic Product', desc: 'Ultra-sharp details, studio lighting precision.', material: 'Realistic Glass, Brushed Metal' },
    { id: 'S4', label: 'Futuristic Tech', desc: 'Glowing interface, neon highlights, cyber atmosphere.', material: 'Frosted Glass, Carbon Fiber' },
    { id: 'S5', label: 'Cinematic Food', desc: 'Steam effects, glossy highlights, warm lighting.', material: 'Crispy Textures, Glossy Sauces' },
    { id: 'S9', label: 'Medical Clean Trustworthy', desc: 'Ultra-clean healthcare ads with scientific professionalism.', material: 'Frosted Glass, Clinical White' }
  ];
  const ADS_CAMERAS = [
    { id: 'C1', label: 'Premium Product Studio', desc: 'Sharp focus isolation, soft shadows, 80mm f/1.9.' },
    { id: 'C4', label: 'Food Macro Cinematic', desc: 'Texture emphasis, 100mm Macro, shallow DOF.' },
    { id: 'C6', label: 'Futuristic Tech Isometric', desc: '30-degree isometric angle, medium digital focus.' },
    { id: 'C11', label: 'Marketplace Clean Front Shot', desc: 'Shadow-free lighting, catalog-ready composition, full product sharpness.' },
    { id: 'C13', label: 'Hyper-Macro Technical Anatomy', desc: 'Hasselblad H6D-100c, 100mm f/2.8 Macro. Focus stacking.' }
  ];

  const [selectedStyle, setSelectedStyle] = useState(ADS_STYLES[2].id); 
  const [selectedCamera, setSelectedCamera] = useState(ADS_CAMERAS[0].id);

  const [rects, setRects] = useState([]); 
  const [currentRect, setCurrentRect] = useState(null); 
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const drawCanvas = () => {
    if (imgRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const img = imgRef.current;
      canvas.width = img.clientWidth;
      canvas.height = img.clientHeight;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const drawSelection = (rect) => {
        ctx.fillStyle = "rgba(239, 68, 68, 0.2)"; 
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
        ctx.setLineDash([]);
      };
      rects.forEach(drawSelection);
      if (currentRect) drawSelection(currentRect);
    }
  };

  useEffect(() => {
    drawCanvas();
    window.addEventListener('resize', drawCanvas);
    return () => window.removeEventListener('resize', drawCanvas);
  }, [image, rects, currentRect]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          setAspectRatio(img.width / img.height);
          setImage(reader.result);
          setBase64Image(reader.result.split(',')[1]);
          setRestoredImage(null);
          setRects([]);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const startDrawing = (e) => {
    if (!image) return;
    const { offsetX, offsetY } = e.nativeEvent;
    setStartPos({ x: offsetX, y: offsetY });
    setIsDrawing(true);
  };

  const drawing = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    setCurrentRect({
      x: Math.min(startPos.x, offsetX),
      y: Math.min(startPos.y, offsetY),
      width: Math.abs(offsetX - startPos.x),
      height: Math.abs(offsetY - startPos.y)
    });
  };

  const stopDrawing = () => {
    if (isDrawing && currentRect && currentRect.width > 5 && currentRect.height > 5) {
      setRects([...rects, currentRect]);
    }
    setIsDrawing(false);
    setCurrentRect(null);
  };

  const handleDownloadUpscaled = (imageUrl, fileName) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scaleFactor = 3; 
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;
      const ctx = canvas.getContext('2d');
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png'); 
      a.download = fileName;
      a.click();
    };
    img.src = imageUrl;
  };

  const processImage = async () => {
    if (!base64Image || !imgRef.current) return;
    setLoading(true);
    setError(null);
    const hasSelection = rects.length > 0;
    
    const styleObj = ADS_STYLES.find(s => s.id === selectedStyle);
    const camObj = ADS_CAMERAS.find(c => c.id === selectedCamera);

    const prompt = hasSelection ? 
    `RESTORASI & INPAINTING: Hapus/hilangkan objek pada area berwarna merah (#FF0000) dengan bersih dan menyatu alami dengan background. Instruksi Tambahan: ${userInstruction || "Rapikan area bertanda."}
    Terapkan juga AESTHETIC ENGINE berikut untuk merapikan hasil:
    Style: ${styleObj.desc} Material: ${styleObj.material}. Camera: ${camObj.desc} 8k resolution, ultra-detailed.` :
    `UPSCALE & ENHANCE TOTAL: Tingkatkan resolusi foto ini secara signifikan, buat menjadi super tajam (8K), realistis, perjelas tekstur, dan hilangkan noise/blur tanpa merusak struktur asli gambar. Instruksi Tambahan: ${userInstruction || "Tingkatkan kejernihan setajam mungkin."}
    WAJIB TERAPKAN AESTHETIC ENGINE INI:
    - Style Mood: ${styleObj.desc}
    - Material/Texture Feel: ${styleObj.material}
    - Camera Profile: ${camObj.desc}
    - Lighting: Studio lighting, hyper-realistic.`;

    try {
      const tempCanvas = document.createElement('canvas');
      const img = imgRef.current;
      tempCanvas.width = img.naturalWidth;
      tempCanvas.height = img.naturalHeight;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
      if (hasSelection) {
        tempCtx.fillStyle = "#FF0000";
        const scaleX = tempCanvas.width / img.clientWidth;
        const scaleY = tempCanvas.height / img.clientHeight;
        rects.forEach(rect => {
          tempCtx.fillRect(rect.x * scaleX, rect.y * scaleY, rect.width * scaleX, rect.height * scaleY);
        });
      }
      const combinedBase64 = tempCanvas.toDataURL('image/png').split(',')[1];
      const result = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }, { inlineData: { mimeType: "image/png", data: combinedBase64 } }]
            }],
            generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
          })
        }
      );
      const base64Data = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
      if (base64Data) setRestoredImage(`data:image/png;base64,${base64Data}`);
    } catch (err) {
      setError("Terjadi kesalahan sistem. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-4 text-white shadow-lg">
          <Wand2 size={24} />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight uppercase">AI Upscale & Eraser</h1>
        <p className="text-slate-500 text-sm mt-2 font-medium opacity-80 max-w-2xl mx-auto">Seleksi area untuk menghapus objek, atau biarkan kosong untuk Upscale & Restorasi foto buram menjadi kualitas Studio (8K) menggunakan Kutuby Engine.</p>
      </header>

      {image && (
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex-1 flex flex-col md:flex-row items-center gap-3 pr-4 md:border-r border-slate-100">
              <div className="flex gap-2 w-full md:w-auto">
                <button onClick={() => setRects(rects.slice(0, -1))} disabled={rects.length === 0} className="p-3 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-30"><RotateCcw size={18} /></button>
                <button onClick={() => setRects([])} disabled={rects.length === 0} className="p-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-30"><Trash2 size={18} /></button>
              </div>
              <div className="w-full flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100 focus-within:border-indigo-300 transition-colors">
                <MessageSquare size={16} className="text-slate-400" />
                <input type="text" value={userInstruction} onChange={(e) => setUserInstruction(e.target.value)} placeholder="Instruksi khusus (opsional)..." className="bg-transparent text-sm font-bold focus:outline-none w-full text-slate-700" />
              </div>
            </div>

            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[9px] font-black uppercase text-indigo-600 tracking-wider">Aesthetic Style</label>
                <select value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl font-bold text-[11px] text-slate-700 outline-none focus:border-indigo-500 cursor-pointer h-full">
                  {ADS_STYLES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div className="flex-1 relative">
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-[9px] font-black uppercase text-indigo-600 tracking-wider">Camera Engine</label>
                <select value={selectedCamera} onChange={(e) => setSelectedCamera(e.target.value)} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl font-bold text-[11px] text-slate-700 outline-none focus:border-indigo-500 cursor-pointer h-full">
                  {ADS_CAMERAS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>
            
            <button onClick={() => { setImage(null); setRestoredImage(null); setRects([]); }} className="p-3 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-xl transition-colors" title="Ganti Foto">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Input Editor</h3>
            {image && <button onClick={() => onZoom(image)} className="text-indigo-600 flex items-center gap-1 text-[10px] font-bold hover:underline"><ZoomIn size={12} /> ZOOM PREVIEW</button>}
          </div>
          <div ref={containerRef} className={`relative w-full rounded-[2rem] overflow-hidden bg-white shadow-sm border border-slate-100 transition-all group ${!image ? 'aspect-[3/4] flex items-center justify-center' : ''}`} style={image ? { aspectRatio: `${aspectRatio}` } : {}}>
            {!image ? (
              <label className="flex flex-col items-center cursor-pointer p-10 text-center w-full">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl mb-4 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><Upload size={32} /></div>
                <span className="text-sm font-black text-slate-700 uppercase tracking-wide">Unggah Foto Lama</span>
                <span className="text-xs font-medium text-slate-400 mt-1">JPG, PNG untuk di-upscale atau inpainting</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center select-none cursor-crosshair">
                <img ref={imgRef} src={image} className="max-w-full max-h-[70vh] object-contain" onLoad={drawCanvas} />
                <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseMove={drawing} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} className="absolute z-10" style={{ width: imgRef.current?.clientWidth, height: imgRef.current?.clientHeight }} />
              </div>
            )}
          </div>
          {image && !loading && (
            <button onClick={processImage} className="w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-95">
              <Sparkles size={20} /> <span className="text-sm">{rects.length > 0 ? "Hapus Noda & Enhance" : "Upscale ke Kualitas Studio (8K)"}</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hasil AI Studio</h3>
            {restoredImage && !loading && <button onClick={() => onZoom(restoredImage)} className="text-indigo-600 flex items-center gap-1 text-[10px] font-bold hover:underline"><ZoomIn size={12} /> ZOOM PREVIEW</button>}
          </div>
          <div className={`relative w-full rounded-[2rem] overflow-hidden bg-slate-100 shadow-inner flex items-center justify-center ${!image ? 'aspect-[3/4]' : ''}`} style={image ? { aspectRatio: `${aspectRatio}` } : {}}>
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-10">
                <RefreshCw size={40} className="animate-spin text-indigo-600 mb-6" />
                <p className="font-black text-xs tracking-widest text-slate-800 uppercase">Engine Berjalan...</p>
                <p className="text-[10px] font-bold text-indigo-600 mt-2 bg-indigo-50 px-3 py-1 rounded-full animate-pulse">{rects.length > 0 ? "Inpainting Mode" : "Upscaling Mode 8K"}</p>
              </div>
            ) : restoredImage ? (
              <div className="relative w-full h-full flex items-center justify-center group p-2">
                <img src={restoredImage} className="w-full h-full object-contain rounded-[1.5rem] shadow-2xl bg-white" />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                   <button onClick={() => onZoom(restoredImage)} className="p-4 bg-white rounded-2xl text-indigo-600 shadow-2xl hover:scale-110 transition-transform"><ZoomIn size={22} /></button>
                   <button onClick={() => handleDownloadUpscaled(restoredImage, 'KUTUBY-Upscaled-Studio.png')} className="p-4 bg-white rounded-2xl text-indigo-600 shadow-2xl hover:scale-110 transition-transform"><Download size={22} /></button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center opacity-10 p-12 text-center">
                <ImageIcon size={64} className="mb-4" />
                <p className="text-[10px] font-black tracking-widest uppercase">Visual Preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Component: Mockup Studio ---
const MockupStudio = ({ onZoom }) => {
  const [sourceImage, setSourceImage] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [improvingPrompt, setImprovingPrompt] = useState(false);
  const [error, setError] = useState(null);
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [lighting, setLighting] = useState("Terang");
  const [atmosphere, setAtmosphere] = useState("Natural");
  const [style, setStyle] = useState("Minimalis Studio");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [variationCount, setVariationCount] = useState(4);

  const MOCKUP_STYLES = [
    "Minimalis Studio", "Outdoor / Alam", "Sinematik", "Flat Lay", 
    "Urban Street", "Cyberpunk", "Vintage / Retro", "Luxury Interior", "Zen Minimalist"
  ];

  const ASPECT_RATIOS = ["1:1", "4:5", "16:9", "9:16", "3:2"];
  const RESULT_VARIATIONS = [4, 6, 8, 10];

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSourceImage(event.target.result);
        setBase64Image(event.target.result.split(',')[1]);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const improvePrompt = async () => {
    if (!prompt) { setError("Tulis deskripsi singkat produk."); return; }
    setImprovingPrompt(true);
    try {
      const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `Ubah "${prompt}" menjadi prompt fotografi produk profesional dalam Bahasa Inggris. Sertakan detail latar belakang, pencahayaan sinematik, suasana ${atmosphere}. Fokus pada estetika ${style} dengan rasio ${aspectRatio}. Langsung berikan hasil teksnya saja.` }] }] })
      });
      const improvedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (improvedText) setPrompt(improvedText.trim());
    } catch (err) { setError("Gagal optimasi prompt."); } finally { setImprovingPrompt(false); }
  };

  const generateAllMockups = async () => {
    if (!base64Image || !prompt) { setError("Foto dan deskripsi harus disiapkan."); return; }
    setLoading(true);
    setResults([]);
    const basePrompt = `Professional high-end product photography, ${style} aesthetic, ${lighting} lighting, ${atmosphere} mood, target aspect ratio ${aspectRatio}, 8k ultra-detailed, realistic shadows and reflections. Context: ${prompt}`;
    
    try {
      const promises = Array.from({ length: variationCount }, (_, i) => {
        return fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            contents: [{ 
              parts: [
                { text: `${basePrompt} - Variant unique ${i+1}` }, 
                { inlineData: { mimeType: "image/png", data: base64Image } }
              ] 
            }], 
            generationConfig: { responseModalities: ["TEXT", "IMAGE"] } 
          })
        }).then(res => `data:image/png;base64,${res.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data}`);
      });
      const generatedImages = await Promise.all(promises);
      setResults(generatedImages);
    } catch (err) { setError("Gagal memproses gambar."); } finally { setLoading(false); }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-700">Mockup Engine v4</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-800 uppercase">Mockup <span className="text-orange-500">Studio</span></h1>
        <p className="text-slate-500 font-medium text-sm mt-2">Ubah foto produk biasa menjadi katalog profesional dengan kontrol penuh.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
             <h2 className="text-[10px] font-black text-indigo-600 mb-4 uppercase tracking-widest flex items-center">
               <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-2 text-[10px]">1</span> Input Produk
             </h2>
             <div className="h-48 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden bg-slate-50 group">
                {sourceImage ? (
                  <div className="relative w-full h-full p-2 group">
                    <img src={sourceImage} className="w-full h-full object-contain" />
                    <button onClick={() => setSourceImage(null)} className="absolute top-2 right-2 bg-white/90 p-2 rounded-xl text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto text-slate-300 mb-2" size={32} />
                    <div className="flex gap-2">
                       <button onClick={() => galleryInputRef.current.click()} className="text-[9px] font-black bg-white border border-slate-200 px-3 py-1.5 rounded-lg uppercase">Galeri</button>
                       <button onClick={() => cameraInputRef.current.click()} className="text-[9px] font-black bg-indigo-600 text-white px-3 py-1.5 rounded-lg uppercase">Kamera</button>
                    </div>
                  </div>
                )}
                <input type="file" ref={galleryInputRef} className="hidden" onChange={handleFile} accept="image/*" />
                <input type="file" ref={cameraInputRef} className="hidden" onChange={handleFile} accept="image/*" capture="environment" />
             </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center">
                   <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-2 text-[10px]">2</span> Deskripsi
                </h2>
                <button onClick={improvePrompt} disabled={!prompt || improvingPrompt} className="text-[9px] font-black text-indigo-600 flex items-center gap-1 hover:underline disabled:opacity-30 uppercase">
                  {improvingPrompt ? <RefreshCw className="animate-spin" size={12} /> : <Wand2 size={12} />} AI Optimize ✨
                </button>
             </div>
             <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full h-24 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs outline-none focus:ring-1 focus:ring-indigo-200 resize-none font-medium" placeholder="Jelaskan produk Anda (Cth: Botol parfum mewah di atas meja kayu)..." />
          </div>

          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-5">
             <h2 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center">
               <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-2 text-[10px]">3</span> Studio Konfigurasi
             </h2>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1"><Palette size={10}/> Gaya Mockup</label>
                 <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                    {MOCKUP_STYLES.map(s => <option key={s}>{s}</option>)}
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1"><Frame size={10}/> Rasio Tampilan</label>
                 <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                    {ASPECT_RATIOS.map(r => <option key={r}>{r}</option>)}
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1"><Sun size={10}/> Pencahayaan</label>
                 <select value={lighting} onChange={(e) => setLighting(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                    <option>Terang</option><option>Gelap / Moody</option><option>Natural Daylight</option><option>Neon / Vibrant</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1"><Columns size={10}/> Jumlah Variasi</label>
                 <select value={variationCount} onChange={(e) => setVariationCount(parseInt(e.target.value))} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                    {RESULT_VARIATIONS.map(v => <option key={v} value={v}>{v} Hasil Render</option>)}
                 </select>
               </div>
             </div>
             <button onClick={generateAllMockups} disabled={loading || !sourceImage} className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg hover:bg-indigo-700 disabled:bg-slate-200 transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                {loading ? <RefreshCw className="animate-spin" /> : <><Sparkles size={16} /> Mulai Render Produk</>}
             </button>
          </div>
        </div>

        <div className="lg:col-span-7">
           <div className="bg-slate-100/50 rounded-[2.5rem] p-6 md:p-8 min-h-[600px] flex flex-col">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Hasil Render Studio</h2>
              
              {!loading && results.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-20 text-slate-400">
                  <ImageIcon size={64} className="mb-4" />
                  <p className="font-black uppercase tracking-widest text-sm text-center">Belum Ada Hasil Render.<br/>Siapkan input dan klik tombol render.</p>
                </div>
              )}
              
              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                  <div className="relative mb-6">
                    <RefreshCw className="animate-spin text-indigo-600" size={64} />
                    <Sparkles className="absolute -top-4 -right-4 text-orange-400 animate-pulse" size={32} />
                  </div>
                  <p className="font-black uppercase tracking-[0.3em] text-[10px] text-indigo-600 animate-pulse">Menghasilkan {variationCount} Variasi...</p>
                  <p className="text-[9px] text-slate-400 mt-2 font-medium">Mohon tunggu, AI sedang menyempurnakan visual.</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {results.map((url, i) => (
                  <div key={i} className="group relative aspect-square bg-white rounded-[2rem] overflow-hidden shadow-sm border border-white p-1 transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="w-full h-full rounded-[1.8rem] overflow-hidden">
                      <img src={url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                       <button onClick={() => onZoom(url)} className="p-4 bg-white rounded-2xl text-indigo-600 shadow-2xl hover:scale-110 transition-transform"><ZoomIn size={22} /></button>
                       <button onClick={() => { const a = document.createElement('a'); a.href = url; a.download = `mockup-${i}.png`; a.click(); }} className="p-4 bg-white rounded-2xl text-indigo-600 shadow-2xl hover:scale-110 transition-transform"><Download size={22} /></button>
                    </div>
                  </div>
                ))}
              </div>

              {results.length > 0 && !loading && (
                <button onClick={() => setResults([])} className="mt-8 mx-auto text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-2">
                  <RotateCcw size={14}/> Bersihkan Galeri
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Component: VECTOR & 3D STUDIO ---
const VectorStudio = ({ onZoom }) => {
  const [prompt, setPrompt] = useState("");
  const [dimension, setDimension] = useState("2D Flat Vector");
  const [style, setStyle] = useState("Minimalis Koorporat");
  const [colorMode, setColorMode] = useState("Full Color");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const dimensionOptions = ["2D Flat Vector", "2D Line Art", "3D Isometric", "3D Clay Render", "3D Realistic"];
  const styleOptions = ["Minimalis Koorporat", "Pop Art Vibrant", "Lucu / Maskot", "Elegan Mewah", "Retro / Vintage"];
  
  // Menambahkan opsi "Hanya Garis/Line Art"
  const colorOptions = ["Full Color", "Monokrom (Hitam Putih)", "Dua Warna Dominan", "Hanya Garis/Line Art (Hitam Putih Murni)"];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast("Tolong tuliskan objek apa yang ingin dibuat ya Bosku!");
      return;
    }
    setLoading(true);
    setResults([]);
    setError(null);

    const is3D = dimension.includes("3D");
    const isLineArtOnly = colorMode === "Hanya Garis/Line Art (Hitam Putih Murni)";

    // Logika kustom untuk Line Art agar AI benar-benar merender garis hitam putih yang bersih
    const colorInstruction = isLineArtOnly 
      ? "STRICTLY pure black and white line art coloring ONLY. NO shading, NO greyscale, NO other colors, just solid black outlines on a pure white background."
      : `color scheme: ${colorMode}`;

    const basePrompt = is3D 
      ? `A highly detailed ${dimension} illustration of ${prompt}, style: ${style}, ${colorInstruction}. 8k resolution, octane render, pristine solid white background, isolated object, studio lighting.`
      : `A clean, professional ${dimension} illustration of ${prompt}, style: ${style}, ${colorInstruction}. Vector art style, flat solid colors, no gradients, sharp SVG-like clean edges, simple white background, isolated object.`;

    try {
      const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instances: [{ prompt: basePrompt }], parameters: { sampleCount: 4 } })
      });

      const images = response.predictions.map(p => `data:image/png;base64,${p.bytesBase64Encoded}`);
      setResults(images);
    } catch (err) {
      setError("Gagal merender ilustrasi. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const downloadTransparentPNG = (url, i) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      // 1. UPSCALE 4X LIPAT UNTUK KETAJAMAN EKSTRA
      const scaleFactor = 4; 
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;
      const ctx = canvas.getContext('2d');
      
      // Mengaktifkan penghalusan resolusi tinggi saat menggambar
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 2. ALGORITMA ANTI-ALIASING SOFT-EDGE TRANSPARENCY
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let j = 0; j < data.length; j += 4) {
        const r = data[j];
        const g = data[j + 1];
        const b = data[j + 2];
        
        // Menghitung tingkat kecerahan piksel (Brightness)
        const brightness = (r + g + b) / 3;
        
        if (brightness > 245) {
          // Jika sangat putih (Background utama), hapus total (Alpha = 0)
          data[j + 3] = 0; 
        } else if (brightness > 235) {
          // Jika warna mendekati putih (Tepi Objek/Glow), buat efek semi-transparan (Anti-Aliasing)
          // Mengurangi opacity secara gradual agar tepi tidak bergerigi (jagged)
          const alpha = Math.floor(((245 - brightness) / 10) * 255);
          data[j + 3] = alpha;
        }
      }
      
      ctx.putImageData(imageData, 0, 0);

      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `vector-HD-transparent-${i}.png`;
      a.click();
      
      showToast("Berhasil! PNG HD (4x Upscale) Transparan dengan Anti-Aliasing diunduh.");
    };
    img.src = url;
  };

  const downloadSVG = (url, i) => {
    // Kita lakukan upscale juga untuk image yang disisipkan di dalam SVG
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const scaleFactor = 4;
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;
      const ctx = canvas.getContext('2d');
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const highResUrl = canvas.toDataURL('image/png');

      const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
  <image href="${highResUrl}" width="100%" height="100%"/>
</svg>`;
      const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `vector-studio-HD-${i}.svg`;
      a.click();
      URL.revokeObjectURL(blobUrl);
      showToast("File SVG HD (4x Upscale) berhasil diunduh!");
    };
    img.src = url;
  };

  const alertCDR = () => {
    showToast("Info: Format file .CDR (CorelDraw) bersifat eksklusif. Gunakan tombol [Unduh SVG], lalu import ke CorelDraw dengan mudah!");
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      {toastMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] bg-purple-600/95 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(147,51,234,0.4)] flex items-center gap-3 border border-purple-500 animate-[bounce_0.3s_ease-in-out]">
          <Info size={24} className="shrink-0" />
          <p className="font-bold text-sm md:text-base">{toastMessage}</p>
        </div>
      )}

      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-xl mb-4 text-white shadow-lg">
          <PenTool size={24} />
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-800 uppercase">Vector & <span className="text-purple-600">3D Studio</span></h1>
        <p className="text-slate-500 font-medium text-sm mt-2 max-w-2xl mx-auto">Ciptakan ilustrasi Vektor 2D atau Render 3D untuk kebutuhan promosi. Ekspor siap pakai dalam PNG HD & SVG (Support CorelDraw).</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
             <h2 className="text-[10px] font-black text-purple-600 mb-4 uppercase tracking-widest flex items-center">
               <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center mr-2 text-[10px]">1</span> Deskripsi Ilustrasi
             </h2>
             <textarea 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-200 resize-none font-medium" 
                placeholder="Contoh: Robot futuristik mengantarkan kotak paket, gaya minimalis, latar belakang putih bersih..." 
             />
          </div>

          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-5">
             <h2 className="text-[10px] font-black text-purple-600 uppercase tracking-widest flex items-center">
               <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center mr-2 text-[10px]">2</span> Dapur Pacu Visual
             </h2>
             
             <div className="space-y-4">
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1"><Hexagon size={12}/> Tipe Grafis (Dimensi)</label>
                 <select value={dimension} onChange={(e) => setDimension(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                    {dimensionOptions.map(o => <option key={o}>{o}</option>)}
                 </select>
               </div>
               
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1"><Layers size={12}/> Gaya / Style</label>
                 <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                    {styleOptions.map(o => <option key={o}>{o}</option>)}
                 </select>
               </div>

               <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1"><Palette size={12}/> Tema Warna</label>
                 <select value={colorMode} onChange={(e) => setColorMode(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                    {colorOptions.map(o => <option key={o}>{o}</option>)}
                 </select>
               </div>
             </div>

             <button onClick={handleGenerate} disabled={loading || !prompt} className="w-full py-4 mt-4 bg-purple-600 text-white font-black rounded-2xl shadow-lg hover:bg-purple-700 disabled:bg-slate-200 disabled:shadow-none transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                {loading ? <RefreshCw className="animate-spin" /> : <><Sparkles size={16} /> Ciptakan Vektor</>}
             </button>
          </div>
        </div>

        <div className="lg:col-span-7">
           <div className="bg-slate-100/50 rounded-[2.5rem] p-6 md:p-8 min-h-[600px] flex flex-col">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Hasil Render Studio</h2>
              
              {!loading && results.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-20 text-slate-400">
                  <PenTool size={64} className="mb-4" />
                  <p className="font-black uppercase tracking-widest text-sm text-center">Belum Ada Hasil Render.<br/>Siapkan ide dan klik tombol ciptakan.</p>
                </div>
              )}
              
              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                  <div className="relative mb-6">
                    <RefreshCw className="animate-spin text-purple-600" size={64} />
                    <Sparkles className="absolute -top-4 -right-4 text-pink-400 animate-pulse" size={32} />
                  </div>
                  <p className="font-black uppercase tracking-[0.3em] text-[10px] text-purple-600 animate-pulse">Menghasilkan 4 Variasi...</p>
                  <p className="text-[9px] text-slate-400 mt-2 font-medium">Mohon tunggu, AI sedang merender {dimension}.</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {results.map((url, i) => (
                  <div key={i} className="group relative aspect-square bg-white rounded-[2rem] overflow-hidden shadow-sm border border-white p-1 transition-all hover:shadow-xl hover:-translate-y-1">
                    {/* Background checkerboard CSS untuk menunjukkan kalau hasil aslinya transparan jika di-overlay */}
                    <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYBCDAzEBlNM/BgwQDIwMIwDDA1pAQAApQoGFbUvEwAAAABJRU5ErkJggg==')] flex items-center justify-center">
                      <img src={url} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 bg-white" />
                    </div>
                    
                    {/* Hover Overlay Container */}
                    <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[3px] p-4">
                       
                       <button onClick={() => onZoom(url)} className="p-3 bg-white/20 hover:bg-white text-white hover:text-purple-600 rounded-2xl shadow-xl transition-all flex items-center gap-2 w-full justify-center font-bold text-xs uppercase tracking-widest backdrop-blur-md">
                         <ZoomIn size={16} /> Pratinjau
                       </button>

                       <div className="flex w-full gap-2">
                         {/* Tombol PNG dengan fungsi Transparansi Otomatis */}
                         <button onClick={() => downloadTransparentPNG(url, i)} title="Unduh format PNG HD (Transparan otomatis)" className="flex-1 p-3 bg-blue-500 text-white rounded-2xl shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-1 font-bold text-[9px] uppercase tracking-wider text-center">
                           <FileImage size={18} /> PNG<br/>(HD)
                         </button>
                         <button onClick={() => downloadSVG(url, i)} title="Unduh format SVG HD (Standard Vector)" className="flex-1 p-3 bg-orange-500 text-white rounded-2xl shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-1 font-bold text-[9px] uppercase tracking-wider">
                           <LayoutTemplate size={18} /> SVG<br/>(HD)
                         </button>
                         <button onClick={alertCDR} title="Unduh format CDR (CorelDraw)" className="flex-1 p-3 bg-green-600 text-white rounded-2xl shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-1 font-bold text-[9px] uppercase tracking-wider">
                           <PenTool size={18} /> CDR
                         </button>
                       </div>

                    </div>
                  </div>
                ))}
              </div>

              {results.length > 0 && !loading && (
                <button onClick={() => setResults([])} className="mt-8 mx-auto text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-2">
                  <RotateCcw size={14}/> Bersihkan Galeri
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};


// --- Component: SUPER MAREM ENGINE (Hard-Selling Prompt Architect) ---
const SuperMaremEngine = () => {
  const [product, setProduct] = useState('');
  const [hook, setHook] = useState('');
  const [price, setPrice] = useState('');
  const [callouts, setCallouts] = useState(['', '', '']);
  const [cta, setCta] = useState('');
  const [theme, setTheme] = useState('joy');
  
  const [paletteMode, setPaletteMode] = useState('preset'); 
  const [palette, setPalette] = useState('urgencyWarning');
  const [customColors, setCustomColors] = useState('');
  
  const [ratio, setRatio] = useState('9:16');
  const [spatialLayout, setSpatialLayout] = useState('zPattern');
  const [useRealPhoto, setUseRealPhoto] = useState(false);
  
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGeneratingCallouts, setIsGeneratingCallouts] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const showError = (msg) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(''), 3500); 
  };

  const themeOptions = {
    savory: { name: '1. Ruh Kelezatan (Makanan)', camera: '[C4 FOOD MACRO CINEMATIC]', style: '[S5 CINEMATIC FOOD PHOTOGRAPHY] Tekstur makro, minyak berkilau, saus lumer, asap tipis.', lighting: '[LGT4 WARM APPETITE FOOD LIGHTING] Warm tone, glossy highlights.', negative: 'mentah, pucat, dingin, biru, layu, plastik' },
    freshness: { name: '2. Ruh Kesegaran (Minuman/Mentah)', camera: '[C1 PREMIUM PRODUCT STUDIO SHOT]', style: '[S3 HYPER-REALISTIC PRODUCT] Elemen basah, es batu, embun, reflektif bersih.', lighting: '[LGT1 SOFT STUDIO COMMERCIAL LIGHTING] Cool tone, pristine reflections.', negative: 'panas, asap, kering, layu, warm lighting' },
    auto_daily: { name: '3A. Kemewahan: Otomotif (Daily)', camera: '[C2 CINEMATIC HERO ANGLE]', style: '[S8 AUTOMOTIVE HIGH CONTRAST] Realistic automotive photography, jalan aspal siang hari yang realistis.', lighting: '[LGT10 BILLBOARD DAYLIGHT VISIBILITY] Clean Bright Daylight. NO dark shadows.', negative: 'malam hari, aspal basah, studio gelap, muddy shadows' },
    auto_racing: { name: '3B. Kemewahan: Otomotif (Racing)', camera: '[C8 DYNAMIC ACTION TRACKING SHOT]', style: '[S8 AUTOMOTIVE HIGH CONTRAST] Aggressive cinematic automotive, aspal premium, motion blur.', lighting: '[LGT11 AUTOMOTIVE METALLIC REFLECTION] Cinematic spotlight, aggressive contrast.', negative: 'siang bolong, flat lighting, overexposed, statis' },
    herbal: { name: '3C. Kemewahan: Herbal/Suplemen', camera: '[C1 PREMIUM PRODUCT STUDIO SHOT]', style: '[S9 MEDICAL CLEAN TRUSTWORTHY] Hyper-realistic product, natural ingredients, sterile atmosphere.', lighting: '[LGT8 CLEAN CORPORATE LIGHTING] Clean pristine high-key studio light.', negative: 'kotor, gelap, dramatis, moody, messy' },
    beauty: { name: '3D. Kemewahan: Elegan/Kecantikan', camera: '[C5 BEAUTY SOFT LIGHT PORTRAIT]', style: '[S7 BEAUTY COSMETIC PREMIUM] Elegant beauty advertising, marmer bersih, pori-pori nyata.', lighting: '[LGT6 BEAUTY DIFFUSED GLOW] Pristine soft light, pastel ambiance.', negative: 'kasar, kontras tinggi, hard shadows, over-saturated' },
    professional: { name: '3E. Kemewahan: Profesional/Jasa', camera: '[C9 CLEAN CORPORATE INTERVIEW FRAME]', style: '[S6 CORPORATE MINIMALIST] Clean corporate minimal, arsitektur bersih, elit.', lighting: '[LGT8 CLEAN CORPORATE LIGHTING] Cahaya natural matahari (Bright Natural Daylight).', negative: 'suram, berantakan, neon cyber, cyberpunk' },
    joy: { name: '4. Ruh Keceriaan (Promo/Anak)', camera: '[C1 PREMIUM PRODUCT STUDIO SHOT]', style: '[S2 BOLD POP ART PROMO] Background pop-vibrant, split diagonal, dinamis, energi meledak.', lighting: '[LGT3 HIGH-CONTRAST RETAIL PROMO] Punchy vibrant contrast.', negative: 'gelap, moody, suram, desaturated' },
    levitation: { name: '5. Ruh Fashion (Dynamic Levitation)', camera: '[C10 LUXURY EDITORIAL FASHION SHOT]', style: '[S10 FASHION EDITORIAL] Komposisi melayang di udara (anti-gravity), background super bersih.', lighting: '[LGT2 CINEMATIC LUXURY RIM LIGHTING] Pencahayaan dramatis, soft edge glow.', negative: 'tergeletak di lantai, berantakan, flat lighting, di atas meja' },
    zen: { name: '6. Ruh Relaksasi (Zen Healing)', camera: '[C1 PREMIUM PRODUCT STUDIO SHOT]', style: '[S9 MINIMAL LUXURY] Minimalist zen, relaxing and calming atmosphere.', lighting: '[LGT1 SOFT STUDIO COMMERCIAL] Warm ambient / dim studio light yang menenangkan jiwa.', negative: 'kontras tinggi, silau, agresif, neon, tajam' },
    commercial_space: { name: '7. Ruh Modern Commercial Space', camera: '[C14 ARCHITECTURAL TILT-SHIFT]', style: '[S6 CORPORATE MINIMALIST] Inviting Architectural Space, proporsi realistis.', lighting: '[LGT10 BILLBOARD DAYLIGHT] Premium Bright Daylight.', negative: 'miniatur di atas meja, tilt-shift miniature effect, mainan, makro, shallow DOF' },
    epic_haji: { name: '8A. Pencapaian Epik (Haji/Umroh)', camera: '[C15 AERIAL GODS EYE VIEW]', style: '[S6 CORPORATE MINIMALIST] Majestic scale, spiritual atmosphere, premium elegance.', lighting: '[LGT12 ISLAMIC ELEGANT SPIRITUAL] Pristine divine lighting (cahaya suci nan agung).', negative: 'gelap, seram, neon cyber, kotor, cheap CGI' },
    epic_travel: { name: '8B. Pencapaian Epik (Liburan)', camera: '[C15 AERIAL GODS EYE VIEW]', style: '[S3 HYPER-REALISTIC PRODUCT] Cinematic Wanderlust, skala epik alam.', lighting: '[LGT9 GOLDEN HOUR LIFESTYLE] Extremely bright sunny sky, golden hour highlights.', negative: 'mendung, hujan, flat lighting, suram' },
    epic_edu: { name: '8C. Pencapaian Epik (Pendidikan)', camera: '[C9 CLEAN CORPORATE INTERVIEW FRAME]', style: '[S6 CORPORATE MINIMALIST] Hopeful, inspiring, academic prestige.', lighting: '[LGT9 GOLDEN HOUR LIFESTYLE] Golden hour of hope, warm directional light.', negative: 'suram, putus asa, gelap, chaotic' },
    literacy: { name: '9. Ruh Literasi & Scholar', camera: '[C1 PREMIUM PRODUCT STUDIO SHOT]', style: '[S1 PREMIUM LUXURY COMMERCIAL] Intellectual Luxury, modern elegan.', lighting: '[LGT12 ISLAMIC ELEGANT SPIRITUAL] Premium modern studio light, clean.', negative: 'vibe kuno, perpustakaan berdebu, magic glow, fantasy particles, vintage, old books' }
  };

  const paletteOptions = {
    executiveBlue: { group: 'Corporate/Data', name: 'Executive Blue (Otoritas & Stabil)', colors: 'Deep Navy (#002147), Classic Blue (#0056B3), Slate Grey, Accent Gold, Background White' },
    cleanMedical: { group: 'Corporate/Data', name: 'Clean Medical (Steril & Menang)', colors: 'Deep Teal (#008B8B), Soft Mint (#B2DFDB), Light Grey, Pure White' },
    modernMinimalist: { group: 'Corporate/Data', name: 'Modern Minimalist (Fokus Data)', colors: 'Obsidian Black (#1A1A1A), Cool Grey, Silver, Pure White' },
    ecoSustainability: { group: 'Corporate/Data', name: 'Eco-Sustainability (Alam)', colors: 'Forest Green (#2D5A27), Sage Green, Earth Brown, Cream' },
    urgencyWarning: { group: 'High-Conversion', name: 'Urgency Warning (Agresif Promo)', colors: 'Bold Red (#D32F2F), Caution Yellow (#FFEB3B), Deep Black, Paper White' },
    vibrantPop: { group: 'High-Conversion', name: 'Vibrant Pop (Gen-Z)', colors: 'Electric Orange (#FF6D00), Hot Pink, Bright Yellow, Purple Punch' },
    luxuryPremium: { group: 'High-Conversion', name: 'Luxury Premium (Eksklusif)', colors: 'Matte Black (#212121), Champagne Gold (#D4AF37), Silver Lining, Deep Charcoal' },
    cyberpunkNeon: { group: 'Modern Tech', name: 'Cyberpunk Neon (Energi Malam)', colors: 'Deep Space (#0B0E11), Neon Cyan, Magenta, Electric Purple' },
    darkModePro: { group: 'Modern Tech', name: 'Dark Mode Pro (Elegan Nyaman)', colors: 'Dark Charcoal (#121212), Border Blue, Text White, Ghost Grey' },
    glassmorphism: { group: 'Modern Tech', name: 'Glassmorphism (Masa Depan)', colors: 'Frost Blue (#A9D1E1), Pale Lilac, Sky White, Translucent Glass' },
    earthTones: { group: 'Organic/Lifestyle', name: 'Earth Tones (Hangat Membumi)', colors: 'Terracotta (#E2725B), Deep Sage, Sand Beige, Warm Cream' },
    softPastel: { group: 'Organic/Lifestyle', name: 'Soft Pastel (Lembut Feminin)', colors: 'Dusty Rose (#D4A5A5), Soft Lilac, Sage Mint, Vanilla' },
    vintageRetro: { group: 'Organic/Lifestyle', name: 'Vintage Retro (Nostalgia 90s)', colors: 'Muted Orange (#E67E22), Teal Blue, Mustard, Sepia Background' },
  };

  const layoutOptions = {
    zPattern: {
      name: 'Z-Pattern (Klasik Menyebar)',
      structure: `SECTION 1 (HOOK): Positioned Top-Left or Top-Center.\nSECTION 2 (HERO PRODUCT): Positioned Center.\nSECTION 3 (PRICE BADGE): Floating near product.\nSECTION 4 (CALLOUT BADGES): Scattered dynamically around product.\nSECTION 5 (CTA): Positioned Bottom-Right or Bottom-Center.`
    },
    asymmetrical: {
      name: 'Asymmetrical Split (Belah Samping)',
      structure: `SECTION 1 (HERO PRODUCT): Dominates the Left or Right half of the composition. Very large scale.\nSECTION 2 (HOOK): Dominates the opposite side.\nSECTION 3 (PRICE & CALLOUTS): Vertically stacked below the hook on the text side.\nSECTION 4 (CTA): Anchored at the bottom of the text side.`
    },
    centralFocus: {
      name: 'Central Burst (Fokus Tengah)',
      structure: `SECTION 1 (HERO PRODUCT): Perfectly centered. Massive scale.\nSECTION 2 (HOOK): Giant typography directly Above the product.\nSECTION 3 (CTA): Giant typography directly Below the product.\nSECTION 4 (PRICE & CALLOUT BADGES): Orbiting around the central product like satellites.`
    }
  };

  const fetchWithBackoff = async (url, options, retries = 5) => {
    const delays = [1000, 2000, 4000, 8000, 16000];
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delays[i]));
      }
    }
  };

  const handleGenerate = () => {
    if (!product.trim() || !hook.trim()) {
      showError('Tolong isi minimal kolom "Hero Product" dan "Hook / Promosi" ya Bosku!');
      return;
    }

    const selectedTheme = themeOptions[theme];
    const activeColors = paletteMode === 'preset' ? paletteOptions[palette].colors : customColors;
    const activePaletteName = paletteMode === 'preset' ? paletteOptions[palette].name : 'Custom User Palette';
    const selectedLayout = layoutOptions[spatialLayout];
    
    const baseNegative = "3D text, neon text glow, dull colors, blurry product, misspelled text, gibberish typography, chaotic layout, low contrast, muddy shadows, overlapping elements, fake elements, cheap CGI, boring centered text";
    const finalNegative = useRealPhoto 
      ? `${baseNegative}, ${selectedTheme.negative}, any product, objects on podium, item in center, fake items` 
      : `${baseNegative}, ${selectedTheme.negative}`;

    const heroSection = useRealPhoto 
      ? `A premium, hyper-realistic EMPTY display podium, stage, or clear negative space. STRICTLY NO PRODUCTS. This area must remain completely empty, perfectly lit, waiting for a real product photo.`
      : `Ultra-realistic, premium commercial shot of: ${product}. The product is huge, isolated, perfectly lit, breaking out of its background for a 3D pop effect.`;

    const calloutsText = callouts.filter(c => c.trim() !== '').map((c) => `- "${c}"`).join('\n');

    const prompt = `MASTER PROMPT ADS: DIRECT RESPONSE HARD-SELL
ASPECT RATIO: ${ratio}

[MANDATORY ENGINE PRIORITY LOCK SYSTEM]
1. CAMERA ENGINE: ${selectedTheme.camera} Absolute foundation.
2. DOMAIN LOGIC: Commercial Advertising / Hard Selling Product.
3. LAYOUT ENGINE: [${selectedLayout.name}] Spatial distribution priority.
4. STYLE ENGINE: ${selectedTheme.style}
5. LIGHTING ENGINE: ${selectedTheme.lighting}
6. HIERARCHY ENGINE: [VH1 HEADLINE DOMINANCE] + [VH3 CTA VISIBILITY].
7. CONVERSION ENGINE: [CP12 DIRECT RESPONSE SALES ENGINE] + [CP1 ATTENTION HOOK].

[PALETTE ENGINE: ${activePaletteName}]
Strict Color Rules: ${activeColors}. 
Ensure colors map intelligently to typography, backgrounds, and accents to support readability.

[DYNAMIC SPATIAL COMPOSITION: ${selectedLayout.name}]
${selectedLayout.structure}

CONTENT TO RENDER:
- HOOK / MAIN TITLE: "${hook}"
- HERO SUBJECT: ${heroSection}
${price.trim() ? `- PRICE BADGE: "${price}"` : ''}
${calloutsText ? `- CALLOUT BADGES: \n${calloutsText}` : ''}
${cta.trim() ? `- CTA BUTTON: "${cta}"` : ''}

[MANDATORY ADVANCED MODIFIERS]
- HIERARCHY & EDITORIAL COMPOSITION: Perfect typography clarity. No overlapping text. Strong focal isolation. Mobile-first readability. Ensure the dynamic spatial composition is strictly followed.
- SMART RENDER & ARTIFACT CONTROL: 8K resolution graphic design. Zero misspelled words. Correct spelling is absolute priority.

NEGATIVE PROMPT:
${finalNegative}.`;

    setGeneratedPrompt(prompt);
    setCopied(false);
  };

  const handleReset = () => {
    setProduct('');
    setHook('');
    setPrice('');
    setCallouts(['', '', '']);
    setCta('');
    setTheme('joy');
    setPaletteMode('preset');
    setPalette('urgencyWarning');
    setCustomColors('');
    setRatio('9:16');
    setSpatialLayout('zPattern');
    setUseRealPhoto(false);
    
    setGeneratedPrompt('');
    setCopied(false);
  };

  const generateAI = async () => {
    if (!product.trim()) {
      showError('Tolong isi dulu nama produknya ya Bosku, biar AI tahu mau mikirin keunggulan apa.');
      return;
    }
    setIsGeneratingCallouts(true);
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
      const promptText = `Berikan 3 hingga maksimal 5 USP (Unique Selling Propositions) atau keunggulan produk untuk: "${product}". Setiap USP harus sangat singkat, maksimal 4 kata. Bahasa Indonesia yang menjual (hard-selling). Berikan HANYA array string JSON.`;
      
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "ARRAY",
              items: { type: "STRING" }
            }
          }
        })
      };

      const data = await fetchWithBackoff(url, options);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        let parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          setCallouts(parsed.slice(0, 5));
        }
      }
    } catch (error) {
      console.error("AI Generation failed:", error);
      showError("Gagal meracik Callout otomatis. Coba sekali lagi ya!");
    } finally {
      setIsGeneratingCallouts(false);
    }
  };

  const handleCalloutChange = (index, value) => {
    const newCallouts = [...callouts];
    newCallouts[index] = value;
    setCallouts(newCallouts);
  };

  const addCallout = () => {
    if (callouts.length < 5) setCallouts([...callouts, '']);
  };

  const removeCallout = (index) => {
    setCallouts(callouts.filter((_, i) => i !== index));
  };

  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = generatedPrompt;
    textArea.style.position = "absolute";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy gagal', err);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-[2.5rem] w-full h-full overflow-y-auto custom-scrollbar p-4 md:p-8 font-sans relative animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-xl border border-slate-800">
      
      {errorMessage && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 bg-red-600/95 backdrop-blur-md text-white px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(220,38,38,0.4)] flex items-center gap-3 border border-red-500 animate-[bounce_0.3s_ease-in-out]">
          <AlertCircle size={24} className="shrink-0" />
          <p className="font-bold text-sm md:text-base">{errorMessage}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        <div className="text-center space-y-2 mt-4">
          <div className="inline-flex items-center justify-center p-3 bg-yellow-500/10 text-yellow-500 rounded-full mb-4">
            <Zap size={32} className="fill-yellow-500" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
            SUPER MAREM <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">ENGINE</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
            Generator Master Prompt spesialis Hard-Selling. Didukung oleh <strong>7-Layer Priority Engine</strong> & <strong>Library Palette Infografis</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 xl:col-span-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 border-b border-slate-700 pb-4 text-white">
              <Crosshair className="text-yellow-500" />
              Parameter Konversi
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <ImageIcon size={16} className="text-blue-400" />
                  Hero Product <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all placeholder:text-slate-600"
                  placeholder="Misal: Sepatu Sneakers Pria"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Sparkles size={16} className="text-orange-400" />
                  Hook / Promosi Utama <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={hook}
                  onChange={(e) => setHook(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all uppercase placeholder:text-slate-600"
                  placeholder="Misal: DISKON GILA 50%"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Tag size={16} className="text-yellow-400" />
                  Harga Produk
                </label>
                <input 
                  type="text" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-yellow-400 font-bold focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all placeholder:text-yellow-700/50"
                  placeholder="Misal: Cuma Rp 99.000"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Target size={16} className="text-green-400" />
                    Callout (Maks 5)
                  </label>
                  <button 
                    onClick={generateAI}
                    disabled={isGeneratingCallouts || !product.trim()}
                    className="text-xs flex items-center gap-1 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 hover:text-indigo-300 px-3 py-1.5 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingCallouts ? <Loader2 size={14} className="animate-spin" /> : <Bot size={14} />}
                    {isGeneratingCallouts ? 'MERACIK...' : 'AUTO AI'}
                  </button>
                </div>
                
                <div className="space-y-2">
                  {callouts.map((c, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={c}
                        onChange={(e) => handleCalloutChange(index, e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all text-sm placeholder:text-slate-600"
                        placeholder={`Keunggulan ${index + 1} (Misal: Anti Slip)`}
                      />
                      {callouts.length > 1 && (
                        <button 
                          onClick={() => removeCallout(index)}
                          className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-all"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {callouts.length < 5 && (
                    <button 
                      onClick={addCallout}
                      className="w-full mt-2 py-3 border-2 border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold text-sm"
                    >
                      <Plus size={16} /> TAMBAH KEUNGGULAN
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Zap size={16} className="text-red-400" />
                  Call to Action (CTA)
                </label>
                <input 
                  type="text" 
                  value={cta}
                  onChange={(e) => setCta(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all font-bold uppercase placeholder:text-slate-600"
                  placeholder="Misal: BELI SEKARANG"
                />
              </div>

              <div className="pt-4 border-t border-slate-700/50 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                    <Crosshair size={16} className="text-indigo-400" />
                    Ruh Penjualan
                  </label>
                  <select 
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 appearance-none text-sm"
                  >
                    {Object.entries(themeOptions).map(([key, opt]) => (
                      <option key={key} value={key}>{opt.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3 bg-slate-900/30 p-4 rounded-xl border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <Palette size={16} className="text-pink-400" />
                      Palette Engine
                    </label>
                    <div className="flex bg-slate-800 rounded-lg p-1">
                      <button 
                        onClick={() => setPaletteMode('preset')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${paletteMode === 'preset' ? 'bg-pink-500/20 text-pink-400' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        <ListOrdered size={14} /> Preset
                      </button>
                      <button 
                        onClick={() => setPaletteMode('custom')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${paletteMode === 'custom' ? 'bg-pink-500/20 text-pink-400' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        <Edit3 size={14} /> Custom
                      </button>
                    </div>
                  </div>

                  {paletteMode === 'preset' ? (
                    <select 
                      value={palette}
                      onChange={(e) => setPalette(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 appearance-none text-sm"
                    >
                      <optgroup label="KATEGORI 1: Corporate & Trust">
                        {Object.entries(paletteOptions).filter(([k,v]) => v.group === 'Corporate/Data').map(([key, opt]) => (
                          <option key={key} value={key}>{opt.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="KATEGORI 2: High-Conversion">
                        {Object.entries(paletteOptions).filter(([k,v]) => v.group === 'High-Conversion').map(([key, opt]) => (
                          <option key={key} value={key}>{opt.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="KATEGORI 3: Modern Tech">
                        {Object.entries(paletteOptions).filter(([k,v]) => v.group === 'Modern Tech').map(([key, opt]) => (
                          <option key={key} value={key}>{opt.name}</option>
                        ))}
                      </optgroup>
                      <optgroup label="KATEGORI 4: Organic & Lifestyle">
                        {Object.entries(paletteOptions).filter(([k,v]) => v.group === 'Organic/Lifestyle').map(([key, opt]) => (
                          <option key={key} value={key}>{opt.name}</option>
                        ))}
                      </optgroup>
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      value={customColors}
                      onChange={(e) => setCustomColors(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all text-sm placeholder:text-slate-600"
                      placeholder="Ketik warnamu: misal Hex, Merah & Emas..."
                    />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                      <Layout size={16} className="text-sky-400" />
                      Spatial Layout
                    </label>
                    <select 
                      value={spatialLayout}
                      onChange={(e) => setSpatialLayout(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 appearance-none text-sm"
                    >
                      {Object.entries(layoutOptions).map(([key, opt]) => (
                        <option key={key} value={key}>{opt.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300">Aspect Ratio</label>
                    <select 
                      value={ratio}
                      onChange={(e) => setRatio(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 appearance-none text-sm"
                    >
                      <option value="9:16">9:16 (Tiktok)</option>
                      <option value="1:1">1:1 (Feed)</option>
                      <option value="16:9">16:9 (YouTube)</option>
                      <option value="4:5">4:5 (IG Portrait)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 mt-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={useRealPhoto}
                        onChange={(e) => setUseRealPhoto(e.target.checked)}
                        className="sr-only" 
                      />
                      <div className={`block w-14 h-8 rounded-full transition-colors ${useRealPhoto ? 'bg-green-500' : 'bg-slate-700'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${useRealPhoto ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <Frame size={16} className={useRealPhoto ? "text-green-400" : "text-slate-400"} />
                        Mode Template Canva
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Kosongkan tengah untuk foto asli.</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={handleReset}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-4 rounded-xl border border-slate-700 transition-all active:scale-[0.98] flex items-center justify-center"
                  title="Reset ke Kosong"
                >
                  <RotateCcw size={20} />
                </button>
                <button 
                  onClick={handleGenerate}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white font-bold text-sm md:text-lg py-4 rounded-xl shadow-lg shadow-orange-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Sparkles size={20} />
                  GENERATE PROMPT
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 xl:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-inner relative flex flex-col h-full min-h-[600px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                <h2 className="text-xl font-bold text-slate-200">Terminal Output AI</h2>
              </div>
              {generatedPrompt && (
                <button 
                  onClick={copyToClipboard}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-md ${
                    copied 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                    : 'bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white border border-slate-600'
                  }`}
                >
                  {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  {copied ? 'BERHASIL DICOPY!' : 'COPY PROMPT'}
                </button>
              )}
            </div>

            <div className="flex-1 flex flex-col relative group">
              {generatedPrompt ? (
                <textarea 
                  readOnly
                  value={generatedPrompt}
                  className="w-full h-full absolute inset-0 bg-slate-900/50 border border-slate-800 rounded-xl p-5 text-[13px] md:text-sm font-mono text-slate-300 focus:outline-none resize-none custom-scrollbar leading-relaxed"
                />
              ) : (
                <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800/50 rounded-xl bg-slate-900/20">
                  <Target size={56} className="mb-4 opacity-30" />
                  <p className="font-semibold text-lg text-slate-500">Terminal Prompt Ready.</p>
                  <p className="text-sm opacity-70 mt-2 max-w-sm text-center">Isi minimal <strong>Hero Product</strong> dan <strong>Hook Utama</strong> di kiri, lalu klik "GENERATE PROMPT".</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App: Integrated with Sidebar ---
const App = () => {
  const [activeTab, setActiveTab] = useState('restore'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);

  const handleOpenZoom = (url) => {
    setPreviewUrl(url);
    setZoomScale(1);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-white transition-transform duration-300 lg:relative lg:translate-x-0 flex-shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col p-6">
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <LayoutGrid size={24} />
            </div>
            <div>
              <h2 className="font-black uppercase tracking-tighter text-lg leading-tight">AI Studio</h2>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Creative Suite</span>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            <button 
              onClick={() => setActiveTab('restore')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all group ${activeTab === 'restore' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Wand2 size={20} className={activeTab === 'restore' ? 'text-white' : 'text-slate-600 group-hover:text-indigo-400'} />
              <span className="text-sm font-black uppercase tracking-widest">AI Upscale</span>
            </button>

            <button 
              onClick={() => setActiveTab('mockup')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all group ${activeTab === 'mockup' ? 'bg-orange-600 text-white shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Box size={20} className={activeTab === 'mockup' ? 'text-white' : 'text-slate-600 group-hover:text-orange-400'} />
              <span className="text-sm font-black uppercase tracking-widest">Mockup Engine</span>
            </button>

            <button 
              onClick={() => setActiveTab('logo')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all group ${activeTab === 'logo' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <PencilRuler size={20} className={activeTab === 'logo' ? 'text-white' : 'text-slate-600 group-hover:text-blue-400'} />
              <span className="text-sm font-black uppercase tracking-widest">Logo Studio</span>
            </button>

            <button 
              onClick={() => setActiveTab('vector')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all group ${activeTab === 'vector' ? 'bg-purple-600 text-white shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <PenTool size={20} className={activeTab === 'vector' ? 'text-white' : 'text-slate-600 group-hover:text-purple-400'} />
              <span className="text-sm font-black uppercase tracking-widest">Vector & 3D</span>
            </button>

            <button 
              onClick={() => setActiveTab('supermarem')}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all group ${activeTab === 'supermarem' ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-xl' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Zap size={20} className={activeTab === 'supermarem' ? 'text-white' : 'text-slate-600 group-hover:text-yellow-400'} />
              <span className="text-sm font-black uppercase tracking-widest">Super Marem Ads</span>
            </button>
          </nav>

          <div className="pt-6 border-t border-white/5">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Status Sistem</p>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold">Semua Mesin AI Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-hidden flex flex-col">
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-40 shrink-0">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
            <Menu size={24} />
          </button>
          <h2 className="text-sm font-black uppercase tracking-widest">Creative AI</h2>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {activeTab === 'restore' && <PhotoRestorer onZoom={handleOpenZoom} />}
            {activeTab === 'mockup' && <MockupStudio onZoom={handleOpenZoom} />}
            {activeTab === 'logo' && <LogoStudio onZoom={handleOpenZoom} />}
            {activeTab === 'vector' && <VectorStudio onZoom={handleOpenZoom} />}
            {activeTab === 'supermarem' && <SuperMaremEngine />}
          </div>
        </div>
      </main>

      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity" />
      )}

      {/* GLOBAL ZOOM MODAL */}
      {previewUrl && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-slate-950/98 animate-in fade-in duration-300 backdrop-blur-md">
          <div className="absolute inset-0 z-0" onClick={() => setPreviewUrl(null)} />

          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-center justify-between p-6 text-white bg-slate-900/40 backdrop-blur-sm">
              <h4 className="text-sm font-black tracking-widest uppercase opacity-60">Pemeriksaan Detail</h4>
              <button 
                onClick={() => setPreviewUrl(null)} 
                className="p-3 bg-white/10 hover:bg-red-500/20 hover:text-red-400 rounded-2xl transition-all border border-white/10 flex items-center gap-2"
                title="Tutup Preview"
              >
                <span className="text-[10px] font-bold">TUTUP</span>
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-auto flex items-center justify-center p-4">
              <img 
                src={previewUrl} 
                className="transition-transform duration-200 origin-center drop-shadow-2xl rounded-lg" 
                style={{ transform: `scale(${zoomScale})`, maxWidth: '90%', maxHeight: '90%' }} 
              />
            </div>

            <div className="p-8 flex flex-col items-center gap-4 bg-gradient-to-t from-black to-transparent">
              <div className="flex items-center gap-8 bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/20 shadow-2xl">
                <button onClick={() => setZoomScale(Math.max(0.5, zoomScale - 0.25))} className="text-white hover:text-indigo-400 transition-colors">
                  <Minus size={24} />
                </button>
                <div className="flex flex-col items-center min-w-[120px]">
                  <input 
                    type="range" min="0.5" max="4" step="0.1" 
                    value={zoomScale} 
                    onChange={(e) => setZoomScale(parseFloat(e.target.value))} 
                    className="w-32 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                  />
                  <span className="text-[10px] text-white/50 font-black mt-3 uppercase tracking-widest">Skala: {Math.round(zoomScale * 100)}%</span>
                </div>
                <button onClick={() => setZoomScale(Math.min(4, zoomScale + 0.25))} className="text-white hover:text-indigo-400 transition-colors">
                  <Plus size={24} />
                </button>
              </div>
              <button onClick={() => setZoomScale(1)} className="text-[10px] font-black text-white/30 hover:text-white transition-colors tracking-widest uppercase">Kembalikan ke Normal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;