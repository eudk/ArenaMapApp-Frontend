// auth.js
const auth = {
    checkLoginStatus() {
        const loggedInUser = sessionStorage.getItem("employee");
        if (!loggedInUser) {
            alert("Log in for at få adgang til denne side.");
            window.location.href = "employee-login.html";
        }
    },
    logout() {
        sessionStorage.removeItem("employee");
        window.location.href = "employee-login.html";
    }
};

window.auth = auth;
