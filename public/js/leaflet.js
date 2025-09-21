const locations = JSON.parse(document.getElementById('map').dataset.locations);

var map = L.map('map', { zoomControl: false });

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 20,
}).addTo(map);

// L.control.zoom({ position: 'topright' }).addTo(map);

const points = [];
locations.forEach((loc) => {
  points.push([loc.coordinates[1], loc.coordinates[0]]);
  L.marker([loc.coordinates[1], loc.coordinates[0]])
    .addTo(map)
    .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
      autoClose: false,
    })
    .openPopup();
});

const bounds = L.latLngBounds(points).pad(0.5);
map.fitBounds(bounds);

// map.scrollWheelZoom.disable();

map.scrollWheelZoom.enable();
map.touchZoom.enable();
