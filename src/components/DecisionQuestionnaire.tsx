import React from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle, 
  ArrowRight, 
  GitBranch, 
  Scale, 
  Wifi, 
  Clock, 
  Layers,
  Sparkles
} from 'lucide-react';
import { DecisionItem, FunctionalRequirement } from '../data/specData';
import confetti from 'canvas-confetti';

interface DecisionQuestionnaireProps {
  decisions: DecisionItem[];
  onUpdateDecision: (id: number, newChoice: string) => void;
  specItems: FunctionalRequirement[];
  onSelectTab: (tab: 'spreadsheet' | 'doc' | 'sandbox' | 'decisions') => void;
}

export const DecisionQuestionnaire: React.FC<DecisionQuestionnaireProps> = ({
  decisions,
  onUpdateDecision,
  specItems,
  onSelectTab
}) => {
  const handleSelectOption = (id: number, val: string) => {
    onUpdateDecision(id, val);
    confetti({ particleCount: 15, spread: 35 });
  };

  // Calculate ERP readiness summary
  const erpCovered = specItems.filter(i => i.status === 'ERP 已具備').length;
  const erpNeedTweak = specItems.filter(i => i.status === 'ERP 需微調').length;
  const mesNeeded = specItems.filter(i => i.status === 'MES 需涵蓋').length;
  const pendingCount = specItems.filter(i => i.status === '待確認').length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center gap-2.5 text-amber-400">
          <HelpCircle className="w-5 h-5" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            系統導入前 5 大關鍵決策與落差評估 (Gap Analysis)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          規格書中的 17 項功能並非所有項目都需要立即花大錢買全新系統。以下 5 個決策點是專案啟動與 IT / MES 廠商進場前必須拍板的關鍵方向。點選選項後，相關功能規格與驗收邏輯將動態聯動。
        </p>

        {/* Status mini bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400">ERP 現有可直接支援</span>
            <span className="text-xl font-bold text-blue-400 font-mono block mt-0.5">{erpCovered} 項</span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400">ERP 需開窗或微調報表</span>
            <span className="text-xl font-bold text-amber-400 font-mono block mt-0.5">{erpNeedTweak} 項</span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400">需交由 MES 現場串接</span>
            <span className="text-xl font-bold text-purple-400 font-mono block mt-0.5">{mesNeeded} 項</span>
          </div>
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400">待本問卷裁決確認</span>
            <span className="text-xl font-bold text-rose-400 font-mono block mt-0.5">{pendingCount} 項</span>
          </div>
        </div>
      </div>

      {/* 5 Decisions Cards */}
      <div className="space-y-6">
        {decisions.map((decision) => {
          return (
            <div 
              key={decision.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-md hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-amber-400 text-xs">
                    0{decision.id}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">{decision.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{decision.question}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="text-[11px] text-slate-400">牽涉功能：</span>
                  {decision.targetFRs.map(fr => (
                    <span key={fr} className="text-[10px] font-mono font-medium text-amber-400 bg-amber-950/50 border border-amber-800/60 px-1.5 py-0.5 rounded">
                      {fr}
                    </span>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {decision.options.map((opt) => {
                  const isSelected = decision.currentChoice === opt.value;
                  return (
                    <div
                      key={opt.value}
                      onClick={() => handleSelectOption(decision.id, opt.value)}
                      className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/60 shadow-sm'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="mt-0.5">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-600 bg-transparent'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                        </div>
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs sm:text-sm font-semibold ${isSelected ? 'text-amber-200' : 'text-slate-200'}`}>
                            {opt.label}
                          </span>
                          {opt.label.includes('推薦') && (
                            <span className="text-[10px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded">
                              顧問建議
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{opt.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Impact Callout */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 flex items-start gap-2.5 text-xs">
                <AlertCircle className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />
                <div className="text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">決策影響說明：</strong> {decision.impact}。
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to action */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-6 text-center space-y-3">
        <h4 className="text-sm font-bold text-white">決策確認完畢？前往進行功能沙盒原型驗證</h4>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          我們已將上述規格（含線邊倉方案 A/B、庫存分層、急單通道、電子秤退料標籤、循環盤點）實作成可點擊操作的即時原型，立即體驗！
        </p>
        <button
          onClick={() => onSelectTab('sandbox')}
          className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg cursor-pointer transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span>前往體驗功能沙盒原型 (Live Sandbox)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
