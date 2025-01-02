const app = Vue.createApp({
    data() {
        return {
            apiUrl: "https://hovedopgteamet-cxdwanfbevcgcwhb.northeurope-01.azurewebsites.net/api/order/",
            email: "",
            orderId: null,
            isCompleted: 0, // Default status (0 means "Not Completed"),
        };
    },
    methods: {
        async fetchOrderStatus() {
            try {
                const response = await axios.get(`${this.apiUrl}${this.orderId}`);
                if (response.status === 200) {
                    this.isCompleted = response.data.isCompleted ? 1 : 0;

                    if (this.isCompleted === 1) {
                        window.location.href = `order-complete.html?id=${this.orderId}`;
                    }
                } else {
                    console.error("Failed to fetch order status.");
                }
            } catch (error) {
                console.error("Error fetching order status:", error);
            }
        },
    },
    mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        this.email = urlParams.get("email") || "N/A";
        this.orderId = urlParams.get("id") || null;

        if (this.orderId) {
            this.fetchOrderStatus();
            setInterval(this.fetchOrderStatus, 3000); // Poll every 3 seconds
        } else {
            console.error("Invalid order ID");
        }
    },
});

app.mount("#app");
