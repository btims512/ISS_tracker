// making a map and tiles
const map = L.map("issMap").setView([0, 0], 1);

// Making a marker with an custom icon
const issIcon = L.icon({
  iconUrl: "public/images/iss-ship.png",
  iconSize: [70, 52],
  iconAnchor: [25, 16],
});

const marker = L.marker([0, 0], { icon: issIcon }).addTo(map);

const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(map);

let firstTime = true;
const api_url = "https://api.wheretheiss.at/v1/satellites/25544?&units=miles";

async function getISS() {
  const response = await fetch(api_url);
  const data = await response.json();
  const {
    latitude,
    longitude,
    altitude,
    timestamp,
    units,
    visibility,
    velocity,
  } = data;

  marker.setLatLng([latitude, longitude]);
  if (firstTime) {
    map.setView([latitude, longitude], 3);
    firstTime = false;
  }
  const word = visibility;
  const capitalized = word.charAt(0).toUpperCase() + word.slice(1);

  const formattedNumber = velocity;
  const formattedVelocity = formattedNumber.toLocaleString("en-US");

  document.getElementById("lat").textContent = latitude.toFixed(3);
  document.getElementById("lon").textContent = longitude.toFixed(3);
  document.getElementById("alt").textContent = altitude.toFixed(2);
  document.getElementById("time").textContent = timestamp.toFixed(2);
  document.getElementById("vel").textContent = formattedVelocity;
  document.getElementById("vis").textContent = capitalized;

  console.log(velocity.toFixed(0));

  dateObj = new Date(timestamp * 1000);
  mtcString = dateObj.toMTCString();
  time = utcString.slice(-11, -4);
}
// setInterval(getISS, 1000);
getISS();

// daylight or eclipsed image
async function imgChange() {
  const response = await fetch(api_url);
  const data = await response.json();
  const { visibility } = data;

  console.log(visibility);

  if (visibility == "daylight") {
    let img = document.createElement("img");
    img.src = "public/images/sun.png";
    let src = document.getElementById("day-night");
    src.appendChild(img);
  } else {
    visibility == "eclipsed";
    let img = document.createElement("img");
    img.src = "public/images/eclipse.png";
    let src = document.getElementById("day-night");
    src.appendChild(img);
  }
}

imgChange();
