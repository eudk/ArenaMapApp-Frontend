// Dropdown menu håndtering
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

// Pop-up håndtering
const points = document.querySelectorAll('.point');
const popup = document.getElementById('popup');
const popupText = document.getElementById('popup-text');
const popupClose = document.getElementById('popup-close');

points.forEach(point => {
    point.addEventListener('click', (e) => {
        const info = point.getAttribute('data-info');
        popupText.textContent = info;
        popup.style.top = `${e.clientY}px`;
        popup.style.left = `${e.clientX}px`;
        popup.style.display = 'block';
    });
});

popupClose.addEventListener('click', () => {
    popup.style.display = 'none';
});

document.addEventListener("click", (e) => {
    if (!popup.contains(e.target) && !Array.from(points).includes(e.target)) {
        popup.style.display = 'none';
    }
});

// Dynamisk baggrundsbillede for alle punkter
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.point').forEach(point => {
        const imgSrc = point.getAttribute('data-img'); // Hent billedets sti fra data-img
        if (imgSrc) {
            point.style.backgroundImage = `url(${imgSrc})`; // Sæt baggrundsbilledet
        }
    });

    // Hover-effekt for at vise info
    document.querySelectorAll('.point').forEach(point => {
        point.addEventListener('mouseenter', () => {
            const info = point.getAttribute('data-info');
            if (info) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.innerText = info;
                document.body.appendChild(tooltip);

                // Positionér tooltip tæt på punktet
                const rect = point.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2}px`;
                tooltip.style.top = `${rect.top - rect.height}px`;

                // Gem tooltip som en egenskab, så vi kan fjerne den senere
                point.tooltip = tooltip;
            }
        });

        point.addEventListener('mouseleave', () => {
            if (point.tooltip) {
                point.tooltip.remove();
                point.tooltip = null;
            }
        });
    });
});

// Justering af punktstørrelse baseret på skærmstørrelse
function resizePoints() {
    const points = document.querySelectorAll('.point');
    const width = window.innerWidth;

    points.forEach(point => {
        if (width <= 576) {
            point.style.width = '0.5rem'; // Mindre på meget små skærme
            point.style.height = '0.5rem';
        } else if (width <= 768) {
            point.style.width = '0.75rem'; // Lidt større på små skærme
            point.style.height = '0.75rem';
        } else if (width <= 960) {
            point.style.width = '1rem'; // Størrelse på skærme under 960px
            point.style.height = '1rem';
        } else if (width <= 1152) {
            point.style.width = '1.25rem'; // Størrelse for skærme under 1152px
            point.style.height = '1.25rem';
        } else {
            point.style.width = '1.5rem'; // Standard størrelse på større skærme
            point.style.height = '1.5rem';
        }
    });
}

window.addEventListener('resize', resizePoints);
resizePoints(); // Initial kald
