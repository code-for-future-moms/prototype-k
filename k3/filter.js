// データから取得できるようにしたい
const AREAS = [
  "千代田区",
  "中央区",
  "港区",
  "新宿区",
  "文京区",
  "台東区",
  "墨田区",
  "江東区",
  "品川区",
  "目黒区",
  "大田区",
  "世田谷区",
  "渋谷区",
  "杉並区",
  "豊島区",
  "北区",
  "板橋区",
  "練馬区",
  "足立区",
  "立川市",
  "武蔵野市",
  "三鷹市",
  "府中市",
  "調布市",
  "町田市",
  "国分寺市",
  "多摩市",
];

function readyFilter() {
  const container = d3.select("#area-selector");

  const groups = container.selectAll("span").data(AREAS).enter().append("span");

  groups
    .append("input")
    .attr("type", "checkbox")
    .attr("id", (_, i) => "checkbox-" + i)
    .attr("value", (d) => d);

  groups
    .append("label")
    .attr("for", (_, i) => "checkbox-" + i)
    .text((d) => {
      return d + "(" + hospitalStore.countByArea(d) + ")";
    });

  const buttonGroup = container.append("div").attr("class", "buttons");

  buttonGroup
    .append("button")
    .text("更新")
    .on("click", function (_) {
      reloadFilterLabel();
      reloadAllGraph();
    });

  buttonGroup
    .append("button")
    .text("リセット")
    .on("click", function (_) {
      d3.selectAll("input:checked").property("checked", false);
    });

  reloadFilterLabel();

  d3.select("#filtered-label").on("click", function (_) {
    d3.select("#area-selector").classed("none", function (_) {
      return !d3.select(this).classed("none");
    });
  });
}

function reloadFilterLabel() {
  const area = getFilteredArea()
    .map((d) => d)
    .join(", ");

  const label = area.length === 0 ? "すべて" : area;
  d3.select("#filtered-label").text("▼ 表示地域：" + label);

  d3.select("#area-selector").classed("none", true);
}

function getFilteredArea() {
  return d3
    .select("#area-selector")
    .selectAll("input:checked")
    .data()
    .map((d) => d);
}
