const app = Vue.createApp({
    data() {
        return {
            apiUrl: "https://hovedopgteamet-cxdwanfbevcgcwhb.northeurope-01.azurewebsites.net",
            menuItems: [],
            basket: [],
            email: "",
            isLoading: false,
        };
    },
    computed: {
        menuItemsGrouped() {
            return this.menuItems.reduce((groups, item) => {
                if (!groups[item.stallType]) {
                    groups[item.stallType] = [];
                }
                groups[item.stallType].push(item);
                return groups;
            }, {});
        },
    },
    methods: {
        async fetchMenu() {
            try {
                this.isLoading = true;
                const response = await axios.get(`${this.apiUrl}/api/menu/all`);
                this.menuItems = response.data;
                console.log("Menu items loaded:", this.menuItems);
            } catch (error) {
                console.error("Failed to fetch menu items:", error);
                alert("Kunne ikke indlæse menuen. Prøv igen.");
            } finally {
                this.isLoading = false;
            }
        },
        addToCart(item) {
            const existingItem = this.basket.find((i) => i.itemId === item.itemId);
            if (existingItem) {
                existingItem.quantity++;
                existingItem.subtotal += item.price;
            } else {
                this.basket.push({
                    ...item,
                    quantity: 1,
                    subtotal: item.price,
                });
            }
        },
        removeFromCart(item) {
            const index = this.basket.indexOf(item);
            if (index > -1) {
                this.basket.splice(index, 1);
            }
        },
        async generateQrCode(orderId) {
            try {
                const qrCodeUrl = await QRCode.toDataURL(`${this.apiUrl}/api/order/${orderId}/complete`);
                console.log("QR Code generated:", qrCodeUrl);
                return qrCodeUrl;
            } catch (error) {
                console.error("Failed to generate QR Code:", error);
                throw error;
            }
        },
        async submitOrder() {
            if (!this.email || this.basket.length === 0) {
                alert("Du mangler at udfylde din email eller tilføje varer til kurven.");
                return;
            }

            this.isLoading = true;
            const orderPayload = {
                email: this.email,
                totalAmount: this.basket.reduce((sum, item) => sum + item.subtotal, 0),
                orderItems: this.basket.map((item) => ({
                    menuItemId: item.itemId,
                    quantity: item.quantity,
                })),
            };

            try {
                const response = await axios.post(`${this.apiUrl}/api/order`, orderPayload, {
                    headers: { "Content-Type": "application/json" },
                });

                if (response.status === 201) {
                    console.log("Order created OK");

                    const qrCodeUrl = await this.generateQrCode(response.data.orderId);

                    await this.sendEmail(orderPayload, response.data.orderId, qrCodeUrl);

                    window.location.href = `order-success.html?qrCode=${encodeURIComponent(qrCodeUrl)}&email=${encodeURIComponent(this.email)}&id=${response.data.orderId}`;
                } else {
                    alert("Kunne ikke oprette ordren. Prøv igen.");
                }
            } catch (error) {
                console.error("Order creation failed:", error.response?.data || error.message);
                alert("Kunne ikke oprette ordren. Prøv igen.");
            } finally {
                this.isLoading = false;
            }
        },
        async sendEmail(orderPayload, orderId, qrCodeUrl) {
            const orderDetails = orderPayload.orderItems
                .map((item) => `MenuItem ID: ${item.menuItemId}, Quantity: ${item.quantity}`)
                .join(", ");
            const totalPrice = orderPayload.totalAmount;

            const templateParams = {
                customer_email: orderPayload.email,
                order_id: orderId,
                order_details: orderDetails,
                total_price: `${totalPrice} DKK`,
                qr_code: qrCodeUrl,
            };
// emailjs data
            try {
                const emailResponse = await emailjs.send(
                    "service_rfghgq5",
                    "template_gej0jti",
                    templateParams,
                    "VwBJgY9n-qoC6abQv"
                );
                console.log("Email sent OK:", emailResponse);
            } catch (error) {
                console.error("Failed to send email:", error);
                alert("Order placed, but email could not be sent.");
            }
        },
    },
    mounted() {
        this.fetchMenu();
    },
});

app.mount("#app");
