let loadingStatus = true;
const params = new URLSearchParams(window.location.search);
let countryname = params.get("country");
loadDetails();

async function fetchDetails() {
  const res = await fetch(
    "https://restcountries.com/v3.1/name/" +
    countryname +
      "?fields=name,population,region,subregion,capital,tld,currencies,languages,flags,borders,"
  )
    .then((response) => response.json())
    .catch((err) => console.log("Error is :" + err));

  let nativeName = res[0].name.nativeName;
  let currencies = res[0].currencies;

  let tld = "";
  for (const tlds in res[0].tld) {
    tld = tld + res[0].tld[tlds] + ", ";
  }

  let languages = "";
  for (const langauge in res[0].languages) {
    languages = languages + res[0].languages[langauge] + ", ";
  }

  let borders = [];
  for (let i = 0; i < res[0].borders.length; i++) {
    borders[i] = await getBorderName(res[0].borders[i]);
  }
  let n = res[0].population;

  const object = {
    name: res[0].name.common,
    nativeName: nativeName[Object.keys(nativeName)[0]].common,
    population: n.toLocaleString(),
    region: res[0].region,
    subRegion: res[0].subregion,
    capital: res[0].capital,
    tld: tld.substring(0, tld.length - 2),
    currencies: currencies[Object.keys(currencies)].name,
    languages: languages.substring(0, languages.length - 2),
    flag: res[0].flags.svg,
    borders: borders,
  };

  return object;
}

async function loadDetails() {
  let details = await fetchDetails();
  document.getElementById("loader").style.display = "none";
  let detailsContainer = document.getElementsByClassName("row")[0];
  let imageHtml = `
        <img src="${details.flag}" class="img" />
`;

  var imageDiv = document.createElement("div");
  imageDiv.className = "col-12 col-md-12 col-lg-6 imgCol";
  imageDiv.innerHTML = imageHtml;
  detailsContainer.appendChild(imageDiv);

  let detailsHtml = `
        <div class="detailsContainer">
            <h2>${details.name}</h2>
            <div class="info d-flex justify-content-between">
                <div class="infoText">
                    <p>Native Name:<span>${details.nativeName}</span></p>
                    <p>Population:<span>${details.population}</span></p>
                    <p>Region:<span>${details.region}</span></p>
                    <p>Sub Region:<span>${details.subRegion}</span></p>
                    <p>Capital:<span>${details.capital}</span></p>
                </div>
                <div class="infoText">
                    <p>Top Level Domain:<span>${details.tld}</span></p>
                    <p>Currencies:<span>${details.currencies}</span></p>
                    <p>Languages:<span>${details.languages}</span></p>
                </div>
            </div>
            <div class="borderCountries d-flex align-items-center">
                <span>Border Countries:</span>
                <div class="borderItemContainer d-flex"></div>
            </div>
        </div>
`;

  var detailsDiv = document.createElement("div");
  detailsDiv.className = "col-12 col-md-12 col-lg-6 detailsCol";
  detailsDiv.innerHTML = detailsHtml;
  detailsContainer.appendChild(detailsDiv);

  let borderContainer = document.getElementsByClassName(
    "borderItemContainer"
  )[0];

  if (details.borders.length === 0) {
    let borderHtml = "No border countries";
    var borderDiv = document.createElement("div");
    borderDiv.className = "borderItem";
    borderDiv.innerHTML = borderHtml;
    borderContainer.appendChild(borderDiv);
  } else {
    for (let i = 0; i < details.borders.length; i++) {
      let borderHtml = details.borders[i] + "";
      var borderDiv = document.createElement("div");
      borderDiv.className = "borderItem";
      borderDiv.innerHTML = borderHtml;
      borderContainer.appendChild(borderDiv);
    }
  }
}

async function getBorderName(border) {
  const res = await fetch(
    "https://restcountries.com/v3.1/alpha/" + border + "?fields=name,"
  )
    .then((response) => response.json())
    .catch((err) => console.log("Error is :" + err));

  return res.name.common;
}
