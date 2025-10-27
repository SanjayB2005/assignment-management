import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  BookOpen,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Star,
  Check,
  ChevronRight,
  ArrowRight,
  PlayCircle,
  Download,
  Calendar,
  BarChart3,
  FileText,
  Clock,
  Award,
  Target,
  Lightbulb,
  Rocket
} from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === 'TEACHER' ? '/teacher' : '/student');
    }
  }, [user, navigate]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: 'Smart Assignment Management',
      description: 'Create, distribute, and track assignments with intelligent workflows and automated grading.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Get detailed insights into student performance and engagement with powerful analytics.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Users,
      title: 'Seamless Collaboration',
      description: 'Foster collaboration between teachers and students with real-time communication tools.',
      gradient: 'from-green-500 to-teal-500',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with end-to-end encryption and secure data storage.',
      gradient: 'from-red-500 to-orange-500',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance ensures your workflow never slows down.',
      gradient: 'from-yellow-500 to-amber-500',
    },
    {
      icon: Globe,
      title: 'Global Accessibility',
      description: 'Access from anywhere, anytime with our cloud-based platform.',
      gradient: 'from-indigo-500 to-blue-500',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Active Students', icon: Users },
    { number: '500+', label: 'Educators', icon: BookOpen },
    { number: '50,000+', label: 'Assignments', icon: FileText },
    { number: '99.9%', label: 'Uptime', icon: TrendingUp },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Professor at Stanford University',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
      content: 'AssignmentHub has revolutionized how I manage my courses. The analytics help me understand student performance like never before.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Computer Science Student',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
      content: 'The interface is intuitive and the real-time feedback has improved my learning experience significantly.',
      rating: 5,
    },
    {
      name: 'Prof. Emily Davis',
      role: 'Mathematics Department Head',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
      content: 'Managing assignments for 200+ students was a nightmare. AssignmentHub made it effortless and efficient.',
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: 'Student',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for individual students',
      features: [
        'Unlimited assignment submissions',
        'Basic analytics',
        'Mobile app access',
        'Community support',
      ],
      popular: false,
    },
    {
      name: 'Educator',
      price: '$29',
      period: 'per month',
      description: 'Ideal for teachers and professors',
      features: [
        'Unlimited students',
        'Advanced analytics',
        'Custom grading rubrics',
        'Priority support',
        'Integration tools',
      ],
      popular: true,
    },
    {
      name: 'Institution',
      price: 'Custom',
      period: 'contact us',
      description: 'For schools and universities',
      features: [
        'Multi-department support',
        'Advanced admin controls',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantees',
      ],
      popular: false,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Header />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>

        <motion.div
          style={{ y }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-lg opacity-75 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-3xl">
                    <BookOpen className="h-12 w-12 text-white" />
                  </div>
                </div>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Transform Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
                  Learning Experience
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Revolutionize assignment management with our intelligent platform. 
                Create, collaborate, and analyze with cutting-edge tools designed for modern education.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-glow transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVideoPlaying(true)}
                className="group bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-800 px-8 py-4 rounded-2xl font-semibold text-lg shadow-soft hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <PlayCircle className="h-5 w-5 text-blue-600" />
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-8">
              <p className="text-sm text-gray-500 mb-4">Trusted by leading institutions</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                {['Stanford', 'MIT', 'Harvard', 'Berkeley', 'Yale'].map((uni) => (
                  <div key={uni} className="text-xl font-semibold text-gray-600">
                    {uni}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="absolute top-1/4 right-1/4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl opacity-20 blur-sm"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            y: [0, -20, 0]
          }}
          transition={{ 
            rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="absolute bottom-1/3 left-1/6 w-12 h-12 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full opacity-20 blur-sm"
        />
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center group"
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl group-hover:bg-white/30 transition-all duration-300">
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.5, type: 'spring', stiffness: 200 }}
                    className="text-4xl font-bold mb-2"
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-blue-100">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Powerful Features for
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Modern Education
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the tools that make assignment management effortless and learning more effective.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -10,
                    transition: { type: 'spring', stiffness: 300, damping: 10 }
                  }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-soft group-hover:shadow-xl transition-all duration-500"></div>
                  <div className="relative p-8 space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className={`bg-gradient-to-r ${feature.gradient} p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                      <span>Learn more</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-20"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-display font-bold mb-6">
              What Our Users Say
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join thousands of educators and students who have transformed their learning experience.
            </motion.p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12"
              >
                <div className="flex items-center justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-xl md:text-2xl font-medium text-center mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                
                <div className="flex items-center justify-center space-x-4">
                  <img
                    src={testimonials[currentTestimonial].avatar}
                    alt={testimonials[currentTestimonial].name}
                    className="w-16 h-16 rounded-full border-4 border-white/20"
                  />
                  <div className="text-left">
                    <div className="text-lg font-semibold">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-blue-200">
                      {testimonials[currentTestimonial].role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Navigation */}
            <div className="flex justify-center space-x-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentTestimonial === index
                      ? 'bg-white scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-display font-bold">
              Ready to Get Started?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Join thousands of educators and students already using AssignmentHub to transform their learning experience.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
                >
                  <Rocket className="h-5 w-5" />
                  <span>Start Free Today</span>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsVideoPlaying(false)}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="bg-white rounded-2xl p-6 max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <PlayCircle className="h-16 w-16 text-blue-600 mx-auto" />
                  <p className="text-gray-600">Demo video coming soon!</p>
                  <button
                    onClick={() => setIsVideoPlaying(false)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
