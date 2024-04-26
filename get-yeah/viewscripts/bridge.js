const { contextBridge, ipcMain, ipcRenderer } = require('electron')

let indexBridge = {

    doSomethingAxios: async () => {
        var result = await ipcRenderer.invoke("doSomethingAxios");
        var whattodo = document.getElementById("whattodo");
        whattodo.innerText = JSON.parse(result).activity;
    },

    getFilmInfo: async (imdb) => {
        console.log("from indexBridge " + imdb);
        var result = await ipcRenderer.invoke("getFilmInfo", imdb);
        console.log("from indexBridge, got the movie info!");
        console.log(result.Title);
        var movieInfoContainer = document.getElementById("movie-info");
        // movieInfoContainer.innerText = result.Title;

        console.log("elemnt exists");

        // Extract movie info from the API response
        const {
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

        // Update the #movie-info div with the movie details
        // const movieInfoContainer = document.getElementById("movie-info");
        movieInfoContainer.innerHTML = `
            <h1>${Title} (${Year})</h1>
            <img src="${Poster}" alt="Movie Poster">
            <p><strong>Rated:</strong> ${Rated}</p>
            <p><strong>Released:</strong> ${Released}</p>
            <p><strong>Genre:</strong> ${Genre}</p>
            <p><strong>Director:</strong> ${Director}</p>
            <p><strong>Writer:</strong> ${Writer}</p>
            <p><strong>Actors:</strong> ${Actors}</p>
            <p><strong>Plot:</strong> ${Plot}</p>
            <p><strong>Language:</strong> ${Language}</p>
            <p><strong>Country:</strong> ${Country}</p>
            <p><strong>Awards:</strong> ${Awards}</p>
            <h2>Ratings:</h2>
            <ul>
                ${Ratings.map(rating => `<li>${rating.Source}: ${rating.Value}</li>`).join("")}
            </ul>
        `;
    },

    getSearchFilmsAxios: async (movie) => {
        console.log("from indexBridge" + movie);
        var result = await ipcRenderer.invoke("getSearchFilmsAxios", movie);
        var searchedFilmsContainer = document.getElementById("searchedFilms");

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
                return; // Skip this iteration of the loop
            }
            // Create a div element for the movie
            var movieDiv = document.createElement("div");
            movieDiv.classList.add("movie-card"); // Add a class for styling

            // Set the IMDb ID as the ID of the movie div
            movieDiv.id = movie.imdb_id;

            // Create an img element for the poster
            var posterImg = document.createElement("img");
            posterImg.src = movie.Poster; // Set the src attribute to the URL of the poster image
            posterImg.alt = movie.Title; // Set the alt attribute to the movie title
            posterImg.classList.add("poster-image"); // Add a class for styling

            // Create a p element for the title
            var titlePara = document.createElement("p");
            titlePara.textContent = movie.Title;
            titlePara.classList.add("movie-title"); // Add a class for styling

            // Append the poster and title elements to the movie div
            movieDiv.appendChild(posterImg);
            movieDiv.appendChild(titlePara);

            // Append the movie div to the container
            searchedFilmsContainer.appendChild(movieDiv);

            // Add click event listener to the movie div
            movieDiv.addEventListener("click", function () {
                // Construct the URL for the embedding page
                // const embedUrl = `https://vidsrc.to/embed/movie/${movie.imdbID}`;

                const movieInfoPageUrl = "../views/movie_info.html"; // Replace with the URL of the "movie info" page
                const movieId = movie.imdbID;

                // Encode the movie IMDb ID to ensure it's properly formatted for URL
                const encodedMovieId = encodeURIComponent(movieId);

                // Append the movie IMDb ID as a query parameter to the URL
                const urlWithQuery = `${movieInfoPageUrl}?imdbID=${encodedMovieId}`;

                // Redirect the user to the "movie info" page with the movie IMDb ID in the URL
                window.location.href = urlWithQuery;
            });
        });

    },


    getfilmsAxios: async () => {
        var result = await ipcRenderer.invoke("getfilmsAxios");
        var hotfilmsContainer = document.getElementById("hotfilms");

        hotfilmsContainer.innerHTML = "";
        result.forEach(async (movie) => {

            // Create a div element for the movie
            var movieDiv = document.createElement("div");

            // Create a p element for the title
            var titlePara = document.createElement("p");
            titlePara.textContent = movie.title;

            // Append the poster and title elements to the movie div
            movieDiv.appendChild(titlePara);

            // Append the movie div to the container
            hotfilmsContainer.appendChild(movieDiv);
        });
        // hotfilms.innerText = result.map(item => item.title).join(", "); // this works!
    }
}

// ipcRenderer.on("gotData", (event, json) => {
//     console.log(json);

//     var whattodo = document.getElementById("whattodo");
//     whattodo.innerText = JSON.parse(json).activity;
// })

contextBridge.exposeInMainWorld("indexBridge", indexBridge);


window.addEventListener('DOMContentLoaded', () => {

    // const movie = "barbie";
    // indexBridge.getfilmsAxios();
    // indexBridge.getSearchFilmsAxios(movie);

    // // adding new element
    // const customTextDiv = document.createElement('div');
    // customTextDiv.textContent = 'Newly added element :3';
    // document.body.appendChild(customTextDiv);

    // editing existing elemnt
    // const elementToEdit = document.getElementById('sky');
    // if (elementToEdit) {
    //     elementToEdit.textContent = 'sun';
    //     // elementToEdit.style.backgroundColor = 'red';
    //     // elementToEdit.classList.add('highlight');
    // } else {
    //     console.error('Element not found');
    // }
});
