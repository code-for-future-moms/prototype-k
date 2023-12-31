let _cities = new Set();

function readyFilter() {
  _cities = new Set();

  hospitalStore.hospitals.forEach((h) => {
    _cities.add(h.city);
  });

  const container = d3.select("#area-selector");

  const groups = container
    .selectAll("span")
    .data(_cities)
    .enter()
    .append("span");

  groups
    .append("input")
    .attr("type", "checkbox")
    .attr("id", (_, i) => "checkbox-" + i)
    .attr("value", (d) => d)
    .property("checked", true);

  groups
    .append("label")
    .attr("for", (_, i) => "checkbox-" + i)
    .text((d) => {
      return d + "(" + hospitalStore.countByArea(d) + ")";
    });

  const buttonGroup = container.append("div").attr("class", "buttons");

  buttonGroup
    .append("button")
    .text("表示")
    .on("click", function (_) {
      _performDisplayFilter();
    });

  buttonGroup
    .append("button")
    .text("選択解除")
    .on("click", function (_) {
      d3.selectAll("input:checked").property("checked", false);
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
    .select("#area-selector")
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
    ? "すべて"
    : areas.join(", ");
  d3.select("#filtered-label").text("▼ 表示地域：" + label);
}
