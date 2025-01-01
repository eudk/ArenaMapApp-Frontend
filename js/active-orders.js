document.addEventListener("DOMContentLoaded", () => {
    auth.checkLoginStatus();

const app = Vue.createApp({
    data() {
        return {
            apiUrl: 'https://hovedopgteamet-cxdwanfbevcgcwhb.northeurope-01.azurewebsites.net/api/order/active', // endpoint
            completeOrderApiUrl: 'https://hovedopgteamet-cxdwanfbevcgcwhb.northeurope-01.azurewebsites.net/api/order', //  order endpoint
            orders: [], // Store active orders
        };
    },
    methods: {
        async fetchActiveOrders() {
            try {
                const response = await axios.get(this.apiUrl);
                this.orders = response.data;
                console.log("Active orders fetched:", this.orders);
            } catch (error) {
                console.error("Failed to fetch active orders:", error);
            }
        },
        // Mark order as completed  GET request
        async markAsCompleted(orderId) {
            try {
                const response = await axios.get(`${this.completeOrderApiUrl}/${orderId}/complete`);

                if (response.status === 200) {
                    alert(`Order #${orderId} markeret som completed!`);
                    this.fetchActiveOrders(); // Refresh 
                } else {
                    alert("Kunne ikke markere ordren som completed. Prøv igen.");
                }
            } catch (error) {
                console.error(`Failed to mark order #${orderId} as completed:`, error);
                alert("Failed to mark the order as completed. Please try again.");
            }
        },
    },
    mounted() {
        this.fetchActiveOrders(); 
    },
});

app.mount('#app');
});