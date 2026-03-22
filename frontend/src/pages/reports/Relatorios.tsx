import { useEffect, useState } from 'react';
import ConteudoPagina from '@/components/layout/ConteudoPagina';
import CardStatus from '@/components/charts/CardStatus';
import { Card, CardConteudo, CardHeader, CardTitulo } from '@/components/ui/card';
import { Briefcase, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const AUTH_TOKEN_CHAVE = 'auth_token';

interface ReportMensal {
  mes: string;
  contagem: number;
}

interface RelatoriosAPI {
  total_vagas: number;
  total_candidaturas: number;
  vagas_por_mes: ReportMensal[];
  candidaturas_por_mes: ReportMensal[];
}

export default function Relatorios() {
  const [relatorio, setRelatorio] = useState<RelatoriosAPI | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarRelatorios = async () => {
      const token = localStorage.getItem(AUTH_TOKEN_CHAVE);

      if (!token || token === 'null' || token === 'undefined') {
        toast.error('Token de autenticacao nao encontrado. Faca login novamente.');
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);

        const resposta = await fetch(`/api/trabalhos/relatorios/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const dados = await resposta.json();
        if (!resposta.ok) {
          const mensagem = dados?.detail || 'Não foi possivel carregar os relatorios.';
          throw new Error(mensagem);
        }

        setRelatorio(dados);
      } catch (error) {
        const mensagem = error instanceof Error ? error.message : 'Erro inesperado ao carregar os relatorios.';
        toast.error(mensagem);
      } finally {
        setCarregando(false);
      }
    };

    carregarRelatorios();
  }, []);

  return (
    <ConteudoPagina>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">Visão geral da plataforma</p>
      </div>

      {carregando ? (
        <p className="text-sm text-muted-foreground">Carregando relatórios...</p>
      ) : !relatorio ? (
        <p className="text-sm text-muted-foreground">Nao foi possivel carregar os relatórios.</p>
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <CardStatus titulo="Total de Vagas" valores={relatorio.total_vagas} icones={Briefcase} />
            <CardStatus titulo="Total de Candidaturas" valores={relatorio.total_candidaturas} icones={Users} />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitulo className="text-base">Vagas por Mês</CardTitulo>
              </CardHeader>
              <CardConteudo>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={relatorio.vagas_por_mes}>
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
                  <BarChart data={relatorio.candidaturas_por_mes}>
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
        </>
      )}
    </ConteudoPagina>
  );
}
