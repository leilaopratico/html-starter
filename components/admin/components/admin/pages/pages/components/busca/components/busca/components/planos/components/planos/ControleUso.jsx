import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Crown, TrendingUp, AlertCircle } from 'lucide-react';

const limitesPlanos = {
  gratuito: { buscas: 5, detalhes: 2, calculadora: 3, capturas_imoveis: 0, capturas_veiculos: 0, cor: 'gray' },
  bronze: { buscas: 50, detalhes: 15, calculadora: 20, capturas_imoveis: 0, capturas_veiculos: 0, cor: 'orange' },
  prata: { buscas: 150, detalhes: 50, calculadora: 100, capturas_imoveis: 1, capturas_veiculos: 1, cor: 'gray' },
  ouro: { buscas: 500, detalhes: 200, calculadora: 'ilimitado', capturas_imoveis: 5, capturas_veiculos: 5, cor: 'yellow' },
  premium: { buscas: 'ilimitado', detalhes: 'ilimitado', calculadora: 'ilimitado', capturas_imoveis: 'ilimitado', capturas_veiculos: 'ilimitado', cor: 'purple' }
};

export default function ControleUso({ usuario, funcionalidade, onUpgrade }) {
  if (!usuario) return null;

  const plano = usuario.plano || 'gratuito';
  const limites = limitesPlanos[plano];
  const limite = limites[funcionalidade];
  const usoAtual = usuario[`${funcionalidade}_mes`] || 0;

  if (limite === 'ilimitado') {
    return (
      <Badge className="bg-purple-100 text-purple-800 border border-purple-200">
        <Crown className="w-4 h-4 mr-2" />
        Plano Ilimitado
      </Badge>
    );
  }

  const progressPercent = (usoAtual / limite) * 100;
  const isLimiteEsgotado = usoAtual >= limite;
  
  const corProgresso = isLimiteEsgotado ? 'bg-red-500' : progressPercent > 80 ? 'bg-yellow-500' : 'bg-blue-500';

  return (
    <Card className="border-2 border-gray-200 shadow-md">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-center">
            <h4 className="font-semibold capitalize text-gray-800">{funcionalidade.replace('_', ' ')}</h4>
            <Badge variant="outline" className="capitalize">{plano}</Badge>
        </div>
        
        <Progress value={progressPercent} className={`h-2 [&>*]:${corProgresso}`} />

        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Uso: {usoAtual} / {limite}</span>
            {isLimiteEsgotado && (
                 <Button size="sm" onClick={onUpgrade} className="bg-red-600 hover:bg-red-700">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Limite Atingido - Upgrade
                </Button>
            )}
            {!isLimiteEsgotado && progressPercent > 80 && (
                <Button size="sm" onClick={onUpgrade} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Fazer Upgrade
                </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
