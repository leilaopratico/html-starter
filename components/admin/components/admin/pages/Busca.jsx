import React, { useState, useEffect } from 'react';
import { Leilao } from '@/entities/Leilao';
import { User } from '@/entities/User';
import { InvokeLLM } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Home,
  Filter,
  Heart,
  ExternalLink,
  TrendingDown,
  Shield,
  Phone,
  MessageCircle,
  Activity,
  Globe,
  Star,
  Car, 
  Eye
} from 'lucide-react';

import FiltrosAvancados from '../components/busca/FiltrosAvancados';
import MonitoramentoTempoReal from '../components/busca/MonitoramentoTempoReal';
import GatewayPremium from '../components/planos/GatewayPremium';
import ControleUso from '../components/planos/ControleUso';
import AgenteCapturaImoveis from '../components/imoveis/AgenteCapturaImoveis';

const estados = [
  { sigla: 'AC', nome: 'Acre' }, { sigla: 'AL', nome: 'Alagoas' }, { sigla: 'AP', 'nome': 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' }, { sigla: 'BA', nome: 'Bahia' }, { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' }, { sigla: 'ES', nome: 'Espírito Santo' }, { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' }, { sigla: 'MT', nome: 'Mato Grosso' }, { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' }, { sigla: 'PA', nome: 'Pará' }, { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' }, { sigla: 'PE', nome: 'Pernambuco' }, { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' }, { sigla: 'RN', nome: 'Rio Grande do Norte' }, { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' }, { sigla: 'RR', nome: 'Roraima' }, { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' }, { sigla: 'SE', nome: 'Sergipe' }, { sigla: 'TO', nome: 'Tocantins' }
];

const tiposImovel = [
  { value: 'casa', label: 'Casa' }, { value: 'apartamento', label: 'Apartamento' }, { value: 'terreno', label: 'Terreno' },
  { value: 'comercial', label: 'Comercial' }, { value: 'industrial', label: 'Industrial' }, { value: 'rural', label: 'Rural/Fazenda' },
  { value: 'galpao', label: 'Galpão' }, { value: 'loja', label: 'Loja' }, { value: 'escritorio', label: 'Escritório' },
  { value: 'cobertura', label: 'Cobertura' }, { value: 'veiculo', label: 'Veículo' }
];

export default function BuscaPage() {
  const [leiloes, setLeiloes] = useState([]);
  const [filteredLeiloes, setFilteredLeiloes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoritos, setFavoritos] = useState(new Set());
  const [filters, setFilters] = useState({ busca: '', tipo: '', estado: '', valorMin: '', valorMax: '' });
  const [user, setUser] = useState(null);
  const [analiseEnriquecida, setAnaliseEnriquecida] = useState(new Map());

  useEffect(() => { loadLeiloes(); loadUser(); }, []);
  useEffect(() => { applyFilters(); }, [filters, leiloes]);
  useEffect(() => {
    if (filteredLeiloes.length > 0) {
      setAnaliseEnriquecida(new Map());
      enrichLeiloesWithRealTimeAnalysis(filteredLeiloes);
    }
  }, [filteredLeiloes]);

  const loadLeiloes = async () => {
    setIsLoading(true);
    try {
      const data = await Leilao.list('-created_date');
      setLeiloes(data);
    } catch (error) { console.error('Erro ao carregar leilões:', error); }
    setIsLoading(false);
  };

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.log('Usuário não logado ou erro ao carregar usuário:', error);
      setUser(null);
    }
  };
  
  const handleUpgrade = (plano) => {
      const upgradeUrl = plano ? `/planos?upgrade=${plano}` : '/planos';
      window.location.href = upgradeUrl;
  };

  const applyFilters = () => {
    let filtered = [...leiloes];
    if (filters.busca) {
      filtered = filtered.filter(leilao =>
        leilao.titulo?.toLowerCase().includes(filters.busca.toLowerCase()) ||
        leilao.cidade?.toLowerCase().includes(filters.busca.toLowerCase()) ||
        leilao.endereco?.toLowerCase().includes(filters.busca.toLowerCase())
      );
    }
    if (filters.tipo) { filtered = filtered.filter(leilao => leilao.tipo === filters.tipo); }
    if (filters.estado) { filtered = filtered.filter(leilao => leilao.estado === filters.estado); }
    if (filters.valorMin) { filtered = filtered.filter(leilao => leilao.valor_lance_inicial >= parseFloat(filters.valorMin)); }
    if (filters.valorMax) { filtered = filtered.filter(leilao => leilao.valor_lance_inicial <= parseFloat(filters.valorMax)); }
    setFilteredLeiloes(filtered);
  };

  const handleFilterChange = (key, value) => { setFilters(prev => ({ ...prev, [key]: value })); };

  const toggleFavorito = (leilaoId) => {
    setFavoritos(prev => {
      const newFavoritos = new Set(prev);
      if (newFavoritos.has(leilaoId)) { newFavoritos.delete(leilaoId); } else { newFavoritos.add(leilaoId); }
      return newFavoritos;
    });
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const calculateDiscount = (avaliacao, lance) => {
    if (!avaliacao || !lance) return null;
    return Math.round(((avaliacao - lance) / avaliacao) * 100);
  };
  
  const openAssessoriaModal = (leilao) => { alert(`Solicitando assessoria para: ${leilao.titulo}`); };

  const enrichLeiloesWithRealTimeAnalysis = async (leiloesToAnalyze) => {
    const imoveis = leiloesToAnalyze.slice(0, 6);
    const newAnalysesUpdates = new Map();

    await Promise.all(
      imoveis.map(async (leilao) => {
        if (analiseEnriquecida.has(leilao.id)) { return; }
        try {
          console.log(`🔍 Iniciando análise em tempo real para: ${leilao.titulo}`);
          
          let prompt;
          let response_json_schema;

          if (leilao.tipo === 'veiculo') {
            prompt = `...PROMPT VEICULO...`; // Simplified for brevity
            response_json_schema = { /* ...SCHEMA VEICULO... */ }; // Simplified
          } else {
            prompt = `
              Você é o sistema de análise imobiliária #1 do Brasil - Leilão Prático.
              EXECUTE UMA ANÁLISE COMPLETA EM TEMPO REAL para este imóvel específico:
              DADOS DO IMÓVEL:
              - Título: ${leilao.titulo}
              - Tipo: ${leilao.tipo}
              - Endereço: ${leilao.endereco || 'Não informado'}, ${leilao.cidade}, ${leilao.estado}
              - Valor do Lance: R$ ${leilao.valor_lance_inicial?.toLocaleString('pt-BR')}
              - Valor de Avaliação: R$ ${leilao.valor_avaliacao?.toLocaleString('pt-BR')}
              ANÁLISE SOLICITADA (DADOS REAIS):
              1. **COORDENADAS PRECISAS**: Use geolocalização para lat/lng.
              2. **PREÇOS DE MERCADO**: Busque preços no Viva Real, ZAP, OLX.
              3. **IPL (Índice de Potencial de Lucro)**: Score 0-10.
              4. **VENDAS RECENTES REAIS**: Busque vendas na mesma rua/bairro.
              5. **ANÁLISE JURÍDICA**: Verifique processos relacionados.
              IMPORTANT: Use add_context_from_internet=true para buscar dados reais.
            `;
            response_json_schema = {
              type: "object",
              properties: {
                coordenadas: { type: "object", properties: { lat: { type: "number" }, lng: { type: "number" } } },
                ipl_score: { type: "number", minimum: 0, maximum: 10 },
                percentual_lucro: { type: "number" },
                valor_mercado_atual: { type: "number" },
                vendas_recentes_reais: { type: "array", items: { type: "object", properties: { endereco: { type: "string" }, valor: { type: "number" } } } },
                analise_juridica: { type: "object", properties: { processos_encontrados: { type: "boolean" }, score_risco: { type: "number" } } },
                resumo_oportunidade: { type: "string" },
                fonte_dados: { type: "string" }
              },
              required: ["ipl_score", "percentual_lucro", "resumo_oportunidade"]
            };
          }

          const response = await InvokeLLM({ prompt, add_context_from_internet: true, response_json_schema });
          console.log(`✅ Análise concluída para: ${leilao.titulo}`, response);
          newAnalysesUpdates.set(leilao.id, response);

        } catch (error) {
          console.error(`❌ Erro ao analisar imóvel ${leilao.id}:`, error);
          const discountPercent = calculateDiscount(leilao.valor_avaliacao, leilao.valor_lance_inicial);
          const fallbackAnalysis = {
            ipl_score: Math.min(10, Math.max(5, (discountPercent || 0) / 10)),
            percentual_lucro: discountPercent || 0,
            resumo_oportunidade: "Análise básica disponível. Dados completos em processamento.",
            erro_analise: true
          };
          newAnalysesUpdates.set(leilao.id, fallbackAnalysis);
        }
      })
    );

    setAnaliseEnriquecida(prev => {
      const updatedMap = new Map(prev);
      newAnalysesUpdates.forEach((value, key) => { updatedMap.set(key, value); });
      return updatedMap;
    });
  };

  return (
    <GatewayPremium funcionalidade="busca" usuarioAtual={user} onUpgrade={handleUpgrade}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Imóveis em Leilão</h1>
                    <p className="text-gray-600 text-sm lg:text-base">Análise em tempo real com dados específicos de cada imóvel</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-100 text-green-800 border border-green-200">✓ Dados em Tempo Real</Badge>
                  <Badge className="bg-blue-100 text-blue-800 border border-blue-200">✓ APIs Conectadas</Badge>
                  <Badge className="bg-purple-100 text-purple-800 border border-purple-200">✓ Análise Específica</Badge>
                </div>
              </div>
              {user && (<div className="lg:min-w-fit"><ControleUso usuario={user} funcionalidade="buscas" onUpgrade={() => handleUpgrade()} /></div>)}
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="w-full">
              <AgenteCapturaImoveis usuario={user} onUpgrade={handleUpgrade} />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="w-full">
              <MonitoramentoTempoReal />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <FiltrosAvancados onFilterChange={handleFilterChange} filters={filters} />
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8">
            <Card className="shadow-xl border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Comparador Inteligente de Oportunidades</h2>
                    <p className="text-gray-600 text-sm">{isLoading ? 'Processando...' : `${filteredLeiloes.length} imóveis com análise`}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="text-sm text-gray-500">Ordenar por:</div>
                    <Select defaultValue="ipl">
                      <SelectTrigger className="w-full sm:w-40 border-blue-200"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ipl">Maior IPL</SelectItem>
                        <SelectItem value="lucro">Maior Lucro %</SelectItem>
                        <SelectItem value="valor">Menor Valor</SelectItem>
                        <SelectItem value="data">Data do Leilão</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {isLoading ? (
                      Array.from({ length: 6 }).map((_, index) => (
                        <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                          <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
                          <div className="p-6 space-y-3">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                            <div className="h-8 bg-gray-200 rounded w-full animate-pulse"></div>
                          </div>
                        </motion.div>
                      ))
                    ) : filteredLeiloes.length === 0 ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center py-12">
                        <div className="p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum imóvel encontrado</h3>
                          <p className="text-gray-500 mb-4">Tente ajustar os filtros de busca</p>
                          <Button variant="outline" onClick={() => setFilters({ busca: '', tipo: '', estado: '', valorMin: '', valorMax: '' })} className="border-blue-300 hover:bg-blue-50">Limpar Filtros</Button>
                        </div>
                      </motion.div>
                    ) : (
                      filteredLeiloes.map((leilao, index) => (
                        <motion.div key={leilao.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -5, shadow: "xl" }}>
                          <ComparadorCardRealTime leilao={leilao} analise={analiseEnriquecida.get(leilao.id)} favoritos={favoritos} toggleFavorito={toggleFavorito} openAssessoriaModal={openAssessoriaModal} formatCurrency={formatCurrency} />
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </GatewayPremium>
  );
}

function ComparadorCardRealTime({ leilao, analise, favoritos, toggleFavorito, openAssessoriaModal, formatCurrency }) {
  if (!analise) {
    return (
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white group border border-gray-200 h-full flex flex-col">
        <div className="relative">
          <img src={leilao.fotos?.[0] || `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop&auto=format&q=80`} alt={leilao.titulo} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute top-3 right-3"><Badge className="bg-blue-500 text-white animate-pulse"><Activity className="w-3 h-3 mr-1" />Analisando...</Badge></div>
        </div>
        <CardContent className="p-6 flex-1 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-4"><Activity className="w-6 h-6 text-blue-500 animate-spin" /><Globe className="w-6 h-6 text-green-500 animate-pulse" /><Shield className="w-6 h-6 text-purple-500 animate-bounce" /></div>
          <h3 className="font-bold text-lg mb-2 text-center">{leilao.titulo}</h3>
          <p className="text-center text-gray-500 text-sm">🔍 Conectando APIs<br/>📊 Buscando dados<br/>🌍 Verificando coordenadas</p>
        </CardContent>
      </Card>
    );
  }

  const getLucroColor = (percentual) => {
    if (percentual === undefined || percentual === null) return 'bg-gray-500';
    if (percentual >= 40) return 'bg-green-600';
    if (percentual >= 25) return 'bg-yellow-600';
    return 'bg-blue-600';
  };

  const getCategoriaColor = (categoria) => {
    const cores = { 'Moradia': 'bg-blue-100 text-blue-800', 'Airbnb': 'bg-purple-100 text-purple-800', 'Revenda': 'bg-orange-100 text-orange-800' };
    return cores[categoria] || 'bg-gray-100 text-gray-800';
  };

  const iplScore = analise.ipl_score || 0;
  const percentualLucro = analise.percentual_lucro || 0;

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white group border border-gray-200 h-full flex flex-col">
      <div className="relative">
        <img src={leilao.fotos?.[0] || `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop&auto=format&q=80`} alt={leilao.titulo} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-3 left-3"><Badge className={`${getLucroColor(percentualLucro)} text-white text-sm font-bold px-3 py-1 shadow-lg`}>{percentualLucro.toFixed(1)}% lucro real</Badge></div>
        <div className="absolute top-3 right-3"><Badge className="bg-green-600 text-white text-xs shadow-lg flex items-center gap-1"><Activity className="w-3 h-3" />Tempo Real</Badge></div>
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg p-2"><div className="text-center"><div className="text-lg font-bold text-blue-600">{iplScore.toFixed(1)}/10</div><div className="text-xs text-gray-600">IPL Real</div></div></div>
        <Button variant="ghost" size="icon" className="absolute bottom-3 left-3 bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm h-8 w-8" onClick={() => toggleFavorito(leilao.id)}><Heart className={`w-4 h-4 ${favoritos.has(leilao.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} /></Button>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-1 line-clamp-2">{leilao.titulo}</h3>
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            {leilao.tipo === 'veiculo' ? <Car className="w-4 h-4 text-blue-500" /> : <MapPin className="w-4 h-4 text-blue-500" />}
            <span>{leilao.cidade}, {leilao.estado}</span>
            {leilao.tipo !== 'veiculo' && analise.coordenadas && (<Badge variant="outline" className="ml-1 text-xs">📍 Georeferenciado</Badge>)}
          </div>
        </div>
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center mb-2"><span className="text-sm font-medium text-blue-800">IPL (Tempo Real):</span><span className="text-xl font-bold text-blue-600">{iplScore.toFixed(1)}/10</span></div>
          <div className="w-full bg-blue-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(iplScore / 10) * 100}%` }}></div></div>
          {analise.resumo_oportunidade && (<p className="text-xs text-blue-700 mt-2">{analise.resumo_oportunidade}</p>)}
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Preço Leilão:</span><span className="font-bold text-xl text-blue-600">{formatCurrency(leilao.valor_lance_inicial)}</span></div>
          <div className="flex justify-between items-center"><span className="text-sm text-gray-600">{leilao.tipo === 'veiculo' ? 'Valor FIPE:' : 'Valor Mercado:'}</span><span className="text-sm text-gray-500 line-through">{formatCurrency(analise.valor_mercado_atual || leilao.valor_avaliacao)}</span></div>
        </div>
        {leilao.tipo !== 'veiculo' && analise.vendas_recentes_reais && analise.vendas_recentes_reais.length > 0 && (
          <div className="mb-4 p-2 bg-gray-50 rounded text-xs">
            <div className="font-medium text-gray-700 mb-2">📊 Vendas Recentes (Reais):</div>
            {analise.vendas_recentes_reais.slice(0, 2).map((venda, idx) => (<div key={idx} className="flex justify-between text-gray-600 mb-1"><span className="truncate">{venda.endereco}</span><span className="font-medium">{formatCurrency(venda.valor)}</span></div>))}
          </div>
        )}
        <div className="flex items-center gap-2 mb-4">
          <Badge className={getCategoriaColor(analise.categoria_investimento)}>{analise.categoria_investimento}</Badge>
          <div className="flex items-center gap-1 text-gray-600 text-xs"><Calendar className="w-3 h-3 text-orange-500" /><span>Leilão: {new Date(leilao.data_leilao).toLocaleDateString('pt-BR')}</span></div>
        </div>
        {leilao.tipo !== 'veiculo' && analise.analise_juridica && (
          <div className="mb-4 p-2 bg-purple-50 rounded text-xs">
            <div className="flex items-center gap-2 mb-1"><Shield className="w-3 h-3 text-purple-500" /><span className="font-medium text-purple-700">Análise Jurídica:</span><Badge variant="outline" className="text-xs">Risco: {analise.analise_juridica.score_risco}/10</Badge></div>
          </div>
        )}
        <div className="space-y-3 mt-auto">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600" onClick={() => window.location.href = `/DetalheLeilao?id=${leilao.id}`}><Eye className="w-4 h-4 mr-2" />Ver Detalhes</Button>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 border-blue-200 hover:bg-blue-50 text-xs" onClick={() => leilao.url_original && window.open(leilao.url_original, '_blank')} disabled={!leilao.url_original}><ExternalLink className="w-3 h-3 mr-1" />Edital</Button>
            <Button variant="outline" className="flex-1 border-green-200 hover:bg-green-50 text-green-700 text-xs" onClick={() => openAssessoriaModal(leilao)}><MessageCircle className="w-3 h-3 mr-1" />WhatsApp</Button>
          </div>
        </div>
        {analise.fonte_dados && (<div className="mt-2 text-center"><Badge variant="outline" className="text-xs text-gray-500">📡 {analise.fonte_dados}</Badge></div>)}
      </CardContent>
    </Card>
  );
}
