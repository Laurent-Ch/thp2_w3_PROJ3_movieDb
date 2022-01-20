// Preparing the modal acitvation
let modalBg = document.querySelector(".modal-bg");
let body = document.querySelector("body");

// Getting the user search
let searchBar = document.querySelector('#search-bar');
let btnSubmit = document.querySelector('#submit-btn');
btnSubmit.addEventListener('click', e => {
    e.preventDefault();
    let userSearch = searchBar.value;
    console.log(userSearch);
    getData(userSearch);
})

// Treating the search
let target = document.querySelector("#last-el");
let myOmdbKey = '7080b933';
const getData = async (userSearch) => {
  let RecoveredDataToDisplay = [];
  try {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${myOmdbKey}&s=${userSearch}`);
    const matchingData = await response.json();
    console.log(matchingData);
    matchingData.Search.forEach(movie => {
      RecoveredDataToDisplay.push({ 'name': movie.Title, 'date': movie.Year, 'poster': movie.Poster, id: movie.imdbID });
      displayData(RecoveredDataToDisplay);
    });
  }
  catch (error) {
    console.error('Response error:', error.message);
  }
}

// Displaying all the movies
const displayData = (input) => {
  target.innerHTML = '';
  input.forEach(el => {
    target.innerHTML += `
    <div class="movie">
      <h2>Title: ${el.name}</h2>
      <p>Year: ${el.date}</p>
      <img src="${el.poster}" alt="movie icon" />
      <br />
      <button type=button class="read-more-btn" >Read more</button>
      </div>
    <br />
    `;
    let readMoreBtn = document.querySelectorAll(".read-more-btn");
    readMoreBtn.forEach(button => {
      button.addEventListener('click', e => {
        let btnIndex = Array.from(readMoreBtn).indexOf(e.target);
        getDescription(input[btnIndex].id);
        modalBg.classList.add("visible");
        body.classList.add("modal-activated");
        modalBg.addEventListener('click', () => {
          modalBg.classList.remove("visible");
          body.classList.remove("modal-activated");
        });
      })
    });
  })
};

// Getting more information on a movie via a modal
const getDescription = async (movieId) => {
  let movieInfo = []
  try {
  const description = await fetch(`http://www.omdbapi.com/?apikey=${myOmdbKey}&i=${movieId}&plot=full`);
  const curatedDescription = await description.json();
  console.log(`description: ${description}`);
  movieInfo.push({ title: curatedDescription.Title, year: curatedDescription.Year, rated: curatedDescription.Rated, runtime: curatedDescription.Runtime, genre: curatedDescription.Genre, director: curatedDescription.Director, plot: curatedDescription.Plot, poster: curatedDescription.Poster });
  }
  catch (error) {
    console.error('Response error:', error.message);
  }
}

// title
// year / rated
// genre / director
// plot