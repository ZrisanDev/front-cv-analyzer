# Exploration: Visualización de Créditos

## Executive Summary

El sistema YA TIENE toda la infraestructura necesaria para visualizar créditos. El endpoint `/api/payments/my-credits` devuelve `UserCreditsResponse` con datos completos (gratuitos + pagados), el hook `useCreditsBalance` ya está implementado y el componente `CreditBadge` muestra un resumen en el header. Lo que falta es una vista detallada y dedicada que muestre la información completa con mejor UX/UI.

## Current State

### ✅ Lo que existe hoy:

1. **API endpoint**: `GET /api/payments/my-credits` 
   - Retorna `UserCreditsResponse` con:
     - `free_analyses_count`: Número de análisis gratuitos usados
     - `free_analyses_limit`: Límite de análisis gratuitos (ej: 3)
     - `free_analyses_remaining`: Créditos gratuitos restantes
     - `paid_analyses_credits`: Créditos de pago disponibles
     - `total_analyses_used`: Total de análisis realizados

2. **Hook**: `useCreditsBalance()` en `modules/payment/hooks/useCredits.ts`
   - Usa `useQuery` de TanStack Query
   - Query key: `["credits", "balance"]`
   - Cache de 5 minutos
   - Se refresca en window focus y reconexión

3. **Componente actual**: `CreditBadge` en header
   - Muestra total de créditos disponibles
   - Despliega breakdown (gratis + pagos) en desktop
   - Icono de monedas (lucide-react)

4. **Tipos definidos**:
   ```typescript
   interface UserCredits {
     free_analyses_count: number
     free_analyses_limit: number
     free_analyses_remaining: number
     paid_analyses_credits: number
     total_analyses_used: number
   }
   ```

## Affected Areas

- `app/(main)/credits/page.tsx` — Nueva página de visualización (no existe)
- `modules/payment/components/CreditOverview.tsx` — Componente principal (nuevo)
- `modules/shared/components/Sidebar.tsx` — Agregar ítem al menú de navegación
- `modules/payment/index.ts` — Exportar nuevos componentes

## Architecture Options

### Option 1: Simple Card View (Low Effort)
Cards individuales mostrando cada métrica con iconos y valores.

**Pros:**
- Rápido de implementar (~1-2 horas)
- Reutiliza patrón existente (StatsCards en dashboard)
- Claro y directo

**Cons:**
- Menos "visual" 
- No muestra proporción de uso

**Esfuerzo:** Low

### Option 2: Card + Progress Bars (Medium Effort) ⭐ RECOMENDADO
Una card principal con visualización de progreso (gratuitos usados vs disponibles) y créditos pagados destacados.

**Pros:**
- Excelente UX - usuario ve de un vistazo su situación
- Reutiliza componente `Progress` existente (radix-ui)
- Muestra proporción visual de uso
- Puede incluir CTA para comprar más créditos

**Cons:**
- Requiere algo más de UI work

**Esfuerzo:** Medium

### Option 3: Full Dashboard Section (High Effort)
Sección completa en el dashboard existente con gráficos de uso histórico (requiere nuevo endpoint).

**Pros:**
- Muy completo
- Tendencias históricas

**Cons:**
- Requiere endpoint nuevo `/api/credits/history` (no existe)
- Overkill para el requerimiento actual
- Mucho más tiempo de desarrollo

**Esfuerzo:** High

## Recommendation

**Ir con Option 2 (Card + Progress Bars)** porque:
1. Es el sweet spot entre utilidad y esfuerzo
2. Los datos necesarios YA existen
3. Reutiliza patrones establecidos (Card, Progress, hooks)
4. El usuario obtiene valor inmediato con visualización clara
5. No requiere cambios en el backend

## Implementation Sketch

```typescript
// Nuevo componente: modules/payment/components/CreditOverview.tsx
interface CreditOverviewProps {
  credits: UserCredits
}

// Visualización propuesta:
// ┌─────────────────────────────────────────┐
// │  💰 Mis Créditos                        │
// │                                         │
// │  Total disponible: 12                   │
// │  ┌─────────────────────────────────┐    │
// │  │ Análisis gratuitos              │    │
// │  │ ████████░░░░ 2/3 usados         │    │
// │  │ 1 restante                      │    │
// │  └─────────────────────────────────┘    │
// │                                         │
// │  Créditos de pago: 10                   │
// │                                         │
// │  Total usados: 2 análisis               │
// │                                         │
// │  [Comprar más créditos]                 │
// └─────────────────────────────────────────┘
```

## Dependencies Available

- **UI**: `Card`, `Progress`, `Badge`, `Button` (shadcn/radix-nova)
- **Icons**: `lucide-react` (`Coins`, `Gift`, `CreditCard`, `TrendingUp`)
- **Data fetching**: `@tanstack/react-query` (hook ya existe)
- **Charts**: `recharts` disponible (si se quisiera expandir luego)

## Risks & Considerations

1. **Routing**: Decidir si es página dedicada (`/credits`) o modal/sidebar en dashboard
2. **Mobile**: El Progress puede necesitar ajustes de espaciado en pantallas chicas
3. **i18n**: El proyecto usa español consistentemente - mantener labels en español
4. **CTA**: Considerar agregar botón "Comprar créditos" que redirija a `/pricing`
5. **Real-time**: Los datos se cachean 5 minutos - suficiente para este caso

## Ready for Proposal

**YES** - Toda la infraestructura está lista. La implementación es directa y puede estimarse con confianza.

Lo que el orchestrator debería preguntar al usuario:
- ¿Prefiere página dedicada `/credits` o integrarlo en el dashboard existente?
- ¿Quiere incluir CTA para comprar créditos en la misma vista?
