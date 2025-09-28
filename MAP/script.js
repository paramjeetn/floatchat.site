document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map').setView([0, 60], 3);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 2
    }).addTo(map);

    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    width: 12px; height: 12px; border-radius: 50%;
                    border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -8]
    });

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function createPopupContent(floatData) {
        return `
            <div class="popup-content">
                <div class="popup-header">Float #${floatData.float_serial_no}</div>

                <div class="popup-row">
                    <span class="popup-label">Latitude:</span>
                    <span class="popup-value">${parseFloat(floatData.latitude).toFixed(6)}°</span>
                </div>

                <div class="popup-row">
                    <span class="popup-label">Longitude:</span>
                    <span class="popup-value">${parseFloat(floatData.longitude).toFixed(6)}°</span>
                </div>

                <div class="popup-row">
                    <span class="popup-label">Last Update:</span>
                    <span class="popup-value">${formatDate(floatData.date_creation)}</span>
                </div>

                <div class="popup-detail">
                    ${floatData.detail}
                </div>
            </div>
        `;
    }

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('float-count').textContent = data.length;

            let mostRecentDate = new Date(0);
            const bounds = [];

            data.forEach(floatData => {
                const lat = parseFloat(floatData.latitude);
                const lng = parseFloat(floatData.longitude);

                const marker = L.marker([lat, lng], { icon: customIcon })
                    .addTo(map);

                const popupContent = createPopupContent(floatData);

                marker.bindPopup(popupContent, {
                    maxWidth: 350,
                    className: 'custom-popup'
                });

                marker.on('mouseover', function(e) {
                    this.openPopup();
                });

                marker.on('mouseout', function(e) {
                    setTimeout(() => {
                        if (!this.isPopupOpen() || !this.getPopup().getElement()?.matches(':hover')) {
                            this.closePopup();
                        }
                    }, 100);
                });

                bounds.push([lat, lng]);

                const floatDate = new Date(floatData.date_creation);
                if (floatDate > mostRecentDate) {
                    mostRecentDate = floatDate;
                }
            });

            if (bounds.length > 0) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }

            document.getElementById('last-update').textContent = formatDate(mostRecentDate.toISOString());
        })
        .catch(error => {
            console.error('Error loading float data:', error);
            document.getElementById('last-update').textContent = 'Error loading data';
        });

    map.on('popupopen', function(e) {
        const popup = e.popup.getElement();
        if (popup) {
            popup.addEventListener('mouseenter', function() {
                e.popup.options.keepOpen = true;
            });

            popup.addEventListener('mouseleave', function() {
                e.popup.options.keepOpen = false;
                e.popup.close();
            });
        }
    });
});