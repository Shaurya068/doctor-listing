import React from 'react';
import './App.css';
import SortOptions from './components/SortOptions';
import DoctorCard from './components/DoctorCard';
import useDoctorData from './hooks/useDoctorData';
import SearchBar from './components/SearchBar';

function App() {
  const {
    loading,
    error,
    filteredDoctors,
    searchValue,
    consultationType,
    selectedSpecialties,
    sortBy,
    allSpecialties,
    suggestions,
    handleSearch,
    handleConsultationChange,
    handleSpecialtyChange,
    handleSortChange,
    handleSearchSelect
  } = useDoctorData();

  return (
    <div className="app">
      <header className="header">
        <SearchBar
          searchValue={searchValue}
          suggestions={suggestions}
          onSearchChange={handleSearch}
          onSearchSelect={handleSearchSelect}
        />
      </header>

      <div className="content">
        <div className="filters-column">
          <div className="filters-section">
            <h2>Filters</h2>

            <div className="filter-group">
              <h3 data-testid="filter-header-speciality">Specialties</h3>
              <div className="specialties-list">
                {allSpecialties.map((specialty, index) => (
                  <div key={index} className="specialty-item">
                    <input
                      type="checkbox"
                      id={`specialty-${specialty}`}
                      checked={selectedSpecialties.includes(specialty)}
                      onChange={() => handleSpecialtyChange(specialty)}
                      data-testid={`filter-specialty-${specialty}`}
                    />
                    <label htmlFor={`specialty-${specialty}`}>{specialty}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3 data-testid="filter-header-moc">Mode of consultation</h3>
              <div className="consultation-options">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="video-consult"
                    name="consultation"
                    checked={consultationType === 'Video Consult'}
                    onChange={() => handleConsultationChange('Video Consult')}
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
                    onChange={() => handleConsultationChange('In Clinic')}
                    data-testid="filter-in-clinic"
                  />
                  <label htmlFor="in-clinic">In Clinic</label>
                </div>
              </div>
            </div>

            <SortOptions sortBy={sortBy} onSortChange={handleSortChange} />
          </div>
        </div>

        <div className="doctors-column">
          {loading && <div>Loading doctors...</div>}
          {error && <div>Error: {error}</div>}
          {!loading && !error && filteredDoctors.length === 0 && (
            <div className="no-results">No doctors found matching your criteria.</div>
          )}
          {!loading && !error && filteredDoctors.map((doctor, index) => (
            <DoctorCard key={index} doctor={doctor} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
