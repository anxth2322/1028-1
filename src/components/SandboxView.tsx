import React, { useState } from 'react';
import { 
  Calculator, 
  ScanBarcode, 
  Scale, 
  GitFork, 
  ClipboardCheck, 
  LineChart, 
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Printer,
  ShieldAlert,
  FileCheck,
  RotateCw,
  Plus,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { MOCK_INVENTORY, InventoryItemMock } from '../data/specData';
import confetti from 'canvas-confetti';

export const SandboxView: React.FC = () => {
  const [activeModuleTab, setActiveModuleTab] = useState<'fr01' | 'fr03' | 'fr05' | 'fr08' | 'fr11' | 'fr15' | 'fr16'>('fr01');

  // Sandbox 1: FR-01 & FR-02 State
  const [selectedSku, setSelectedSku] = useState<string>(MOCK_INVENTORY[0].sku);
  const [inventoryList, setInventoryList] = useState<InventoryItemMock[]>(MOCK_INVENTORY);
  const currentItem = inventoryList.find(i => i.sku === selectedSku) || inventoryList[0];
  const [newOrderDemand, setNewOrderDemand] = useState<number>(1200);
  const [rushReason, setRushReason] = useState<string>('外銷客戶急單插單，生管主管口頭核准');
  const [conflictLogs, setConflictLogs] = useState<{ id: string; text: string; time: string }[]>([]);

  // Calculations for FR-01:
  // 可用量 = 倉庫量 + 線邊倉量 - 已預留量
  // 帳面總量 = 倉庫量 + 線邊倉量
  const availableStock = currentItem.warehouseStock + currentItem.lineSideStock - currentItem.reservedStock;
  const totalBookStock = currentItem.warehouseStock + currentItem.lineSideStock;
  const isShortage = newOrderDemand > availableStock;

  const handleSimulateReservation = (isRush: boolean) => {
    if (isShortage && !isRush) {
      alert(`可用量不足！可用量僅 ${availableStock} ${currentItem.unit}，預留請求 ${newOrderDemand} ${currentItem.unit}，已觸發衝突警示！`);
      return;
    }

    if (isRush) {
      // Rush order preemption
      setInventoryList(prev => prev.map(item => {
        if (item.sku === currentItem.sku) {
          return {
            ...item,
            reservedStock: item.reservedStock + newOrderDemand,
            lastMoveTime: new Date().toLocaleTimeString('zh-TW', { hour12: false })
          };
        }
        return item;
      }));
      setConflictLogs(prev => [
        {
          id: Math.random().toString(36).substr(2, 6),
          text: `[急單插單成功] 工單 WO-2026-RUSH 強制預留 ${newOrderDemand} ${currentItem.unit}，原因：「${rushReason}」，被排擠工單：WO-2026-088`,
          time: new Date().toLocaleTimeString('zh-TW', { hour12: false })
        },
        ...prev
      ]);
      confetti({ particleCount: 25, spread: 45 });
    } else {
      // Standard reservation
      setInventoryList(prev => prev.map(item => {
        if (item.sku === currentItem.sku) {
          return {
            ...item,
            reservedStock: item.reservedStock + newOrderDemand,
            lastMoveTime: new Date().toLocaleTimeString('zh-TW', { hour12: false })
          };
        }
        return item;
      }));
      setConflictLogs(prev => [
        {
          id: Math.random().toString(36).substr(2, 6),
          text: `[一般預留成功] 新工單 WO-2026-${Math.floor(100 + Math.random() * 900)} 成功預留 ${newOrderDemand} ${currentItem.unit}`,
          time: new Date().toLocaleTimeString('zh-TW', { hour12: false })
        },
        ...prev
      ]);
      confetti({ particleCount: 20, spread: 30 });
    }
  };

  // Sandbox 2: FR-03 & FR-04 State
  const [issueMode, setIssueMode] = useState<'standard' | 'rush'>('standard');
  const [woNumber, setWoNumber] = useState('WO-2026-1049');
  const [issueQty, setIssueQty] = useState(600);
  const [woStandardDemand] = useState(500); // Standard BOM demand
  const [operatorName, setOperatorName] = useState('王大明 (成型一課)');
  const [issueHistory, setIssueHistory] = useState<any[]>([
    { id: 'TX-091', time: '14:20:11', wo: 'WO-2026-1041', sku: 'MAT-ABS-001', qty: 250, status: '過帳成功 (耗時 8 秒)', type: '一般工單' }
  ]);
  const [supervisorApproved, setSupervisorApproved] = useState(false);

  const handlePostIssue = () => {
    if (issueMode === 'standard') {
      if (!woNumber.trim()) {
        alert('依 FR-03 規定：標準領料必須綁定有效工單號！');
        return;
      }
      if (issueQty > woStandardDemand && !supervisorApproved) {
        alert(`超領防呆警告：工單需求為 ${woStandardDemand}，領料輸入為 ${issueQty}，超過標準需求！依規定需由生管/組長覆核才能過帳！`);
        return;
      }

      setIssueHistory(prev => [
        {
          id: `TX-${Math.floor(100 + Math.random() * 900)}`,
          time: new Date().toLocaleTimeString('zh-TW', { hour12: false }),
          wo: woNumber,
          sku: currentItem.sku,
          qty: issueQty,
          status: '即時過帳成功 (PDA 耗時 12 秒)',
          type: issueQty > woStandardDemand ? '超領 (主管已授權)' : '標準工單'
        },
        ...prev
      ]);
      setSupervisorApproved(false);
      confetti({ particleCount: 20, spread: 35 });
    } else {
      // Rush mode
      setIssueHistory(prev => [
        {
          id: `TX-${Math.floor(100 + Math.random() * 900)}`,
          time: new Date().toLocaleTimeString('zh-TW', { hour12: false }),
          wo: '【未補工單】',
          sku: currentItem.sku,
          qty: issueQty,
          status: '急單快速放行過帳 (限4小時內補齊工單號)',
          type: '急單通道 (倒數計時中)'
        },
        ...prev
      ]);
      confetti({ particleCount: 20, spread: 35 });
    }
  };

  // Sandbox 3: FR-05 Weighing state
  const [scaleNetWeight, setScaleNetWeight] = useState<number>(18.65);
  const [scaleGrossWeight, setScaleGrossWeight] = useState<number>(19.15);
  const [returnBatch, setReturnBatch] = useState('LOT-20261025-01');
  const [returnStatus, setReturnStatus] = useState<'可再用' | '待判定' | '報廢'>('可再用');
  const [printLabelPreview, setPrintLabelPreview] = useState(false);

  const handleReadScale = () => {
    const randomNet = Number((15 + Math.random() * 10).toFixed(2));
    setScaleNetWeight(randomNet);
    setScaleGrossWeight(Number((randomNet + 0.5).toFixed(2)));
    confetti({ particleCount: 10, spread: 30 });
  };

  // Sandbox 4: FR-08 Scheme A vs B
  const [schemeChoice, setSchemeChoice] = useState<'plan_a' | 'plan_b'>('plan_b');
  const [demoMainWarehouse, setDemoMainWarehouse] = useState(1000);
  const [demoLineSide, setDemoLineSide] = useState(0);
  const [demoReportedPcs, setDemoReportedPcs] = useState(0);

  const handleDemoIssueToLine = () => {
    if (demoMainWarehouse < 300) return;
    if (schemeChoice === 'plan_a') {
      // Scheme A: direct expense
      setDemoMainWarehouse(prev => prev - 300);
      setDemoLineSide(0); // not tracked
    } else {
      // Scheme B: line-side ledger transfer
      setDemoMainWarehouse(prev => prev - 300);
      setDemoLineSide(prev => prev + 300);
    }
    confetti({ particleCount: 15, spread: 30 });
  };

  const handleDemoReportWork = () => {
    if (schemeChoice === 'plan_b') {
      if (demoLineSide < 200) {
        alert('線邊倉料量不足！請先領料撥入線邊倉');
        return;
      }
      setDemoLineSide(prev => prev - 200);
      setDemoReportedPcs(prev => prev + 100);
    } else {
      setDemoReportedPcs(prev => prev + 100);
    }
    confetti({ particleCount: 15, spread: 30 });
  };

  const handleDemoReturnRest = () => {
    if (schemeChoice === 'plan_b') {
      if (demoLineSide <= 0) return;
      const rest = demoLineSide;
      setDemoMainWarehouse(prev => prev + rest);
      setDemoLineSide(0);
      alert(`退料完成！線邊剩餘 ${rest} kg 原料已安全調撥歸還主倉庫`);
    } else {
      alert('方案 A 因領料時已全部除帳，退料時需人工補做「無源退庫／盤盈調帳單」，易造成帳目混淆！');
    }
  };

  // Sandbox 5: FR-11 & FR-12 Cycle count state
  const [bookCount] = useState(2500);
  const [countedQty, setCountedQty] = useState(2470);
  const [diffReason, setDiffReason] = useState<string>('損耗');
  const [diffExplanation, setDiffExplanation] = useState('換模調機試模塑料損耗未在報工單中足額申報扣抵');
  const varianceQty = countedQty - bookCount; // -30
  const varianceAmount = varianceQty * 85; // NT$ -2550
  const [adjustmentSubmitted, setAdjustmentSubmitted] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Sandbox Sub-Navigation Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 flex flex-wrap gap-1.5 shadow-md">
        <button
          onClick={() => setActiveModuleTab('fr01')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeModuleTab === 'fr01'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>FR-01/02 庫存分層與預留</span>
        </button>

        <button
          onClick={() => setActiveModuleTab('fr03')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeModuleTab === 'fr03'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <ScanBarcode className="w-3.5 h-3.5" />
          <span>FR-03/04 領退料與急單通道</span>
        </button>

        <button
          onClick={() => setActiveModuleTab('fr05')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeModuleTab === 'fr05'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>FR-05 電子秤退料與標籤</span>
        </button>

        <button
          onClick={() => setActiveModuleTab('fr08')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeModuleTab === 'fr08'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <GitFork className="w-3.5 h-3.5" />
          <span>FR-08 線邊倉 A/B 方案模擬</span>
        </button>

        <button
          onClick={() => setActiveModuleTab('fr11')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeModuleTab === 'fr11'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <ClipboardCheck className="w-3.5 h-3.5" />
          <span>FR-11/12 循環盤點與盤差審核</span>
        </button>

        <button
          onClick={() => setActiveModuleTab('fr15')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeModuleTab === 'fr15'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <LineChart className="w-3.5 h-3.5" />
          <span>FR-15 庫存績效看板</span>
        </button>

        <button
          onClick={() => setActiveModuleTab('fr16')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeModuleTab === 'fr16'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>FR-16/17 AI 輔助規則</span>
        </button>
      </div>

      {/* ----------------- Sandbox 1: FR-01 & FR-02 ----------------- */}
      {activeModuleTab === 'fr01' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                  FR-01 & FR-02
                </span>
                <h3 className="text-base font-bold text-white">庫存分層查詢器與工單預留衝突試算</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                驗收標準：單一品項 3 秒內顯示 5 層庫存（可用量＝倉庫＋線邊倉−預留；加總等於帳面總量）；預留超量即時提示衝突工單。
              </p>
            </div>

            {/* Material selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">選擇示範品項：</span>
              <select
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 font-mono"
              >
                {inventoryList.map(item => (
                  <option key={item.sku} value={item.sku}>
                    [{item.sku}] {item.name} ({item.abc}級)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5-Layer Stock Display Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400 block">倉庫量 (實體大倉)</span>
              <div className="text-xl font-bold font-mono text-white mt-1">
                {currentItem.warehouseStock.toLocaleString()}
                <span className="text-xs font-normal text-slate-400 ml-1">{currentItem.unit}</span>
              </div>
              <span className="text-[10px] text-slate-400">儲位: {currentItem.location}</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400 block">線邊倉量 (機台旁)</span>
              <div className="text-xl font-bold font-mono text-sky-400 mt-1">
                {currentItem.lineSideStock.toLocaleString()}
                <span className="text-xs font-normal text-slate-400 ml-1">{currentItem.unit}</span>
              </div>
              <span className="text-[10px] text-slate-400">方案 B 獨立帳</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400 block">在途量 (採購已發)</span>
              <div className="text-xl font-bold font-mono text-slate-300 mt-1">
                {currentItem.inTransitStock.toLocaleString()}
                <span className="text-xs font-normal text-slate-400 ml-1">{currentItem.unit}</span>
              </div>
              <span className="text-[10px] text-slate-400">預計 2 日內入庫</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-rose-900/40">
              <span className="text-xs text-rose-300 block">已預留量 (排程工單)</span>
              <div className="text-xl font-bold font-mono text-rose-400 mt-1">
                {currentItem.reservedStock.toLocaleString()}
                <span className="text-xs font-normal text-slate-400 ml-1">{currentItem.unit}</span>
              </div>
              <span className="text-[10px] text-rose-400/80">3 張進行中工單鎖定</span>
            </div>

            <div className="bg-amber-950/30 p-3.5 rounded-lg border border-amber-500/50 col-span-2 sm:col-span-1">
              <span className="text-xs text-amber-300 font-bold block">可用量 (真正能用)</span>
              <div className={`text-2xl font-black font-mono mt-1 ${availableStock > 0 ? 'text-amber-400' : 'text-rose-500'}`}>
                {availableStock.toLocaleString()}
                <span className="text-xs font-normal text-amber-200 ml-1">{currentItem.unit}</span>
              </div>
              <span className="text-[10px] text-amber-300/80">＝ 倉庫＋線邊 − 預留</span>
            </div>
          </div>

          {/* Real-time Math Verification Check */}
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between text-xs font-mono gap-2 text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>帳面總量校驗：倉庫 ({currentItem.warehouseStock}) ＋ 線邊 ({currentItem.lineSideStock}) ＝ <strong>{totalBookStock} {currentItem.unit}</strong></span>
            </div>
            <div className="text-slate-400 text-[11px]">
              最後盤點：{currentItem.lastCountDate} ｜ 最後異動：{currentItem.lastMoveTime}
            </div>
          </div>

          {/* Test Order Reservation & Conflict Simulation */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/80 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>工單建立預留與衝突提示測試</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">工單需求用量 ({currentItem.unit})：</label>
                <input
                  type="number"
                  value={newOrderDemand}
                  onChange={(e) => setNewOrderDemand(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 block mb-1">若為急單插單，請輸入原因：</label>
                <input
                  type="text"
                  value={rushReason}
                  onChange={(e) => setRushReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Warning if shortage */}
            {isShortage && (
              <div className="bg-rose-950/40 border border-rose-800/60 rounded-lg p-3 text-xs text-rose-300 flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">庫存不足警示！可用量 {availableStock} {currentItem.unit} 小於需求 {newOrderDemand} {currentItem.unit} (缺口: {newOrderDemand - availableStock} {currentItem.unit})</div>
                  <div className="text-rose-300/80">
                    目前鎖定庫存之衝突工單：<strong>工單 WO-2026-088 (已預留 1,200 kg)、WO-2026-092 (已預留 600 kg)</strong>。
                    一般工單不得超量預留；若為急單插單需主管特許授權並留存紀錄。
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                disabled={isShortage}
                onClick={() => handleSimulateReservation(false)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isShortage
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                }`}
              >
                一般排程預留物料
              </button>

              <button
                onClick={() => handleSimulateReservation(true)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-colors cursor-pointer"
              >
                特許急單插單 (強制預留並記錄原因)
              </button>
            </div>

            {/* Audit Logs */}
            {conflictLogs.length > 0 && (
              <div className="border-t border-slate-700/60 pt-3 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 block">異動與審計日誌 (Audit Trail)：</span>
                {conflictLogs.map(log => (
                  <div key={log.id} className="text-[11px] font-mono text-slate-300 bg-slate-950 p-2 rounded border border-slate-800 flex items-center justify-between">
                    <span>{log.text}</span>
                    <span className="text-slate-500">{log.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- Sandbox 2: FR-03 & FR-04 ----------------- */}
      {activeModuleTab === 'fr03' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                FR-03 & FR-04 & FR-06
              </span>
              <h3 className="text-base font-bold text-white">領退料綁工單、掃碼即時過帳與急單快速通道</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              規則驗收：無工單不得領料；急單簡化登記限時 4 小時補單；PDA 掃碼 30 秒內完成即時扣帳；超領強制主管確認。
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIssueMode('standard')}
              className={`flex-1 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                issueMode === 'standard'
                  ? 'bg-amber-500/10 border-amber-500/60 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-amber-300">模式 A：標準工單領料 (常態管制)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">必須帶出有效工單號，比對 BOM 用量，超領防呆攔截</div>
            </button>

            <button
              onClick={() => setIssueMode('rush')}
              className={`flex-1 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                issueMode === 'rush'
                  ? 'bg-rose-500/10 border-rose-500/60 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-rose-400">模式 B：急單快速通道 (先簡化登記)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">未開立工單前緊急放料，系統自動啟動 4 小時限時補單警報</div>
            </button>
          </div>

          {/* Interactive Form */}
          <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {issueMode === 'standard' ? (
                <div>
                  <label className="text-xs text-slate-400 block mb-1">生產工單號 (WO#)：</label>
                  <input
                    type="text"
                    value={woNumber}
                    onChange={(e) => setWoNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                    placeholder="輸入工單號如 WO-2026-1049"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">BOM 標準需求量：{woStandardDemand} kg</span>
                </div>
              ) : (
                <div>
                  <label className="text-xs text-rose-300 block mb-1">急單登記領用人 / 組別：</label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    className="w-full bg-slate-900 border border-rose-900/60 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                  <span className="text-[10px] text-rose-400/90 mt-1 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>倒數時限：4 小時 (超期未補將自動通報生管經理)</span>
                  </span>
                </div>
              )}

              <div>
                <label className="text-xs text-slate-400 block mb-1">領取物料品項：</label>
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-amber-200 font-mono">
                  {currentItem.sku} ({currentItem.name})
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">實領數量 (kg)：</label>
                <input
                  type="number"
                  value={issueQty}
                  onChange={(e) => setIssueQty(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Over-issue alert if in standard mode */}
            {issueMode === 'standard' && issueQty > woStandardDemand && (
              <div className="bg-amber-950/40 border border-amber-700/60 rounded-lg p-3 text-xs text-amber-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    超領警告：領料量 {issueQty} kg 超過工單需求 {woStandardDemand} kg (超領 {issueQty - woStandardDemand} kg)！
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer bg-slate-900 px-2.5 py-1 rounded border border-amber-600/50">
                  <input
                    type="checkbox"
                    checked={supervisorApproved}
                    onChange={(e) => setSupervisorApproved(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span className="text-[11px] font-bold text-amber-300">生管組長已覆核同意</span>
                </label>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <ScanBarcode className="w-4 h-4 text-emerald-400" />
                <span>模擬手持 PDA 掃描批號條碼 [LOT-20261025-01]</span>
              </div>

              <button
                onClick={handlePostIssue}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md cursor-pointer transition-colors"
              >
                確認掃碼過帳 (立即扣帳)
              </button>
            </div>
          </div>

          {/* Posting Logs Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400">過帳紀錄與未結追蹤：</span>
            <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <th className="py-2 px-3">單號</th>
                    <th className="py-2 px-3">時間</th>
                    <th className="py-2 px-3">工單號</th>
                    <th className="py-2 px-3">料號</th>
                    <th className="py-2 px-3">數量</th>
                    <th className="py-2 px-3">類型</th>
                    <th className="py-2 px-3">過帳狀態</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {issueHistory.map(row => (
                    <tr key={row.id} className="hover:bg-slate-900/50">
                      <td className="py-2 px-3 text-amber-400">{row.id}</td>
                      <td className="py-2 px-3 text-slate-400">{row.time}</td>
                      <td className="py-2 px-3 text-slate-200">{row.wo}</td>
                      <td className="py-2 px-3 text-slate-300">{row.sku}</td>
                      <td className="py-2 px-3 text-white">{row.qty} kg</td>
                      <td className="py-2 px-3 text-amber-300">{row.type}</td>
                      <td className="py-2 px-3 text-emerald-400 font-sans">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- Sandbox 3: FR-05 ----------------- */}
      {activeModuleTab === 'fr05' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                FR-05
              </span>
              <h3 className="text-base font-bold text-white">退料秤重、狀態判定與標籤自動列印</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              規則驗收：退料單必填精確重量（可連線電子秤自動帶入）與物料狀態；現場即時印出含批號與條碼之退料識別標籤。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scale Simulator Form */}
            <div className="space-y-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  <span>電子秤即時通訊 (RS-232 / 藍芽直連)</span>
                </span>
                <button
                  onClick={handleReadScale}
                  className="px-2.5 py-1 rounded bg-sky-600/20 text-sky-300 border border-sky-500/40 text-[11px] hover:bg-sky-600/30 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>讀取電子秤數值</span>
                </button>
              </div>

              {/* Digital Scale LED screen */}
              <div className="bg-black/90 p-4 rounded-lg border border-slate-700 font-mono text-center space-y-1">
                <span className="text-[10px] text-slate-500 tracking-wider">ELECTRONIC SCALE NET WEIGHT</span>
                <div className="text-3xl font-bold text-emerald-400 tracking-widest">
                  {scaleNetWeight.toFixed(2)} <span className="text-sm">KG</span>
                </div>
                <div className="text-[11px] text-slate-400">毛重: {scaleGrossWeight.toFixed(2)} kg ｜ 皮重: 0.50 kg</div>
              </div>

              {/* Status Classification */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">退料物料狀態判定 (必填)：</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['可再用', '待判定', '報廢'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => setReturnStatus(st)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        returnStatus === st
                          ? st === '可再用'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                            : st === '待判定'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">原料批號 (LOT#)：</label>
                <input
                  type="text"
                  value={returnBatch}
                  onChange={(e) => setReturnBatch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={() => {
                  setPrintLabelPreview(true);
                  confetti({ particleCount: 20, spread: 35 });
                }}
                className="w-full py-2.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md cursor-pointer transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>生成並列印退料條碼標籤</span>
              </button>
            </div>

            {/* Industrial Barcode Label Preview */}
            <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 flex flex-col justify-center items-center">
              <span className="text-xs text-slate-400 mb-3">條碼標籤機輸出預覽 (100mm × 80mm 工業標籤)</span>
              
              <div className="bg-white text-slate-950 p-4 rounded-md shadow-2xl w-full max-w-sm border-2 border-slate-300 space-y-2 font-sans">
                <div className="flex items-center justify-between border-b-2 border-black pb-1">
                  <span className="font-bold text-sm">物料退料標識卡 (RETURN TICKET)</span>
                  <span className={`px-2 py-0.5 text-xs font-black rounded ${
                    returnStatus === '可再用' ? 'bg-emerald-200 text-emerald-900' : returnStatus === '待判定' ? 'bg-amber-200 text-amber-900' : 'bg-red-200 text-red-900'
                  }`}>
                    {returnStatus}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  <div><strong>料號：</strong> {currentItem.sku}</div>
                  <div><strong>品名：</strong> {currentItem.name}</div>
                  <div className="flex justify-between">
                    <span><strong>批號：</strong> {returnBatch}</span>
                    <span><strong>原儲位：</strong> {currentItem.location}</span>
                  </div>
                  <div className="bg-slate-100 p-2 rounded border border-slate-300 flex justify-between items-center">
                    <span className="text-xs text-slate-600">實秤淨重 (NET WT)</span>
                    <span className="text-xl font-black font-mono">{scaleNetWeight.toFixed(2)} KG</span>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div className="pt-2 text-center">
                  <div className="h-10 bg-slate-900 flex items-center justify-center text-white text-[10px] font-mono tracking-widest">
                    ||||||| | ||||| || |||||||| |||| | |||||
                  </div>
                  <div className="text-[10px] font-mono text-slate-600 mt-0.5">
                    *{currentItem.sku}-{returnBatch}-{scaleNetWeight.toFixed(2)}*
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 border-t border-slate-300 pt-1">
                  <span>檢核人：倉管員 (張小玲)</span>
                  <span>時間：{new Date().toLocaleDateString('zh-TW')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- Sandbox 4: FR-08 ----------------- */}
      {activeModuleTab === 'fr08' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                FR-08 (關鍵決策 #2)
              </span>
              <h3 className="text-base font-bold text-white">線邊倉帳管理：方案 A vs 方案 B 流程實戰對比</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              規則：方案 A「領到線邊即視為消耗」 vs 方案 B「另設線邊倉帳，生產報工時才扣帳」。透過動態操作體驗兩者在庫存透明度與退料上的根本差異！
            </p>
          </div>

          {/* Scheme Switcher */}
          <div className="flex items-center justify-center bg-slate-950 p-1 rounded-xl border border-slate-800 max-w-md mx-auto">
            <button
              onClick={() => {
                setSchemeChoice('plan_a');
                setDemoMainWarehouse(1000);
                setDemoLineSide(0);
                setDemoReportedPcs(0);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                schemeChoice === 'plan_a' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              方案 A (領料即消耗)
            </button>
            <button
              onClick={() => {
                setSchemeChoice('plan_b');
                setDemoMainWarehouse(1000);
                setDemoLineSide(0);
                setDemoReportedPcs(0);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                schemeChoice === 'plan_b' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              方案 B (線邊倉帳＋報工扣帳 - 推薦)
            </button>
          </div>

          {/* Live Inventory Simulation Visualization */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">主倉庫存量 (Main W/H)</span>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {demoMainWarehouse} kg
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">原料大倉帳面</span>
            </div>

            <div className={`p-4 rounded-xl border text-center transition-all ${
              schemeChoice === 'plan_b' ? 'bg-sky-950/40 border-sky-600' : 'bg-slate-950/40 border-slate-800 opacity-60'
            }`}>
              <span className="text-xs block text-sky-300">
                線邊倉帳面量 (Line-side)
              </span>
              <div className="text-2xl font-bold font-mono text-sky-400 mt-1">
                {demoLineSide} kg
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {schemeChoice === 'plan_b' ? '獨立儲位帳 (報工才扣)' : '方案 A 不立帳 (機台旁成盲區)'}
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">累計報工完工產出</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {demoReportedPcs} pcs
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">已入庫成品</span>
            </div>
          </div>

          {/* Simulation Action Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleDemoIssueToLine}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 border border-slate-600 cursor-pointer flex items-center gap-1.5"
            >
              <span>1. 發料 300kg 到機台線邊</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>

            <button
              onClick={handleDemoReportWork}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 border border-slate-600 cursor-pointer flex items-center gap-1.5"
            >
              <span>2. 機台報工生產 100 pcs (耗 200kg)</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </button>

            <button
              onClick={handleDemoReturnRest}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 cursor-pointer flex items-center gap-1.5"
            >
              <span>3. 工單結案退回剩餘料</span>
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Comparison conclusion callout */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
            <div className="font-bold text-amber-300">專家評估分析：</div>
            <p>
              • <strong>方案 A 致命缺點：</strong> 一發料帳面就直接歸零。機台旁常常堆放數十萬元的原料不在系統帳上，業務不敢接單、生管重複採購，月底盤點時線邊剩料因沒有來源帳目，只能用「盤盈」胡亂調帳。
            </p>
            <p>
              • <strong>方案 B 實踐價值：</strong> 發料至機台屬於「庫別調撥 (Transfer)」，系統隨時掌握線邊儲位餘量。產線報工完成多少自動扣抵線邊料（倒扣 Backflush），剩餘原料直接回撥大倉，帳實完全閉環！
            </p>
          </div>
        </div>
      )}

      {/* ----------------- Sandbox 5: FR-11 & FR-12 ----------------- */}
      {activeModuleTab === 'fr11' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                FR-11 & FR-12
              </span>
              <h3 className="text-base font-bold text-white">ABC 循環盤點排程與盤差原因調帳審批防呆</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              規則驗收：A 級週盤、B 級月盤、C 級季盤；盤差超過容許值強制選取原因（無原因不得過帳）；依金額級距自動呈送主管簽核。
            </p>
          </div>

          <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-xs text-slate-400 block">盤點品項與等級：</span>
                <span className="text-xs font-bold text-white block mt-1">ABS 塑膠粒 757G (A 級週盤)</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">帳面庫存量：</span>
                <span className="text-xs font-bold font-mono text-white block mt-1">{bookCount} kg</span>
              </div>
              <div>
                <label className="text-xs text-amber-300 font-bold block mb-1">PDA 輸入實盤量 (kg)：</label>
                <input
                  type="number"
                  value={countedQty}
                  onChange={(e) => {
                    setCountedQty(Number(e.target.value));
                    setAdjustmentSubmitted(false);
                  }}
                  className="w-full bg-slate-900 border border-amber-500/50 rounded-lg p-1.5 text-xs font-mono text-white focus:outline-none"
                />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">盤差與金額：</span>
                <span className={`text-xs font-bold font-mono block mt-1 ${varianceQty < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {varianceQty > 0 ? `+${varianceQty}` : varianceQty} kg (NT$ {varianceAmount.toLocaleString()})
                </span>
              </div>
            </div>

            {/* Mandatory Reason Selection */}
            {varianceQty !== 0 && (
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <ShieldAlert className="w-4 h-4" />
                  <span>盤差超過容許值 (±0.5%)！依 FR-12 規定必須強制選擇原因：</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {['未入帳', '誤領', '損耗', '換算', '放錯位置', '其他'].map(rs => (
                    <button
                      key={rs}
                      onClick={() => setDiffReason(rs)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        diffReason === rs
                          ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                          : 'bg-slate-950 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      {rs}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">具體原因陳述與追蹤改善措施：</label>
                  <input
                    type="text"
                    value={diffExplanation}
                    onChange={(e) => setDiffExplanation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span>
                      簽核路徑：盤差金額 NT$ {Math.abs(varianceAmount)} (≤ 3,000 元) ➔ <strong>倉管組長核准即可過帳</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setAdjustmentSubmitted(true);
                      confetti({ particleCount: 20, spread: 40 });
                    }}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors shadow-md cursor-pointer"
                  >
                    送出調帳核准申請
                  </button>
                </div>

                {adjustmentSubmitted && (
                  <div className="bg-emerald-950/40 border border-emerald-800 p-2.5 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>已通過組長審批！帳面庫存已由 2,500 kg 校正為 2,470 kg，已建立「損耗未足額報扣」追蹤改善項目。</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- Sandbox 6: FR-15 ----------------- */}
      {activeModuleTab === 'fr15' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                FR-15
              </span>
              <h3 className="text-base font-bold text-white">庫存績效儀表板 (KPI Dashboard)</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              彙整全廠庫存準確率、毛盤差/淨盤差金額、盤差原因佔比與未結單據逾時監控。
            </p>
          </div>

          {/* 4 Big KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">抽盤庫存準確率 (IRA)</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">98.4%</div>
              <div className="text-[11px] text-slate-400 mt-1">目標: ≥ 98.0% (A級標準)</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">本月毛盤差金額 (絕對值)</span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">NT$ 18,500</div>
              <div className="text-[11px] text-slate-400 mt-1">上月: NT$ 42,000 (改善 56%)</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">本月淨盤差金額 (損益)</span>
              <div className="text-2xl font-bold font-mono text-slate-300 mt-1">-NT$ 2,300</div>
              <div className="text-[11px] text-slate-400 mt-1">盤虧微幅小於盤盈</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/40">
              <span className="text-xs text-rose-300">當前未結單據 (FR-06)</span>
              <div className="text-2xl font-bold font-mono text-rose-400 mt-1">3 張</div>
              <div className="text-[11px] text-rose-400/80 mt-1">1 件急單、2 件未補報工</div>
            </div>
          </div>

          {/* Cause Breakdown & Action */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white block">盤差根因分佈統計 (原因佔比)：</span>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>換模與開機損耗未計 (FR-07)</span>
                    <span className="font-mono text-amber-400">42% (NT$ 7,770)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[42%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>口頭先拿未即時掃碼 (FR-03/04)</span>
                    <span className="font-mono text-rose-400">28% (NT$ 5,180)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-[28%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>單位換算搞錯 (包/kg) (FR-09)</span>
                    <span className="font-mono text-sky-400">18% (NT$ 3,330)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full w-[18%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>儲位放錯 (FR-13)</span>
                    <span className="font-mono text-slate-400">12% (NT$ 2,220)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-slate-500 h-full w-[12%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white block">未結單據與異常閉環改善進度 (FR-14)：</span>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-rose-400 font-bold font-mono">[急單逾時 4.2h]</span>
                    <span className="text-slate-300 ml-1.5">ABS黑料 200kg (領用: 許組長)</span>
                  </div>
                  <span className="text-[11px] text-amber-400">已自動推播生管</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-amber-400 font-bold font-mono">[未補報工 18h]</span>
                    <span className="text-slate-300 ml-1.5">中框射出件 WO-1029</span>
                  </div>
                  <span className="text-[11px] text-slate-400">通知成型二班</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-emerald-400 font-bold font-mono">[已結案]</span>
                    <span className="text-slate-300 ml-1.5">PC料單位換算錯誤修正對策</span>
                  </div>
                  <span className="text-[11px] text-emerald-400">結案率 92.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- Sandbox 7: FR-16 & FR-17 ----------------- */}
      {activeModuleTab === 'fr16' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-800 px-2 py-0.5 rounded">
                FR-16 & FR-17
              </span>
              <h3 className="text-base font-bold text-white">AI 盤差原因輔助判斷與 BOM 損耗修正建議</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              階段三進階功能：透過交叉比對異動日誌，AI 自動抓出可疑假性盤差，並根據累積 6 個月實際報工耗料，推算 BOM 標準修正建議。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* FR-16 Suspicious Ledger Finder */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>FR-16 AI 可疑單據比對演算法</span>
              </div>
              <p className="text-xs text-slate-400">
                AI 比對了近 30 天 1,420 筆單據流水，發現以下高度可疑假性盤差：
              </p>

              <div className="space-y-2">
                <div className="bg-slate-900 p-3 rounded-lg border border-indigo-900/40 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span>1. 疑似重複過帳 (重複扣料)</span>
                    <span className="text-indigo-400 font-mono">信賴度 94%</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    單號 TX-8821 與 TX-8822 於 14:02:10 與 14:02:18 連續發料 ABS 塑膠粒 50kg，操作人同為 PDA-03，建議會同人員核實。
                  </p>
                </div>

                <div className="bg-slate-900 p-3 rounded-lg border border-indigo-900/40 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span>2. 單位異常跳級</span>
                    <span className="text-indigo-400 font-mono">信賴度 89%</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    包材箱號 PKG-BOX-880 領料 25 單位，歷史均值為 250~500 件，可能作業員誤將「1包(25件)」輸成「25件」。
                  </p>
                </div>
              </div>
            </div>

            {/* FR-17 BOM Loss Correction Suggestion */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>FR-17 損耗率大數據回饋與 BOM 修正建議</span>
              </div>
              <p className="text-xs text-slate-400">
                以最近 20 批實際報工損耗數據推算，標準 BOM 與現場存在系統性落差：
              </p>

              <div className="bg-slate-900 p-3.5 rounded-lg border border-indigo-900/40 text-xs space-y-2">
                <div className="font-bold text-white">品項：PC 高衝擊光學級 (MAT-PC-302)</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-slate-400 block">現有 BOM 標準損耗</span>
                    <span className="text-rose-400 font-bold">1.5%</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-slate-400 block">AI 統計實際損耗率</span>
                    <span className="text-emerald-400 font-bold">3.1% (含開機換模)</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  建議修正：現行 BOM 低估損耗 1.6%，導致生產結案時持續產生物料負盤差。建議將標準損耗率調整為 3.0%，需由生管與品管雙簽生效。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
