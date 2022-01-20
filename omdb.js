// Preparing the modal acitvation
let body = document.querySelector("body");
let modalBg = document.querySelector(".modal-bg");
let modalTitle = document.querySelector(".title-year");
let modalRated = document.querySelector(".rated");
let modalRuntime= document.querySelector(".runtime");
let modalDirector = document.querySelector(".director");
let modalGenre = document.querySelector(".genre");
let modalPlot = document.querySelector(".plot");
let modalPartLeft= document.querySelector(".modal-part-left");

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
// let myOmdbKey = '7080b933';
// apikey=7080b933
let searchCounter = 1;
const getData = async (userSearch) => {
  let RecoveredDataToDisplay = [];
  try {
    const response = await fetch(`http://www.omdbapi.com/?apikey=${myOmdbKey}&s=${userSearch}&page=${searchCounter++}`);
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
  console.log(input);
  target.innerHTML = '';
  input.forEach(el => {
    // Passes 5! times (55) instead of 10.
    console.log(`Element: ${JSON.stringify(el)}`);
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
  console.log(observables);
  observables.forEach(function (observable) {
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
  let elementsToObserve = document.querySelectorAll(".intObs");
  elementsToObserve.forEach( function (elt) {
    elt.classList.add('hidden');
    observer.observe(elt);
  });

  // Setting the buttons to get movie modals. 
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

// console.log(`searchCounter: ${searchCounter}`);
window.onscroll = function() {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
  // if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
  target.innerHTML = '';  
    let userSearch = searchBar.value;
    getData(userSearch);
  }
}
