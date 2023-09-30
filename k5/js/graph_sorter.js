// 状態用グローバル変数
let activeSorter = null;

// 初期表示の医療機関の選択
function selectInitialGraphData() {
  activeSorter = d3
    .selectAll("button.btn")
    .filter(function (d) {
      return d === DefaultSorter;
    })
    .classed("btn-outline-secondary", false)
    .classed("btn-secondary", true);
  performAfterSort(DefaultSorter);
}

// 並び替えボタンの作成
function readySortButton() {
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
    .text((key) => Columns[key].label + "順")
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

      performAfterSort(this.value);
    });
}
