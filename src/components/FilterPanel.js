import React from 'react';

const FilterPanel = ({
    allSpecialties = [],
    selectedSpecialties = [],
    onSpecialtyChange = () => { },
    consultationType = '',
    onConsultationChange = () => { },
    sortBy = '',
    onSortChange = () => { }
}) => {
    // Handle case when allSpecialties is not an array
    const specialtiesList = Array.isArray(allSpecialties) ? allSpecialties : [];

    // Handle case when selectedSpecialties is not an array
    const selectedSpecialtiesList = Array.isArray(selectedSpecialties) ? selectedSpecialties : [];

    // Helper function to safely check if a specialty is selected
    const isSpecialtySelected = (specialty) => {
        return selectedSpecialtiesList.includes(specialty);
    };

    return (
        <div className="filters-section">
            <h2>Filters</h2>

            {/* Specialties Filter */}
            <div className="filter-group">
                <h3 data-testid="filter-header-speciality">Specialties</h3>
                <div className="specialties-list">
                    {specialtiesList.length > 0 ? (
                        specialtiesList.map((specialty, index) => (
                            <div key={index} className="specialty-item">
                                <input
                                    type="checkbox"
                                    id={`specialty-${specialty}`}
                                    checked={isSpecialtySelected(specialty)}
                                    onChange={() => onSpecialtyChange(specialty)}
                                    data-testid={`filter-specialty-${specialty}`}
                                />
                                <label htmlFor={`specialty-${specialty}`}>{specialty}</label>
                            </div>
                        ))
                    ) : (
                        <p>No specialties available</p>
                    )}
                </div>
            </div>

            {/* Consultation Mode Filter */}
            <div className="filter-group">
                <h3 data-testid="filter-header-moc">Mode of consultation</h3>
                <div className="consultation-options">
                    <div className="radio-option">
                        <input
                            type="radio"
                            id="video-consult"
                            name="consultation"
                            checked={consultationType === 'Video Consult'}
                            onChange={() => onConsultationChange('Video Consult')}
                            data-testid="filter-video-consult"
                        />
                        <label htmlFor="video-consult">Video Consult</label>
                    </div>
                    <div className="radio-option">
                        <input
                            type="radio"
                            id="in-clinic"
                            name="consultation"
                            checked={consultationType === 'In Clinic'}
                            onChange={() => onConsultationChange('In Clinic')}
                            data-testid="filter-in-clinic"
                        />
                        <label htmlFor="in-clinic">In Clinic</label>
                    </div>
                </div>
            </div>

            {/* Sort Filter */}
            <div className="filter-group">
                <h3 data-testid="filter-header-sort">Sort by</h3>
                <div className="sort-options">
                    <div className="radio-option">
                        <input
                            type="radio"
                            id="sort-fees"
                            name="sort"
                            checked={sortBy === 'fees'}
                            onChange={() => onSortChange('fees')}
                            data-testid="sort-fees"
                        />
                        <label htmlFor="sort-fees">Price: Low-High</label>
                    </div>
                    <div className="radio-option">
                        <input
                            type="radio"
                            id="sort-experience"
                            name="sort"
                            checked={sortBy === 'experience'}
                            onChange={() => onSortChange('experience')}
                            data-testid="sort-experience"
                        />
                        <label htmlFor="sort-experience">Experience: Most Experience first</label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;