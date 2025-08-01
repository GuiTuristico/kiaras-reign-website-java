/**
 * Kiaras Reign - Presupuesto JavaScript
 * Funcionalidades específicas para el formulario de presupuesto
 */

// Variables globales para el presupuesto
let currentBudget = {
    basePrice: 0,
    discount: 0,
    extras: 0,
    total: 0
};

// Configuración de descuentos por plazo
const discountRates = {
    3: 0.05,   // 5% para 3+ meses
    6: 0.10,   // 10% para 6+ meses
    12: 0.15   // 15% para 12+ meses
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('budgetForm')) {
        initializeBudgetCalculator();
        setupBudgetValidation();
        setupFormInteractions();
    }
});

/**
 * Inicializar calculadora de presupuesto
 */
function initializeBudgetCalculator() {
    console.log('Inicializando calculadora de presupuesto...');
    
    // Elementos del formulario
    const productSelect = document.getElementById('producto');
    const plazoInput = document.getElementById('plazo');
    const extrasCheckboxes = document.querySelectorAll('input[name="extras[]"]');
    const resetBtn = document.getElementById('reset-budget');
    
    // Event listeners para cálculo en tiempo real
    if (productSelect) {
        productSelect.addEventListener('change', calculateBudget);
    }
    
    if (plazoInput) {
        plazoInput.addEventListener('input', calculateBudget);
    }
    
    extrasCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculateBudget);
    });
    
    // Botón de reset
    if (resetBtn) {
        resetBtn.addEventListener('click', resetBudgetForm);
    }
    
    // Calcular presupuesto inicial
    calculateBudget();
    
    console.log('Calculadora de presupuesto inicializada');
}

/**
 * Calcular presupuesto total
 */
function calculateBudget() {
    const productSelect = document.getElementById('producto');
    const plazoInput = document.getElementById('plazo');
    const extrasCheckboxes = document.querySelectorAll('input[name="extras[]"]:checked');
    
    // Resetear presupuesto
    currentBudget = {
        basePrice: 0,
        discount: 0,
        extras: 0,
        total: 0
    };
    
    // Precio base del producto
    if (productSelect && productSelect.value) {
        currentBudget.basePrice = parseFloat(productSelect.value);
    }
    
    // Calcular descuento por plazo
    const plazo = parseInt(plazoInput?.value) || 1;
    let discountRate = 0;
    
    if (plazo >= 12) {
        discountRate = discountRates[12];
    } else if (plazo >= 6) {
        discountRate = discountRates[6];
    } else if (plazo >= 3) {
        discountRate = discountRates[3];
    }
    
    currentBudget.discount = currentBudget.basePrice * discountRate;
    
    // Calcular extras
    extrasCheckboxes.forEach(checkbox => {
        currentBudget.extras += parseFloat(checkbox.value) || 0;
    });
    
    // Calcular total
    currentBudget.total = currentBudget.basePrice - currentBudget.discount + currentBudget.extras;
    
    // Actualizar interfaz
    updateBudgetDisplay();
}

/**
 * Actualizar visualización del presupuesto
 */
function updateBudgetDisplay() {
    const totalElement = document.getElementById('presupuesto-total');
    const desgloseElement = document.getElementById('presupuesto-desglose');
    
    if (!totalElement || !desgloseElement) return;
    
    // Actualizar total
    totalElement.textContent = `€${currentBudget.total.toFixed(2)}`;
    
    // Crear desglose
    let desgloseHTML = '';
    
    if (currentBudget.basePrice > 0) {
        desgloseHTML += `
            <div class="breakdown-item">
                <span class="item-label">Producto base:</span>
                <span class="item-value">€${currentBudget.basePrice.toFixed(2)}</span>
            </div>
        `;
        
        if (currentBudget.discount > 0) {
            const discountPercent = ((currentBudget.discount / currentBudget.basePrice) * 100).toFixed(0);
            desgloseHTML += `
                <div class="breakdown-item discount">
                    <span class="item-label">Descuento por plazo (${discountPercent}%):</span>
                    <span class="item-value">-€${currentBudget.discount.toFixed(2)}</span>
                </div>
            `;
        }
        
        if (currentBudget.extras > 0) {
            desgloseHTML += `
                <div class="breakdown-item">
                    <span class="item-label">Extras seleccionados:</span>
                    <span class="item-value">+€${currentBudget.extras.toFixed(2)}</span>
                </div>
            `;
        }
        
        // Línea separadora
        desgloseHTML += '<div class="breakdown-separator"></div>';
        
        // Mostrar envío gratuito si aplica
        if (currentBudget.total >= 100) {
            desgloseHTML += `
                <div class="breakdown-item free-shipping">
                    <span class="item-label">🚚 Envío gratuito:</span>
                    <span class="item-value">€0.00</span>
                </div>
            `;
        } else {
            desgloseHTML += `
                <div class="breakdown-item shipping">
                    <span class="item-label">Envío estándar:</span>
                    <span class="item-value">€9.99</span>
                </div>
            `;
        }
    } else {
        desgloseHTML = `
            <div class="breakdown-item">
                <span class="item-label">Selecciona un producto para ver el desglose</span>
            </div>
        `;
    }
    
    desgloseElement.innerHTML = desgloseHTML;
    
    // Animar cambios
    totalElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        totalElement.style.transform = 'scale(1)';
    }, 200);
}

/**
 * Configurar validación del formulario de presupuesto
 */
function setupBudgetValidation() {
    const form = document.getElementById('budgetForm');
    if (!form) return;
    
    // Validación en tiempo real para campos específicos
    const nombre = document.getElementById('nombre');
    const apellidos = document.getElementById('apellidos');
    const telefono = document.getElementById('telefono');
    const email = document.getElementById('email');
    const producto = document.getElementById('producto');
    const plazo = document.getElementById('plazo');
    const condiciones = document.getElementById('condiciones');
    
    // Validación de nombre
    if (nombre) {
        nombre.addEventListener('input', function() {
            validateNombre(this);
        });
        nombre.addEventListener('blur', function() {
            validateNombre(this);
        });
    }
    
    // Validación de apellidos
    if (apellidos) {
        apellidos.addEventListener('input', function() {
            validateApellidos(this);
        });
        apellidos.addEventListener('blur', function() {
            validateApellidos(this);
        });
    }
    
    // Validación de teléfono
    if (telefono) {
        telefono.addEventListener('input', function() {
            // Solo permitir números
            this.value = this.value.replace(/[^0-9]/g, '');
            validateTelefono(this);
        });
        telefono.addEventListener('blur', function() {
            validateTelefono(this);
        });
    }
    
    // Validación de email
    if (email) {
        email.addEventListener('input', function() {
            validateEmail(this);
        });
        email.addEventListener('blur', function() {
            validateEmail(this);
        });
    }
    
    // Validación de producto
    if (producto) {
        producto.addEventListener('change', function() {
            validateProducto(this);
        });
    }
    
    // Validación de plazo
    if (plazo) {
        plazo.addEventListener('input', function() {
            validatePlazo(this);
        });
    }
    
    // Validación de condiciones
    if (condiciones) {
        condiciones.addEventListener('change', function() {
            validateCondiciones(this);
        });
    }
    
    // Validación al enviar formulario
    form.addEventListener('submit', handleBudgetFormSubmit);
}

/**
 * Validar campo nombre
 */
function validateNombre(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById('nombre-error');
    let isValid = true;
    let errorMessage = '';
    
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
    
    showFieldError(field, errorElement, isValid, errorMessage);
    return isValid;
}

/**
 * Validar campo apellidos
 */
function validateApellidos(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById('apellidos-error');
    let isValid = true;
    let errorMessage = '';
    
    if (!value) {
        isValid = false;
        errorMessage = 'Los apellidos son obligatorios';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
        isValid = false;
        errorMessage = 'Los apellidos solo pueden contener letras';
    } else if (value.length > 40) {
        isValid = false;
        errorMessage = 'Los apellidos no pueden tener más de 40 caracteres';
    }
    
    showFieldError(field, errorElement, isValid, errorMessage);
    return isValid;
}

/**
 * Validar campo teléfono
 */
function validateTelefono(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById('telefono-error');
    let isValid = true;
    let errorMessage = '';
    
    if (!value) {
        isValid = false;
        errorMessage = 'El teléfono es obligatorio';
    } else if (!/^\d{9}$/.test(value)) {
        isValid = false;
        errorMessage = 'El teléfono debe tener exactamente 9 dígitos';
    }
    
    showFieldError(field, errorElement, isValid, errorMessage);
    return isValid;
}

/**
 * Validar campo email
 */
function validateEmail(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById('email-error');
    let isValid = true;
    let errorMessage = '';
    
    if (!value) {
        isValid = false;
        errorMessage = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        isValid = false;
        errorMessage = 'Introduce un correo electrónico válido';
    }
    
    showFieldError(field, errorElement, isValid, errorMessage);
    return isValid;
}

/**
 * Validar selección de producto
 */
function validateProducto(field) {
    const value = field.value;
    const errorElement = document.getElementById('producto-error');
    let isValid = true;
    let errorMessage = '';
    
    if (!value) {
        isValid = false;
        errorMessage = 'Debes seleccionar un producto';
    }
    
    showFieldError(field, errorElement, isValid, errorMessage);
    return isValid;
}

/**
 * Validar plazo
 */
function validatePlazo(field) {
    const value = parseInt(field.value);
    const errorElement = document.getElementById('plazo-error');
    let isValid = true;
    let errorMessage = '';
    
    if (!value || value < 1) {
        isValid = false;
        errorMessage = 'El plazo debe ser al menos 1 mes';
    } else if (value > 24) {
        isValid = false;
        errorMessage = 'El plazo máximo es 24 meses';
    }
    
    showFieldError(field, errorElement, isValid, errorMessage);
    return isValid;
}

/**
 * Validar aceptación de condiciones
 */
function validateCondiciones(field) {
    const isChecked = field.checked;
    const errorElement = document.getElementById('condiciones-error');
    let isValid = true;
    let errorMessage = '';
    
    if (!isChecked) {
        isValid = false;
        errorMessage = 'Debes aceptar las condiciones para continuar';
    }
    
    showFieldError(field, errorElement, isValid, errorMessage);
    return isValid;
}

/**
 * Mostrar/ocultar error de campo
 */
function showFieldError(field, errorElement, isValid, errorMessage) {
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
}

/**
 * Configurar interacciones del formulario
 */
function setupFormInteractions() {
    // Autocompletar información si viene de la galería
    const urlParams = new URLSearchParams(window.location.search);
    const productoParam = urlParams.get('producto');
    
    if (productoParam) {
        preselectProduct(productoParam);
    }
    
    // Mostrar/ocultar información de descuentos
    const plazoInput = document.getElementById('plazo');
    if (plazoInput) {
        plazoInput.addEventListener('input', updateDiscountInfo);
    }
}

/**
 * Preseleccionar producto desde URL
 */
function preselectProduct(productId) {
    const productSelect = document.getElementById('producto');
    if (!productSelect) return;
    
    // Mapear IDs de productos a valores del select
    const productMapping = {
        'peluche-simba': '120',
        'peluche-nala': '120',
        'body-kiara': '180',
        'pijama-savana': '180',
        'biberon-natural': '90',
        'plato-bambu': '90',
        'manta-kiara': '150',
        'sonajero-madera': '120',
        'champu-natural': '90'
    };
    
    const selectValue = productMapping[productId];
    if (selectValue) {
        productSelect.value = selectValue;
        calculateBudget();
        
        // Mostrar mensaje informativo
        setTimeout(() => {
            alert(`Producto preseleccionado desde la galería. Puedes cambiar la selección si lo deseas.`);
        }, 500);
    }
}

/**
 * Actualizar información de descuentos
 */
function updateDiscountInfo() {
    const plazo = parseInt(document.getElementById('plazo')?.value) || 1;
    const helpElement = document.querySelector('#plazo + .form-error + .form-help');
    
    if (helpElement) {
        let discountText = '<strong>Descuentos por plazo:</strong><br>';
        
        if (plazo >= 12) {
            discountText += '• <span style="color: #28a745; font-weight: bold;">15% descuento aplicado</span><br>';
            discountText += '• 6+ meses: 10% descuento<br>';
            discountText += '• 3+ meses: 5% descuento';
        } else if (plazo >= 6) {
            discountText += '• 12+ meses: 15% descuento<br>';
            discountText += '• <span style="color: #28a745; font-weight: bold;">10% descuento aplicado</span><br>';
            discountText += '• 3+ meses: 5% descuento';
        } else if (plazo >= 3) {
            discountText += '• 12+ meses: 15% descuento<br>';
            discountText += '• 6+ meses: 10% descuento<br>';
            discountText += '• <span style="color: #28a745; font-weight: bold;">5% descuento aplicado</span>';
        } else {
            discountText += '• 12+ meses: 15% descuento<br>';
            discountText += '• 6+ meses: 10% descuento<br>';
            discountText += '• 3+ meses: 5% descuento';
        }
        
        helpElement.innerHTML = discountText;
    }
}

/**
 * Manejar envío del formulario
 */
function handleBudgetFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    let isFormValid = true;
    
    // Validar todos los campos obligatorios
    const nombre = document.getElementById('nombre');
    const apellidos = document.getElementById('apellidos');
    const telefono = document.getElementById('telefono');
    const email = document.getElementById('email');
    const producto = document.getElementById('producto');
    const plazo = document.getElementById('plazo');
    const condiciones = document.getElementById('condiciones');
    
    if (nombre && !validateNombre(nombre)) isFormValid = false;
    if (apellidos && !validateApellidos(apellidos)) isFormValid = false;
    if (telefono && !validateTelefono(telefono)) isFormValid = false;
    if (email && !validateEmail(email)) isFormValid = false;
    if (producto && !validateProducto(producto)) isFormValid = false;
    if (plazo && !validatePlazo(plazo)) isFormValid = false;
    if (condiciones && !validateCondiciones(condiciones)) isFormValid = false;
    
    if (isFormValid) {
        submitBudgetForm(form);
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
 * Enviar formulario de presupuesto
 */
function submitBudgetForm(form) {
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Mostrar estado de carga
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    
    // Simular envío
    setTimeout(() => {
        // Crear resumen del presupuesto
        const formData = new FormData(form);
        const resumen = createBudgetSummary(formData);
        
        alert(`¡Solicitud de presupuesto enviada correctamente!\n\n${resumen}\n\nTe contactaremos en menos de 24 horas con el presupuesto detallado y recomendaciones personalizadas.`);
        
        // Resetear formulario
        form.reset();
        calculateBudget();
        
        // Restaurar botón
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        
    }, 2000);
}

/**
 * Crear resumen del presupuesto
 */
function createBudgetSummary(formData) {
    const nombre = formData.get('nombre');
    const apellidos = formData.get('apellidos');
    const producto = document.getElementById('producto').selectedOptions[0]?.text || 'No seleccionado';
    const plazo = formData.get('plazo');
    const extras = formData.getAll('extras[]');
    
    let resumen = `Resumen de tu solicitud:\n`;
    resumen += `Cliente: ${nombre} ${apellidos}\n`;
    resumen += `Producto: ${producto}\n`;
    resumen += `Plazo: ${plazo} meses\n`;
    
    if (extras.length > 0) {
        resumen += `Extras: ${extras.length} seleccionados\n`;
    }
    
    resumen += `Total estimado: €${currentBudget.total.toFixed(2)}`;
    
    return resumen;
}

/**
 * Resetear formulario de presupuesto
 */
function resetBudgetForm() {
    if (confirm('¿Estás seguro de que quieres resetear todo el formulario?')) {
        const form = document.getElementById('budgetForm');
        
        // Resetear formulario
        form.reset();
        
        // Limpiar errores
        const errorElements = form.querySelectorAll('.form-error');
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        // Limpiar clases de validación
        const inputs = form.querySelectorAll('.form-input, .form-select');
        inputs.forEach(input => {
            input.classList.remove('error', 'valid');
        });
        
        // Recalcular presupuesto
        calculateBudget();
        
        // Scroll al inicio del formulario
        form.scrollIntoView({ behavior: 'smooth' });
    }
}

