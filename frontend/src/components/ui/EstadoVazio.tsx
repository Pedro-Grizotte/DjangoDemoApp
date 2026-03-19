import type { LucideIcon } from 'lucide-react';
import { SearchX } from 'lucide-react';

interface EstadoVazioPropriedades {
  icone?: LucideIcon;
  titulo: string;
  descricao?: string;
}

export default function EstadoVazio({ icone: Icon = SearchX, titulo, descricao }: EstadoVazioPropriedades) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{titulo}</h3>
      {descricao && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{descricao}</p>}
    </div>
  );
}
