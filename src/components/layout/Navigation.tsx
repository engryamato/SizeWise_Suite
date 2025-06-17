import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

interface NavigationProps {
  items: NavigationItem[];
  className?: string;
}

export function Navigation({ items, className }: NavigationProps) {
  return (
    <nav className={cn('space-y-1', className)}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                isActive
                  ? 'bg-blue-50 text-blue-700 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent',
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md border-l-4',
                'transition-colors duration-150 ease-in-out'
              )
            }
          >
            <Icon
              className={cn(
                'mr-3 h-5 w-5 flex-shrink-0',
                'text-gray-500 group-hover:text-gray-500',
                'transition-colors duration-150 ease-in-out'
              )}
              aria-hidden="true"
            />
            {item.name}
          </NavLink>
        );
      })}
    </nav>
  );
}

interface SecondaryNavigationProps {
  title: string;
  items: {
    name: string;
    href: string;
  }[];
  className?: string;
}

export function SecondaryNavigation({ title, items, className }: SecondaryNavigationProps) {
  return (
    <div className={className}>
      <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
      <nav className="mt-2 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                isActive
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md',
                'transition-colors duration-150 ease-in-out'
              )
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
