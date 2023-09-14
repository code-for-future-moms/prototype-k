// データ
const DataSource =
  "https://raw.githubusercontent.com/code-for-future-moms/fetch-open-data/main/data/hospital-data-address-R40620.tsv";

// グラフの表示最大件数
const GraphSample = 100;

// テーブルの1ページの表示数
const PlotSample = 20;

// TSVのヘッダーと日本語名の対応
const NameMap = {
  et_count: "移植数",
  preg_count: "妊娠数",
  birth_count: "生産分娩数",
  birth_ratio: "分娩率",
};

// 並び替え対象
const NumSorter = ["et_count", "preg_count", "birth_count"];

// グラフの色
const ColorMap = {
  et_count: "#289CFD",
  preg_count: "#4236B8",
  birth_count: "#1DE15F",
  birth_ratio: "#F677AD",
};

// デフォルトの並び順
const DefaultSorter = "et_count";

// 状態用グローバル変数
let activeSorter = null;

let hospitalStore = null;

class HospitalStore {
  constructor(hospitals) {
    this.hospitals = hospitals;
  }

  sorted(order) {
    const sorted = [...this.hospitals].sort((a, b) => {
      if (a[order] < b[order]) {
        return 1;
      } else if (a[order] > b[order]) {
        return -1;
      } else {
        return 0;
      }
    });

    return new HospitalStore(sorted);
  }

  hospitalWithKey(key) {
    return this.hospitals.find((h) => h.graphName() === key);
  }

  getHospitalNames() {
    return this.hospitals.map((h) => h.name);
  }

  getHospitalNamesWithAddress() {
    return this.hospitals.map((h) => h.graphName());
  }

  getEtCount() {
    return this.hospitals.map((h) => h.et_count);
  }

  getPregCount() {
    return this.hospitals.map((h) => h.preg_count);
  }

  getBirthCount() {
    return this.hospitals.map((h) => h.birth_count);
  }

  getBirthRate() {
    return this.hospitals.map((h) => h.birth_ratio);
  }
}

class Hospital {
  constructor(name, et_count, preg_count, birth_count, birth_ratio, address) {
    this.name = name;
    this.et_count = et_count;
    this.preg_count = preg_count;
    this.birth_count = birth_count;
    this.birth_ratio = birth_ratio;
    this.address = address;
  }

  shortAddress() {
    return this.address.replace(/^(.+?[都道府県])?(.+?[市区町村]).*/g, "$1$2");
  }

  graphName() {
    return this.shortAddress() + "：" + this.name;
  }
}

$(document).ready(function () {
  d3.text(DataSource)
    .then(d3.tsvParseRows)
    .then(dataStore)
    .then(tabulate)
    .then(readyUpdate)
    .then(updateSorter)
    .then(selectInitialGraphData)
    .then(reloadPerGraph)
    .then(reloadNumGraph);
});

// 並び替えボタンの作成
function updateSorter() {
  d3.select("#num-sorter")
    .append("div")
    .attr("class", "btn-group btn-group-sm")
    .attr("role", "group")
    .selectAll("button")
    .data(NumSorter)
    .enter()
    .append("button")
    .attr("type", "button")
    .attr("class", "btn btn-outline-secondary")
    .attr("value", (key) => key)
    .text((key) => NameMap[key] + "順")
    .on("click", function (_) {
      if (activeSorter) {
        activeSorter
          .classed("btn-secondary", false)
          .classed("btn-outline-secondary", true);
      }
      activeSorter = d3.select(this);
      activeSorter
        .classed("btn-outline-secondary", false)
        .classed("btn-secondary", true);

      let sorter = this.value;
      hospitalStore = hospitalStore.sorted(sorter);
      reloadNumGraph();
    });
}

// 初期表示の医療機関の選択
function selectInitialGraphData() {
  activeSorter = d3
    .selectAll("button.btn")
    .filter(function (d) {
      return d === DefaultSorter;
    })
    .classed("btn-outline-secondary", false)
    .classed("btn-secondary", true);
  hospitalStore = hospitalStore.sorted(DefaultSorter);
}

// データテーブルの作成
function readyUpdate() {
  $("#data").DataTable({
    dom: "Bfrtip",
    language: {
      search: "検索:",
    },
    info: false,
    pageLength: PlotSample,
    buttons: {
      buttons: ["copy", "csv", "excel"],
    },
  });
}

// グラフ表示の更新（分娩率）
function reloadPerGraph() {
  const store = new HospitalStore(
    hospitalStore.hospitals.slice(0, GraphSample),
  ).sorted("birth_ratio");

  const hospitalNames = store.getHospitalNamesWithAddress();

  let series = [
    {
      name: NameMap["birth_ratio"],
      color: ColorMap["birth_ratio"],
      data: store.getBirthRate(),
    },
  ];

  Highcharts.chart("per-graph", {
    chart: {
      type: "column",
      scrollablePlotArea: {
        minWidth: hospitalNames.length * 36,
      },
    },
    title: {
      text: "",
      align: "left",
    },
    xAxis: {
      categories: hospitalNames,
      crosshair: true,
      labels: {
        align: "left",
        distance: 0,
        allowOverlap: true,
        step: 1,
        overflow: "justify",
        style: {
          fontSize: "75%",
          textOverflow: "none",
          writingMode: "vertical-rl",
        },
      },
    },
    yAxis: {
      labels: {
        format: "{text}%",
      },
      title: {
        text: "",
      },
      max: 100,
    },
    series: series,
    tooltip: {
      stickOnContact: true,
      formatter: function () {
        return generateTooltip(store.hospitalWithKey(this.key));
      },
      shared: true,
    },
  });
}

// グラフ表示の更新（移植数・妊娠数・生産分娩数）
function reloadNumGraph() {
  const store = new HospitalStore(
    hospitalStore.hospitals.slice(0, GraphSample),
  );

  const hospitalNames = store.getHospitalNamesWithAddress();

  let series = [
    {
      name: NameMap["et_count"],
      color: ColorMap["et_count"],
      data: store.getEtCount(),
    },
    {
      name: NameMap["preg_count"],
      color: ColorMap["preg_count"],
      data: store.getPregCount(),
    },
    {
      name: NameMap["birth_count"],
      color: ColorMap["birth_count"],
      data: store.getBirthCount(),
    },
  ];

  Highcharts.chart("num-graph", {
    chart: {
      type: "column",
      scrollablePlotArea: {
        minWidth: hospitalNames.length * 36,
      },
    },
    title: {
      text: "",
      align: "left",
    },
    xAxis: {
      categories: hospitalNames,
      crosshair: true,
      labels: {
        align: "left",
        distance: 0,
        allowOverlap: true,
        step: 1,
        overflow: "justify",
        style: {
          fontSize: "75%",
          textOverflow: "none",
          writingMode: "vertical-rl",
        },
      },
    },
    yAxis: {
      title: {
        text: "",
      },
    },
    series: series,
    tooltip: {
      stickOnContact: true,
      formatter: function () {
        return generateTooltip(store.hospitalWithKey(this.key));
      },
      shared: true,
    },
  });
}

// ツールチップに表示する内容
function generateTooltip(hospital) {
  return (
    "<b>" +
    hospital.name +
    "</b><br />" +
    ["et_count", "preg_count", "birth_count", "birth_ratio"]
      .map(function (key) {
        return (
          '&nbsp;<span style="color:' +
          ColorMap[key] +
          '">\u25CF</span> ' +
          NameMap[key] +
          ": <b>" +
          (NameMap[key].includes("率")
            ? hospital[key] + "%"
            : comma(hospital[key])) +
          "</b><br />"
        );
      })
      .join("") +
    "<span style='font-size:0.9em'>\uD83D\uDCCD " +
    hospital.address +
    "</span>"
  );
}

function comma(num) {
  return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

// TSVをデータに変換
function dataStore(data) {
  let hospitals = [];
  let skipHeader = true;
  data.forEach(function (row) {
    if (skipHeader) {
      skipHeader = false;
      return;
    }
    hospitals.push(
      new Hospital(
        row[0],
        parseInt(row[1]),
        parseInt(row[2]),
        parseInt(row[3]),
        parseFloat(row[4]),
        row[5],
      ),
    );
  });
  hospitalStore = new HospitalStore(hospitals);

  return data;
}

// TSVをテーブルに変換
function tabulate(data) {
  const table = d3.select("table");
  const thead = table.append("thead");
  const tbody = table.append("tbody");

  thead
    .append("tr")
    .selectAll(null)
    .data(data.shift())
    .enter()
    .append("th")
    .attr("nowrap", "nowrap")
    .text((d) => NameMap[d]);

  const rows = tbody.selectAll(null).data(data).enter().append("tr");

  rows
    .selectAll(null)
    .data((d) => d)
    .enter()
    .append("td")
    .text((d) => d);

  return table;
}
