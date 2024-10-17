// Modal functions
function openModal(message) {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const closeButton = document.querySelector('.close-button');

    modalMessage.textContent = message; // Set the modal message
    modal.style.display = 'block'; // Show the modal

    closeButton.onclick = function() {
        modal.style.display = 'none'; // Close the modal on button click
    };

    // Close the modal if the user clicks outside the modal content
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Redirect to the menus page after login or show a modal for invalid email
document.getElementById('login-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    if (email.endsWith('@est.univalle.edu') || email.endsWith('@univalle.edu')) {
        openModal('Inicio de Sesión Exitoso! Redirigiendo a los Menús.');
        setTimeout(function() {
            window.location.href = "menus.html"; // Redirect to menus page
        }, 2000); // Wait for 2 seconds before redirecting
    } else {
        openModal('Debes tener correo de la universidad para iniciar sesión.');
    }
});

// Registration form submission logic (if you have one)
document.getElementById('register-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (email.endsWith('@est.univalle.edu') || email.endsWith('@univalle.edu')) {
        if (password === confirmPassword) {
            openModal('Registro exitoso, redirigiendo al login');
            setTimeout(function() {
                window.location.href = "login.html"; // Redirect to menus page
            }, 2000); // Wait for 2 seconds before redirecting
        } else {
            openModal('Las contraseñas no coinciden.');
        }
    } else {
        openModal('Debes tener correo de la universidad para registrarte.');
    }
});
