// Initialiser kortet og indstil dets visning til Royal Arena
const map = L.map('map').setView([55.655, 12.576], 17);  // Eksempel-koordinater for Royal Arena

// Tilføj OpenStreetMap-fliser til kortet
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Tilføj marker for brugerens position
function findUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userCoords = [position.coords.latitude, position.coords.longitude];
            L.marker(userCoords).addTo(map)
                .bindPopup("Din placering")
                .openPopup();
            map.setView(userCoords, 17);
        }, () => {
            alert("Kunne ikke finde din placering.");
        });
    } else {
        alert("Geolocation er ikke understøttet af denne browser.");
    }
}

// Funktion til at finde og markere bodens placering
function findStallLocation() {
    const stallCoords = [55.655, 12.577];  // Eksempel-koordinater for en bod
    L.marker(stallCoords).addTo(map)
        .bindPopup("Din valgte bod")
        .openPopup();
    map.setView(stallCoords, 17);
}

// Event listener for knappen
document.getElementById('findStallButton').addEventListener('click', findStallLocation);

// Find brugerens placering, når kortet indlæses
findUserLocation();
