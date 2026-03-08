// src/components/admin/ServicemanFilters.jsx
import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import adminCategoryService from '../../services/adminCategoryService';

const ServicemanFilters = ({ filters, onFilterChange, onSearch }) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await adminCategoryService.getAllCategories({ limit: 100 });
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleStatusChange = (e) => {
    onFilterChange({ ...filters, isActive: e.target.value, page: 1 });
  };

  const handleCategoryChange = (e) => {
    onFilterChange({ ...filters, category: e.target.value, page: 1 });
  };

  const handleAvailabilityChange = (e) => {
    onFilterChange({ ...filters, availability: e.target.value, page: 1 });
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
      category: '',
      availability: '',
      isActive: ''
    });
  };

  const activeFiltersCount = [
    filters.category,
    filters.availability,
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
          className="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            showFilters || activeFiltersCount > 0
              ? 'bg-purple-500 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category</label>
              <select
                value={filters.category || ''}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                style={{ color: 'white', backgroundColor: '#1f2937' }}
              >
                <option value="" style={{ color: 'white', backgroundColor: '#1f2937' }}>All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id} style={{ color: 'white', backgroundColor: '#1f2937' }}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Availability</label>
              <select
                value={filters.availability || ''}
                onChange={handleAvailabilityChange}
                className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                style={{ color: 'white', backgroundColor: '#1f2937' }}
              >
                <option value="" style={{ color: 'white', backgroundColor: '#1f2937' }}>All</option>
                <option value="Available" style={{ color: 'white', backgroundColor: '#1f2937' }}>Available</option>
                <option value="Busy" style={{ color: 'white', backgroundColor: '#1f2937' }}>Busy</option>
                <option value="Offline" style={{ color: 'white', backgroundColor: '#1f2937' }}>Offline</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Account Status</label>
              <select
                value={filters.isActive || ''}
                onChange={handleStatusChange}
                className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                style={{ color: 'white', backgroundColor: '#1f2937' }}
              >
                <option value="" style={{ color: 'white', backgroundColor: '#1f2937' }}>All</option>
                <option value="true" style={{ color: 'white', backgroundColor: '#1f2937' }}>Active</option>
                <option value="false" style={{ color: 'white', backgroundColor: '#1f2937' }}>Inactive</option>
              </select>
            </div>

            {/* Limit Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Show</label>
              <select
                value={filters.limit || 10}
                onChange={handleLimitChange}
                className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                style={{ color: 'white', backgroundColor: '#1f2937' }}
              >
                <option value="10" style={{ color: 'white', backgroundColor: '#1f2937' }}>10</option>
                <option value="25" style={{ color: 'white', backgroundColor: '#1f2937' }}>25</option>
                <option value="50" style={{ color: 'white', backgroundColor: '#1f2937' }}>50</option>
                <option value="100" style={{ color: 'white', backgroundColor: '#1f2937' }}>100</option>
              </select>
            </div>
          </div>

          {/* Reset Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
            >
              <FaTimes />
              <span>Reset All Filters</span>
            </button>
          </div>

          {/* Active Filters Tags */}
          {(filters.category || filters.availability || filters.isActive || filters.search) && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-gray-500">Active filters:</span>
              {filters.category && categories.find(c => c._id === filters.category) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                  Category: {categories.find(c => c._id === filters.category)?.name}
                  <button
                    onClick={() => onFilterChange({ ...filters, category: '', page: 1 })}
                    className="hover:text-blue-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.availability && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                  Availability: {filters.availability}
                  <button
                    onClick={() => onFilterChange({ ...filters, availability: '', page: 1 })}
                    className="hover:text-green-300"
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
              {filters.search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                  Search: {filters.search}
                  <button
                    onClick={() => {
                      setSearchInput('');
                      onFilterChange({ ...filters, search: '', page: 1 });
                    }}
                    className="hover:text-yellow-300"
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

export default ServicemanFilters;