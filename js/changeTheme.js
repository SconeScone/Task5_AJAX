let link = document.getElementById("themeLink");

let appTheme = localStorage.getItem("appTheme");

if(appTheme !== "" && appTheme !== null)
{
    link.setAttribute("href", appTheme);
}

document.getElementById("changeTheme").addEventListener("click", ChangeTheme)

function ChangeTheme()
{
    let lightTheme = "css/lightTheme.css";
    let darkTheme = "css/darkTheme.css";

    let currentTheme = link.getAttribute("href");

    if(currentTheme == lightTheme)
    {
        currentTheme = darkTheme;
    }
    else
    {
        currentTheme = lightTheme;
    }
    link.setAttribute("href", currentTheme);
    localStorage.setItem("appTheme", currentTheme);
}