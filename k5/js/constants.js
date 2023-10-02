// データ
const DataSource =
  "https://raw.githubusercontent.com/code-for-future-moms/fetch-open-data/main/data/hospital-data-address-R40620.tsv";

// グラフの表示最大件数
const GraphSample = 100;

// テーブルの1ページの表示数
const PlotSample = 20;

// 並び替え対象
const NumSorter = ["et_count", "preg_count", "birth_count", "birth_ratio"];

// グラフのツールチップに表示する項目
const GraphTooltip = ["et_count", "preg_count", "birth_count", "birth_ratio"];

// デフォルトの並び順
const DefaultSorter = "et_count";

// TSVデータとラベルのマッピング
const Columns = {
  viz: {
    label: "グラフ表示",
  },

  name: {
    label: "クリニック名",
  },

  et_count: {
    label: "移植数",
    color: "#289CFD",
  },

  preg_count: {
    label: "妊娠数",
    color: "#4236B8",
  },

  birth_count: {
    label: "分娩数",
    color: "#1DE15F",
  },

  birth_ratio: {
    label: "分娩率",
    color: "#F677AD",
  },

  address: {
    label: "住所",
  },
};
