/**
 * Kiaras Reign - Galería JavaScript
 * Funcionalidades específicas para la galería de productos
 */

// Variables globales para la galería
let currentImageIndex = 0;
let galleryImages = [];
let filteredImages = [];
let currentFilter = 'all';

// Datos de productos para la galería
const galleryData = [
    {
        id: 'peluche-simba',
        title: 'Peluche Simba Orgánico',
        description: 'Suave peluche del pequeño Simba fabricado con algodón 100% orgánico. Perfecto para acompañar a tu bebé en sus aventuras y siestas.',
        category: 'peluches',
        price: '€29.99',
        image: 'images/gallery/simba.jpg',
        features: ['Algodón 100% orgánico', 'Tintes naturales', 'Hipoalergénico', 'Lavable a máquina']
    },
    {
        id: 'peluche-nala',
        title: 'Peluche Nala Ecológico',
        description: 'Adorable peluche de Nala confeccionado con materiales sostenibles y seguros para los más pequeños.',
        category: 'peluches',
        price: '€32.99',
        image: 'images/gallery/nala.jpg',
        features: ['Materiales sostenibles', 'Relleno de fibra reciclada', 'Certificado OEKO-TEX', 'Diseño exclusivo']
    },
    {
        id: 'body-kiara',
        title: 'Body Kiara Bambú',
        description: 'Body ultra suave confeccionado con fibra de bambú orgánico, ideal para la piel sensible del bebé.',
        category: 'ropa',
        price: '€24.99',
        image: 'images/gallery/body.jpg',
        features: ['Fibra de bambú orgánico', 'Antibacteriano natural', 'Termorregulador', 'Tacto sedoso']
    },
    {
        id: 'pijama-savana',
        title: 'Pijama Sabana Dreams',
        description: 'Pijama de dos piezas con estampado inspirado en la sabana africana, confeccionado en algodón orgánico.',
        category: 'ropa',
        price: '€34.99',
        image: 'images/gallery/ropa.jpg',
        features: ['Algodón orgánico certificado', 'Estampado exclusivo', 'Costuras planas', 'Fácil cambio de pañal']
    },
    {
        id: 'biberon-natural',
        title: 'Biberón Natural Glass',
        description: 'Biberón de vidrio borosilicato libre de BPA, con tetina de silicona que imita la lactancia natural.',
        category: 'alimentacion',
        price: '€19.99',
        image: 'images/gallery/biberón.jpg',
        features: ['Vidrio borosilicato', 'Libre de BPA', 'Tetina anatómica', 'Fácil limpieza']
    },
   
    {
        id: 'manta-kiara',
        title: 'Manta Kiara Dreams',
        description: 'Manta de algodón orgánico ultra suave, perfecta para envolver al bebé y proporcionarle seguridad.',
        category: 'descanso',
        price: '€39.99',
        image: 'images/gallery/sabana.jpg',
        features: ['Algodón orgánico', 'Tejido transpirable', 'Tamaño generoso', 'Colores naturales']
    },
    {
        id: 'sonajero-madera',
        title: 'Sonajero Madera Natural',
        description: 'Sonajero de madera de haya certificada FSC, estimula los sentidos del bebé de forma natural.',
        category: 'juguetes',
        price: '€15.99',
        image: 'images/gallery/móvil.jpg',
        features: ['Madera de haya FSC', 'Acabado natural', 'Estimulación sensorial', 'Tamaño seguro']
    },
   
];

// Inicializar galería cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('gallery-container')) {
        initializeGallery();
    }
});

/**
 * Inicializar funcionalidades de la galería
 */
function initializeGallery() {
    console.log('Inicializando galería...');
    
    // Configurar filtros
    setupGalleryFilters();
    
    // Configurar lightbox
    setupLightbox();
    
    // Configurar botón "Cargar más"
    setupLoadMore();
    
    // Inicializar imágenes
    galleryImages = galleryData.slice();
    filteredImages = galleryImages.slice();
    
    // Actualizar contador
    updateResultsCounter();
    
    console.log('Galería inicializada correctamente');
}

/**
 * Configurar filtros de galería
 */
function setupGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Actualizar botones activos
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Aplicar filtro
            filterGallery(filter);
        });
    });
}

/**
 * Filtrar galería por categoría
 */
function filterGallery(category) {
    currentFilter = category;
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Animar salida de elementos
    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
    });
    
    setTimeout(() => {
        let visibleCount = 0;
        
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, visibleCount * 50);
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Actualizar datos filtrados
        if (category === 'all') {
            filteredImages = galleryImages.slice();
        } else {
            filteredImages = galleryImages.filter(img => img.category === category);
        }
        
        // Actualizar contador
        updateResultsCounter();
        
    }, 300);
}

/**
 * Actualizar contador de resultados
 */
function updateResultsCounter() {
    const counter = document.getElementById('results-count');
    if (!counter) return;
    
    const visibleItems = document.querySelectorAll('.gallery-item[style*="display: block"], .gallery-item:not([style*="display: none"])');
    const totalVisible = visibleItems.length;
    
    if (currentFilter === 'all') {
        counter.textContent = `Mostrando todos los productos (${totalVisible})`;
    } else {
        const categoryName = getCategoryDisplayName(currentFilter);
        counter.textContent = `Mostrando ${categoryName} (${totalVisible} productos)`;
    }
}

/**
 * Obtener nombre de categoría para mostrar
 */
function getCategoryDisplayName(category) {
    const categoryNames = {
        'peluches': 'Peluches',
        'ropa': 'Ropa',
        'alimentacion': 'Alimentación',
        'descanso': 'Descanso',
        'juguetes': 'Juguetes',
        'higiene': 'Higiene'
    };
    
    return categoryNames[category] || category;
}

/**
 * Configurar lightbox
 */
function setupLightbox() {
    const modal = document.getElementById('lightbox-modal');
    
    // Cerrar lightbox al hacer clic fuera de la imagen
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeLightbox();
        }
    });
    
    // Cerrar lightbox con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
        if (e.key === 'ArrowLeft') {
            previousImage();
        }
        if (e.key === 'ArrowRight') {
            nextImage();
        }
    });
}

/**
 * Abrir lightbox con imagen específica
 */
function openLightbox(imageIndex) {
    currentImageIndex = imageIndex;
    const modal = document.getElementById('lightbox-modal');
    const image = document.getElementById('lightbox-image');
    const title = document.getElementById('lightbox-title');
    const description = document.getElementById('lightbox-description');
    
    if (imageIndex >= 0 && imageIndex < galleryData.length) {
        const imageData = galleryData[imageIndex];
        
        // Configurar imagen
        image.src = imageData.image;
        image.alt = imageData.title;
        
        // Configurar información
        title.textContent = imageData.title;
        description.textContent = imageData.description;
        
        // Mostrar modal
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Animar entrada
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
}

/**
 * Cerrar lightbox
 */
function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

/**
 * Imagen anterior en lightbox
 */
function previousImage() {
    if (currentImageIndex > 0) {
        openLightbox(currentImageIndex - 1);
    } else {
        openLightbox(galleryData.length - 1);
    }
}

/**
 * Imagen siguiente en lightbox
 */
function nextImage() {
    if (currentImageIndex < galleryData.length - 1) {
        openLightbox(currentImageIndex + 1);
    } else {
        openLightbox(0);
    }
}

/**
 * Mostrar información del producto
 */
function showProductInfo(productId) {
    const product = galleryData.find(item => item.id === productId);
    
    if (product) {
        let featuresText = product.features.join('\n• ');
        
        alert(`${product.title}\n\n${product.description}\n\nPrecio: ${product.price}\n\nCaracterísticas:\n• ${featuresText}`);
    }
}

/**
 * Configurar botón "Cargar más"
 */
function setupLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simular carga de más productos
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
            this.disabled = true;
            
            setTimeout(() => {
                alert('¡Todos los productos están cargados! Pronto añadiremos más productos al reino.');
                this.innerHTML = '<i class="fas fa-plus"></i> Cargar Más Productos';
                this.disabled = false;
            }, 1500);
        });
    }
}

/**
 * Añadir al carrito (simulado)
 */
function addToCart() {
    const product = galleryData[currentImageIndex];
    
    if (product) {
        alert(`¡${product.title} añadido al carrito!\n\nPrecio: ${product.price}\n\n¿Te gustaría continuar comprando o ir al carrito?`);
        closeLightbox();
    }
}

/**
 * Solicitar presupuesto
 */
function requestQuote() {
    const product = galleryData[currentImageIndex];
    
    if (product) {
        if (confirm(`¿Te gustaría solicitar un presupuesto personalizado para ${product.title}?`)) {
            // Redirigir a la página de presupuesto con el producto preseleccionado
            window.location.href = `presupuesto.html?producto=${product.id}`;
        }
    }
}

/**
 * Búsqueda en galería
 */
function searchGallery(searchTerm) {
    const term = searchTerm.toLowerCase();
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const title = item.querySelector('.overlay-content h3').textContent.toLowerCase();
        const description = item.querySelector('.overlay-content p').textContent.toLowerCase();
        
        if (title.includes(term) || description.includes(term)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    updateResultsCounter();
}

/**
 * Ordenar galería
 */
function sortGallery(sortBy) {
    const container = document.getElementById('gallery-container');
    const items = Array.from(container.querySelectorAll('.gallery-item'));
    
    items.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                const nameA = a.querySelector('.overlay-content h3').textContent;
                const nameB = b.querySelector('.overlay-content h3').textContent;
                return nameA.localeCompare(nameB);
                
            case 'price':
                const priceA = parseFloat(a.querySelector('.gallery-price').textContent.replace('€', ''));
                const priceB = parseFloat(b.querySelector('.gallery-price').textContent.replace('€', ''));
                return priceA - priceB;
                
            case 'category':
                const catA = a.getAttribute('data-category');
                const catB = b.getAttribute('data-category');
                return catA.localeCompare(catB);
                
            default:
                return 0;
        }
    });
    
    // Reordenar elementos en el DOM
    items.forEach(item => container.appendChild(item));
}

/**
 * Lazy loading para imágenes
 */
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Inicializar lazy loading cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', setupLazyLoading);

