const map = L.map('map').setView([55.62533433976489, 12.573634292952859], 18);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

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
