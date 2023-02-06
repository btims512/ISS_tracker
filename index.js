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
  const { latitude, longitude, altitude, timestamp, visibility, velocity } =
    data;

  marker.setLatLng([latitude, longitude]);
  if (firstTime) {
    map.setView([latitude, longitude], 3);
    firstTime = false;
  }
  // making visibility uppercase
  const word = visibility;
  const capitalized = word.charAt(0).toUpperCase() + word.slice(1);

  // formatting MPH
  const formattedNumber = velocity;
  const formattedVelocity = formattedNumber.toLocaleString("en-US");

  //formatting time
  dateObj = new Date(timestamp * 1000);
  utcString = dateObj.toUTCString();
  time = utcString.slice(-12, -7);

  console.log(time);
  // appending
  document.getElementById("lat").textContent = latitude.toFixed(2);
  document.getElementById("lon").textContent = longitude.toFixed(2);
  document.getElementById("alt").textContent = altitude.toFixed(0);
  document.getElementById("vel").textContent = formattedVelocity;
  document.getElementById("time").textContent = time;

  // cut d off "eclipsed"
  if (visibility === "eclipsed") {
    let eclipse = capitalized.slice(0, -1);
    document.getElementById("vis").textContent = eclipse;
  } else {
    let eclipse = capitalized;
    document.getElementById("vis").textContent = eclipse;
  }

  // format time (hh:mm:ss)
  // (function () {
  //   function checkTime(i) {
  //     return i < 10 ? "0" + i : i;
  //   }

  //   // time //
  //   function startTime() {
  //     let today = timestamp,
  //       h = checkTime(today.getHours()),
  //       m = checkTime(today.getMinutes()),
  //       s = checkTime(today.getSeconds());

  //       console.log(today);

  //     document.getElementById("time").innerHTML = h + ":" + m + ":" + s;
  //     t = setTimeout(function () {
  //       startTime();
  //     }, 1000);
  //   }
  //   startTime();
  // })();
}
setInterval(getISS, 5000);

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

// loading
setTimeout(() => {
  document.querySelector(".lat-box").style.visibility = "hidden";
  document.querySelector(".lon-box").style.visibility = "hidden";
  document.querySelector(".boxes").style.visibility = "hidden";
  document.getElementById("lat").style.visibility = "hidden";
  document.querySelector("#loader").style.visibility = "visible";
  //
  document.querySelector("#loader").style.display = "none";
  document.querySelector(".lat-box").style.visibility = "visible";
  document.querySelector(".lon-box").style.visibility = "visible";
  document.querySelector(".boxes").style.visibility = "visible";
  document.getElementById("lat").style.visibility = "visible";
}, 5100);
