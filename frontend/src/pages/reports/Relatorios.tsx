import ConteudoPagina from '@/components/layout/ConteudoPagina';
import CardStatus from '@/components/charts/CardStatus';
import { Card, CardConteudo, CardHeader, CardTitulo } from '@/components/ui/card';
import { TrabalhosMock } from '@/mocks/empregos';
import { AplicacoesMock } from '@/mocks/aplicacoes';
import { trabalhosPorMes, aplicacoesPorMes } from '@/mocks/relatorios';
import { Briefcase, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Relatorios() {
  return (
    <ConteudoPagina>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">Visão geral da plataforma</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <CardStatus titulo="Total de Vagas" valores={TrabalhosMock.length} icones={Briefcase} />
        <CardStatus titulo="Total de Candidaturas" valores={AplicacoesMock.length} icones={Users} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitulo className="text-base">Vagas por Mês</CardTitulo>
          </CardHeader>
          <CardConteudo>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={trabalhosPorMes}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="mes" className="text-xs" />
                <YAxis allowDecimals={false} className="text-xs" />
                <Tooltip />
                <Bar dataKey="contagem" fill="hsl(221, 83%, 53%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardConteudo>
        </Card>

        <Card>
          <CardHeader>
            <CardTitulo className="text-base">Candidaturas por Mês</CardTitulo>
          </CardHeader>
          <CardConteudo>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={aplicacoesPorMes}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="mes" className="text-xs" />
                <YAxis allowDecimals={false} className="text-xs" />
                <Tooltip />
                <Bar dataKey="contagem" fill="hsl(142, 71%, 45%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardConteudo>
        </Card>
      </div>
    </ConteudoPagina>
  );
}
