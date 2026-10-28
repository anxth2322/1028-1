export interface FunctionalRequirement {
  id: string; // e.g., 'FR-01'
  moduleId: string; // 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
  moduleName: string; // '庫存查詢與預留', etc.
  name: string; // '庫存分層查詢'
  problem: string; // '庫存不準、不敢用'
  users: string[]; // ['生管', '業務']
  rules: string; // 功能說明與規則
  criteria: string; // 驗收標準 (可調整)
  defaultCriteria: string; // 原始標準
  priority: 'P1' | 'P2' | 'P3';
  phase: 1 | 2 | 3;
  suggestedSystem: 'ERP 現有' | 'MES 導入' | '客製開發 / 整合';
  status: 'ERP 已具備' | 'ERP 需微調' | 'MES 需涵蓋' | '待確認' | '已驗收';
  notes: string;
}

export const INITIAL_SPEC_DATA: FunctionalRequirement[] = [
  // 模組 A：庫存查詢與預留
  {
    id: 'FR-01',
    moduleId: 'A',
    moduleName: '模組 A：庫存查詢與預留',
    name: '庫存分層查詢',
    problem: '庫存不準、不敢用',
    users: ['生管', '業務'],
    rules: '依品項顯示：倉庫量、線邊倉量、在途量、已預留量、可用量（可用量＝倉庫＋線邊倉−預留）；每筆標示最後盤點日與最後異動時間。',
    criteria: '單一品項查詢 3 秒內顯示；各層數字加總等於帳面總量。',
    defaultCriteria: '單一品項查詢 3 秒內顯示；各層數字加總等於帳面總量。',
    priority: 'P1',
    phase: 1,
    suggestedSystem: 'ERP 現有',
    status: 'ERP 需微調',
    notes: '若目前為階段一，可先以 ERP 報表或 SQL 視圖呈現基本版。'
  },
  {
    id: 'FR-02',
    moduleId: 'A',
    moduleName: '模組 A：庫存查詢與預留',
    name: '庫存預留與衝突提示',
    problem: '急單打亂庫存',
    users: ['生管', '業務'],
    rules: '工單或訂單建立時預留物料；預留超過可用量時提示缺料並顯示衝突的工單；急單可插單但需註明原因與授權主管。',
    criteria: '預留量即時反映在 FR-01；插單留有完整異動審計紀錄。',
    defaultCriteria: '預留量即時反映在 FR-01；插單留有完整異動審計紀錄。',
    priority: 'P2',
    phase: 2,
    suggestedSystem: 'MES 導入',
    status: '待確認',
    notes: '急單插單需連動推播警示給原被佔用工單之生管負責人。'
  },

  // 模組 B：領退料
  {
    id: 'FR-03',
    moduleId: 'B',
    moduleName: '模組 B：領退料',
    name: '領退料綁工單',
    problem: '先拿後補、口頭領料',
    users: ['倉管', '產線'],
    rules: '領料、退料必須有工單號；無工單者不得領料，但可走「急單快速流程」：先簡化登記（品項、數量、領用人），限時內（如4小時）補齊工單。',
    criteria: '無工單且未走快速流程時系統不允許過帳；快速流程單據逾時有視覺警示標記與通知。',
    defaultCriteria: '無工單且未走快速流程時系統不允許過帳；快速流程單據逾時有視覺警示標記與通知。',
    priority: 'P1',
    phase: 1,
    suggestedSystem: 'ERP 現有',
    status: 'ERP 需微調',
    notes: '需設定急單快速流程之開單權限與追蹤期限（待確認事項 5）。'
  },
  {
    id: 'FR-04',
    moduleId: 'B',
    moduleName: '模組 B：領退料',
    name: '掃碼領退料即時過帳',
    problem: '異動延遲、集中補登',
    users: ['倉管', '產線'],
    rules: '手持裝置或手機掃批號標籤，輸入數量後即時過帳；數量超過工單需求時需主管確認防呆。',
    criteria: '一次領料操作不超過約 30 秒；過帳後 FR-01 即時更新庫存。',
    defaultCriteria: '一次領料操作不超過約 30 秒；過帳後 FR-01 即時更新庫存。',
    priority: 'P2',
    phase: 2,
    suggestedSystem: 'MES 導入',
    status: 'MES 需涵蓋',
    notes: '需搭配 PDA 或行動裝置，具備離線暫存與自動重送機制。'
  },
  {
    id: 'FR-05',
    moduleId: 'B',
    moduleName: '模組 B：領退料',
    name: '退料秤重與標示',
    problem: '退料沒秤重或沒標示',
    users: ['倉管', '產線'],
    rules: '退料時記錄重量、批號、狀態（可再用、待判定、報廢）；可連接電子秤自動帶入重量；列印退料識別標籤。',
    criteria: '退料單必填重量與狀態；列印標籤含料號、批號、淨重與作業員簽章。',
    defaultCriteria: '退料單必填重量與狀態；列印標籤含料號、批號、淨重與作業員簽章。',
    priority: 'P2',
    phase: 2,
    suggestedSystem: 'MES 導入',
    status: 'MES 需涵蓋',
    notes: '電子秤若支援 RS232 / 藍芽可直連，現場需確認通訊規格。'
  },
  {
    id: 'FR-06',
    moduleId: 'B',
    moduleName: '模組 B：領退料',
    name: '未結單據清單與提醒',
    problem: '補單沒有期限',
    users: ['倉管', '組長'],
    rules: '每日產生未結單據（無工單領料、未補報工、未入帳）；逾時自動通知負責人與單位主管。',
    criteria: '每日固定時間（例如 08:30 / 17:30）產生清單；逾時未處理的單據可追蹤到人與組別。',
    defaultCriteria: '每日固定時間產生清單；逾時未處理的單據可追蹤到人。',
    priority: 'P1',
    phase: 1,
    suggestedSystem: 'ERP 現有',
    status: 'ERP 需微調',
    notes: '可設定 Email / 釘釘 / Line / 系統彈窗推播提醒。'
  },

  // 模組 C：損耗、線邊倉與主檔
  {
    id: 'FR-07',
    moduleId: 'C',
    moduleName: '模組 C：損耗、線邊倉與主檔',
    name: '標準損耗與水口料回收參數',
    problem: '損耗沒記或靠估算',
    users: ['生管', '品管', '系統管理者'],
    rules: '依產品或模具維護：開機損耗、換模損耗、水口料回收比例與再用規則；報工時依參數自動扣除或分類；實際超出標準時標示差異。',
    criteria: '參數有生效日與修改版本紀錄；報工時損耗自動帶入並可由授權人員調整。',
    defaultCriteria: '參數有生效日與修改紀錄；報工時損耗自動帶入並可調整。',
    priority: 'P1',
    phase: 1,
    suggestedSystem: 'ERP 現有',
    status: 'ERP 需微調',
    notes: '塑膠射出/沖壓等成型業之水口料碎料二次參配比率必須納入控管。'
  },
  {
    id: 'FR-08',
    moduleId: 'C',
    moduleName: '模組 C：損耗、線邊倉與主檔',
    name: '線邊倉帳管理',
    problem: '機台旁的料不在帳上',
    users: ['倉管', '組長'],
    rules: '依規則二選一：方案 A：領到線邊即視為消耗；方案 B：另設線邊倉帳，生產報工時才扣帳。每個機台或區域設一個線邊倉儲位。',
    criteria: '線邊倉量隨時可查（方案 B）；退料或換模時可系統化調撥轉回主倉庫。',
    defaultCriteria: '線邊倉量可查（B 方案）；退料或換模時可轉回倉庫。',
    priority: 'P1',
    phase: 1,
    suggestedSystem: 'ERP 現有',
    status: '待確認',
    notes: '最核心決策點：高單價料建議方案 B，低值消耗輔料可採方案 A。'
  },
  {
    id: 'FR-09',
    moduleId: 'C',
    moduleName: '模組 C：損耗、線邊倉與主檔',
    name: '計量單位與換算主檔',
    problem: '單位換算常搞錯',
    users: ['系統管理者', '倉管'],
    rules: '每個物料設定基本單位與換算（如包重量、每模用量、米重、公斤/件）；單據輸入單位後自動換算；單位未設定換算者不可過帳。',
    criteria: '全廠單位標準化一致；換算結果與公式可在單據與報表上清晰看到。',
    defaultCriteria: '全廠單位一致；換算結果可在單據上看到。',
    priority: 'P1',
    phase: 1,
    suggestedSystem: 'ERP 現有',
    status: 'ERP 已具備',
    notes: '避免因包裝/秤重單位不同造成龐大虛擬盤差。'
  },

  // 模組 D：盤點與盤差
  {
    id: 'FR-10',
    moduleId: 'D',
    moduleName: '模組 D：盤點與盤差',
    name: 'ABC 分級維護',
    problem: '月盤才驗證一次',
    users: ['生管', '會計', '倉管'],
    rules: '依金額與用量對物料分 A、B、C 級；定期重算並可人工調整；等級顯示於庫存查詢。',
    criteria: '每季定期重算（或動態累計）；等級人工變更有完整審計紀錄。',
    defaultCriteria: '每季重算；等級變更有紀錄。',
    priority: 'P1',
    phase: 1,
    suggestedSystem: 'ERP 現有',
    status: 'ERP 需微調',
    notes: 'A 級占金額 70~80%，B 級 15~20%，C 級 5~10%。'
  },
  {
    id: 'FR-11',
    moduleId: 'D',
    moduleName: '模組 D：盤點與盤差',
    name: '循環盤點排程與盤點作業',
    problem: '月盤才驗證一次',
    users: ['倉管'],
    rules: 'A 級週盤、B 級月盤、C 級季盤（暫訂）；系統產生盤點清單，手持裝置或手機輸入實盤量；盤點期間可凍結該品項異動或標記異動時間。',
    criteria: '每週自動產生 A 級盤點任務；盤點結果當日回寫並產出盤差表。',
    defaultCriteria: '每週自動產生 A 級盤點清單；盤點結果當日回寫。',
    priority: 'P1',
    phase: 1,
    suggestedSystem: 'ERP 現有',
    status: 'ERP 需微調',
    notes: '動態循環盤點可大幅分散月盤人力癱瘓風險。'
  },
  {
    id: 'FR-12',
    moduleId: 'D',
    moduleName: '模組 D：盤點與盤差',
    name: '盤差原因分類與調帳核准',
    problem: '盤差查不出原因',
    users: ['倉管', '會計', '主管'],
    rules: '盤差超過容許值須選原因（未入帳、誤領、損耗、換算、放錯位置、其他）；調帳需依金額級距核准；調帳後自動產生追蹤改善項目。',
    criteria: '無原因填寫不得過帳調帳；系統可依原因自動統計盤差金額與發生次數。',
    defaultCriteria: '無原因不得調帳；可依原因統計盤差金額與次數。',
    priority: 'P1',
    phase: 1,
    suggestedSystem: 'ERP 現有',
    status: 'ERP 需微調',
    notes: '超過一定金額門檻（如 1 萬元）需呈送至副總/廠長簽核。'
  },

  // 模組 E：儲位與批號
  {
    id: 'FR-13',
    moduleId: 'E',
    moduleName: '模組 E：儲位與批號',
    name: '儲位、批號與先進先出',
    problem: '找料很久',
    users: ['倉管', '產線'],
    rules: '物料固定儲位；進貨時列印批號標籤；領料時系統建議最早批號（FIFO）；改變儲位需掃碼移庫登記。',
    criteria: '批號可雙向追溯至進貨採購單；領料畫面明確標示建議批號、入庫日與儲位代碼。',
    defaultCriteria: '批號可追到進貨單；領料畫面顯示建議批號與儲位。',
    priority: 'P2',
    phase: 2,
    suggestedSystem: 'MES 導入',
    status: 'MES 需涵蓋',
    notes: '若發料非最早批號，系統需跳出警示確認並記錄強制領料人。'
  },

  // 模組 F：回報與指標
  {
    id: 'FR-14',
    moduleId: 'F',
    moduleName: '模組 F：回報與指標',
    name: '異常回報與追蹤',
    problem: '反映了沒人處理',
    users: ['各單位'],
    rules: '單一表單回報帳實不符與流程問題；自動派給負責人並設處理時限；狀態：待處理、處理中、已結案；結案需填原因與對策。',
    criteria: '回報後負責人即時收到通知；逾時案件自動向上呈報升級；可產出結案率統計。',
    defaultCriteria: '回報後負責人收到通知；逾時案件自動升級；可查結案率。',
    priority: 'P1',
    phase: 1,
    suggestedSystem: '客製開發 / 整合',
    status: 'ERP 需微調',
    notes: '避免口頭抱怨無效，建立透明的閉環改善 (Closed-loop) 機制。'
  },
  {
    id: 'FR-15',
    moduleId: 'F',
    moduleName: '模組 F：回報與指標',
    name: '庫存績效儀表板',
    problem: '看不到成效',
    users: ['主管', '各單位'],
    rules: '顯示庫存準確率、盤差金額、各原因占比、未結單據數、異常案件結案率；可依品項等級與單位切換。',
    criteria: '每日自動更新；指標符合定義（毛盤差、淨盤差、ABC 準確率達成率）。',
    defaultCriteria: '每日更新；指標定義見下文。',
    priority: 'P2',
    phase: 2,
    suggestedSystem: '客製開發 / 整合',
    status: 'MES 需涵蓋',
    notes: '提供工廠晨會看板及主管決策數據支撐。'
  },

  // 模組 G：AI 輔助（等資料穩定後）
  {
    id: 'FR-16',
    moduleId: 'G',
    moduleName: '模組 G：AI 輔助（資料穩定後）',
    name: '盤差原因輔助判斷',
    problem: '查不出原因',
    users: ['會計', '倉管'],
    rules: '比對異動紀錄，列出可疑單據（重複過帳、單位異常、無工單領料）供人員判斷；不自動調帳。',
    criteria: '以歷史已分類的盤差資料驗證，建議命中率達成雙方認可之驗收水準（如 ≥ 85%）。',
    defaultCriteria: '以歷史已分類的盤差測試，建議命中率達成雙方認可的水準。',
    priority: 'P3',
    phase: 3,
    suggestedSystem: '客製開發 / 整合',
    status: '待確認',
    notes: '需具備至少 6 個月乾淨之單據流水作為特徵比對基礎。'
  },
  {
    id: 'FR-17',
    moduleId: 'G',
    moduleName: '模組 G：AI 輔助（資料穩定後）',
    name: '損耗率推算與 BOM 修正建議',
    problem: 'BOM 與實際用量落差',
    users: ['生管', '品管'],
    rules: '以報工與領料資料推算實際損耗；與標準差異過大時建議修正，由人員確認後才生效。',
    criteria: '建議附上歷史依據批次與信賴區間數據；修改標準 BOM 須經工程與生管雙重核准。',
    defaultCriteria: '建議附上依據資料；修改須經核准。',
    priority: 'P3',
    phase: 3,
    suggestedSystem: '客製開發 / 整合',
    status: '待確認',
    notes: '避免長年 BOM 不準造成虛增成本與採購超估。'
  }
];

export interface DecisionItem {
  id: number;
  title: string;
  question: string;
  currentChoice: string;
  options: { value: string; label: string; desc: string }[];
  impact: string;
  targetFRs: string[];
}

export const INITIAL_DECISIONS: DecisionItem[] = [
  {
    id: 1,
    title: 'ERP 現有功能缺口盤點',
    question: 'ERP 現有功能已涵蓋哪些？哪些是需要補的？',
    currentChoice: 'erp_partial',
    options: [
      { value: 'erp_basic', label: 'ERP 僅具備基本進銷存（缺庫存分層、預留、循環盤點）', desc: '需由即將導入的 MES 或客製模組承擔 FR-01/02/08/11/13' },
      { value: 'erp_partial', label: 'ERP 已有 BOM、工單與單位換算，缺現場掃碼與線邊倉', desc: '第一階段主檔與規則在 ERP 實施，第二階段掃碼由 MES 補足（推薦）' },
      { value: 'erp_strong', label: 'ERP 具備批號與多倉庫功能，可直接配置線邊倉', desc: '第一階段 80% 可在 ERP 完成，MES 專注報工與機台數據' }
    ],
    impact: '決定專案客製開發預算與階段一上線速度',
    targetFRs: ['FR-01', 'FR-07', 'FR-08', 'FR-09', 'FR-10', 'FR-11']
  },
  {
    id: 2,
    title: '線邊倉管理策略 (最關鍵規則)',
    question: '線邊倉採方案 A 還是方案 B？',
    currentChoice: 'plan_b',
    options: [
      { value: 'plan_a', label: '方案 A：領到線邊即視為消耗 (Expensed on Issuance)', desc: '作業最簡單，產線領料當下即扣庫存帳。缺點：機台旁在製品料無帳面數量，月盤若有剩料需做大量退庫調帳。' },
      { value: 'plan_b', label: '方案 B：另設線邊倉帳，生產報工時才扣帳 (Line-side W/H with Backflush)', desc: '帳實最精準。移轉至機台旁屬「調撥」，現場報工或完工時按實際產出扣料。高單價或共用料首選。（推薦）' },
      { value: 'plan_hybrid', label: '混合方案：A/B 級高價料採方案 B，C 級包材輔料採方案 A', desc: '兼顧管理精準度與前線操作負擔，依 ABC 分級自動套用規則。' }
    ],
    impact: '直接決定庫存即時可用量計算公式（FR-01）與報工扣帳邏輯（FR-08）',
    targetFRs: ['FR-01', 'FR-07', 'FR-08', 'FR-05']
  },
  {
    id: 3,
    title: '庫存準確率容許值與盤點頻率',
    question: '各等級容許範圍與循環盤點排程設定？',
    currentChoice: 'standard',
    options: [
      { value: 'strict', label: '高標水準：A級 ±0.2% 週盤 / B級 ±1% 雙週盤 / C級 ±3% 月盤', desc: '適合高單價、精密零組件或醫療航太製造業' },
      { value: 'standard', label: '務實建議：A級 ±0.5% 週盤 / B級 ±2% 月盤 / C級 ±5% 季盤', desc: '兼顧倉管負荷與盤差及早發現，暫訂規格採用（推薦）' },
      { value: 'relaxed', label: '初期寬鬆：A級 ±1% 雙週盤 / B級 ±3% 月盤 / C級 ±8% 半年盤', desc: '適合導入初期制度與標籤尚未完全健全時' }
    ],
    impact: '直接影響 FR-10 (ABC維護)、FR-11 (盤點排程) 與 FR-15 儀表板達標率計算',
    targetFRs: ['FR-10', 'FR-11', 'FR-12', 'FR-15']
  },
  {
    id: 4,
    title: '現場硬體與網路環境整備',
    question: '現場有沒有手持裝置、標籤機、電子秤與穩定網路？',
    currentChoice: 'planning_hardware',
    options: [
      { value: 'ready', label: '全廠已布建工業 PDA、無線 WiFi 全覆蓋、支援電子秤', desc: '可直接推進第二階段掃碼領退料 (FR-04/05/13)' },
      { value: 'planning_hardware', label: '目前無 PDA，預計採購工業手機/平板＋藍芽掃描槍', desc: '第一階段先以 PC/條碼機作業，第二階段同步採購手持與電子秤（推薦）' },
      { value: 'offline_needed', label: '現場有金屬屏蔽或死角，強烈需要離線暫存補傳功能', desc: '軟體架構必須採用 Local Storage / SQLite 離線快取同步' }
    ],
    impact: '決定 FR-04 掃碼過帳與 FR-05 電子秤介接之技術可行性與驗收標竿',
    targetFRs: ['FR-04', 'FR-05', 'FR-13']
  },
  {
    id: 5,
    title: '急單快速流程時限與授權層級',
    question: '急單快速流程的補單期限與核准人是誰？',
    currentChoice: 'four_hours',
    options: [
      { value: 'two_hours', label: '嚴格限制：2 小時內補單，需生管主管或廠長雙簽', desc: '防弊效果最強，但現場急迫時彈性較低' },
      { value: 'four_hours', label: '標準實務：4 小時內補單，當班班長＋生管簽核（推薦）', desc: '兼顧生產機動性，交接班前清點未結單據 (FR-06)' },
      { value: 'end_of_day', label: '當日下班前：8 小時內補齊工單，組長簽名即可', desc: '彈性高，但容易出現跨日補單遺漏與交接不清' }
    ],
    impact: '決定 FR-03「急單快速流程」防呆邏輯與 FR-06「未結單據」自動通知計時器',
    targetFRs: ['FR-03', 'FR-06', 'FR-14']
  }
];

export interface InventoryItemMock {
  sku: string;
  name: string;
  spec: string;
  category: '原料' | '半成品' | '包材' | '耗材';
  unit: string;
  abc: 'A' | 'B' | 'C';
  warehouseStock: number; // 倉庫量
  lineSideStock: number;  // 線邊倉量
  inTransitStock: number; // 在途量
  reservedStock: number;  // 已預留量
  lastCountDate: string;  // 最後盤點日
  lastMoveTime: string;   // 最後異動時間
  unitCost: number;       // 單價 NTD
  location: string;       // 儲位
  standardLossRate: number; // 標準損耗率 %
}

export const MOCK_INVENTORY: InventoryItemMock[] = [
  {
    sku: 'MAT-ABS-001',
    name: 'ABS 塑膠粒 (阻燃黑 757G)',
    spec: '25kg/包',
    category: '原料',
    unit: 'kg',
    abc: 'A',
    warehouseStock: 2500,
    lineSideStock: 450,
    inTransitStock: 1000,
    reservedStock: 1800,
    lastCountDate: '2026-10-24',
    lastMoveTime: '2026-10-26 14:32',
    unitCost: 85,
    location: 'A-02-14',
    standardLossRate: 2.5
  },
  {
    sku: 'MAT-PC-302',
    name: 'PC 高衝擊光學級原料',
    spec: '25kg/包',
    category: '原料',
    unit: 'kg',
    abc: 'A',
    warehouseStock: 1200,
    lineSideStock: 200,
    inTransitStock: 500,
    reservedStock: 1100,
    lastCountDate: '2026-10-22',
    lastMoveTime: '2026-10-26 09:15',
    unitCost: 160,
    location: 'A-01-08',
    standardLossRate: 3.0
  },
  {
    sku: 'SEMI-HSG-401',
    name: '中框射出成型件',
    spec: '模穴 1*4',
    category: '半成品',
    unit: 'pcs',
    abc: 'B',
    warehouseStock: 8400,
    lineSideStock: 1200,
    inTransitStock: 0,
    reservedStock: 4000,
    lastCountDate: '2026-10-15',
    lastMoveTime: '2026-10-26 16:40',
    unitCost: 18,
    location: 'B-04-22',
    standardLossRate: 1.5
  },
  {
    sku: 'PKG-BOX-880',
    name: '外銷五層瓦楞外箱',
    spec: '520*380*260mm',
    category: '包材',
    unit: 'pcs',
    abc: 'C',
    warehouseStock: 3500,
    lineSideStock: 300,
    inTransitStock: 2000,
    reservedStock: 800,
    lastCountDate: '2026-09-30',
    lastMoveTime: '2026-10-25 11:05',
    unitCost: 22,
    location: 'C-01-01',
    standardLossRate: 0.8
  },
  {
    sku: 'MAT-PBT-108',
    name: 'PBT+GF30% 強化耐熱料',
    spec: '25kg/包',
    category: '原料',
    unit: 'kg',
    abc: 'A',
    warehouseStock: 800,
    lineSideStock: 150,
    inTransitStock: 0,
    reservedStock: 900, // available = 800 + 150 - 900 = 50 (tight)
    lastCountDate: '2026-10-25',
    lastMoveTime: '2026-10-26 13:10',
    unitCost: 125,
    location: 'A-03-05',
    standardLossRate: 2.0
  }
];
