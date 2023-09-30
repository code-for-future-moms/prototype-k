let dataTable = null;

function reloadDisplay() {
  _reloadGraph();
  _generateTable();
  _tableToDataTable();
}

// データテーブルの作成
function _tableToDataTable() {
  dataTable = $("#data").DataTable({
    dom: "Bfrtip",
    language: {
      search: "検索:",
    },
    info: false,
    pageLength: PlotSample,
    buttons: {
      buttons: ["copy", "csv", "excel"],
    },
    columnDefs: [
      { targets: [1, 2, 3, 4], searchable: false },
      {
        targets: 5,
        data: "map_link",
        render: function (data) {
          return (
            '<a href="https://maps.google.com/?hl=ja&q=' +
            data +
            '">' +
            data +
            "</a>"
          );
        },
      },
    ],
  });
}

// TSVをテーブルに変換
function _generateTable() {
  if (dataTable) {
    dataTable.destroy();
  }

  const table = d3.select("table");
  table.selectAll("*").remove();

  const thead = table.append("thead");
  const tbody = table.append("tbody");

  thead
    .append("tr")
    .selectAll(null)
    .data(dataHeaders)
    .enter()
    .append("th")
    .attr("nowrap", "nowrap")
    .text((d) => (Columns[d] ? Columns[d].label : d));

  const rows = tbody
    .selectAll(null)
    .data(
      hospitalStore.hospitals.map((h) => [
        h.name,
        h.et_count,
        h.preg_count,
        h.birth_count,
        h.birth_ratio,
        h.address,
      ]),
    )
    .enter()
    .append("tr");

  rows
    .selectAll(null)
    .data((d) => d)
    .enter()
    .append("td")
    .text((d) => d);

  return table;
}

// グラフ表示の更新
function _reloadGraph() {
  const store = hospitalStore.sliced(GraphSample);

  const hospitalNames = store.getHospitalNamesWithAddress();

  let series = [
    {
      name: Columns.et_count.label,
      color: Columns.et_count.color,
      data: store.getEtCount(),
    },
    {
      name: Columns.preg_count.label,
      color: Columns.preg_count.color,
      data: store.getPregCount(),
    },
    {
      name: Columns.birth_count.label,
      color: Columns.birth_count.color,
      data: store.getBirthCount(),
    },
    {
      name: Columns.birth_ratio.label,
      color: Columns.birth_ratio.color,
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
          text: Columns.birth_ratio.label + "(%)",
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
    GraphTooltip.map(function (key) {
      const column = Columns[key];
      return (
        '&nbsp;<span style="color:' +
        column.color +
        '">\u25CF</span> ' +
        column.label +
        ": <b>" +
        (column.label.includes("率")
          ? hospital[key] + "%"
          : comma(hospital[key])) +
        "</b><br />"
      );
    }).join("") +
    "<span style='font-size:0.9em'>\uD83D\uDCCD " +
    hospital.address +
    "</span>"
  );
}

function comma(num) {
  return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}
