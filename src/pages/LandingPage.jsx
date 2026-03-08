import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
    FaWrench,
    FaBolt,
    FaSnowflake,
    FaStar,
    FaMapMarkerAlt,
    FaClock,
    FaShieldAlt,
    FaTools,
    FaUserTie,
    FaRocket,
    FaUsers,
    FaCheckCircle,
    FaAward,
    FaHeadset
} from 'react-icons/fa';

const LandingPage = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        const handleMouseMove = (e) => {
            if (!isMobile) {
                setMousePosition({
                    x: (e.clientX / window.innerWidth - 0.5) * 20,
                    y: (e.clientY / window.innerHeight - 0.5) * 20
                });
            }
        };

        if (!isMobile) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isMobile]);

    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
    const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

    return (
        <div
            ref={containerRef}
            className="relative w-screen min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black text-white overflow-x-hidden"
            style={{ perspective: "1200px" }} >
            <div className="fixed inset-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-10 md:opacity-20"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                ></div>
                {/* Floating Orbs - Responsive sizes */}
                <motion.div
                    className="absolute top-10 left-10 md:top-20 md:left-20 w-40 h-40 md:w-72 md:h-72 bg-blue-500 rounded-full filter blur-2xl md:blur-3xl opacity-10 md:opacity-20"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <motion.div
                    className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-56 h-56 md:w-96 md:h-96 bg-purple-500 rounded-full filter blur-2xl md:blur-3xl opacity-10 md:opacity-20"
                    animate={{
                        x: [0, -50, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            {/* Section 1: Hero - Responsive padding and text sizes */}
            {/* Section 1: Hero */}
            <section className="relative min-h-screen w-full flex items-center justify-center px-6 py-16">
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* LEFT SIDE - TEXT */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        className="text-center lg:text-left"
                    >
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                            BookMyService
                        </h1>

                        <p className="text-lg sm:text-xl text-blue-200 mb-6">
                            Your trusted platform to connect with verified professionals
                            for plumbing, electrical, AC repairs and more.
                        </p>

                        <p className="text-sm sm:text-base text-gray-300 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                            Book reliable home services instantly. Compare professionals,
                            read verified reviews, and get expert help delivered to your
                            doorstep — fast, secure, and hassle-free.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-lg font-semibold"
                            >
                                Get Started
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 border-2 border-white rounded-full text-lg font-semibold"
                            >
                                Learn More
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* RIGHT SIDE - 3D ICONS */}
                    <div className="relative flex items-center justify-center">
                        <motion.div
                            animate={!isMobile ? { rotateY: 360 } : {}}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            style={{
                                width: "300px",
                                height: "300px",
                                position: "relative",
                                transformStyle: "preserve-3d"
                            }}
                        >
                            {[FaWrench, FaBolt, FaSnowflake, FaTools].map((Icon, index) => {
                                const angle = index * 90;
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: `
                  rotateY(${angle}deg)
                  translateZ(150px)
                  translate(-50%, -50%)
                `,
                                        }}
                                    >
                                        <Icon className="text-6xl sm:text-7xl text-blue-400 drop-shadow-2xl" />
                                    </div>
                                );
                            })}
                        </motion.div>
                    </div>

                </div>
            </section>

            {/* Section 2: What We Provide - Responsive grid */}
            <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative">
                <div className="max-w-7xl mx-auto w-full">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 px-4"
                    >
                        What We Provide
                    </motion.h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {services.map((service, index) => (
                            <ServiceCard key={index} service={service} index={index} mousePosition={mousePosition} isMobile={isMobile} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: Why Choose Us - Responsive */}
            <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative">
                <div className="max-w-7xl mx-auto w-full">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 px-4"
                    >
                        Why Choose Us
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} feature={feature} index={index} isMobile={isMobile} />
                        ))}
                    </div>

                    {/* Stats Grid - Responsive */}
                    <motion.div
                        className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
                    >
                        {stats.map((stat, index) => (
                            <StatCard key={index} stat={stat} index={index} isMobile={isMobile} />
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Section 4: How It Works - New responsive section */}
            <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative">
                <div className="max-w-7xl mx-auto w-full">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 px-4"
                    >
                        How It Works
                    </motion.h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {steps.map((step, index) => (
                            <StepCard key={index} step={step} index={index} isMobile={isMobile} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 5: Testimonials - Responsive */}
            <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative">
                <div className="max-w-7xl mx-auto w-full">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 px-4"
                    >
                        What Our Users Say
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard key={index} testimonial={testimonial} index={index} isMobile={isMobile} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

// Service Card Component - Responsive
const ServiceCard = ({ service, index, mousePosition, isMobile }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={!isMobile ? {
                scale: 1.05,
                rotateY: mousePosition.x,
                rotateX: mousePosition.y,
            } : {}}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="relative group cursor-pointer"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative bg-white/10 backdrop-blur-lg p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-white/20 overflow-hidden">
                <motion.div
                    animate={hovered && !isMobile ? {
                        boxShadow: [
                            "0 0 15px rgba(59,130,246,0.3)",
                            "0 0 30px rgba(147,51,234,0.3)",
                            "0 0 15px rgba(59,130,246,0.3)"
                        ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                ></motion.div>

                <service.icon className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 text-blue-400" />
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">{service.title}</h3>
                <p className="text-sm sm:text-base text-gray-300">{service.description}</p>

                <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400"
                    initial={{ width: "0%" }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                />
            </div>
        </motion.div>
    );
};

// Feature Card Component - Responsive
const FeatureCard = ({ feature, index, isMobile }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={!isMobile ? { scale: 1.05 } : {}}
            className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-4 sm:p-6 bg-white/5 rounded-xl backdrop-blur-lg border border-white/10"
        >
            <motion.div
                whileHover={!isMobile ? { rotate: 360 } : {}}
                transition={{ duration: 0.6 }}
                className="text-2xl sm:text-3xl lg:text-4xl text-blue-400"
            >
                <feature.icon />
            </motion.div>
            <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-300">{feature.description}</p>
            </div>
        </motion.div>
    );
};

// Stat Card Component - Responsive with counter
const StatCard = ({ stat, index, isMobile }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = stat.value;
            const duration = 2000;
            const increment = end / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [isInView, stat.value]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={!isMobile ? { scale: 1.1 } : {}}
            className="text-center p-3 sm:p-4 lg:p-6 bg-white/5 rounded-lg sm:rounded-xl backdrop-blur-lg border border-white/10"
        >
            <stat.icon className="text-2xl sm:text-3xl lg:text-4xl text-blue-400 mx-auto mb-2 sm:mb-4" />
            <motion.div
                className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1 sm:mb-2"
                key={count}
            >
                {stat.value % 1 !== 0 ? count.toFixed(1) : count}+
            </motion.div>
            <div className="text-xs sm:text-sm text-gray-300">{stat.label}</div>
        </motion.div>
    );
};

// Step Card Component
const StepCard = ({ step, index, isMobile }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative text-center p-4 sm:p-6"
        >
            <motion.div
                whileHover={!isMobile ? { scale: 1.2, rotate: 360 } : {}}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
            >
                <span className="text-xl sm:text-2xl font-bold">{index + 1}</span>
            </motion.div>
            <step.icon className="text-2xl sm:text-3xl lg:text-4xl text-blue-400 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2">{step.title}</h3>
            <p className="text-xs sm:text-sm text-gray-300">{step.description}</p>
        </motion.div>
    );
};

// Testimonial Card Component
const TestimonialCard = ({ testimonial, index, isMobile }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={!isMobile ? { scale: 1.05, rotateY: 5 } : {}}
            className="bg-white/5 backdrop-blur-lg p-4 sm:p-6 rounded-xl border border-white/10"
        >
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
                {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`text-sm sm:text-base ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`} />
                ))}
            </div>
            <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">"{testimonial.comment}"</p>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-xs sm:text-sm font-bold">{testimonial.name[0]}</span>
                </div>
                <div>
                    <h4 className="text-sm sm:text-base font-semibold">{testimonial.name}</h4>
                    <p className="text-xs text-gray-400">{testimonial.role}</p>
                </div>
            </div>
        </motion.div>
    );
};

// Updated data arrays
const services = [
    {
        icon: FaWrench,
        title: "Plumbing Services",
        description: "Expert plumbers for all your repair and installation needs"
    },
    {
        icon: FaBolt,
        title: "Electrical Work",
        description: "Licensed electricians for safe and reliable electrical solutions"
    },
    {
        icon: FaSnowflake,
        title: "AC Repairs",
        description: "Professional AC maintenance and repair services"
    },
    {
        icon: FaTools,
        title: "Home Repairs",
        description: "Comprehensive home maintenance and repair solutions"
    },
    {
        icon: FaUserTie,
        title: "Professional Experts",
        description: "Verified and experienced service professionals"
    },
    {
        icon: FaRocket,
        title: "Quick Service",
        description: "Fast response times and efficient service delivery"
    }
];

const features = [
    {
        icon: FaMapMarkerAlt,
        title: "Location Based Search",
        description: "Find the best service providers near your location instantly"
    },
    {
        icon: FaStar,
        title: "Verified Reviews",
        description: "Authentic ratings and reviews from real customers"
    },
    {
        icon: FaClock,
        title: "24/7 Availability",
        description: "Round-the-clock service booking and support"
    },
    {
        icon: FaShieldAlt,
        title: "Secure & Reliable",
        description: "Your safety and satisfaction are our top priorities"
    }
];

const stats = [
    {
        icon: FaUsers,
        value: 5000,
        label: "Happy Customers"
    },
    {
        icon: FaUserTie,
        value: 1000,
        label: "Expert Professionals"
    },
    {
        icon: FaHeadset,
        value: 24,
        label: "Hour Support"
    },
    {
        icon: FaAward,
        value: 4.8,
        label: "Average Rating"
    }
];

const steps = [
    {
        icon: FaMapMarkerAlt,
        title: "Find Service",
        description: "Search for services near your location"
    },
    {
        icon: FaCheckCircle,
        title: "Book Instantly",
        description: "Select and book your preferred service provider"
    },
    {
        icon: FaTools,
        title: "Get Service",
        description: "Professional arrives and completes the job"
    },
    {
        icon: FaStar,
        title: "Review & Rate",
        description: "Share your experience and rate the service"
    }
];

const testimonials = [
    {
        name: "John Doe",
        role: "Homeowner",
        rating: 5,
        comment: "Amazing service! Found a great plumber within minutes. Highly recommended!"
    },
    {
        name: "Sarah Smith",
        role: "Business Owner",
        rating: 5,
        comment: "Professional and reliable. The electrician was prompt and did excellent work."
    },
    {
        name: "Mike Johnson",
        role: "Regular Customer",
        rating: 4,
        comment: "Great platform with verified professionals. Very satisfied with the service."
    }
];

export default LandingPage;