import { useState, useEffect } from 'react';
import { getUrlParams, setUrlParams } from '../utils/urlParams';
import { filterDoctors } from '../utils/filters';

const useDoctorData = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [consultationType, setConsultationType] = useState('');
    const [selectedSpecialties, setSelectedSpecialties] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    // Get all unique specialties from the doctor data
    const allSpecialties = [
        ...new Set(
            doctors.flatMap(doctor =>
                doctor.specialities
                    ? doctor.specialities.map(s => s.name || s)
                    : []
            )
        )
    ].sort();

    // Fetch doctors data from API
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                // Validate data structure
                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format: Expected array of doctors');
                }

                // Transform data if needed to match your expected structure
                const transformedData = data.map(doctor => {
                    // Parse fees string to numeric fee
                    let feeNumber = 0;
                    if (doctor.fees) {
                        const feeStr = doctor.fees.replace(/[^\d]/g, '');
                        feeNumber = feeStr ? parseInt(feeStr, 10) : 0;
                    }

                    return {
                        ...doctor,
                        // Ensure specialities is always an array of objects with name
                        specialities: Array.isArray(doctor.specialities)
                            ? doctor.specialities.map(s => typeof s === 'string' ? { name: s } : s)
                            : [],
                        // Map photo to image for consistency
                        image: doctor.photo || '',
                        fee: feeNumber
                    };
                });

                setDoctors(transformedData);
                setFilteredDoctors(transformedData);

                // Apply URL query parameters on initial load
                const params = getUrlParams();
                if (params.search) setSearchValue(params.search);
                if (params.consultation) setConsultationType(params.consultation);
                if (params.specialty && params.specialty.length) {
                    setSelectedSpecialties(params.specialty);
                }
                if (params.sort) setSortBy(params.sort);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching doctor data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    // Update suggestions when searchValue or doctors change
    useEffect(() => {
        if (!searchValue.trim()) {
            setSuggestions([]);
            console.log('Suggestions cleared due to empty searchValue');
            return;
        }
        const matches = doctors
            .filter(doctor => doctor.name.toLowerCase().includes(searchValue.toLowerCase()))
            .slice(0, 3);
        setSuggestions(matches);
        console.log('Suggestions updated:', matches);
    }, [searchValue, doctors]);

    // Apply filters when any filter changes
    useEffect(() => {
        if (doctors.length === 0) return;

        // Update URL parameters
        setUrlParams({
            search: searchValue,
            consultation: consultationType,
            specialty: selectedSpecialties,
            sort: sortBy
        });

        // Filter doctors
        const filtered = filterDoctors(
            doctors,
            searchValue,
            consultationType,
            selectedSpecialties,
            sortBy
        );

        setFilteredDoctors(filtered);
    }, [doctors, searchValue, consultationType, selectedSpecialties, sortBy]);

    // Handler functions
    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const handleConsultationChange = (type) => {
        setConsultationType(type === consultationType ? '' : type);
    };

    const handleSpecialtyChange = (specialty) => {
        setSelectedSpecialties(
            selectedSpecialties.includes(specialty)
                ? selectedSpecialties.filter(s => s !== specialty)
                : [...selectedSpecialties, specialty]
        );
    };

    const handleSortChange = (option) => {
        setSortBy(option === sortBy ? '' : option);
    };

    const handleSearchSelect = (name) => {
        setSearchValue(name);
        setSuggestions([]);
    };

    return {
        loading,
        error,
        doctors,
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
    };
};

export default useDoctorData;
