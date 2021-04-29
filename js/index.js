let API_URL = "http://www.omdbapi.com/?apikey=84f49e03";
let yearOutput = document.querySelector("[data-year]");
let form = document.querySelector("[data-form]");
let input = document.querySelector("#text-input");
let output = document.querySelector("[data-output]");
let guessTitle = document.querySelector("[data-guess]");
let continueButton = document.querySelector("[data-button]");
let moviePoster = document.querySelector("#movie-poster");
let ratingOutput = document.querySelector("#rating-text");
let guessYear;

yearUpdate();

function yearUpdate() {
  guessYear = getRandomInt(20) + 2000;
  yearOutput.innerText = guessYear;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let textInput = input.value.trim();

  if (textInput === "") {
    return;
  }

  guess(textInput);

  input.value = "";
});

async function guess(name) {
  let response = await fetch(API_URL + "&t=" + name + "&type=movie");
  let data = await response.json();

  console.log(data);

  if (data.Error === "Movie not found!") {
    failMessage();
  } else {
    outputGuess(data.Year == guessYear);
    fetchImg(data);
    fetchRating(data);
  }
}

function outputGuess(correct) {
  if (correct) {
    guessTitle.innerText = "Correct!";
  } else {
    guessTitle.innerText = "Fail!";
  }
  continueButton.classList.remove("noshow");
  guessTitle.classList.remove("noshow");
  moviePoster.classList.remove("noshow");
  ratingOutput.classList.remove("noshow");
}

function failMessage() {
  guessTitle.innerText = "Movie Not Found!";
  guessTitle.classList.remove("noshow");
  moviePoster.classList.add("noshow");
  moviePoster.classList.add("noshow");
}

function reset() {
  yearUpdate();
  continueButton.classList.add("noshow");
  guessTitle.classList.add("noshow");
  moviePoster.classList.add("noshow");
  ratingOutput.classList.add("noshow");
}

function fetchImg(data) {
  moviePoster.setAttribute("src", data.Poster);
}

function fetchRating(data) {
  ratingOutput.innerText = "";
  data.Ratings.forEach((e) => {
    if (e.Source === "Rotten Tomatoes") {
      ratingOutput.innerText = e.Value + " 🍅";
    }
  });
}
