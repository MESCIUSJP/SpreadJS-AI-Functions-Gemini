// 名前空間のエイリアス名
const spreadNS = GC.Spread.Sheets;

// ライセンスキーとカルチャの設定
//spreadNS.LicenseKey = 'ここにSpreadJSのライセンスキーを設定します';
GC.Spread.Common.CultureManager.culture("ja-jp");

document.addEventListener("DOMContentLoaded", () => {
  // SpreadJSの生成
  const spread = new spreadNS.Workbook("ss");
  spread.options.allowDynamicArray = true;
  injectAI(spread);
  initSheet(spread);
});

// Sheet1の設定
const initSheet = (spread) => {
  // データの設定
  const data = [
    ['英語の原文'],
    ['Do in Rome as the Romans do.'],
    ['All is well that ends well.'],
    ['The early bird catches the worm.'],
    ['Misfortunes never come singly.'],
  ];

  // シートの基本設定
  const sheet = spread.getSheet(0);
  sheet.defaults.colWidth = 20;
  sheet.setColumnWidth(1, 270);
  sheet.setColumnWidth(3, 350);

  // 項目ヘッダのスタイル
  const headerStyle = new spreadNS.Style();
  headerStyle.backColor = "royalblue";
  headerStyle.foreColor = "white";
  headerStyle.hAlign = spreadNS.HorizontalAlign.center;

  // 英語の原文
  sheet.setArray(1, 1, data);
  sheet.setStyle(1, 1, headerStyle);
  sheet.getRange(1, 1, 5, 1).cellPadding("0 0 0 5");
  sheet.getRange(1, 1, 5, 1).setBorder(
    new GC.Spread.Sheets.LineBorder("royalblue", spreadNS.LineStyle.medium),
    { outline: true }
  );

  // 日本語訳（SJS.AI.TRANSLATE関数の動作確認用）
  const watermark1 = '=SJS.AI.TRANSLATE(B3:B6,"日本語")';
  sheet.setValue(7, 1, "日本語訳");
  sheet.setStyle(7, 1, headerStyle);
  sheet.getRange(7, 1, 5, 1).setBorder(
    new GC.Spread.Sheets.LineBorder("royalblue", spreadNS.LineStyle.medium),
    { outline: true }
  );
  sheet.getCell(8, 1).watermark(watermark1);

  // 感情分析（SJS.AI.TEXTSENTIMENT関数の動作確認用）
  const watermark2 = '=SJS.AI.TEXTSENTIMENT(B9:B12,"良い","悪い","普通")';
  sheet.setValue(7, 3, "感情分析");
  sheet.setStyle(7, 3, headerStyle);
  sheet.getRange(7, 3, 5, 1).setBorder(
    new GC.Spread.Sheets.LineBorder("royalblue", spreadNS.LineStyle.medium),
    { outline: true }
  );
  sheet.getRange(8, 3, 4, 1).hAlign(spreadNS.HorizontalAlign.center);
  sheet.getCell(8, 3).watermark(watermark2);

  // クエリの設定（SJS.AI.QUERY関数の動作確認用）
  const watermark3 = '=SJS.AI.QUERY("このことわざの意味を簡潔に教えてください",B9:B12)';
  sheet.setValue(13, 1, "任意のクエリ");
  sheet.getCell(13, 1).setStyle(headerStyle);
  sheet.getRange(13, 1, 5, 3).setBorder(
    new GC.Spread.Sheets.LineBorder("royalblue", spreadNS.LineStyle.medium),
    { outline: true }
  );
  sheet.addSpan(13, 1, 1, 3, spreadNS.SheetArea.viewport);
  sheet.getCell(14, 1).watermark(watermark3);
}

// AIリクエストをサーバーを経由してAIサービスに送信
const serverCallback = async (requestBody) => {
  const response = await fetch("/api/queryAI", {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response;
};

const injectAI = (spread) => {
  spread.injectAI(serverCallback);
}