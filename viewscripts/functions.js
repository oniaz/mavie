// functions

function getPopularFilms() {
    console.log("paplar falms!!");
    window.bridge.getPopularFilms();
}

function SearchFilms() {
    console.log("sirch falm!!");
    const movie = document.getElementById("searchInput").value.trim();
    console.log("from functions " + movie);
    if (movie !== '') {
        window.bridge.getSearchFilms(movie);
    } else {
        console.log("empty box!")
        return;
    }
}

function FilmInfo() {
    console.log("falm anfo!!");
    const imdb = document.getElementById("imdb").innerText;
    console.log("from functions " + imdb);
    window.bridge.getFilmInfo(imdb);
}

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
}

