let API_URL = "http://www.omdbapi.com/?apikey=84f49e03";
let IMG_API_URL = "http://img.omdbapi.com/?apikey=84f49e03";
let output = document.querySelector("[data-js-output]");

async function GetData() {
  let response = await fetch(API_URL + "&t=pixels");

  let data = await response.json();

  console.log(data);
  update(data);
}

function update(data) {
  output.innerText = data.Title;
}
