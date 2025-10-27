import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Mail, 
  Phone, 
  MapPin,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Heart,
  ExternalLink,
  ArrowUp
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'API', href: '#api' },
      { name: 'Documentation', href: '#docs' },
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Careers', href: '#careers' },
      { name: 'Blog', href: '#blog' },
      { name: 'Press', href: '#press' },
    ],
    support: [
      { name: 'Help Center', href: '#help' },
      { name: 'Contact Us', href: '#contact' },
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
    ],
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: '#', color: 'hover:text-gray-900' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-600' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-500' },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-500/5 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Back to Top Button */}
      <div className="absolute top-0 right-8 transform -translate-y-1/2">
        <motion.button
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-full shadow-glass hover:shadow-glow transition-all duration-300"
        >
          <ArrowUp className="h-5 w-5 text-white" />
        </motion.button>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8"
        >
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur-sm opacity-75"></div>
                  <div className="relative bg-gradient-to-r from-primary-500 to-secondary-500 p-3 rounded-2xl">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                    AssignmentHub
                  </h2>
                  <p className="text-sm text-gray-400">Smart Management</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Revolutionizing assignment management with intelligent tools, 
                seamless collaboration, and powerful analytics for educators and students.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span>hello@assignmenthub.com</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </motion.div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <motion.div key={category} variants={itemVariants}>
                <h3 className="text-lg font-semibold text-white mb-6 capitalize">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.name}
                        </span>
                        <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Newsletter Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-r from-primary-600/20 to-secondary-600/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Stay Updated
                </h3>
                <p className="text-gray-300">
                  Get the latest features, tips, and educational resources delivered to your inbox.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-xl hover:shadow-glow transition-all duration-300"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Bottom Section */}
          <motion.div 
            variants={itemVariants}
            className="border-t border-gray-700 pt-8"
          >
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              {/* Copyright */}
              <div className="flex items-center space-x-2 text-gray-400">
                <span>© 2024 AssignmentHub. Made with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                </motion.div>
                <span>by our team</span>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 bg-white/10 backdrop-blur-sm rounded-xl text-gray-400 ${social.color} transition-all duration-200 hover:bg-white/20`}
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-sm text-gray-400">Assignments</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-gray-400">Support</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Animated Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 animate-gradient-shift bg-[length:200%_200%]"></div>
      </div>
    </footer>
  );
};

export default Footer;
