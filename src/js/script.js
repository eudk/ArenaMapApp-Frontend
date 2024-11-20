// Map setup
const centerCoordinates = [55.62533433976489, 12.573634292952859];
const map = L.map('map').setView(centerCoordinates, 18);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Dette er en hovedopgave'
}).addTo(map);

//  markers
const markers = [
    { lat: 55.625334, lng: 12.573634, popup: "Marker 1" },
    { lat: 55.625350, lng: 12.573620, popup: "Marker 2" },
    { lat: 55.625310, lng: 12.573640, popup: "Marker 3" },
    { lat: 55.625320, lng: 12.573660, popup: "Marker 4" },
    { lat: 55.625340, lng: 12.573650, popup: "Marker 5" }
];

markers.forEach(marker => {
    L.marker([marker.lat, marker.lng])
        .addTo(map)
        .bindPopup(marker.popup);
});

// Dropdown 
const floorSelect = document.getElementById('floor-select');

floorSelect.addEventListener('change', event => {
    const selectedFloor = event.target.value;

    console.log(`Selected floor: Etage ${selectedFloor}`);

    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // markers på hver etage
    if (selectedFloor === "1") {
        L.marker([55.625334, 12.573634]).addTo(map).bindPopup("Etage 1 - Marker 1");
        L.marker([55.625350, 12.573620]).addTo(map).bindPopup("Etage 1 - Marker 2");
    } else if (selectedFloor === "2") {
        L.marker([55.625340, 12.573630]).addTo(map).bindPopup("Etage 2 - Marker 1");
        L.marker([55.625320, 12.573640]).addTo(map).bindPopup("Etage 2 - Marker 2");
    } else if (selectedFloor === "3") {
        L.marker([55.625345, 12.573625]).addTo(map).bindPopup("Etage 3 - Marker 1");
        L.marker([55.625315, 12.573635]).addTo(map).bindPopup("Etage 3 - Marker 2");
    }
});

// Brugers placering
function checkLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // beregning i meter til center af arena
            const distance = getDistanceFromLatLonInMeters(
                centerCoordinates[0], centerCoordinates[1], userLat, userLng
            );

            if (distance > 100) {
                document.getElementById('message').innerText = 'Du er ikke i arenaen';
                document.getElementById('message').style.display = 'block';

                // tilføj bruger på kortet
                L.marker([userLat, userLng]).addTo(map)
                    .bindPopup('Din placering').openPopup();
            } else {
                document.getElementById('message').style.display = 'none';
            }
        }, error => {
            alert('Kunne ikke få adgang til din placering. Sørg for, at din GPS er aktiveret.');
        });
    } else {
        alert('Geolocation er ikke understøttet af din browser.');
    }
}

// funktion for mellem 2 lokationer i meter
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

//  location check 
document.addEventListener('DOMContentLoaded', checkLocation);
