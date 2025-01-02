# **Frontend for Arena Map App**

## **Plan: F1**
The plan for the frontend (`F1`) is to provide an intuitive, dynamic interface for customers and administrators, integrating seamless order placement, management, and map visualization.
Website [here](https://arenahovedopg-a8dyeqb9bhh4d4ex.germanywestcentral-01.azurewebsites.net/).

### **Features**
- **Interactive Menu:** Dynamically fetches menu items based on stall types and displays grouped data.
- **Order Management:** Adds items to a cart, calculates totals, and places orders via the backend.
- **QR Code Integration:** Generates QR codes for placed orders to facilitate tracking and collection.
- **Responsive UI:** Fully responsive for desktop and mobile use cases.

### **Backend Reference**
The frontend communicates with the backend hosted at:
- **Base URL**: `https://hovedopgteamet-cxdwanfbevcgcwhb.northeurope-01.azurewebsites.net`

The backend handles:
- Menu fetching
- Order placement
- QR code integration
- Admin authentication

Full backend documentation is available [here](https://github.com/eudk/ArenaMapApp-Backend).
# Tools & Libraries Used

---

### **Leaflet.js**
- **Description:** Used for creating interactive maps to display stalls and event locations. Provides a responsive and visually appealing map interface.

<p align="center">
  <img src="https://leafletjs.com/docs/images/logo.png" alt="Leaflet Logo" width="100">
</p>

---

### **EmailJS**
- **Description:** Enables order confirmation emails with details and QR codes. Seamless integration with the frontend for email delivery.

<p align="center">
  <img src="https://media2.dev.to/dynamic/image/width=500,height=210,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F5d14su1hfqzbeqa2qhbr.png" alt="EmailJS Logo" width="150">
</p>

---

### **QRCode.js**
- **Description:** Generates dynamic QR codes tied to orders. Simple and lightweight, perfect for frontend use cases.

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/600px-QR_code_for_mobile_English_Wikipedia.svg.png" alt="QR Code Logo" width="100">
</p>

---

### **Vue.js**
- **Description:** Framework for building the frontend user interface.
- Features: Data bindings and reactive UI for smooth interactions.
- **[Link](https://vuejs.org/)**

---

### **Axios**
- **Description:** Handles API calls for fetching, posting, and deleting data.
- Simplifies integration with the backend REST API.
- **[Link](https://axios-http.com/)**
