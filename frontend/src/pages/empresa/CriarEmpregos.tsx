import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConteudoPagina from '@/components/layout/ConteudoPagina';
import { Card, CardConteudo, CardHeader, CardTitulo } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { rangeDeSalarios, niveisDeEducacao } from '@/mocks/empregos';
import { toast } from 'sonner';

export default function CriarEmpregos() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [rangeSalario, setRangeSalario] = useState('');
  const [requisitos, setRequisitos] = useState('');
  const [educacao, setEducacao] = useState('');

  const enviarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Vaga criada com sucesso!');
    navigate('/empresa/trabalhos');
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
              <Button type="button" variant="outline" onClick={() => navigate('/empresa/trabalhos')}>Cancelar</Button>
              <Button type="submit">Criar Vaga</Button>
            </div>
          </form>
        </CardConteudo>
      </Card>
    </ConteudoPagina>
  );
}
