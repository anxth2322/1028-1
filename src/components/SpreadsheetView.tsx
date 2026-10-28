import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Edit3, 
  CheckCircle, 
  AlertTriangle, 
  RotateCcw, 
  Info, 
  SlidersHorizontal,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { FunctionalRequirement } from '../data/specData';
import { exportToExcel, exportToCSV } from '../utils/exportUtils';
import confetti from 'canvas-confetti';

interface SpreadsheetViewProps {
  items: FunctionalRequirement[];
  onUpdateItem: (id: string, updates: Partial<FunctionalRequirement>) => void;
  onResetAll: () => void;
  onSelectSandboxFr?: (frId: string) => void;
}

export const SpreadsheetView: React.FC<SpreadsheetViewProps> = ({
  items,
  onUpdateItem,
  onResetAll,
  onSelectSandboxFr
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedPhase, setSelectedPhase] = useState<string>('ALL');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Editing modal state
  const [editingItem, setEditingItem] = useState<FunctionalRequirement | null>(null);
  const [customCriteria, setCustomCriteria] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [customStatus, setCustomStatus] = useState<FunctionalRequirement['status']>('待確認');

  const openEditModal = (item: FunctionalRequirement) => {
    setEditingItem(item);
    setCustomCriteria(item.criteria);
    setCustomNotes(item.notes);
    setCustomStatus(item.status);
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      onUpdateItem(editingItem.id, {
        criteria: customCriteria,
        notes: customNotes,
        status: customStatus
      });
      setEditingItem(null);
      confetti({ particleCount: 20, spread: 40 });
    }
  };

  // Filtered dataset
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (selectedPriority !== 'ALL' && item.priority !== selectedPriority) return false;
      if (selectedPhase !== 'ALL' && String(item.phase) !== selectedPhase) return false;
      if (selectedModule !== 'ALL' && item.moduleId !== selectedModule) return false;
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const match = (
          item.id.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query) ||
          item.problem.toLowerCase().includes(query) ||
          item.rules.toLowerCase().includes(query) ||
          item.criteria.toLowerCase().includes(query) ||
          item.users.some(u => u.toLowerCase().includes(query))
        );
        if (!match) return false;
      }
      return true;
    });
  }, [items, selectedPriority, selectedPhase, selectedModule, selectedStatus, searchTerm]);

  // Statistics
  const p1Count = items.filter(i => i.priority === 'P1').length;
  const p2Count = items.filter(i => i.priority === 'P2').length;
  const p3Count = items.filter(i => i.priority === 'P3').length;
  const phase1Count = items.filter(i => i.phase === 1).length;
  const customizedCount = items.filter(i => i.criteria !== i.defaultCriteria).length;

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">功能規格總數</div>
          <div className="text-2xl font-bold text-white mt-1 flex items-baseline gap-2">
            <span>{items.length}</span>
            <span className="text-xs text-slate-400 font-normal">項需求 (FR-01 ~ FR-17)</span>
          </div>
          <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
            <span>涵蓋 7 大製造物料模組</span>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-rose-900/40 rounded-xl p-4">
          <div className="text-xs text-rose-300 font-medium">第一優先級 (P1 核心基礎)</div>
          <div className="text-2xl font-bold text-rose-400 mt-1 flex items-baseline gap-2">
            <span>{p1Count}</span>
            <span className="text-xs text-rose-300/70 font-normal">項 ({Math.round(p1Count / items.length * 100)}%)</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>領退綁工單、未結提醒、ABC盤點</span>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-amber-900/40 rounded-xl p-4">
          <div className="text-xs text-amber-300 font-medium">第一階段啟動項目 (Phase 1)</div>
          <div className="text-2xl font-bold text-amber-400 mt-1 flex items-baseline gap-2">
            <span>{phase1Count}</span>
            <span className="text-xs text-amber-300/70 font-normal">項 (免購新系統即可行)</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>以 ERP 現有或制度規則即刻上線</span>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-emerald-900/40 rounded-xl p-4">
          <div className="text-xs text-emerald-300 font-medium">驗收標準自訂微調</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 flex items-baseline gap-2">
            <span>{customizedCount}</span>
            <span className="text-xs text-emerald-300/70 font-normal">項已按廠況客製</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            <span>所有暫訂數字均可隨時在線調整</span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜尋編號、功能名稱、痛點、規則或使用者..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Quick buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => exportToExcel(filteredItems)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/40 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>匯出當前篩選 (.xls)</span>
            </button>

            <button
              onClick={() => exportToCSV(filteredItems)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV 匯出</span>
            </button>

            <button
              onClick={onResetAll}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-colors cursor-pointer"
              title="將所有驗收標準還原為規格書原始暫訂值"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重設標準</span>
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-700/60 text-xs">
          {/* Priority filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">優先級:</span>
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-700">
              {['ALL', 'P1', 'P2', 'P3'].map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedPriority(p)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    selectedPriority === p
                      ? p === 'P1'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : p === 'P2'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : p === 'P3'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p === 'ALL' ? '全部' : p}
                </button>
              ))}
            </div>
          </div>

          {/* Phase filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">導入階段:</span>
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-700">
              {[
                { val: 'ALL', label: '全部' },
                { val: '1', label: '階段一 (規則主檔)' },
                { val: '2', label: '階段二 (MES系統化)' },
                { val: '3', label: '階段三 (AI輔助)' }
              ].map(ph => (
                <button
                  key={ph.val}
                  onClick={() => setSelectedPhase(ph.val)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    selectedPhase === ph.val
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ph.label}
                </button>
              ))}
            </div>
          </div>

          {/* Module dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">所屬模組:</span>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">全部模組 (A ~ G)</option>
              <option value="A">模組 A：庫存查詢與預留</option>
              <option value="B">模組 B：領退料</option>
              <option value="C">模組 C：損耗、線邊倉與主檔</option>
              <option value="D">模組 D：盤點與盤差</option>
              <option value="E">模組 E：儲位與批號</option>
              <option value="F">模組 F：回報與指標</option>
              <option value="G">模組 G：AI 輔助</option>
            </select>
          </div>

          {/* Status dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">實施狀態:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">全部狀態</option>
              <option value="ERP 已具備">ERP 已具備</option>
              <option value="ERP 需微調">ERP 需微調</option>
              <option value="MES 需涵蓋">MES 需涵蓋</option>
              <option value="待確認">待確認</option>
              <option value="已驗收">已驗收</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spreadsheet Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/90 text-slate-300 border-b border-slate-700 font-semibold tracking-wider">
                <th className="py-3 px-3 w-16 text-center">編號</th>
                <th className="py-3 px-3 w-36">功能名稱 / 模組</th>
                <th className="py-3 px-3 w-28 text-slate-400">對應痛點</th>
                <th className="py-3 px-3 w-24">使用者</th>
                <th className="py-3 px-4 min-w-[260px]">功能說明與業務規則</th>
                <th className="py-3 px-4 min-w-[240px] bg-slate-800/40">
                  <div className="flex items-center justify-between">
                    <span>驗收標準 (暫訂值可微調)</span>
                    <span className="text-[10px] text-amber-400 font-normal">點擊調整</span>
                  </div>
                </th>
                <th className="py-3 px-2 w-14 text-center">優先</th>
                <th className="py-3 px-2 w-16 text-center">階段</th>
                <th className="py-3 px-3 w-28">承載系統</th>
                <th className="py-3 px-3 w-24">狀態</th>
                <th className="py-3 px-3 w-20 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredItems.map((item) => {
                const isModified = item.criteria !== item.defaultCriteria;
                return (
                  <tr 
                    key={item.id} 
                    className="hover:bg-slate-800/50 transition-colors group"
                  >
                    {/* ID */}
                    <td className="py-3 px-3 text-center align-top font-mono font-bold text-amber-400">
                      {item.id}
                    </td>

                    {/* Name & Module */}
                    <td className="py-3 px-3 align-top">
                      <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                        <span>{item.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.moduleName.replace(/模組 [A-G]：/, '')}
                      </div>
                    </td>

                    {/* Problem */}
                    <td className="py-3 px-3 align-top text-rose-300/90 font-medium">
                      {item.problem}
                    </td>

                    {/* Users */}
                    <td className="py-3 px-3 align-top">
                      <div className="flex flex-wrap gap-1">
                        {item.users.map(u => (
                          <span key={u} className="text-[10px] text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                            {u}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Rules */}
                    <td className="py-3 px-4 align-top text-slate-300 leading-relaxed font-sans">
                      {item.rules}
                      {item.notes && (
                        <div className="mt-1.5 text-[11px] text-slate-400 bg-slate-950/40 p-1.5 rounded border border-slate-800/80">
                          <span className="text-amber-400/90 font-medium">備註：</span>{item.notes}
                        </div>
                      )}
                    </td>

                    {/* Acceptance Criteria (Editable) */}
                    <td 
                      onClick={() => openEditModal(item)}
                      className="py-3 px-4 align-top cursor-pointer group-hover:bg-amber-500/5 transition-colors relative"
                    >
                      <div className="text-amber-200/95 leading-relaxed bg-amber-950/20 p-2 rounded-lg border border-amber-900/30 flex items-start justify-between gap-2">
                        <span>{item.criteria}</span>
                        <Edit3 className="w-3.5 h-3.5 text-amber-400/60 group-hover:text-amber-400 shrink-0 mt-0.5" />
                      </div>
                      {isModified && (
                        <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                          <CheckCircle className="w-3 h-3" />
                          <span>已客製化</span>
                        </div>
                      )}
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-2 text-center align-top">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                        item.priority === 'P1' 
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800' 
                          : item.priority === 'P2' 
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800' 
                          : 'bg-indigo-950/80 text-indigo-300 border border-indigo-800'
                      }`}>
                        {item.priority}
                      </span>
                    </td>

                    {/* Phase */}
                    <td className="py-3 px-2 text-center align-top text-slate-300 font-mono text-xs">
                      階段 {item.phase}
                    </td>

                    {/* System */}
                    <td className="py-3 px-3 align-top">
                      <select
                        value={item.suggestedSystem}
                        onChange={(e) => onUpdateItem(item.id, { suggestedSystem: e.target.value as any })}
                        className="bg-slate-800 border border-slate-700 text-[11px] text-slate-300 rounded px-1.5 py-1 focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="ERP 現有">ERP 現有</option>
                        <option value="MES 導入">MES 導入</option>
                        <option value="客製開發 / 整合">客製開發 / 整合</option>
                      </select>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 align-top">
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateItem(item.id, { status: e.target.value as any })}
                        className={`text-[11px] rounded px-1.5 py-1 border focus:outline-none cursor-pointer ${
                          item.status === '已驗收'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                            : item.status === 'ERP 已具備'
                            ? 'bg-blue-950/60 text-blue-300 border-blue-800'
                            : item.status === 'ERP 需微調'
                            ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                            : item.status === 'MES 需涵蓋'
                            ? 'bg-purple-950/60 text-purple-300 border-purple-800'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        <option value="ERP 已具備">ERP 已具備</option>
                        <option value="ERP 需微調">ERP 需微調</option>
                        <option value="MES 需涵蓋">MES 需涵蓋</option>
                        <option value="待確認">待確認</option>
                        <option value="已驗收">已驗收</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center align-top">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-slate-400 hover:text-amber-400 p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                        title="編輯此規格驗收數值與備註"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            <AlertTriangle className="w-8 h-8 mx-auto text-amber-400/60 mb-2" />
            <p>無符合當前篩選條件的功能規格</p>
            <button
              onClick={() => {
                setSelectedPriority('ALL');
                setSelectedPhase('ALL');
                setSelectedModule('ALL');
                setSelectedStatus('ALL');
                setSearchTerm('');
              }}
              className="mt-3 text-xs text-amber-400 hover:underline cursor-pointer"
            >
              清除所有篩選條件
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-mono font-bold text-sm bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                  {editingItem.id}
                </span>
                <h3 className="text-base font-bold text-white">{editingItem.name}</h3>
              </div>
              <span className="text-xs text-slate-400">{editingItem.moduleName}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">功能說明與規則：</label>
                <div className="p-2.5 bg-slate-950 rounded-lg text-slate-300 leading-relaxed border border-slate-800">
                  {editingItem.rules}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-amber-300 font-medium block">
                    驗收標準 (請依貴廠實際情況調整數值與指標)：
                  </label>
                  <button
                    onClick={() => setCustomCriteria(editingItem.defaultCriteria)}
                    className="text-[10px] text-slate-400 hover:text-amber-400 underline cursor-pointer"
                  >
                    還原預設暫訂值
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={customCriteria}
                  onChange={(e) => setCustomCriteria(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/40 focus:border-amber-400 text-amber-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  placeholder="輸入適合貴廠流程的具體驗收數字與規範..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">實施狀態：</label>
                  <select
                    value={customStatus}
                    onChange={(e) => setCustomStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="ERP 已具備">ERP 已具備</option>
                    <option value="ERP 需微調">ERP 需微調</option>
                    <option value="MES 需涵蓋">MES 需涵蓋</option>
                    <option value="待確認">待確認</option>
                    <option value="已驗收">已驗收</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">建議承載系統：</label>
                  <div className="p-2 bg-slate-950 rounded-lg text-slate-300 border border-slate-800 font-medium">
                    {editingItem.suggestedSystem}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">備註 / 現場實施重點：</label>
                <input
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500"
                  placeholder="例如：需會同資訊室召開 API 會議、採購條碼機規格等"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingItem(null)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow-md cursor-pointer"
              >
                儲存調整
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
