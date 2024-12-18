document.addEventListener("DOMContentLoaded", () => {
    const dropdowns = [
        { toggle: "kort-toggle", menu: "kort-menu" },
        { toggle: "menukort-toggle", menu: "menukort-menu" },
        { toggle: "service-toggle", menu: "service-menu" },
    ];

    // Skjul alle dropdown-menuer ved indlæsning
    dropdowns.forEach(({ menu }) => {
        const menuElement = document.getElementById(menu);
        menuElement.style.display = "none";
    });

    // Tilføj klik-event for hver dropdown
    dropdowns.forEach(({ toggle, menu }) => {
        const toggleElement = document.getElementById(toggle);
        const menuElement = document.getElementById(menu);

        toggleElement.addEventListener("click", (event) => {
            event.preventDefault();
            const isVisible = menuElement.style.display === "block";

            // Skjul alle dropdowns, før vi viser den valgte
            dropdowns.forEach(({ menu }) => {
                document.getElementById(menu).style.display = "none";
            });

            // Skift synlighed for den valgte dropdown
            menuElement.style.display = isVisible ? "none" : "block";
        });
    });

    // Luk dropdowns, hvis brugeren klikker udenfor
    document.addEventListener("click", (event) => {
        dropdowns.forEach(({ toggle, menu }) => {
            const toggleElement = document.getElementById(toggle);
            const menuElement = document.getElementById(menu);

            if (
                !toggleElement.contains(event.target) &&
                !menuElement.contains(event.target)
            ) {
                menuElement.style.display = "none";
            }
        });
    });
});
