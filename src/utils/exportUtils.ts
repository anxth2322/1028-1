import { FunctionalRequirement, DecisionItem } from '../data/specData';

/**
 * Generates an Excel-compatible spreadsheet file (.xls HTML format with XML styles)
 * This format natively preserves table columns, colors, wrapping, and headers in Microsoft Excel and LibreOffice Calc.
 */
export function exportToExcel(
  items: FunctionalRequirement[], 
  filename = 'ERP_MES_庫存精準化功能規格書.xls'
) {
  const p1Count = items.filter(i => i.priority === 'P1').length;
  const p2Count = items.filter(i => i.priority === 'P2').length;
  const p3Count = items.filter(i => i.priority === 'P3').length;

  const html = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <style>
      body { font-family: 'Microsoft JhengHei', sans-serif; font-size: 11pt; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
      th { background-color: #1e293b; color: #ffffff; border: 1px solid #475569; padding: 10px; font-weight: bold; text-align: left; }
      td { border: 1px solid #cbd5e1; padding: 8px; vertical-align: top; }
      .p1 { background-color: #fee2e2; color: #991b1b; font-weight: bold; text-align: center; }
      .p2 { background-color: #fef3c7; color: #92400e; font-weight: bold; text-align: center; }
      .p3 { background-color: #e0e7ff; color: #3730a3; font-weight: bold; text-align: center; }
      .module-header { background-color: #f1f5f9; font-weight: bold; color: #0f172a; }
      .title-block { font-size: 18pt; font-weight: bold; color: #0f172a; margin-bottom: 12px; }
      .summary-box { background-color: #f8fafc; border: 1px solid #94a3b8; padding: 12px; margin-bottom: 16px; }
    </style>
  </head>
  <body>
    <div class="title-block">庫存精準化與生產物料管理系統功能規格總表 (FR-01 ~ FR-17)</div>
    <div class="summary-box">
      <strong>規格概況：</strong> 總計 ${items.length} 項功能規格 ｜ 
      <span style="color:#b91c1c;">P1 最優先：${p1Count} 項</span> ｜ 
      <span style="color:#d97706;">P2 次優先：${p2Count} 項</span> ｜ 
      <span style="color:#4f46e5;">P3 AI/進階：${p3Count} 項</span> ｜ 
      產出時間：${new Date().toLocaleString('zh-TW')}
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 70px;">編號</th>
          <th style="width: 130px;">所屬模組</th>
          <th style="width: 140px;">功能名稱</th>
          <th style="width: 120px;">對應問題</th>
          <th style="width: 90px;">使用者</th>
          <th style="width: 280px;">功能說明與業務規則</th>
          <th style="width: 250px;">驗收標準 (依現況可微調)</th>
          <th style="width: 60px;">優先級</th>
          <th style="width: 65px;">建議階段</th>
          <th style="width: 100px;">承載系統</th>
          <th style="width: 90px;">實施狀態</th>
          <th style="width: 160px;">備註 / 實施重點</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `
          <tr>
            <td style="font-weight: bold; text-align: center;">${item.id}</td>
            <td class="module-header">${item.moduleName.replace(/模組 [A-G]：/, '')}</td>
            <td style="font-weight: 600;">${item.name}</td>
            <td style="color: #64748b;">${item.problem}</td>
            <td>${item.users.join('、')}</td>
            <td>${item.rules}</td>
            <td style="background-color: #fffbeb;">${item.criteria}</td>
            <td class="${item.priority.toLowerCase()}">${item.priority}</td>
            <td style="text-align: center;">階段 ${item.phase}</td>
            <td>${item.suggestedSystem}</td>
            <td>${item.status}</td>
            <td style="font-size: 9pt; color: #475569;">${item.notes}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </body>
  </html>
  `;

  const blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates standard CSV for quick import into ERP or Database
 */
export function exportToCSV(items: FunctionalRequirement[], filename = '庫存功能規格總表.csv') {
  const headers = ['編號', '模組', '功能名稱', '對應問題', '使用者', '功能說明與規則', '驗收標準', '優先級', '建議階段', '承載系統', '狀態', '備註'];
  const rows = items.map(item => [
    `"${item.id}"`,
    `"${item.moduleName}"`,
    `"${item.name}"`,
    `"${item.problem}"`,
    `"${item.users.join('、')}"`,
    `"${item.rules.replace(/"/g, '""')}"`,
    `"${item.criteria.replace(/"/g, '""')}"`,
    `"${item.priority}"`,
    `"階段 ${item.phase}"`,
    `"${item.suggestedSystem}"`,
    `"${item.status}"`,
    `"${item.notes.replace(/"/g, '""')}"`
  ]);

  const csvContent = '\ufeff' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates an executive-ready Word document (.doc) with complete PRD chapters
 */
export function exportToWord(
  items: FunctionalRequirement[], 
  decisions: DecisionItem[], 
  filename = '庫存精準化與物料管理系統規格書(PRD).doc'
) {
  const html = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>系統功能規格書</title>
    <style>
      @page {
        size: A4 portrait;
        margin: 2.5cm 2.0cm 2.5cm 2.0cm;
        mso-page-orientation: portrait;
      }
      body {
        font-family: 'Microsoft JhengHei', 'PingFang TC', sans-serif;
        font-size: 11pt;
        line-height: 1.6;
        color: #1e293b;
      }
      h1 { font-size: 22pt; color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 6px; margin-top: 24px; }
      h2 { font-size: 15pt; color: #0369a1; margin-top: 20px; border-left: 4px solid #0284c7; padding-left: 8px; }
      h3 { font-size: 12pt; color: #334155; margin-top: 14px; }
      p { margin: 6px 0; }
      table { border-collapse: collapse; width: 100%; margin: 12px 0 20px 0; font-size: 10pt; }
      th { background-color: #0f172a; color: #ffffff; border: 1px solid #334155; padding: 8px 6px; text-align: left; }
      td { border: 1px solid #cbd5e1; padding: 7px 6px; vertical-align: top; }
      .badge-p1 { background-color: #fee2e2; color: #991b1b; font-weight: bold; padding: 2px 4px; text-align: center; }
      .badge-p2 { background-color: #fef3c7; color: #92400e; font-weight: bold; padding: 2px 4px; text-align: center; }
      .badge-p3 { background-color: #e0e7ff; color: #3730a3; font-weight: bold; padding: 2px 4px; text-align: center; }
      .callout { background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 10px 14px; margin: 12px 0; }
      .meta-box { border: 1px solid #e2e8f0; background-color: #f8fafc; padding: 14px; margin-bottom: 24px; border-radius: 4px; }
      .formula-box { background-color: #f1f5f9; border: 1px dashed #64748b; padding: 10px; font-family: Consolas, monospace; margin: 8px 0; }
    </style>
  </head>
  <body>
    <h1>庫存精準化與生產物料管理系統功能規格書 (PRD)</h1>
    <div class="meta-box">
      <p><strong>文件版本：</strong> v1.0 (正式審查版)</p>
      <p><strong>適用系統：</strong> 現有 ERP 模組升級 / 新建 MES 系統串接需求</p>
      <p><strong>編制日期：</strong> ${new Date().toLocaleDateString('zh-TW')} ｜ <strong>目標對象：</strong> 資訊部 (IT)、生管、製造部、倉管、外部系統整合廠商</p>
      <p><strong>專案願景：</strong> 徹底消除「先拿後補、口頭領料、機台線邊不入帳、盤差查無原因」沉痾，建立全流程即時、防呆、閉環之物料與帳務管理機制。</p>
    </div>

    <h2>一、規格總表 (FR-01 ~ FR-17)</h2>
    <p>以下將「現場真正需求」與「改善對策」拆解為 17 項標準系統功能規格，分為 7 大管理模組：</p>
    
    <table>
      <thead>
        <tr>
          <th style="width: 8%;">編號</th>
          <th style="width: 14%;">功能名稱</th>
          <th style="width: 13%;">對應問題</th>
          <th style="width: 10%;">使用者</th>
          <th style="width: 30%;">功能說明與規則</th>
          <th style="width: 20%;">驗收標準 (暫訂可調整)</th>
          <th style="width: 5%;">優先</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(i => `
          <tr>
            <td style="font-weight: bold; text-align: center;">${i.id}</td>
            <td style="font-weight: 600;">${i.name}</td>
            <td style="color: #64748b;">${i.problem}</td>
            <td>${i.users.join('、')}</td>
            <td>${i.rules}</td>
            <td style="background-color: #fffbeb;">${i.criteria}</td>
            <td class="${i.priority === 'P1' ? 'badge-p1' : i.priority === 'P2' ? 'badge-p2' : 'badge-p3'}">${i.priority}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h2>二、共通要求 (非功能與基礎架構)</h2>
    <ul>
      <li><strong>權限分離 (RBAC)：</strong> 領料過帳、盤差調帳、損耗參數維護、計量單位換算必須落實分開授權。盤差調帳與工單超領必須經權責主管電子簽核。</li>
      <li><strong>不可竄改稽核紀錄 (Audit Trail)：</strong> 所有庫存異動、調帳記錄、BOM 參數調整均需保留「操作人員姓名、精確時間戳記、異動前原值、異動後新值、操作 IP / 裝置」，系統不可提供物理刪除功能。</li>
      <li><strong>資料保存規範：</strong> 領退料單據、盤點抽核底稿與審批歷程至少保留 5 年，符合內部稽核與會計稅務查核規範。</li>
      <li><strong>現場網路與離線補傳機制：</strong> 車間或立體倉儲若存在金屬貨架屏蔽或訊號死角，手持 PDA 設備需支援離線資料暫存；重連網路後自動發起同步並防範重複扣帳。</li>
    </ul>

    <h2>三、核心指標定義 (KPI)</h2>
    <div class="callout">
      <p><strong>1. 庫存準確率 (%)：</strong></p>
      <div class="formula-box">
        庫存準確率 ＝ ( 抽盤品項中，帳實差異在容許範圍內的品項數 ) ÷ ( 抽盤品項總數 ) × 100%
      </div>
      <p><em>容許範圍建議：A 級料品項差異 ≤ ±0.5%，B 級料品項差異 ≤ ±2.0%，C 級料品項差異 ≤ ±5.0%。</em></p>
      
      <p><strong>2. 盤差金額 (NTD)：</strong></p>
      <div class="formula-box">
        毛盤差金額 ＝ ∑ | 實盤數量 − 帳面數量 | × 標準單價 (反映管理失誤總能量)<br/>
        淨盤差金額 ＝ ∑ ( 實盤數量 − 帳面數量 ) × 標準單價 (反映財務淨損益)
      </div>

      <p><strong>3. 未結單據監控：</strong></p>
      <p>包含超過時限未補開工單之急單領料單、超時未補報工之在製品單、以及逾 24 小時未入帳之進貨驗收單。</p>
    </div>

    <h2>四、分階段建議導入順序 (Roadmap)</h2>
    <p><strong>第一階段 (規則與主檔建立，ERP 或 Excel 即可啟動)：</strong><br/>
    涵蓋 FR-03 (領退綁工單)、FR-06 (未結單提醒)、FR-07 (標準損耗/水口料參數)、FR-08 (線邊倉制度確認)、FR-09 (單位換算主檔)、FR-10 (ABC 分級)、FR-11 (循環盤點機制)、FR-12 (盤差原因強制限核)、FR-14 (異常回報表單)，以及 FR-01 基本版庫存查詢。</p>

    <p><strong>第二階段 (硬體串接與現場系統化，與 MES 同步推進)：</strong><br/>
    涵蓋 FR-02 (庫存預留與衝突提示)、FR-04 (PDA 掃碼領退即時過帳)、FR-05 (退料連線電子秤與標籤列印)、FR-13 (固定儲位、批號 FIFO)、FR-15 (即時庫存績效看板)。</p>

    <p><strong>第三階段 (數據累積後的智慧輔助)：</strong><br/>
    涵蓋 FR-16 (盤差可疑原因 AI 交叉比對建議)、FR-17 (實際損耗大數據回饋與 BOM 標準修正建議)。</p>

    <h2>五、待確認事項與關鍵決策 (Decision Matrix)</h2>
    <table>
      <thead>
        <tr>
          <th style="width: 8%;">決策序號</th>
          <th style="width: 25%;">關鍵決策主題</th>
          <th style="width: 35%;">當前評估選項與說明</th>
          <th style="width: 32%;">對系統規格之直接影響</th>
        </tr>
      </thead>
      <tbody>
        ${decisions.map(d => {
          const selected = d.options.find(o => o.value === d.currentChoice) || d.options[0];
          return `
            <tr>
              <td style="text-align: center; font-weight: bold;">#${d.id}</td>
              <td style="font-weight: 600;">${d.title}</td>
              <td><strong>${selected.label}</strong><br/><span style="color:#64748b; font-size: 9pt;">${selected.desc}</span></td>
              <td style="font-size: 9pt;">${d.impact}<br/><em>關聯功能：${d.targetFRs.join(', ')}</em></td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <div style="margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 9pt; color: #94a3b8;">
      製造業智慧化製造 (Smart Manufacturing) 物料管制與庫存精實專案小組 敬呈
    </div>
  </body>
  </html>
  `;

  const blob = new Blob(['\ufeff' + html], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates clean Markdown for Notion/Confluence/Jira/GitHub Wiki
 */
export function generateMarkdownDoc(items: FunctionalRequirement[], decisions: DecisionItem[]): string {
  let md = `# 庫存精準化與生產物料管理系統功能規格書 (FR-01 ~ FR-17)\n\n`;
  md += `> 本規格書依據工廠「現場痛點」與「改善對策」轉化，支援 ERP 現有模組升級與即將導入之 MES 系統對照驗收。\n\n`;
  
  md += `## 一、規格總表\n\n`;
  md += `| 編號 | 功能名稱 | 對應問題 | 使用者 | 功能說明與規則 | 驗收標準 | 優先級 | 階段 | 承載系統 |\n`;
  md += `|---|---|---|---|---|---|:---:|:---:|---|\n`;
  items.forEach(i => {
    md += `| **${i.id}** | ${i.name} | ${i.problem} | ${i.users.join('、')} | ${i.rules} | ${i.criteria} | **${i.priority}** | 階段 ${i.phase} | ${i.suggestedSystem} |\n`;
  });

  md += `\n## 二、共通要求\n`;
  md += `- **權限管理**：領料、調帳、參數修改、單位換算分開授權；調帳與超領需主管審批。\n`;
  md += `- **稽核紀錄**：所有異動、調帳、參數修改保留操作人、時間、修改前後值，不可物理刪除。\n`;
  md += `- **資料保存**：單據與盤點紀錄依公司法規保存 5 年以上。\n`;
  md += `- **離線與網路**：手持掃碼裝置具備離線暫存與連線後自動補傳機制。\n\n`;

  md += `## 三、指標定義 (KPI)\n`;
  md += `- **庫存準確率** = ( 抽盤品項中，帳實差異在容許範圍內的品項數 ) ÷ ( 抽盤品項數 )\n`;
  md += `- **盤差金額** = 毛盤差 (絕對值累計) 與淨盤差 (損益淨額)\n`;
  md += `- **未結單據** = 逾時限仍未補齊工單之急單領料與未報工單據\n\n`;

  md += `## 四、待確認事項評估 (5 大關鍵決策)\n`;
  decisions.forEach(d => {
    const selected = d.options.find(o => o.value === d.currentChoice) || d.options[0];
    md += `### ${d.id}. ${d.title}\n`;
    md += `- **問題**：${d.question}\n`;
    md += `- **決策方案**：${selected.label}\n`;
    md += `- **影響範圍**：${d.impact} (影響 ${d.targetFRs.join(', ')})\n\n`;
  });

  return md;
}
