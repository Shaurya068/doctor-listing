import React from 'react';

const DoctorCard = ({ doctor }) => {
    // Helper function to safely render clinic information
    const renderClinicInfo = (clinic) => {
        if (!clinic) return 'Clinic information not available';

        return (
            <div className="clinic-info">
                <p><strong>{clinic.name}</strong></p>
                {clinic.address && (
                    <p>
                        {clinic.address.address_line1 && <span>{clinic.address.address_line1}, </span>}
                        {clinic.address.locality && <span>{clinic.address.locality}, </span>}
                        {clinic.address.city && <span>{clinic.address.city}</span>}
                    </p>
                )}
            </div>
        );
    };

    // Check if doctor object exists and provide default empty object if needed
    const safeDoctor = doctor || {};

    // Safely extract specialties
    const specialtiesText = safeDoctor.specialties && Array.isArray(safeDoctor.specialties)
        ? safeDoctor.specialties.join(', ')
        : 'Specialty not specified';

    // Safely handle languages array
    const languagesText = safeDoctor.languages && Array.isArray(safeDoctor.languages)
        ? safeDoctor.languages.join(', ')
        : 'Not specified';

    return (
        <div className="doctor-card" data-testid="doctor-card">
            <div className="doctor-image">
                <img
                    src={safeDoctor.image || "/logo192.png"}
                    alt={safeDoctor.name || "Doctor"}
                    onError={(e) => {
                        e.target.src = "/logo192.png";
                    }}
                />
            </div>
            <div className="doctor-info">
                <h2 data-testid="doctor-name">{safeDoctor.name || 'Doctor'}</h2>
                <p className="doctor-intro">{safeDoctor.doctor_introduction || 'No introduction available'}</p>

                <p data-testid="doctor-specialty">{specialtiesText}</p>

                <p data-testid="doctor-experience">
                    {safeDoctor.experience || 'Experience not available'}
                </p>

                {renderClinicInfo(safeDoctor.clinic)}

                <div className="languages">
                    Languages: {languagesText}
                </div>
            </div>
            <div className="doctor-fee">
                <p data-testid="doctor-fee">{safeDoctor.fee ? `₹ ${safeDoctor.fee}` : 'Fee not specified'}</p>
                <button className="book-btn">
                    {safeDoctor.consultationType === 'Video Consult' ? 'Video Consult' : 'Book Appointment'}
                </button>
            </div>
        </div>
    );
};

export default DoctorCard;
