// --- 1. Lógica del Sobre y Audio ---
const openBtn = document.getElementById('open-envelope');
const envelopeWrapper = document.getElementById('envelope-wrapper');
const bgMusic = document.getElementById('bg-music');
const muteBtn = document.getElementById('mute-btn');
let isMuted = false;

openBtn.addEventListener('click', () => {
    // 1. Añadir clase para animar el sobre
    envelopeWrapper.classList.add('open');
    
    // 2. Reproducir el audio
    bgMusic.volume = 1.0;
    const playPromise = bgMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.error("Error reproduciendo audio:", error);
            if(error.name === 'NotSupportedError' || String(error).includes('src')) {
                alert("ATENCIÓN: Para que suene la música, debes colocar un archivo de música llamado 'audio.mp3' en la carpeta TARJETA.");
            }
        });
    }

    // 3. Eliminar el sobre del DOM
    setTimeout(() => {
        envelopeWrapper.style.display = 'none';
    }, 1500);
});

// Botón para mutear/desmutear la música
muteBtn.addEventListener('click', () => {
    if (bgMusic.muted) {
        bgMusic.muted = false;
        muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    } else {
        bgMusic.muted = true;
        muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    }
});


// --- 2. Animaciones al hacer Scroll (Intersection Observer) ---
const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.3 // Se activa cuando el 30% es visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Activar las animaciones específicas dentro de la sección
            const toast = entry.target.querySelector('.toast-animation');
            if (toast) toast.classList.add('animate-toast');
            
            const gift = entry.target.querySelector('.icon.fa-gift');
            if (gift) gift.classList.add('gift-anim');
            
        } else {
            // Reiniciar estado si sale de pantalla para que al volver a bajar se animen de nuevo
            entry.target.classList.remove('active');
            
            const toast = entry.target.querySelector('.toast-animation');
            if (toast) toast.classList.remove('animate-toast');
            
            const gift = entry.target.querySelector('.icon.fa-gift');
            if (gift) gift.classList.remove('gift-anim');
        }
    });
}, observerOptions);

document.querySelectorAll('.section-reveal').forEach(section => {
    observer.observe(section);
});

// --- 3. Cuenta Regresiva ---
// Fecha de la boda: 10 de Octubre de 2026, 16:00
const weddingDate = new Date('October 10, 2026 16:00:00').getTime();

const countdownTimer = setInterval(() => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    // Cálculos de tiempo
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Actualizar el DOM
    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');

    // Si la fecha ya pasó
    if (distance < 0) {
        clearInterval(countdownTimer);
        document.getElementById('countdown').innerHTML = "<div style='font-size: 2rem; color: var(--primary-color); font-family: var(--font-titles);'>¡Llegó el gran día!</div>";
    }
}, 1000);

// --- 4. Integración con WhatsApp para Confirmación (RSVP) ---
document.getElementById('rsvp-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que se recargue la página

    // Obtener valores del formulario
    const name = document.getElementById('guest-name').value.trim();
    const attendance = document.getElementById('guest-attendance').value;
    const companions = document.getElementById('guest-companions').value;
    const message = document.getElementById('guest-message').value.trim();

    // Número de teléfono
    const phoneNumber = "51993986240"; 

    // Construir el mensaje
    let whatsappMessage = `¡Hola! Soy *${name}*.%0A`;
    whatsappMessage += `Te escribo para confirmar sobre la boda:%0A%0A`;
    whatsappMessage += `*Asistencia:* ${attendance}%0A`;
    
    if (companions && companions > 0) {
        whatsappMessage += `*Acompañantes:* ${companions}%0A`;
    }
    
    if (message) {
        whatsappMessage += `*Mensaje / Alergias:* ${message}%0A`;
    }

    whatsappMessage += `%0A¡Gracias!`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
});
