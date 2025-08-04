import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { 
  Filter, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Home, 
  TrendingUp,
  Search,
  X,
  Star
} from 'lucide-react';

const estados = [
    { sigla: 'AC', nome: 'Acre' }, { sigla: 'AL', nome: 'Alagoas' }, { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' }, { sigla: 'BA', nome: 'Bahia' }, { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' }, { sigla: 'ES', nome: 'Espírito Santo' }, { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' }, { sigla: 'MT', nome: 'Mato Grosso' }, { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' }, { sigla: 'PA', nome: 'Pará' }, { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' }, { sigla: 'PE', nome: 'Pernambuco' }, { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' }, { sigla: 'RN', nome: 'Rio Grande do Norte' }, { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'RO', nome: 'Rondônia' }, { sigla: 'RR', nome: 'Roraima' }, { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SP', nome: 'São Paulo' }, { sigla: 'SE', nome: 'Sergipe' }, { sigla: 'TO', nome: 'Tocantins' }
];

export default function FiltrosAvancados({ onFilterChange }) {
  const [filtros, setFiltros] = useState({
    busca: '', tipo: '', estado: '', cidade: '', valorMin: [0], valorMax: [1000000],
    situacaoLeilao: '', dataLeilao: '', comissao: '', descontoMinimo: [30],
    riscoBaixo: false, visitacao: false
  });

  const [filtrosAtivos, setFiltrosAtivos] = useState([]);
  
  const tiposImovel = [
    { value: 'casa', label: 'Casa', icon: '🏠' },
    { value: 'apartamento', label: 'Apartamento', icon: '🏢' },
    { value: 'terreno', label: 'Terreno', icon: '🏞️' },
    { value: 'comercial', label: 'Comercial', icon: '🏪' },
    { value: 'industrial', label: 'Industrial', icon: '🏭' }
  ];

  const aplicarFiltro = (key, value) => {
    const novosFiltros = { ...filtros, [key]: value };
    setFiltros(novosFiltros);
    
    if (value && value !== '' && value !== 0 && !(Array.isArray(value) && value.length === 1 && value[0] === 0)) {
      const filtroAtivo = { key, value, label: getLabelFiltro(key, value) };
      setFiltrosAtivos(prev => {
        const filtered = prev.filter(f => f.key !== key);
        return [...filtered, filtroAtivo];
      });
    } else {
      setFiltrosAtivos(prev => prev.filter(f => f.key !== key));
    }
    onFilterChange(novosFiltros);
  };

  const getLabelFiltro = (key, value) => {
    const labels = {
      tipo: tiposImovel.find(t => t.value === value)?.label || value,
      estado: value, cidade: value,
      situacaoLeilao: value === 'ativo' ? 'Ativo' : value === 'proximoVencimento' ? 'Próximo ao Vencimento' : value,
      riscoBaixo: 'Risco Baixo', visitacao: 'Visitação Disponível',
      valorMin: `Valor Min: ${formatCurrency(value[0])}`, valorMax: `Valor Max: ${formatCurrency(value[0])}`,
      descontoMinimo: `Desconto Min: ${value[0]}%`
    };
    return labels[key] || value;
  };

  const removerFiltro = (keyToRemove) => {
    let resetValue;
    if (keyToRemove.includes('valor')) {
      resetValue = (keyToRemove === 'valorMin') ? [0] : [1000000];
    } else if (keyToRemove === 'descontoMinimo') {
      resetValue = [30];
    } else if (keyToRemove === 'riscoBaixo' || keyToRemove === 'visitacao') {
      resetValue = false;
    } else {
      resetValue = '';
    }
    const novosFiltros = { ...filtros, [keyToRemove]: resetValue };
    setFiltros(novosFiltros);
    setFiltrosAtivos(prev => prev.filter(f => f.key !== keyToRemove));
    onFilterChange(novosFiltros);
  };

  const limparFiltros = () => {
    const filtrosLimpos = {
      busca: '', tipo: '', estado: '', cidade: '', valorMin: [0], valorMax: [1000000],
      situacaoLeilao: '', dataLeilao: '', comissao: '', descontoMinimo: [30],
      riscoBaixo: false, visitacao: false
    };
    setFiltros(filtrosLimpos);
    setFiltrosAtivos([]);
    onFilterChange(filtrosLimpos);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          Filtros Avançados
          <Badge variant="outline" className="ml-2 border-blue-400 text-blue-600">Filtros de Supremacia</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por cidade, bairro, endereço ou palavra-chave..."
            value={filtros.busca}
            onChange={(e) => aplicarFiltro('busca', e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Select value={filtros.tipo} onValueChange={(value) => aplicarFiltro('tipo', value)}>
            <SelectTrigger><SelectValue placeholder="Tipo de Imóvel" /></SelectTrigger>
            <SelectContent>
              {tiposImovel.map(tipo => (
                <SelectItem key={tipo.value} value={tipo.value}>
                  <div className="flex items-center gap-2"><span>{tipo.icon}</span>{tipo.label}</div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filtros.estado} onValueChange={(value) => aplicarFiltro('estado', value)}>
            <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              {estados.map(estado => (<SelectItem key={estado.sigla} value={estado.sigla}>{estado.nome}</SelectItem>))}
            </SelectContent>
          </Select>

          <Input placeholder="Cidade" value={filtros.cidade} onChange={(e) => aplicarFiltro('cidade', e.target.value)} />

          <Select value={filtros.situacaoLeilao} onValueChange={(value) => aplicarFiltro('situacaoLeilao', value)}>
            <SelectTrigger><SelectValue placeholder="Situação" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="proximoVencimento">Próximo ao Vencimento</SelectItem>
              <SelectItem value="recemPublicado">Recém Publicado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Faixa de Valor</Label>
            <div className="px-3">
              <Slider
                range value={[filtros.valorMin[0], filtros.valorMax[0]]}
                onValueChange={(values) => { aplicarFiltro('valorMin', [values[0]]); aplicarFiltro('valorMax', [values[1]]); }}
                max={2000000} min={0} step={10000} className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>{formatCurrency(filtros.valorMin[0])}</span>
                <span>{formatCurrency(filtros.valorMax[0])}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Desconto Mínimo (%)</Label>
            <div className="px-3">
              <Slider value={filtros.descontoMinimo} onValueChange={(value) => aplicarFiltro('descontoMinimo', value)} max={80} min={0} step={5} className="w-full" />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>0%</span>
                <span className="font-medium text-green-600">{filtros.descontoMinimo[0]}% ou mais</span>
                <span>80%</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <Button variant={filtros.riscoBaixo ? "default" : "outline"} onClick={() => aplicarFiltro('riscoBaixo', !filtros.riscoBaixo)} className="justify-start">
            <Star className="w-4 h-4 mr-2" />Apenas Risco Baixo
          </Button>
          <Button variant={filtros.visitacao ? "default" : "outline"} onClick={() => aplicarFiltro('visitacao', !filtros.visitacao)} className="justify-start">
            <Calendar className="w-4 h-4 mr-2" />Visitação Disponível
          </Button>
        </div>

        {filtrosAtivos.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Filtros Aplicados:</span>
              <Button variant="ghost" size="sm" onClick={limparFiltros}><X className="w-4 h-4 mr-1" />Limpar Todos</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filtrosAtivos.map((filtro, index) => (
                <motion.div key={`${filtro.key}-${index}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-red-100 hover:text-red-700" onClick={() => removerFiltro(filtro.key)}>
                    {getLabelFiltro(filtro.key, filtro.value)}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
