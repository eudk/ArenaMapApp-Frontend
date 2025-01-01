document.addEventListener("DOMContentLoaded", () => {
    auth.checkLoginStatus();

const app = Vue.createApp({
    data() {
        return {
            apiUrl: "https://hovedopgteamet-cxdwanfbevcgcwhb.northeurope-01.azurewebsites.net/api/menu",
            menuItems: [], 
            filteredMenuItems: [], 
            selectedStallType: "", 
            menuItem: {
                name: "",
                description: "",
                price: 0,
                stallType: "",
                imageBase64: "",
            },
        };
    },
    mounted() {
        this.loadMenuItems(); //menu loades
    },
    methods: {
        async loadMenuItems() {
            try {
                const response = await axios.get(`${this.apiUrl}/all`);
                this.menuItems = response.data;
                this.filteredMenuItems = this.menuItems; // filtreret menu
            } catch (error) {
                console.error("Error loading menu items:", error);
                alert("Kunne ikke indlæse menuen. Prøv igen.");
            }
        },
        filterMenuItems() {
            if (this.selectedStallType) {
                this.filteredMenuItems = this.menuItems.filter(
                    (item) => item.stallType.toUpperCase() === this.selectedStallType.toUpperCase()
                );
            } else {
                this.filteredMenuItems = this.menuItems; 
            }
        },
        handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.menuItem.imageBase64 = e.target.result.split(",")[1]; //  Base64 string
                };
                reader.readAsDataURL(file);
            }
        },
        async addMenuItem() {
            try {
                const response = await axios.post(this.apiUrl, this.menuItem, {
                    headers: { "Content-Type": "application/json" },
                });
                if (response.status === 201) {
                    alert("Menu opdateret!");
                    this.loadMenuItems(); // Refresh 
                    this.resetForm();
                }
            } catch (error) {
                console.error("Error adding menu item:", error);
                alert("Kunne ikke tilføje menuen.");
            }
        },
        async deleteMenuItem(itemId) {
            try {
                const response = await axios.delete(`${this.apiUrl}/${itemId}`);
                if (response.status === 200 || response.status === 204) {
                    alert("Menu opdateret!");
                    this.loadMenuItems(); // Refresh 
                }
            } catch (error) {
                console.error("Error deleting menu item:", error);
                alert("Kunne ikke slette menuen.");
            }
        },
        resetForm() {
            this.menuItem = {
                name: "",
                description: "",
                price: 0,
                stallType: "",
                imageBase64: "",
            };
        },
    },
});

app.mount("#app");
});