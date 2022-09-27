let countries = [];
let timeout = null;

loadHome();

async function fetchByName(name) {
  document.getElementById("loader").style.display = "block";

  const res = await fetch(
    "https://restcountries.com/v3.1/name/" +
      name +
      "?fields=name,population,region,capital,flags,"
  )
    .then((response) => response.json())
    .catch((err) => console.log("Error is :" + err));

  for (let i = 0; i < res.length; i++) {
    let n = res[i].population;

    const object = {
      name: res[i].name.common,
      population: n.toLocaleString(),
      region: res[i].region,
      capital: res[i].capital,
      flag: res[i].flags.svg,
    };
    countries.unshift(object);
  }
}

async function loadHome() {

  const res = await fetch(
    "https://restcountries.com/v3.1/all"
  )
    .then((response) => response.json())
    .catch((err) => console.log("Error is :" + err));

  for (let i = 0; i < res.length; i++) {
    let n = res[i].population;

    const object = {
      name: res[i].name.common,
      population: n.toLocaleString(),
      region: res[i].region,
      capital: res[i].capital,
      flag: res[i].flags.svg,
    };
    countries.push(object);
  }

  displayCountries(countries);
}

function displayCountries(arr) {
  document.getElementById("loader").style.display = "none";
  document.getElementsByClassName("row")[0].innerHTML = "";
  if (arr.length == 0) {
    document.getElementsByClassName("errorHandler")[0].style.display = "block";
  } else {
    document.getElementsByClassName("errorHandler")[0].style.display = "none";
  }

  for (let i = 0; i < arr.length; i++) {
    addCountry(
      arr[i].flag,
      arr[i].name,
      arr[i].population,
      arr[i].region,
      arr[i].capital
    );
  }
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) =>
    card.addEventListener("click", (event) => {
      localStorage.setItem("name", card.children[1].children[0].innerText);
    })
  );
}

function addCountry(svg, name, population, region, capital) {
  let countryContainer = document.getElementsByClassName("row")[0];
  let innerText = `
    <div class="country">
      <a href="./details.html?country=${name}" class="link">
        <div class="card">
          <img src="${svg}" class="card-img-top" alt="..." />
          <div class="card-body">
            <h5 class="card-title">${name}</h5>
            <div class="card-text">
              <div class="card-text-item">
                <p>Population:</p>
                <span>${population}</span>
              </div>
              <div class="card-text-item">
                <p>Region:</p>
                <span>${region}</span>
              </div>
              <div class="card-text-item">
                <p>Capital:</p>
                <span>${capital}</span>
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
`;

  var newDiv = document.createElement("div");
  newDiv.className = "col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 countryCol";
  newDiv.innerHTML = innerText;
  countryContainer.appendChild(newDiv);
}

function search() {
  clearTimeout(timeout);
  timeout = setTimeout(async function () {
    countries = [];
    let searchText = document.getElementsByClassName("form-control")[0].value;
    document.getElementsByClassName("row")[0].innerHTML = "";

    if (searchText === "") {
      loadHome();
    } else {
      await fetchByName(searchText);
      console.log(1);
      displayCountries(countries.reverse());
    }
  }, 1000);
}

const dropDown = document.querySelectorAll(".dropdownItem");
const buttonText = document.getElementsByClassName("dropbtnText")[0];

dropDown.forEach((item) =>
  item.addEventListener("click", (event) => {
    let filter = item.innerText;
    buttonText.innerText = filter;
    if (filter === "All") {
      displayCountries(countries);
    } else {
      let newArr = [];
      for (let i = 0; i < countries.length; i++) {
        if (countries[i].region === filter) {
          newArr.unshift(countries[i]);
        }
      }
      document.getElementsByClassName("row")[0].innerHTML = "";
      displayCountries(newArr);
    }
  })
);
