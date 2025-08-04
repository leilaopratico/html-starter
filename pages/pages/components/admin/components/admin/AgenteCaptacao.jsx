import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Globe, Building, Bot, RefreshCw } from 'lucide-react';

const fontesData = [
  { nome: 'Banco Inter', propriedades: 45, tipo: 'dados', status: 'Ativo', cor: 'bg-green-500' },
  { nome: 'Safra Properties', propriedades: 37, tipo: 'dados', status: 'Ativo', cor: 'bg-green-500' },
  { nome: 'Leilão Imóvel', propriedades: 67, tipo: 'dados', status: 'Ativo', cor: 'bg-green-500' },
  { nome: 'Caixa Econômica', propriedades: 89, tipo: 'dados', status: 'Ativo', cor: 'bg-green-500' },
  { nome: 'Banco do Brasil', propriedades: 56, tipo: 'dados', status: 'Ativo', cor: 'bg-green-500' },
  { nome: 'Santander', propriedades: 43, tipo: 'dados', status: 'Ativo', cor: 'bg-green-500' },
  { nome: 'ONR', propriedades: 78, tipo: 'dados', status: 'Manutenção', cor: 'bg-yellow-500' },
  { nome: 'Zukerman', propriedades: 112, tipo: 'dados', status: 'Ativo', cor: 'bg-green-500' },
  { nome: 'Sodré Santoro', propriedades: 154, tipo: 'veiculos', status: 'Ativo', cor: 'bg-green-500' },
  { nome: 'Copart', propriedades: 210, tipo: 'veiculos', status: 'Ativo', cor: 'bg-green-500' },
];

const leadsRecentes = [
  { id: 1, tipo: 'Imóvel', descricao: 'Apartamento 3 quartos, SP', fonte: 'Caixa Econômica', status: 'Analisando', cor: 'default' },
  { id: 2, tipo: 'Veículo', descricao: 'Honda Civic 2022', fonte: 'Copart', status: 'Qualificado', cor: 'outline' },
  { id: 3, tipo: 'Imóvel', descricao: 'Casa com piscina, RJ', fonte: 'Banco Inter', status: 'Analisando', cor: 'default' },
  { id: 4, tipo: 'Imóvel', descricao: 'Terreno comercial, MG', fonte: 'Zukerman', status: 'Desqualificado', cor: 'destructive' },
];

export default function AgenteCaptacao() {
    const getStatusVariant = (status) => {
        switch (status) {
            case 'Analisando': return 'default';
            case 'Qualificado': return 'outline';
            case 'Desqualificado': return 'destructive';
            default: return 'default';
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-6 h-6 text-blue-600"/>
                        Agente de Captação de Leads
                    </CardTitle>
                    <CardDescription>Monitora mais de 150 fontes em tempo real para encontrar as melhores oportunidades de leilão.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 border rounded-lg text-center">
                        <Globe className="w-8 h-8 mx-auto text-blue-500 mb-2"/>
                        <p className="text-2xl font-bold">{fontesData.length}</p>
                        <p className="text-sm text-gray-500">Fontes Monitoradas</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                        <Building className="w-8 h-8 mx-auto text-green-500 mb-2"/>
                        <p className="text-2xl font-bold">1,245</p>
                        <p className="text-sm text-gray-500">Leads Capturados (Mês)</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                        <Bot className="w-8 h-8 mx-auto text-purple-500 mb-2"/>
                        <p className="text-2xl font-bold">99.8%</p>
                        <p className="text-sm text-gray-500">Uptime do Agente</p>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Fontes de Dados Ativas</CardTitle>
                        <div className="flex items-center justify-end">
                            <Button variant="outline" size="sm">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Sincronizar Fontes
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Fonte</TableHead>
                                    <TableHead className="text-right">Propriedades</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fontesData.map((fonte, index) => (
                                    <TableRow key={index}>
                                        <TableCell><div className={`w-3 h-3 rounded-full ${fonte.cor}`}></div></TableCell>
                                        <TableCell className="font-medium">{fonte.nome}</TableCell>
                                        <TableCell className="text-right">{fonte.propriedades}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Leads Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead>Fonte</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leadsRecentes.map((lead) => (
                                    <TableRow key={lead.id}>
                                        <TableCell>{lead.tipo}</TableCell>
                                        <TableCell>{lead.descricao}</TableCell>
                                        <TableCell>{lead.fonte}</TableCell>
                                        <TableCell><Badge variant={getStatusVariant(lead.status)}>{lead.status}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
