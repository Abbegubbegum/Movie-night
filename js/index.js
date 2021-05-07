let API_URL = "https://www.omdbapi.com/?apikey=84f49e03";
let form = document.querySelector("[data-form]");
let input = document.querySelector("#text-input");
let output = document.querySelector("[data-output]");
let guessOutput = document.querySelector("[data-guess]");
let moviePoster = document.querySelector("#movie-poster");
let ratingOutput = document.querySelector("#rating-text");

let yearOutput = document.querySelector("[data-year]");
let yearText = document.querySelector("#year-output");
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
    fetchInfo(data);
  }
}

function outputGuess(correct) {
  if (correct) {
    guessOutput.innerText = "Correct!";
  } else {
    guessOutput.innerText = "Fail!";
  }
  guessOutput.classList.remove("noshow");
  moviePoster.classList.remove("noshow");
  ratingOutput.classList.remove("noshow");
  yearText.classList.remove("noshow");
}

function failMessage() {
  guessOutput.innerText = "Movie Not Found!";
  guessOutput.classList.remove("noshow");
  moviePoster.classList.add("noshow");
  ratingOutput.classList.add("noshow");
  yearText.classList.add("noshow");
}

function reset() {
  yearUpdate();
  guessOutput.classList.add("noshow");
  moviePoster.classList.add("noshow");
  ratingOutput.classList.add("noshow");
  yearText.classList.add("noshow");
}

function fetchImg(data) {
  moviePoster.setAttribute("src", data.Poster);
}

function fetchInfo(data) {
  yearText.innerText = data.Year;
  ratingOutput.innerText = "";
  data.Ratings.forEach((e) => {
    if (e.Source === "Rotten Tomatoes") {
      ratingOutput.innerText = e.Value + " 🍅";
    }
  });
}
