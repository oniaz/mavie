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

function saveJsonHistory() {

    const urlParams = new URLSearchParams(window.location.search);
    const imdb = urlParams.get('imdbID');
    const title = urlParams.get('title');
    const date = new Date();

    console.log("from fucntion: histire!");
    console.log(title);
    console.log(imdb);
    console.log(date);

    window.bridge.saveJsonHistory(title, imdb, date);
}

function saveJsonFav(page) {
    const title = document.getElementById('title').innerText;
    var imdb = document.getElementById('imdb').innerHTML;
    imdb = imdb.match(/<strong>IMDB:<\/strong>\s*(\S+)/)[1];
    var poster = document.getElementById('poster').src;

    console.log(`from fucntion: ${page} !`);
    console.log(title);
    console.log(imdb);
    console.log(poster);

    window.bridge.saveJsonFav(page, title, imdb, poster);
}

function readFav(page) {
    console.log("from functions:" + page);
    window.bridge.readFav(page);
}


function readHistory() {
    console.log("from functions: redd hstre");
    window.bridge.readHistory();
}