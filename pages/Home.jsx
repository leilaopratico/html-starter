import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Building, Car, Calculator, CreditCard, TrendingUp, Users, Shield } from 'lucide-react';

const stats = [
  { value: 'R$ 89M+', label: 'Economia gerada para clientes' },
  { value: '15.247+', label: 'Clientes satisfeitos' },
  { value: '98%', label: 'Taxa de sucesso em arrematação' },
  { value: '300+', label: 'Fontes de leilões monitoradas' },
];

const features = [
  {
    icon: <Building className="w-12 h-12 text-blue-600" />,
    title: "Leilões de Imóveis",
    description: "Encontre casas, apartamentos e terrenos com até 70% de desconto.",
    link: "Busca"
  },
  {
    icon: <Car className="w-12 h-12 text-blue-600" />,
    title: "Leilões de Veículos", 
    description: "Carros, motos e pesados com procedência e preços imbatíveis.",
    link: "Veiculos"
  },
  {
    icon: <Calculator className="w-12 h-12 text-blue-600" />,
    title: "Calculadora ROI",
    description: "Calcule seu retorno sobre investimento antes de dar o lance.",
    link: "Calculadora"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            A Vantagem Inteligente em Leilões
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Encontre as melhores oportunidades de leilões de imóveis e veículos com o poder da Inteligência Artificial
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Busca')}>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 text-lg flex items-center justify-center rounded-lg">
                <Building className="w-5 h-5 mr-2" />
                Buscar Imóveis
              </Button>
            </Link>
            <Link to={createPageUrl('Veiculos')}>
              <Button variant="outline" size="lg" className="border-2 border-white hover:bg-white hover:text-blue-900 text-white font-bold py-4 px-8 text-lg flex items-center justify-center rounded-lg">
                <Car className="w-5 h-5 mr-2" />
                Buscar Veículos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <p className="text-3xl md:text-4xl font-bold text-blue-700">{stat.value}</p>
                <p className="text-sm md:text-base text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Encontre as Melhores Oportunidades
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Nossa plataforma monitora centenas de fontes em tempo real para trazer as melhores oportunidades diretamente para você.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link key={index} to={createPageUrl(feature.link)} className="group">
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                    Explorar <TrendingUp className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de investidores que já descobriram o poder dos leilões inteligentes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Planos')}>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-4 px-8 text-lg">
                <CreditCard className="w-5 h-5 mr-2" />
                Ver Planos
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 text-lg">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">LP</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Leilão Prático</h3>
                  <p className="text-gray-400 text-sm">Sua Vantagem Inteligente</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                A plataforma líder em análise inteligente de leilões no Brasil. 
                Mais de 15.000 clientes confiam em nossa tecnologia.
              </p>
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">100% Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Suporte 24/7</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to={createPageUrl('Busca')} className="hover:text-white">Buscar Imóveis</Link></li>
                <li><Link to={createPageUrl('Veiculos')} className="hover:text-white">Buscar Veículos</Link></li>
                <li><Link to={createPageUrl('Calculadora')} className="hover:text-white">Calculadora</Link></li>
                <li><Link to={createPageUrl('Planos')} className="hover:text-white">Planos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href__="#" className="hover:text-white">Central de Ajuda</a></li>
                <li><a href__="#" className="hover:text-white">WhatsApp</a></li>
                <li><a href__="#" className="hover:text-white">Chat Online</a></li>
                <li><a href__="#" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Leilão Prático. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
