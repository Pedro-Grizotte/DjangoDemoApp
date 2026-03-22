import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardConteudo, CardHeader, CardTitulo, CardDescricao } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase } from 'lucide-react';

interface RespostaLoginAPI {
  token: string;
  user: {
    id: number;
    email: string;
    tipo: 'EMPRESA' | 'CANDIDATO';
    candidato_perfil: {
      salario_expectativa: string;
      experiencia: string;
      nivel_educacao: number;
    } | null;
  };
}

interface PaginaLoginPropriedades {
  onLogin: (dados: RespostaLoginAPI) => void;
}

export default function LoginPage({ onLogin }: PaginaLoginPropriedades) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const enviarLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setCarregando(true);
      const resposta = await fetch('/api/contas/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        const mensagem = 
          dados?.detail ||
          dados?.non_field_errors?.[0] ||
          'Não foi possivel fazer login.';
          throw new Error(mensagem);
      }
      onLogin(dados);
      toast.success('Login realizado com sucesso.');
      navigate('/');
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Erro inesperado ao fazer login.';
      toast.error(mensagem);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <Briefcase className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitulo className="text-2xl">Bem-vindo de volta</CardTitulo>
          <CardDescricao>Acesse sua conta na plataforma</CardDescricao>
        </CardHeader>

        <CardConteudo className="space-y-6">
            <form onSubmit={enviarLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="••••••••" value={senha} onChange={e => setSenha(e.target.value)} required />
              </div>

              <Button type="submit" className="w-full" disabled={carregando}>
                {carregando ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Não tem conta?{' '}
              <Link to="/registro" className="font-medium text-primary hover:underline">
                Cadastre-se
              </Link>
            </p>
          </CardConteudo>
      </Card>
    </div>
  );
}
