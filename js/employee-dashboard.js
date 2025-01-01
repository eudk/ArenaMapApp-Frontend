document.addEventListener("DOMContentLoaded", () => {
    console.log("Employee Dashboard Loaded");

    // Check if  user  logged in
    const loggedInUser = sessionStorage.getItem("employee");
    if (!loggedInUser) {
        // Redirect 
        window.location.href = "employee-login.html";
        return;
    }

    const welcomeMessage = document.getElementById("welcome-message");
    welcomeMessage.textContent = `Velkommen, ${loggedInUser}!`;

    // Logout 
    window.logout = function () {
        sessionStorage.removeItem("employee");
        window.location.href = "employee-login.html";
    };
});
