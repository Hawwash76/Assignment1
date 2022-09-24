let darkStatus = localStorage.getItem("darkStatus");
if (darkStatus == null) {
  darkStatus = "false";
}
checkDarkMode();

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