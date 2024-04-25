const { contextBridge, ipcMain, ipcRenderer } = require('electron')

let indexBridge = {
    doSomethingAxios: async () => {
        var result = await ipcRenderer.invoke("doSomethingAxios");
        var whattodo = document.getElementById("whattodo");
        whattodo.innerText = JSON.parse(result).activity;
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
            // Create a div element for the movie
            var movieDiv = document.createElement("div");

            // Set the IMDb ID as the ID of the movie div
            movieDiv.id = movie.imdb_id;

            // Create an img element for the poster
            var posterImg = document.createElement("img");
            posterImg.src = movie.Poster; // Set the src attribute to the URL of the poster image
            posterImg.alt = movie.Title; // Set the alt attribute to the movie title

            // Create a p element for the title
            var titlePara = document.createElement("p");
            titlePara.textContent = movie.Title;

            // Append the poster and title elements to the movie div
            movieDiv.appendChild(posterImg);
            movieDiv.appendChild(titlePara);

            // Append the movie div to the container
            searchedFilmsContainer.appendChild(movieDiv);

            // Add click event listener to the movie div
            movieDiv.addEventListener("click", function () {
                // Construct the URL for the embedding page
                const embedUrl = `https://vidsrc.to/embed/movie/${movie.imdbID}`;
                // Redirect the user to the embedding page
                window.location.href = embedUrl;
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
