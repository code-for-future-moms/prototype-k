let initialized = false;
let hospitalStore = null;
let dataHeaders = [];
let cachedData = null;
let currentOrder = null;
let skipSave = false;

$(document).ready(function () {
  let area = loadFilterArea();

  if (area) {
    d3.text(DataSource)
      .then(d3.tsvParseRows)
      .then(dataStore)
      .then(readyFilter)
      .then(function () {
        updateFilter(area);
      });
  } else {
    d3.text(DataSource).then(d3.tsvParseRows).then(dataStore).then(readyFilter);
  }
});

$(window).on("popstate", function (event) {
  if (event.originalEvent.state) {
    let area = event.originalEvent.state.area;
    skipSave = true;
    updateFilter(area.split(","));
  } else {
    d3.select("#area-selector").classed("none", false);
  }
});

function performAfterFilter() {
  if (!skipSave) saveFilterArea();
  skipSave = false;

  if (initialized) {
    selectTableFilteredArea();
    performAfterSort(currentOrder);
  } else {
    d3.text(DataSource)
      .then(d3.tsvParseRows)
      .then(reloadTable)
      .then(readySortButton)
      .then(selectTableFilteredArea)
      .then(selectInitialGraphData);
  }

  initialized = true;
}

function saveFilterArea() {
  let area = getFilteredArea().join(",");
  window.history.pushState({ area: area }, null, "?area=" + area);
}

function loadFilterArea() {
  let urlParams = new URLSearchParams(window.location.search);
  let area = urlParams.get("area");
  return area != null ? area.split(",") : null;
}

function performAfterSort(sorter) {
  currentOrder = sorter;
  hospitalStore = hospitalStore.sorted(sorter);
  reloadGraph();
}

// TSVをデータに変換
function dataStore(data) {
  cachedData = data;

  let hospitals = [];

  data.forEach(function (row) {
    if (dataHeaders.length == 0) {
      row.unshift("viz");
      dataHeaders = row;
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
