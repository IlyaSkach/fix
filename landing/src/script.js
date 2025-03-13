document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("close");
    const registerBtn = document.getElementById("register-btn");
    const loginBtn = document.getElementById("login-btn");
    const formPanelOne = document.querySelector(".form-panel.one");
    const formPanelTwo = document.querySelector(".form-panel.two");

    const loginButtons = document.querySelectorAll(".enter");
    loginButtons.forEach(button => {

        button.addEventListener("click", function (event) {
            checkAppAuth();
            const loginError = document.getElementById('login-error');
            loginError.classList.add('hidden');
            event.preventDefault();
            modal.style.display = "block";
            formPanelTwo.style.display = "none";
            formPanelOne.style.display = "block";
        });
    });

    document.getElementById("login-btn-form").addEventListener("click", handleLogin);
    document.getElementById("register-btn-form").addEventListener("click", handleRegistration);

    const registerButtons = document.querySelectorAll(".to_try");
    registerButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            const errorContainer = document.getElementById('registration-error');
            const successContainer = document.getElementById('registration-success');

            errorContainer.classList.add('hidden');
            successContainer.classList.add('hidden');

            modal.style.display = "block";
            formPanelTwo.style.display = "block";
            formPanelOne.style.display = "none";
        });
    });


    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    registerBtn.addEventListener("click", function () {
        formPanelOne.style.display = "none";
        formPanelTwo.style.display = "block";
    });

    loginBtn.addEventListener("click", function () {
        formPanelTwo.style.display = "none";
        formPanelOne.style.display = "block";
    });
});

function checkAppAuth() {
    fetch('/checkAuth', {
        method: 'GET', credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            window.location.href = '/app';
        }
    }).catch(error => {
    });
}


function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const loginError = document.getElementById('login-error');

    if (!email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    fetch('/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
        credentials: 'include'
    }).then(response => {
        if (!response.ok) {
            // Handle HTTP errors explicitly
            return response.json().then(data => {
                throw new Error(data.errors || 'Login failed');
            });
        }
        return response.json();
    }).then(data => {
        window.location.href = "/app";
    }).catch(error => {
        loginError.textContent = error || 'Login failed!';
        loginError.classList.remove('hidden');
    });
}

function handleRegistration(event) {
    event.preventDefault();

    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const password2 = document.getElementById('reg-confirm-password').value;
    const errorContainer = document.getElementById('registration-error');
    const successContainer = document.getElementById('registration-success');
    const regButton = document.getElementById('register-btn-form');
    regButton.classList.remove('hidden');
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('hidden');
    });

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    let errorMessage = '';

    if (!email || !password || !password2) {
        errorMessage = 'All fields are required.';
    } else if (password !== password2) {
        errorMessage = 'Passwords do not match.';
    } else if (!passwordRegex.test(password)) {
        errorMessage = 'Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.';
    }

    if (errorMessage) {
        errorContainer.textContent = errorMessage;
        errorContainer.classList.remove('hidden');
        return;
    }

    errorContainer.textContent = '';
    errorContainer.classList.add('hidden');

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    }).then(response => {
        if (!response.ok) {
            // Handle HTTP errors explicitly
            return response.json().then(data => {
                throw new Error(data.message || 'Registration failed');
            });
        }
        return  response.json();
    }).then(data => {
        // Display success message
        successContainer.textContent = data.message || 'Registration successful!';
        successContainer.classList.remove('hidden');
        regButton.classList.add('hidden');

        // Loop through each .form-group element and add the 'hidden' class
        formGroups.forEach(group => {
            group.classList.add('hidden');
        });
    }).catch(error => {

        errorContainer.textContent = error.message || 'An unexpected error occurred';
        errorContainer.classList.remove('hidden');
    });
}
