
document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA GLOBAL  ---

  
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
       
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- LÓGICA ESPECÍFICA homepage (index.html) ---

    // Animación de elementos flotantes
    const floatingItems = document.querySelectorAll('.floating-item');
    if (floatingItems.length > 0) { 
        floatingItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.5}s`;
        });
    }

    // --- Noticias (index.html) ---
    const newsContainer = document.getElementById('news-container');
    if (newsContainer) { 
        fetch('../js/news.json') 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar notícias: ' + response.statusText);
                }
                return response.json();
            })
            .then(news => {
                news.forEach(article => {
                    const newsCard = `
                        <div class="news-card">
                            <img src="${article.image}" alt="${article.title}" class="news-image">
                            <div class="news-content">
                                <h3 class="news-title">${article.title}</h3>
                                <p class="news-date">${new Date(article.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                <p class="news-summary">${article.summary}</p>
                                <a href="${article.link}" class="btn btn-secondary news-link">Leer Más</a>
                            </div>
                        </div>
                    `;
                    newsContainer.innerHTML += newsCard;
                });
            })
            .catch(error => {
                console.error('Erro:', error);
                newsContainer.innerHTML = '<p>No ha sido posible cargar las noticias en este momento. Inténtalo más tarde.</p>';
            });
    }

    // --- LÓGICA ESPECÍFICA productos (productos.html) ---

    // Sistema de filtrado 
    const productsCatalog = document.getElementById('products-catalog');
    if (productsCatalog) { 
        const categoryCards = document.querySelectorAll('.category-card');
        const productCards = document.querySelectorAll('.product-card');
        const productCount = document.getElementById('product-count');
        const sortSelect = document.querySelector('.sort-select');

        // Filtrado por categoria
        categoryCards.forEach(card => {
            card.addEventListener('click', function() {
                const category = this.dataset.category;
                categoryCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');

                let visibleCount = 0;
                productCards.forEach(product => {
                    if (category === 'all' || product.dataset.category === category) {
                        product.style.display = 'block';
                        visibleCount++;
                    } else {
                        product.style.display = 'none';
                    }
                });
                productCount.textContent = visibleCount;
            });
        });

        // Ordenación de productos
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            const products = Array.from(productCards);

            products.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('€', ''));
                const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('€', ''));
                const nameA = a.querySelector('.product-title').textContent;
                const nameB = b.querySelector('.product-title').textContent;

                switch(sortBy) {
                    case 'price-low': return priceA - priceB;
                    case 'price-high': return priceB - priceA;
                    case 'name': return nameA.localeCompare(nameB);
                    default: return 0;
                }
            });

            products.forEach(product => productsCatalog.appendChild(product));
        });
    }

    // --- LÓGICA ESPECÍFICA presupuesto (presupuesto.html) ---

    // 4. Validación y envío del formulario de presupuesto
    const budgetForm = document.getElementById('budgetForm');
    if (budgetForm) { 
        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const comentarios = document.getElementById('comentarios');
        const charCount = document.getElementById('char-count');

        comentarios.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });

        budgetForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateBudgetForm()) {
                submitBudgetForm();
            }
        });

        function validateBudgetForm() {
    const nombreInput = document.getElementById("nombre");
    const apellidosInput = document.getElementById("apellidos");
    const telefonoInput = document.getElementById("telefono");
    const emailInput = document.getElementById("email");
    const privacidadCheckbox = document.getElementById("privacidad");

    const isNombreValid = validateNombre();
    const isApellidosValid = validateApellidos();
    const isTelefonoValid = validateTelefono();
    const isEmailValid = validateEmail();
    const isPrivacidadValid = privacidadCheckbox.checked;

    if (!isPrivacidadValid) {
        showInputError(privacidadCheckbox, document.getElementById("privacidad-error"), "Debes aceptar las condiciones de privacidad.");
    } else {
        hideInputError(privacidadCheckbox, document.getElementById("privacidad-error"));
    }

    return isNombreValid && isApellidosValid && isTelefonoValid && isEmailValid && isPrivacidadValid;
}

function submitBudgetForm() {
    calculateBudget();
    const finalBudget = presupuestoFinalDisplay.textContent;
    alert(`¡Formulario enviado con éxito!\n\nPresupuesto Final: ${finalBudget}\n\nTe contactaremos pronto con más detalles.`);
    budgetForm.reset();
    calculateBudget();
}

    }

            // Reset Button
        const resetBtn = document.getElementById("reset-btn");
        if (resetBtn) {
            resetBtn.addEventListener("click", function() {
                // Reset manual 
                budgetForm.reset();
                calculateBudget(); 
                
                // Limpiar mensajes de error
                const errorElements = budgetForm.querySelectorAll(".form-error");
                errorElements.forEach(error => {
                    error.style.display = "none";
                    error.textContent = "";
                });
                
                // quitar clases de errores de input
                const inputElements = budgetForm.querySelectorAll(".form-input, .form-select");
                inputElements.forEach(input => {
                    input.classList.remove("invalid");
                });
            });
        }


        // ---  Validar Formulário (presupuesto.html) ---

    const budget= document.getElementById("budgetForm");

    if (budgetForm) { 
        const nombreInput = document.getElementById("nombre");
        const apellidosInput = document.getElementById("apellidos");
        const telefonoInput = document.getElementById("telefono");
        const emailInput = document.getElementById("email");

        const nombreError = document.getElementById("nombre-error");
        const apellidosError = document.getElementById("apellidos-error");
        const telefonoError = document.getElementById("telefono-error");
        const emailError = document.getElementById("email-error");

        // mostrar error
        function showInputError(inputElement, errorElement, message) {
            inputElement.classList.add("invalid");
            errorElement.textContent = message;
            errorElement.style.display = "block";
        }

        // esconder error
        function hideInputError(inputElement, errorElement) {
            inputElement.classList.remove("invalid");
            errorElement.textContent = "";
            errorElement.style.display = "none";
        }

        // validación individual para cada campo
        function validateNombre() {
            const value = nombreInput.value.trim();
            if (value === "") {
                showInputError(nombreInput, nombreError, "El nombre es obligatorio.");
                return false;
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                showInputError(nombreInput, nombreError, "El nombre solo puede contener letras.");
                return false;
            } else if (value.length > 15) {
                showInputError(nombreInput, nombreError, "El nombre no puede exceder los 15 caracteres.");
                return false;
            }
            hideInputError(nombreInput, nombreError);
            return true;
        }

        function validateApellidos() {
            const value = apellidosInput.value.trim();
            if (value === "") {
                showInputError(apellidosInput, apellidosError, "Los apellidos son obligatorios.");
                return false;
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                showInputError(apellidosInput, apellidosError, "Los apellidos solo pueden contener letras.");
                return false;
            } else if (value.length > 40) {
                showInputError(apellidosInput, apellidosError, "Los apellidos no pueden exceder los 40 caracteres.");
                return false;
            }
            hideInputError(apellidosInput, apellidosError);
            return true;
        }

        function validateTelefono() {
            const value = telefonoInput.value.trim();
            if (value === "") {
                showInputError(telefonoInput, telefonoError, "El teléfono es obligatorio.");
                return false;
            } else if (!/^[0-9]+$/.test(value)) {
                showInputError(telefonoInput, telefonoError, "El teléfono solo puede contener números.");
                return false;
            } else if (value.length > 9) {
                showInputError(telefonoInput, telefonoError, "El teléfono no puede exceder los 9 dígitos.");
                return false;
            }
            hideInputError(telefonoInput, telefonoError);
            return true;
        }

        function validateEmail() {
            const value = emailInput.value.trim();
            if (value === "") {
                showInputError(emailInput, emailError, "El correo electrónico es obligatorio.");
                return false;
            } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                showInputError(emailInput, emailError, "Introduce un correo electrónico válido.");
                return false;
            }
            hideInputError(emailInput, emailError);
            return true;
        }

        // listeners para validar en tiempo real 
        nombreInput.addEventListener("blur", validateNombre);
        apellidosInput.addEventListener("blur", validateApellidos);
        telefonoInput.addEventListener("blur", validateTelefono);
        emailInput.addEventListener("blur", validateEmail);

        // Validación enel envío del formulario
        budgetForm.addEventListener("submit", function(event) {
            event.preventDefault(); 

            const isNombreValid = validateNombre();
            const isApellidosValid = validateApellidos();
            const isTelefonoValid = validateTelefono();
            const isEmailValid = validateEmail();

                    const privacidadCheckbox = document.getElementById("privacidad");
        const privacidadError = document.getElementById("privacidad-error");

        const isPrivacidadValid = privacidadCheckbox.checked;
            if (!isPrivacidadValid) {
                showInputError(privacidadCheckbox, privacidadError, "Debes aceptar las condiciones de privacidad.");
            } else {
                hideInputError(privacidadCheckbox, privacidadError);
            }

            if (isNombreValid && isApellidosValid && isTelefonoValid && isEmailValid && isPrivacidadValid) {
                calculateBudget(); 
                const finalBudget = presupuestoFinalDisplay.textContent;
                alert(`¡Formulario enviado con éxito!\n\nPresupuesto Final: ${finalBudget}\n\nTe contactaremos pronto con más detalles.`);
               
            } else {
                alert("Por favor, corrige los errores en el formulario antes de enviar.");
            }    

        });
    }

        // --- Cálculo del presupuesto (presupuesto.html) ---
    const productoSelect = document.getElementById("producto");
    const plazoInput = document.getElementById("plazo");
    const extrasCheckboxes = document.querySelectorAll("input[name=\"extras\"]");
    const presupuestoFinalDisplay = document.getElementById("presupuesto-final");

    if (productoSelect && plazoInput && extrasCheckboxes.length > 0 && presupuestoFinalDisplay) {
        function calculateBudget() {
            let basePrice = 0;
            const selectedOption = productoSelect.options[productoSelect.selectedIndex];
            if (selectedOption && selectedOption.value !== "") {
                basePrice = parseFloat(selectedOption.dataset.price || 0);
            }

            let totalExtras = 0;
            extrasCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    totalExtras += parseFloat(checkbox.dataset.price || 0);
                }
            });

            let finalBudget = basePrice + totalExtras;

            // Descuento por plazos
            const plazo = parseInt(plazoInput.value);
            if (plazo > 0) {
                let discount = 0;
                if (plazo >= 30) { //  10% de descuento para 30 dias o más
                    discount = 0.10;
                } else if (plazo >= 15) { // Exemplo: 5% de descuento para 15 dias o más
                    discount = 0.05;
                }
                finalBudget -= finalBudget * discount;
            }

            presupuestoFinalDisplay.textContent = finalBudget.toFixed(2) + "€";
        }

        // Adicionar listeners para atualizar o orçamento em tempo real
        productoSelect.addEventListener("change", calculateBudget);
        plazoInput.addEventListener("input", calculateBudget);
        extrasCheckboxes.forEach(checkbox => {
            checkbox.addEventListener("change", calculateBudget);
        });

        // Calcular o orçamento inicial ao carregar a página
        calculateBudget();
    }



    // --- LÓGICA ESPECÍFICA contacto (contacto.html) ---

    // 5.  Validación y envío del formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) { 
        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const mensaje = document.getElementById('mensaje');
        const charCount = document.getElementById('char-count');

        mensaje.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateContactForm()) {
                submitContactForm();
            }
        });

        function validateContactForm() {
    const nombreInput = document.getElementById("nombre");
    const emailInput = document.getElementById("email");
    const asuntoSelect = document.getElementById("asunto");
    const mensajeTextarea = document.getElementById("mensaje");
    const privacidadCheckbox = document.getElementById("privacidad");

    let isValid = true;

    // Validate Nombre
    if (nombreInput.value.trim() === "") {
        showError("nombre-error", "El nombre es obligatorio.");
        isValid = false;
    } else {
        hideError("nombre-error");
    }

    // Validate Email
    if (emailInput.value.trim() === "") {
        showError("email-error", "El correo electrónico es obligatorio.");
        isValid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInput.value.trim())) {
        showError("email-error", "Introduce un correo electrónico válido.");
        isValid = false;
    } else {
        hideError("email-error");
    }

    // Validate Asunto
    if (asuntoSelect.value === "") {
        showError("asunto-error", "Selecciona un asunto.");
        isValid = false;
    } else {
        hideError("asunto-error");
    }

    // Validate Mensaje
    if (mensajeTextarea.value.trim() === "") {
        showError("mensaje-error", "El mensaje es obligatorio.");
        isValid = false;
    } else if (mensajeTextarea.value.trim().length < 10) {
        showError("mensaje-error", "El mensaje debe tener al menos 10 caracteres.");
        isValid = false;
    } else {
        hideError("mensaje-error");
    }

    // Validate Privacidad
    if (!privacidadCheckbox.checked) {
        showError("privacidad-error", "Debes aceptar las condiciones de privacidad.");
        isValid = false;
    } else {
        hideError("privacidad-error");
    }

    return isValid;
}

function submitContactForm() {
    alert("¡Mensaje enviado con éxito! Te responderemos pronto.");
    contactForm.reset();
}
    }

    // Funciones de ayuda para los formularios
    function showError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            const input = errorElement.previousElementSibling;
            if (input) {
                input.classList.add('error');
            }
        }
    }

    function hideError(errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.style.display = 'none';
            const input = errorElement.previousElementSibling;
            if (input) {
                input.classList.remove('error');
            }
        }
    }

  // ---  LÓGICA ESPECÍFICA Galeria (galeria.html) ---

    const mainGalleryImage = document.getElementById("main-gallery-image");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const thumbnailGrid = document.getElementById("thumbnail-grid");

    if (mainGalleryImage && prevBtn && nextBtn && thumbnailGrid) { 
        const galleryImages = [
            { src: "../images/simba.jpg", alt: "Peluche Simba Orgánico" },
            { src: "../images/nala.jpg", alt: "Peluche Nala Premium" },
            { src: "../images/timón.jpg", alt: "Peluche Timón Natural" },
            { src: "../images/body.jpg", alt: "Body Reino Orgánico" },
            { src: "../images/vestido.jpg", alt: "Vestido Princesa Kiara" },
            { src: "../images/biberón.jpg", alt: "Biberón Reino Seguro" },
            { src: "../images/sabana.jpg", alt: "Sábanas Reino Orgánico" },
            { src: "../images/móvil.jpg", alt: "Móvil Musical Reino de Kiara" },
            { src: "../images/puzzle.jpg", alt: "Puzzle Reino Educativo" },
            { src: "../images/piano.jpg", alt: "Piano Musical Kiara" }
        ];

        let currentImageIndex = 0;

        function updateGallery() {
            mainGalleryImage.src = galleryImages[currentImageIndex].src;
            mainGalleryImage.alt = galleryImages[currentImageIndex].alt;
           
            const thumbnails = thumbnailGrid.querySelectorAll(".thumbnail-item");
            thumbnails.forEach((thumb, index) => {
                if (index === currentImageIndex) {
                    thumb.classList.add("active");
                } else {
                    thumb.classList.remove("active");
                }
            });
        }

        function createThumbnails() {
            galleryImages.forEach((image, index) => {
                const thumb = document.createElement("img");
                thumb.src = image.src;
                thumb.alt = image.alt;
                thumb.classList.add("thumbnail-item");
                thumb.addEventListener("click", () => {
                    currentImageIndex = index;
                    updateGallery();
                });
                thumbnailGrid.appendChild(thumb);
            });
        }

        prevBtn.addEventListener("click", () => {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            updateGallery();
        });

        nextBtn.addEventListener("click", () => {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            updateGallery();
        });

        createThumbnails();
        updateGallery(); 
    }

});

// --- Mapa dinámico (contacto.html) ---
let map;
let directionsService;
let directionsRenderer;
let businessLocation = { lat: 40.4512, lng: -3.4296 }; 

function initMap() {
    // Inicializar el mapa
    map = new google.maps.Map(document.getElementById("google-map"), {
        zoom: 13,
        center: businessLocation,
    });

    // Marcador para la ubicación del negócio
    const businessMarker = new google.maps.Marker({
        position: businessLocation,
        map: map,
        title: "Kiaras Reign - El Reino de la Pequeña Kiara",
        icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new google.maps.Size(40, 40 ),
        },
    });

    // Marcador del negocio
    const businessInfoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px;">
                <h3>Kiaras Reign</h3>
                <p>El Reino de la Pequeña Kiara</p>
                <p>📍 Av. Premios Nobel, 5, Torrejón de Ardoz, Madrid</p>
                <p>📞 +34 91 123 45 67</p>
            </div>
        `,
    });

    businessMarker.addListener("click", () => {
        businessInfoWindow.open(map, businessMarker);
    });

    // Direcciones
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Funcionalidad para calcular ruta
    const destinationInput = document.getElementById("destination-input");
    const calculateRouteBtn = document.getElementById("calculate-route-btn");

    if (destinationInput && calculateRouteBtn) {
        calculateRouteBtn.addEventListener("click", function() {
            const destination = destinationInput.value.trim();
            if (destination === "") {
                alert("Por favor, introduce una dirección de destino.");
                return;
            }

            const request = {
                origin: businessLocation,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
            };

            directionsService.route(request, (result, status) => {
                if (status === "OK") {
                    directionsRenderer.setDirections(result);
                    
                    // Mostrar informaciones de ruta
                    const route = result.routes[0];
                    const leg = route.legs[0];
                    alert(`Ruta calculada:\n\nDistancia: ${leg.distance.text}\nTiempo estimado: ${leg.duration.text}`);
                } else {
                    alert("No se pudo calcular la ruta. Verifica la dirección introducida.");
                }
            });
        });

        // Permitir calcular ruta presionando Enter
        destinationInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                calculateRouteBtn.click();
            }

            // --- MAPA DE CONTACTO CON GEOLOCALIZACIÓN Y RUTAS ---
window.initMap = function() {
    // Ubicación del negocio (Madrid, España)
    const businessLocation = { lat: 40.4168, lng: -3.7038 };
    
    // Inicializar el mapa
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: businessLocation,
        styles: [
            {
                featureType: "all",
                elementType: "geometry.fill",
                stylers: [{ color: "#FDF8F3" }]
            }
        ]
    });

    // Marcador del negocio
    const businessMarker = new google.maps.Marker({
        position: businessLocation,
        map: map,
        title: "Kiaras Reign - El Reino de la Pequeña Kiara",
        icon: {
            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#E09A4F" stroke="#4A2C00" stroke-width="2"/>
                    <text x="20" y="26" text-anchor="middle" fill="#4A2C00" font-size="16">🏪</text>
                </svg>
            ` ),
            scaledSize: new google.maps.Size(40, 40)
        }
    });

    // Servicio de direcciones
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        polylineOptions: {
            strokeColor: "#E09A4F",
            strokeWeight: 4
        }
    });
    directionsRenderer.setMap(map);

    // Función para obtener ubicación del usuario
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    // Marcador del usuario
                    const userMarker = new google.maps.Marker({
                        position: userLocation,
                        map: map,
                        title: "Tu ubicación",
                        icon: {
                            url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="20" cy="20" r="18" fill="#7FB069" stroke="#4A2C00" stroke-width="2"/>
                                    <text x="20" y="26" text-anchor="middle" fill="#FFFFFF" font-size="16">📍</text>
                                </svg>
                            ` ),
                            scaledSize: new google.maps.Size(40, 40)
                        }
                    });

                    // Calcular y mostrar ruta
                    directionsService.route({
                        origin: userLocation,
                        destination: businessLocation,
                        travelMode: google.maps.TravelMode.DRIVING
                    }, (result, status) => {
                        if (status === "OK") {
                            directionsRenderer.setDirections(result);
                            
                            // Mostrar información de la ruta
                            const route = result.routes[0];
                            const leg = route.legs[0];
                            
                            const infoWindow = new google.maps.InfoWindow({
                                content: `
                                    <div style="padding: 10px; font-family: Arial, sans-serif;">
                                        <h3 style="color: #4A2C00; margin: 0 0 10px 0;">🗺️ Ruta a Kiaras Reign</h3>
                                        <p style="margin: 5px 0;"><strong>Distancia:</strong> ${leg.distance.text}</p>
                                        <p style="margin: 5px 0;"><strong>Tiempo estimado:</strong> ${leg.duration.text}</p>
                                        <p style="margin: 5px 0; font-size: 12px; color: #666;">
                                            📍 Desde tu ubicación hasta nuestro reino
                                        </p>
                                    </div>
                                `
                            });
                            
                            infoWindow.open(map, businessMarker);
                        } else {
                            console.error("Error al calcular la ruta:", status);
                            alert("No se pudo calcular la ruta. Por favor, inténtalo más tarde.");
                        }
                    });
                },
                (error) => {
                    console.error("Error de geolocalización:", error);
                    let errorMessage = "No se pudo obtener tu ubicación. ";
                    
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += "Has denegado el permiso de ubicación.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += "La información de ubicación no está disponible.";
                            break;
                        case error.TIMEOUT:
                            errorMessage += "La solicitud de ubicación ha caducado.";
                            break;
                        default:
                            errorMessage += "Error desconocido.";
                            break;
                    }
                    
                    alert(errorMessage + " El mapa mostrará solo la ubicación de nuestro negocio.");
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000
                }
            );
        } else {
            alert("Tu navegador no soporta geolocalización. El mapa mostrará solo la ubicación de nuestro negocio.");
        }
    }

    // Obtener ubicación del usuario al cargar el mapa
    getUserLocation();

    // Ventana de información del negocio
    const businessInfoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 15px; font-family: Arial, sans-serif; max-width: 250px;">
                <h3 style="color: #4A2C00; margin: 0 0 10px 0;">👑 Kiaras Reign</h3>
                <p style="margin: 5px 0; font-weight: bold;">El Reino de la Pequeña Kiara</p>
                <p style="margin: 5px 0;">📍 Madrid, España</p>
                <p style="margin: 5px 0;">📞 +34 91 123 4567</p>
                <p style="margin: 5px 0;">📧 hola@kiarasreign.com</p>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
                    🛍️ Productos premium y ecológicos para bebés
                </p>
            </div>
        `
    });

    // Mostrar información al hacer clic en el marcador del negocio
    businessMarker.addListener("click", () => {
        businessInfoWindow.open(map, businessMarker);
    });
};


        });

    }
}

// Fallback si no se carga maps
window.initMap = initMap;
