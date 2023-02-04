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
    map_url,
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

  document.getElementById("lat").textContent = latitude.toFixed(2);
  document.getElementById("lon").textContent = longitude.toFixed(2);
  document.getElementById("alt").textContent = altitude.toFixed(0);
  document.getElementById("vel").textContent = formattedVelocity;
  document.getElementById("time").textContent = timestamp.toFixed(2);
  // cut d off "eclipsed"
  if (visibility === "eclipsed") {
    let eclipse = capitalized.slice(0, -1);
    document.getElementById("vis").textContent = eclipse;
  } else {
    let eclipse = capitalized;
    document.getElementById("vis").textContent = eclipse;
    console.log(eclipse);
  }

  // format time
  (function () {
    function checkTime(i) {
      return i < 10 ? "0" + i : i;
    }

    function startTime() {
      var today = new Date(timestamp),
        h = checkTime(today.getHours()),
        m = checkTime(today.getMinutes()),
        s = checkTime(today.getSeconds());
      console.log(today);
      document.getElementById("time").innerHTML = h + ":" + m + ":" + s;
      t = setTimeout(function () {
        startTime();
      }, 1000);
    }
    startTime();
  })();
}

// time //
setInterval(getISS, 2000);
// getISS();

// daylight or eclipsed image
async function imgChange() {
  const response = await fetch(api_url);
  const data = await response.json();
  const { visibility } = data;

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
