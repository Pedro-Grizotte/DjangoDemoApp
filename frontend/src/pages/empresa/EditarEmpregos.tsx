import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TrabalhosMock, rangeDeSalarios, niveisDeEducacao } from '@/mocks/empregos';
import ConteudoPagina from '@/components/layout/ConteudoPagina';
import { Card, CardConteudo, CardHeader, CardTitulo } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function EditarEmpregos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const emprego = TrabalhosMock.find(j => j.id === Number(id));

  const [titulo, setTitulo] = useState(emprego?.titulo ?? '');
  const [rangeSalario, setRangeSalario] = useState(emprego?.salario_range ?? '');
  const [requisitos, setRequisitos] = useState(emprego?.requisitos ?? '');
  const [educacao, setEducacao] = useState(emprego?.educacao_minima ?? '');

  if (!emprego) {
    return <ConteudoPagina><p className="text-muted-foreground">Vaga não encontrada.</p></ConteudoPagina>;
  }

  const enviarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Vaga atualizada com sucesso!');
    navigate('/empresa/trabalhos');
  };

  return (
    <ConteudoPagina>
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitulo>Editar Vaga</CardTitulo>
        </CardHeader>
        <CardConteudo>
          <form onSubmit={enviarSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Título da Vaga</Label>
              <Input value={titulo} onChange={e => setTitulo(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Faixa Salarial</Label>
              <Select value={rangeSalario} onValueChange={setRangeSalario}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {rangeDeSalarios.map(r => <SelectItem key={r.valor} value={r.valor}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Escolaridade Mínima</Label>
              <Select value={educacao} onValueChange={setEducacao}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {niveisDeEducacao.map(e => <SelectItem key={e.valor} value={e.valor}>{e.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Requisitos</Label>
              <Textarea value={requisitos} onChange={e => setRequisitos(e.target.value)} required />
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate('/empresa/trabalhos')}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </CardConteudo>
      </Card>
    </ConteudoPagina>
  );
}
