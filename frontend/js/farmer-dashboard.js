// ============================================
// FARMER DASHBOARD - COMPLETE FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Load all data
    loadLivestock();
    loadEmergencies();
    loadAppointments();
    loadChatMessages();
    updateStats();
    populateEmergencyDropdown();
    
    // Setup event listeners
    setupEventListeners();
});

// ============================================
// SETUP EVENT LISTENERS
// ============================================

function setupEventListeners() {
    document.querySelectorAll(
        ".sidebar-nav a[data-section]"
    ).forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            const section = this.dataset.section;

            showSection(section);
        });
    });

    const livestockForm =
        document.getElementById("livestockForm");

    if (livestockForm) {
        livestockForm.addEventListener(
            "submit",
            handleAddLivestock
        );
    }

    const emergencyForm =
        document.getElementById("emergencyForm");

    if (emergencyForm) {
        emergencyForm.addEventListener(
            "submit",
            handleReportEmergency
        );
    }

    const appointmentForm =
        document.getElementById("appointmentForm");

    if (appointmentForm) {
        appointmentForm.addEventListener(
            "submit",
            handleBookAppointment
        );
    }
}

// ============================================
// SHOW SECTION
// ============================================

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => {
        s.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(`section-${sectionId}`);
    if (section) {
        section.classList.add('active');
    }
    
    // Update active nav link
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Find and activate the clicked link
    const activeLink = document.querySelector(`.sidebar-nav a[data-section="${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Refresh data when switching sections
    if (sectionId === 'livestock') {
        loadLivestock();
    }
    if (sectionId === 'emergencies-history') {
        loadEmergencies();
    }
    if (sectionId === 'appointments') {
        loadAppointments();
    }
    if (sectionId === 'chat') {
        loadChatMessages();
    }
}

// ============================================
// STATS
// ============================================

async function updateStats() {
    try {
        const livestock = await getLivestock();
        const emergencies = await getEmergencies();
        const appointments = await getAppointments();
        
        const totalLivestock = livestock.length;
        const activeEmergencies = emergencies.filter(e => e.status !== 'resolved' && e.status !== 'closed').length;
        const resolvedEmergencies = emergencies.filter(e => e.status === 'resolved').length;
        const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
        
        document.getElementById('totalLivestock').textContent = totalLivestock;
        document.getElementById('activeEmergencies').textContent = activeEmergencies;
        document.getElementById('pendingAppointments').textContent = pendingAppointments;
        document.getElementById('resolvedEmergencies').textContent = resolvedEmergencies;
        
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// ============================================
// LIVESTOCK MANAGEMENT
// ============================================

async function loadLivestock() {
    const container = document.getElementById('livestockList');
    if (!container) return;
    
    try {
        const livestock = await getLivestock();
        
        if (livestock.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>🐄 No livestock registered yet.</p>
                    <a href="#" onclick="showSection('add-livestock')" class="btn btn-primary">Add Your First Animal</a>
                </div>
            `;
            return;
        }
        
        container.innerHTML = livestock.map(animal => `
            <div class="livestock-card">
                <h4>${animal.name || animal.animal_type}</h4>
                <p class="type">${animal.animal_type} ${animal.breed ? '- ' + animal.breed : ''}</p>
                <p>Age: ${animal.age} years</p>
                <p>Weight: ${animal.weight || 'N/A'} kg</p>
                <p>
                    Status: 
                    <span class="status-badge ${animal.health_status === 'Healthy' ? 'healthy' : animal.health_status === 'Sick' ? 'sick' : 'treatment'}">
                        ${animal.health_status}
                    </span>
                </p>
                <button onclick="deleteLivestockItem(${animal.id})" class="btn btn-danger" style="padding: 6px 16px; font-size: 13px; margin-top: 10px;">
                    Remove
                </button>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading livestock:', error);
    }
}

async function handleAddLivestock(e) {
    e.preventDefault();
    
    const errorEl = document.getElementById('livestockFormError');
    
    const animalType = document.getElementById('animalType').value;
    const breed = document.getElementById('breed').value.trim();
    const name = document.getElementById('animalName').value.trim();
    const age = document.getElementById('age').value;
    const weight = document.getElementById('weight').value;
    const healthStatus = document.getElementById('healthStatus').value;
    
    if (!animalType || !age) {
        errorEl.textContent = 'Please fill in all required fields';
        errorEl.style.display = 'block';
        return;
    }
    
    try {
        errorEl.style.display = 'none';
        
        const livestockData = {
            animal_type: animalType,
            breed: breed,
            name: name || animalType,
            age: parseInt(age),
            weight: weight ? parseFloat(weight) : null,
            health_status: healthStatus
        };
        
        await addLivestock(livestockData);
        
        alert('✅ Livestock registered successfully!');
        document.getElementById('livestockForm').reset();
        loadLivestock();
        updateStats();
        
    } catch (error) {
        errorEl.textContent = error.message || 'Failed to add livestock';
        errorEl.style.display = 'block';
    }
}

async function deleteLivestockItem(id) {
    if (!confirm('Are you sure you want to remove this animal?')) return;
    
    try {
        await deleteLivestock(id);
        loadLivestock();
        updateStats();
        alert('✅ Animal removed successfully');
    } catch (error) {
        alert('Error removing animal: ' + error.message);
    }
}

// ============================================
// EMERGENCY MANAGEMENT
// ============================================

async function populateEmergencyDropdown() {
    const dropdown = document.getElementById('emergencyLivestock');
    if (!dropdown) return;
    
    try {
        const livestock = await getLivestock();
        
        dropdown.innerHTML = '<option value="">Select an animal</option>' + 
            livestock.map(animal => 
                `<option value="${animal.id}">${animal.name || animal.animal_type} (${animal.animal_type})</option>`
            ).join('');
            
    } catch (error) {
        console.error('Error populating dropdown:', error);
    }
}

async function handleReportEmergency(e) {
    e.preventDefault();
    
    const errorEl = document.getElementById('emergencyFormError');
    
    const livestockId = document.getElementById('emergencyLivestock').value;
    const title = document.getElementById('emergencyTitle').value.trim();
    const description = document.getElementById('emergencyDescription').value.trim();
    const severity = document.getElementById('severity').value;
    const location = document.getElementById('emergencyLocation').value.trim();
    
    if (!livestockId || !title || !description || !severity) {
        errorEl.textContent = 'Please fill in all required fields';
        errorEl.style.display = 'block';
        return;
    }
    
    try {
        errorEl.style.display = 'none';
        
        const emergencyData = {
            livestock_id: parseInt(livestockId),
            title: title,
            description: description,
            severity: severity,
            location: location || 'Not specified'
        };
        
        await reportEmergency(emergencyData);
        
        alert('🚨 Emergency reported! Veterinary doctors have been notified.');
        document.getElementById('emergencyForm').reset();
        populateEmergencyDropdown();
        loadEmergencies();
        updateStats();
        
    } catch (error) {
        errorEl.textContent = error.message || 'Failed to report emergency';
        errorEl.style.display = 'block';
    }
}

async function loadEmergencies() {
    const container = document.getElementById('emergencyHistoryList');
    if (!container) return;
    
    try {
        const emergencies = await getEmergencies();
        
        if (emergencies.length === 0) {
            container.innerHTML = '<p style="color: #999;">No emergencies reported yet.</p>';
            return;
        }
        
        container.innerHTML = emergencies.map(e => `
            <div class="livestock-card" style="border-left-color: ${e.severity === 'critical' ? '#d32f2f' : e.severity === 'high' ? '#f57c00' : '#f9a825'}">
                <h4>${e.title}</h4>
                <p><strong>Status:</strong> <span style="color: ${e.status === 'resolved' ? '#2e7d32' : '#f57c00'}">${e.status}</span></p>
                <p><strong>Severity:</strong> ${e.severity}</p>
                <p><strong>Reported:</strong> ${new Date(e.reported_at).toLocaleDateString()}</p>
                <p><strong>Description:</strong> ${e.description.substring(0, 100)}${e.description.length > 100 ? '...' : ''}</p>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading emergencies:', error);
    }
}

// ============================================
// CHAT MESSAGES
// ============================================

async function loadChatMessages() {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    
    try {
        const messages = await getMessages();
        const user = getCurrentUser();
        
        if (messages.length === 0) {
            container.innerHTML = '<p style="color: #999; text-align: center;">No messages yet. Start a conversation!</p>';
            return;
        }
        
        container.innerHTML = messages.map(msg => `
            <div class="chat-message ${msg.sender === user.id ? 'sent' : 'received'}">
                <div class="sender">${msg.sender === user.id ? 'You' : msg.sender_name || 'Doctor'}</div>
                ${msg.content}
                <span class="time">${new Date(msg.created_at).toLocaleTimeString()}</span>
            </div>
        `).join('');
        
        container.scrollTop = container.scrollHeight;
        
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    try {
        const user = getCurrentUser();
        // Find a doctor to send to
        // In real system, you'd select a specific doctor
        
       await sendChatMessage({
        receiver_id: 2,
        content: message
    });
        
        input.value = '';
        loadChatMessages();
        
    } catch (error) {
        alert('Failed to send message: ' + error.message);
    }
}

// ============================================
// APPOINTMENTS
// ============================================

async function loadAppointments() {
    const container = document.getElementById('appointmentsList');
    if (!container) return;
    
    try {
        const appointments = await getAppointments();
        
        if (appointments.length === 0) {
            container.innerHTML = '<p style="color: #999;">No appointments yet.</p>';
            return;
        }
        
        container.innerHTML = appointments.map(a => `
            <div class="livestock-card">
                <h4>📅 ${a.date} at ${a.time}</h4>
                <p><strong>Doctor:</strong> ${a.doctor_name || 'Pending'}</p>
                <p><strong>Purpose:</strong> ${a.purpose}</p>
                <p><strong>Status:</strong> <span style="color: ${a.status === 'pending' ? '#f57c00' : a.status === 'confirmed' ? '#2e7d32' : '#d32f2f'}">${a.status}</span></p>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

// ============================================
// APPOINTMENTS
// ============================================

function showAppointmentForm() {
    const container = document.getElementById(
        "appointmentFormContainer"
    );

    if (container) {
        container.style.display = "block";
    }

    populateAppointmentLivestock();
}


function hideAppointmentForm() {
    const container = document.getElementById(
        "appointmentFormContainer"
    );

    if (container) {
        container.style.display = "none";
    }
}


async function populateAppointmentLivestock() {
    const dropdown = document.getElementById(
        "appointmentLivestock"
    );

    if (!dropdown) {
        return;
    }

    try {
        const livestock = await getLivestock();

        dropdown.innerHTML = `
            <option value="">
                Select an animal
            </option>
        `;

        dropdown.innerHTML += livestock.map(animal => `
            <option value="${animal.id}">
                ${animal.name || animal.animal_type}
                (${animal.animal_type})
            </option>
        `).join("");

    } catch (error) {
        console.error(
            "Failed to load livestock:",
            error
        );
    }
}


async function handleBookAppointment(event) {
    event.preventDefault();

    const errorElement = document.getElementById(
        "appointmentFormError"
    );

    const livestockId = document.getElementById(
        "appointmentLivestock"
    ).value;

    const date = document.getElementById(
        "appointmentDate"
    ).value;

    const time = document.getElementById(
        "appointmentTime"
    ).value;

    const purpose = document.getElementById(
        "appointmentPurpose"
    ).value.trim();

    if (!livestockId || !date || !time || !purpose) {
        errorElement.textContent =
            "Please fill in all appointment fields";

        errorElement.style.display = "block";

        return;
    }

    try {
        errorElement.style.display = "none";

        const appointmentData = {
            livestock_id: parseInt(livestockId),
            date: date,
            time: time,
            purpose: purpose
        };

        await bookAppointment(appointmentData);

        alert("Appointment booked successfully!");

        document.getElementById(
            "appointmentForm"
        ).reset();

        hideAppointmentForm();

        await loadAppointments();
        await updateStats();

    } catch (error) {
        errorElement.textContent =
            error.message ||
            "Failed to book appointment";

        errorElement.style.display = "block";
    }
}


async function loadAppointments() {
    const container = document.getElementById(
        "appointmentsList"
    );

    if (!container) {
        return;
    }

    try {
        container.innerHTML =
            "<p>Loading appointments...</p>";

        const appointments = await getAppointments();

        if (appointments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No appointments booked yet.</p>
                </div>
            `;

            return;
        }

        container.innerHTML = appointments.map(
            appointment => `
                <div class="livestock-card">

                    <h3>
                        📅 ${formatAppointmentDate(
                            appointment.date
                        )}
                    </h3>

                    <p>
                        <strong>Time:</strong>
                        ${appointment.time}
                    </p>

                    <p>
                        <strong>Purpose:</strong>
                        ${appointment.purpose}
                    </p>

                    <p>
                        <strong>Livestock ID:</strong>
                        ${appointment.livestock_id || "N/A"}
                    </p>

                    <p>
                        <strong>Doctor:</strong>
                        ${
                            appointment.doctor_name ||
                            "Waiting for doctor"
                        }
                    </p>

                    <p>
                        <strong>Status:</strong>

                        <span class="status-badge ${
                            getAppointmentStatusClass(
                                appointment.status
                            )
                        }">
                            ${formatAppointmentStatus(
                                appointment.status
                            )}
                        </span>
                    </p>

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


function formatAppointmentStatus(status) {
    if (!status) {
        return "Unknown";
    }

    return status
        .replaceAll("_", " ")
        .replace(/\b\w/g, letter =>
            letter.toUpperCase()
        );
}


function getAppointmentStatusClass(status) {
    switch (status) {
        case "confirmed":
            return "healthy";

        case "rejected":
            return "sick";

        case "completed":
            return "healthy";

        default:
            return "treatment";
    }
}


function formatAppointmentDate(date) {
    if (!date) {
        return "Date not available";
    }

    return new Date(
        `${date}T00:00:00`
    ).toLocaleDateString();
}

// Make functions globally available
window.showSection = showSection;
window.sendMessage = sendMessage;
window.showBookAppointment = showBookAppointment;
window.deleteLivestockItem = deleteLivestockItem;
window.showAppointmentForm = showAppointmentForm;
window.hideAppointmentForm = hideAppointmentForm;