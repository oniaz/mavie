function doSomething() {
    console.log("Gimme Somin!!");
    window.indexBridge.doSomethingAxios();
}

function getfilmsAxios() {
    console.log("shaw falm!!");
    window.indexBridge.getfilmsAxios();
}

function getSearchFilmsAxios() {
    console.log("sirch falm!!");
    const movie = document.getElementById("searchInput").value;
    console.log("from some" + movie);
    window.indexBridge.getSearchFilmsAxios(movie);
}




// function getFilmPosterAxios() {
//     console.log("shaw pistar!!");
//     window.indexBridge.getFilmPosterAxios();
// }
