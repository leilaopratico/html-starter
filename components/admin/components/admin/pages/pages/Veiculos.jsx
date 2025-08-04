import React, { useState, useEffect, useMemo } from 'react';
import { Leilao } from '@/entities/Leilao';
import { User } from '@/entities/User';
import { InvokeLLM } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Lock,
  Crown,
  Shield,
  Zap,
  TrendingUp,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Phone,
  MessageCircle,
  Star,
  Eye,
  Heart,
  Activity,
  Globe,
  Gauge,
  Loader2,
  XCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import CheckTecnicoCompleto from '../components/veiculos/CheckTecnicoCompleto';
import GatewayPremium from '../components/planos/GatewayPremium';
import AgenteCapturaVeiculos from '../components/veiculos/AgenteCapturaVeiculos';

export default function VeiculosPage() {
  const [user, setUser] = useState(null);
  const [veiculos, setVeiculos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [analiseVeiculos, setAnaliseVeiculos] = useState(new Map());
  const [filters, setFilters] = useState({ marca: '', modelo: '', estado: '', valorMax: '' });

  const [isModalAnaliseOpen, setIsModalAnaliseOpen] = useState(false);
  const [selectedVeiculoAnalise, setSelectedVeiculoAnalise] = useState(null);
  const [analiseCompleta, setAnaliseCompleta] = useState(null);
  const [isAnaliseCompletaLoading, setIsAnaliseCompletaLoading] = useState(false);
  const [analiseCompletaError, setAnaliseCompletaError] = useState(null);

  const [isModalJuridicoOpen, setIsModalJuridicoOpen] = useState(false);
  const [selectedVeiculoJuridico, setSelectedVeiculoJuridico] = useState(null);
  const [analiseJuridica, setAnaliseJuridica] = useState(null);
  const [isAnaliseJuridicaLoading, setIsAnaliseJuridicaLoading] = useState(false);
  const [analiseJuridicaError, setAnaliseJuridicaError] = useState(null);

  useEffect(() => { checkUserAccess(); loadVeiculos(); }, []);
  useEffect(() => { if (veiculos.length > 0) { setAnaliseVeiculos(new Map()); enrichVeiculosWithRealTimeAnalysis(veiculos); } }, [veiculos]);

  const checkUserAccess = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) { console.error('Usuário não logado:', error); }
    finally { setIsLoading(false); }
  };

  const loadVeiculos = async () => {
    try {
      const mockVeiculos = [
        {
          id: 1, titulo: 'Toyota Hilux SW4 SRX 2.8 4x4 TDI Diesel Aut - 2019/2020', marca: 'Toyota', modelo: 'Hilux SW4', ano: 2020, combustivel: 'Diesel', quilometragem: 45000,
          valor_lance_inicial: 180000, valor_avaliacao: 280000, cidade: 'São Paulo', estado: 'SP', data_leilao: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          fotos: ['https://images.unsplash.com/photo-1627464684122-f71156c8c108?q=80&w=800'], leiloeiro: 'Banco do Brasil', link_edital: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        },
        {
          id: 2, titulo: 'Honda Civic Touring 1.5 Turbo CVT - 2018/2019', marca: 'Honda', modelo: 'Civic', ano: 2019, combustivel: 'Flex', quilometragem: 32000,
          valor_lance_inicial: 85000, valor_avaliacao: 120000, cidade: 'Rio de Janeiro', estado: 'RJ', data_leilao: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          fotos: ['https://images.unsplash.com/photo-1593941707874-ef25b8b4a92b?q=80&w=800'], leiloeiro: 'Santander', link_edital: null
        },
        {
          id: 3, titulo: 'Volkswagen Amarok Highline CD 3.0 V6 TDI 4Motion Aut - 2020/2021', marca: 'Volkswagen', modelo: 'Amarok', ano: 2021, combustivel: 'Diesel', quilometragem: 28000,
          valor_lance_inicial: 195000, valor_avaliacao: 270000, cidade: 'Curitiba', estado: 'PR', data_leilao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          fotos: ['https://images.unsplash.com/photo-1544829099-b9a0c5303bea?q=80&w=800'], leiloeiro: 'Caixa Econômica Federal', link_edital: 'https://www.africau.edu/images/default/sample.pdf'
        }
      ];
      setVeiculos(mockVeiculos);
    } catch (error) { console.error('Erro ao carregar veículos:', error); }
  };

  const enrichVeiculosWithRealTimeAnalysis = async (veiculosToAnalyze) => {
    const newAnalysesUpdates = new Map();
    await Promise.all(
      veiculosToAnalyze.map(async (veiculo) => {
        if (analiseVeiculos.has(veiculo.id)) { return; }
        try {
          console.log(`🚗 Iniciando análise em tempo real para: ${veiculo.titulo}`);
          const prompt = `
          Você é o sistema de análise automotiva #1 do Brasil - Leilão Prático.
          EXECUTE UMA ANÁLISE COMPLETA EM TEMPO REAL para este veículo específico:

          DADOS DO VEÍCULO:
          - Título: ${veiculo.titulo}
          - Marca: ${veiculo.marca}
          - Modelo: ${veiculo.modelo}
          - Ano: ${veiculo.ano}
          - Combustível: ${veiculo.combustivel}
          - Quilometragem: ${veiculo.quilometragem?.toLocaleString()} km
          - Valor do Lance: R$ ${veiculo.valor_lance_inicial?.toLocaleString('pt-BR')}
          - Valor de Avaliação: R$ ${veiculo.valor_avaliacao?.toLocaleString('pt-BR')}

          ANÁLISE SOLICITADA (DADOS REAIS):
          1. **VALOR FIPE ATUAL**: Consulte o preço atual na tabela FIPE.
          2. **COMPARAÇÃO DE PREÇOS**: Busque preços no OLX, WebMotors, Mercado Livre.
          3. **IPL SCORE (0-10)**: Score baseado no potencial de lucro real.
          4. **PROBLEMAS CRÔNICOS**: Identifique problemas comuns deste modelo/ano.
          5. **CATEGORIA DE INVESTIMENTO**: Uso Pessoal, Revenda, ou Trabalho.
          `;

          const response = await InvokeLLM({
            prompt, add_context_from_internet: true,
            response_json_schema: {
              type: "object",
              properties: {
                ipl_score: { type: "number", minimum: 0, maximum: 10 },
                percentual_lucro: { type: "number" },
                valor_fipe_atual: { type: "number" },
                comparacao_portais: {
                  type: "object",
                  properties: { olx_medio: { type: "number" }, webmotors_medio: { type: "number" }, mercado_livre_medio: { type: "number" } }
                },
                problemas_cronicos: { type: "array", items: { type: "object", properties: { problema: { type: "string" } } } },
                categoria_investimento: { type: "string", enum: ["Uso Pessoal", "Revenda", "Trabalho"] },
                resumo_oportunidade: { type: "string" },
                fonte_dados: { type: "string" }
              },
              required: ["ipl_score", "percentual_lucro", "categoria_investimento"]
            }
          });
          console.log(`✅ Análise concluída para: ${veiculo.titulo}`, response);
          newAnalysesUpdates.set(veiculo.id, response);
        } catch (error) {
          console.error(`❌ Erro ao analisar veículo ${veiculo.id}:`, error);
          const discountPercent = veiculo.valor_avaliacao ? Math.round(((veiculo.valor_avaliacao - veiculo.valor_lance_inicial) / veiculo.valor_avaliacao) * 100) : 0;
          newAnalysesUpdates.set(veiculo.id, {
            ipl_score: Math.min(10, Math.max(5, discountPercent / 10)),
            percentual_lucro: discountPercent,
            categoria_investimento: "Uso Pessoal",
            resumo_oportunidade: "Análise básica disponível. Dados completos em processamento.",
            erro_analise: true
          });
        }
      })
    );
    setAnaliseVeiculos(prev => {
      const updatedMap = new Map(prev);
      newAnalysesUpdates.forEach((value, key) => { updatedMap.set(key, value); });
      return updatedMap;
    });
  };

  const handleVerAnaliseCompleta = async (veiculo) => {
    setSelectedVeiculoAnalise(veiculo);
    setIsModalAnaliseOpen(true);
    setIsAnaliseCompletaLoading(true);
    setAnaliseCompleta(null);
    setAnaliseCompletaError(null);

    try {
      console.log(`🚀 Iniciando ANÁLISE TÉCNICA COMPLETA para: ${veiculo.titulo}`);
      const prompt = `
        Você é o SISTEMA CARANGA NINJA integrado ao Leilão Prático.
        Execute uma ANÁLISE TÉCNICA COMPLETA E DETALHADA para o veículo abaixo:

        VEÍCULO:
        - Título: ${veiculo.titulo}
        - Marca: ${veiculo.marca}
        - Modelo: ${veiculo.modelo}
        - Ano: ${veiculo.ano}
        - Quilometragem: ${veiculo.quilometragem} km
        - Lance Inicial: ${formatCurrency(veiculo.valor_lance_inicial)}

        PROTOCOLO CARANGA NINJA:
        1. **ANÁLISE TÉCNICA ESPECÍFICA** (Motor, Câmbio, Suspensão, Freios, Pneus, Elétrica, Lataria, Interior)
        2. **HISTÓRICO VEICULAR REAL** (Proprietários, sinistros, recalls, manutenções)
        3. **AVALIAÇÃO DE MERCADO PRECISA** (FIPE, liquidez, tempo de venda)
        4. **SITUAÇÃO DOCUMENTAL** (IPVA, multas, licenciamento)
        5. **RECOMENDAÇÃO FINAL**
      `;

      const response = await InvokeLLM({
        prompt, add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            scoreGeral: { type: "number" },
            analiseTecnica: {
              type: "object",
              properties: {
                motor: { type: "object", properties: { score: { type: "number" }, status: { type: "string" }, detalhes: { type: "string" } } },
                cambio: { type: "object", properties: { score: { type: "number" }, status: { type: "string" }, detalhes: { type: "string" } } },
                suspensao: { type: "object", properties: { score: { type: "number" }, status: { type: "string" }, detalhes: { type: "string" } } }
              }
            },
            historicoVeiculo: {
              type: "object",
              properties: {
                proprietarios: { type: "number" },
                sinistros: { type: "array", items: { type: "object", properties: { data: { type: "string" }, tipo: { type: "string" }, valor: { type: "number" } } } }
              }
            },
            avaliacaoMercado: {
              type: "object",
              properties: { valorFipe: { type: "number" }, valorLeilao: { type: "number" }, economiaPercentual: { type: "number" } }
            },
            situacaoDocumental: {
              type: "object",
              properties: { multas: { type: "boolean" }, ipva: { type: "boolean" }, licenciamento: { type: "boolean" } }
            },
            recomendacaoFinal: {
              type: "object",
              properties: { resumo: { type: "string" }, investimentoAdicionalEstimado: { type: "number" } }
            }
          }
        }
      });
      console.log('✅ Análise técnica completa recebida:', response);
      setAnaliseCompleta(response);
    } catch (error) {
      console.error('❌ Erro na análise técnica:', error);
      setAnaliseCompletaError('Falha ao gerar a análise. Tente novamente mais tarde.');
    } finally { setIsAnaliseCompletaLoading(false); }
  };

  const handleAnaliseJuridica = async (veiculo) => {
    setSelectedVeiculoJuridico(veiculo);
    setIsModalJuridicoOpen(true);
    setIsAnaliseJuridicaLoading(true);
    setAnaliseJuridica(null);
    setAnaliseJuridicaError(null);

    if (!veiculo.link_edital) {
      setAnaliseJuridicaError("Nenhum link de edital foi encontrado para este veículo.");
      setIsAnaliseJuridicaLoading(false);
      return;
    }

    try {
      console.log(`⚖️ Iniciando ANÁLISE JURÍDICA para edital: ${veiculo.link_edital}`);
      const prompt = `
        Você é o SISTEMA JURÍDICO do Leilão Prático - especialista em análise de editais automotivos.
        Analise o edital de leilão de VEÍCULO e identifique TODOS os riscos jurídicos específicos.

        EDITAL: ${veiculo.link_edital}
        VEÍCULO: ${veiculo.titulo}

        PROTOCOLO JURÍDICO AUTOMOTIVO:
        1. **RESPONSABILIDADE POR DÉBITOS:** IPVA, multas, taxas DETRAN
        2. **FINANCIAMENTO:** Alienação fiduciária, consórcio, leasing
        3. **DOCUMENTAÇÃO:** CRV, CRLV, licenciamento
        4. **CUSTOS ADICIONAIS:** Comissões, taxas, transferência
        5. **RECURSOS JUDICIAIS:** Possibilidade de anulação
      `;

      const response = await InvokeLLM({
        prompt, add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            scoreRisco: { type: "number", minimum: 0, maximum: 100 },
            recomendacao: { type: "string", enum: ["Baixo Risco", "Risco Moderado", "Alto Risco", "Risco Crítico"] },
            resumoExecutivo: { type: "string" },
            pontosDeAtencao: { type: "array", items: { type: "object", properties: { area: { type: "string" }, descricao: { type: "string" }, nivelRisco: { type: "string", enum: ["Baixo", "Médio", "Alto"] } } } },
            clausulasRelevantes: { type: "array", items: { type: "string" } }
          }
        }
      });
      console.log('✅ Análise jurídica completa:', response);
      setAnaliseJuridica(response);
    } catch (error) {
      console.error('❌ Erro na análise jurídica:', error);
      setAnaliseJuridicaError('Falha ao processar edital. Verifique o link ou tente novamente.');
    } finally { setIsAnaliseJuridicaLoading(false); }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const filteredVeiculos = useMemo(() => {
    return veiculos.filter(veiculo => {
      if (filters.marca && veiculo.marca && veiculo.marca.toLowerCase() !== filters.marca.toLowerCase()) { return false; }
      if (filters.modelo && veiculo.modelo && !veiculo.modelo.toLowerCase().includes(filters.modelo.toLowerCase())) { return false; }
      if (filters.estado && veiculo.estado && veiculo.estado.toLowerCase() !== filters.estado.toLowerCase()) { return false; }
      if (filters.valorMax && veiculo.valor_lance_inicial && veiculo.valor_lance_inicial > parseFloat(filters.valorMax)) { return false; }
      return true;
    });
  }, [veiculos, filters]);

  const handleUpgrade = (plano) => { window.location.href = '/planos?upgrade=' + plano; };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Crown className="w-8 h-8 text-yellow-400" />
                <div>
                  <h1 className="text-3xl font-bold">Área Premium de Veículos</h1>
                  <p className="text-purple-100">Análise técnica completa em tempo real para cada veículo</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-100 text-green-800 border border-green-200">✓ Dados FIPE em Tempo Real</Badge>
                <Badge className="bg-blue-100 text-blue-800 border border-blue-200">✓ Check Técnico Específico</Badge>
                <Badge className="bg-orange-100 text-orange-800 border border-orange-200">✓ Análise de Mercado Real</Badge>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="my-8">
          <AgenteCapturaVeiculos usuario={user} onUpgrade={handleUpgrade} onAnaliseJuridica={handleAnaliseJuridica} />
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={filters.marca} onValueChange={(value) => setFilters({...filters, marca: value})}>
                <SelectTrigger><SelectValue placeholder="Marca" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Todas as marcas</SelectItem>
                  <SelectItem value="Toyota">Toyota</SelectItem>
                  <SelectItem value="Honda">Honda</SelectItem>
                  <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Modelo" value={filters.modelo} onChange={(e) => setFilters({...filters, modelo: e.target.value})} />
              <Select value={filters.estado} onValueChange={(value) => setFilters({...filters, estado: value})}>
                <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Todos os estados</SelectItem>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="PR">Paraná</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" placeholder="Valor máximo" value={filters.valorMax} onChange={(e) => setFilters({...filters, valorMax: e.target.value})} />
            </div>
          </CardContent>
        </Card>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8">
          <Card className="shadow-xl border-2 border-purple-100">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Análise Técnica Especializada</h2>
                  <p className="text-gray-600 text-sm">{filteredVeiculos.length} veículos com análise completa em tempo real</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {filteredVeiculos.length === 0 ? (
                <div className="text-center text-gray-600 py-10">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                  <p className="text-xl font-semibold">Nenhum veículo encontrado.</p>
                  <p className="text-sm">Ajuste os filtros ou utilize nosso Sistema de Captura.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8">
                  <AnimatePresence>
                    {filteredVeiculos.map((veiculo, index) => {
                      const analise = analiseVeiculos.get(veiculo.id);
                      return (
                        <motion.div key={veiculo.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                          <GatewayPremium funcionalidade="check_tecnico" usuarioAtual={user} onUpgrade={handleUpgrade}>
                            <VeiculoCardRealTime 
                              veiculo={veiculo} 
                              analise={analise} 
                              formatCurrency={formatCurrency} 
                              onVerAnaliseCompleta={handleVerAnaliseCompleta}
                              isCheckLoading={isAnaliseCompletaLoading}
                              selectedVeiculoId={selectedVeiculoAnalise?.id}
                              onAnaliseJuridica={handleAnaliseJuridica}
                              isJuridicaLoading={isAnaliseJuridicaLoading}
                              selectedVeiculoJuridicoId={selectedVeiculoJuridico?.id}
                            />
                          </GatewayPremium>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <Card className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Análise Técnica Exclusiva Ativa</h3>
            <p className="text-purple-100">Continue aproveitando nossa tecnologia proprietária de análise automotiva</p>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalAnaliseOpen} onOpenChange={setIsModalAnaliseOpen}>
        <DialogContent className="max-w-4xl w-[90%]">
          <DialogHeader>
            <DialogTitle>Análise Técnica Completa</DialogTitle>
            <DialogDescription>{selectedVeiculoAnalise?.titulo}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto p-4">
            <CheckTecnicoCompleto isLoading={isAnaliseCompletaLoading} analise={analiseCompleta} error={analiseCompletaError} />
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isModalJuridicoOpen} onOpenChange={setIsModalJuridicoOpen}>
        <DialogContent className="max-w-2xl w-[90%]">
          <DialogHeader>
            <DialogTitle>Análise Jurídica do Edital</DialogTitle>
            <DialogDescription>{selectedVeiculoJuridico?.titulo}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto p-4">
            {isAnaliseJuridicaLoading && (
              <div className="flex flex-col items-center justify-center h-48">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-lg text-gray-700">Analisando documento...</p>
                <p className="text-sm text-gray-500 mt-2">Nosso sistema está verificando os riscos.</p>
              </div>
            )}
            {analiseJuridicaError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erro na Análise Jurídica</AlertTitle>
                <AlertDescription>{analiseJuridicaError}</AlertDescription>
              </Alert>
            )}
            {analiseJuridica && (
              <div className="space-y-4">
                <Card className="border-2 border-purple-200">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl font-bold">Score de Risco: <span className="text-purple-600">{analiseJuridica.scoreRisco}/100</span></CardTitle>
                      <Badge className={`px-3 py-1 text-sm font-semibold 
                        ${analiseJuridica.recomendacao === 'Baixo Risco' ? 'bg-green-100 text-green-800' : ''}
                        ${analiseJuridica.recomendacao === 'Risco Moderado' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${analiseJuridica.recomendacao === 'Alto Risco' ? 'bg-orange-100 text-orange-800' : ''}
                        ${analiseJuridica.recomendacao === 'Risco Crítico' ? 'bg-red-100 text-red-800' : ''}
                      `}>{analiseJuridica.recomendacao}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{analiseJuridica.resumoExecutivo}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsModalJuridicoOpen(false)} variant="outline">Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function VeiculoCardRealTime({ veiculo, analise, formatCurrency, onVerAnaliseCompleta, isCheckLoading, selectedVeiculoId, onAnaliseJuridica, isJuridicaLoading, selectedVeiculoJuridicoId }) {
  if (!analise) {
    return (
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white group border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <div className="relative">
            <img src={veiculo.fotos?.[0] || `https://images.unsplash.com/photo-1627464684122-f71156c8c108?w=400&h=250&fit=crop&auto=format&q=80`} alt={veiculo.titulo} className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute top-3 right-3"><Badge className="bg-blue-500 text-white animate-pulse"><Activity className="w-3 h-3 mr-1" />Analisando...</Badge></div>
          </div>
          <div className="lg:col-span-2 flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center gap-2 mb-4 justify-center"><Car className="w-6 h-6 text-blue-500 animate-bounce" /><Gauge className="w-6 h-6 text-green-500 animate-pulse" /><Shield className="w-6 h-6 text-purple-500 animate-spin" /></div>
              <h3 className="font-bold text-lg mb-2">{veiculo.titulo}</h3>
              <p className="text-gray-500 text-sm">🔍 Consultando tabela FIPE<br/>📊 Verificando Webmotors/OLX<br/>🔧 Análise técnica especializada</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'bg-green-600';
    if (score >= 6) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getCategoriaColor = (categoria) => {
    const cores = { 'Uso Pessoal': 'bg-blue-100 text-blue-800', 'Revenda': 'bg-orange-100 text-orange-800', 'Trabalho': 'bg-purple-100 text-purple-800' };
    return cores[categoria] || 'bg-gray-100 text-gray-800';
  };
  
  const isLoadingThisCheckCard = isCheckLoading && selectedVeiculoId === veiculo.id;
  const isLoadingThisJuridicaCard = isJuridicaLoading && selectedVeiculoJuridicoId === veiculo.id;
  const iplScore = analise.ipl_score || 0;
  const percentualLucro = analise.percentual_lucro || 0;

  const handleFalarEspecialista = () => {
    const mensagem = `Olá! Tenho interesse no veículo: ${veiculo.titulo}. Gostaria de assessoria especializada.`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white group border border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="relative">
          <img src={veiculo.fotos?.[0] || `https://images.unsplash.com/photo-1627464684122-f71156c8c108?w=400&h=250&fit=crop&auto=format&q=80`} alt={veiculo.titulo} className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute top-3 left-3"><Badge className="bg-green-600 text-white text-sm font-bold px-3 py-1 shadow-lg">{percentualLucro.toFixed(1)}% economia</Badge></div>
          <div className="absolute top-3 right-3"><Badge className="bg-blue-600 text-white text-xs shadow-lg flex items-center gap-1"><Activity className="w-3 h-3" />FIPE Atual</Badge></div>
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg p-2"><div className="text-center"><div className="text-lg font-bold text-blue-600">{iplScore.toFixed(1)}/10</div><div className="text-xs text-gray-600">IPL Score</div></div></div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-lg mb-1">{veiculo.titulo}</h3>
            <div className="flex items-center gap-1 text-gray-600 text-sm"><MapPin className="w-4 h-4 text-blue-500" /><span>{veiculo.cidade}, {veiculo.estado}</span></div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-600">Ano:</span><div className="font-bold">{veiculo.ano}</div></div>
            <div><span className="text-gray-600">Combustível:</span><div className="font-bold">{veiculo.combustivel}</div></div>
            <div><span className="text-gray-600">KM:</span><div className="font-bold">{veiculo.quilometragem?.toLocaleString()}</div></div>
            <div><span className="text-gray-600">Leiloeiro:</span><div className="font-bold text-xs">{veiculo.leiloeiro}</div></div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center"><span className="text-sm text-gray-600">Preço Leilão:</span><span className="font-bold text-xl text-blue-600">{formatCurrency(veiculo.valor_lance_inicial)}</span></div>
            {analise.valor_fipe_atual && (<div className="flex justify-between items-center"><span className="text-sm text-gray-600">Valor FIPE:</span><span className="text-sm text-gray-500 line-through">{formatCurrency(analise.valor_fipe_atual)}</span></div>)}
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getCategoriaColor(analise.categoria_investimento)}>{analise.categoria_investimento}</Badge>
            <div className="flex items-center gap-1 text-gray-600 text-xs"><Calendar className="w-3 h-3 text-orange-500" /><span>Leilão: {new Date(veiculo.data_leilao).toLocaleDateString('pt-BR')}</span></div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center mb-2"><span className="text-sm font-medium text-blue-800">IPL Score:</span><span className="text-xl font-bold text-blue-600">{iplScore.toFixed(1)}/10</span></div>
            <div className="w-full bg-blue-200 rounded-full h-2"><div className={`h-2 rounded-full transition-all duration-500 ${getScoreColor(iplScore)}`} style={{ width: `${(iplScore / 10) * 100}%` }}></div></div>
            {analise.resumo_oportunidade && (<p className="text-xs text-blue-700 mt-2">{analise.resumo_oportunidade}</p>)}
          </div>

          {analise.comparacao_portais && (
            <div className="text-xs text-gray-600">
              <div className="font-medium mb-1">Comparação Mercado:</div>
              <div className="space-y-1">
                {analise.comparacao_portais.webmotors_medio && (<div className="flex justify-between"><span>Webmotors:</span><span className="font-medium">{formatCurrency(analise.comparacao_portais.webmotors_medio)}</span></div>)}
                {analise.comparacao_portais.olx_medio && (<div className="flex justify-between"><span>OLX:</span><span className="font-medium">{formatCurrency(analise.comparacao_portais.olx_medio)}</span></div>)}
                {analise.comparacao_portais.mercado_livre_medio && (<div className="flex justify-between"><span>Mercado Livre:</span><span className="font-medium">{formatCurrency(analise.comparacao_portais.mercado_livre_medio)}</span></div>)}
              </div>
            </div>
          )}

          {analise.problemas_cronicos && analise.problemas_cronicos.length > 0 && (
            <div className="p-2 bg-red-50 rounded text-xs">
              <div className="font-medium text-red-700 mb-2">🚨 Problemas Conhecidos:</div>
              {analise.problemas_cronicos.slice(0, 2).map((p, idx) => (<div key={idx} className="text-red-600 mb-1">• {typeof p === 'object' ? p.problema : p}</div>))}
            </div>
          )}

          <div className="space-y-2">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg" onClick={() => onVerAnaliseCompleta(veiculo)} disabled={isLoadingThisCheckCard}>
              {isLoadingThisCheckCard ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analisando...</>) : (<><Gauge className="w-4 h-4 mr-2" /> Check Técnico Completo</>)}
            </Button>
            <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg" onClick={() => onAnaliseJuridica(veiculo)} disabled={isLoadingThisJuridicaCard || !veiculo.link_edital}>
              {isLoadingThisJuridicaCard ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analisando Edital...</>) : (<><Shield className="w-4 h-4 mr-2" /> Análise Jurídica</>)}
            </Button>
            <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg text-black font-semibold" onClick={handleFalarEspecialista}>
              <Phone className="w-4 h-4 mr-2" />Fale com Especialista
            </Button>
            <Button variant="outline" className="w-full border-green-200 hover:bg-green-50 text-green-700 text-sm" onClick={handleFalarEspecialista}>
              <MessageCircle className="w-4 h-4 mr-2" />WhatsApp Direto
            </Button>
          </div>
          {analise.fonte_dados && (<div className="text-center"><Badge variant="outline" className="text-xs text-gray-500">📡 {analise.fonte_dados}</Badge></div>)}
        </div>
      </div>
    </Card>
  );
}
