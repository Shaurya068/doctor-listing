import React from 'react';

const SearchBar = ({
    searchValue,
    suggestions = [],
    onSearchChange = () => { },
    onSearchSelect = () => { }
}) => {

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearchSelect(searchValue);
        }
    };

    return (
        <div className="search-container" style={{ position: 'relative' }}>
            <input
                type="text"
                placeholder="Search Symptoms, Doctors, Specialists, Clinics"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyPress={handleKeyPress}
                data-testid="autocomplete-input"
                className="search-input"
            />
            {suggestions.length > 0 && (
                <div className="suggestions" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #ccc', zIndex: 10 }}>
                    {suggestions.map((doctor, index) => (
                        <div
                            key={doctor?.id || index}
                            className="suggestion-item"
                            data-testid="suggestion-item"
                            onClick={() => onSearchSelect(doctor?.name || '')}
                            style={{ cursor: 'pointer', padding: '5px 10px' }}
                        >
                            {doctor?.name || 'Unknown Doctor'}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
