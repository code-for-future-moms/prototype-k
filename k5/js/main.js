let initialized = false;
let hospitalStore = null;
let dataHeaders = [];
let cachedData = null;
let currentOrder = null;

$(document).ready(function () {
  d3.text(DataSource).then(d3.tsvParseRows).then(dataStore).then(readyFilter);
});

function performAfterFilter() {
  d3.selectAll(".contents").classed("none", false);

  if (initialized) {
    reloadData(cachedData);
    reloadTable();
    performAfterSort(currentOrder);
  } else {
    d3.text(DataSource)
      .then(d3.tsvParseRows)
      .then(reloadData)
      .then(reloadTable)
      .then(readySortButton)
      .then(selectInitialGraphData);
  }

  initialized = true;
}

function performAfterSort(sorter) {
  currentOrder = sorter;
  hospitalStore = hospitalStore.sorted(sorter);
  reloadDisplay();
}

// TSVをデータに変換
function dataStore(data) {
  cachedData = data;

  let hospitals = [];

  data.forEach(function (row) {
    if (dataHeaders.length == 0) {
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
