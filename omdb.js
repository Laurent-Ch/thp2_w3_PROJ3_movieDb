// Preparing the modal activation.
let body = document.querySelector("body");
let modalBg = document.querySelector(".modal-bg");
let modalTitle = document.querySelector(".title-year");
let modalRated = document.querySelector(".rated");
let modalRuntime= document.querySelector(".runtime");
let modalDirector = document.querySelector(".director");
let modalGenre = document.querySelector(".genre");
let modalPlot = document.querySelector(".plot");
let modalPartLeft= document.querySelector(".modal-part-left");

// Getting the user search.
let searchBar = document.querySelector('#search-bar');
let btnSubmit = document.querySelector('#submit-btn');
btnSubmit.addEventListener('click', e => {
  e.preventDefault();
  let userSearch = searchBar.value;
  getData(userSearch);
})

// Treating the search.
let searchCounter = 1;
let totalData = [];
const getData = async (userSearch) => {
  let recoveredDataToDisplay = [];
  try {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${myOmdbKey}&s=${userSearch}&page=${searchCounter}`);
    const matchingData = await response.json();
    matchingData.Search.forEach(movie => {
      recoveredDataToDisplay.push({ 'name': movie.Title, 'date': movie.Year, 'poster': movie.Poster, id: movie.imdbID });
      totalData.push({ 'name': movie.Title, 'date': movie.Year, 'poster': movie.Poster, id: movie.imdbID });
    });
    displayData(recoveredDataToDisplay);
  }
  catch (error) {
    console.error('Response error:', error.message);
  }
}

// Displaying a batch of 10 movies (it corresponds to an API "page", which is the default value returned).
let target = document.querySelector("#last-el");
const displayData = (input) => {
  input.forEach(el => {
    target.innerHTML += `
    <div class="movie intObs">
      <div class=movie-left>  
        <img class='icon' src="${el.poster}" alt="movie icon" />
      </div>  
      <div class="movie-right">
        <div class="right-up">
          <div class="listEl"><strong>${el.name}</strong></div>
          <div class="listEl">${el.date}</div>
        </div>
      <button type=button class="read-more-btn" >Read more</button>
      </div>
    </div>
    `;
  });

  // Initialazing the Intersection Observer
  let observer = new IntersectionObserver(function (observables) {
  observables.forEach(function (observable, id) {
    if (observable.intersectionRatio > 0.35) {
      observable.target.classList.remove('hidden');
      // Seems optional here
      observer.unobserve(observable.target); 
    }
    // // To make it work both ways
    // else {
    //   observable.target.classList.add('hidden');
    // }
    })
  }, {
    threshold: [0.35]
  });

  // Defining observables
  elementsToObserve = document.querySelectorAll(".intObs");
  elementsToObserve.forEach( function (elt) {
    elt.classList.add('hidden');
    observer.observe(elt);
  });

  // Setting up the movie modal buttons. 
  let readMoreBtn = document.querySelectorAll(".read-more-btn");
  readMoreBtn.forEach(button => {
    button.addEventListener('click', e => {
      let btnIndex = Array.from(readMoreBtn).indexOf(e.target);
      getDescription(totalData[btnIndex].id);
      modalBg.classList.add("visible");
      body.classList.add("modal-activated");
      
      modalBg.addEventListener('click', () => {
        modalBg.classList.remove("visible");
        body.classList.remove("modal-activated");
        modalTitle.innerHTML = '';
        modalRated.innerHTML = '';
        modalRuntime.innerHTML = '';
        modalDirector.innerHTML = '';
        modalGenre.innerHTML = '';
        modalPlot.innerHTML = '';
        modalPartLeft.innerHTML = '';
      });
    })
  });
}

// Getting more information on a movie via a modal
const getDescription = async (movieId) => {
  try {
    const description = await fetch(`http://www.omdbapi.com/?apikey=${myOmdbKey}&i=${movieId}&plot=full`);
    const curatedDescription = await description.json();
    modalTitle.innerHTML = `<strong>${curatedDescription.Title}</strong> (${curatedDescription.Year})`;
    modalRated.innerHTML = `Rated: ${curatedDescription.Rated}`;
    modalRuntime.innerHTML = `Runtime: ${curatedDescription.Runtime}`;
    modalDirector.innerHTML = `Director: ${curatedDescription.Director}`;
    modalGenre.innerHTML = `Genre: ${curatedDescription.Genre}`;
    modalPlot.innerHTML = `Synopsis: ${curatedDescription.Plot}`;
    modalPartLeft.innerHTML = `<img class="poster" src="${curatedDescription.Poster}" alt="movie poster" />`;
  }
  catch (error) {
    console.error('Response error:', error.message);
  }
}

// Load the next 10 results once the end of the page —that is to say the end of the loaded elements— is reached.
window.onscroll = function() {
  // Possible alternative to window.scrollY: window.pageYOffset) 
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    let userSearch = searchBar.value;
    searchCounter++;
    getData(userSearch);
  }
}
