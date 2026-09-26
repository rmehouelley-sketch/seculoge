'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Search, Building2, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

export interface FooterProps {
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  const pathname = usePathname();

  const isHiddenPaths = ['/locataire', '/proprietaire', '/gestion'];
  const shouldHide = isHiddenPaths.some((path) => pathname.startsWith(path));

  if (shouldHide) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  const navLinks = [
    { path: '/', label: 'Accueil', icon: <Home className="h-5 w-5" /> },
    { path: '/logements', label: 'Logements', icon: <Search className="h-5 w-5" /> },
    { path: '/comment-ca-marche', label: 'Comment ça marche', icon: null },
    { path: '/a-propos', label: 'À propos', icon: null },
    { path: '/contact', label: 'Contact', icon: null },
  ];

  const ownerLinks = [
    { path: '/proprietaire', label: 'Espace Propriétaire' },
    { path: '/proprietaire/proposer-un-bien', label: 'Proposer un bien' },
  ];

  const tenantLinks = [
    { path: '/locataire', label: 'Espace Locataire' },
    { path: '/locataire/favoris', label: 'Mes favoris' },
  ];

  const companyLinks = [
    { path: '/a-propos', label: 'À propos de SécuLoge' },
    { path: '/comment-ca-marche', label: 'Comment ça marche' },
    { path: '/contact', label: 'Contact' },
    { path: '/faq', label: 'FAQ' },
  ];

  const legalLinks = [
    { path: '/cgv', label: 'Conditions Générales' },
    { path: '/confidentialite', label: 'Politique de Confidentialité' },
    { path: '/mentions-legales', label: 'Mentions Légales' },
  ];

  return (
    <footer
      className={cn(
        'bg-secondary-900 text-secondary-300 mt-16',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">SL</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-white">SécuLoge</span>
                <span className="text-xs text-secondary-400">
                  Votre logement. En toute confiance.
                </span>
              </div>
            </div>
            <p className="text-sm text-secondary-400 mb-4">
              SécuLoge simplifie la recherche et la location de logements au Bénin.
              Nous proposons des logements vérifiés pour votre tranquillité.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 bg-secondary-800 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-secondary-800 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-secondary-800 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Liens rapides</h3>
            <nav className="space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    'flex items-center gap-2 text-sm hover:text-white transition-colors',
                    pathname === link.path && 'text-white'
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Propriétaires */}
          <div>
            <h3 className="font-semibold text-white mb-4">Propriétaires</h3>
            <nav className="space-y-3">
              {ownerLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-sm hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Locataires */}
          <div>
            <h3 className="font-semibold text-white mb-4">Locataires</h3>
            <nav className="space-y-3">
              {tenantLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-sm hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* SécuLoge */}
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-white mb-4">SécuLoge</h3>
            <nav className="space-y-3">
              {companyLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-sm hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Légal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Légal</h3>
            <nav className="space-y-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className="text-sm hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary-800 rounded-lg">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Téléphone</p>
                  <p className="text-sm text-secondary-400">+229 12 34 56 78</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary-800 rounded-lg">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-secondary-400">contact@seculoge.bj</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary-800 rounded-lg">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Adresse</p>
                  <p className="text-sm text-secondary-400">
                    Cotonou, Bénin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-secondary-400">
              © {currentYear} SécuLoge. Tous droits réservés.
            </p>
            <p className="text-sm text-secondary-500">
              Made with ❤️ in Bénin
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';

export { Footer };
