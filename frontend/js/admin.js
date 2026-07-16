// ============================================
// ADMIN DASHBOARD - COMPLETE FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadAdminDashboard();
    setupAdminEvents();
});

function setupAdminEvents() {
    document.querySelectorAll('.sidebar-nav a[data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            showAdminSection(section);
        });
    });
}

function showAdminSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const section = document.getElementById(`section-${sectionId}`);
    if (section) section.classList.add('active');
    
    document.querySelectorAll('.sidebar-nav a').forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`.sidebar-nav a[data-section="${sectionId}"]`);
    if (activeLink) activeLink.classList.add('active');
    
    // Refresh data
    if (sectionId === 'users') loadAllUsers();
    if (sectionId === 'livestock') loadAllLivestock();
    if (sectionId === 'emergencies') loadAllEmergencies();
    if (sectionId === 'appointments') loadAllAppointments();
}

async function loadAdminDashboard() {
    try {
        const users = await apiRequest('/users/');
        const livestock = await getLivestock();
        const emergencies = await getEmergencies();
        const appointments = await getAppointments();
        
        document.getElementById('adminTotalUsers').textContent = users.length;
        document.getElementById('adminTotalLivestock').textContent = livestock.length;
        document.getElementById('adminTotalEmergencies').textContent = emergencies.length;
        document.getElementById('adminTotalAppointments').textContent = appointments.length;
        
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
    }
}

async function loadAllUsers() {
    const container = document.getElementById('adminUsersList');
    if (!container) return;
    
    try {
        const users = await apiRequest('/users/');
        
        container.innerHTML = users.map(u => `
            <div class="livestock-card">
                <h4>${u.first_name || ''} ${u.last_name || ''}</h4>
                <p>Email: ${u.email}</p>
                <p>Role: ${u.role}</p>
                <p>Joined: ${new Date(u.created_at).toLocaleDateString()}</p>
                ${u.role !== 'admin' ? `
                    <button onclick="deleteUser(${u.id})" class="btn btn-danger" style="padding: 6px 16px; font-size: 13px; margin-top: 10px;">
                        Delete User
                    </button>
                ` : '<span style="color: #999;">Admin cannot be deleted</span>'}
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
        await apiRequest(`/users/${id}/`, 'DELETE');
        loadAllUsers();
        loadAdminDashboard();
        alert('✅ User deleted successfully');
    } catch (error) {
        alert('Failed to delete user: ' + error.message);
    }
}

async function loadAllLivestock() {
    const container = document.getElementById('adminLivestockList');
    if (!container) return;
    
    try {
        const livestock = await getLivestock();
        
        if (livestock.length === 0) {
            container.innerHTML = '<p style="color: #999;">No livestock registered.</p>';
            return;
        }
        
        container.innerHTML = livestock.map(animal => `
            <div class="livestock-card">
                <h4>${animal.name || animal.animal_type}</h4>
                <p>Type: ${animal.animal_type}</p>
                <p>Age: ${animal.age} years</p>
                <p>Status: ${animal.health_status}</p>
                <p>Owner: ${animal.owner_name || 'Unknown'}</p>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading all livestock:', error);
    }
}

async function loadAllEmergencies() {
    const container = document.getElementById('adminEmergenciesList');
    if (!container) return;
    
    try {
        const emergencies = await getEmergencies();
        
        if (emergencies.length === 0) {
            container.innerHTML = '<p style="color: #999;">No emergencies reported.</p>';
            return;
        }
        
        container.innerHTML = emergencies.map(e => `
            <div class="livestock-card" style="border-left-color: ${e.severity === 'critical' ? '#d32f2f' : '#f57c00'}">
                <h4>🚨 ${e.title}</h4>
                <p><strong>Status:</strong> ${e.status}</p>
                <p><strong>Severity:</strong> ${e.severity}</p>
                <p><strong>Reported:</strong> ${new Date(e.reported_at).toLocaleDateString()}</p>
                <p><strong>Description:</strong> ${e.description.substring(0, 100)}${e.description.length > 100 ? '...' : ''}</p>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading all emergencies:', error);
    }
}

async function loadAllAppointments() {
    const container = document.getElementById('adminAppointmentsList');
    if (!container) return;
    
    try {
        const appointments = await getAppointments();
        
        if (appointments.length === 0) {
            container.innerHTML = '<p style="color: #999;">No appointments scheduled.</p>';
            return;
        }
        
        container.innerHTML = appointments.map(a => `
            <div class="livestock-card">
                <h4>📅 ${a.date} at ${a.time}</h4>
                <p><strong>Farmer:</strong> ${a.farmer_name || 'Unknown'}</p>
                <p><strong>Doctor:</strong> ${a.doctor_name || 'Unknown'}</p>
                <p><strong>Purpose:</strong> ${a.purpose}</p>
                <p><strong>Status:</strong> ${a.status}</p>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading all appointments:', error);
    }
}

// Make functions globally available
window.deleteUser = deleteUser;