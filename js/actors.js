let API_URL = "https://www.omdbapi.com/?apikey=84f49e03";
let form = document.querySelector("[data-form]");
let input = document.querySelector("#text-input");
let output = document.querySelector("[data-output]");
let guessOutput = document.querySelector("[data-guess]");
let moviePoster = document.querySelector("#movie-poster");
let ratingOutput = document.querySelector("#rating-text");

let actorOutput = document.querySelector("[data-actor]");
let actorText = document.querySelector("#actor-output");
let guessActor;
let guessActorPrevious;
let correctGuess = false;

actorUpdate();

async function actorUpdate() {
  let response = await fetch("./json/actors.json");
  let data = await response.json();

  let guessActorPrevious = guessActor;

  while (guessActor === guessActorPrevious) {
    guessActor = data[getRandomInt(500)].name;
  }

  actorOutput.innerText = guessActor;
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
    processGuess(data);
    outputGuess(correctGuess);
    fetchImg(data);
    fetchInfo(data);
  }
}

function processGuess(data) {
  let list = data.Actors.split(", ");
  console.log(list);
  correctGuess = false;
  list.forEach((e) => {
    if (e === guessActor) {
      correctGuess = true;
    }
  });
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
  actorText.classList.remove("noshow");
}

function failMessage() {
  guessOutput.innerText = "Movie Not Found!";
  guessOutput.classList.remove("noshow");
  moviePoster.classList.add("noshow");
  ratingOutput.classList.add("noshow");
  actorText.classList.add("noshow");
}

function reset() {
  actorUpdate();
  guessOutput.classList.add("noshow");
  moviePoster.classList.add("noshow");
  ratingOutput.classList.add("noshow");
  actorText.classList.add("noshow");
  correctGuess = false;
}

function fetchImg(data) {
  moviePoster.setAttribute("src", data.Poster);
}

function fetchInfo(data) {
  actorText.innerText = data.Actors;
  ratingOutput.innerText = "";
  data.Ratings.forEach((e) => {
    if (e.Source === "Rotten Tomatoes") {
      ratingOutput.innerText = "Rating: " + e.Value + " 🍅";
    }
  });
}
