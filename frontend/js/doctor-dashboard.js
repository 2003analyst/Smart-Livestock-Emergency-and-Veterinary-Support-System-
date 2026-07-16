document.addEventListener(
    "DOMContentLoaded",
    function () {
        protectDoctorPage();
        showDoctorName();
        setupDoctorNavigation();
        loadDoctorEmergencies();
        updateDoctorStats();
        updateDoctorAppointmentStats();
    }
);

// ============================================
// PROTECT DOCTOR DASHBOARD
// ============================================
function formatDateOnly(dateValue) {
    if (!dateValue) {
        return "Not available";
    }

    return new Date(
        `${dateValue}T00:00:00`
    ).toLocaleDateString();
}


function protectDoctorPage() {
    const user = getCurrentUser();

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    if (user.role !== "DOCTOR") {
        alert("Access denied. Doctor only.");
        window.location.href = "login.html";
    }
}


// ============================================
// SHOW DOCTOR NAME
// ============================================

function showDoctorName() {
    const user = getCurrentUser();
    const doctorName = document.getElementById("doctorName");

    if (doctorName && user) {
        doctorName.textContent = user.fullName;
    }
}


// ============================================
// SIDEBAR NAVIGATION
// ============================================

function setupDoctorNavigation() {
    const navLinks = document.querySelectorAll(
        ".sidebar-nav a[data-section]"
    );

    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            const sectionName = this.dataset.section;

            showDoctorSection(sectionName);
        });
    });
}


function showDoctorSection(sectionName) {
    // Ficha sections zote
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    // Ondoa active kwenye navigation zote
    document.querySelectorAll(
        ".sidebar-nav a[data-section]"
    ).forEach(link => {
        link.classList.remove("active");
    });

    // Onyesha section iliyochaguliwa
    const selectedSection = document.getElementById(
        `section-${sectionName}`
    );

    if (selectedSection) {
        selectedSection.classList.add("active");
    }

    // Weka active kwenye link iliyochaguliwa
    const selectedLink = document.querySelector(
        `.sidebar-nav a[data-section="${sectionName}"]`
    );

    if (selectedLink) {
        selectedLink.classList.add("active");
    }

    // Refresh data kulingana na section
    if (sectionName === "emergencies") {
        loadDoctorEmergencies();
    }

    if (sectionName === "appointments") {
        loadDoctorAppointments();
    }

    if (sectionName === "chat") {
        loadDoctorMessages();
    }

    if (sectionName === "dashboard") {
        updateDoctorStats();
    }
}


// ============================================
// LOAD EMERGENCIES
// ============================================

async function loadDoctorEmergencies() {
    const container = document.getElementById(
        "doctorEmergencyList"
    );

    if (!container) {
        return;
    }

    try {
        container.innerHTML = "<p>Loading emergencies...</p>";

        const emergencies = await getAllEmergencies();

        if (!Array.isArray(emergencies)) {
            throw new Error("Invalid emergency data received");
        }

        if (emergencies.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No emergencies reported.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = emergencies.map(emergency => `
            <div class="livestock-card">

                <h3>${emergency.title}</h3>

                <p>
                    <strong>Emergency ID:</strong>
                    ${emergency.id}
                </p>

                <p>
                    <strong>Livestock ID:</strong>
                    ${emergency.livestock_id}
                </p>

                <p>
                    <strong>Farmer ID:</strong>
                    ${emergency.farmer_id}
                </p>

                <p>
                    <strong>Description:</strong>
                    ${emergency.description}
                </p>

                <p>
                    <strong>Severity:</strong>
                    <span class="status-badge">
                        ${formatStatus(emergency.severity)}
                    </span>
                </p>

                <p>
                    <strong>Location:</strong>
                    ${emergency.location || "Not specified"}
                </p>

                <p>
                    <strong>Status:</strong>
                    <span class="status-badge">
                        ${formatStatus(emergency.status)}
                    </span>
                </p>

                <p>
                    <strong>Reported:</strong>
                    ${formatDate(emergency.reported_at)}
                </p>

                <div style="margin-top: 15px;">

                    <button
                        class="btn btn-primary"
                        onclick="changeEmergencyStatus(
                            ${emergency.id},
                            'in_progress'
                        )"
                        ${emergency.status === "resolved" ? "disabled" : ""}
                    >
                        Start Treatment
                    </button>

                    <button
                        class="btn btn-success"
                        onclick="changeEmergencyStatus(
                            ${emergency.id},
                            'resolved'
                        )"
                        ${emergency.status === "resolved" ? "disabled" : ""}
                    >
                        Mark Resolved
                    </button>

                </div>

            </div>
        `).join("");

    } catch (error) {
        console.error("Loading emergencies failed:", error);

        container.innerHTML = `
            <p class="error-message">
                ${error.message}
            </p>
        `;
    }
}


// ============================================
// CHANGE EMERGENCY STATUS
// ============================================

async function changeEmergencyStatus(
    emergencyId,
    newStatus
) {
    const confirmation = confirm(
        `Change emergency status to ${formatStatus(newStatus)}?`
    );

    if (!confirmation) {
        return;
    }

    try {
        const updatedEmergency = await updateEmergencyStatus(
            emergencyId,
            newStatus
        );

        console.log("Updated emergency:", updatedEmergency);

        alert("Emergency status updated successfully");

        await loadDoctorEmergencies();
        await updateDoctorStats();

    } catch (error) {
        console.error("Status update failed:", error);

        alert(
            error.message ||
            "Failed to update emergency status"
        );
    }
}


async function changeAppointmentStatus(
    appointmentId,
    newStatus
) {
    const doctor = getCurrentUser();

    if (!doctor) {
        alert("Please login first");
        return;
    }

    const confirmation = confirm(
        `Change appointment status to ${formatStatus(
            newStatus
        )}?`
    );

    if (!confirmation) {
        return;
    }

    try {
        await updateAppointmentStatus(
            appointmentId,
            doctor.id,
            newStatus
        );

        alert(
            "Appointment status updated successfully"
        );

        
        await loadDoctorAppointments();
        await updateDoctorAppointmentStats();


    } catch (error) {
        console.error(error);

        alert(
            error.message ||
            "Failed to update appointment"
        );
    }
}



// ============================================
// DOCTOR DASHBOARD STATS
// ============================================

async function updateDoctorStats() {
    try {
        const emergencies = await getAllEmergencies();

        const pendingCount = emergencies.filter(
            emergency =>
                emergency.status === "pending" ||
                emergency.status === "in_progress"
        ).length;

        const resolvedCount = emergencies.filter(
            emergency =>
                emergency.status === "resolved"
        ).length;

        const pendingElement = document.getElementById(
            "pendingEmergencies"
        );

        const resolvedElement = document.getElementById(
            "resolvedCases"
        );

        if (pendingElement) {
            pendingElement.textContent = pendingCount;
        }

        if (resolvedElement) {
            resolvedElement.textContent = resolvedCount;
        }

    } catch (error) {
        console.error("Failed to update doctor stats:", error);
    }
}


// ============================================
// APPOINTMENTS
// ============================================
async function loadDoctorAppointments() {
    const container = document.getElementById(
        "doctorAppointmentsList"
    );

    if (!container) {
        return;
    }

    try {
        container.innerHTML =
            "<p>Loading appointments...</p>";

        const appointments = await getAllAppointments();

        if (appointments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No appointment requests.</p>
                </div>
            `;

            return;
        }

        container.innerHTML = appointments.map(
            appointment => `
                <div class="livestock-card">

                    <h3>
                        📅 ${formatDateOnly(
                            appointment.date
                        )}
                    </h3>

                    <p>
                        <strong>Appointment ID:</strong>
                        ${appointment.id}
                    </p>

                    <p>
                        <strong>Farmer ID:</strong>
                        ${appointment.farmer_id}
                    </p>

                    <p>
                        <strong>Livestock ID:</strong>
                        ${
                            appointment.livestock_id ||
                            "Not specified"
                        }
                    </p>

                    <p>
                        <strong>Time:</strong>
                        ${appointment.time}
                    </p>

                    <p>
                        <strong>Purpose:</strong>
                        ${appointment.purpose}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${formatStatus(
                            appointment.status
                        )}
                    </p>

                    <p>
                        <strong>Doctor:</strong>
                        ${
                            appointment.doctor_name ||
                            "Not assigned"
                        }
                    </p>

                    <div style="margin-top: 15px;">

                        <button
                            class="btn btn-success"
                            onclick="
                                changeAppointmentStatus(
                                    ${appointment.id},
                                    'confirmed'
                                )
                            "
                            ${
                                appointment.status ===
                                "completed"
                                    ? "disabled"
                                    : ""
                            }
                        >
                            Confirm
                        </button>

                        <button
                            class="btn btn-danger"
                            onclick="
                                changeAppointmentStatus(
                                    ${appointment.id},
                                    'rejected'
                                )
                            "
                            ${
                                appointment.status ===
                                "completed"
                                    ? "disabled"
                                    : ""
                            }
                        >
                            Reject
                        </button>

                        <button
                            class="btn btn-primary"
                            onclick="
                                changeAppointmentStatus(
                                    ${appointment.id},
                                    'completed'
                                )
                            "
                            ${
                                appointment.status !==
                                "confirmed"
                                    ? "disabled"
                                    : ""
                            }
                        >
                            Mark Completed
                        </button>

                    </div>

                </div>
            `
        ).join("");

    } catch (error) {
        console.error(
            "Failed to load appointments:",
            error
        );

        container.innerHTML = `
            <p class="error-message">
                ${error.message}
            </p>
        `;
    }
}


// ============================================
// CHAT
// ============================================

async function loadDoctorMessages() {
    const container = document.getElementById(
        "chatMessages"
    );

    if (!container) {
        return;
    }

    container.innerHTML = `
        <p style="text-align: center; color: #777;">
            Chat module will be connected next.
        </p>
    `;
}


function sendDoctorMessage() {
    const input = document.getElementById("chatInput");

    if (!input) {
        return;
    }

    const message = input.value.trim();

    if (!message) {
        alert("Please type a message");
        return;
    }

    alert("Chat backend will be connected next.");

    input.value = "";
}


// ============================================
// HELPER FUNCTIONS
// ============================================

function formatStatus(status) {
    if (!status) {
        return "Unknown";
    }

    return status
        .replaceAll("_", " ")
        .replace(/\b\w/g, letter =>
            letter.toUpperCase()
        );
}


function formatDate(dateValue) {
    if (!dateValue) {
        return "Not available";
    }

    return new Date(dateValue).toLocaleString();
}

async function updateDoctorAppointmentStats() {
    try {
        const appointments =
            await getAllAppointments();

        const today =
            new Date().toISOString().split("T")[0];

        const todayCount = appointments.filter(
            appointment =>
                appointment.date === today &&
                appointment.status !== "rejected"
        ).length;

        const todayElement =
            document.getElementById(
                "todayAppointments"
            );

        if (todayElement) {
            todayElement.textContent = todayCount;
        }

    } catch (error) {
        console.error(
            "Failed to update appointment stats:",
            error
        );
    }
}

// ============================================
// GLOBAL FUNCTIONS
// ============================================

window.showDoctorSection = showDoctorSection;
window.loadDoctorEmergencies = loadDoctorEmergencies;
window.changeEmergencyStatus = changeEmergencyStatus;
window.sendDoctorMessage = sendDoctorMessage;
window.changeAppointmentStatus =
    changeAppointmentStatus;