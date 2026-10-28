import React from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  History, 
  Database, 
  WifiOff, 
  Target, 
  Layers, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { FunctionalRequirement, DecisionItem } from '../data/specData';
import { exportToWord, generateMarkdownDoc } from '../utils/exportUtils';
import confetti from 'canvas-confetti';

interface PrdDocumentViewProps {
  items: FunctionalRequirement[];
  decisions: DecisionItem[];
}

export const PrdDocumentView: React.FC<PrdDocumentViewProps> = ({ items, decisions }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyMarkdown = () => {
    const md = generateMarkdownDoc(items, decisions);
    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      confetti({ particleCount: 30, spread: 50 });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const p1Items = items.filter(i => i.priority === 'P1');
  const p2Items = items.filter(i => i.priority === 'P2');
  const p3Items = items.filter(i => i.priority === 'P3');

  // Group by module
  const moduleGroups = [
    { id: 'A', name: '模組 A：庫存查詢與預留', desc: '解決「庫存不準、不敢用、急單打亂預留」' },
    { id: 'B', name: '模組 B：領退料', desc: '解決「先拿後補、口頭領料、退料未秤重無標籤、補單無期限」' },
    { id: 'C', name: '模組 C：損耗、線邊倉與主檔', desc: '解決「機台旁料不在帳上、損耗靠估算、單位換算錯誤」' },
    { id: 'D', name: '模組 D：盤點與盤差', desc: '解決「月盤才驗證一次、盤差查無原因、調帳無管控」' },
    { id: 'E', name: '模組 E：儲位與批號', desc: '解決「找料過久、非先進先出、批號無法追溯」' },
    { id: 'F', name: '模組 F：回報與指標', desc: '解決「反映了沒人處理、看不到改善成效」' },
    { id: 'G', name: '模組 G：AI 輔助（資料穩定後）', desc: '解決「歷史盤差模式比對、BOM 與實耗自動修正建議」' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Document Action Toolbar */}
      <div className="no-print bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div>
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>規格書文件檢視與交付匯出 (PRD / SRS)</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            符合軟體工程需求規格標準，可直接提供給內部 IT 團隊或外部 MES/ERP 廠商對照簽核
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              exportToWord(items, decisions);
              confetti({ particleCount: 25, spread: 45 });
            }}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 shadow-sm cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>匯出 Word (.doc)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600 cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>列印 / 存為 PDF</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600 cursor-pointer transition-colors"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? '已複製' : 'Markdown'}</span>
          </button>
        </div>
      </div>

      {/* Printable Document Sheet Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl text-slate-200 space-y-10 print-card print:border-none print:shadow-none print:p-0">
        
        {/* Cover / Title Block */}
        <div className="border-b border-slate-800 pb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
            <span>文件代碼：PRD-INV-2026-v1.0</span>
            <span>更新時間：{new Date().toLocaleDateString('zh-TW')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            製造業庫存精準化與生產物料管理系統功能規格書
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            本文件將現場痛點「庫存不準、先拿後補、口頭領料、線邊料不入帳、盤差查無原因」轉換為 17 項可量化驗收的系統功能規格。規格設計採中立架構，可作為現有 ERP 模組升級或即將引進之 MES 系統之實施規範與驗收底稿。
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 block">功能需求數量</span>
              <span className="text-base font-bold text-amber-400 font-mono">17 項 (FR-01~17)</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 block">核心第一優先</span>
              <span className="text-base font-bold text-rose-400 font-mono">P1 共 10 項</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 block">第一階段實施</span>
              <span className="text-base font-bold text-emerald-400 font-mono">10 項 (規則主檔)</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 block">涵蓋關係利害人</span>
              <span className="text-xs font-semibold text-slate-300">生管、業務、倉管、產線、會計</span>
            </div>
          </div>
        </div>

        {/* Section 1: 規格總表 (FR-01 ~ FR-17) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-l-4 border-amber-500 pl-3">
            <h2 className="text-lg font-bold text-white">一、規格總表 (Functional Requirements)</h2>
            <span className="text-xs text-slate-400 font-mono">模組 A 至 G</span>
          </div>

          <div className="space-y-8">
            {moduleGroups.map(mod => {
              const modItems = items.filter(i => i.moduleId === mod.id);
              if (modItems.length === 0) return null;

              return (
                <div key={mod.id} className="space-y-3">
                  <div className="bg-slate-800/60 px-3.5 py-2 rounded-lg border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-amber-300">{mod.name}</span>
                      <span className="text-xs text-slate-400 ml-2">({mod.desc})</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{modItems.length} 項規格</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-slate-800/90 text-slate-300 font-medium">
                          <th className="py-2.5 px-3 w-16 text-center">編號</th>
                          <th className="py-2.5 px-3 w-32">功能名稱</th>
                          <th className="py-2.5 px-3 w-28 text-slate-400">對應問題</th>
                          <th className="py-2.5 px-3 w-20">使用者</th>
                          <th className="py-2.5 px-3 min-w-[240px]">功能說明與業務規則</th>
                          <th className="py-2.5 px-3 min-w-[220px] bg-slate-800/40">驗收標準 (依現況可調整)</th>
                          <th className="py-2.5 px-2 w-12 text-center">優先</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {modItems.map(item => (
                          <tr key={item.id} className="hover:bg-slate-800/30">
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-400 align-top">
                              {item.id}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-white align-top">
                              {item.name}
                            </td>
                            <td className="py-2.5 px-3 text-rose-300 align-top">
                              {item.problem}
                            </td>
                            <td className="py-2.5 px-3 text-slate-300 align-top">
                              {item.users.join('、')}
                            </td>
                            <td className="py-2.5 px-3 text-slate-300 align-top leading-relaxed">
                              {item.rules}
                              {item.notes && (
                                <div className="text-[11px] text-slate-400 mt-1 italic">
                                  備註：{item.notes}
                                </div>
                              )}
                            </td>
                            <td className="py-2.5 px-3 bg-amber-950/10 text-amber-200/90 align-top border-l border-r border-amber-900/20 leading-relaxed font-sans">
                              {item.criteria}
                            </td>
                            <td className="py-2.5 px-2 text-center align-top font-mono font-bold">
                              <span className={item.priority === 'P1' ? 'text-rose-400' : item.priority === 'P2' ? 'text-amber-400' : 'text-indigo-400'}>
                                {item.priority}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: 共通要求 */}
        <section className="space-y-4 print-page-break">
          <div className="flex items-center justify-between border-l-4 border-sky-500 pl-3">
            <h2 className="text-lg font-bold text-white">二、共通要求 (System-Wide Non-Functional Requirements)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>1. 權限分離與簽核防呆 (RBAC)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                領料過帳、盤差調帳、損耗參數維護、計量單位換算必須落實分開授權。盤差調帳需依金額級距由權責主管核准；超過工單標準數量之領料需主管強制確認。
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
                <History className="w-4 h-4" />
                <span>2. 不可竄改稽核紀錄 (Audit Trail)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                所有庫存異動、盤差調帳、主檔與參數修改，系統均需自動記錄操作人員、時間戳記、修改前值與修改後值。系統內嚴禁提供物理刪除功能，確保歷程可回溯。
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
                <Database className="w-4 h-4" />
                <span>3. 資料保存與調閱合規</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                單據與盤點紀錄依公司制度及會計審計規範妥善保存（建議至少保存 5 年），並支援快速匯出歷史對帳清單與異動日誌。
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
                <WifiOff className="w-4 h-4" />
                <span>4. 離線與現場網路韌性</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                倉庫與車間若存在金屬貨架屏蔽或網路不穩死角，手持掃碼裝置（PDA）需能離線暫存資料，於恢復連線時自動重送過帳，並防止因斷線重試造成重複扣帳。
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: 指標定義 (KPI) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-l-4 border-emerald-500 pl-3">
            <h2 className="text-lg font-bold text-white">三、核心績效指標定義 (KPI)</h2>
            <span className="text-xs text-slate-400 font-mono">暫訂值，按廠況調整</span>
          </div>

          <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <Target className="w-4 h-4" />
                <span>指標一：庫存準確率 (Inventory Record Accuracy, IRA)</span>
              </div>
              <div className="mt-2 bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-amber-300">
                庫存準確率 ＝ ( 抽盤品項中，帳實差異在容許範圍內的品項數 ) ÷ ( 抽盤品項總數 ) × 100%
              </div>
              <p className="text-xs text-slate-400 mt-2">
                <strong>容許範圍分級規則：</strong> A 級料品項差異 ≤ ±0.5%，B 級料品項差異 ≤ ±2.0%，C 級料品項差異 ≤ ±5.0%。
              </p>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <Target className="w-4 h-4" />
                <span>指標二：盤差金額 (Gross & Net Inventory Variance)</span>
              </div>
              <div className="mt-2 bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-amber-300 space-y-1">
                <div>毛盤差金額 (絕對值合計) ＝ ∑ | 實盤數量 − 帳面數量 | × 單價 (反映管理失誤總量)</div>
                <div>淨盤差金額 (損益合計) ＝ ∑ ( 實盤數量 − 帳面數量 ) × 單價 (反映財務盤盈虧淨額)</div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <Clock className="w-4 h-4" />
                <span>指標三：未結單據與異常結案時效</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                逾越約定時限（如急單領料超過 4 小時未補工單、生產報工逾 24 小時未登錄、進貨超期未入帳）之單據數。每日晨會檢討逾期清單，並追蹤異常單閉環結案率。
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: 建議導入順序 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-l-4 border-amber-500 pl-3">
            <h2 className="text-lg font-bold text-white">四、建議導入順序 (Roadmap)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/70 p-4 rounded-xl border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                  第一階段 (Phase 1)
                </span>
                <span className="text-xs text-slate-400">即刻啟動</span>
              </div>
              <h3 className="text-sm font-bold text-white">規則與主檔建立</h3>
              <p className="text-xs text-slate-400">
                Excel 或現有 ERP 即可做，不需等待購置新手持硬體。
              </p>
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 font-mono text-amber-300">
                  <span>FR-03、06、07、08、09、10、11、12、14、FR-01基本版</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  重點：領料先立規矩、盤點改動態循環、單位換算強制落實、確認線邊倉制度。
                </p>
              </div>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-sky-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 border border-sky-800 px-2 py-0.5 rounded">
                  第二階段 (Phase 2)
                </span>
                <span className="text-xs text-slate-400">與 MES 同步</span>
              </div>
              <h3 className="text-sm font-bold text-white">現場系統化與設備串接</h3>
              <p className="text-xs text-slate-400">
                引進現場條碼、PDA 掃碼領退料、電子秤與績效儀表板。
              </p>
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 font-mono text-sky-300">
                  <span>FR-02、04、05、13、15</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  重點：消除補登延遲，現場 30 秒掃碼即時過帳，退料連秤列印，先進先出防呆。
                </p>
              </div>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-xl border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/60 border border-indigo-800 px-2 py-0.5 rounded">
                  第三階段 (Phase 3)
                </span>
                <span className="text-xs text-slate-400">資料成熟後</span>
              </div>
              <h3 className="text-sm font-bold text-white">AI 與統計智慧輔助</h3>
              <p className="text-xs text-slate-400">
                累積 6 個月以上乾淨單據後啟動演算法模型。
              </p>
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 font-mono text-indigo-300">
                  <span>FR-16、17</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  重點：輔助抓出可疑假性盤差（重複過帳/換算異常），自動比對推算 BOM 修正建議。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: 待確認事項 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-l-4 border-rose-500 pl-3">
            <h2 className="text-lg font-bold text-white">五、待確認事項評估 (5 大關鍵決策)</h2>
          </div>

          <div className="space-y-3">
            {decisions.map(d => {
              const selected = d.options.find(o => o.value === d.currentChoice) || d.options[0];
              return (
                <div key={d.id} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">
                      {d.id}. {d.title}
                    </span>
                    <span className="text-xs text-amber-400 font-mono">影響：{d.targetFRs.join(', ')}</span>
                  </div>
                  <p className="text-xs text-slate-400">{d.question}</p>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 text-xs">
                    <span className="text-amber-300 font-semibold">當前方案：</span>
                    <span className="text-slate-200 ml-1">{selected.label}</span>
                    <p className="text-slate-400 text-[11px] mt-1">{selected.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};
