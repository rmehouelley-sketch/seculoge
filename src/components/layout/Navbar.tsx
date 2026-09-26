'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, getInitials } from '@/lib/utils';
import { Menu, X, User, Home, Search, Heart, Building2, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export interface NavbarProps {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatarUrl?: string | null;
  } | null;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onLogoutClick?: () => void;
  notificationsCount?: number;
}

const Navbar = ({
  user,
  onLoginClick,
  onRegisterClick,
  onLogoutClick,
  notificationsCount = 0,
}: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const getNavLinkClass = (path: string) => {
    return cn(
      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
      pathname === path
        ? 'bg-primary-100 text-primary-700'
        : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900'
    );
  };

  const getRoleBasedLinks = () => {
    const commonLinks = [
      { path: '/', label: 'Accueil', icon: <Home className="h-5 w-5" /> },
      { path: '/logements', label: 'Logements', icon: <Search className="h-5 w-5" /> },
      { path: '/comment-ca-marche', label: 'Comment ça marche', icon: null },
      { path: '/a-propos', label: 'À propos', icon: null },
      { path: '/contact', label: 'Contact', icon: null },
    ];

    const roleLinks: Record<string, { path: string; label: string; icon: React.ReactNode }[]> = {
      TENANT: [
        { path: '/locataire', label: 'Mon espace', icon: <User className="h-5 w-5" /> },
        { path: '/locataire/favoris', label: 'Favoris', icon: <Heart className="h-5 w-5" /> },
      ],
      OWNER: [
        { path: '/proprietaire', label: 'Mon espace', icon: <Building2 className="h-5 w-5" /> },
        { path: '/proprietaire/proposer-un-bien', label: 'Proposer un bien', icon: null },
      ],
      AGENT: [
        { path: '/gestion', label: 'Gestion', icon: <LayoutDashboard className="h-5 w-5" /> },
      ],
      ADMIN: [
        { path: '/gestion', label: 'Gestion', icon: <LayoutDashboard className="h-5 w-5" /> },
      ],
    };

    return [...commonLinks, ...(user ? roleLinks[user.role] || [] : [])];
  };

  const navLinks = getRoleBasedLinks();

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-card py-3'
            : 'bg-transparent py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">SL</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-secondary-900">SécuLoge</span>
                <span className="text-xs text-secondary-500 -mt-1">
                  Votre logement. En toute confiance.
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={getNavLinkClass(link.path)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Button variant="ghost" size="sm" className="relative">
                    <User className="h-5 w-5" />
                    Notifications
                    {notificationsCount > 0 && (
                      <Badge
                        variant="danger"
                        className="absolute -top-1 -right-1 text-xs px-1.5 py-0.5"
                      >
                        {notificationsCount}
                      </Badge>
                    )}
                  </Button>
                  <div className="flex items-center gap-2">
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt=""
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">
                          {getInitials(user.firstName, user.lastName)}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col text-right">
                      <span className="text-sm font-medium text-secondary-900">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-xs text-secondary-500 capitalize">
                        {user.role.toLowerCase()}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={onLogoutClick}>
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={onLoginClick}>
                    Connexion
                  </Button>
                  <Button size="sm" onClick={onRegisterClick}>
                    Inscription
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-secondary-200">
              <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SL</span>
                </div>
                <span className="font-bold text-secondary-900">SécuLoge</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto">
              <nav className="p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-700 transition-colors',
                      pathname === link.path
                        ? 'bg-primary-100 text-primary-700'
                        : 'hover:bg-secondary-100'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Auth Section */}
            <div className="p-4 border-t border-secondary-200">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {getInitials(user.firstName, user.lastName)}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-secondary-900">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-xs text-secondary-500 capitalize">
                        {user.role.toLowerCase()}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" onClick={onLogoutClick}>
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" fullWidth onClick={onLoginClick}>
                    Connexion
                  </Button>
                  <Button fullWidth onClick={onRegisterClick}>
                    Inscription
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};

Navbar.displayName = 'Navbar';

export { Navbar };
