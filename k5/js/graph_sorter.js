// 状態用グローバル変数
let activeSorter = null;

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
      reloadDisplay();
    });
}
