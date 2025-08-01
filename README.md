# Kiaras Reign - Proyecto JavaScript

## Descripción del Proyecto

Este proyecto es una implementación completa de funcionalidades JavaScript para el sitio web "Kiaras Reign - El Reino de la Pequeña Kiara", una tienda premium de productos ecológicos para bebés inspirada en El Rey León.

## Estructura del Proyecto

```
kiaras-reign-javascript/
├── index.html              # Página principal con carga dinámica de noticias
├── galeria.html            # Galería con filtros dinámicos y lightbox
├── presupuesto.html        # Calculadora de presupuesto con validación
├── contacto.html           # Formulario de contacto con mapa interactivo
├── css/
│   └── style.css          # Estilos CSS del sitio original
├── js/
│   ├── main.js            # JavaScript principal y funcionalidades comunes
│   ├── gallery.js         # Funcionalidades específicas de la galería
│   ├── budget.js          # Calculadora de presupuesto y validación
│   └── contact.js         # Formulario de contacto y mapa dinámico
├── data/
│   └── noticias.json      # Datos JSON para las noticias dinámicas
├── images/
│   └── logo.png           # Logo generado para el sitio
└── README.md              # Este archivo
```

## Funcionalidades Implementadas

### 1. Página Principal (index.html)
- **Carga dinámica de noticias**: Las noticias se cargan desde un archivo JSON externo
- **Navegación responsive**: Menú hamburguesa para dispositivos móviles
- **Animaciones suaves**: Transiciones CSS y efectos hover

### 2. Galería (galeria.html)
- **Filtros dinámicos**: Filtrado por categorías de productos
- **Lightbox modal**: Visualización ampliada de imágenes
- **Contador de productos**: Muestra el número de productos filtrados
- **Carga progresiva**: Botón "Cargar más productos"

### 3. Presupuesto (presupuesto.html)
- **Validación en tiempo real**: Validación de todos los campos del formulario
- **Cálculo dinámico**: Actualización automática del presupuesto según selecciones
- **Descuentos por plazo**: Aplicación automática de descuentos según el plazo
- **Extras opcionales**: Selección múltiple de servicios adicionales
- **Validación de privacidad**: Verificación de aceptación de términos

### 4. Contacto (contacto.html)
- **Mapa interactivo**: Integración con Leaflet/OpenStreetMap
- **Calculadora de rutas**: Funcionalidad para calcular rutas al negocio
- **Formulario avanzado**: Validación completa con mensajes de error
- **FAQ interactivo**: Sección de preguntas frecuentes expandibles
- **Contador de caracteres**: Para el campo de mensaje

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con Flexbox y Grid
- **JavaScript ES6+**: Funcionalidades interactivas modernas
- **Leaflet**: Mapas interactivos
- **JSON**: Almacenamiento de datos estructurados
- **Font Awesome**: Iconografía
- **Google Fonts**: Tipografías premium

## Validaciones Implementadas

### Formulario de Presupuesto
- **Nombre**: Solo letras, máximo 15 caracteres
- **Apellidos**: Solo letras, máximo 40 caracteres
- **Teléfono**: Solo números, exactamente 9 dígitos
- **Email**: Formato válido de correo electrónico
- **Producto**: Selección obligatoria
- **Plazo**: Número válido de meses
- **Privacidad**: Aceptación obligatoria

### Formulario de Contacto
- **Nombre**: Solo letras, máximo 15 caracteres
- **Apellidos**: Solo letras, máximo 40 caracteres (opcional)
- **Teléfono**: Solo números, exactamente 9 dígitos
- **Email**: Formato válido de correo electrónico
- **Asunto**: Selección obligatoria
- **Mensaje**: Mínimo 10 caracteres, máximo 1000
- **Privacidad**: Aceptación obligatoria

## Características Técnicas

### Responsive Design
- Diseño adaptativo para dispositivos móviles, tablets y desktop
- Menú hamburguesa para navegación móvil
- Imágenes optimizadas para diferentes resoluciones

### Accesibilidad
- Etiquetas semánticas HTML5
- Atributos ARIA para lectores de pantalla
- Navegación por teclado
- Contraste de colores adecuado

### Performance
- Carga asíncrona de contenido
- Optimización de imágenes
- Minificación de código (recomendado para producción)
- Lazy loading de imágenes en galería

### SEO
- Meta tags optimizados
- Estructura de encabezados jerárquica
- URLs amigables
- Schema markup (recomendado para implementación futura)

## Instalación y Uso

1. **Clonar o descargar** el proyecto
2. **Abrir un servidor local** (por ejemplo, con Python):
   ```bash
   python3 -m http.server 8080
   ```
3. **Navegar** a `http://localhost:8080`
4. **Explorar** las diferentes páginas y funcionalidades

## Funcionalidades JavaScript Destacadas

### Carga Dinámica de Contenido
```javascript
// Carga de noticias desde JSON
async function loadNews() {
    try {
        const response = await fetch('data/noticias.json');
        const noticias = await response.json();
        renderNews(noticias);
    } catch (error) {
        console.error('Error cargando noticias:', error);
    }
}
```

### Validación en Tiempo Real
```javascript
// Validación de campos con feedback inmediato
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Lógica de validación específica por campo
    // ...
    
    showFieldError(field, isValid, errorMessage);
    return isValid;
}
```

### Filtrado Dinámico
```javascript
// Filtrado de productos en galería
function filterProducts(category) {
    const products = document.querySelectorAll('.product-item');
    let visibleCount = 0;
    
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });
    
    updateProductCounter(visibleCount);
}
```

## Mejoras Futuras Recomendadas

1. **Integración con Backend**: Conectar formularios con un servidor real
2. **Base de Datos**: Almacenar productos y noticias en una base de datos
3. **Carrito de Compras**: Implementar funcionalidad de e-commerce
4. **Autenticación**: Sistema de usuarios y cuentas
5. **Pagos Online**: Integración con pasarelas de pago
6. **CMS**: Panel de administración para gestionar contenido
7. **PWA**: Convertir en Progressive Web App
8. **Testing**: Implementar tests unitarios y de integración

## Compatibilidad

- **Navegadores**: Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
- **Dispositivos**: Desktop, Tablet, Mobile
- **Resoluciones**: 320px - 1920px+

## Licencia

Este proyecto es parte de un ejercicio académico para el curso de JavaScript.

## Autor

Desarrollado como proyecto final de JavaScript, implementando todas las funcionalidades requeridas en el enunciado del curso.

---

**Nota**: Este proyecto demuestra el dominio de JavaScript moderno, incluyendo manipulación del DOM, eventos, validación de formularios, peticiones asíncronas, y integración con APIs externas como mapas interactivos.

