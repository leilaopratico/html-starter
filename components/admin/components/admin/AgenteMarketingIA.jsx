import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, MessageCircle, BarChart, Settings, Play } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const campanhas = [
    { nome: 'Imóveis SP - Oportunidade Única', canal: 'Facebook Ads', status: 'Ativa', orcamento: 'R$ 5.000', cpl: 'R$ 12,50', progresso: 75, cor: 'bg-green-500' },
    { nome: 'Veículos Usados - Leilão', canal: 'Google Ads', status: 'Ativa', orcamento: 'R$ 3.500', cpl: 'R$ 18,20', progresso: 45, cor: 'bg-green-500' },
    { nome: 'Newsletter Semanal de Oportunidades', canal: 'Email', status: 'Agendada', orcamento: 'N/A', cpl: 'N/A', progresso: 0, cor: 'bg-yellow-500' },
    { nome: 'Venda Direta - Últimas Unidades', canal: 'WhatsApp', status: 'Pausada', orcamento: 'R$ 1.200', cpl: 'R$ 8,90', progresso: 90, cor: 'bg-red-500' }
];

export default function AgenteMarketingIA() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="w-6 h-6 text-pink-600"/>
                        Agente de Marketing com IA
                    </CardTitle>
                    <CardDescription>Cria, gerencia e otimiza campanhas de marketing digital para atrair leads qualificados.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 border rounded-lg text-center">
                        <BarChart className="w-8 h-8 mx-auto text-pink-500 mb-2"/>
                        <p className="text-2xl font-bold">4</p>
                        <p className="text-sm text-gray-500">Campanhas Ativas</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                        <MessageCircle className="w-8 h-8 mx-auto text-cyan-500 mb-2"/>
                        <p className="text-2xl font-bold">1,892</p>
                        <p className="text-sm text-gray-500">Leads Gerados (Mês)</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                        <p className="text-2xl font-bold">R$ 13,45</p>
                        <p className="text-sm text-gray-500">Custo por Lead (Médio)</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Gerenciador de Campanhas</CardTitle>
                        <Button>
                            <Play className="w-4 h-4 mr-2" />
                            Nova Campanha
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {campanhas.map((campanha, index) => (
                        <div key={index} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-3 h-3 rounded-full ${campanha.cor}`}></div>
                                    <p className="font-bold">{campanha.nome}</p>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                                    <span>Canal: <Badge variant="secondary">{campanha.canal}</Badge></span>
                                    <span>Orçamento: <Badge variant="outline">{campanha.orcamento}</Badge></span>
                                    <span>CPL: <Badge variant="outline">{campanha.cpl}</Badge></span>
                                </div>
                                <Progress value={campanha.progresso} className="mt-3 h-2" />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon">
                                    <BarChart className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Settings className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
