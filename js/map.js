const app = Vue.createApp({
    data() {
        return {
            map: null,
            centerCoordinates: [55.625251794728534, 12.573704757849326], // Arena center coordinates
            overlays: {}, // Store overlays 
            currentFloor: "1", // Default floor
            stalls: [], // Store stalls fetched from  API
            stallMarkers: [], 
            isLoading: true, 
            userMarker: null, // Marker user's location
        };
    },
    methods: {
        initializeMap() {
            console.log("Initializing map...");
            this.map = L.map("map-container").setView(this.centerCoordinates, 18);

            // base map
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "Map data © OpenStreetMap contributors",
                maxZoom: 18,
            }).addTo(this.map);

            this.addFloorOverlays();
            this.fetchStalls(); // Fetch stalls 
            this.locateUser(); // Add user location 
        },
        locateUser() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLat = position.coords.latitude;
                        const userLng = position.coords.longitude;

                        // Calculate distance to the arena center
                        const distance = this.calculateDistance(
                            userLat,
                            userLng,
                            this.centerCoordinates[0],
                            this.centerCoordinates[1]
                        );

                        if (distance <= 500) {
                            // Place the marker at the user's location
                            this.userMarker = L.marker([userLat, userLng], {
                                title: "BRUGER",
                            })
                                .addTo(this.map)
                                .bindPopup("BRUGER: Du er indenfor 500m radius.")
                                .openPopup();
                            console.log("User is within 500m radius of the arena.");
                        } else {
                            // Demo mode: Place the marker at the arena center
                            this.userMarker = L.marker(this.centerCoordinates, {
                                title: "BRUGER",
                            })
                                .addTo(this.map)
                                .bindPopup("BRUGER: Demo mode.")
                                .openPopup();
                            console.log("User is outside 500m radius. Demo mode activated.");
                        }
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                        console.log("Could not access user location. Demo mode activated.");
                        // Demo mode: Place the marker at the arena center
                        this.userMarker = L.marker(this.centerCoordinates, {
                            title: "BRUGER",
                        })
                            .addTo(this.map)
                            .bindPopup("BRUGER: Demo mode.")
                            .openPopup();
                    }
                );
            } else {
                console.error("Geolocation not supported by this browser.");
                console.log("Browser does not support geolocation. Demo mode activated.");
                // Demo mode: Place the marker at the arena center
                this.userMarker = L.marker(this.centerCoordinates, {
                    title: "BRUGER",
                })
                    .addTo(this.map)
                    .bindPopup("BRUGER: Demo mode.")
                    .openPopup();
            }
        },
        
        calculateDistance(lat1, lng1, lat2, lng2) {
            const R = 6371e3; // Earth's radius in meters for the distance calculation
            const toRad = (value) => (value * Math.PI) / 180;
            const dLat = toRad(lat2 - lat1);
            const dLng = toRad(lng2 - lng1);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) *
                    Math.cos(toRad(lat2)) *
                    Math.sin(dLng / 2) *
                    Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distance in meters
        },

        
        addFloorOverlays() {
            console.log("Adding floor overlays...");
            const bounds = [
                [55.624534, 12.572634],
                [55.626134, 12.574634],
            ];

            //  overlays for each floor
            this.overlays = {
                "1": L.imageOverlay("assets/images/1.png", bounds),
                "2": L.imageOverlay("assets/images/2.png", bounds),
                "3": L.imageOverlay("assets/images/3.png", bounds),
            };

            this.overlays["1"].addTo(this.map);

            // Handle floor change
            document.getElementById("floor-select").addEventListener("change", (event) => {
                const selectedFloor = event.target.value;
                this.switchFloor(selectedFloor);
            });
        },

        switchFloor(floor) {
            console.log(`Switching to floor: ${floor}`);
            // Remove all overlays
            Object.values(this.overlays).forEach((overlay) => this.map.removeLayer(overlay));

            // Add the selected floor overlay
            if (this.overlays[floor]) {
                this.overlays[floor].addTo(this.map);
                this.currentFloor = floor; // Update the current floor
                this.addStallMarkers(); // Refresh markers  the current floor
            } else {
                console.warn(`No overlay found for floor: ${floor}`);
            }
        },
        async fetchStalls() {
            this.isLoading = true; 
            document.getElementById("loading-indicator").style.display = "block"; // Show loader
            console.log("Fetching stalls...");
            try {
                const response = await axios.get("https://hovedopgteamet-cxdwanfbevcgcwhb.northeurope-01.azurewebsites.net/api/stall");
                console.log("API response:", response.data); // Log API response
                if (Array.isArray(response.data)) {
                    this.stalls = response.data; 
                    console.log("Stalls loaded:", this.stalls);
                    this.addStallMarkers(); // Add markers to the map
                } else {
                    console.error("Unexpected response format:", response.data);
                    alert("Kunne ikke hente boder. Prøv igen.");
                }
            } catch (error) {
                console.error("Error fetching stalls:", error);
                alert("Kunne ikke hente boder. Tjek din API eller forbindelse.");
            } finally {
                this.isLoading = false; 
                document.getElementById("loading-indicator").style.display = "none"; // Hide loader
            }
        }
        ,

        addStallMarkers() {
            console.log("Adding stall markers...");
            if (this.stallMarkers.length > 0) {
                this.stallMarkers.forEach((marker) => this.map.removeLayer(marker));
            }
            this.stallMarkers = [];

            if (!Array.isArray(this.stalls)) {
                console.error("Stalls data is not an array:", this.stalls);
                return;
            }

            this.stalls.forEach((stall) => {
                if (!stall.floor || !stall.coordinates || !stall.type || !stall.name) {
                    console.warn(`Skipping invalid stall data: ${JSON.stringify(stall)}`);
                    return;
                }

                if (stall.floor === this.currentFloor) {
                    const [lat, lng] = stall.coordinates.split(",").map(Number); // Parse coordinates
                    if (isNaN(lat) || isNaN(lng)) {
                        console.warn(`Invalid coordinates for stall: ${stall.name}`);
                        return;
                    }

                    // Define the hyperlink based on the stall type
                    let link = "";
                    if (stall.type === "Madbod") {
                        link = `<br><a href="madbod-menu.html" target="_blank">View Menu</a>`;
                    } else if (stall.type === "Bar") {
                        link = `<br><a href="bar-menu.html" target="_blank">View Menu</a>`;
                    } else if (stall.type === "Merchandise") {
                        link = `<br><a href="merchandise-menu.html" target="_blank">View Menu</a>`;
                    }

                    // Add marker and popup
                    const marker = L.marker([lat, lng])
                        .addTo(this.map)
                        .bindPopup(
                            `<b>${stall.name}</b><br>Type: ${stall.type}<br>Floor: ${stall.floor}${link}`
                        );
                    this.stallMarkers.push(marker);
                }
            });

            if (this.stallMarkers.length === 0) {
                console.log(`No stalls found for floor: ${this.currentFloor}`);
            } else {
                console.log(`${this.stallMarkers.length} markers added for floor: ${this.currentFloor}`);
            }
        },
    },
    mounted() {
        console.log("App mounted. Initializing map...");
        this.initializeMap();
    },
});

app.mount("#app");
