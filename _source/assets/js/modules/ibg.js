function ibg() {
    let ibgElems = document.querySelectorAll('.ibg');
    let imgArr = document.querySelectorAll('img');
    
    imgArr.forEach(function(img) {
        ibgElems.forEach(function(div) {
            if (div.contains(img)) {
                let src = img.getAttribute('src');
                div.style.backgroundImage = 'url(' + src + ')';
            }
        });
    });
    console.log('ibg working');
}