import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { TipoUsuario } from '@/types';
import { Card, CardConteudo, CardHeader, CardTitulo, CardDescricao } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Briefcase, Building2, UserCircle } from 'lucide-react';

interface PaginaLoginPropriedades {
  onLogin: (perfil: TipoUsuario) => void;
}

export default function LoginPage({ onLogin }: PaginaLoginPropriedades) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLoginRapido = (perfil: TipoUsuario) => {
    onLogin(perfil);
    navigate('/');
  };

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
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="••••••••" value={senha} onChange={e => setSenha(e.target.value)} />
            </div>
            <Button className="w-full" disabled>Entrar</Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Acesso rápido</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => handleLoginRapido('empresa')}>
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-xs font-medium">Entrar como Empresa</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => handleLoginRapido('candidato')}>
              <UserCircle className="h-6 w-6 text-primary" />
              <span className="text-xs font-medium">Entrar como Candidato</span>
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Não tem conta?{' '}
            <Link to="/registro" className="font-medium text-primary hover:underline">Cadastre-se</Link>
          </p>
        </CardConteudo>
      </Card>
    </div>
  );
}
