const LABEL_ALL = "すべて";

let _cities = new Set();

function readyFilter() {
  _cities = new Set();

  hospitalStore.hospitals.forEach((h) => {
    _cities.add(h.city);
  });

  const container = d3.select("#area-selector");

  const all = container
    .selectAll("div")
    .data([LABEL_ALL])
    .enter()
    .append("div")
    .append("span");

  all
    .append("input")
    .attr("type", "checkbox")
    .attr("id", (_, i) => "all-checkbox-" + i)
    .attr("value", (d) => d)
    .property("checked", true)
    .on("change", function (_) {
      d3.select("#area-selector div.areas")
        .selectAll("input")
        .property("checked", this.checked);
    });

  all
    .append("label")
    .attr("for", (_, i) => "all-checkbox-" + i)
    .text((d) => d);

  const areas = container.append("div").attr("class", "areas");

  const groups = areas.selectAll("span").data(_cities).enter().append("span");

  groups
    .append("input")
    .attr("type", "checkbox")
    .attr("id", (_, i) => "checkbox-" + i)
    .attr("value", (d) => d)
    .property("checked", true)
    .on("change", function (_) {
      const checkedAreas = d3
        .select("#area-selector div.areas")
        .selectAll("input:checked")
        .size();
      const result = checkedAreas === _cities.size;
      d3.select("#area-selector #all-checkbox-0").property("checked", result);
    });

  groups
    .append("label")
    .attr("for", (_, i) => "checkbox-" + i)
    .text((d) => {
      return d + "(" + hospitalStore.countByArea(d) + ")";
    });

  const buttonGroup = container.append("div").attr("class", "buttons");

  buttonGroup
    .append("button")
    .text("グラフを表示")
    .on("click", function (_) {
      _performDisplayFilter();
    });

  _reloadFilterLabel();

  d3.select("#filtered-label").on("click", function (_) {
    d3.select("#area-selector").classed("none", function (_) {
      return !d3.select(this).classed("none");
    });
  });
}

function updateFilter(area) {
  d3.selectAll("input:checked").property("checked", false);
  if (area.length > 0) {
    d3.selectAll("input").each(function () {
      let input = d3.select(this);
      if (area.includes(input.property("value"))) {
        input.property("checked", true);
      }
    });
  }

  _performDisplayFilter();
}

function getFilteredArea() {
  return d3
    .select("#area-selector div.areas")
    .selectAll("input:checked")
    .data()
    .map((d) => d);
}

function _performDisplayFilter() {
  _reloadFilterLabel();
  performAfterFilter();

  d3.select("#area-selector").classed("none", true);
}

function _reloadFilterLabel() {
  const areas = getFilteredArea();
  const label = [0, _cities.size].includes(areas.length)
    ? LABEL_ALL
    : areas.join(", ");
  d3.select("#filtered-label").text("▼ 表示地域：" + label);
}
