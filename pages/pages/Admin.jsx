import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import AdminHeader from '../components/admin/AdminHeader';
import Dashboard from '../components/admin/Dashboard';
import AgenteCaptacao from '../components/admin/AgenteCaptacao';
import AgenteJuridico from '../components/admin/AgenteJuridico';
import AgenteMarketingIA from '../components/admin/AgenteMarketingIA';
import Usuarios from '../components/admin/Usuarios';
import Modalidades from '../components/admin/Modalidades';
import Categorias from '../components/admin/Categorias';
import AgentesIA from '../components/admin/AgentesIA';
import APIsExternas from '../components/admin/APIsExternas';
import RedesSociais from '../components/admin/RedesSociais';
import CrmMarketing from '../components/admin/CrmMarketing';
import CrmVendas from '../components/admin/CrmVendas';
import AgentesAtivos from '../components/admin/AgentesAtivos';
import SistemaLigacoesControl from '../components/admin/SistemaLigacoes';
import AgenteRecuperacao from '../components/admin/AgenteRecuperacao';
import ConfiguracoesAdmin from '../components/admin/ConfiguracoesAdmin';
import AgenteFunilVendas from '../components/admin/AgenteFunilVendas';
import AgenteUpsellAutomatico from '../components/admin/AgenteUpsellAutomatico';
import AgenteReputacao from '../components/admin/AgenteReputacao';
import AgenteSEO from '../components/admin/AgenteSEO';
import AgentesEspecializados from '../components/admin/AgentesEspecializados';
import AgentesExecutores from '../components/admin/AgentesExecutores';
import WhatsappConfig from './WhatsappConfig';
import GuiaIntegracoes from './GuiaIntegracoes';
import AgenteManutencao from '../components/admin/AgentesManutencao';

import {
  LayoutDashboard,
  Users,
  Gavel,
  Shapes,
  Bot,
  CloudCog,
  Share2,
  Target,
  Headphones,
  Activity,
  Phone,
  HeartPulse,
  Settings,
  Search,
  Shield,
  Crown,
  Zap,
  Star,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Building,
  Tag,
  PieChart,
  ShieldCheck,
  Mail,
  MessageCircle
} from 'lucide-react';

const createPageUrl = (componentName) => {
  return `/admin/${componentName.toLowerCase().replace(/control$/, '').replace(/ia$/, '').replace(/admin$/, '').replace(/agente/, '').replace(/_/, '-')}`;
};

const PlaceholderContent = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-full text-gray-600">
    <h2 className="text-3xl font-semibold mb-4">{title}</h2>
    <p className="text-lg">Conteúdo para {title} está em desenvolvimento.</p>
  </div>
);

const Button = ({ children, onClick, variant, size, className }) => {
  let baseClasses = "flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  if (variant === "ghost") {
    baseClasses += " bg-transparent hover:bg-gray-700 text-white";
  } else {
    baseClasses += " bg-gray-600 text-white hover:bg-gray-700";
  }
  if (size === "icon") {
    baseClasses += " h-10 w-10";
  } else {
    baseClasses += " h-10 px-4 py-2";
  }
  return (
    <button onClick={onClick} className={`${baseClasses} ${className || ''}`}>
      {children}
    </button>
  );
};

const componentMap = {
  'Dashboard': Dashboard,
  'AgenteRecuperacao': AgenteRecuperacao,
  'AgentesEspecializados': AgentesEspecializados,
  'AgentesExecutores': AgentesExecutores,
  'AgenteCaptacao': AgenteCaptacao,
  'AgenteMarketingIA': AgenteMarketingIA,
  'AgenteFunilVendas': AgenteFunilVendas,
  'AgenteUpsellAutomatico': AgenteUpsellAutomatico,
  'CrmMarketing': CrmMarketing,
  'CrmVendas': CrmVendas,
  'AgenteReputacao': AgenteReputacao,
  'AgenteSEO': AgenteSEO,
  'AgentesAtivos': AgentesAtivos,
  'SistemaLigacoesControl': SistemaLigacoesControl,
  'AgenteJuridico': AgenteJuridico,
  'ConfiguracoesAdmin': ConfiguracoesAdmin,
  'Usuarios': Usuarios,
  'APIsExternas': APIsExternas,
  'RedesSociais': RedesSociais,
  'AgentesIA': AgentesIA,
  'Modalidades': Modalidades,
  'Categorias': Categorias,
  'WhatsappConfig': WhatsappConfig,
  'GuiaIntegracoes': GuiaIntegracoes,
  'AgenteManutencao': AgenteManutencao,
};

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: 'Dashboard' },
  { id: 'agente_recuperacao', label: 'Recuperação', icon: HeartPulse, component: 'AgenteRecuperacao' },
  { id: 'agentes_especializados', label: 'Agentes Especializados', icon: Bot, component: 'AgentesEspecializados' },
  { id: 'agentes_executores', label: 'Agentes Executores', icon: Settings, component: 'AgentesExecutores' },
  { id: 'agente_captacao', label: 'Captação de Leads', icon: Search, component: 'AgenteCaptacao' },
  { id: 'agente_marketing', label: 'Marketing Digital', icon: Target, component: 'AgenteMarketingIA' },
  { id: 'agente_funil_vendas', label: 'Funil Milionário', icon: Zap, component: 'AgenteFunilVendas' },
  { id: 'agente_upsell', label: 'Upsell Automático', icon: Crown, component: 'AgenteUpsellAutomatico' },
  { id: 'crm_marketing', label: 'CRM Marketing', icon: Target, component: 'CrmMarketing' },
  { id: 'crm_vendas', label: 'CRM Vendas', icon: Headphones, component: 'CrmVendas' },
  { id: 'whatsapp_config', label: 'WhatsApp', icon: MessageCircle, component: 'WhatsappConfig' },
  { id: 'guia_integracoes', label: 'Guia Integrações', icon: CloudCog, component: 'GuiaIntegracoes' },
  { id: 'agente_reputacao', label: 'Gestão de Reputação', icon: Star, component: 'AgenteReputacao' },
  { id: 'agente_seo', label: 'SEO Automatizado', icon: TrendingUp, component: 'AgenteSEO' },
  { id: 'agentes_ativos', label: 'Agentes Ativos', icon: Activity, component: 'AgentesAtivos' },
  { id: 'sistema_ligacoes', label: 'Sistema Ligações', icon: Phone, component: 'SistemaLigacoesControl' },
  { id: 'agente_juridico', label: 'Análise Jurídica', icon: Shield, component: 'AgenteJuridico' },
  { id: 'agente_manutencao', label: 'Manutenção', icon: ShieldCheck, component: 'AgenteManutencao' },
  { id: 'configuracoes', label: 'Configurações', icon: Settings, component: 'ConfiguracoesAdmin' },
  { id: 'usuarios', label: 'Usuários', icon: Users, component: 'Usuarios' },
  { id: 'apis', label: 'APIs Externas', icon: CloudCog, component: 'APIsExternas' },
  { id: 'redes', label: 'Redes Sociais', icon: Share2, component: 'RedesSociais' },
  { id: 'agentes', label: 'Sistema de Agentes', icon: Bot, component: 'AgentesIA' },
  { id: 'modalidades', label: 'Modalidades', icon: Gavel, component: 'Modalidades' },
  { id: 'categorias', label: 'Categorias', icon: Shapes, component: 'Categorias' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({ name: 'Admin User', email: 'admin@example.com' });

  const renderContent = () => {
    const activeItem = navItems.find(item => item.id === activeTab);
    const componentName = activeItem ? activeItem.component : 'Dashboard';
    const ActiveComponent = componentMap[componentName] || Dashboard;
    const titleForPlaceholder = activeItem ? activeItem.label : 'Dashboard';

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
        >
          {ActiveComponent ? <ActiveComponent /> : <PlaceholderContent title={titleForPlaceholder} />}
        </motion.div>
      </AnimatePresence>
    );
  };

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-lg text-gray-700">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`bg-gray-800 text-white ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out flex flex-col`}>
        <div className="flex items-center justify-between p-4 h-16 border-b border-gray-700">
          <span className={`font-bold text-xl ${!isSidebarOpen && 'hidden'}`}>Leilão Prático</span>
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white hover:bg-gray-700">
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-left
                ${activeTab === item.id
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }
                ${!isSidebarOpen ? 'justify-center' : ''}
                `}
              >
                <item.icon className={`h-5 w-5 ${isSidebarOpen ? 'mr-3' : ''}`} />
                <span className={`${!isSidebarOpen && 'hidden'}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Painel de Controle - Leilão Prático</h1>
          <AdminHeader user={user} />
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
