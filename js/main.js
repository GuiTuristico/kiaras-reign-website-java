/**
 * Kiaras Reign - JavaScript Principal
 * Funcionalidades principales del sitio web
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Kiaras Reign JavaScript cargado correctamente');
    
    // Inicializar funcionalidades
    initializeNavigation();
    initializeNewsLoader();
    initializeFormValidation();
    initializeBudgetCalculator();
    initializeContactMap();
    initializeGallery();
});

/**
 * Inicializar navegación responsive
 */
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

/**
 * Cargar noticias desde archivo JSON (para index.html)
 */
function initializeNewsLoader() {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) return;
    
    fetch('data/noticias.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar las noticias');
            }
            return response.json();
        })
        .then(data => {
            displayNews(data.noticias);
        })
        .catch(error => {
            console.error('Error:', error);
            newsContainer.innerHTML = '<p class="error-message">Error al cargar las noticias. Por favor, inténtalo más tarde.</p>';
        });
}

/**
 * Mostrar noticias en el contenedor
 */
function displayNews(noticias) {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) return;
    
    newsContainer.innerHTML = '';
    
    noticias.forEach(noticia => {
        const newsItem = document.createElement('article');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
            <div class="news-image">
                <img src="${noticia.imagen}" alt="${noticia.titulo}" onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="news-content">
                <div class="news-meta">
                    <span class="news-date">${formatDate(noticia.fecha)}</span>
                    <span class="news-category">${noticia.categoria}</span>
                </div>
                <h3 class="news-title">${noticia.titulo}</h3>
                <p class="news-summary">${noticia.resumen}</p>
                <button class="news-read-more" onclick="showNewsDetail(${noticia.id})">Leer más</button>
            </div>
        `;
        newsContainer.appendChild(newsItem);
    });
}

/**
 * Formatear fecha
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

/**
 * Mostrar detalle de noticia
 */
function showNewsDetail(noticiaId) {
    fetch('data/noticias.json')
        .then(response => response.json())
        .then(data => {
            const noticia = data.noticias.find(n => n.id === noticiaId);
            if (noticia) {
                alert(`${noticia.titulo}\n\n${noticia.contenido}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cargar el detalle de la noticia.');
        });
}

/**
 * Inicializar validación de formularios
 */
function initializeFormValidation() {
    // Validación para formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
        
        // Validación en tiempo real
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    }
    
    // Validación para formulario de presupuesto
    const budgetForm = document.getElementById('budgetForm');
    if (budgetForm) {
        budgetForm.addEventListener('submit', handleBudgetSubmit);
        
        // Validación en tiempo real
        const inputs = budgetForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    }
}

/**
 * Validar campo individual
 */
function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Validaciones específicas según el tipo de campo
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
            } else if (!/^\d{9}$/.test(value.replace(/\s/g, ''))) {
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
    }
    
    // Mostrar/ocultar error
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
        if (isValid) {
            errorElement.textContent = '';
            field.classList.remove('error');
        } else {
            errorElement.textContent = errorMessage;
            field.classList.add('error');
        }
    }
    
    return isValid;
}

/**
 * Limpiar error de campo
 */
function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        field.classList.remove('error');
    }
}

/**
 * Manejar envío del formulario de contacto
 */
function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    let isFormValid = true;
    
    // Validar todos los campos obligatorios
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!validateField(field)) {
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
        // Simular envío del formulario
        const submitBtn = form.querySelector('#submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        
        setTimeout(() => {
            alert('¡Mensaje enviado correctamente! Te responderemos pronto.');
            form.reset();
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }, 2000);
    } else {
        alert('Por favor, corrige los errores en el formulario antes de enviarlo.');
    }
}

/**
 * Manejar envío del formulario de presupuesto
 */
function handleBudgetSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    let isFormValid = true;
    
    // Validar todos los campos obligatorios
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    // Validar aceptación de condiciones
    const conditionsCheckbox = form.querySelector('#condiciones');
    if (conditionsCheckbox && !conditionsCheckbox.checked) {
        isFormValid = false;
        const errorElement = document.getElementById('condiciones-error');
        if (errorElement) {
            errorElement.textContent = 'Debes aceptar las condiciones para continuar';
        }
    }
    
    if (isFormValid) {
        // Simular envío del formulario
        alert('¡Solicitud de presupuesto enviada correctamente! Te contactaremos pronto.');
        form.reset();
        updateBudgetTotal(); // Resetear el cálculo del presupuesto
    } else {
        alert('Por favor, completa todos los campos obligatorios y acepta las condiciones.');
    }
}

/**
 * Inicializar calculadora de presupuesto
 */
function initializeBudgetCalculator() {
    const budgetForm = document.getElementById('budgetForm');
    if (!budgetForm) return;
    
    // Escuchar cambios en los campos que afectan el presupuesto
    const productSelect = document.getElementById('producto');
    const plazoInput = document.getElementById('plazo');
    const extrasCheckboxes = document.querySelectorAll('input[name="extras[]"]');
    
    if (productSelect) {
        productSelect.addEventListener('change', updateBudgetTotal);
    }
    
    if (plazoInput) {
        plazoInput.addEventListener('input', updateBudgetTotal);
    }
    
    extrasCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateBudgetTotal);
    });
    
    // Botón de reset
    const resetBtn = document.getElementById('reset-budget');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que quieres resetear el formulario?')) {
                budgetForm.reset();
                updateBudgetTotal();
            }
        });
    }
}

/**
 * Actualizar total del presupuesto
 */
function updateBudgetTotal() {
    const productSelect = document.getElementById('producto');
    const plazoInput = document.getElementById('plazo');
    const extrasCheckboxes = document.querySelectorAll('input[name="extras[]"]:checked');
    const totalElement = document.getElementById('presupuesto-total');
    
    if (!productSelect || !plazoInput || !totalElement) return;
    
    let total = 0;
    
    // Precio base del producto
    const productPrice = parseFloat(productSelect.value) || 0;
    total += productPrice;
    
    // Aplicar descuento por plazo
    const plazo = parseInt(plazoInput.value) || 0;
    let descuento = 0;
    if (plazo >= 12) {
        descuento = 0.15; // 15% de descuento para 12+ meses
    } else if (plazo >= 6) {
        descuento = 0.10; // 10% de descuento para 6+ meses
    } else if (plazo >= 3) {
        descuento = 0.05; // 5% de descuento para 3+ meses
    }
    
    total = total * (1 - descuento);
    
    // Añadir extras
    extrasCheckboxes.forEach(checkbox => {
        const extraPrice = parseFloat(checkbox.value) || 0;
        total += extraPrice;
    });
    
    // Mostrar el total
    totalElement.textContent = `€${total.toFixed(2)}`;
    
    // Mostrar desglose si hay elementos seleccionados
    const desglose = document.getElementById('presupuesto-desglose');
    if (desglose) {
        let desgloseHTML = '';
        
        if (productPrice > 0) {
            desgloseHTML += `<div class="desglose-item">Producto base: €${productPrice.toFixed(2)}</div>`;
            
            if (descuento > 0) {
                desgloseHTML += `<div class="desglose-item">Descuento por plazo (${(descuento * 100).toFixed(0)}%): -€${(productPrice * descuento).toFixed(2)}</div>`;
            }
        }
        
        extrasCheckboxes.forEach(checkbox => {
            const extraPrice = parseFloat(checkbox.value) || 0;
            const extraLabel = checkbox.nextElementSibling.textContent;
            desgloseHTML += `<div class="desglose-item">${extraLabel}: €${extraPrice.toFixed(2)}</div>`;
        });
        
        desglose.innerHTML = desgloseHTML;
    }
}

/**
 * Inicializar mapa de contacto
 */
function initializeContactMap() {
    const mapContainer = document.getElementById('contact-map');
    if (!mapContainer) return;
    
    // Coordenadas de Madrid (ejemplo)
    const lat = 40.4168;
    const lng = -3.7038;
    
    // Crear mapa básico con OpenStreetMap
    if (typeof L !== 'undefined') {
        const map = L.map('contact-map').setView([lat, lng], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        L.marker([lat, lng]).addTo(map)
            .bindPopup('Kiaras Reign - El Reino de la Pequeña Kiara')
            .openPopup();
    } else {
        // Fallback si no está disponible Leaflet
        mapContainer.innerHTML = `
            <div class="map-fallback">
                <p>📍 Calle de la Sabana Real, 123<br>28001 Madrid, España</p>
                <a href="https://maps.google.com/?q=40.4168,-3.7038" target="_blank" class="btn btn-primary">Ver en Google Maps</a>
            </div>
        `;
    }
}

/**
 * Inicializar galería de imágenes
 */
function initializeGallery() {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer) return;
    
    // Datos de ejemplo para la galería
    const galleryImages = [
        { src: 'images/gallery1.jpg', alt: 'Peluche Simba orgánico', category: 'peluches' },
        { src: 'images/gallery2.jpg', alt: 'Ropa de bebé ecológica', category: 'ropa' },
        { src: 'images/gallery3.jpg', alt: 'Productos de alimentación', category: 'alimentacion' },
        { src: 'images/gallery4.jpg', alt: 'Accesorios para el descanso', category: 'descanso' },
        { src: 'images/gallery5.jpg', alt: 'Juguetes educativos', category: 'juguetes' },
        { src: 'images/gallery6.jpg', alt: 'Productos de higiene natural', category: 'higiene' }
    ];
    
    // Crear filtros
    const categories = [...new Set(galleryImages.map(img => img.category))];
    const filtersContainer = document.createElement('div');
    filtersContainer.className = 'gallery-filters';
    
    const allFilter = document.createElement('button');
    allFilter.textContent = 'Todos';
    allFilter.className = 'filter-btn active';
    allFilter.addEventListener('click', () => filterGallery('all'));
    filtersContainer.appendChild(allFilter);
    
    categories.forEach(category => {
        const filterBtn = document.createElement('button');
        filterBtn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        filterBtn.className = 'filter-btn';
        filterBtn.addEventListener('click', () => filterGallery(category));
        filtersContainer.appendChild(filterBtn);
    });
    
    galleryContainer.parentNode.insertBefore(filtersContainer, galleryContainer);
    
    // Crear galería
    galleryImages.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-item ${image.category}`;
        galleryItem.innerHTML = `
            <img src="${image.src}" alt="${image.alt}" onerror="this.src='images/placeholder.jpg'">
            <div class="gallery-overlay">
                <h3>${image.alt}</h3>
                <button onclick="openLightbox(${index})">Ver más</button>
            </div>
        `;
        galleryContainer.appendChild(galleryItem);
    });
    
    // Función para filtrar galería
    window.filterGallery = function(category) {
        const items = galleryContainer.querySelectorAll('.gallery-item');
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        // Actualizar botones activos
        filterBtns.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Filtrar elementos
        items.forEach(item => {
            if (category === 'all' || item.classList.contains(category)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    };
    
    // Función para abrir lightbox
    window.openLightbox = function(index) {
        const image = galleryImages[index];
        alert(`Imagen: ${image.alt}\nCategoría: ${image.category}`);
        // Aquí se podría implementar un lightbox más sofisticado
    };
}

/**
 * Utilidades generales
 */

// Función para mostrar/ocultar elementos
function toggleElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
}

// Función para scroll suave
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Función para validar formularios genérica
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

