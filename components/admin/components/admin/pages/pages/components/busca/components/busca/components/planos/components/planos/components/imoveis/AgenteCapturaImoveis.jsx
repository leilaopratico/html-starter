import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Bot, Search, Send, Zap } from 'lucide-react';
import GatewayPremium from '../planos/GatewayPremium';
import { useToast } from "@/components/ui/use-toast";

export default function AgenteCapturaImoveis({ usuario, onUpgrade }) {
    const [descricaoBusca, setDescricaoBusca] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleAtivarAgente = async () => {
        if (!descricaoBusca.trim()) {
            toast({
                title: "Atenção",
                description: "Por favor, descreva o imóvel que você procura.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        // Simulação de chamada a IA
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setIsLoading(false);
        setDescricaoBusca('');
        toast({
            title: "Agente Ativado!",
            description: "Nosso agente IA já está buscando as melhores oportunidades para você. Avisaremos por WhatsApp e e-mail.",
        });
    };

    return (
        <GatewayPremium funcionalidade="agente_captura" usuarioAtual={usuario} onUpgrade={onUpgrade}>
            <Card className="w-full bg-gradient-to-br from-gray-50 to-blue-100 border-2 border-blue-200">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500 rounded-full">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-900">
                                Agente IA de Captura de Imóveis
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                                Não encontrou o que queria? Deixe nosso agente trabalhar para você 24/7.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="descricao-imovel" className="font-semibold text-gray-700">
                            Descreva o imóvel dos seus sonhos:
                        </Label>
                        <Textarea
                            id="descricao-imovel"
                            placeholder="Ex: Apartamento em São Paulo, bairro Pinheiros, com 2 quartos, até R$800.000, com varanda e próximo ao metrô."
                            className="mt-1"
                            rows={4}
                            value={descricaoBusca}
                            onChange={(e) => setDescricaoBusca(e.target.value)}
                        />
                    </div>
                    <Button 
                        className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700" 
                        onClick={handleAtivarAgente}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Ativando Agente...
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5 mr-2" />
                                Ativar Agente de Captura
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </GatewayPremium>
    );
}
