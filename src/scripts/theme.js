function loadTheme() {
    const theme = localStorage.getItem("theme") || "theme-dark";
    document.body.classList.add(theme);

    updateIconTheme(theme);

    const buttonTheme = document.querySelector("#button-theme-toggle");
    buttonTheme.addEventListener("click", toggleTheme);
}

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.classList.contains("theme-light")
        ? "theme-light"
        : "theme-dark";
    const newTheme =
        currentTheme === "theme-light" ? "theme-dark" : "theme-light";

    body.classList.replace(currentTheme, newTheme);
    localStorage.setItem("theme", newTheme);

    updateIconTheme(newTheme);
}

function updateIconTheme(theme) {
    const iconTheme = document.querySelector("#icon-theme");
    iconTheme.src =
        theme === "theme-dark"
            ? "/src/assets/images/theme-icons/sun.svg"
            : "/src/assets/images/theme-icons/moon.svg";
}

window.addEventListener("DOMContentLoaded", loadTheme);
