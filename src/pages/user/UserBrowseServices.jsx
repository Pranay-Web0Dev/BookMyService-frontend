// src/pages/user/UserBrowseServices.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ServiceCard from "../../components/user/ServiceCard";
import ServicemanCard from "../../components/user/ServicemanCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import userService from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

import {
  FaMapMarkerAlt,
  FaFilter,
  FaLocationArrow
} from "react-icons/fa";

const UserBrowseServices = () => {

  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [servicemen, setServicemen] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [searchRadius, setSearchRadius] = useState(10000);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating");

  /*
  ============================
  FETCH CATEGORIES
  ============================
  */

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await userService.getAllCategories();
      setCategories(response?.data || []);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  /*
  ============================
  SET LOCATION FROM PROFILE
  ============================
  */

  useEffect(() => {

    if (user?.location?.coordinates) {

      setUserLocation({
        lat: user.location.coordinates[1],
        lng: user.location.coordinates[0],
      });

    }

  }, [user]);

  /*
  ============================
  FETCH NEARBY SERVICEMEN
  ============================
  */

  useEffect(() => {

    if (userLocation) {
      fetchNearbyServicemen();
    }

  }, [userLocation, selectedCategory, searchRadius, sortBy]);

  const fetchNearbyServicemen = async () => {

    if (!userLocation) return;

    try {

      setLoading(true);

      const response = await userService.getNearbyServicemen(
        userLocation.lat,
        userLocation.lng,
        selectedCategory,
        searchRadius,
        sortBy
      );

      const servicemenList =
        response?.data || response || [];

      setServicemen(Array.isArray(servicemenList) ? servicemenList : []);

    } catch (error) {

      console.error("Fetch servicemen error:", error);
      toast.error("Failed to fetch nearby servicemen");
      setServicemen([]);

    } finally {

      setLoading(false);

    }

  };

  /*
  ============================
  GET CURRENT LOCATION
  ============================
  */

  const getCurrentLocation = () => {

    setGettingLocation(true);

    if (!navigator.geolocation) {

      toast.error("Geolocation not supported");
      setGettingLocation(false);
      return;

    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });

        setGettingLocation(false);
        toast.success("Location updated");

      },

      () => {

        toast.error("Failed to get location");
        setGettingLocation(false);

      }

    );

  };

  /*
  ============================
  ACTIONS
  ============================
  */

  const handleBookService = (serviceman) => {

    navigate("/user/book-service", {
      state: { serviceman }
    });

  };

  const handleViewProfile = (serviceman) => {

    const id = serviceman?.user?._id || serviceman?.userId;

    if (!id) return;

    navigate(`/user/serviceman/${id}`);

  };

  /*
  ============================
  UI
  ============================
  */

  return (
    <DashboardLayout>

      {/* Header */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Find Services Near You
        </h1>

        <p className="text-gray-400 text-sm mt-1">
          Browse and book trusted professionals in your area
        </p>
      </div>

      {/* Location Bar */}

      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 mb-6">

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

          <div className="flex-1 flex items-center gap-3">

            <FaMapMarkerAlt className="text-blue-400" />

            {userLocation ? (

              <p className="text-white text-sm">
                Location set: {userLocation.lat.toFixed(4)},{" "}
                {userLocation.lng.toFixed(4)}
              </p>

            ) : (

              <p className="text-gray-400 text-sm">
                No location detected
              </p>

            )}

          </div>

          <button
            onClick={getCurrentLocation}
            disabled={gettingLocation}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >

            <FaLocationArrow />

            {gettingLocation
              ? "Getting Location..."
              : "Use My Location"}

          </button>

        </div>

      </div>

      {/* Categories */}

      <div className="mb-8">

        <h2 className="text-lg font-semibold text-white mb-4">
          Browse by Category
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">

          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-xl border cursor-pointer ${
              selectedCategory === ""
                ? "bg-blue-500 border-blue-500"
                : "bg-white/5 border-white/10"
            }`}
            onClick={() => setSelectedCategory("")}
          >

            <p className="text-white text-center text-sm font-medium">
              All Services
            </p>

          </motion.div>

          {categories.map((category) => (

            <ServiceCard
              key={category._id}
              category={category}
              isSelected={selectedCategory === category._id}
              onSelect={() => setSelectedCategory(category._id)}
            />

          ))}

        </div>

      </div>

      {/* Filters */}

      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 rounded-lg mb-4"
      >

        <FaFilter />

        {showFilters ? "Hide Filters" : "Show Filters"}

      </button>

      {showFilters && (

        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="block text-sm text-gray-400 mb-1">
                Search Radius
              </label>

              <select
                value={searchRadius}
                onChange={(e) =>
                  setSearchRadius(parseInt(e.target.value))
                }
                className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg text-white"
              >

                <option value="5000">Within 5 km</option>
                <option value="10000">Within 10 km</option>
                <option value="20000">Within 20 km</option>
                <option value="50000">Within 50 km</option>

              </select>

            </div>

            <div>

              <label className="block text-sm text-gray-400 mb-1">
                Sort By
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-gray-600 rounded-lg text-white"
              >

                <option value="rating">Highest Rated</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="experience">Most Experienced</option>

              </select>

            </div>

          </div>

        </div>

      )}

      {/* Results */}

      {loading ? (

        <LoadingSpinner />

      ) : (

        <>

          <div className="mb-4">

            <p className="text-gray-400">
              Found {servicemen.length} available servicemen
            </p>

          </div>

          {servicemen.length === 0 ? (

            <div className="text-center py-12">
              <p className="text-gray-400">
                No servicemen found in your area
              </p>
            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {servicemen.map((serviceman) => (

                <ServicemanCard
                  key={serviceman._id}
                  serviceman={serviceman}
                  onBook={() => handleBookService(serviceman)}
                  onViewProfile={() =>
                    handleViewProfile(serviceman)
                  }
                />

              ))}

            </div>

          )}

        </>

      )}

    </DashboardLayout>
  );

};

export default UserBrowseServices;