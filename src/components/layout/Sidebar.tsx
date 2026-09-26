'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, getInitials } from '@/lib/utils';
import { Home, Building2, Heart, Calendar, FileText, BarChart3, Users, Settings, LogOut, ChevronLeft, User, Key, MessageSquare, Bell, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Image from 'next/image';

export interface SidebarProps {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatarUrl?: string | null;
  } | null;
  onLogout?: () => void;
  notificationsCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar = ({
  user,
  onLogout,
  notificationsCount = 0,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) => {
  const pathname = usePathname();

  const tenantNav = [
    { path: '/locataire', label: 'Tableau de bord', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/locataire/favoris', label: 'Mes favoris', icon: <Heart className="h-5 w-5" /> },
    { path: '/locements/demandes', label: 'Mes demandes', icon: <FileText className="h-5 w-5" /> },
    { path: '/locataire/visites', label: 'Mes visites', icon: <Calendar className="h-5 w-5" /> },
    { path: '/locataire/dossier', label: 'Mon dossier', icon: <User className="h-5 w-5" /> },
    { path: '/locataire/profil', label: 'Mon profil', icon: <Settings className="h-5 w-5" /> },
  ];

  const ownerNav = [
    { path: '/proprietaire', label: 'Tableau de bord', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/proprietaire/mes-biens', label: 'Mes biens', icon: <Building2 className="h-5 w-5" /> },
    { path: '/proprietaire/publies', label: 'Biens publiés', icon: <FileText className="h-5 w-5" /> },
    { path: '/proprietaire/loues', label: 'Biens loués', icon: <Calendar className="h-5 w-5" /> },
    { path: '/proprietaire/visites', label: 'Visites', icon: <Calendar className="h-5 w-5" /> },
    { path: '/proprietaire/revenus', label: 'Revenus', icon: <BarChart3 className="h-5 w-5" /> },
    { path: '/proprietaire/proposer-un-bien', label: 'Proposer un bien', icon: <Building2 className="h-5 w-5" /> },
    { path: '/proprietaire/profil', label: 'Mon profil', icon: <Settings className="h-5 w-5" /> },
  ];

  const adminNav = [
    { path: '/gestion', label: 'Tableau de bord', icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: '/gestion/logements', label: 'Logements', icon: <Building2 className="h-5 w-5" /> },
    { path: '/gestion/proprietaires', label: 'Propriétaires', icon: <Users className="h-5 w-5" /> },
    { path: '/gestion/locataires', label: 'Locataires', icon: <Users className="h-5 w-5" /> },
    { path: '/gestion/visites', label: 'Visites', icon: <Calendar className="h-5 w-5" /> },
    { path: '/gestion/locations', label: 'Locations', icon: <FileText className="h-5 w-5" /> },
    { path: '/gestion/paiements', label: 'Paiements', icon: <Key className="h-5 w-5" /> },
    { path: '/gestion/statistiques', label: 'Statistiques', icon: <BarChart3 className="h-5 w-5" /> },
    { path: '/gestion/notifications', label: 'Notifications', icon: <Bell className="h-5 w-5" /> },
    { path: '/gestion/messages', label: 'Messages', icon: <MessageSquare className="h-5 w-5" /> },
    { path: '/gestion/parametres', label: 'Paramètres', icon: <Settings className="h-5 w-5" /> },
  ];

  const getNavItems = () => {
    if (!user) return [];
    switch (user.role) {
      case 'TENANT':
        return tenantNav;
      case 'OWNER':
        return ownerNav;
      case 'AGENT':
      case 'ADMIN':
        return adminNav;
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const linkClass = (path: string) => {
    return cn(
      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
      pathname === path || pathname.startsWith(`${path}/`)
        ? 'bg-primary-100 text-primary-700'
        : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
    );
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 bg-white border-r border-secondary-200 z-40 transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-secondary-200">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">SL</span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-secondary-900">SécuLoge</span>
                <span className="text-xs text-secondary-500">
                  Gestion
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={cn(
                    linkClass(item.path),
                    isCollapsed && 'justify-center px-2'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  {item.icon}
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        {user && (
          <div className="p-4 border-t border-secondary-200">
            <div className="flex items-center gap-3 mb-4">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt=""
                  width={40}
                  height={40}
                  className={cn('rounded-full', isCollapsed && 'mx-auto')}
                />
              ) : (
                <div
                  className={cn(
                    'w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center',
                    isCollapsed && 'mx-auto'
                  )}
                >
                  <span className="text-primary-600 font-medium">
                    {getInitials(user.firstName, user.lastName)}
                  </span>
                </div>
              )}
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-secondary-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-secondary-500 capitalize">
                    {user.role.toLowerCase()}
                  </p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  className="mb-2"
                  leftIcon={<Bell className="h-4 w-4" />}
                >
                  Notifications
                  {notificationsCount > 0 && (
                    <Badge
                      variant="danger"
                      className="ml-2 text-xs px-1.5 py-0.5"
                    >
                      {notificationsCount}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={onLogout}
                  leftIcon={<LogOut className="h-4 w-4" />}
                >
                  Déconnexion
                </Button>
              </>
            )}
          </div>
        )}

        {/* Collapse Toggle */}
        {onToggleCollapse && (
          <div className={cn('p-2 border-t border-secondary-200', isCollapsed ? 'text-center' : 'text-right')}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className={cn('p-1.5', isCollapsed && 'w-full justify-center')}
              aria-label={isCollapsed ? 'Étendre la barre latérale' : 'Réduire la barre latérale'}
            >
              <ChevronLeft
                className={cn(
                  'h-5 w-5 transition-transform duration-300',
                  isCollapsed && 'rotate-180'
                )}
              />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};

Sidebar.displayName = 'Sidebar';

export { Sidebar };
