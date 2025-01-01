const app = Vue.createApp({
    data() {
        return {
            username: '',
            password: '',
            errorMessage: '',  //fejlmeddelelse
        };
    },
    methods: {
        async login() {
            const payload = {
                username: this.username,
                password: this.password,
            };
            try {
                const response = await axios.post(
                    "https://hovedopgteamet-cxdwanfbevcgcwhb.northeurope-01.azurewebsites.net/api/admin/login",
                    payload
                );
                alert("Login successful!");
                sessionStorage.setItem("employee", this.username);
                window.location.href = "employee-dashboard.html";
            } catch (error) {
                alert("Forkert brugernavn eller adgangskode. Prøv igen.");
            }
        },
        logout() {
            // fjerner employee fra sessionStorage og sender brugeren tilbage til employee-login.html
            sessionStorage.removeItem("employee");
            window.location.href = "employee-login.html";
        },
        
    },
});

app.mount('#app');
