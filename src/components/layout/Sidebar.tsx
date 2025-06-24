import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wind, Flame, Zap, Wrench } from 'lucide-react';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Duct Sizer', href: '/tools/duct-sizer', icon: Wind },
  { name: 'Grease Sizer', href: '/tools/grease-sizer', icon: Flame, disabled: true },
  { name: 'Boiler Vent', href: '/tools/boiler-vent', icon: Zap, disabled: true },
  { name: 'Engine Exhaust', href: '/tools/engine-exhaust', icon: Wrench, disabled: true },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navigation.map(item => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                {
                  'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300':
                    isActive,
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700':
                    !isActive && !item.disabled,
                  'text-gray-400 dark:text-gray-600 cursor-not-allowed': item.disabled,
                }
              )}
              onClick={e => item.disabled && e.preventDefault()}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
              {item.disabled && (
                <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                  Soon
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
