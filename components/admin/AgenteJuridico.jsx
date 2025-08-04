import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Shield, FileText, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const analisesRecentes = [
  { id: 1, leilao: 'Apartamento em SP', processo: '0012345-67.2023.8.26.0001', risco: 'Baixo', status: 'Concluída' },
  { id: 2, leilao: 'Casa em Campinas', processo: '1122334-99.2022.8.26.0114', risco: 'Médio', status: 'Concluída' },
  { id: 3, leilao: 'Terreno em Atibaia', processo: '2233445-11.2023.8.26.0048', risco: 'Alto', status: 'Concluída' },
  { id: 4, leilao: 'Veículo Honda Civic', processo: 'N/A', risco: 'Pendente', status: 'Em Análise' },
];

export default function AgenteJuridico() {
    const getRiscoBadge = (risco) => {
        switch (risco) {
            case 'Baixo': return 'bg-green-100 text-green-800 border-green-200';
            case 'Médio': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Alto': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Concluída': return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'Em Análise': return <Clock className="w-4 h-4 text-blue-600 animate-spin" />;
            default: return null;
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-6 h-6 text-orange-600"/>
                        Agente de Análise Jurídica
                    </CardTitle>
                    <CardDescription>Automatiza a verificação de processos judiciais e documentação para avaliar o risco de cada leilão.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 border rounded-lg text-center">
                        <FileText className="w-8 h-8 mx-auto text-orange-500 mb-2"/>
                        <p className="text-2xl font-bold">487</p>
                        <p className="text-sm text-gray-500">Análises no Mês</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                        <CheckCircle className="w-8 h-8 mx-auto text-green-500 mb-2"/>
                        <p className="text-2xl font-bold">92%</p>
                        <p className="text-sm text-gray-500">Análises Aprovadas (Risco Baixo/Médio)</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                        <AlertTriangle className="w-8 h-8 mx-auto text-red-500 mb-2"/>
                        <p className="text-2xl font-bold">8%</p>
                        <p className="text-sm text-gray-500">Análises com Risco Alto</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Análises Jurídicas Recentes</CardTitle>
                    <CardDescription>Visualização das últimas análises processadas pelo agente.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Leilão</TableHead>
                                <TableHead>Nº do Processo</TableHead>
                                <TableHead>Nível de Risco</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {analisesRecentes.map((analise) => (
                                <TableRow key={analise.id}>
                                    <TableCell className="font-medium">{analise.leilao}</TableCell>
                                    <TableCell className="font-mono text-xs">{analise.processo}</TableCell>
                                    <TableCell>
                                        <Badge className={getRiscoBadge(analise.risco)}>{analise.risco}</Badge>
                                    </TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        {getStatusIcon(analise.status)}
                                        {analise.status}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm">Ver Detalhes</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
