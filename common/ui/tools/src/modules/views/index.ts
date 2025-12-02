/**
 * View Management System
 *
 * This module provides three patterns for managing server-side views, each optimized
 * for different lifecycle and sharing requirements.
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * ## 1. Static Views - Application Lifetime
 *
 * Initialized once at startup, active forever. Used for reference data.
 *
 * ```typescript
 * // App initialization
 * await initStaticView({ slot: 'accounts', service: 'money', method: 'notifyAccounts' });
 *
 * // Component usage
 * const accounts = useSelector(state => views.getViewBySlot(state, 'accounts'));
 * ```
 *
 * - ✓ No criteria (fixed data)
 * - ✓ Never destroyed
 * - ✓ Stored in Redux slots
 * - Examples: accounts, groups, types, device classes
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * ## 2. Shared Views - Page Lifetime with Ref Counting
 *
 * Shared across components, created on first mount, destroyed when all unmount.
 *
 * ```typescript
 * export function useLiveDevicesView() {
 *   return useSharedView({
 *     slot: 'live-devices',
 *     service: 'live',
 *     method: 'notifyDevices',
 *   });
 * }
 * ```
 *
 * - ✓ No criteria (same data for all)
 * - ✓ Automatic ref counting (0→1 creates, 1→0 destroys)
 * - ✓ Slot = sharing key
 * - Examples: live data, dashboards, page summaries
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * ## 3. Criteria Views - Component Lifetime, Not Shared
 *
 * Component-specific views with dynamic criteria. Each component creates its own.
 *
 * ```typescript
 * export function useStatsView() {
 *   const type = useSelector(getType);
 *   const criteria = useSelector(getCriteria);
 *
 *   return useCriteriaView({
 *     service: 'energy',
 *     method: 'notifyStats',
 *     criteria: { type, criteria },
 *   });
 * }
 * ```
 *
 * - ✓ Has criteria (filtered/parameterized)
 * - ✓ Updates when criteria changes
 * - ✓ No slots (component owns view)
 * - ✓ Not shared (independent instances)
 * - Examples: filtered reports, search results, detail views
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * ## Quick Reference
 *
 * | Pattern     | Lifetime    | Criteria | Shared | Storage      |
 * |-------------|-------------|----------|--------|--------------|
 * | Static      | Application | None     | Global | Redux slot   |
 * | Shared      | Page        | None     | Yes    | Redux slot   |
 * | Criteria    | Component   | Dynamic  | No     | Component    |
 */
import * as api from '../../api';
import { View } from './types';
export { getViewBySlot, getViewById, viewChange, viewClose } from './store';
export { initStaticView, useCriteriaView, useSharedView } from './behaviors';

export type { View };

export function filter<TEntity extends api.Entity>(view: View<TEntity>, predicate: (item: TEntity) => boolean): View<TEntity> {
  const filteredView: View<TEntity> = {};

  for (const [id, item] of Object.entries(view)) {
    if (predicate(item)) {
      filteredView[id] = item;
    }
  }

  return filteredView;
}
