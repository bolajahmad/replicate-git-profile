const menuDropdown = document.getElementById('menu_dropdown');

menuDropdown.addEventListener('click', () => {
    const menu = document.getElementById('menu');
    menu.style.display = (menu.style.display === "none") ? "block" : "none";
});