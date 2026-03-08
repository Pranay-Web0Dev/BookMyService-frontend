// src/components/admin/UserFilters.jsx
import { useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { ROLES } from '../../utils/constants';

const UserFilters = ({ filters, onFilterChange, onSearch }) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleStatusChange = (e) => {
    onFilterChange({ ...filters, isActive: e.target.value, page: 1 });
  };

  const handleRoleChange = (e) => {
    onFilterChange({ ...filters, role: e.target.value, page: 1 });
  };

  const handleLimitChange = (e) => {
    onFilterChange({ ...filters, limit: parseInt(e.target.value), page: 1 });
  };

  const handleReset = () => {
    setSearchInput('');
    onFilterChange({
      page: 1,
      limit: 10,
      search: '',
      role: '',
      isActive: ''
    });
  };

  const activeFiltersCount = [
    filters.role,
    filters.isActive,
    filters.search
  ].filter(Boolean).length;

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors font-medium"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium ${
            showFilters || activeFiltersCount > 0
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          <FaFilter />
          <span className="hidden sm:inline">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="px-1.5 py-0.5 bg-white text-purple-600 rounded-full text-xs font-bold">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </form>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex flex-wrap gap-4">
            {/* Role Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-300 mb-1 font-medium">Role</label>
              <select
                value={filters.role || ''}
                onChange={handleRoleChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                style={{ color: 'black' }}
              >
                <option value="" className="text-gray-900">All Roles</option>
                <option value={ROLES.USER} className="text-gray-900">User</option>
                <option value={ROLES.SERVICEMAN} className="text-gray-900">Serviceman</option>
                <option value={ROLES.ADMIN} className="text-gray-900">Admin</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-300 mb-1 font-medium">Status</label>
              <select
                value={filters.isActive || ''}
                onChange={handleStatusChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                style={{ color: 'black' }}
              >
                <option value="" className="text-gray-900">All Status</option>
                <option value="true" className="text-gray-900">Active</option>
                <option value="false" className="text-gray-900">Inactive</option>
              </select>
            </div>

            {/* Limit Filter */}
            <div className="w-32">
              <label className="block text-sm text-gray-300 mb-1 font-medium">Show</label>
              <select
                value={filters.limit || 10}
                onChange={handleLimitChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                style={{ color: 'black' }}
              >
                <option value="10" className="text-gray-900">10</option>
                <option value="25" className="text-gray-900">25</option>
                <option value="50" className="text-gray-900">50</option>
                <option value="100" className="text-gray-900">100</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2 font-medium"
              >
                <FaTimes />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Active Filters Tags */}
          {(filters.role || filters.isActive || filters.search) && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-gray-400">Active filters:</span>
              {filters.role && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                  Role: {filters.role}
                  <button
                    onClick={() => onFilterChange({ ...filters, role: '', page: 1 })}
                    className="hover:text-blue-300 font-bold"
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
                    className="hover:text-purple-300 font-bold"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                  Search: {filters.search}
                  <button
                    onClick={() => {
                      setSearchInput('');
                      onFilterChange({ ...filters, search: '', page: 1 });
                    }}
                    className="hover:text-green-300 font-bold"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserFilters;