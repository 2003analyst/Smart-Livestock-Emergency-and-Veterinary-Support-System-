// Kusoma user aliyelogin
const user = JSON.parse(localStorage.getItem("user"));

// Kama hajalogin, mrudishe login page
if (!user) {
    window.location.href = "login.html";
}

// Logout function
function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}