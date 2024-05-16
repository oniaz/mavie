const { contextBridge, ipcRenderer } = require('electron');

const bridge = {

  getPopularFilms: async () => {
    const result = await ipcRenderer.invoke('getPopularFilms');
    const hotfilmsContainer = document.getElementById('hotfilms');
    hotfilmsContainer.classList.add('search-done');

    hotfilmsContainer.innerHTML = '';
    result.forEach(movie => {
      const movieDiv = document.createElement('div');
      movieDiv.classList.add('movie-card');

      movieDiv.id = movie.imdb;

      const posterImg = document.createElement('img');
      posterImg.src = movie.poster;
      posterImg.alt = movie.title;
      posterImg.classList.add('poster-image');

      const titlePara = document.createElement('p');
      titlePara.textContent = movie.title;
      titlePara.classList.add('movie-title');

      movieDiv.appendChild(posterImg);
      movieDiv.appendChild(titlePara);
      hotfilmsContainer.appendChild(movieDiv);

      movieDiv.addEventListener('click', function () {
        const movieInfoPageUrl = '../views/movie_info.html';
        const urlWithQuery = `${movieInfoPageUrl}?imdbID=${movie.imdb}&title=${movie.title}`;
        window.location.href = urlWithQuery;
      });
    });
  },

  getFilmInfo: async (imdb) => {
    console.log('from bridge ' + imdb);
    const result = await ipcRenderer.invoke('getFilmInfo', imdb);
    console.log('from bridge, got the movie info!');
    console.log(result.Title);
    console.log('element exists');

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
    document.getElementById('title').innerText = Title;
    document.getElementById('year').innerHTML = `(${Year})`;
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
    const watchButton = document.getElementById('watch-button');

    if (isAvailable) {
      watchButton.innerText = 'Watch';
      watchButton.addEventListener('click', () => {
        const movieWatchPageUrl = '../views/watch.html';
        const urlWithQuery = `${movieWatchPageUrl}?imdbID=${result.imdbID}&title=${result.Title}`;
        window.location.href = urlWithQuery;
      });
    } else {
      watchButton.disabled = true;
      watchButton.style.cursor = 'not-allowed';
      watchButton.innerText = 'Unavailable to watch';
    }

    // Function to check link availability
    async function checkLinkAvailability(link) {
      try {
        const response = await fetch(link);
        return response.ok;
      } catch (error) {
        return false;
      }
    }
    sessionStorage.setItem("backToInfo", window.location.href);
  },

  getSearchFilms: async (searchQuery) => {
    console.log('from bridge' + searchQuery);
    const result = await ipcRenderer.invoke('getSearchFilms', searchQuery);
    const searchedFilmsContainer = document.getElementById('searchedFilms');
    searchedFilmsContainer.classList.add('search-done');

    if (result.Error) {
      console.log(result.Error);
      if (result.Error === 'Too many results.') {
        searchedFilmsContainer.innerText = 'Your search returned too many results. Please refine your query to be more specific.';
      } else {
        searchedFilmsContainer.innerText = result.Error;
      }
      return;
    }
    // searchedFilmsContainer.innerText = result.map(Search => Search.Title).join(", "); // this works!
    searchedFilmsContainer.innerHTML = '';

    result.forEach(movie => {
      if (movie.Poster === 'N/A') {
        return;
      }
      const movieDiv = document.createElement('div');
      movieDiv.classList.add('movie-card');

      movieDiv.id = movie.imdb_id;

      const posterImg = document.createElement('img');
      posterImg.src = movie.Poster;
      posterImg.alt = movie.Title;
      posterImg.classList.add('poster-image');

      const titlePara = document.createElement('p');
      titlePara.textContent = movie.Title;
      titlePara.classList.add('movie-title');

      movieDiv.appendChild(posterImg);
      movieDiv.appendChild(titlePara);

      searchedFilmsContainer.appendChild(movieDiv);

      movieDiv.addEventListener('click', function () {
        const movieInfoPageUrl = '../views/movie_info.html';
        const urlWithQuery = `${movieInfoPageUrl}?imdbID=${movie.imdbID}&title=${movie.Title}&searchQuery=${searchQuery}`;
        window.location.href = urlWithQuery;
      });
    });
  },

  saveJsonFav: (page, title, imdb, poster) => {
    console.log('enetered bridge fav!');
    const data = { title, imdb, poster };
    console.log(data);
    ipcRenderer.send('saveJsonFav', page, data);
  },

  saveJsonHistory: (title, imdb, date) => {
    console.log('enetered bridge hist!');
    const data = { title, imdb, date };
    console.log(data);
    ipcRenderer.send('saveJsonHistory', data);
  },

  readFav: async (page) => {
    console.log('hello from bridge with ' + page);
    const result = await ipcRenderer.invoke('readFav', page);
    result.reverse();
    const favContainer = document.getElementById(page);
    favContainer.classList.add('search-done');

    favContainer.innerHTML = '';
    result.forEach(movie => {
      const movieDiv = document.createElement('div');
      movieDiv.classList.add('movie-card');

      movieDiv.id = movie.imdb;

      const posterDiv = document.createElement('div');
      posterDiv.classList.add('poster-container');

      const posterImg = document.createElement('img');
      posterImg.src = movie.poster;
      posterImg.alt = movie.title;
      posterImg.classList.add('poster-image');

      const titlePara = document.createElement('p');
      titlePara.textContent = movie.title;
      titlePara.classList.add('movie-title');

      // remove film from list
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('delete-film-button');

      const deleteIcon = document.createElement('img');
      deleteIcon.src = '../images/remove.png';
      deleteIcon.alt = 'remove';

      deleteButton.appendChild(deleteIcon);
      deleteButton.addEventListener('click', async function (event) {
        event.stopPropagation(); // Prevent click event on movieDiv from firing
        await ipcRenderer.send('removeFilm', page, movie.imdb);
        window.location.href = `../views/${page}.html`;
      });

      posterDiv.appendChild(deleteButton);
      posterDiv.appendChild(posterImg);
      movieDiv.appendChild(posterDiv);
      movieDiv.appendChild(titlePara);
      favContainer.appendChild(movieDiv);

      movieDiv.addEventListener('click', function () {
        const movieInfoPageUrl = '../views/movie_info.html';
        const urlWithQuery = `${movieInfoPageUrl}?imdbID=${movie.imdb}&title=${movie.title}`;
        window.location.href = urlWithQuery;
      });
    });
  },

  readHistory: async () => {
    const result = await ipcRenderer.invoke('readHistory');
    result.reverse();
    const historyContainer = document.getElementById('history');
    historyContainer.innerHTML = '';

    const table = document.createElement('table');
    const headerRow = table.insertRow();
    const titleHeader = headerRow.insertCell();
    const dateHeader = headerRow.insertCell();
    titleHeader.textContent = 'Title';
    dateHeader.textContent = 'Date';

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    result.forEach(record => {
      const row = table.insertRow();

      const date = new Date(record.date);
      const formattedDate = `${date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} on ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;

      const titleCell = row.insertCell();
      const titleLink = document.createElement('a');

      const movieInfoPageUrl = '../views/movie_info.html';
      const urlWithQuery = `${movieInfoPageUrl}?imdbID=${record.imdb}&title=${record.title}`;

      titleLink.href = urlWithQuery;
      titleLink.textContent = record.title;
      titleCell.appendChild(titleLink);

      const dateCell = row.insertCell();
      dateCell.textContent = formattedDate;
    });

    historyContainer.appendChild(table);
  },

  deleteHistory: () => {
    ipcRenderer.send('deleteHistory');
  }
};

contextBridge.exposeInMainWorld('bridge', bridge);

window.addEventListener('DOMContentLoaded', () => {
  //
});
