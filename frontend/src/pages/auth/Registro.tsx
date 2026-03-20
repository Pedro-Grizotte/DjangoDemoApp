import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardConteudo, CardHeader, CardTitulo, CardDescricao } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { niveisDeEducacao, rangeDeSalarios } from '@/mocks/empregos';
import { toast } from 'sonner';
import { Briefcase } from 'lucide-react';

export default function PaginaRegistro() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState('');

  const enviarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
    navigate('/login');
  };

  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <Briefcase className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitulo className="text-2xl">Criar conta</CardTitulo>
          <CardDescricao>Preencha os dados para se cadastrar</CardDescricao>
        </CardHeader>
        <CardConteudo>
          <form onSubmit={enviarSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input placeholder="Seu nome completo" required />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input type="email" placeholder="seu@email.com" required />
            </div>
            <div className="space-y-2">
              <Label>Senha</Label>
              <Input type="password" placeholder="••••••••" required />
            </div>
            <div className="space-y-2">
              <Label>Tipo de conta</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="empresa">Empresa</SelectItem>
                  <SelectItem value="candidato">Candidato</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {tipo === 'candidato' && (
              <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                <div className="space-y-2">
                  <Label>Pretensão salarial</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Faixa salarial" /></SelectTrigger>
                    <SelectContent>
                      {rangeDeSalarios.map(salarios => (
                        <SelectItem key={salarios.valor} value={salarios.valor}>{salarios.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Experiência</Label>
                  <Textarea placeholder="Descreva sua experiência..." />
                </div>
                <div className="space-y-2">
                  <Label>Escolaridade</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Nível de escolaridade" /></SelectTrigger>
                    <SelectContent>
                      {niveisDeEducacao.map(educacao => (
                        <SelectItem key={educacao.valor} value={educacao.valor}>{educacao.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full">Cadastrar</Button>
            <p className="text-center text-sm text-muted-foreground">
              Já tem conta?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">Faça login</Link>
            </p>
          </form>
        </CardConteudo>
      </Card>
    </div>
  );
}
