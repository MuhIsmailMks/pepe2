document.getElementById("shareBtn").addEventListener("click", async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title,
        text: "Check this page!",
        url: window.location.href,
      });
      console.log("Successfully shared");
    } catch (error) {
      console.log("Failed to share", error);
    }
  } else {
    alert("browser not support Web Share API.");
  }
});



// Map initialization 
const map = L.map("map", {
  scrollWheelZoom: false,  
  dragging: true,  
}).setView([39.0, -76.5], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
 

const startPoint = L.latLng(34.106400, -117.370323);  // Rialto, CA
const endPoint = L.latLng(40.599120, -112.464653);    // Grantsville, UT


// List of US state abbreviations
const stateAbbreviations = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
  "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
  "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL",
  "Indiana": "IN", "Iowa": "IA", "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA",
  "Maine": "ME", "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI",
  "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO", "Montana": "MT",
  "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
  "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND",
  "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA",
  "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", "Tennessee": "TN",
  "Texas": "TX", "Utah": "UT", "Vermont": "VT", "Virginia": "VA", "Washington": "WA",
  "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"
};

// Function to get address from coordinates
function getAddress(lat, lon, cityElementId, addressElementId) {
  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
    .then(response => response.json())
    .then(data => {
      let city = data.address.city || data.address.town || data.address.village || "Tidak diketahui";
      let state = data.address.state || "";
      let stateAbbr = stateAbbreviations[state] || state;
      
      let cityState = stateAbbr ? `${city}, ${stateAbbr}` : city;

      // Full address format
      let postalCode = data.address.postcode || "";
      let fullAddress = `${city}, ${stateAbbr} ${postalCode}`.trim();

      // Insert data to elemen HTML
      document.getElementById(cityElementId).textContent = cityState;
      document.getElementById(addressElementId).textContent = fullAddress;
    })
    .catch(() => {
      document.getElementById(cityElementId).textContent = "Failed to take the city";
      document.getElementById(addressElementId).textContent = "Failed to retrieve address";
    });
}

// Retrieve addresses for start and end points
getAddress(startPoint.lat, startPoint.lng, "startCity", "startAddress");
getAddress(endPoint.lat, endPoint.lng, "endCity", "endAddress");




// marker 
function createNumberedIcon(number) {
  return L.divIcon({
      className: 'custom-marker',  
      html: `<div class="marker-icon">${number}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30]
  });
}
 
L.marker(startPoint, { icon: createNumberedIcon(1) }).addTo(map).bindPopup("start point");
L.marker(endPoint, { icon: createNumberedIcon(2) }).addTo(map).bindPopup("end point");
 
//  Routing Machine (Rute)
L.Routing.control({
  waypoints: [startPoint, endPoint],
  routeWhileDragging: true,
  show: false,
  createMarker: function() { return null; }
}).addTo(map);



