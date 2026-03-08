// src/pages/serviceman/ServiceManAvailability.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import servicemanService from '../../services/servicemanService';
import toast from 'react-hot-toast';
import {
  FaClock,
  FaMapMarkerAlt,
  FaLocationArrow,
  FaSave,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

const ServiceManAvailability = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [profile, setProfile] = useState(null);
  const [availability, setAvailability] = useState({
    status: 'Offline',
    autoAccept: false,
    workingHours: {
      monday: { enabled: true, start: '09:00', end: '18:00' },
      tuesday: { enabled: true, start: '09:00', end: '18:00' },
      wednesday: { enabled: true, start: '09:00', end: '18:00' },
      thursday: { enabled: true, start: '09:00', end: '18:00' },
      friday: { enabled: true, start: '09:00', end: '18:00' },
      saturday: { enabled: false, start: '10:00', end: '16:00' },
      sunday: { enabled: false, start: '10:00', end: '16:00' }
    }
  });
  const [location, setLocation] = useState({
    lat: '',
    lng: '',
    address: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await servicemanService.getProfile();
      setProfile(response.data.profile);
      setAvailability({
        ...availability,
        status: response.data.profile?.availabilityStatus || 'Offline'
      });
      
      // Set location if exists
      if (response.data.user?.location?.coordinates) {
        setLocation({
          lat: response.data.user.location.coordinates[1],
          lng: response.data.user.location.coordinates[0],
          address: response.data.user.address || ''
        });
      }
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (e) => {
    setAvailability({ ...availability, status: e.target.value });
  };

  const handleDayToggle = (day) => {
    setAvailability({
      ...availability,
      workingHours: {
        ...availability.workingHours,
        [day]: {
          ...availability.workingHours[day],
          enabled: !availability.workingHours[day].enabled
        }
      }
    });
  };

  const handleTimeChange = (day, type, value) => {
    setAvailability({
      ...availability,
      workingHours: {
        ...availability.workingHours,
        [day]: {
          ...availability.workingHours[day],
          [type]: value
        }
      }
    });
  };

  const getCurrentLocation = () => {
    setGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setLocation({
          ...location,
          lat: coords.lat,
          lng: coords.lng
        });

        // Reverse geocoding to get address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
          );
          const data = await response.json();
          setLocation(prev => ({ ...prev, address: data.display_name }));
        } catch (error) {
          console.error('Failed to get address:', error);
        }

        setGettingLocation(false);
        toast.success('Location updated');
      },
      (error) => {
        toast.error('Failed to get location');
        setGettingLocation(false);
      }
    );
  };

  const handleSaveAvailability = async () => {
    setSaving(true);
    try {
      // Update availability status
      await servicemanService.updateProfile({
        availabilityStatus: availability.status
      });
      
      // Update location if changed
      if (location.lat && location.lng) {
        await servicemanService.updateLocation([location.lng, location.lat]);
      }
      
      toast.success('Availability settings saved');
    } catch (error) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Availability Settings</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your availability and working hours
          </p>
        </div>

        {/* Availability Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaClock className="text-blue-400" />
            Current Status
          </h2>

          <div className="flex items-center gap-4">
            <select
              value={availability.status}
              onChange={handleStatusChange}
              className="px-4 py-3 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Offline">Offline</option>
            </select>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              availability.status === 'Available' ? 'bg-green-500/20 text-green-400' :
              availability.status === 'Busy' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {availability.status === 'Available' && <FaCheckCircle />}
              {availability.status === 'Busy' && <FaClock />}
              {availability.status === 'Offline' && <FaTimesCircle />}
              <span className="font-medium">{availability.status}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-3">
            {availability.status === 'Available' && 'You will receive new booking requests'}
            {availability.status === 'Busy' && 'You are currently busy with existing jobs'}
            {availability.status === 'Offline' && 'You will not receive any booking requests'}
          </p>
        </motion.div>

        {/* Location Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-400" />
            Service Location
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button
                onClick={getCurrentLocation}
                disabled={gettingLocation}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <FaLocationArrow className={gettingLocation ? 'animate-spin' : ''} />
                <span>{gettingLocation ? 'Getting Location...' : 'Update Current Location'}</span>
              </button>
            </div>

            {location.lat && location.lng && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Latitude</label>
                  <input
                    type="text"
                    value={location.lat}
                    readOnly
                    className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Longitude</label>
                  <input
                    type="text"
                    value={location.lng}
                    readOnly
                    className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg text-gray-400"
                  />
                </div>
              </div>
            )}

            {location.address && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Address</label>
                <textarea
                  value={location.address}
                  readOnly
                  rows="2"
                  className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg text-gray-400"
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Working Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Working Hours</h2>

          <div className="space-y-4">
            {Object.entries(availability.workingHours).map(([day, hours]) => (
              <div key={day} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                <div className="w-24">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={hours.enabled}
                      onChange={() => handleDayToggle(day)}
                      className="w-4 h-4 bg-white/5 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white capitalize">{day.slice(0, 3)}</span>
                  </label>
                </div>

                {hours.enabled ? (
                  <>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={hours.start}
                        onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                        className="px-3 py-1 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="time"
                        value={hours.end}
                        onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                        className="px-3 py-1 bg-white/5 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                  </>
                ) : (
                  <span className="text-gray-500 text-sm">Not working</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Auto Accept Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">Auto-accept Bookings</h3>
              <p className="text-sm text-gray-400 mt-1">
                Automatically accept new booking requests when available
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={availability.autoAccept}
                onChange={(e) => setAvailability({ ...availability, autoAccept: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end"
        >
          <button
            onClick={handleSaveAvailability}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50"
          >
            <FaSave />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ServiceManAvailability;