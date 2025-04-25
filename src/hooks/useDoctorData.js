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

    const allSpecialties = [
        ...new Set(
            doctors.flatMap(doctor =>
                doctor.specialities
                    ? doctor.specialities.map(s => s.name || s)
                    : []
            )
        )
    ].sort();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format: Expected array of doctors');
                }

                const transformedData = data.map(doctor => {
                    let feeNumber = 0;
                    if (doctor.fees) {
                        const feeStr = doctor.fees.replace(/[^\d]/g, '');
                        feeNumber = feeStr ? parseInt(feeStr, 10) : 0;
                    }

                    return {
                        ...doctor,
                        specialities: Array.isArray(doctor.specialities)
                            ? doctor.specialities.map(s => typeof s === 'string' ? { name: s } : s)
                            : [],
                        image: doctor.photo || '',
                        fee: feeNumber
                    };
                });

                setDoctors(transformedData);
                setFilteredDoctors(transformedData);

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

    useEffect(() => {
        if (!searchValue.trim()) {
            setSuggestions([]);
            return;
        }
        const matches = doctors
            .filter(doctor => doctor.name.toLowerCase().includes(searchValue.toLowerCase()))
            .slice(0, 3);
        setSuggestions(matches);
    }, [searchValue, doctors]);

    useEffect(() => {
        if (doctors.length === 0) return;

        setUrlParams({
            search: searchValue,
            consultation: consultationType,
            specialty: selectedSpecialties,
            sort: sortBy
        });

        const filtered = filterDoctors(
            doctors,
            searchValue,
            consultationType,
            selectedSpecialties,
            sortBy
        );

        setFilteredDoctors(filtered);
    }, [doctors, searchValue, consultationType, selectedSpecialties, sortBy]);

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
