import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardConteudo, CardHeader, CardTitulo, CardDescricao } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Briefcase } from 'lucide-react';

const niveisDeEducacao = [
  { valor: '1', label: "Ensino fundamental" },
  { valor: '2', label: "Ensino medio" },
  { valor: '3', label: "Tecnologo" },
  { valor: '4', label: "Ensino Superior" },
  { valor: '5', label: "Pos / MBA / Mestrado" },
  { valor: '6', label: "Doutorado" },
]

export default function PaginaRegistro() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [salarioExpectativa, setSalarioExpectativa] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [nivelEducacao, setNivelEducacao] = useState('');
  const [carregando, setCarregando] = useState(false);

  const enviarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipo) {
      toast.error('Selecione o tipo de conta.');
      return;
    }

    const payload: Record<string, unknown> = {
      email,
      senha,
      tipo: tipo === 'empresa' ? 'EMPRESA' : 'CADIDATO',
    };

    if (tipo === 'candidato') {
      payload.candidato_perfil = {
        salario_expectativa: salarioExpectativa,
        experiencia,
        nivel_educacao: Number(nivelEducacao),
      };
    }

    try {
      setCarregando(true);
      const resposta = await fetch('/api/contas/registro/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        const mensagem = 
          dados?.detail ||
          dados?.email?.[0] ||
          dados?.senha?.[0] ||
          dados?.candidato_perfil?.[0] ||
          'Nao foi possivel concluir o cadastro.';
        throw new Error(mensagem)
      }
      toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro inesperado ao cadastrar.';
      toast.error(mensagem);
    } finally {
      setCarregando(false);
    }
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
              <Input type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Senha</Label>
              <Input type="password" placeholder="••••••••" value={senha} onChange={e => setSenha(e.target.value)} required />
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
                  <Input 
                    type='number'
                    min='0'
                    step='0.01'
                    placeholder='2500.00'
                    value={salarioExpectativa}
                    onChange={e => setSalarioExpectativa(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Experiência</Label>
                  <Textarea placeholder="Descreva sua experiência..." value={experiencia} onChange={e => setExperiencia(e.target.value)} required />
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

            <Button type="submit" className="w-full" disabled={carregando}>
              {carregando ? 'Cadastrar' : 'Cadastrar'}
            </Button>
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
