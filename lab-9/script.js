document.addEventListener("DOMContentLoaded", function () {
    const btnSignup = document.getElementById("btn-signup");
    const btnLogin = document.getElementById("btn-login");
    const formSignup = document.getElementById("signup-form");
    const formLogin = document.getElementById("login-form");

    const citiesData = {
        ukraine: ["Київ", "Львів", "Чернівці", "Одеса", "Дніпро"],
        usa: ["New York", "Los Angeles", "Chicago", "Houston"],
        poland: ["Warsaw", "Krakow", "Gdansk"]
    };

    btnSignup.addEventListener("click", function () {
        btnSignup.classList.add("active");
        btnLogin.classList.remove("active");
        formSignup.classList.add("active");
        formLogin.classList.remove("active");
    });

    btnLogin.addEventListener("click", function () {
        btnLogin.classList.add("active");
        btnSignup.classList.remove("active");
        formLogin.classList.add("active");
        formSignup.classList.remove("active");
    });

    const countrySelect = document.getElementById("country");
    const citySelect = document.getElementById("city");

    countrySelect.addEventListener("change", function () {
        const country = this.value;
        citySelect.innerHTML = '<option value="">Choose...</option>';

        if (country && citiesData[country]) {
            citySelect.disabled = false;
            citiesData[country].forEach(function(city) {
                const option = document.createElement("option");
                option.value = city.toLowerCase();
                option.textContent = city;
                citySelect.appendChild(option);
            });
        } else {
            citySelect.disabled = true;
            citySelect.innerHTML = '<option value="">Choose country first...</option>';
        }
    });

    formSignup.addEventListener("submit", function (e) {
        e.preventDefault();
        if (validateSignupForm()) {
            document.getElementById("signup-success").textContent = "Successfully registered!";
            formSignup.reset();
            resetValidationUI(formSignup);
            citySelect.disabled = true;
            setTimeout(() => document.getElementById("signup-success").textContent = "", 3000);
        }
    });

    formLogin.addEventListener("submit", function (e) {
        e.preventDefault();
        if (validateLoginForm()) {
            document.getElementById("login-success").textContent = "Successfully logged in!";
            formLogin.reset();
            resetValidationUI(formLogin);
            setTimeout(() => document.getElementById("login-success").textContent = "", 3000);
        }
    });
});

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}

function validateSignupForm() {
    let isValid = true;

    isValid = checkLength("firstName", 3, 15, "First name must be 3-15 characters.") && isValid;
    isValid = checkLength("lastName", 3, 15, "Last name must be 3-15 characters.") && isValid;
    isValid = checkRegex("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email (e.g. user@mail.com).") && isValid;
    isValid = checkRegex("phone", /^\+380\d{9}$/, "Phone must match +380.........") && isValid;

    const passValid = checkLength("regPassword", 6, 100, "Password must be at least 6 characters.");
    isValid = passValid && isValid;

    if (passValid) {
        isValid = checkMatch("confirmPassword", "regPassword", "Passwords do not match.") && isValid;
    } else {
        setError(document.getElementById("confirmPassword"), "Please enter a valid password first.");
        isValid = false;
    }

    isValid = checkDob("dob") && isValid;
    isValid = checkRadio("sex", "Please select your sex.") && isValid;
    isValid = checkRequired("country", "Please select a country.") && isValid;
    isValid = checkRequired("city", "Please select a city.") && isValid;

    return isValid;
}

function validateLoginForm() {
    let isValid = true;
    isValid = checkRequired("username", "Please enter your username.") && isValid;
    isValid = checkLength("loginPassword", 6, 100, "Password must be at least 6 characters.") && isValid;
    return isValid;
}

// ---------------- Допоміжні функції перевірки ---------------- //

function checkRequired(id, errorMsg) {
    const input = document.getElementById(id);
    if (input.value.trim() === "") {
        setError(input, errorMsg);
        return false;
    }
    setSuccess(input);
    return true;
}

function checkLength(id, min, max, errorMsg) {
    const input = document.getElementById(id);
    const length = input.value.trim().length;
    if (length < min || length > max) {
        setError(input, errorMsg);
        return false;
    }
    setSuccess(input);
    return true;
}

function checkRegex(id, regex, errorMsg) {
    const input = document.getElementById(id);
    if (!regex.test(input.value.trim())) {
        setError(input, errorMsg);
        return false;
    }
    setSuccess(input);
    return true;
}

function checkMatch(id1, id2, errorMsg) {
    const input1 = document.getElementById(id1);
    const input2 = document.getElementById(id2);
    if (input1.value !== input2.value || input1.value === "") {
        setError(input1, errorMsg);
        return false;
    }
    setSuccess(input1);
    return true;
}

function checkDob(id) {
    const input = document.getElementById(id);
    if (!input.value) {
        setError(input, "Please provide your Date of Birth.");
        return false;
    }

    const dob = new Date(input.value);
    const today = new Date();

    if (dob > today) {
        setError(input, "Date of birth cannot be in the future.");
        return false;
    }

    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    if (age < 12) {
        setError(input, "You must be at least 12 years old.");
        return false;
    }

    setSuccess(input);
    return true;
}

function checkRadio(name, errorMsg) {
    const radios = document.getElementsByName(name);
    let isChecked = false;
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            isChecked = true;
            break;
        }
    }

    const feedbackDiv = document.getElementById(name + "-feedback");
    if (!isChecked) {
        feedbackDiv.textContent = errorMsg;
        feedbackDiv.className = "feedback invalid-text";
        return false;
    }
    feedbackDiv.textContent = "Looks good!";
    feedbackDiv.className = "feedback valid-text";
    return true;
}


function setError(input, message) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");

    let feedback = input.nextElementSibling;
    if (input.parentElement.classList.contains("password-wrapper")) {
        feedback = input.parentElement.nextElementSibling;
    }

    if (feedback && feedback.classList.contains("feedback")) {
        feedback.textContent = message;
        feedback.className = "feedback invalid-text";
    }
}

function setSuccess(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");

    let feedback = input.nextElementSibling;
    if (input.parentElement.classList.contains("password-wrapper")) {
        feedback = input.parentElement.nextElementSibling;
    }

    if (feedback && feedback.classList.contains("feedback")) {
        feedback.textContent = "Looks good!";
        feedback.className = "feedback valid-text";
    }
}

function resetValidationUI(form) {
    const inputs = form.querySelectorAll("input, select");
    inputs.forEach(input => {
        input.classList.remove("is-valid", "is-invalid");
    });
    const feedbacks = form.querySelectorAll(".feedback");
    feedbacks.forEach(feedback => {
        feedback.textContent = "";
        feedback.className = "feedback";
    });
}