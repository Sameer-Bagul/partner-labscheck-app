# Conversion Report: `src/` → `mobile/`

Generated: 2025-10-31

## Summary
- Web (Next.js) source: `src/`
- Mobile (Expo) app: `mobile/`

Quick snapshot:
- Files under `src/components`: ~102 files (many UI & dashboard components)
- Files under `mobile/components`: 2 UI components (`Button.tsx`, `Input.tsx`)

Conclusion: The mobile app is a partial port of the web app. Core API client exists and some pages exist, but the majority of web components, providers, hooks, and dashboard pages are not yet ported.

---

## Key findings

1. API client
- `mobile/lib/api-client.ts` exists and is adapted to mobile (uses `expo-secure-store`, reads `EXPO_PUBLIC_API_URL`). This is a good shared foundation.
- `src/lib/axios-client.ts` contains web-specific refresh logic; consider consolidating shared logic into a `shared/` module.

2. Components
- `src/components/` contains many components used across the web app (forms, tables, layout components, dashboard widgets).
- `mobile/components/` currently contains only `Button.tsx` and `Input.tsx` (lightweight mobile primitives).
- Recommendation: port commonly used primitives first: Card, List, Form, Modal/Sheet, Pagination/Spinner, Avatar, Badge, and Table/List views adapted for mobile.

3. Providers
- `src/providers/` contains `auth-Provider.tsx`, `query-provider.tsx`, `theme-provider.tsx`, `google-maps-provider.tsx`, etc.
- `mobile/providers/` is missing. Porting `auth` and `query` providers to mobile is high priority.

4. Hooks
- Many web hooks exist in `src/hooks/` (infinite scroll, store, geo utils). Mobile has fewer hooks; port reusable hooks where possible.

5. Pages / Routes
- `src/app/(dashboard)` has many pages covering tests, users, profile, subscriptions, invoices, etc.
- `mobile/app/(dashboard)` currently has: `home.tsx`, `labs.tsx`, `bookings.tsx`, `profile.tsx` and `_layout.tsx`. Several dashboard screens are missing.

6. Native modules
- `mobile/package.json` includes native packages such as `@shopify/react-native-skia`, `react-native-maps`, `react-native-reanimated`, `expo-secure-store` and others. These may require EAS/custom dev client to fully test.

7. Assets
- `app.json` previously referenced images that were missing. I removed those references to avoid Metro failing. Add `mobile/assets/` with icons and splash images when available.


## Suggested priority porting plan
1. Shared types & API (high)
   - Move `src/types/*` and `src/lib/axios-client.ts` shared parts into `shared/` or `mobile/lib/shared/`.
   - Ensure mobile API client uses `expo-secure-store` for tokens.

2. Providers (high)
   - `auth-provider` (session handling), `query-provider` (@tanstack/react-query), `theme-provider`.

3. Authentication screens (high)
   - Sign in, Sign up, Forgot password, Verify OTP.

4. Core dashboard screens (mid)
   - Labs list, Bookings, Profile, Tests list.

5. UI primitives & forms (mid)
   - Port UI primitives used across many pages: Card, List/FlatList wrappers, Form components, Inputs, Buttons, Modal/Sheet.

6. Complex features (low/after core)
   - Charts (Victory), Skia components, Razorpay integration, Maps features (may require EAS/dev-client).


## Concrete missing-file examples (non-exhaustive)
These are representative files present in `src/components/` that have no counterpart in `mobile/components/`:
- `src/components/layout/navbar/index.tsx`
- `src/components/layout/sidebar/index.tsx`
- `src/components/dashboard/tests/form.tsx`
- `src/components/dashboard/bookings/bookings.tsx`
- `src/components/ui/table.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/pagination.tsx`
- `src/components/ui/file-upload.tsx`
- `src/components/dashboard/subscriptions/InvoicePDF.tsx`
- `src/components/dashboard/profile/profile.tsx`

(There are ~100 more; consider generating an exhaustive list if needed.)


## Next steps I can take (pick one or ask for a different scope)
- Generate a complete exhaustive mapping file listing every `src/components/**` file that has no counterpart in `mobile/components/**` (I can include counts and suggested target names).
- Scaffold `mobile/providers/` with `auth-provider.tsx` and `query-provider.tsx` adapted for Expo.
- Create `mobile/SETUP.md` with EAS/dev-client instructions, env recommendations, and steps to run on emulator/device.
- Start porting the top-priority pages (auth screens) into `mobile/app/(auth)` and wire providers for a working auth flow.


---

If you'd like, I can now generate the exhaustive missing-file list and add it to this report. Or I can scaffold the providers and auth screens so you can start the app end-to-end on a device. Which would you prefer next?
