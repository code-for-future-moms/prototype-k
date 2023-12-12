let hospitalStore = null;
let dataHeaders = [];
let cachedData = null;

$(document).ready(function () {
  d3.text(DataSource)
    .then(d3.tsvParseRows)
    .then(dataStore)
    .then(initializePage);
});

function initializePage() {
  const button = d3.select("#search-button");
  button.on("click", function (_) {
    search($("#search-text").val().split(" "));
  });
}

function search(text) {
  // TODO: URLにパラメータを追加する
  const store = hospitalStore.filtered(text);
  showSearchResult(store.hospitals);
}

function showSearchResult(hospitals) {
  const container = d3.select("#result-list");
  container.selectAll("div").remove();

  const groups = container.selectAll("div").data(hospitals).enter();

  groups.append("div").html((hospital) => {
    return `<span>${hospital.name}</span><br><span>${hospital.address}</span>`;
  });
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
        row[1],
        row[2],
        row[3],
        row[4],
        row[5],
        row[6],
        row[7],
        row[8],
        row[9],
        row[10],
        row[11],
        row[12],
        row[13],
        row[14],
        row[15],
        // parseInt(row[3]),
        // parseFloat(row[4]),
      ),
    );
  });

  hospitalStore = new HospitalStore(hospitals);

  return data;
}
