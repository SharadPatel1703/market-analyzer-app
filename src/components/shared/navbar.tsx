"use client";

import React, { useState } from 'react';
// @ts-ignore
import { Menu, BarChart, Users, PieChart } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', icon: BarChart, path: '/dashboard' },
        { name: 'Competitors', icon: Users, path: '/competitors' },
        { name: 'Analysis', icon: PieChart, path: '/analysis' }
    ];

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">
                Market Analyzer
              </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:ml-6 md:flex md:space-x-8">
                            {navItems.map(({ name, icon: Icon, path }) => (
                                <button
                                    key={name}
                                    onClick={() => console.log(`Navigate to ${path}`)}
                                    className="inline-flex items-center px-1 pt-1 text-gray-500 hover:text-gray-700"
                                >
                                    <Icon className="w-5 h-5 mr-2" />
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        {navItems.map(({ name, icon: Icon, path }) => (
                            <button
                                key={name}
                                onClick={() => console.log(`Navigate to ${path}`)}
                                className="flex items-center w-full pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                            >
                                <Icon className="w-5 h-5 mr-2" />
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;