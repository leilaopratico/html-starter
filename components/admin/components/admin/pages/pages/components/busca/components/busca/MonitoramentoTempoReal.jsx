import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Globe, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MonitoramentoTempoReal() {
    const [stats, setStats] = useState({
        novosLeiloes: 0,
        alteracoesPreco: 0,
        analisesEmAndamento: 0,
    });

    useEffect(() => {
        const intervalId = setInterval(() => {
            setStats({
                novosLeiloes: Math.floor(Math.random() * 5),
                alteracoesPreco: Math.floor(Math.random() * 10),
                analisesEmAndamento: Math.floor(Math.random() * 3) + 1,
            });
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <Card className="w-full bg-gradient-to-r from-blue-900 to-purple-900 text-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-400 animate-pulse" />
                    Monitoramento em Tempo Real
                </CardTitle>
                <CardDescription className="text-blue-200">
                    Nossos agentes IA estão constantemente buscando e analisando oportunidades.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    key={stats.novosLeiloes}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-white/10 rounded-lg text-center"
                >
                    <Globe className="w-8 h-8 mx-auto text-green-400 mb-2"/>
                    <p className="text-2xl font-bold">{stats.novosLeiloes}</p>
                    <p className="text-sm text-blue-200">Novos Leilões (último min)</p>
                </motion.div>
                <motion.div
                    key={stats.alteracoesPreco}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-white/10 rounded-lg text-center"
                >
                    <Zap className="w-8 h-8 mx-auto text-yellow-400 mb-2"/>
                    <p className="text-2xl font-bold">{stats.alteracoesPreco}</p>
                    <p className="text-sm text-blue-200">Alterações de Preço</p>
                </motion.div>
                <motion.div
                    key={stats.analisesEmAndamento}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-white/10 rounded-lg text-center"
                >
                    <p className="text-2xl font-bold">{stats.analisesEmAndamento}</p>
                    <p className="text-sm text-blue-200">Análises IA em Andamento</p>
                </motion.div>
            </CardContent>
        </Card>
    );
}
