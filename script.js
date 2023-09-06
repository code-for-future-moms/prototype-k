// データ
const DataSource = 'https://raw.githubusercontent.com/sunmoonStern/funin-open-data/main/hospital-data-address.tsv'

// 医療機関の最大選択数
const PlotSample = 20;

// TSVのヘッダーと日本語名の対応
const NameMap = {
   'et_count': '移植数',
   'preg_count': '妊娠数',
   'birth_count': '分娩数',
   'birth_ratio': '分娩率'
};

// グラフの色
const ColorMap = {
   'et_count': '#289CFD',
   'preg_count': '#4236B8',
   'birth_ratio': '#1DE15F',
}

// デフォルトの表示項目
const DefaultSwitchers = [NameMap['et_count']];

// デフォルトの並び順
const DefaultSorter = 'et_count';

// 状態用グローバル変数
let activeSorter = null;
let filters = [];

$(document).ready(function () {
   d3.text(DataSource)
      .then(d3.tsvParseRows)
      .then(tabulate)
      .then(readyUpdate)
      .then(updateSwitcher)
      .then(updateSorter)
      .then(selectInitialGraphData)
      .then(reloadCharts);
});

// 表示項目ボタンの作成
function updateSwitcher() {
   let categories = getDataCategories();
   categories = categories.filter((data) => {
      return data != NameMap['birth_count'];
   });

   filters = [...categories.filter((data) => { return DefaultSwitchers.includes(data); })];

   const switcher = d3.select("#switcher")
      .selectAll("div")
      .data(categories)
      .enter()
      .append("div")
      .attr("class", function(d) {
         return filters.includes(d) ? "checkbox checked" : "checkbox";
      })
      .on("click", function(_, d) {
         let checked = !d3.select(this).classed("checked");
         if (checked) {
            filters.push(d);
         } else {
            const index = filters.indexOf(d);
            if (index > -1) {
               filters.splice(index, 1);
            }
         }
         d3.select(this).classed("checked", checked);
         reloadCharts();
      });

   let colorMapJP = {};
   for (const key in NameMap) {
      if (ColorMap.hasOwnProperty(key)) {
         colorMapJP[NameMap[key]] = ColorMap[key];
      }
   }
   switcher.append("svg")
      .attr("width", 12)
      .attr("height", 12)
      .append("circle")
      .attr("cx", 6)
      .attr("cy", 6)
      .attr("r", 6)
      .attr("fill", (d) => colorMapJP[d]);

   switcher.append("span")
      .text((d) => d);
}

// 並び替えボタンの作成
function updateSorter() {
   let categories = getDataCategories();
   d3.select("#sorter")
      .append("div")
      .attr("class", "btn-group btn-group-sm")
      .attr("role", "group")
      .selectAll("button")
      .data(categories)
      .enter()
      .append("button")
      .attr("type", "button")
      .attr("class", "btn btn-outline-secondary")
      .text((d) => d)
      .on("click", function (d) {
         if (activeSorter) {
            activeSorter.classed("btn-secondary", false).classed("btn-outline-secondary", true);
         }
         activeSorter = d3.select(this);
         activeSorter.classed("btn-outline-secondary", false).classed("btn-secondary", true);

         let sorter = d.target.value;
         let index = categories.indexOf(sorter) + 1;
         var api = $("#data").dataTable().api();
         api.column(index).order('desc').draw();
         reloadCharts();
      });
}

// 初期表示の医療機関の選択、表示項目、並び替えを設定
function selectInitialGraphData() {
   let categories = getDataCategories();
   let index = categories.indexOf(NameMap[DefaultSorter]) + 1;
   let api = $("#data").dataTable().api();
   api.column(index).order('desc').draw();
   api.rows().every(function(index, tableLoop, rowLoop) {
      if (rowLoop < PlotSample * 0.5) {
         this.select();
      }
   }).draw();

   activeSorter = d3.selectAll('button.btn').filter(function(d) {
      return (d === NameMap[DefaultSorter]);
   }).classed('btn-outline-secondary', false)
      .classed('btn-secondary', true);
}

// データテーブルの作成
function readyUpdate() {
   const table = $("#data").DataTable({
      dom: "Bfrtip",
      select: {
         style: "multi"
      },
      language: {
         search: "クリニック名や住所で検索→"
      },
      buttons: [
         {
            text: "グラフ更新",
            action: function () {
               reloadCharts();
            }
         },
         {
            text: "選択解除",
            action: function () {
               table.rows({ selected: true }).deselect();
               reloadCharts();
            }
         }
      ]
   });
}

// グラフ表示の更新
function reloadCharts() {
   const hospitalNames = getHospitalNames().slice(0, PlotSample);

   const etCount = getEtCount().slice(0, PlotSample);
   const pregCount = getPregCount().slice(0, PlotSample);
   const birthRate = getBirthRate().slice(0, PlotSample);
   updateCharts(hospitalNames, etCount, pregCount, birthRate);
   updateCounter(hospitalNames.length);
}

// データリストからカテゴリーを取得
function getDataCategories() {
   var categories = [];
   var api = $("#data").dataTable().api();

   var headers = api.columns().header().toArray();
   headers.forEach(function(heading, index) {
      if (index > 0 && index < headers.length - 1) {
         categories.push($(heading).html());
      }
   });

   return categories;
}

// データリストから医療機関名を取得
function getHospitalNames() {
   // table.rows( { selected: true } );

   var names = [];
   var api = $("#data").dataTable().api();

   let rows = api.rows({ selected: true }).data().toArray();

   rows.forEach(function (row) {
      names.push(row[0]);
   });
   return names;
}

// データリストから移植数を取得
function getEtCount() {
   var stats = [];
   var api = $("#data").dataTable().api();

   let rows = api.rows({ selected: true }).data().toArray();

   rows.forEach(function (row) {
      stats.push(parseInt(row[1]));
   });
   return stats;
}

// データリストから妊娠数を取得
function getPregCount() {
   var stats = [];
   var api = $("#data").dataTable().api();

   let rows = api.rows({ selected: true }).data().toArray();

   rows.forEach(function (row) {
      stats.push(parseInt(row[2]));
   });
   return stats;
}

// データリストから分娩率を取得
function getBirthRate() {
   var stats = [];
   var api = $("#data").dataTable().api();

   let rows = api.rows({ selected: true }).data().toArray();

   rows.forEach(function (row) {
      stats.push(parseFloat(row[4]));
   });
   return stats;
}

// グラフの更新
function updateCharts(hospitalNames, etCount, pregCount, birthRate) {
   let series = [
      {
         name: NameMap["et_count"],
         color: ColorMap["et_count"],
         data: etCount,
      },
      {
         name: NameMap["preg_count"],
         color: ColorMap["preg_count"],
         data: pregCount,
      },
      {
         name: NameMap["birth_ratio"],
         color: ColorMap["birth_ratio"],
         data: birthRate,
         yAxis: 1,
      }
   ];

   series = series.filter((data) => {
      return filters.includes(data.name);
   });

   Highcharts.chart("container", {
      chart: {
         type: "column"
      },
      title: {
         text: "",
         align: "left"
      },
      xAxis: {
         categories: hospitalNames,
         crosshair: true,
         // labels: {
         //    overflow: 'allow',
         //    rotation: -80,
         //    style: {
         //       textOverflow: 'none' // 省略マーク(...)を表示しない
         //    }
         // }
      },
      yAxis: [{
         title: {
            text: ''
         },
      }, {
         title: {
            text: filters.includes(NameMap["birth_ratio"]) ? NameMap["birth_ratio"] : "",
         },
         opposite: true,
      }],
      series: series,
   });
}

// 表示件数の更新
function updateCounter(count) {
   let max = $("#data").dataTable().api().rows().count();
   $("#counter_current").text(count + " / " + max + "件");
   $("#counter_max").text(PlotSample);
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
      .attr('nowrap', 'nowrap')
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

