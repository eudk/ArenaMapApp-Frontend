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
                alert("Failed to load the menu. Please try again.");
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

            try {
                const emailResponse = await emailjs.send(
                    "service_rfghgq5", 
                    "template_gej0jti", 
                    templateParams,
                    "VwBJgY9n-qoC6abQv" 
                );
                console.log("Email sent successfully:", emailResponse);
            } catch (error) {
                console.error("Failed to send email:", error);
                alert("Order placed, but email could not be sent.");
            }
        },
        async submitOrder() {
            if (!this.email || this.basket.length === 0) {
                alert("Please enter your email and add items to your cart.");
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
                    console.log("Order created successfully.");
                    
                    // Generate QR Code
                    const qrCodeUrl = await this.generateQrCode(response.data.orderId);

                    // Send Email
                    await this.sendEmail(orderPayload, response.data.orderId, qrCodeUrl);

                    // Redirect to success page
                    window.location.href = `order-success.html?qrCode=${encodeURIComponent(qrCodeUrl)}&email=${encodeURIComponent(this.email)}&id=${response.data.orderId}`;
                } else {
                    alert("Failed to place the order. Please try again.");
                }
            } catch (error) {
                console.error("Order creation failed:", error.response?.data || error.message);
                alert("Failed to place the order. Please try again.");
            } finally {
                this.isLoading = false;
            }
        },
    },
    mounted() {
        this.fetchMenu();
        emailjs.init("VwBJgY9n-qoC6abQv"); 
    },
});

app.mount("#app");
