// ==========================================================================
// CYBERPUNK TECH AI PORTAL - REGISTER SCRIPT
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

    // 2. Input & Select Field Value Tracker (Floating Label support)
    const fields = document.querySelectorAll(".input-wrapper input, .input-wrapper select");

    function checkFieldValue(field) {
        if (field.value && field.value.trim() !== "") {
            field.classList.add("has-value");
        } else {
            field.classList.remove("has-value");
        }
    }

    fields.forEach(field => {
        // Initial check on page load
        checkFieldValue(field);

        // Check on change / typing / selection
        field.addEventListener("input", function () {
            checkFieldValue(field);
        });

        field.addEventListener("change", function () {
            checkFieldValue(field);
        });

        field.addEventListener("blur", function () {
            checkFieldValue(field);
        });
    });

    // 3. Form Password Validation & Submit Animation
    const registerForm = document.getElementById("registerForm");
    const submitBtn = document.getElementById("submitBtn");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const errorAlert = document.getElementById("errorAlert");
    const errorMessage = document.getElementById("errorMessage");

    if (registerForm && submitBtn) {
        registerForm.addEventListener("submit", function (e) {
            const pass = passwordInput ? passwordInput.value : "";
            const confirmPass = confirmPasswordInput ? confirmPasswordInput.value : "";

            // Validate Passwords Match
            if (pass !== confirmPass) {
                e.preventDefault();

                if (errorAlert && errorMessage) {
                    errorMessage.textContent = "Passwords do not match!";
                    errorAlert.style.display = "flex";
                }

                if (confirmPasswordInput) {
                    confirmPasswordInput.focus();
                }
                return false;
            }

            // Hide Error Banner if previously shown
            if (errorAlert) {
                errorAlert.style.display = "none";
            }

            // Activate Submit Loading State
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