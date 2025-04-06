import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Section from '@/components/Section';
import ScrollReveal from '@/components/ScrollReveal';
import GuitarAnimation from '@/components/GuitarAnimation';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Music, 
  Globe, 
  CheckCircle2, 
  Guitar, 
  QrCode,
  ArrowDown,
  Activity,
  Brain,
  Target
} from "lucide-react";

const Index = () => {
  const arSteps = [
    {
      icon: Globe,
      title: "Open ARiff Website",
      description: "Access our web application on any device with a camera"
    },
    {
      icon: QrCode,
      title: "Interact with Vitrual guitar",
      description: "See 3D finger positions and follow along with the interactive lesson"
    },
    {
      icon: Guitar,
      title: "Get real-time fringer postions tracking experience",
      description: "have us track yoUr finger positions and get instant feedback"
    },
    {
      icon: Music,
      title: "Get personalized feedback with AI",
      description: "Practice with our AI system that analyzes your playing and provides tailored tips"
    }
  ];

  return (
    <div className="min-h-screen relative">
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-3 px-6 md:px-10",
        "bg-gray-900/70 header-blur border-b border-orange-900/30 shadow-lg shadow-orange-500/5"
      )}>
        <NavBar />
      </header>
      
      {/* Hero Section */}
      <GuitarAnimation />

      {/* AI Feedback Section */}
      <Section className="bg-black py-20 relative overflow-hidden" id="ai-feedback">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/10 to-transparent opacity-30" />
        <div className="absolute inset-0 bg-[url('/neural-pattern.svg')] opacity-5" />
        
        <ScrollReveal>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-orange-900/20 text-orange-400 text-sm font-medium tracking-wide mb-4 border border-orange-500/20">
              Virtual LEARNING
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
              Master Guitar with interative virtual Experiences 
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Experience personalized learning with our advanced AI system and virtual experiences that adapts to your playing style
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-orange-500/20 hover:border-orange-500/40 transition-all shadow-xl hover:shadow-orange-500/5"
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-900/20 flex items-center justify-center mb-6 transform -rotate-6">
                <Activity className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Real-time Analysis</h3>
              <p className="text-gray-300 text-base leading-relaxed">
                Get instant feedback on your playing technique with our AI system
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-gray-400">
                  <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                  <span>Virtual analyis </span>
                </li>
                <li className="flex items-center text-gray-400">
                  <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                  <span>Finger position analysis</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                  <span>AI feedback</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-orange-500/20 hover:border-orange-500/40 transition-all shadow-xl hover:shadow-orange-500/5"
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-900/20 flex items-center justify-center mb-6 transform -rotate-6">
                <Brain className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Personalized Tips</h3>
              <p className="text-gray-300 text-base leading-relaxed">
                Receive custom suggestions tailored to your skill level and learning pace
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-gray-400">
                  <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                  <span>Adaptive learning</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                  <span>Practice suggestions</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                  <span>Technique improvement</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-orange-500/20 hover:border-orange-500/40 transition-all shadow-xl hover:shadow-orange-500/5"
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-900/20 flex items-center justify-center mb-6 transform -rotate-6">
                <Target className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white"></h3>
              <p className="text-gray-300 text-base leading-relaxed">
                Monitor your improvement with real time analytics.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center text-gray-400">
                  <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                  <span>Skill analytics</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                  <span>Progress milestones</span>
                </li>
                <li className="flex items-center text-gray-400">
                  <CheckCircle2 className="h-5 w-5 text-orange-500 mr-2" />
                  <span>Performance history</span>
                </li>
              </ul>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <Link 
              to="/signup" 
              className="inline-flex items-center px-8 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium transition-all hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl hover:shadow-orange-500/20"
            >
              Start Learning Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </ScrollReveal>
      </Section>

      {/* How AR Works Section */}
      <Section className="bg-black py-24" id="how-it-works">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-orange-900/20 text-orange-400 text-xs font-medium tracking-wide mb-4">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Learning Guitar with real-time analyis 
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our innovative virtual technology makes learning guitar intuitive and immersive
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {arSteps.map((step, index) => (
              <div 
                key={index} 
                className="bg-gray-900 rounded-xl p-6 border border-orange-900/20 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-4",
                  "bg-orange-900/20 text-orange-400 group-hover:bg-orange-900/30 transition-colors"
                )}>
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{step.title}</h3>
                <p className="text-gray-300 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </Section>

      {/* About Us Section */}
      <Section className="bg-black py-24" id="about">
        <ScrollReveal>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-orange-900/20 text-orange-400 text-xs font-medium tracking-wide mb-4">
                ABOUT US
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                We're Reimagining Music Education
              </h2>
              <p className="text-gray-300 mb-6">
                ARiff was born from a simple question: Why is learning guitar so difficult? 
                Our team of musicians, developers, and educators came together to create an 
                innovative solution that makes learning guitar more intuitive and engaging than ever before.
              </p>
              <p className="text-gray-300 mb-6">
                Using cutting-edge real time virtual analysis technology, we've developed a platform that 
                visualizes guitar techniques in 3D space, guiding you through each lesson with 
                unprecedented clarity and precision.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-orange-900/20 flex items-center justify-center text-orange-400 text-xs font-medium">JS</div>
                  <div className="w-10 h-10 rounded-full bg-orange-900/30 flex items-center justify-center text-white text-xs font-medium">AR</div>
                  <div className="w-10 h-10 rounded-full bg-orange-900/40 flex items-center justify-center text-white text-xs font-medium">TL</div>
                  <div className="w-10 h-10 rounded-full bg-orange-900/50 flex items-center justify-center text-white text-xs font-medium">MK</div>
                </div>
                <p className="text-sm text-gray-400">Our passionate team of experts</p>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-8 relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                <Music className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Our Mission</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-300">Make guitar learning accessible to everyone</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-300">Combine technology and education in innovative ways</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-300">Create a global community of guitar enthusiasts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-300">Support both beginners and advanced players</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-300">Continuously improve with user feedback</span>
                </li>
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </Section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-orange-500">ARiff</h3>
              <p className="text-gray-400 text-sm">
                Revolutionizing guitar learning through virtual real-time interaction technology.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase text-orange-500 mb-4">Explore</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Home</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Features</Link></li>
               {/* <li><Link to="/" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Pricing</Link></li>*/}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase text-orange-500 mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Tutorials</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Support</Link></li>
                <li><Link to="/" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase text-orange-500 mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="text-gray-300 text-sm">hello@ariff.com</li>
                <li className="text-gray-300 text-sm">+1 (555) 123-4567</li>
              </ul>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-orange-900/20 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} ARiff. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
