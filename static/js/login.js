// ==========================================================================
// CYBERPUNK TECH AI PORTAL - LOGIN SCRIPT
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {

    // 1. Password Visibility Toggle
    const togglePasswordBtn = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    if (togglePasswordBtn && passwordInput) {
        const eyeOpen = togglePasswordBtn.querySelector(".eye-open");
        const eyeClosed = togglePasswordBtn.querySelector(".eye-closed");

        togglePasswordBtn.addEventListener("click", function () {
            const isPassword = passwordInput.type === "password";

            passwordInput.type = isPassword ? "text" : "password";

            if (eyeOpen && eyeClosed) {
                eyeOpen.style.display = isPassword ? "none" : "block";
                eyeClosed.style.display = isPassword ? "block" : "none";
            }
        });
    }

    // 2. Input Field Value Tracker (Floating Label support for autofill)
    const formInputs = document.querySelectorAll(".input-wrapper input");

    function checkInputValue(input) {
        if (input.value.trim() !== "") {
            input.classList.add("has-value");
        } else {
            input.classList.remove("has-value");
        }
    }

    formInputs.forEach(input => {
        // Initial check on load (handles browser pre-filled values)
        checkInputValue(input);

        // Check on user typing or paste
        input.addEventListener("input", function () {
            checkInputValue(input);
        });

        // Check on blur
        input.addEventListener("blur", function () {
            checkInputValue(input);
        });
    });

    // 3. Form Submit State Animation
    const loginForm = document.getElementById("loginForm");
    const submitBtn = document.getElementById("submitBtn");

    if (loginForm && submitBtn) {
        loginForm.addEventListener("submit", function () {
            const btnContent = submitBtn.querySelector(".btn-content");
            const btnSpinner = submitBtn.querySelector(".btn-spinner");

            if (btnContent && btnSpinner) {
                btnContent.style.display = "none";
                btnSpinner.style.display = "flex";
            }

            submitBtn.style.pointerEvents = "none";
            submitBtn.style.opacity = "0.9";
        });
    }

});