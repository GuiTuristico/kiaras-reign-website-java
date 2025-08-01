/**
 * Kiaras Reign - Contacto JavaScript
 * Funcionalidades específicas para la página de contacto
 */

// Variables globales para el mapa
let contactMap;
let businessMarker;
let routeControl;
let currentMapLayer = 'street';

// Coordenadas del negocio (Madrid)
const businessLocation = {
    lat: 40.4168,
    lng: -3.7038,
    address: 'Calle de la Sabana Real, 123, 28001 Madrid, España'
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('contactForm')) {
        initializeContactPage();
    }
});

/**
 * Inicializar página de contacto
 */
function initializeContactPage() {
    console.log('Inicializando página de contacto...');
    
    // Inicializar mapa
    initializeContactMap();
    
    // Configurar formulario
    setupContactForm();
    
    // Configurar FAQ
    setupFAQ();
    
    // Configurar contador de caracteres
    setupCharacterCounter();
    
    console.log('Página de contacto inicializada');
}

/**
 * Inicializar mapa de contacto
 */
function initializeContactMap() {
    const mapContainer = document.getElementById('contact-map');
    if (!mapContainer) return;
    
    // Verificar si el mapa ya está inicializado
    if (contactMap) {
        contactMap.remove();
        contactMap = null;
    }
    
    try {
        // Crear mapa
        contactMap = L.map('contact-map').setView([businessLocation.lat, businessLocation.lng], 15);
        
        // Añadir capa de mapa
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(contactMap);
        
        // Crear marcador personalizado
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `
                <div class="marker-pin">
                    <div class="marker-icon">🏰</div>
                </div>
                <div class="marker-label">Kiaras Reign</div>
            `,
            iconSize: [40, 60],
            iconAnchor: [20, 60]
        });
        
        // Añadir marcador del negocio
        businessMarker = L.marker([businessLocation.lat, businessLocation.lng], { icon: customIcon })
            .addTo(contactMap)
            .bindPopup(`
                <div class="map-popup">
                    <h3>🏰 Kiaras Reign</h3>
                    <p><strong>El Reino de la Pequeña Kiara</strong></p>
                    <p>📍 ${businessLocation.address}</p>
                    <p>📞 +34 (91) 123-4567</p>
                    <p>⏰ Lun-Vie: 9:00-18:00</p>
                    <div class="popup-actions">
                        <a href="https://maps.google.com/?q=${businessLocation.lat},${businessLocation.lng}" target="_blank" class="popup-btn">
                            Ver en Google Maps
                        </a>
                    </div>
                </div>
            `)
            .openPopup();
        
        // Configurar controles del mapa
        setupMapControls();
        
        console.log('Mapa de contacto inicializado');
        
    } catch (error) {
        console.error('Error al inicializar el mapa:', error);
        
        // Fallback si falla el mapa
        mapContainer.innerHTML = `
            <div class="map-fallback">
                <div class="fallback-content">
                    <h3>📍 Ubicación del Reino de Kiara</h3>
                    <p><strong>${businessLocation.address}</strong></p>
                    <div class="fallback-actions">
                        <a href="https://maps.google.com/?q=${businessLocation.lat},${businessLocation.lng}" target="_blank" class="btn btn-primary">
                            <i class="fas fa-map-marker-alt"></i>
                            Ver en Google Maps
                        </a>
                        <a href="https://www.openstreetmap.org/?mlat=${businessLocation.lat}&mlon=${businessLocation.lng}&zoom=15" target="_blank" class="btn btn-secondary">
                            <i class="fas fa-globe"></i>
                            Ver en OpenStreetMap
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
}

/**
 * Configurar controles del mapa
 */
function setupMapControls() {
    // Botón centrar mapa
    const centerMapBtn = document.getElementById('center-map');
    if (centerMapBtn) {
        centerMapBtn.addEventListener('click', function() {
            contactMap.setView([businessLocation.lat, businessLocation.lng], 15);
            businessMarker.openPopup();
        });
    }
    
    // Botón vista satélite
    const satelliteBtn = document.getElementById('satellite-view');
    if (satelliteBtn) {
        satelliteBtn.addEventListener('click', toggleMapLayer);
    }
    
    // Calculadora de rutas
    const calculateRouteBtn = document.getElementById('calculate-route');
    if (calculateRouteBtn) {
        calculateRouteBtn.addEventListener('click', calculateRoute);
    }
    
    // Enter en el campo de origen
    const originInput = document.getElementById('origin-address');
    if (originInput) {
        originInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateRoute();
            }
        });
    }
}

/**
 * Alternar capa del mapa
 */
function toggleMapLayer() {
    const satelliteBtn = document.getElementById('satellite-view');
    
    if (currentMapLayer === 'street') {
        // Cambiar a vista satélite
        contactMap.eachLayer(function(layer) {
            if (layer instanceof L.TileLayer) {
                contactMap.removeLayer(layer);
            }
        });
        
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
            maxZoom: 19
        }).addTo(contactMap);
        
        currentMapLayer = 'satellite';
        satelliteBtn.innerHTML = '<i class="fas fa-road"></i> Vista Calles';
        
    } else {
        // Cambiar a vista de calles
        contactMap.eachLayer(function(layer) {
            if (layer instanceof L.TileLayer) {
                contactMap.removeLayer(layer);
            }
        });
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(contactMap);
        
        currentMapLayer = 'street';
        satelliteBtn.innerHTML = '<i class="fas fa-satellite"></i> Vista Satélite';
    }
}

/**
 * Calcular ruta
 */
function calculateRoute() {
    const originInput = document.getElementById('origin-address');
    const routeInfo = document.getElementById('route-info');
    const calculateBtn = document.getElementById('calculate-route');
    
    if (!originInput || !routeInfo) return;
    
    const origin = originInput.value.trim();
    
    if (!origin) {
        alert('Por favor, introduce una dirección de origen');
        originInput.focus();
        return;
    }
    
    // Mostrar estado de carga
    calculateBtn.disabled = true;
    calculateBtn.innerHTML = '<span class="spinner"></span> Calculando...';
    routeInfo.innerHTML = '<div class="route-loading">Calculando ruta...</div>';
    
    // Simular cálculo de ruta (en una implementación real usarías un servicio de routing)
    setTimeout(() => {
        // Limpiar ruta anterior
        if (routeControl) {
            contactMap.removeControl(routeControl);
        }
        
        // Simular información de ruta
        const routeData = {
            distance: '12.5 km',
            duration: '25 min',
            traffic: 'Tráfico moderado'
        };
        
        // Mostrar información de ruta
        routeInfo.innerHTML = `
            <div class="route-result">
                <h4><i class="fas fa-route"></i> Ruta Calculada</h4>
                <div class="route-details">
                    <div class="route-detail">
                        <span class="detail-icon">📏</span>
                        <span class="detail-text">Distancia: ${routeData.distance}</span>
                    </div>
                    <div class="route-detail">
                        <span class="detail-icon">⏱️</span>
                        <span class="detail-text">Tiempo: ${routeData.duration}</span>
                    </div>
                    <div class="route-detail">
                        <span class="detail-icon">🚗</span>
                        <span class="detail-text">${routeData.traffic}</span>
                    </div>
                </div>
                <div class="route-actions">
                    <a href="https://maps.google.com/dir/${encodeURIComponent(origin)}/${businessLocation.lat},${businessLocation.lng}" target="_blank" class="btn btn-primary btn-sm">
                        <i class="fas fa-directions"></i>
                        Abrir en Google Maps
                    </a>
                </div>
            </div>
        `;
        
        // Restaurar botón
        calculateBtn.disabled = false;
        calculateBtn.innerHTML = '<i class="fas fa-directions"></i> Calcular Ruta';
        
        // Centrar mapa para mostrar ambos puntos
        contactMap.setView([businessLocation.lat, businessLocation.lng], 13);
        
    }, 2000);
}

/**
 * Configurar formulario de contacto
 */
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateContactField(input));
        input.addEventListener('input', () => clearContactFieldError(input));
    });
    
    // Envío del formulario
    form.addEventListener('submit', handleContactFormSubmit);
    
    // Reset del formulario
    form.addEventListener('reset', function() {
        setTimeout(() => {
            clearAllContactErrors();
        }, 10);
    });
}

/**
 * Validar campo del formulario de contacto
 */
function validateContactField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'nombre':
            if (!value) {
                isValid = false;
                errorMessage = 'El nombre es obligatorio';
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                isValid = false;
                errorMessage = 'El nombre solo puede contener letras';
            } else if (value.length > 15) {
                isValid = false;
                errorMessage = 'El nombre no puede tener más de 15 caracteres';
            }
            break;
            
        case 'apellidos':
            if (value && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Los apellidos solo pueden contener letras';
            } else if (value.length > 40) {
                isValid = false;
                errorMessage = 'Los apellidos no pueden tener más de 40 caracteres';
            }
            break;
            
        case 'telefono':
            if (!value) {
                isValid = false;
                errorMessage = 'El teléfono es obligatorio';
            } else if (!/^\d{9}$/.test(value)) {
                isValid = false;
                errorMessage = 'El teléfono debe tener exactamente 9 dígitos';
            }
            break;
            
        case 'email':
            if (!value) {
                isValid = false;
                errorMessage = 'El correo electrónico es obligatorio';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Introduce un correo electrónico válido';
            }
            break;
            
        case 'asunto':
            if (!value) {
                isValid = false;
                errorMessage = 'Selecciona un asunto';
            }
            break;
            
        case 'mensaje':
            if (!value) {
                isValid = false;
                errorMessage = 'El mensaje es obligatorio';
            } else if (value.length < 10) {
                isValid = false;
                errorMessage = 'El mensaje debe tener al menos 10 caracteres';
            } else if (value.length > 1000) {
                isValid = false;
                errorMessage = 'El mensaje no puede tener más de 1000 caracteres';
            }
            break;
    }
    
    // Mostrar/ocultar error
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        if (isValid) {
            errorElement.textContent = '';
            field.classList.remove('error');
            field.classList.add('valid');
        } else {
            errorElement.textContent = errorMessage;
            field.classList.add('error');
            field.classList.remove('valid');
        }
    }
    
    return isValid;
}

/**
 * Limpiar error de campo
 */
function clearContactFieldError(field) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        field.classList.remove('error');
    }
}

/**
 * Limpiar todos los errores
 */
function clearAllContactErrors() {
    const form = document.getElementById('contactForm');
    const errorElements = form.querySelectorAll('.form-error');
    const inputs = form.querySelectorAll('.form-input, .form-textarea, .form-select');
    
    errorElements.forEach(element => {
        element.textContent = '';
    });
    
    inputs.forEach(input => {
        input.classList.remove('error', 'valid');
    });
}

/**
 * Manejar envío del formulario de contacto
 */
function handleContactFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    let isFormValid = true;
    
    // Validar todos los campos obligatorios
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!validateContactField(field)) {
            isFormValid = false;
        }
    });
    
    // Validar aceptación de privacidad
    const privacyCheckbox = form.querySelector('#privacidad');
    if (privacyCheckbox && !privacyCheckbox.checked) {
        isFormValid = false;
        const errorElement = document.getElementById('privacidad-error');
        if (errorElement) {
            errorElement.textContent = 'Debes aceptar la política de privacidad';
        }
    }
    
    if (isFormValid) {
        submitContactForm(form, formData);
    } else {
        // Scroll al primer error
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        alert('Por favor, corrige los errores en el formulario antes de enviarlo.');
    }
}

/**
 * Enviar formulario de contacto
 */
function submitContactForm(form, formData) {
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Mostrar estado de carga
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    
    // Simular envío
    setTimeout(() => {
        // Crear resumen del mensaje
        const resumen = createContactSummary(formData);
        
        alert(`¡Mensaje enviado correctamente!\n\n${resumen}\n\nTe responderemos en menos de 24 horas según tu preferencia de contacto.`);
        
        // Resetear formulario
        form.reset();
        clearAllContactErrors();
        updateCharacterCounter();
        
        // Restaurar botón
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        
    }, 2000);
}

/**
 * Crear resumen del mensaje de contacto
 */
function createContactSummary(formData) {
    const nombre = formData.get('nombre');
    const apellidos = formData.get('apellidos') || '';
    const asunto = document.getElementById('asunto').selectedOptions[0]?.text || 'No especificado';
    const preferencia = formData.get('preferencia-contacto') || 'email';
    
    let resumen = `Resumen de tu mensaje:\n`;
    resumen += `De: ${nombre} ${apellidos}\n`;
    resumen += `Asunto: ${asunto}\n`;
    resumen += `Preferencia de contacto: ${getContactPreferenceName(preferencia)}`;
    
    return resumen;
}

/**
 * Obtener nombre de preferencia de contacto
 */
function getContactPreferenceName(preference) {
    const preferences = {
        'email': 'Correo electrónico',
        'telefono': 'Llamada telefónica',
        'whatsapp': 'WhatsApp'
    };
    
    return preferences[preference] || preference;
}

/**
 * Configurar contador de caracteres
 */
function setupCharacterCounter() {
    const mensajeTextarea = document.getElementById('mensaje');
    const counter = document.getElementById('mensaje-counter');
    
    if (mensajeTextarea && counter) {
        mensajeTextarea.addEventListener('input', updateCharacterCounter);
        updateCharacterCounter(); // Inicializar contador
    }
}

/**
 * Actualizar contador de caracteres
 */
function updateCharacterCounter() {
    const mensajeTextarea = document.getElementById('mensaje');
    const counter = document.getElementById('mensaje-counter');
    
    if (mensajeTextarea && counter) {
        const currentLength = mensajeTextarea.value.length;
        const maxLength = 1000;
        
        counter.textContent = currentLength;
        
        // Cambiar color según proximidad al límite
        if (currentLength > maxLength * 0.9) {
            counter.style.color = '#dc3545'; // Rojo
        } else if (currentLength > maxLength * 0.7) {
            counter.style.color = '#ffc107'; // Amarillo
        } else {
            counter.style.color = '#6c757d'; // Gris
        }
    }
}

/**
 * Configurar FAQ
 */
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        if (question && answer && toggle) {
            question.addEventListener('click', function() {
                const isOpen = item.classList.contains('active');
                
                // Cerrar todas las FAQ
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherToggle = otherItem.querySelector('.faq-toggle');
                    if (otherToggle) {
                        otherToggle.textContent = '+';
                    }
                });
                
                // Abrir/cerrar la FAQ actual
                if (!isOpen) {
                    item.classList.add('active');
                    toggle.textContent = '−';
                } else {
                    toggle.textContent = '+';
                }
            });
        }
    });
}

/**
 * Funciones de utilidad para el mapa
 */

// Obtener ubicación del usuario
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                
                // Añadir marcador del usuario
                const userIcon = L.divIcon({
                    className: 'user-marker',
                    html: '<div class="user-pin">📍</div>',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });
                
                L.marker([userLat, userLng], { icon: userIcon })
                    .addTo(contactMap)
                    .bindPopup('Tu ubicación')
                    .openPopup();
                
                // Ajustar vista para mostrar ambos marcadores
                const group = new L.featureGroup([businessMarker, L.marker([userLat, userLng])]);
                contactMap.fitBounds(group.getBounds().pad(0.1));
            },
            function(error) {
                console.warn('Error obteniendo ubicación:', error);
            }
        );
    }
}

// Función para compartir ubicación
function shareLocation() {
    if (navigator.share) {
        navigator.share({
            title: 'Kiaras Reign - El Reino de la Pequeña Kiara',
            text: 'Visita nuestra tienda de productos premium para bebés',
            url: `https://maps.google.com/?q=${businessLocation.lat},${businessLocation.lng}`
        });
    } else {
        // Fallback para navegadores que no soportan Web Share API
        const url = `https://maps.google.com/?q=${businessLocation.lat},${businessLocation.lng}`;
        navigator.clipboard.writeText(url).then(() => {
            alert('Enlace copiado al portapapeles');
        });
    }
}

