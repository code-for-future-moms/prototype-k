let hospitalStore = null;
let dataFilter = null;

$(document).ready(function () {
  d3.text(DataSource)
    .then(d3.tsvParseRows)
    .then(dataStore)
    .then(tabulate)
    .then(readyUpdate)
    .then(updateSorter)
    .then(selectInitialGraphData)
    .then(reloadDisplay)
    .then(readyFilter);
});

function performAfterFilter() {
  d3.selectAll(".contents").classed("none", false);
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

function reloadDisplay() {
  reloadTable();
  reloadGraph();
}

function reloadTable() {
  let api = $("#data").dataTable().api();
  let filter = getFilteredArea().join("|");
  if (filter.length > 0) {
    api.search("(?:" + filter + ")", true).draw();
  }
}

// グラフ表示の更新
function reloadGraph() {
  const store = hospitalStore.filtered(getFilteredArea()).sliced(GraphSample);

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
    {
      name: NameMap["birth_ratio"],
      color: ColorMap["birth_ratio"],
      data: store.getBirthRatio(),
      yAxis: 1,
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
    yAxis: [
      {
        title: {
          text: "",
        },
      },
      {
        title: {
          text: NameMap["birth_ratio"] + "(%)",
        },
        opposite: true,
        max: 100,
      },
    ],
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
