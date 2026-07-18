// Show / Hide Password

const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";
        togglePassword.innerHTML = "🙈";

    } else {

        password.type = "password";
        togglePassword.innerHTML = "👁";

    }

});


// Login Button Loading Effect

const form = document.querySelector("form");
const loginBtn = document.querySelector(".login-btn");

form.addEventListener("submit", function () {

    loginBtn.innerHTML = "Logging in...";

    loginBtn.disabled = true;

});


// Email Validation

const emailInput = document.querySelector("input[name='email']");

emailInput.addEventListener("blur", function () {

    const email = emailInput.value.trim();

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email !== "" && !pattern.test(email)) {

        alert("Please enter a valid email address.");

        emailInput.focus();

    }

});


// Input Focus Animation

const inputs = document.querySelectorAll("input");

inputs.forEach(input => {

    input.addEventListener("focus", function () {

        input.style.border = "2px solid #2563EB";

    });

    input.addEventListener("blur", function () {

        input.style.border = "none";

    });

});