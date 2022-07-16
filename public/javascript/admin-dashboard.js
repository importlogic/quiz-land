const pages = [ "dashboard-page", "create-page"];
const menuItems = [ "menu-dashboard", "menu-create"];

menuItems.forEach((current) => {
    document.querySelector(`#${current}`).addEventListener("click", () => {
        menuItems.forEach((item) => {
            document.querySelector(`#${item}`).classList.remove("active");
            document.querySelector(`#${item}`).classList.add("fw-bold");
            const pageName = item.slice(5) + "-page";
            document.querySelector(`#${pageName}`).classList.add("hidden");
        })
        document.querySelector(`#${current}`).classList.add("active");
        document.querySelector(`#${current}`).classList.remove("fw-bold");
        const pageName = current.slice(5) + "-page";
        document.querySelector(`#${pageName}`).classList.remove("hidden");
    })
});

var el = document.getElementById("wrapper");
var toggleButton = document.getElementById("menu-toggle");

toggleButton.onclick = function () {
    el.classList.toggle("toggled");
};