// src/components/superadmin/AdminFilters.jsx
import { useState } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

const AdminFilters = ({ filters, onFilterChange, onSearch }) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleStatusChange = (e) => {
    onFilterChange({ ...filters, isActive: e.target.value, page: 1 });
  };

  const handleLimitChange = (e) => {
    onFilterChange({ ...filters, limit: parseInt(e.target.value), page: 1 });
  };

  const handleReset = () => {
    setSearchInput('');
    onFilterChange({ page: 1, limit: 10, search: '', isActive: '' });
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-20 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-500 rounded-md text-white text-sm hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1 border border-white/10">
            <FaFilter className="text-gray-500 text-sm" />
            <select
              value={filters.isActive}
              onChange={handleStatusChange}
              className="bg-gray-800 text-white text-sm focus:outline-none rounded-md px-2 py-1"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-1 border border-white/10">
            <span className="text-gray-500 text-sm">Show:</span>
            <select
              value={filters.limit}
              onChange={handleLimitChange}
              className="bg-transparent text-white text-sm focus:outline-none"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          <button
            onClick={handleReset}
            className="px-3 py-1 bg-white/5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {(filters.search || filters.isActive) && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-gray-500">Active filters:</span>
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
              Search: {filters.search}
              <button
                onClick={() => {
                  setSearchInput('');
                  onFilterChange({ ...filters, search: '', page: 1 });
                }}
                className="hover:text-blue-300"
              >
                ×
              </button>
            </span>
          )}
          {filters.isActive && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
              Status: {filters.isActive === 'true' ? 'Active' : 'Inactive'}
              <button
                onClick={() => onFilterChange({ ...filters, isActive: '', page: 1 })}
                className="hover:text-purple-300"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminFilters;