import { Card, CardConteudo } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface StatusCardPropriedades {
  titulo: string;
  valores: string | number;
  icones: LucideIcon;
}

export default function CardStatus({ titulo, valores, icones: Icon }: StatusCardPropriedades) {
  return (
    <Card>
      <CardConteudo className="flex items-center gap-4 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{titulo}</p>
          <p className="text-2xl font-bold">{valores}</p>
        </div>
      </CardConteudo>
    </Card>
  );
}
