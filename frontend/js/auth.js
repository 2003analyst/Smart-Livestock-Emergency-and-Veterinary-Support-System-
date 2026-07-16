// ================= REGISTER =================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const user = {
            fullName: document.getElementById("fullName").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            password: password,
            role: document.getElementById("role").value
        };

        try {

            const response = await fetch(`${API_URL}/auth/register`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(user)

            });

            if (!response.ok) {
                throw new Error("Registration failed");
            }

            alert("Registration successful!");

            window.location.href = "login.html";

        } catch (error) {

            alert(error.message);

        }

    });

}



// ================= LOGIN =================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        try {

            const response = await fetch(`${API_URL}/auth/login`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });

            if (!response.ok) {
                throw new Error("Invalid email or password");
            }

            const user = await response.json();

            if (user.role !== role) {
                alert("Wrong role selected.");
                return;
            }

            localStorage.setItem("user", JSON.stringify(user));

            switch (user.role) {

                case "FARMER":
                    window.location.href = "farmer-dashboard.html";
                    break;

                case "DOCTOR":
                    window.location.href = "doctor-dashboard.html";
                    break;

                case "ADMIN":
                    window.location.href = "admin-dashboard.html";
                    break;

                default:
                    alert("Unknown role");

            }

        } catch (error) {

            alert(error.message);

        }

    });

}