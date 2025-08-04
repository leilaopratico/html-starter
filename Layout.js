import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Building, Car, Calculator, CreditCard, Settings, Menu, X } from 'lucide-react';

export default function Layout({ children, currentPageName }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Início', href: createPageUrl('Home'), icon: Building },
    { name: 'Buscar Imóveis', href: createPageUrl('Busca'), icon: Building },
    { name: 'Veículos', href: createPageUrl('Veiculos'), icon: Car },
    { name: 'Calculadora', href: createPageUrl('Calculadora'), icon: Calculator },
    { name: 'Planos', href: createPageUrl('Planos'), icon: CreditCard },
    { name: 'Admin', href: createPageUrl('Admin'), icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LP</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Leilão Prático</h1>
                <p className="text-xs text-blue-600 font-semibold">Sua Vantagem Inteligente</p>
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.slice(1, -1).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                    currentPageName === item.name.replace(' ', '') ? 'text-blue-600' : ''
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
              <Link to={createPageUrl('Planos')}>
                <Button className="bg-blue-600 hover:bg-blue-700">Ver Planos</Button>
              </Link>
              <Link to={createPageUrl('Admin')}>
                <Button variant="outline" size="sm"><Settings className="w-4 h-4 mr-2" />Admin</Button>
              </Link>
            </nav>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-2">
                {navigation.slice(1).map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors ${
                      currentPageName === item.name.replace(' ', '') ? 'text-blue-600' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
