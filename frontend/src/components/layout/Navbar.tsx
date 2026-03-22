import { Link, useLocation } from 'react-router-dom';
import type { Usuario } from '@/types';
import { Briefcase, LogOut, BarChart3, Home, Building2, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NavbarPropriedades {
  usuario: Usuario | null;
  onLogout: () => void;
}

export default function Navbar({ usuario, onLogout }: NavbarPropriedades) {
  const local = useLocation();

  const estaAtivo = (caminho: string) => local.pathname === caminho;

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="page-container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">Grizotte's Empregos</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Link to="/">
            <Button variant={estaAtivo('/') ? 'default' : 'ghost'} size="sm" className="gap-2">
              <Home className="h-4 w-4" />
              Vagas
            </Button>
          </Link>
          {usuario?.tipo === 'empresa' && (
            <>
              <Link to="/empresa/trabalhos">
                <Button variant={estaAtivo('/empresa/trabalhos') ? 'default' : 'ghost'} size="sm" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  Minhas Vagas
                </Button>
              </Link>
              <Link to="/relatorios">
                <Button variant={estaAtivo('/relatorios') ? 'default' : 'ghost'} size="sm" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Relatórios
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {usuario ? (
            <>
              <Badge variant="outline" className="hidden gap-1.5 sm:flex">
                <UserCircle className="h-3.5 w-3.5" />
                {usuario.nome}
              </Badge>
              <Badge variant={usuario.tipo === 'empresa' ? 'default' : 'secondary'} className="text-xs">
                {usuario.tipo === 'empresa' ? 'Empresa' : 'Candidato'}
              </Badge>
              <Button variant="ghost" size="sm" onClick={onLogout} title="Sair">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm">Entrar</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
