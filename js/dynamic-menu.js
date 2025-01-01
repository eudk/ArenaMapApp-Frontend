const app = Vue.createApp({
    data() {
        return {
            apiUrl: "https://hovedopgteamet-cxdwanfbevcgcwhb.northeurope-01.azurewebsites.net/api/menu/all",
            menuItems: [],
            stallType: "", //  dynamicallycurrent stall type (e.g., Madbod, Bar, Merchandise)
            loading: true, 
        };
    },
    async mounted() {
        this.stallType = this.getStallTypeFromUrl(); 
        await this.loadMenuItems();
    },
    methods: {
        getStallTypeFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get("stallType") || "Madbod"; 
        },
        async loadMenuItems() {
            try {
                const response = await axios.get(this.apiUrl);
                const allMenuItems = response.data;

                this.menuItems = allMenuItems.filter(
                    (item) => item.stallType.toUpperCase() === this.stallType.toUpperCase()
                );
            } catch (error) {
                console.error("Error loading menu items:", error);
                alert("Kunne ikke indlæse menuen. Prøv igen.");
            } finally {
                this.loading = false;
            }
        },
    },
});

app.mount("#app");
