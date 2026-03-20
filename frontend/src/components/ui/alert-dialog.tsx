import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "@/components/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const AlertaDialogo = AlertDialogPrimitive.Root;

const AlertaDialogoTrigger = AlertDialogPrimitive.Trigger;

const AlertaDialogoPortal = AlertDialogPrimitive.Portal;

const AlertaDialogoOverlay = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay className={cn( "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className )} {...props} ref={ref} />
));
AlertaDialogoOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

const AlertaDialogoConteudo = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Content>, React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>>(({ className, ...props }, ref) => (
  <AlertaDialogoPortal>
    <AlertaDialogoOverlay />
    <AlertDialogPrimitive.Content ref={ref} className={cn( "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", className )} {...props} />
  </AlertaDialogoPortal>
));
AlertaDialogoConteudo.displayName = AlertDialogPrimitive.Content.displayName;

const AlertaDialogoHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
AlertaDialogoHeader.displayName = "AlertaDialogoHeader";

const AlertaDialogoFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
AlertaDialogoFooter.displayName = "AlertaDialogoFooter";

const AlertaDialogoTitulo = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
));
AlertaDialogoTitulo.displayName = AlertDialogPrimitive.Title.displayName;

const AlertaDialogoDescricao = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Description>, React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
AlertaDialogoDescricao.displayName = AlertDialogPrimitive.Description.displayName;

const AlertaDialogoAcao = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Action>, React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
));
AlertaDialogoAcao.displayName = AlertDialogPrimitive.Action.displayName;

const AlertaDialogoCancelar = React.forwardRef<React.ElementRef<typeof AlertDialogPrimitive.Cancel>, React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel ref={ref} className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)} {...props} />
));
AlertaDialogoCancelar.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertaDialogo,
  AlertaDialogoPortal,
  AlertaDialogoOverlay,
  AlertaDialogoTrigger,
  AlertaDialogoConteudo,
  AlertaDialogoHeader,
  AlertaDialogoFooter,
  AlertaDialogoTitulo,
  AlertaDialogoDescricao,
  AlertaDialogoAcao,
  AlertaDialogoCancelar,
};
