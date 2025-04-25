/**
 * Filter and sort doctors based on search term, consultation type, specialties, and sort option
 * @param {Array} doctors - Array of doctor objects
 * @param {String} searchTerm - Search term for doctor names
 * @param {String} consultationType - Type of consultation (Video Consult, In Clinic)
 * @param {Array} specialties - Array of selected specialties
 * @param {String} sortBy - Sort option (fee, experience)
 * @returns {Array} - Filtered and sorted doctors
 */
export const filterDoctors = (doctors, searchTerm, consultationType, specialties, sortBy) => {
    // Safety check for doctors array
    if (!Array.isArray(doctors)) return [];

    let filtered = [...doctors];

    // Apply search filter
    if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim()) {
        filtered = filtered.filter(doctor =>
            doctor && doctor.name && typeof doctor.name === 'string' &&
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Apply consultation type filter
    if (consultationType && typeof consultationType === 'string') {
        if (consultationType === 'Video Consult') {
            filtered = filtered.filter(doctor => doctor && doctor.video_consult === true);
        } else if (consultationType === 'In Clinic') {
            filtered = filtered.filter(doctor => doctor && doctor.in_clinic === true);
        }
    }

    // Apply specialty filters
    if (Array.isArray(specialties) && specialties.length > 0) {
        filtered = filtered.filter(doctor => {
            if (!doctor || !doctor.specialities || !Array.isArray(doctor.specialities)) {
                return false;
            }

            // Check if doctor has at least one of the selected specialties
            return specialties.some(specialty =>
                doctor.specialities.some(spec =>
                    spec && spec.name && spec.name === specialty
                )
            );
        });
    }

    // Apply sorting
    if (sortBy && typeof sortBy === 'string') {
        filtered = sortDoctors(filtered, sortBy);
    }

    return filtered;
};

/**
 * Sort doctors by the given sort option
 * @param {Array} doctors - Array of doctor objects
 * @param {String} sortBy - Sort option (fee, experience)
 * @returns {Array} - Sorted doctors
 */
export const sortDoctors = (doctors, sortBy) => {
    if (!Array.isArray(doctors)) return [];

    const sorted = [...doctors];

    try {
        switch (sortBy) {
            case 'fee':
                sorted.sort((a, b) => {
                    // Extract numeric values from fee strings or fee number property
                    const feeA = a && (a.fee || a.fees) ? parseInt((a.fee || a.fees).toString().replace(/[^\d]/g, '')) : 0;
                    const feeB = b && (b.fee || b.fees) ? parseInt((b.fee || b.fees).toString().replace(/[^\d]/g, '')) : 0;

                    // Handle NaN cases
                    if (isNaN(feeA)) return isNaN(feeB) ? 0 : 1;
                    if (isNaN(feeB)) return -1;

                    return feeA - feeB;
                });
                break;
            case 'experience':
                sorted.sort((a, b) => {
                    // Extract years from experience strings (e.g., "13 Years of experience" -> 13)
                    const expA = a && a.experience ? parseInt(a.experience) : 0;
                    const expB = b && b.experience ? parseInt(b.experience) : 0;

                    // Handle NaN cases
                    if (isNaN(expA)) return isNaN(expB) ? 0 : 1;
                    if (isNaN(expB)) return -1;

                    return expB - expA; // Higher experience first
                });
                break;
            default:
                break;
        }
    } catch (error) {
        console.error("Error sorting doctors:", error);
    }

    return sorted;
};

/**
 * Get unique specialties from doctor data
 * @param {Array} doctors - Array of doctor objects
 * @returns {Array} - Unique specialties
 */
export const getUniqueSpecialties = (doctors) => {
    if (!Array.isArray(doctors)) return [];

    const specialties = new Set();

    doctors.forEach(doctor => {
        if (doctor && doctor.specialities && Array.isArray(doctor.specialities)) {
            doctor.specialities.forEach(specialty => {
                if (specialty && specialty.name) {
                    specialties.add(specialty.name);
                }
            });
        }
    });

    return Array.from(specialties).sort();
};
