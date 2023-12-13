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
        row[4] == "True",
        row[5] == "True",
        row[6] == "True",
        row[7] == "True",
        row[8] == "True",
        row[9] == "True",
        row[10] == "True",
        row[11] == "True",
        parseInt(row[12]),
        parseInt(row[13]),
        parseInt(row[14]),
        parseInt(row[15]),
        row[16],
      ),
    );
  });

  hospitalStore = new HospitalStore(hospitals);

  return data;
}
