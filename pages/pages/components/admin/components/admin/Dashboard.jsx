import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building, 
  Car, 
  TrendingUp, 
  Activity, 
  DollarSign,
  Target,
  PhoneCall
} from 'lucide-react';

const metricas = [
  { titulo: 'Usuários Ativos', valor: '2.847', mudanca: '+12%', icon: Users, cor: 'text-blue-600' },
  { titulo: 'Imóveis Monitorados', valor: '15.234', mudanca: '+8%', icon: Building, cor: 'text-green-600' },
  { titulo: 'Veículos Analisados', valor: '6.892', mudanca: '+23%', icon: Car, cor: 'text-purple-600' },
  { titulo: 'Receita Mensal', valor: 'R$ 89.450', mudanca: '+15%', icon: DollarSign, cor: 'text-yellow-600' },
];

const agentesStatus = [
  { nome: 'Agente Captação', status: 'Ativo', performance: '98%', cor: 'bg-green-500' },
  { nome: 'Agente Jurídico', status: 'Ativo', performance: '95%', cor: 'bg-green-500' },
  { nome: 'Agente Marketing', status: 'Ativo', performance: '87%', cor: 'bg-yellow-500' },
  { nome: 'Agente Recuperação', status: 'Ativo', performance: '92%', cor: 'bg-green-500' },
  { nome: 'Sistema Ligações', status: 'Manutenção', performance: '0%', cor: 'bg-red-500' },
];

const leadRecentes = [
  { nome: 'João Silva', telefone: '(11) 99999-9999', interesse: 'Apartamento SP', score: 85 },
  { nome: 'Maria Santos', telefone: '(21) 88888-8888', interesse: 'Casa RJ', score: 92 },
  { nome: 'Pedro Costa', telefone: '(31) 77777-7777', interesse: 'Honda Civic', score: 78 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Executivo</h1>
        <Badge className="bg-green-100 text-green-800">Sistema Operacional</Badge>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricas.map((metrica, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metrica.titulo}
              </CardTitle>
              <metrica.icon className={`h-5 w-5 ${metrica.cor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrica.valor}</div>
              <p className="text-xs text-green-600 font-medium">
                {metrica.mudanca} vs mês anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status dos Agentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Status dos Agentes IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agentesStatus.map((agente, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${agente.cor}`}></div>
                    <div>
                      <p className="font-medium">{agente.nome}</p>
                      <p className="text-sm text-gray-500">{agente.status}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{agente.performance}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leads Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Leads Recentes (Últimas 24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leadRecentes.map((lead, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{lead.nome}</p>
                    <p className="text-sm text-gray-500">{lead.telefone}</p>
                    <p className="text-xs text-blue-600">{lead.interesse}</p>
                  </div>
                  <div className="text-center">
                    <Badge className={`${lead.score >= 90 ? 'bg-green-100 text-green-800' : 
                                        lead.score >= 80 ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-red-100 text-red-800'}`}>
                      Score: {lead.score}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas do Sistema */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-800">⚠️ Alertas do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-yellow-700">• Sistema de Ligações em manutenção programada (previsão: 2h)</p>
            <p className="text-sm text-yellow-700">• 47 leads aguardando follow-up manual</p>
            <p className="text-sm text-yellow-700">• Backup automático executado com sucesso às 03:00</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
