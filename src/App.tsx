/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SpreadsheetView } from './components/SpreadsheetView';
import { PrdDocumentView } from './components/PrdDocumentView';
import { SandboxView } from './components/SandboxView';
import { DecisionQuestionnaire } from './components/DecisionQuestionnaire';
import { 
  INITIAL_SPEC_DATA, 
  INITIAL_DECISIONS, 
  FunctionalRequirement, 
  DecisionItem 
} from './data/specData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'spreadsheet' | 'doc' | 'sandbox' | 'decisions'>('spreadsheet');

  // Load from localStorage or fallback to defaults
  const [specItems, setSpecItems] = useState<FunctionalRequirement[]>(() => {
    try {
      const saved = localStorage.getItem('inv_spec_items_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load spec items from localStorage', e);
    }
    return INITIAL_SPEC_DATA;
  });

  const [decisions, setDecisions] = useState<DecisionItem[]>(() => {
    try {
      const saved = localStorage.getItem('inv_decisions_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load decisions from localStorage', e);
    }
    return INITIAL_DECISIONS;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('inv_spec_items_v1', JSON.stringify(specItems));
    } catch (e) {
      console.warn('Failed to save spec items to localStorage', e);
    }
  }, [specItems]);

  useEffect(() => {
    try {
      localStorage.setItem('inv_decisions_v1', JSON.stringify(decisions));
    } catch (e) {
      console.warn('Failed to save decisions to localStorage', e);
    }
  }, [decisions]);

  const handleUpdateItem = (id: string, updates: Partial<FunctionalRequirement>) => {
    setSpecItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, ...updates };
      }
      return item;
    }));
  };

  const handleResetAll = () => {
    if (confirm('確定要將所有 17 項驗收標準數值與狀態還原為初始規格暫訂值嗎？')) {
      setSpecItems(INITIAL_SPEC_DATA);
      setDecisions(INITIAL_DECISIONS);
      localStorage.removeItem('inv_spec_items_v1');
      localStorage.removeItem('inv_decisions_v1');
    }
  };

  const handleUpdateDecision = (id: number, newChoice: string) => {
    setDecisions(prev => prev.map(d => {
      if (d.id === id) {
        return { ...d, currentChoice: newChoice };
      }
      return d;
    }));

    // If decision #2 (Line-side warehouse) changed, update FR-08 criteria note
    if (id === 2) {
      const planLabel = newChoice === 'plan_a' ? '方案 A (領料即消耗)' : newChoice === 'plan_b' ? '方案 B (線邊倉帳＋報工扣帳)' : '混合方案 (A/B級採方案B，C級採方案A)';
      handleUpdateItem('FR-08', {
        notes: `已在關鍵決策中選定：${planLabel}。`
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        specItems={specItems}
        decisions={decisions}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'spreadsheet' && (
          <SpreadsheetView
            items={specItems}
            onUpdateItem={handleUpdateItem}
            onResetAll={handleResetAll}
          />
        )}

        {activeTab === 'doc' && (
          <PrdDocumentView
            items={specItems}
            decisions={decisions}
          />
        )}

        {activeTab === 'sandbox' && (
          <SandboxView />
        )}

        {activeTab === 'decisions' && (
          <DecisionQuestionnaire
            decisions={decisions}
            onUpdateDecision={handleUpdateDecision}
            specItems={specItems}
            onSelectTab={setActiveTab}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-slate-900 border-t border-slate-800/80 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">庫存精準化與物料管理系統規格平臺</span>
            <span>·</span>
            <span>中立規格架構 (ERP/MES 雙向對照)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>支援 .xls (Excel) / .doc (Word) / Markdown 匯出</span>
            <span>·</span>
            <button
              onClick={() => setActiveTab('doc')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              檢視完整規格文件
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
