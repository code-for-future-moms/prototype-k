// データ
const DataSource =
  "https://raw.githubusercontent.com/code-for-future-moms/fetch-open-data/main/data/hospital-data-address-R40620.tsv";

// グラフの表示最大件数
const GraphSample = 100;

// テーブルの1ページの表示数
const PlotSample = 20;

// TSVのヘッダーと日本語名の対応
const NameMap = {
  name: "クリニック名",
  et_count: "移植数",
  preg_count: "妊娠数",
  birth_count: "分娩数",
  birth_ratio: "分娩率",
  address: "住所",
};

// 並び替え対象
const NumSorter = ["et_count", "preg_count", "birth_count", "birth_ratio"];

// グラフの色
const ColorMap = {
  et_count: "#289CFD",
  preg_count: "#4236B8",
  birth_count: "#1DE15F",
  birth_ratio: "#F677AD",
};

// デフォルトの並び順
const DefaultSorter = "et_count";
