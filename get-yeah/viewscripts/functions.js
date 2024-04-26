// functions

function doSomething() {
    console.log("Gimme Somin!!");
    window.indexBridge.doSomethingAxios();
}

function getfilmsAxios() {
    console.log("shaw falm!!");
    window.indexBridge.getfilmsAxios();
}

function SearchFilms() {
    console.log("sirch falm!!");
    const movie = document.getElementById("searchInput").value;
    console.log("from functions " + movie);
    window.indexBridge.getSearchFilmsAxios(movie);
}

function FilmInfo() {
    console.log("falm anfo!!");
    const imdb = document.getElementById("imdb").innerText;
    console.log("from functions " + imdb);
    window.indexBridge.getFilmInfo(imdb);
}


// function getFilmPosterAxios() {
//     console.log("shaw pistar!!");
//     window.indexBridge.getFilmPosterAxios();
// }
