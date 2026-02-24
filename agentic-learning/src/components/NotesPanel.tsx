'use client';

import { useState, useRef } from 'react';
import { 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Lightbulb, 
  CheckCircle2, 
  Printer, 
  FileText,
  BookOpen,
  Copy,
  Check
} from 'lucide-react';

interface NotesPanelProps {
  notes: string;
  keyPoints: string[];
  lessonTitle: string;
}

export default function NotesPanel({ notes, keyPoints, lessonTitle }: NotesPanelProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['keyPoints', 'notes']);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };
  
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let inList = false;
    let listItems: string[] = [];
    let tableData: string[][] = [];
    let inTable = false;
    
    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="space-y-2 my-4 ml-4">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span className="text-gray-800 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
      inList = false;
    };
    
    const flushTable = () => {
      if (tableData.length > 0) {
        elements.push(
          <div key={`table-${elements.length}`} className="overflow-x-auto my-6">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  {tableData[0].map((cell, idx) => (
                    <th key={idx} className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-800">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.slice(1).map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="border border-gray-300 px-4 py-2 text-gray-700">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableData = [];
      }
      inTable = false;
    };
    
    lines.forEach((line, idx) => {
      if (line.startsWith('# ')) {
        flushList();
        flushTable();
        elements.push(
          <h1 key={idx} className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0 border-b-2 border-blue-500 pb-2">
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        flushList();
        flushTable();
        elements.push(
          <h2 key={idx} className="text-xl font-semibold text-gray-800 mb-3 mt-5 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-500 rounded-full" />
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        flushList();
        flushTable();
        elements.push(
          <h3 key={idx} className="text-lg font-semibold text-gray-800 mb-2 mt-4 text-blue-700">
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith('|') && line.includes('|')) {
        flushList();
        inTable = true;
        const cells = line.split('|').filter(c => c.trim()).map(c => c.trim());
        if (!line.includes('---')) {
          tableData.push(cells);
        }
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        flushTable();
        inList = true;
        listItems.push(line.slice(2));
      } else if (line.match(/^\d+\.\s/)) {
        flushTable();
        inList = true;
        listItems.push(line.replace(/^\d+\.\s/, ''));
      } else if (line.startsWith('**') && line.endsWith('**')) {
        flushList();
        flushTable();
        elements.push(
          <p key={idx} className="font-bold text-gray-900 mb-2 mt-3 text-lg bg-yellow-50 p-2 rounded">
            {line.slice(2, -2)}
          </p>
        );
      } else if (line.startsWith('> ')) {
        flushList();
        flushTable();
        elements.push(
          <blockquote key={idx} className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-700 bg-blue-50 p-3 rounded-r">
            {line.slice(2)}
          </blockquote>
        );
      } else if (line.trim() === '') {
        flushList();
        flushTable();
      } else {
        if (inList) flushList();
        if (inTable) flushTable();
        
        const formattedLine = line
          .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
          .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
          .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-blue-600 font-mono text-sm">$1</code>');
        
        elements.push(
          <p 
            key={idx} 
            className="text-gray-800 mb-2 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formattedLine }}
          />
        );
      }
    });
    
    flushList();
    flushTable();
    
    return elements;
  };

  const handleDownload = async (format: 'txt' | 'print') => {
    setDownloading(true);
    
    if (format === 'print') {
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${lessonTitle} - Study Notes</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
              font-family: 'Inter', Arial, sans-serif; 
              padding: 40px; 
              max-width: 800px; 
              margin: 0 auto; 
              color: #1a1a1a;
              line-height: 1.6;
            }
            h1 { 
              font-size: 24px; 
              border-bottom: 3px solid #3b82f6; 
              padding-bottom: 10px; 
              margin-bottom: 20px;
              color: #111;
            }
            h2 { 
              font-size: 18px; 
              margin-top: 30px; 
              margin-bottom: 15px; 
              color: #222;
              border-left: 4px solid #3b82f6;
              padding-left: 10px;
            }
            h3 { font-size: 16px; margin-top: 20px; margin-bottom: 10px; color: #333; }
            ul { margin-left: 20px; margin-bottom: 15px; }
            li { margin-bottom: 8px; }
            .key-points { 
              background: #f0f9ff; 
              padding: 20px; 
              border-radius: 8px; 
              margin-bottom: 30px;
              border: 1px solid #bae6fd;
            }
            .key-points ul { list-style: none; margin: 0; }
            .key-points li { display: flex; align-items: flex-start; gap: 10px; }
            .key-points li::before { content: "✓"; color: #22c55e; font-weight: bold; }
            code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; }
            blockquote { 
              border-left: 4px solid #3b82f6; 
              background: #eff6ff; 
              padding: 12px; 
              margin: 15px 0; 
              font-style: italic;
            }
            .footer { 
              margin-top: 40px; 
              padding-top: 20px; 
              border-top: 1px solid #e5e7eb; 
              font-size: 12px; 
              color: #6b7280;
              text-align: center;
            }
            @media print {
              body { padding: 20px; }
              h1 { font-size: 20px; }
            }
          </style>
        </head>
        <body>
          <h1>📚 ${lessonTitle}</h1>
          
          <div class="key-points">
            <h2>🎯 Key Points</h2>
            <ul>
              ${keyPoints.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
          
          <h2>📖 Detailed Notes</h2>
          ${notes
            .replace(/^# (.+)$/gm, '<h2>$1</h2>')
            .replace(/^## (.+)$/gm, '<h3>$1</h3>')
            .replace(/^### (.+)$/gm, '<h4>$1</h4>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
          }
          
          <div class="footer">
            Generated by Agentic Learning • Study smart, not hard
          </div>
        </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
      }
    } else {
      const content = `# 📚 ${lessonTitle}

## 🎯 Key Points
${keyPoints.map(p => `• ${p}`).join('\n')}

---

## 📖 Detailed Notes
${notes}

---
Generated by Agentic Learning
`;
      
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${lessonTitle.replace(/\s+/g, '-').toLowerCase()}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    setDownloading(false);
  };

  const handleCopy = () => {
    const content = `${lessonTitle}\n\nKey Points:\n${keyPoints.map(p => `• ${p}`).join('\n')}\n\nNotes:\n${notes}`;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Study Notes</h2>
            <p className="text-xs text-gray-500">Comprehensive learning material</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => handleDownload('print')}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>
          <button
            onClick={() => handleDownload('txt')}
            disabled={downloading}
            className="flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            {downloading ? '...' : 'Export'}
          </button>
        </div>
      </div>
      
      <div ref={printRef}>
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection('keyPoints')}
            className="w-full p-4 flex items-center justify-between hover:bg-yellow-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="text-left">
                <span className="font-semibold text-gray-900">Key Points</span>
                <p className="text-xs text-gray-500">{keyPoints.length} important concepts</p>
              </div>
            </div>
            {expandedSections.includes('keyPoints') ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.includes('keyPoints') && (
            <div className="px-4 pb-4 bg-yellow-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {keyPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-yellow-200">
                    <span className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center text-xs font-bold text-yellow-700 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-gray-800 text-sm font-medium">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection('notes')}
            className="w-full p-4 flex items-center justify-between hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-left">
                <span className="font-semibold text-gray-900">Detailed Notes</span>
                <p className="text-xs text-gray-500">In-depth explanations and examples</p>
              </div>
            </div>
            {expandedSections.includes('notes') ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.includes('notes') && (
            <div className="px-4 pb-4 bg-white">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                {renderMarkdown(notes)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
