let IMDB_API_URL = "https://www.omdbapi.com/?apikey=84f49e03";
let form = document.querySelector("[data-form]");
let input = document.querySelector("#guess-input");
let output = document.querySelector("[data-output]");
let guessOutput = document.querySelector("[data-guess]");
let moviePoster = document.querySelector("#movie-poster");
let ratingOutput = document.querySelector("#rating-text");

let actorOutput = document.querySelector("[data-actor]");
let actorText = document.querySelector("#actor-output");
let guessActor;
let guessActorPrevious;
let correctGuess = false;
let actorList;

let actorPictureOutput = document.querySelector("#actor-picture");
let ACTOR_ID_API_URL =
  "https://data-imdb1.p.rapidapi.com/actor/imdb_id_byName/";
let ACTOR_IMAGE_API_URL = "https://data-imdb1.p.rapidapi.com/actor/id/";
let actorAPIHeader = {
  method: "GET",
  headers: {
    "x-rapidapi-host": "data-imdb1.p.rapidapi.com",
    "x-rapidapi-key": "b4c4aa17demsh69fb0b28c09541ep11aca9jsneea17ac9c7a1",
  },
};

ActorUpdate();

async function ActorUpdate() {
  let response = await fetch("./json/actors.json");
  let actorList = await response.json();

  let guessActorPrevious = guessActor;

  while (guessActor === guessActorPrevious) {
    guessActor = actorList[GetRandomInt(500)].name;
  }

  actorOutput.innerText = guessActor;
  ActorPictureUpdate();
}

async function ActorPictureUpdate() {
  let processedActorName = guessActor.toLowerCase().replaceAll(" ", "%20");

  let actorId = await GetActorID(processedActorName);
  let actorImage = await GetActorImage(actorId);

  actorPictureOutput.setAttribute("src", actorImage);
}

async function GetActorID(actor) {
  let response = await fetch(ACTOR_ID_API_URL + actor + "/", actorAPIHeader);
  let responseData = await response.json();

  console.log(responseData.results[0]);

  if (responseData.results.length > 0) {
    for (let i = 0; i < responseData.results.length; i++) {
      let currentName = responseData.results[i].name
        .toLowerCase()
        .replaceAll(" ", "%20");
      if (currentName === actor) {
        return responseData.results[i].imdb_id;
      }
    }
  }
  console.log("ACTOR ID NOT FOUND");
}

async function GetActorImage(actorId) {
  let response = await fetch(
    ACTOR_IMAGE_API_URL + actorId + "/",
    actorAPIHeader
  );
  let responseData = await response.json();
  console.log(responseData);
  return await responseData.results.image_url;
}
function GetRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let textInput = input.value.trim();

  if (textInput === "") {
    return;
  }

  Guess(textInput);

  input.value = "";
});

async function Guess(name) {
  let response = await fetch(IMDB_API_URL + "&t=" + name + "&type=movie");
  console.log(response);
  let data = await response.json();

  console.log(data);

  if (data.Error === "Movie not found!") {
    FailMessage();
  } else {
    ProcessGuess(data);
    OutputGuess(correctGuess);
    FetchImg(data);
    FetchInfo(data);
  }
}

function ProcessGuess(data) {
  let list = data.Actors.split(", ");
  console.log(list);
  correctGuess = false;
  list.forEach((e) => {
    if (e === guessActor) {
      correctGuess = true;
    }
  });
}

function OutputGuess(correct) {
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

function FailMessage() {
  guessOutput.innerText = "Movie Not Found!";
  guessOutput.classList.remove("noshow");
  moviePoster.classList.add("noshow");
  ratingOutput.classList.add("noshow");
  actorText.classList.add("noshow");
}

function Reset() {
  ActorUpdate();
  guessOutput.classList.add("noshow");
  moviePoster.classList.add("noshow");
  ratingOutput.classList.add("noshow");
  actorText.classList.add("noshow");
  correctGuess = false;
}

function FetchImg(data) {
  moviePoster.setAttribute("src", data.Poster);
}

function FetchInfo(data) {
  actorText.innerText = data.Actors;
  ratingOutput.innerText = "";
  data.Ratings.forEach((e) => {
    if (e.Source === "Rotten Tomatoes") {
      ratingOutput.innerText = "Rating: " + e.Value + " 🍅";
    }
  });
}
