document.addEventListener("DOMContentLoaded", () => {
    auth.checkLoginStatus();

const app = Vue.createApp({
    data() {
        return {
            apiUrl: "https://hovedopgteamet-cxdwanfbevcgcwhb.northeurope-01.azurewebsites.net",
            stalls: [], 
            isLoading: true, 
        };
    },
    mounted() {
        this.loadStalls(); 
    },
    methods: {
        async loadStalls() {
            try {
                //  GET request to fetch stalls
                const response = await axios.get(`${this.apiUrl}/api/stall`);
                if (response && response.data) {
                    // response data to the stalls array
                    this.stalls = response.data;
                } else {
                    console.warn("No data received from API.");
                }
            } catch (error) {
                console.error("Error loading stalls:", error);
                alert("Failed to load stalls. Please check your API or connection.");
            } finally {
                this.isLoading = false;
            }
        },
    },
});

app.mount("#app");
});