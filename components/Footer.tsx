
import React from 'react';
import { Mail, Github, Twitter, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-black text-[#002D72] mb-4">HurdlePlus</h2>
            <p className="text-gray-600 max-w-md mb-6 leading-relaxed">
              The premier destination for word puzzle enthusiasts. Designed with the elegance of Hyatt Place and the competitive spirit of global word challenges. Join thousands of daily players.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-500 hover:text-[#002D72]">
                <Twitter size={20} />
              </a>
              <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-500 hover:text-[#002D72]">
                <Github size={20} />
              </a>
              <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-gray-500 hover:text-[#002D72]">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm font-semibold text-gray-600">
              <li><a href="#" className="hover:text-[#002D72] transition-colors">Daily Puzzle</a></li>
              <li><a href="#" className="hover:text-[#002D72] transition-colors">Leaderboard</a></li>
              <li><a href="#" className="hover:text-[#002D72] transition-colors">Game Rules</a></li>
              <li><a href="#" className="hover:text-[#002D72] transition-colors">About Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Resources</h3>
            <ul className="space-y-4 text-sm font-semibold text-gray-600">
              <li><a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="flex items-center gap-1 hover:text-[#002D72] transition-colors">API Documentation <ExternalLink size={12}/></a></li>
              <li><a href="#" className="hover:text-[#002D72] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[#002D72] transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} HurdlePlus Digital. All rights reserved. Not affiliated with Hyatt Hotels Corporation.
          </p>
          <div className="flex gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
            <span>Clean Architecture</span>
            <span>Real-time Scoring</span>
            <span>Global Database</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
