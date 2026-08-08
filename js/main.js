// Variables globales
const WHATSAPP_NUMERO = '+18135343515';
const CORREO_ACADEMIA = 'damainfernandez@outlook.com';
let estudiantes = [];
let planSeleccionado = {
    tipo: '',
    precio: 0
};

// Cargar estudiantes del localStorage
function cargarEstudiantes() {
    const data = localStorage.getItem('estudiantes');
    if (data) {
        estudiantes = JSON.parse(data);
    }
}

// Guardar estudiantes en localStorage
function guardarEstudiantes() {
    localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
}

// Abrir formulario
function abrirFormulario(tipo, precio) {
    planSeleccionado.tipo = tipo === 'mensual' ? 'Plan Mensual ($30 USD)' : 'Plan Anual ($100 USD)';
    planSeleccionado.precio = precio;
    
    document.getElementById('planSeleccionado').value = planSeleccionado.tipo;
    document.getElementById('formularioModal').style.display = 'block';
    document.getElementById('modalOverlay').style.display = 'block';
}

// Cerrar formulario
function cerrarFormulario() {
    document.getElementById('formularioModal').style.display = 'none';
    document.getElementById('modalOverlay').style.display = 'none';
}

// Cerrar modal al hacer click fuera
window.onclick = function(event) {
    const modal = document.getElementById('formularioModal');
    if (event.target === modal) {
        cerrarFormulario();
    }
}

// Generar contraseña aleatoria
function generarContrasena(longitud = 12) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let contrasena = '';
    for (let i = 0; i < longitud; i++) {
        contrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return contrasena;
}

// Generar ID único
function generarID() {
    return 'EST_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Enviar formulario
function enviarFormulario(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const pais = document.getElementById('pais').value.trim();
    const nivel = document.getElementById('nivel').value;
    const experiencia = document.getElementById('experiencia').value.trim();
    const objetivos = document.getElementById('objetivos').value.trim();
    
    // Validar que todos los campos requeridos estén llenos
    if (!nombre || !email || !whatsapp || !pais || !nivel) {
        alert('Por favor completa todos los campos requeridos.');
        return;
    }
    
    // Generar contraseña única
    const contrasena = generarContrasena();
    const idEstudiante = generarID();
    
    // Crear objeto estudiante
    const nuevoEstudiante = {
        id: idEstudiante,
        nombre: nombre,
        email: email,
        whatsapp: whatsapp,
        pais: pais,
        nivel: nivel,
        experiencia: experiencia,
        objetivos: objetivos,
        plan: planSeleccionado.tipo,
        precio: planSeleccionado.precio,
        contrasena: contrasena,
        fechaInscripcion: new Date().toLocaleString('es-ES'),
        estado: 'pendiente_pago'
    };
    
    // Guardar en la lista
    estudiantes.push(nuevoEstudiante);
    guardarEstudiantes();
    
    // Enviar notificación a WhatsApp
    enviarNotificacionWhatsApp(nuevoEstudiante);
    
    // Mostrar mensaje de confirmación
    mostrarConfirmacion(nuevoEstudiante);
    
    // Limpiar formulario
    document.getElementById('formularioInscripcion').reset();
    cerrarFormulario();
}

// Enviar notificación a WhatsApp (simulado - en producción usar API real)
function enviarNotificacionWhatsApp(estudiante) {
    const mensaje = `
🎉 *NUEVA SOLICITUD DE INSCRIPCIÓN* 🎉

👤 *Nombre:* ${estudiante.nombre}
📧 *Email:* ${estudiante.email}
📱 *WhatsApp:* ${estudiante.whatsapp}
🌍 *País:* ${estudiante.pais}
♟️ *Nivel:* ${estudiante.nivel}
🎓 *Plan:* ${estudiante.plan} (\$${estudiante.precio})
🎓 *Experiencia:* ${estudiante.experiencia || 'No especificada'}

🔐 *Contraseña generada:* ${estudiante.contrasena}

📌 *ID del estudiante:* ${estudiante.id}

Por favor, contáctalo por WhatsApp para confirmar el pago.
    `;
    
    // Crear enlace de WhatsApp
    const urlWhatsApp = `https://wa.me/${WHATSAPP_NUMERO.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
    
    // En producción, aquí iría la llamada a una API backend
    // Por ahora, lo guardamos en una variable accesible
    console.log('Mensaje para WhatsApp:', mensaje);
    console.log('URL WhatsApp:', urlWhatsApp);
    
    // Guardar en un array de notificaciones pendientes
    guardarNotificacionPendiente(estudiante, mensaje);
}

// Guardar notificaciones pendientes
function guardarNotificacionPendiente(estudiante, mensaje) {
    let notificaciones = localStorage.getItem('notificacionesPendientes');
    notificaciones = notificaciones ? JSON.parse(notificaciones) : [];
    
    notificaciones.push({
        id: estudiante.id,
        nombre: estudiante.nombre,
        mensaje: mensaje,
        fecha: new Date().toLocaleString('es-ES'),
        enviado: false
    });
    
    localStorage.setItem('notificacionesPendientes', JSON.stringify(notificaciones));
}

// Mostrar confirmación al estudiante
function mostrarConfirmacion(estudiante) {
    const mensajeConfirmacion = `
✅ ¡SOLICITUD ENVIADA CORRECTAMENTE!

Hola ${estudiante.nombre},

Tu solicitud de inscripción a la Academia Inmortal de Ajedrez ha sido recibida.

📋 DETALLES DE TU SOLICITUD:
- Plan: ${estudiante.plan}
- Precio: \$${estudiante.precio} USD
- Estado: Pendiente de confirmación de pago

📱 PRÓXIMO PASO:
En breve, nuestro equipo se pondrá en contacto contigo por WhatsApp (${estudiante.whatsapp}) para confirmar el pago y otorgarte acceso a la academia.

⏳ Tiempo de respuesta: Usualmente dentro de 24 horas.

¡Gracias por unirte a la Academia Inmortal de Ajedrez!

♟️ Academia Inmortal de Ajedrez — aprende, entrena y mejora.
    `;
    
    alert(mensajeConfirmacion);
}

// Cargar estudiantes al iniciar
cargarEstudiantes();
