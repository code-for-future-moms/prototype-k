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
      .then(reloadTableWithoutFilter)
      .then(function () {
        updateFilter(area);
      });
  } else {
    d3.text(DataSource)
      .then(d3.tsvParseRows)
      .then(dataStore)
      .then(readyFilter)
      .then(reloadTableWithoutFilter);
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
    reloadData(cachedData);
    reloadTableWithFilter();
    performAfterSort(currentOrder);
  } else {
    d3.text(DataSource)
      .then(d3.tsvParseRows)
      .then(reloadData)
      .then(readySortButton)
      .then(selectInitialGraphData)
      .then(reloadTableWithFilter);
  }

  initialized = true;
}

function reloadTableWithFilter() {
  if (ShowAllDataInTable) {
    selectTableFilteredArea();
  } else {
    reloadTable();
  }
}

function reloadTableWithoutFilter() {
  if (ShowAllDataInTable) {
    reloadTable();
  }
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

// データの絞り込み
function reloadData(data) {
  let filter = getFilteredArea();
  let hospitals = [];
  let skipHeader = true;

  data.forEach(function (row) {
    if (skipHeader) {
      skipHeader = false;
      return;
    }
    let hospital = new Hospital(
      row[0],
      parseInt(row[1]),
      parseInt(row[2]),
      parseInt(row[3]),
      parseFloat(row[4]),
      row[5],
    );

    if (
      filter.length == 0 ||
      filter.some((area) => hospital.address.includes(area))
    ) {
      hospitals.push(hospital);
    }
  });

  hospitalStore = new HospitalStore(hospitals);
}
