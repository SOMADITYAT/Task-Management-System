import React, { useState } from 'react';

const SearchTask = ({ searchTasks }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        searchTasks(e.target.value);
    };

    return (
        <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search tasks by title or description"
            className="border border-gray-300 rounded w-full py-2 px-4 mb-4"
        />
    );
};

export default SearchTask;
