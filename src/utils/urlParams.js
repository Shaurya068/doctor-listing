/**
 * Get filter parameters from URL
 * @returns {Object} - Filter parameters from URL
 */
export const getUrlParams = () => {
    try {
        const params = new URLSearchParams(window.location?.search || '');

        return {
            search: params.get('search') || '',
            consultation: params.get('consultation') || '',
            specialty: params.getAll('specialty') || [],
            sort: params.get('sort') || ''
        };
    } catch (error) {
        console.error('Error parsing URL parameters:', error);
        return {
            search: '',
            consultation: '',
            specialty: [],
            sort: ''
        };
    }
};

/**
 * Set filter parameters in URL
 * @param {Object} filterParams - Filter parameters
 */
export const setUrlParams = (filterParams = {}) => {
    try {
        const params = new URLSearchParams();

        if (filterParams.search && typeof filterParams.search === 'string') {
            params.set('search', filterParams.search);
        }

        if (filterParams.consultation && typeof filterParams.consultation === 'string') {
            params.set('consultation', filterParams.consultation);
        }

        if (filterParams.specialty && Array.isArray(filterParams.specialty)) {
            filterParams.specialty.forEach(specialty => {
                if (specialty && typeof specialty === 'string') {
                    params.append('specialty', specialty);
                }
            });
        }

        if (filterParams.sort && typeof filterParams.sort === 'string') {
            params.set('sort', filterParams.sort);
        }

        const paramString = params.toString();
        const newUrl = `${window.location.pathname}${paramString ? '?' + paramString : ''}`;

        // Only update history if we're in a browser environment
        if (typeof window !== 'undefined' && window.history && window.history.pushState) {
            window.history.pushState({ path: newUrl }, '', newUrl);
        }
    } catch (error) {
        console.error('Error setting URL parameters:', error);
    }
};

/**
 * Clear all URL parameters
 */
export const clearUrlParams = () => {
    try {
        // Only update history if we're in a browser environment
        if (typeof window !== 'undefined' && window.history && window.history.pushState) {
            window.history.pushState({}, '', window.location.pathname);
        }
    } catch (error) {
        console.error('Error clearing URL parameters:', error);
    }
};