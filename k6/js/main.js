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
  d3.select("#address-search-button").on("click", function (_) {
    addressSearch($("#address-search-text").val());
  });

  d3.select("#name-search-button").on("click", function (_) {
    nameSearch($("#name-search-text").val().split(" "));
  });
}

function addressSearch(postalCode) {
  const url = `https://geoapi.heartrails.com/api/json?method=searchByPostal&postal=${postalCode}&jsonp=addressSearchCallback`;
  const script = document.createElement("script");
  script.src = url;
  document.body.appendChild(script);
}

function addressSearchCallback(callback) {
  // TODO: URLにパラメータを追加する
  const x = callback.response.location[0].x;
  const y = callback.response.location[0].y;
  const store = hospitalStore
    .distanceFilter(x, y, $("#address-search-range").val())
    .sortedByDistance();
  showSearchResult(store.hospitals);
}

function nameSearch(text) {
  // TODO: URLにパラメータを追加する
  const store = hospitalStore.filtered(text);
  showSearchResult(store.hospitals);
}

function showSearchResult(hospitals) {
  const container = d3.select("#result-list");
  container.selectAll("div").remove();

  const groups = container.selectAll("div").data(hospitals).enter();

  groups
    .append("div")
    .attr("class", "card")
    .html((hospital) => {
      const distance = hospital.distance
        ? `<div class="distance">📍 ${
            Math.floor(hospital.distance * 100) / 100
          }km</div>`
        : "";
      return `
<div class="meta">
  ${distance}
  <h3 class="title">${hospital.name}</h3>
  <div class="address">${hospital.address}</div>
  <div class="phone">${hospital.phone} </div>
  <div class="url"><a href="${hospital.url}">${hospital.url}</a></div>
</div>

<div class="information">
  <div class="flags">
    <div class="item">人工授精</div>
    <div class="value">${hospital.flag1 ? "o" : "x"}</div>
    <div class="item">採卵術</div>
    <div class="value">${hospital.flag2 ? "o" : "x"}</div>
    <div class="item">体外受精</div>
    <div class="value">${hospital.flag3 ? "o" : "x"}</div>
    <div class="item">顕微授精</div>
    <div class="value">${hospital.flag4 ? "o" : "x"}</div>
    <div class="item">新鮮胚移植</div>
    <div class="value">${hospital.flag5 ? "o" : "x"}</div>
    <div class="item">凍結・融解胚移植</div>
    <div class="value">${hospital.flag6 ? "o" : "x"}</div>
    <div class="item">精巣内精子採取術</div>
    <div class="value">${hospital.flat7 ? "o" : "x"}</div>
    <div class="item">顕微鏡下精巣内精子採取術</div>
    <div class="value">${hospital.flag8 ? "o" : "x"}</div>
  </div>

  <div class="data">
    <div class="item">採卵総回数（回）</div>
    <div class="value">${hospital.frozen_egg}</div>
    <div class="item">妊娠数（回）</div>
    <div class="value">${hospital.frozen_preg}</div>
    <div class="item">生産分娩数（回）</div>
    <div class="value">${hospital.frozen_birth}</div>
    <div class="item">移植あたり生産率（%）</div>
    <div class="value">${hospital.frozen_rate}%</div>
    <div class="item">&nbsp;</div> <div class="value">&nbsp;</div>
    <div class="item">&nbsp;</div> <div class="value">&nbsp;</div>
    <div class="item">&nbsp;</div> <div class="value">&nbsp;</div>
    <div class="item">&nbsp;</div> <div class="value">&nbsp;</div>
  </div>
</div>

`;
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
        parseFloat(row[17]),
        parseFloat(row[18]),
      ),
    );
  });

  hospitalStore = new HospitalStore(hospitals);

  return data;
}
