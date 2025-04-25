import React from 'react';

const SortOptions = ({ sortBy, onSortChange }) => {
    return (
        <div className="filter-group">
            <h3 data-testid="filter-header-sort">Sort by</h3>
            <div className="sort-options">
                <div className="radio-option">
                    <input
                        type="radio"
                        id="sort-fee"
                        name="sort"
                        checked={sortBy === 'fee'}
                        onChange={() => onSortChange('fee')}
                        data-testid="sort-fee"
                    />
                    <label htmlFor="sort-fee">Price: Low-High</label>
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
    );
};

export default SortOptions;
