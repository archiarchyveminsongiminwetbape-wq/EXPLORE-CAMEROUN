import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { 
  ToggleGroupSingleProps, 
  ToggleGroupMultipleProps 
} from '@radix-ui/react-toggle-group'; 
import { type VariantProps } from 'class-variance-authority';

// L'erreur "Impossible de localiser le module '@/lib/utils'" vient de votre tsconfig.json.
// L'alias '@/lib/utils' pointe vers 'source/lib/utils', ce chemin est maintenant utilisé.
import { cn } from '@/lib/utils';
import { toggleVariants } from '@/components/ui/toggle'; 

// --- Définitions de types ---
type ToggleGroupItemBaseProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>;
// Le type des propriétés de variante de CVA
type ToggleVariants = VariantProps<typeof toggleVariants>;
// Type de base Radix Root (sans type spécifique 'single'/'multiple')
type ToggleGroupRootProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>;


// --- Contexte ---

const ToggleGroupContext = React.createContext<ToggleVariants>({
  // Les valeurs par défaut doivent correspondre à celles de toggleVariants
  size: 'default',
  variant: 'default',
});

// --- ToggleGroup (Composant Racine) ---

// 1. Définition du type ToggleGroupProps
// On assure que 'variant' et 'size' sont retirées du type de base Radix (même si elles n'y sont pas)
// pour éviter que TypeScript ne lise des props non-existantes.
type ToggleGroupProps = 
  Omit<ToggleGroupRootProps, 'variant' | 'size'> & // Type de base Radix OMITTÉ
  (ToggleGroupSingleProps | ToggleGroupMultipleProps) & // Union des props Radix
  ToggleVariants; // Ajout des props CVA


const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(({ className, variant, size, children, ...props }, ref) => {
  // Extraction des props CVA pour satisfaire le compilateur strict
  const cvaProps = { variant, size };
  
  return (
    <ToggleGroupPrimitive.Root 
      ref={ref} 
      className={cn('flex items-center justify-center gap-1', className)} 
      // 2. Assertion de type: Garantit que les '...props' sont valides pour ToggleGroupPrimitive.Root
      // même si l'union de types pose problème.
      {...props as ToggleGroupRootProps} 
    >
      <ToggleGroupContext.Provider 
        // 3. Assertion de type sur la valeur du contexte pour résoudre les erreurs 'variant'/'size' n'existe pas sur ToggleVariants
        value={cvaProps as ToggleVariants}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
});

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;


// --- ToggleGroupItem (Élément Enfant) ---

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  // 4. Définition de l'Item: Omit des clés des props de base, puis intersection avec les Variants CVA
  Omit<ToggleGroupItemBaseProps, 'variant' | 'size'> & ToggleVariants
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  // 5. Assertion de type lors de la déstructuration pour garantir que 'variant' et 'size' ont le type ToggleVariants['...']
  const itemVariant = variant as ToggleVariants['variant'];
  const itemSize = size as ToggleVariants['size'];

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          // Utilisation de l'opérateur de coalescence des nuls (??)
          variant: context.variant ?? itemVariant, 
          size: context.size ?? itemSize,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };