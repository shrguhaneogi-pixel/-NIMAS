/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * ÁNIMAS: The Sovereign 3D Ofrenda - Blueprint Verification Context (Compatibility Layer)
 * Re-exports BlueprintStateProvider and useBlueprintState as useBlueprintVerification.
 */

export {
  BlueprintStateProvider,
  BlueprintStateProvider as BlueprintVerificationProvider,
  useBlueprintState,
  useBlueprintState as useBlueprintVerification
} from './BlueprintStateContext';

export type { BlueprintStateContextType, BlueprintStateContextType as BlueprintVerificationContextType } from './BlueprintStateContext';
