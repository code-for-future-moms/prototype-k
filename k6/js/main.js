let hospitalStore = null;
let dataHeaders = [];
let cachedData = null;

$(document).ready(function () {
  d3.text(DataSource)
    .then(d3.tsvParseRows)
    .then(dataStore)
    .then(initializePage)
    .then(updateState);
});

$(window).on("popstate", function (_) {
  updateState();
});

function updateState(data) {
  if (data) {
    const queryString = Object.keys(data)
      .map((key) => `${key}=${encodeURIComponent(data[key])}`)
      .join("&");
    window.history.pushState(data, null, "?" + queryString);
  }

  const urlParams = new URLSearchParams(window.location.search);
  const postalCode = urlParams.get("postalCode");
  const range = urlParams.get("range");
  const name = urlParams.get("search");
  document.getElementById("address-search-range").selectedIndex = range || 0;
  $("#address-search-text").val(postalCode || "");
  $("#name-search-text").val(name || "");

  if (postalCode != null && range != null) {
    $("#name-search").hide();
    addressSearch(postalCode);
  } else if (name != null) {
    $("#name-search").show();
    nameSearch(name);
  } else {
    $("#name-search").show();
    $("#search-result").hide();
  }
}

function initializePage() {
  d3.select("#address-search-form").on("submit", function (event) {
    event.preventDefault();
    const postalCode = $("#address-search-text").val();
    const index = document.getElementById("address-search-range").selectedIndex;
    updateState({ postalCode: postalCode, range: index });
  });

  d3.select("#name-search-form").on("submit", function (event) {
    event.preventDefault();
    const name = $("#name-search-text").val();
    updateState({ search: name });
  });
}

function addressSearch(postalCode) {
  const url = `https://geoapi.heartrails.com/api/json?method=searchByPostal&postal=${postalCode}&jsonp=addressSearchCallback`;
  const script = document.createElement("script");
  script.src = url;
  document.body.appendChild(script);
}

function addressSearchCallback(callback) {
  const x = callback.response.location[0].x;
  const y = callback.response.location[0].y;
  const store = hospitalStore
    .distanceFilter(x, y, $("#address-search-range").val())
    .sortedByDistance();
  showSearchResult(store.hospitals);
}

function nameSearch(text) {
  const store = hospitalStore.filtered(text);
  showSearchResult(store.hospitals);
}

function showSearchResult(hospitals) {
  $("#search-result").show();

  const container = d3.select("#result-list");
  container.selectAll("div").remove();

  const groups = container.selectAll("div").data(hospitals).enter();

  groups
    .append("div")
    .attr("class", "card")
    .html((hospital) => {
      const distance = hospital.distance
        ? `<div class="distance"><img src="images/pin.svg" /> 約${
            Math.floor(hospital.distance * 100) / 100
          }km</div>`
        : "";
      return `
<hr />

<div class="meta">
  ${distance}
  <h3 class="title"><a href="${hospital.url}">${hospital.name}</a></h3>
  <div class="address">${hospital.address}</div>
</div>

<div class="data">
  <h4>治療内容</h4>
  <div class="flags">
    <div class="flags-data">
      ${_flagToTag(hospital.flag1, "人工授精")}
      ${_flagToTag(hospital.flag2, "採卵術")}
      ${_flagToTag(hospital.flag3, "体外受精")}
      ${_flagToTag(hospital.flag4, "顕微授精")}
    </div>
    <div class="flags-data">
      ${_flagToTag(hospital.flag5, "新鮮胚移植")}
      ${_flagToTag(hospital.flag6, "凍結・融解胚移植")}
      ${_flagToTag(hospital.flag7, "精巣内精子採取術")}
      ${_flagToTag(hospital.flag8, "顕微鏡下精巣内精子採取術")}
    </div>
  </div>
</div>

<div class="data">
  <h4>凍結胚を用いた治療成績</h4>
  <div class="numbers">
    <div class="item">採卵総回数（回）</div>
    <div class="value">${hospital.frozen_egg}</div>
    <div class="item">妊娠数（回）</div>
    <div class="value">${hospital.frozen_preg}</div>
    <div class="item">生産分娩数（回）</div>
    <div class="value">${hospital.frozen_birth}</div>
    <div class="item">移植あたり生産率（%）</div>
    <div class="value">${hospital.frozen_rate}%</div>
  </div>
</div>
`;
    });
}

function _flagToTag(flag, label) {
  return `
<div class="check-${flag ? "on" : "off"}">
  <img src='images/check_${flag ? "on" : "off"}.svg' /> ${label}
</div>`;
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
        row[19],
      ),
    );
  });

  hospitalStore = new HospitalStore(hospitals);

  return data;
}
