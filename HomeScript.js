let countries = [];
let favorites = getFavourites() ? getFavourites() : [];
let timeout = null;
let draggedCountry = {
  name: "",
  flag: "",
};
const dropDown = document.querySelectorAll(".dropdownItem");
const buttonText = document.getElementsByClassName("dropbtnText")[0];

init();

async function init() {
  await loadAll();
  displayCountries(countries);
  displayFavorites();
}

async function loadAll() {
  const res = await fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .catch((err) => console.log("Error is :" + err));

  for (let i = 0; i < res.length; i++) {
    let population = res[i].population;
    let isFavorite = false;

    favorites.forEach(function (arrayItem) {
      if (arrayItem.name === res[i].name.common) {
        isFavorite = true;
      }
    });

    const object = {
      name: res[i].name.common,
      population: population.toLocaleString(),
      region: res[i].region,
      capital: res[i].capital,
      flag: res[i].flags.svg,
      favorites: isFavorite,
    };
    countries.push(object);
  }
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
      arr[i].capital,
      arr[i].favorites
    );
  }
}

function displayFavorites() {
  // let allElements = document.getElementsByClassName("card-body");

  // for (let i = 0; i < favorites.length; i++) {
  //   for (let j = 0; j < allElements.length; j++) {
  //     if (allElements[j].childNodes[1].innerText == favorites[i].name) {
  //       const item = allElements[j].childNodes[5].childNodes[1];
  //       item.style.color = "rgb(226, 152, 60)";
  //       console.log(allElements[j].childNodes[5].childNodes[1]);
  //     } else {
  //       const item = allElements[j].childNodes[5].childNodes[1];
  //       item.style.color = "rgb(203, 203, 203)";
  //     }
  //   }
  // }

  if (favorites.length < 1) {
    let favoriteContainer = document.getElementsByClassName("dropArea")[0];
    favoriteContainer.innerHTML =
      "<span>Add countries by draging them over here :)</span>";
  } else {
    let favoriteContainer = document.getElementsByClassName("dropArea")[0];
    favoriteContainer.innerHTML = "";
    for (let i = 0; i < favorites.length; i++) {
      let innerText = `
        <div>
          <img class="borderRadios" src="${favorites[i].flag}" />
          <span>${favorites[i].name}</span>
        </div>
        <button onclick="remove(event)">x</button>
    `;

      var newItem = document.createElement("i");
      newItem.className = "favoriteItem";
      newItem.innerHTML = innerText;
      favoriteContainer.appendChild(newItem);
    }
  }
}

//--------------------------------------------------------------------------------

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
    let population = res[i].population;
    let isFavorite = false;

    favorites.forEach(function (arrayItem) {
      if (arrayItem.name === res[i].name.common) {
        isFavorite = true;
      }
    });
    const object = {
      name: res[i].name.common,
      population: population.toLocaleString(),
      region: res[i].region,
      capital: res[i].capital,
      flag: res[i].flags.svg,
      favorites: isFavorite,
    };
    countries.unshift(object);
  }
}

function dragStart(event) {
  event.target.style.opacity = "0.5";

  draggedCountry.name =
    event.target.childNodes[1].childNodes[3].childNodes[1].innerText;

  draggedCountry.flag =
    event.target.childNodes[1].childNodes[1].childNodes[1].src;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();
  let found = false;
  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i].name == draggedCountry.name) {
      found = true;
    }
  }

  if (!found) {
    favorites.push({ name: draggedCountry.name, flag: draggedCountry.flag });
    for (let i = 0; i < countries.length; i++) {
      if (draggedCountry.name == countries[i].name) {
        countries[i].favorites = true;
      }
    }
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayFavorites();
  document.getElementsByClassName("favorites")[0].style.border =
    "0px solid grey";
}

function addCountry(svg, name, population, region, capital, favorite) {
  let color = "";
  if (favorite) {
    color = "rgb(226, 152, 60)";
  } else {
    ("rgb(203, 203, 203)");
  }

  let countryContainer = document.getElementsByClassName("row")[0];
  let innerText = `
    <div class="country" draggable="true" ondragstart="dragStart(event)" ondragend="dragEnd(event)">
      <div class="card" >
        <a href="./details.html?country=${name}" class="link" draggable="false">
          <img src="${svg}" draggable="false" class="card-img-top" alt="..." />
        </a>
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
          <div class="starContainer">
            <i class="fa-sharp fa-solid fa-star Star" style="color:${color}" onclick="mobileSetFavorite(event)" ></i>
          </div>
        </div>
      </div>
    </div>
`;

  var newDiv = document.createElement("div");
  newDiv.className = "col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 countryCol";
  newDiv.innerHTML = innerText;
  countryContainer.appendChild(newDiv);
}

async function search() {
  clearTimeout(timeout);
  timeout = setTimeout(async function () {
    countries = [];
    let searchText = document.getElementsByClassName("form-control")[0].value;
    document.getElementsByClassName("row")[0].innerHTML = "";

    console.log(searchText == "");
    if (searchText == "") {
      await loadAll();
      displayCountries(countries);
    } else {
      await fetchByName(searchText);
      displayCountries(countries);
    }
  }, 1000);
}

dropDown.forEach((item) =>
  item.addEventListener("click", (event) => {
    let filter = item.innerText;
    buttonText.innerText = filter;
    if (filter === "All") {
      displayCountries(countries);
    } else if (filter === "Favorites") {
      let newArr = [];

      for (let i = 0; i < countries.length; i++) {
        if (countries[i].favorites) {
          newArr.unshift(countries[i]);
        }
      }
      document.getElementsByClassName("row")[0].innerHTML = "";
      displayCountries(newArr);
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

function remove(event) {
  const name = event.target.parentElement.childNodes[1].childNodes[3].innerText;

  const dropArea = document.getElementsByClassName("dropArea")[0];
  dropArea.removeChild(event.target.parentElement);

  if (favorites.length <= 1) {
    favorites = [];
  } else {
    for (let i = 0; i < favorites.length; i++) {
      if (favorites[i].name == name) {
        favorites.splice(i, 1);
      }
    }
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayFavorites();
}

function mobileSetFavorite(event) {
  let name = event.target.parentNode.parentNode.childNodes[1].innerText;
  let found = false;
  for (let i = 0; i < favorites.length; i++) {
    if (name == favorites[i].name) {
      found = true;
    }
  }

  if (!found) {
    event.target.style.color = "rgb(226, 152, 60)";
    let name = event.target.parentNode.parentNode.childNodes[1].innerText;
    let flag =
      event.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[1]
        .src;
    favorites.push({ name: name, flag: flag });
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
  } else {
    event.target.style.color = "rgb(203, 203, 203)";
    let name = event.target.parentNode.parentNode.childNodes[1].innerText;
    if (favorites.length <= 1) {
      favorites = [];
    } else {
      for (let i = 0; i < favorites.length; i++) {
        if (favorites[i].name == name) {
          favorites.splice(i, 1);
        }
      }
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
  }
}

function getFavourites() {
  return JSON.parse(localStorage.getItem("favorites"));
}

function dragEnd(event) {
  event.target.style.opacity = "1";
}

function changeBorder() {
  document.getElementsByClassName("favorites")[0].style.border =
    "1px solid grey";
}

function clearBorder() {
  document.getElementsByClassName("favorites")[0].style.border =
    "0px solid grey";
}

//------------------------------------------------
