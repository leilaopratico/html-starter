import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown } from 'lucide-react';

const planosNecessarios = {
    busca_avancada: { nome: 'Bronze', redirect: 'bronze' },
    check_tecnico: { nome: 'Ouro', redirect: 'ouro' },
    analise_juridica: { nome: 'Prata', redirect: 'prata' },
    agente_captura: { nome: 'Ouro', redirect: 'ouro' },
    default: { nome: 'Bronze', redirect: 'bronze' }
};

export default function GatewayPremium({
    children,
    funcionalidade = 'default',
    usuarioAtual,
    onUpgrade
}) {
    const planoNecessario = planosNecessarios[funcionalidade] || planosNecessarios.default;

    const temAcesso = () => {
        if (!usuarioAtual) return false;
        
        const hierarquiaPlanos = {
            gratuito: 0,
            bronze: 1,
            prata: 2,
            ouro: 3,
            premium: 4,
        };
        
        const nivelUsuario = hierarquiaPlanos[usuarioAtual.plano] || 0;
        const nivelNecessario = hierarquiaPlanos[planoNecessario.nome.toLowerCase()] || 1;

        return nivelUsuario >= nivelNecessario;
    };

    if (temAcesso()) {
        return <>{children}</>;
    }

    return (
        <div className="relative">
            <div className="blur-sm grayscale pointer-events-none">
                {children}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <Card className="max-w-md w-full text-center shadow-2xl border-2 border-yellow-400">
                    <CardHeader>
                        <div className="mx-auto bg-yellow-400 p-3 rounded-full w-fit mb-2">
                           <Lock className="w-8 h-8 text-yellow-900" />
                        </div>
                        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                           <Crown className="w-6 h-6 text-yellow-500" />
                           Funcionalidade Premium
                        </CardTitle>
                        <CardDescription>
                            Faça upgrade para o plano <strong>{planoNecessario.nome}</strong> ou superior para acessar este recurso exclusivo.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-gray-600">
                            Desbloqueie análises mais profundas, agentes automáticos e a vantagem competitiva que você precisa para arrematar as melhores oportunidades.
                        </p>
                        <Button 
                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold"
                            onClick={() => onUpgrade(planoNecessario.redirect)}
                        >
                            Fazer Upgrade Agora
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
