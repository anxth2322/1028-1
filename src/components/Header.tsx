import React from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Sparkles, 
  HelpCircle, 
  Download, 
  Printer, 
  Share2, 
  CheckCircle2,
  Boxes,
  Layers
} from 'lucide-react';
import { FunctionalRequirement, DecisionItem } from '../data/specData';
import { exportToExcel, exportToWord, generateMarkdownDoc } from '../utils/exportUtils';
import confetti from 'canvas-confetti';

interface HeaderProps {
  activeTab: 'spreadsheet' | 'doc' | 'sandbox' | 'decisions';
  setActiveTab: (tab: 'spreadsheet' | 'doc' | 'sandbox' | 'decisions') => void;
  specItems: FunctionalRequirement[];
  decisions: DecisionItem[];
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  specItems,
  decisions
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyMarkdown = () => {
    const md = generateMarkdownDoc(specItems, decisions);
    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.1 } });
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          {/* Logo & Project Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-md">
              <Boxes className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  庫存精準化與物料管理系統功能規格
                </h1>
                <span className="text-[11px] font-mono font-medium text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
                  FR-01 ~ FR-17
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>ERP 現有對照 / MES 導入驗收標準</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-medium">17 項規格全部就緒</span>
                <span aria-hidden="true">·</span>
                <span>支援 Excel / Word 雙向匯出</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                exportToExcel(specItems);
                confetti({ particleCount: 30, spread: 50 });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-emerald-600/90 text-white hover:bg-emerald-500 shadow-sm transition-colors cursor-pointer"
              title="匯出成可於 Microsoft Excel 編輯的試算表"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>匯出 Excel (.xls)</span>
            </button>

            <button
              onClick={() => {
                exportToWord(specItems, decisions);
                confetti({ particleCount: 30, spread: 50 });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600/90 text-white hover:bg-blue-500 shadow-sm transition-colors cursor-pointer"
              title="匯出成標準 Microsoft Word (.doc) 規格書文件"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>匯出 Word (.doc)</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
              title="複製 Markdown 格式貼至 Notion / Jira / Confluence"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? '已複製 MD' : '複製 Markdown'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
              title="列印或另存為 PDF 文件"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">列印 / PDF</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-t border-slate-800/80 -mb-px overflow-x-auto no-scrollbar gap-2 pt-1">
          <button
            onClick={() => setActiveTab('spreadsheet')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'spreadsheet'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>試算表格模式 (規格清單 & 驗收自訂)</span>
            <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.2 rounded text-slate-300">17</span>
          </button>

          <button
            onClick={() => setActiveTab('doc')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'doc'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>PRD 規格書文件 (給 IT/廠商)</span>
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'sandbox'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>互動功能沙盒 (庫存分層/線邊倉/掃碼原型)</span>
          </button>

          <button
            onClick={() => setActiveTab('decisions')}
            className={`flex items-center gap-2 py-2.5 px-3.5 text-xs sm:text-sm font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'decisions'
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span>待確認事項與決策矩陣 (5大問題)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
