const API_URL = "http://localhost:8080/api";

// Kusoma user aliyelogin
function getCurrentUser() {
    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    return JSON.parse(user);
}

// ============================================
// LIVESTOCK API
// ============================================

// Kuleta mifugo ya farmer aliyelogin
async function getLivestock() {
    const user = getCurrentUser();

    if (!user) {
        throw new Error("Please login first");
    }

    const response = await fetch(
        `${API_URL}/livestock/owner/${user.id}`
    );

    if (!response.ok) {
        throw new Error("Failed to load livestock");
    }

    return await response.json();
}

// Kuongeza mnyama
async function addLivestock(livestockData) {
    const user = getCurrentUser();

    if (!user) {
        throw new Error("Please login first");
    }

    livestockData.owner_id = user.id;

    const response = await fetch(
        `${API_URL}/livestock`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(livestockData)
        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            errorData.message || "Failed to add livestock"
        );
    }

    return await response.json();
}

// Kufuta mnyama
async function deleteLivestock(id) {
    const response = await fetch(
        `${API_URL}/livestock/${id}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete livestock");
    }

    return await response.text();
}

// Kuleta mnyama mmoja
async function getLivestockById(id) {
    const response = await fetch(
        `${API_URL}/livestock/${id}`
    );

    if (!response.ok) {
        throw new Error("Livestock not found");
    }

    return await response.json();
}

// Kubadilisha taarifa za mnyama
async function updateLivestock(id, livestockData) {
    const response = await fetch(
        `${API_URL}/livestock/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(livestockData)
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update livestock");
    }

    return await response.json();
}

// ============================================
// EMERGENCY API
// ============================================

// Kuleta emergencies za farmer aliyelogin
async function getEmergencies() {

    const user = getCurrentUser();

    if (!user) {
        throw new Error("Please login first");
    }

    const response = await fetch(
        `${API_URL}/emergencies/farmer/${user.id}`
    );

    if (!response.ok) {
        throw new Error("Failed to load emergencies");
    }

    return await response.json();
}

// Kuripoti emergency
async function reportEmergency(emergencyData) {

    const user = getCurrentUser();

    if (!user) {
        throw new Error("Please login first");
    }

    emergencyData.farmer_id = user.id;

    const response = await fetch(
        `${API_URL}/emergencies`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(emergencyData)
        }
    );

    if (!response.ok) {

        let message = "Failed to report emergency";

        try {
            const errorData = await response.json();

            if (errorData.message) {
                message = errorData.message;
            }
        } catch (error) {
            console.error(error);
        }

        throw new Error(message);
    }

    return await response.json();
}

// Kuleta emergency moja
async function getEmergencyById(id) {

    const response = await fetch(
        `${API_URL}/emergencies/${id}`
    );

    if (!response.ok) {
        throw new Error("Emergency not found");
    }

    return await response.json();
}

// ============================================
// DOCTOR EMERGENCY API
// ============================================

// Kuleta emergencies zote kwa doctor
async function getAllEmergencies() {

    const response = await fetch(
        `${API_URL}/emergencies`
    );

    if (!response.ok) {
        throw new Error("Failed to load emergencies");
    }

    return await response.json();
}

// Kubadilisha emergency status
async function updateEmergencyStatus(id, status) {

    const response = await fetch(
        `${API_URL}/emergencies/${id}/status`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                status: status
            })
        }
    );

    if (!response.ok) {

        let message = "Failed to update emergency status";

        try {
            const errorData = await response.json();

            if (errorData.message) {
                message = errorData.message;
            }
        } catch (error) {
            console.error(error);
        }

        throw new Error(message);
    }

    return await response.json();
}

// ============================================
// APPOINTMENT API
// ============================================

// Farmer anaona appointments zake
async function getAppointments() {
    const user = getCurrentUser();

    if (!user) {
        throw new Error("Please login first");
    }

    const response = await fetch(
        `${API_URL}/appointments/farmer/${user.id}`
    );

    if (!response.ok) {
        throw new Error("Failed to load appointments");
    }

    return await response.json();
}


// Farmer anaomba appointment
async function bookAppointment(appointmentData) {
    const user = getCurrentUser();

    if (!user) {
        throw new Error("Please login first");
    }

    appointmentData.farmer_id = user.id;

    const response = await fetch(
        `${API_URL}/appointments`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(appointmentData)
        }
    );

    if (!response.ok) {
        let message = "Failed to book appointment";

        try {
            const errorData = await response.json();

            if (errorData.message) {
                message = errorData.message;
            }
        } catch (error) {
            console.error(error);
        }

        throw new Error(message);
    }

    return await response.json();
}


// Doctor anaona appointments zote
async function getAllAppointments() {
    const response = await fetch(
        `${API_URL}/appointments`
    );

    if (!response.ok) {
        throw new Error("Failed to load appointments");
    }

    return await response.json();
}


// Doctor anabadilisha appointment status
async function updateAppointmentStatus(
    appointmentId,
    doctorId,
    status
) {
    const response = await fetch(
        `${API_URL}/appointments/${appointmentId}/status`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                doctor_id: doctorId,
                status: status
            })
        }
    );

    if (!response.ok) {
        let message = "Failed to update appointment";

        try {
            const errorData = await response.json();

            if (errorData.message) {
                message = errorData.message;
            }
        } catch (error) {
            console.error(error);
        }

        throw new Error(message);
    }

    return await response.json();
}