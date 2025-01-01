document.addEventListener("DOMContentLoaded", () => {
    //  login status 
    auth.checkLoginStatus();

const app = Vue.createApp({
    data() {
        return {
            apiUrl: "https://hovedopgteamet-cxdwanfbevcgcwhb.northeurope-01.azurewebsites.net",
            map: null,
            marker: null,
            overlays: {},
            centerCoordinates: [55.625251794728534, 12.573704757849326],
            stall: {
                name: "",
                type: "",
                coordinates: "",
                eventId: "",
                floor: "1", // Default floor
            },
            events: [], // List of events from the API
            stalls: [], // List of stalls from the API
        };
    },
    mounted() {
        this.initializeMap();
        this.loadEvents();
        this.loadStalls(); 
    },
    methods: {
        initializeMap() {
            this.map = L.map("map-container").setView(this.centerCoordinates, 17);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "Map data © OpenStreetMap contributors",
                maxZoom: 18,
            }).addTo(this.map);

            this.map.on("click", this.handleMapClick);

            this.addFloorOverlays();
        },
        addFloorOverlays() {
            const bounds = [
                [55.624534, 12.572634],
                [55.626134, 12.574634],
            ];

            this.overlays = {
                "1": L.imageOverlay("assets/images/1.png", bounds),
                "2": L.imageOverlay("assets/images/2.png", bounds),
                "3": L.imageOverlay("assets/images/3.png", bounds),
            };

            this.overlays["1"].addTo(this.map);

            const floorSelector = L.control({ position: "bottomright" });
            floorSelector.onAdd = () => {
                const div = L.DomUtil.create("div", "floor-selector");
                div.innerHTML = `
                    <select id="floor-select" class="form-select">
                        <option value="1" selected>Floor 1</option>
                        <option value="2">Floor 2</option>
                        <option value="3">Floor 3</option>
                    </select>
                `;
                L.DomEvent.disableClickPropagation(div);
                return div;
            };
            floorSelector.addTo(this.map);

            document.getElementById("floor-select").addEventListener("change", (event) => {
                const selectedFloor = event.target.value;
                this.switchFloor(selectedFloor);
            });
        },
        switchFloor(floor) {
            Object.values(this.overlays).forEach((overlay) => this.map.removeLayer(overlay));
            this.overlays[floor].addTo(this.map);
            this.stall.floor = floor; // Update the stall's floor
        },
        async loadEvents() {
            try {
                const response = await axios.get(`${this.apiUrl}/api/event`);
                this.events = response.data;
            } catch (error) {
                console.error("Error loading events:", error);
                alert("Failed to load events.");
            }
        },
        async loadStalls() {
            try {
                const response = await axios.get(`${this.apiUrl}/api/stall`);
                this.stalls = response.data;
            } catch (error) {
                console.error("Error loading stalls:", error);
                alert("Failed to load stalls.");
            }
        },
        async addStall() {
            if (!this.stall.coordinates) {
                alert("Please select coordinates on the map.");
                return;
            }

            const stallPayload = {
                stallId: 0, // Always 0 
                name: this.stall.name || "Unnamed Stall",
                type: this.stall.type,
                coordinates: this.stall.coordinates,
                eventId: parseInt(this.stall.eventId, 10),
                floor: this.stall.floor,
            };

            try {
                const response = await axios.post(`${this.apiUrl}/api/stall`, stallPayload, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 200 || response.status === 201) {
                    this.loadStalls(); 
                } else {
                    alert("Failed to add stall. Please check the input.");
                }
            } catch (error) {
                console.error("Error adding stall:", error);
                alert("Server or network error. Please try again.");
            }
        },
        async deleteStall(stallId) {
            try {
                const response = await axios.delete(`${this.apiUrl}/api/stall/${stallId}`);
                if (response.status === 200 || response.status === 204) {
                    this.loadStalls(); 
                } else {
                    alert("Failed to delete stall. Please try again.");
                }
            } catch (error) {
                console.error("Error deleting stall:", error);
                alert("Server or network error. Please try again.");
            }
        },
        handleMapClick(e) {
            const { lat, lng } = e.latlng;

            if (this.marker) {
                this.marker.setLatLng([lat, lng]);
            } else {
                this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);
                this.marker.on("dragend", (event) => {
                    const position = event.target.getLatLng();
                    this.stall.coordinates = `${position.lat},${position.lng}`;
                });
            }

            this.stall.coordinates = `${lat},${lng}`;
        },
    },
});

app.mount("#app");
});