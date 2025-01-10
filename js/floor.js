document.addEventListener("DOMContentLoaded", () => {
    
    // Popup handling
    const points = document.querySelectorAll('.point');
    const popup = document.getElementById('popup');

    // Vis popup når et punkt er klikket
    points.forEach(point => {
        point.addEventListener('click', (e) => {
            points.forEach(p => p.classList.remove('active')); // Fjern aktiv klasse fra alle punkter

            point.classList.add('active'); // Tilføj aktiv klasse til det klikkede punkt

            const info = point.getAttribute('data-info');
            const link = point.getAttribute('data-link');
            const name = info.split(" - ")[0];
            const description = info.split(" - ")[1];

            popup.innerHTML = `
                <p><strong>Navn:</strong> ${name}</p> 
                <p>${description}</p>
                <p>${link ? `<a href="${link}" class="popup-link">Læs mere</a>` : ''}</p>
                <img src="../mapImages/Close.png" alt="Luk" class="close" id="popup-close">
            `;

            popup.style.display = 'block';

            const rect = point.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

            // Juster popup-position
            popup.style.left = `${rect.left + scrollLeft + rect.width / 2 - popup.offsetWidth / 2}px`;
            popup.style.top = `${rect.top + scrollTop - popup.offsetHeight - 5}px`;

            document.getElementById('popup-close').addEventListener('click', () => {
                popup.style.display = 'none';
                point.classList.remove('active');
            });
        });
    });

    // Luk popup, hvis der klikkes udenfor
    document.addEventListener("click", (e) => {
        if (!popup.contains(e.target) && !Array.from(points).includes(e.target)) {
            popup.style.display = 'none';
            points.forEach(p => p.classList.remove('active'));
        }
    });

    // Dynamisk baggrundsbillede for alle punkter
    document.querySelectorAll('.point').forEach(point => {
        const imgSrc = point.getAttribute('data-img');
        if (imgSrc) {
            point.style.backgroundImage = `url(${imgSrc})`;
        }
    });

    // Søgefunktion
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const points = document.querySelectorAll('.point');
        let found = false;

        points.forEach(point => {
            const pointInfo = point.getAttribute('data-info').toLowerCase();
            if (pointInfo.includes(searchTerm)) {
                point.style.display = 'block';
                found = true;
            } else {
                point.style.display = 'none';
            }
        });

        if (!found) {
            const errorMessage = document.createElement('div');
            errorMessage.id = 'error-message';
            errorMessage.style.color = 'red';
            errorMessage.style.marginTop = '1rem';
            errorMessage.innerText = 'Ingen resultater fundet. Prøv venligst igen.';
            searchInput.parentElement.appendChild(errorMessage);

            setTimeout(() => {
                const errorElement = document.getElementById('error-message');
                if (errorElement) errorElement.remove();
            }, 5000);
        }
    });

    // Tøm søgefelt
    document.querySelector('#clear-btn').addEventListener('click', () => {
        searchInput.value = '';
        document.querySelectorAll('.point').forEach(point => {
            point.style.display = 'block';
        });
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) errorMessage.remove();
    });

    // Responsiv størrelse af punkter
    function resizePoints() {
        const points = document.querySelectorAll('.point');
        const width = window.innerWidth;

        points.forEach(point => {
            if (width <= 576) {
                point.style.width = '1rem';
                point.style.height = '1rem';
            } else if (width <= 768) {
                point.style.width = '1.25rem';
                point.style.height = '1.25rem';
            } else if (width <= 960) {
                point.style.width = '1.5rem';
                point.style.height = '1.5rem';
            } else if (width <= 1152) {
                point.style.width = '1.75rem';
                point.style.height = '1.75rem';
            } else {
                point.style.width = '2rem';
                point.style.height = '2rem';
            }
        });
    }

    window.addEventListener('resize', resizePoints);
    resizePoints();
});
