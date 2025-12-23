import React, { useState } from 'react';
import { VoiceControl } from './components/VoiceControl';
import { InfographicRenderer } from './components/InfographicRenderer';
import { generateInfographicData, optimizeInfographicContent } from './services/geminiService';
import { InfographicData, ChartType } from './types';
import { TEMPLATES, TemplateDefinition } from './data/templates';

// Mock Data for Initial State (Thai Demo)
const MOCK_DATA: InfographicData = {
  title: "กาแฟ vs ชา: พฤติกรรมการดื่ม",
  subtitle: "การเปรียบเทียบพฤติกรรมการบริโภคระดับโลก",
  themeColor: "#8b5cf6", // violet-500
  backgroundColor: "#f8fafc",
  footer: "ที่มา: ดัชนีเครื่องดื่มโลก 2024",
  sections: [
    {
      id: "s1",
      type: ChartType.STAT,
      title: "จำนวนแก้วที่ดื่มต่อวัน (พันล้าน)",
      data: [
        { name: "กาแฟ", value: 2.25 },
        { name: "ชา", value: 3.0 }
      ]
    },
    {
      id: "s2",
      type: ChartType.PIE,
      title: "ส่วนแบ่งการตลาดตามภูมิภาค",
      description: "ความนิยมหลักในทวีปต่างๆ",
      data: [
        { name: "ยุโรป (กาแฟ)", value: 65 },
        { name: "เอเชีย (ชา)", value: 80 },
        { name: "อเมริกา (กาแฟ)", value: 70 },
        { name: "แอฟริกา (ผสม)", value: 50 }
      ]
    },
    {
      id: "s3",
      type: ChartType.BAR,
      title: "ปริมาณคาเฟอีน (มก.)",
      data: [
        { name: "เอสเพรสโซ", value: 63 },
        { name: "กาแฟดริป", value: 95 },
        { name: "ชาดำ", value: 47 },
        { name: "ชาเขียว", value: 28 }
      ]
    }
  ]
};

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'create' | 'templates'>('dashboard');
  const [prompt, setPrompt] = useState('');
  const [infographicData, setInfographicData] = useState<InfographicData>(MOCK_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState("กำลังออกแบบอินโฟกราฟิกของคุณ...");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (inputPrompt: string = prompt) => {
    if (!inputPrompt.trim()) return;
    
    setIsGenerating(true);
    setLoadingText("กำลังออกแบบอินโฟกราฟิกของคุณ...");
    setError(null);
    try {
      const data = await generateInfographicData(inputPrompt);
      setInfographicData(data);
      if (view !== 'create') setView('create');
    } catch (err) {
      setError("ไม่สามารถสร้างอินโฟกราฟิกได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptimize = async () => {
    setIsGenerating(true);
    setLoadingText("กำลังปรับแต่งข้อความด้วย AI...");
    setError(null);
    try {
      const optimizedData = await optimizeInfographicContent(infographicData);
      setInfographicData(optimizedData);
    } catch (err) {
      setError("ไม่สามารถปรับปรุงเนื้อหาได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTemplateSelect = (template: TemplateDefinition) => {
    setInfographicData(template.data);
    setView('create');
    setPrompt(`เทมเพลต: ${template.name}`);
  };

  const handleExport = () => {
    window.print();
  };

  const TemplateCard: React.FC<{ template: TemplateDefinition }> = ({ template }) => (
    <div 
      onClick={() => handleTemplateSelect(template)}
      className="group cursor-pointer rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all border border-slate-200 flex flex-col h-full"
    >
      <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
         <div className={`w-3/4 h-3/4 ${template.thumbnailColor} rounded shadow-inner opacity-80 transform group-hover:scale-105 transition duration-500 flex items-center justify-center`}>
            <span className="text-white font-bold text-lg opacity-90 tracking-widest">ตัวอย่าง</span>
         </div>
      </div>
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-slate-800">{template.name}</h3>
          <p className="text-slate-500 text-sm mt-1">{template.description}</p>
        </div>
        <div className="mt-4 text-indigo-600 text-sm font-medium flex items-center group-hover:underline">
          ใช้เทมเพลตนี้ &rarr;
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setView('dashboard')}>
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold">AG</span>
              </div>
              <span className="font-bold text-xl text-slate-900">Infographic</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={() => setView('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'dashboard' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-700'}`}
              >
                แดชบอร์ด
              </button>
              <button 
                onClick={() => setView('templates')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'templates' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-700'}`}
              >
                คลังเทมเพลต
              </button>
              <button 
                 onClick={() => setView('create')}
                 className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'create' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-slate-700'}`}
              >
                ผู้สร้าง
              </button>
              <div className="h-6 w-px bg-slate-300 mx-2 hidden sm:block"></div>
              <button 
                onClick={() => setView('dashboard')}
                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
              >
                ดูตัวอย่าง
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50">
        {view === 'dashboard' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                เปลี่ยนเสียงของคุณให้เป็น<br/>อินโฟกราฟิกที่สวยงาม
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                เพียงแค่พูดไอเดียของคุณ แล้ว AI Agent จะสร้างภาพให้คุณทันที <br/>ขับเคลื่อนโดย Gemini 2.5 & AntV
              </p>
              
              <div className="max-w-xl mx-auto bg-white p-2 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="เช่น 'เปรียบเทียบยอดขายรถ EV กับรถน้ำมัน ปี 2024'"
                  className="flex-grow p-4 outline-none text-lg text-slate-700 rounded-xl"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                />
                <button 
                  onClick={() => handleGenerate()}
                  disabled={isGenerating}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 min-w-[120px]"
                >
                  {isGenerating ? 'กำลังคิด...' : 'สร้างทันที'}
                </button>
              </div>
              <div className="mt-8">
                 <p className="text-sm text-slate-400 mb-4 font-medium uppercase tracking-wider">หรือลองใช้คำสั่งเสียง</p>
                 <VoiceControl 
                    isProcessing={isGenerating}
                    onTranscript={(text) => {
                      setPrompt(text);
                      handleGenerate(text);
                    }}
                 />
              </div>
            </div>

            {/* Featured Templates */}
            <div className="mt-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">เทมเพลตแนะนำ</h2>
                <button 
                  onClick={() => setView('templates')}
                  className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center"
                >
                  ดูทั้งหมด <span className="ml-1">&rarr;</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {TEMPLATES.slice(0, 3).map((t) => (
                   <TemplateCard key={t.id} template={t} />
                 ))}
              </div>
            </div>
          </div>
        ) : view === 'templates' ? (
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
             <div className="mb-8 text-center">
                <h1 className="text-3xl font-extrabold text-slate-900">คลังเทมเพลต</h1>
                <p className="text-slate-600 mt-2">เลือกจุดเริ่มต้นสำหรับผลงานชิ้นเอกของคุณ</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {TEMPLATES.map((t) => (
                   <TemplateCard key={t.id} template={t} />
                ))}
             </div>
           </div>
        ) : (
          <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
            {/* Left Sidebar Controls */}
            <aside className="w-full lg:w-96 bg-white border-r border-slate-200 flex flex-col z-10 no-print overflow-y-auto">
              <div className="p-6 border-b border-slate-100">
                <h2 className="font-bold text-slate-800 text-lg mb-4">เครื่องมือแก้ไข</h2>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">แก้ไขคำสั่ง</label>
                  <textarea 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <div className="mt-3 flex justify-between items-center gap-2">
                    <VoiceControl 
                      isProcessing={isGenerating} 
                      onTranscript={(text) => {
                        setPrompt(text);
                        handleGenerate(text);
                      }}
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleOptimize()}
                        disabled={isGenerating}
                        className="px-3 py-2 bg-indigo-100 text-indigo-700 text-sm rounded-lg hover:bg-indigo-200 disabled:opacity-50 flex items-center gap-1 font-medium transition-colors"
                        title="ให้ AI ช่วยปรับปรุงข้อความให้น่าสนใจขึ้น"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 00-.556.834c-.045.776-.477.987-1.333 1.114-.414.062-.78.361-.78.776v.421a1 1 0 01-1 1h-2a1 1 0 01-1-1v-.42a1.325 1.325 0 00-.78-.777c-.856-.127-1.288-.338-1.333-1.114a1 1 0 00-.556-.834A3.989 3.989 0 014 14c0-1.11.45-2.11 1.178-2.833.123-.122.256-.235.395-.34l1.737-5.42-1.232-.617a1 1 0 01.894-1.789l1.599.8L8.646 2.22A1 1 0 019.5 2h1z" clipRule="evenodd" />
                        </svg>
                        Magic
                      </button>
                      <button 
                        onClick={() => handleGenerate()}
                        disabled={isGenerating}
                        className="px-3 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 disabled:opacity-50 whitespace-nowrap"
                      >
                        {isGenerating ? '...' : 'สร้างใหม่'}
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">
                    {error}
                  </div>
                )}
                
                <hr className="my-6 border-slate-100"/>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">การกระทำ</h3>
                  <button 
                    onClick={handleExport}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    บันทึกเป็น PDF
                  </button>
                  <button 
                    onClick={handleExport}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    พิมพ์
                  </button>
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 mt-auto">
                <p className="text-xs text-slate-400 text-center">
                  เคล็ดลับ: คลิกที่ข้อความบนอินโฟกราฟิกเพื่อแก้ไขโดยตรง
                </p>
              </div>
            </aside>

            {/* Canvas Area */}
            <section className="flex-grow bg-slate-200/50 overflow-y-auto p-4 lg:p-12 relative">
               {isGenerating && (
                 <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center">
                   <div className="flex flex-col items-center">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                     <p className="text-indigo-900 font-medium animate-pulse">{loadingText}</p>
                   </div>
                 </div>
               )}
               <InfographicRenderer 
                  data={infographicData} 
                  onUpdate={setInfographicData}
               />
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;