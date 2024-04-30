// functions

function doSomething() {
    console.log("Gimme Somin!!");
    window.indexBridge.doSomethingAxios();
}

function getfilmsAxios() {
    console.log("shaw falm!!");
    window.indexBridge.getfilmsAxios();
}

function getPopularFilms() {
    console.log("paplar falms!!");
    window.indexBridge.getPopularFilms();
}

function SearchFilms() {
    console.log("sirch falm!!");
    const movie = document.getElementById("searchInput").value.trim();
    console.log("from functions " + movie);
    if (movie !== '') {
        window.indexBridge.getSearchFilmsAxios(movie);
    } else {
        console.log("empty box!")
        return;
    }
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
