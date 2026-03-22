import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConteudoPagina from '@/components/layout/ConteudoPagina';
import { Card, CardConteudo, CardHeader, CardTitulo } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const AUTH_TOKEN_CHAVE = 'auth_token';

const rangeDeSalarios = [
  { valor: 'UP_TO_1000', label: 'Até 1.000' },
  { valor: 'FROM_1000_TO_2000', label: 'De 1.000 a 2.000' },
  { valor: 'FROM_2000_TO_3000', label: 'De 2.000 a 3.000' },
  { valor: 'ABOVE_3000', label: 'Acima de 3.000' },
]

const niveisDeEducacao = [
  { valor: '1', label: 'Ensino fundamental' },
  { valor: '2', label: 'Ensino medio' },
  { valor: '3', label: 'Tecnologo' },
  { valor: '4', label: 'Ensino Superior' },
  { valor: '5', label: 'Pos / MBA / Mestrado' },
  { valor: '6', label: 'Doutorado' },
];

export default function CriarEmpregos() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [rangeSalario, setRangeSalario] = useState('');
  const [requisitos, setRequisitos] = useState('');
  const [educacao, setEducacao] = useState('');
  const [carregando, setCarregando] = useState(false);

  const enviarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem(AUTH_TOKEN_CHAVE);
    if (!token || token === 'null' || token === 'undefined') {
      toast.error('Você precisa estar autenticado como empresa.');
      return;
    }

    if (!rangeSalario) {
      toast.error('Selecione a faixa salarial.');
      return;
    }

    if (!educacao) {
      toast.error('Selecione a escolaridade minima.');
      return;
    }
    const payload = {
      nome: titulo,
      range_salario: rangeSalario,
      requisitos,
      educacao_minima: Number(educacao),
    };

    try {
      setCarregando(true);
      const resposta = await fetch('/api/trabalhos/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const dados = await resposta.json();
      if (!resposta.ok) {
        const mensagem = dados?.detail || dados?.nome?.[0] || dados?.range_salario?.[0] || dados?.requisitos?.[0] || dados?.educacao_minima?.[0] ||'Nao foi possivel criar a vaga.';
        throw new Error(mensagem);
      }
      toast.success('Vaga criada com sucesso!');
      navigate('/empresa/trabalhos');
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro inesperado ao criar vaga.';
      toast.error(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ConteudoPagina>
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitulo>Nova Vaga</CardTitulo>
        </CardHeader>
        <CardConteudo>
          <form onSubmit={enviarSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Título da Vaga</Label>
              <Input placeholder="Ex: Analista de Marketing" value={titulo} onChange={e => setTitulo(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Faixa Salarial</Label>
              <Select value={rangeSalario} onValueChange={setRangeSalario}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {rangeDeSalarios.map(r => <SelectItem key={r.valor} value={r.valor}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Escolaridade Mínima</Label>
              <Select value={educacao} onValueChange={setEducacao}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {niveisDeEducacao.map(e => <SelectItem key={e.valor} value={e.valor}>{e.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Requisitos</Label>
              <Textarea placeholder="Descreva os requisitos da vaga..." value={requisitos} onChange={e => setRequisitos(e.target.value)} required />
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate('/empresa/trabalhos')} disabled={carregando}>Cancelar</Button>
              <Button type="submit" disabled={carregando}>
                {carregando ? 'Criar Vaga' : 'Criar Vaga'}
              </Button>
            </div>
          </form>
        </CardConteudo>
      </Card>
    </ConteudoPagina>
  );
}
