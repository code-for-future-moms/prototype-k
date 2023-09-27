let hospitalStore = null;
let initialized = false;

$(document).ready(function () {
  d3.text(DataSource)
    .then(d3.tsvParseRows)
    .then(dataStore)
    .then(selectInitialGraphData)
    .then(readyFilter);
});

function performAfterFilter() {
  d3.selectAll(".contents").classed("none", false);

  if (initialized) {
    reloadDisplay();
  } else {
    d3.text(DataSource)
      .then(d3.tsvParseRows)
      .then(tabulate)
      .then(readyUpdate)
      .then(updateSorter)
      .then(reloadDisplay);
  }

  initialized = true;
}

// TSVをデータに変換
function dataStore(data) {
  let hospitals = [];
  let skipHeader = true;

  data.forEach(function (row) {
    if (skipHeader) {
      skipHeader = false;
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
