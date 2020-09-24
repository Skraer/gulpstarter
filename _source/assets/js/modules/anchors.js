// ПЛАВНЫЙ ПЕРЕХОД К РАЗДЕЛАМ ЛЕНДИНГА ЧЕРЕЗ МЕНЮ
let menuItems = document.querySelectorAll(CSS_КЛАССЫ_ПУНКТОВ_МЕНЮ);
menuItems.forEach(function(elem) {
    elem.addEventListener('click', function() {
        let href = elem.getAttribute('href').substr(1);
        event.preventDefault();
        document.getElementById(`${href}`).scrollIntoView({block: "start", behavior: "smooth"});
    });
});
