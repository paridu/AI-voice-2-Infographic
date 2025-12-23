import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import { InfographicData, ChartType, Section } from '../types';

interface Props {
  data: InfographicData;
  onUpdate?: (data: InfographicData) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Editable Text Component
const EditableText = ({ 
  value, 
  onSave, 
  className = "", 
  tagName: Tag = "div",
  placeholder = ""
}: { 
  value: string | number; 
  onSave: (val: string) => void; 
  className?: string;
  tagName?: React.ElementType;
  placeholder?: string;
}) => {
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      className={`outline-none hover:bg-black/5 focus:bg-white focus:ring-2 focus:ring-indigo-400 rounded px-1 -mx-1 transition-colors cursor-text empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 ${className}`}
      data-placeholder={placeholder}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        const text = e.currentTarget.textContent || "";
        if (text !== String(value)) {
          onSave(text);
        }
      }}
    >
      {value}
    </Tag>
  );
};

// Sub-components for specific chart types that support editing
const StatCard: React.FC<{ 
  section: Section; 
  themeColor: string;
  onUpdateSection?: (newData: Section) => void;
}> = ({ section, themeColor, onUpdateSection }) => {
  
  const handleItemUpdate = (index: number, field: 'name' | 'value' | 'label', newValue: string) => {
    if (!onUpdateSection) return;
    const newData = [...section.data];
    if (field === 'value') {
       // Simple number parsing, fallback to 0 if NaN
       const num = parseFloat(newValue.replace(/,/g, ''));
       newData[index] = { ...newData[index], value: isNaN(num) ? 0 : num };
    } else {
       newData[index] = { ...newData[index], [field]: newValue };
    }
    onUpdateSection({ ...section, data: newData });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {section.data.map((item, idx) => (
        <div key={idx} className="p-6 rounded-xl bg-white shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
          <EditableText 
            tagName="span"
            className="text-4xl font-bold mb-2 block" 
            value={item.value.toLocaleString()} 
            onSave={(val) => handleItemUpdate(idx, 'value', val)}
            // Pass theme color via style to wrapper or here? Style prop on EditableText not exposed in simple version
            // We use style attribute on the wrapper usually, but here we want text color.
            // Let's assume standard color for now or apply themeColor style in parent
          />
          {/* Apply theme color to the value manually via style on parent if needed, 
              but EditableText overrides classes. We can wrap it. 
           */}
           <style>{`.text-theme-${section.id}-${idx} { color: ${themeColor} }`}</style>
           <div className={`text-4xl font-bold mb-2 text-theme-${section.id}-${idx}`}>
              {/* Overlay for editing is tricky with colored text, keep it simple */}
           </div>
           
           {/* Let's redo EditableText to be simpler for stats */}
           <div className="text-4xl font-bold mb-2" style={{ color: themeColor }}>
              <EditableText value={item.value.toLocaleString()} onSave={(val) => handleItemUpdate(idx, 'value', val)} />
           </div>

          <EditableText 
            tagName="span"
            className="text-slate-600 font-medium block w-full" 
            value={item.name} 
            onSave={(val) => handleItemUpdate(idx, 'name', val)}
          />
          <div className="text-slate-400 text-sm mt-1 w-full">
            <EditableText 
              tagName="span"
              value={item.label || ""} 
              placeholder="รายละเอียดเสริม..."
              onSave={(val) => handleItemUpdate(idx, 'label', val)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const ListSection: React.FC<{ 
  section: Section; 
  themeColor: string; 
  onUpdateSection?: (newData: Section) => void;
}> = ({ section, themeColor, onUpdateSection }) => {

  const handleItemUpdate = (index: number, field: 'name' | 'label', newValue: string) => {
    if (!onUpdateSection) return;
    const newData = [...section.data];
    newData[index] = { ...newData[index], [field]: newValue };
    onUpdateSection({ ...section, data: newData });
  };

  return (
    <div className="w-full space-y-3">
      {section.data.map((item, idx) => (
        <div key={idx} className="flex items-start gap-4 p-4 bg-white/50 rounded-lg border-l-4 hover:bg-white transition-colors" style={{ borderColor: themeColor }}>
           <div className="h-8 w-8 rounded-full flex items-center justify-center text-white shrink-0" style={{ backgroundColor: themeColor }}>
             {idx + 1}
           </div>
           <div className="flex-grow">
             <EditableText 
               tagName="h4"
               className="font-bold text-slate-800 text-lg"
               value={item.name}
               onSave={(val) => handleItemUpdate(idx, 'name', val)}
             />
             <div className="text-slate-600 mt-1">
                <EditableText 
                  tagName="p"
                  value={item.label || item.value}
                  placeholder="รายละเอียด..."
                  onSave={(val) => handleItemUpdate(idx, 'label', val)}
                />
             </div>
           </div>
        </div>
      ))}
    </div>
  );
};

export const InfographicRenderer: React.FC<Props> = ({ data, onUpdate }) => {
  const { title, subtitle, sections, themeColor, backgroundColor, footer } = data;

  // Helper to update root properties
  const updateRoot = (field: keyof InfographicData, val: string) => {
    if (onUpdate) onUpdate({ ...data, [field]: val });
  };

  // Helper to update specific section
  const updateSection = (index: number, newSection: Section) => {
    if (!onUpdate) return;
    const newSections = [...sections];
    newSections[index] = newSection;
    onUpdate({ ...data, sections: newSections });
  };

  // Helper to add a new section
  const handleAddSection = () => {
    if (!onUpdate) return;
    const newSection: Section = {
      id: `s-${Date.now()}`,
      type: ChartType.STAT,
      title: "หัวข้อใหม่",
      description: "คำอธิบายส่วนนี้...",
      data: [
        { name: "ข้อมูล 1", value: 100 },
        { name: "ข้อมูล 2", value: 200 }
      ]
    };
    onUpdate({
      ...data,
      sections: [...sections, newSection]
    });
  };

  // Helper to change section type (cycling through types for simplicity)
  const cycleChartType = (index: number) => {
    if (!onUpdate) return;
    const currentType = sections[index].type;
    const types = [ChartType.STAT, ChartType.BAR, ChartType.PIE, ChartType.LINE, ChartType.LIST];
    const nextType = types[(types.indexOf(currentType) + 1) % types.length];
    
    updateSection(index, { ...sections[index], type: nextType });
  };

  const shouldSpanFull = (section: Section): boolean => {
     // Line charts often need width
     if (section.type === ChartType.LINE) return true;
     // Bar charts with many items
     if (section.type === ChartType.BAR && section.data.length > 6) return true;
     // Stat cards with many items
     if (section.type === ChartType.STAT && section.data.length > 3) return true;
     return false;
  };

  const renderSectionContent = (section: Section, index: number) => {
    switch (section.type) {
      case ChartType.BAR:
        return (
          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={section.data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="value" fill={themeColor} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case ChartType.PIE:
        return (
          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={section.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {section.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      case ChartType.LINE:
        return (
          <div className="h-64 w-full mt-4">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={section.data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke={themeColor} strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case ChartType.STAT:
        return <StatCard section={section} themeColor={themeColor} onUpdateSection={(s) => updateSection(index, s)} />;
      case ChartType.LIST:
        return <ListSection section={section} themeColor={themeColor} onUpdateSection={(s) => updateSection(index, s)} />;
      default:
        return null;
    }
  };

  return (
    <div 
      id="infographic-canvas"
      className="w-full max-w-5xl mx-auto min-h-[800px] shadow-2xl overflow-hidden transition-all duration-500 flex flex-col"
      style={{ backgroundColor: backgroundColor || '#ffffff' }}
    >
      {/* Header */}
      <header className="p-12 text-center relative overflow-hidden shrink-0">
        <div 
          className="absolute top-0 left-0 w-full h-2" 
          style={{ backgroundColor: themeColor }}
        />
        <EditableText 
          tagName="h1"
          className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight max-w-4xl mx-auto"
          value={title}
          onSave={(val) => updateRoot('title', val)}
        />
        <EditableText 
          tagName="p"
          className="text-xl text-slate-600 font-light max-w-2xl mx-auto"
          value={subtitle}
          onSave={(val) => updateRoot('subtitle', val)}
        />
      </header>

      {/* Content - Dynamic Grid */}
      <div className="px-12 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 auto-rows-min flex-grow">
        {sections.map((section, index) => {
          const isFullWidth = shouldSpanFull(section);
          return (
            <section 
              key={section.id} 
              className={`break-inside-avoid flex flex-col ${isFullWidth ? 'lg:col-span-2' : ''} group/section relative`}
            >
              {/* Type Switcher - Only visible on hover when editable */}
              {onUpdate && (
                <button 
                  onClick={() => cycleChartType(index)}
                  className="absolute top-0 right-0 p-1 text-xs bg-slate-100 text-slate-500 rounded opacity-0 group-hover/section:opacity-100 hover:bg-slate-200 transition-all z-10"
                  title="คลิกเพื่อเปลี่ยนประเภทกราฟ"
                >
                  {section.type}
                </button>
              )}

              <div className="mb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="h-8 w-1 rounded-full shrink-0" style={{ backgroundColor: themeColor }} />
                    <div className="flex-grow">
                      <EditableText 
                        tagName="h3"
                        className="text-2xl font-bold text-slate-800"
                        value={section.title}
                        onSave={(val) => updateSection(index, { ...section, title: val })}
                      />
                    </div>
                  </div>
                  <div className="pl-5">
                    {section.description && (
                      <EditableText 
                        tagName="p"
                        className="text-slate-500 text-sm mb-1"
                        value={section.description}
                        onSave={(val) => updateSection(index, { ...section, description: val })}
                      />
                    )}
                    {section.chartDescription && (
                      <EditableText 
                        tagName="p"
                        className="text-slate-500 text-sm italic"
                        value={section.chartDescription}
                        onSave={(val) => updateSection(index, { ...section, chartDescription: val })}
                      />
                    )}
                  </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl flex-grow h-full flex flex-col justify-center border border-transparent hover:border-slate-200 transition-colors">
                {renderSectionContent(section, index)}
              </div>
            </section>
          );
        })}

        {/* Add Section Button */}
        {onUpdate && (
          <div 
            onClick={handleAddSection}
            className="break-inside-avoid flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-slate-300 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer group no-print"
          >
            <div className="h-16 w-16 rounded-full bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center mb-4 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400 group-hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="font-medium text-slate-500 group-hover:text-indigo-600">เพิ่มส่วนใหม่</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="p-8 mt-8 bg-slate-900 text-slate-400 text-center text-sm shrink-0">
        <EditableText 
          tagName="p"
          value={footer || `Generated by AG-Infographic • ${new Date().getFullYear()}`}
          onSave={(val) => updateRoot('footer', val)}
        />
      </footer>
    </div>
  );
};