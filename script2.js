let darkStatus = localStorage.getItem("darkStatus");
if (darkStatus == null) {
  darkStatus = "false";
}
checkDarkMode();


let details = [];
let loadingStatus = true;
loadDetails();

async function fetchDetails() {
  const res = await fetch(
    "https://restcountries.com/v3.1/name/" +
      localStorage.getItem("name") +
      "?fields=name,population,region,subregion,capital,tld,currencies,languages,flags,borders,"
  )
    .then((response) => response.json())
    .catch((err) => console.log("Error is :" + err));

  let nativeName = res[0].name.nativeName;
  let currencies = res[0].currencies;
  let languages = res[0].languages;

  let borders = [];
  for (let i = 0; i < res[0].borders.length; i++) {
    borders[i] = await getBorderName(res[0].borders[i]);
  }
  const object = {
    name: res[0].name.common,
    nativeName: nativeName[Object.keys(nativeName)].common,
    population: res[0].population,
    region: res[0].region,
    subRegion: res[0].subregion,
    capital: res[0].capital,
    tld: res[0].tld,
    currencies: currencies[Object.keys(currencies)].name,
    languages: languages[Object.keys(languages)],
    flag: res[0].flags.svg,
    borders: borders,
  };

  return object;
}

function checkDarkMode() {
  if (darkStatus == "true") {
    document.documentElement.style.setProperty("--color", "#ffffff");
    document.documentElement.style.setProperty("--font-grey", "#ffffff");
    document.documentElement.style.setProperty("--white", "#2b3945");
    document.documentElement.style.setProperty("--light-gray", "#202c37");
  } else if (darkStatus == "false") {
    document.documentElement.style.setProperty("--color", "black");
    document.documentElement.style.setProperty(
      "--font-grey",
      "rgb(80, 79, 79)"
    );
    document.documentElement.style.setProperty("--white", "#ffffff");
    document.documentElement.style.setProperty("--light-gray", "#fafafa");
  }
}

function switchDarkmode() {
  if (darkStatus == "false") {
    document.documentElement.style.setProperty("--color", "#ffffff");
    document.documentElement.style.setProperty("--font-grey", "#ffffff");
    document.documentElement.style.setProperty("--white", "#2b3945");
    document.documentElement.style.setProperty("--light-gray", "#202c37");
    localStorage.setItem("darkStatus", true);
    darkStatus = "true";
  } else if (darkStatus == "true") {
    document.documentElement.style.setProperty("--color", "black");
    document.documentElement.style.setProperty(
      "--font-grey",
      "rgb(80, 79, 79)"
    );
    document.documentElement.style.setProperty("--white", "#ffffff");
    document.documentElement.style.setProperty("--light-gray", "#fafafa");
    localStorage.setItem("darkStatus", false);
    darkStatus = "false";
  }
}


async function loadDetails() {
  details = await fetchDetails();
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

  let borderContainer = document.getElementsByClassName("borderItemContainer")[0];

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
