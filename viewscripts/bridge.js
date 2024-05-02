const { contextBridge, ipcMain, ipcRenderer } = require('electron')

let indexBridge = {

    getPopularFilms: async () => {
        var result = await ipcRenderer.invoke("getPopularFilms");
        var hotfilmsContainer = document.getElementById("hotfilms");
        hotfilmsContainer.classList.add("search-done");

        hotfilmsContainer.innerHTML = "";
        result.forEach(movie => {
            var movieDiv = document.createElement("div");
            movieDiv.classList.add("movie-card");

            movieDiv.id = movie.imdb;

            var posterImg = document.createElement("img");
            posterImg.src = movie.poster;
            posterImg.alt = movie.title;
            posterImg.classList.add("poster-image");

            var titlePara = document.createElement("p");
            titlePara.textContent = movie.title;
            titlePara.classList.add("movie-title");

            movieDiv.appendChild(posterImg);
            movieDiv.appendChild(titlePara);
            hotfilmsContainer.appendChild(movieDiv);

            movieDiv.addEventListener("click", function () {

                const movieInfoPageUrl = "../views/movie_info.html";
                const movieId = movie.imdb;

                // Encode the movie IMDb ID to ensure it's properly formatted for URL
                const encodedMovieId = encodeURIComponent(movieId);
                // Append the movie IMDb ID as a query parameter to the URL
                const urlWithQuery = `${movieInfoPageUrl}?imdbID=${encodedMovieId}`;
                // Redirect the user to the "movie info" page with the movie IMDb ID in the URL
                window.location.href = urlWithQuery;
            });
        });
    },

    getFilmInfo: async (imdb) => {
        console.log("from indexBridge " + imdb);
        var result = await ipcRenderer.invoke("getFilmInfo", imdb);
        console.log("from indexBridge, got the movie info!");
        console.log(result.Title);
        console.log("element exists");

        // Extract movie info from the API response
        const {
            imdbID,
            Title,
            Year,
            Rated,
            Released,
            Genre,
            Director,
            Writer,
            Actors,
            Plot,
            Language,
            Country,
            Awards,
            Poster,
            Ratings
        } = result;

        document.getElementById('imdb').innerHTML = `<strong>IMDB:</strong> ${imdbID}`;
        document.getElementById('title').innerHTML = `${Title} (${Year})`
        document.getElementById('poster').src = Poster;
        document.getElementById('plot').innerText = Plot;
        document.getElementById('genre').innerHTML = `<strong>Genre:</strong> ${Genre}`;
        document.getElementById('age-rating').innerHTML = `<strong>Age Rating:</strong> ${Rated}`;
        document.getElementById('release-date').innerHTML = `<strong>Release Date:</strong> ${Released}`;
        document.getElementById('language').innerHTML = `<strong>Language:</strong> ${Language}`;
        document.getElementById('country').innerHTML = `<strong>Country:</strong> ${Country}`;
        document.getElementById('director').innerHTML = `<strong>Directors:</strong> ${Director}`;
        document.getElementById('writer').innerHTML = `<strong>Writers:</strong> ${Writer}`;
        document.getElementById('actors').innerHTML = `<strong>Actors:</strong> ${Actors}`;
        document.getElementById('awards').innerText = Awards;
        Ratings.forEach(rating => {
            if (rating.Source === 'Internet Movie Database') {
                document.getElementById('imdb-rating').innerHTML = `<strong>Internet Movie Database:</strong> ${rating.Value}`;
            } else if (rating.Source === 'Rotten Tomatoes') {
                document.getElementById('rotten-tomatoes-rating').innerHTML = `<strong>Rotten Tomatoes:</strong> ${rating.Value}`;
            } else if (rating.Source === 'Metacritic') {
                document.getElementById('metacritic-rating').innerHTML = `<strong>Metacritic:</strong> ${rating.Value}`;
            }
        });

        // Watch button
        const link = `https://vidsrc.to/embed/movie/${result.imdbID}`;
        const isAvailable = await checkLinkAvailability(link);
        const watchButton = document.getElementById("watch-button");

        if (isAvailable) {
            watchButton.innerText = "Watch";
            watchButton.addEventListener("click", () => {
                const movieWatchPageUrl = "../views/watch.html";
                const movieId = result.imdbID;
                const encodedMovieId = encodeURIComponent(movieId);
                const urlWithQuery = `${movieWatchPageUrl}?imdbID=${encodedMovieId}`;
                window.location.href = urlWithQuery;
            });
        } else {
            watchButton.disabled = true;
            watchButton.style.cursor = 'not-allowed';
            watchButton.innerText = "Unavailable to watch";
        };

        // Function to check link availability
        async function checkLinkAvailability(link) {
            try {
                const response = await fetch(link);
                return response.ok;
            } catch (error) {
                return false;
            }
        }
    },

    getSearchFilms: async (movie) => {
        console.log("from indexBridge" + movie);
        var result = await ipcRenderer.invoke("getSearchFilms", movie);
        var searchedFilmsContainer = document.getElementById("searchedFilms");
        searchedFilmsContainer.classList.add("search-done");

        if (result.Error) {
            console.log(result.Error)
            if (result.Error === "Too many results.") {
                searchedFilmsContainer.innerText = "Your search returned too many results. Please refine your query to be more specific.";
            } else {
                searchedFilmsContainer.innerText = result.Error;
            }
            return;
        }
        //searchedFilmsContainer.innerText = result.map(Search => Search.Title).join(", "); // this works!
        searchedFilmsContainer.innerHTML = "";

        result.forEach(movie => {
            if (movie.Poster === 'N/A') {
                return;
            }
            var movieDiv = document.createElement("div");
            movieDiv.classList.add("movie-card");

            movieDiv.id = movie.imdb_id;

            var posterImg = document.createElement("img");
            posterImg.src = movie.Poster;
            posterImg.alt = movie.Title;
            posterImg.classList.add("poster-image");

            var titlePara = document.createElement("p");
            titlePara.textContent = movie.Title;
            titlePara.classList.add("movie-title");

            movieDiv.appendChild(posterImg);
            movieDiv.appendChild(titlePara);

            searchedFilmsContainer.appendChild(movieDiv);

            movieDiv.addEventListener("click", function () {
                // const embedUrl = `https://vidsrc.to/embed/movie/${movie.imdbID}`;

                const movieInfoPageUrl = "../views/movie_info.html";
                const movieId = movie.imdbID;
                const encodedMovieId = encodeURIComponent(movieId);
                const urlWithQuery = `${movieInfoPageUrl}?imdbID=${encodedMovieId}`;
                window.location.href = urlWithQuery;
            });
        });
    },
}

contextBridge.exposeInMainWorld("indexBridge", indexBridge);

window.addEventListener('DOMContentLoaded', () => {
    //
});
