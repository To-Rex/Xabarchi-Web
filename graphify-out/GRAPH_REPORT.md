# Graph Report - .  (2026-07-19)

## Corpus Check
- Corpus is ~38,401 words - fits in a single context window. You may not need a graph.

## Summary
- 528 nodes · 621 edges · 65 communities (46 shown, 19 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.73)
- Token cost: 54,084 input · 0 output

## Community Hubs (Navigation)
- App Layouts & Navigation
- Mock Database Seed
- TypeScript App Config
- Package Dev Dependencies
- Project Docs & Design Rationale
- Runtime Dependencies
- TypeScript Node Config
- Core UI Kit (Card, Logo)
- Formatting Utilities
- Devices Feature
- Badge & Message Status
- Form Fields
- Oxlint Config
- Notifications Store
- SMS Repository
- i18n Provider
- Theme Provider
- Button & Spinner
- Auth Store
- Contacts Repository
- Templates Repository
- Marketing Homepage
- Dropdown & Language Switcher
- Toast System
- App Bootstrap & Router
- Dashboard Overview
- API Keys Page
- Developer Docs Page
- Segmented Control & Theme Toggle
- Favicon Brand Mark
- Contacts Page
- Notifications Page
- Mock API Client
- Analytics Page
- Settings Page
- SMS Log Page
- Templates Page
- Chart Palette Tokens
- Dispatch Path & Empty State
- Billing Page
- Compose Page
- Help Page
- FAQ Page
- Pricing Page
- Avatar Component
- Modal Component
- Progress Bar
- Tabs Component
- Forgot Password Page
- Login Page
- Register Page
- Profile Page
- Contact Page
- Not Found Page
- Chart Tooltip
- useAsync Hook
- Code Block
- Page Header
- Reveal Animation
- TypeScript Root Config
- Contact Config
- Common i18n Dictionary
- UI States Concept

## God Nodes (most connected - your core abstractions)
1. `react` - 47 edges
2. `compilerOptions` - 19 edges
3. `compilerOptions` - 15 edges
4. `scripts` - 5 edges
5. `Xabarchi SMS Platform Frontend (MVP)` - 5 edges
6. `Xabarchi Favicon Logo Mark` - 5 edges
7. `plugins` - 4 edges
8. `rand` - 4 edges
9. `lib` - 4 edges
10. `Xabarchi Design System` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Uzbek-Language Metadata and OG Tags` --conceptually_related_to--> `Trilingual i18n (Uzbek / Russian / English)`  [INFERRED]
  index.html → README.md
- `Inline Theme Bootstrap Script (xabarchi:theme localStorage)` --implements--> `Light/Dark/System Theming with Circular-Reveal Transition`  [INFERRED]
  index.html → README.md
- `Google Fonts Loading (Unbounded, Golos Text, JetBrains Mono)` --implements--> `Typography: Unbounded / Golos Text / JetBrains Mono`  [INFERRED]
  index.html → README.md
- `Uzbek-Language Metadata and OG Tags` --references--> `Android Phone as SMS Gateway`  [EXTRACTED]
  index.html → README.md
- `Uzbek-Language Metadata and OG Tags` --references--> `Kok Turquoise Palette (#0E9488, Samarkand Tile Blue)`  [EXTRACTED]
  index.html → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Backend Swap Seam (repositories + simulate() + mock types)** — readme_repository_pattern, readme_simulate_seam, readme_mock_types_contract, readme_mock_data_frontend [EXTRACTED 0.90]
- **Xabarchi Design Language** — readme_kok_palette, readme_typography, readme_dispatch_path_motif, readme_motion_system, readme_theming [EXTRACTED 0.85]
- **Favicon Brand Mark Composition** — public_favicon_logo_mark, public_favicon_speech_bubble, public_favicon_checkmark, public_favicon_teal_brand_color [EXTRACTED 1.00]

## Communities (65 total, 19 thin omitted)

### Community 0 - "App Layouts & Navigation"
Cohesion: 0.06
Nodes (29): AuthLayout(), dict, DashboardLayout(), dict, severityDot, dict, MarketingLayout(), AnalyticsPage (+21 more)

### Community 1 - "Mock Database Seed"
Cohesion: 0.07
Nodes (35): apiKeys, COMPANIES, contacts, dailyStats, devices, FIRST_NAMES, groups, hourlyLoad (+27 more)

### Community 2 - "TypeScript App Config"
Cohesion: 0.08
Nodes (25): DOM, DOM.Iterable, src, vite/client, compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly (+17 more)

### Community 3 - "Package Dev Dependencies"
Cohesion: 0.08
Nodes (24): oxlint, devDependencies, oxlint, @types/node, @types/react, @types/react-dom, typescript, vite (+16 more)

### Community 4 - "Project Docs & Design Rationale"
Cohesion: 0.09
Nodes (23): index.html App Entry Document, Google Fonts Loading (Unbounded, Golos Text, JetBrains Mono), Inline Theme Bootstrap Script (xabarchi:theme localStorage), Uzbek-Language Metadata and OG Tags, Android Phone as SMS Gateway, Recharts with CVD-Validated Palette, Dashboard Routes (/app/*), Xabarchi Design System (+15 more)

### Community 5 - "Runtime Dependencies"
Cohesion: 0.10
Nodes (21): clsx, lucide-react, motion, dependencies, clsx, lucide-react, motion, react (+13 more)

### Community 6 - "TypeScript Node Config"
Cohesion: 0.10
Nodes (19): node, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection (+11 more)

### Community 7 - "Core UI Kit (Card, Logo)"
Cohesion: 0.18
Nodes (11): AnimatedNumber(), AnimatedNumberProps, Card(), CardBody(), CardHeader(), CardTitle(), Logo(), LogoMark() (+3 more)

### Community 8 - "Formatting Utilities"
Cohesion: 0.15
Nodes (8): CURRENCY_WORD, formatDate(), formatMoney(), formatNumber(), formatRelative(), NUMBER_LOCALE, REL_WORDS, UZ_MONTHS

### Community 9 - "Devices Feature"
Cohesion: 0.17
Nodes (4): fetchDevices(), list, DevicesPage(), dict

### Community 10 - "Badge & Message Status"
Cohesion: 0.22
Nodes (7): Badge(), BadgeProps, Tone, tones, dict, MessageStatusBadge(), toneFor

### Community 11 - "Form Fields"
Cohesion: 0.20
Nodes (7): FieldShellProps, Input, InputProps, Select, SelectProps, Textarea, TextareaProps

### Community 12 - "Oxlint Config"
Cohesion: 0.22
Nodes (8): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, typescript, warn

### Community 13 - "Notifications Store"
Cohesion: 0.33
Nodes (8): emit(), items, listeners, markAllRead(), markRead(), subscribe(), useNotifications(), useUnreadCount()

### Community 14 - "SMS Repository"
Cohesion: 0.22
Nodes (4): log, MessagesPage, MessagesQuery, SendPayload

### Community 15 - "i18n Provider"
Cohesion: 0.28
Nodes (8): I18nContext, I18nContextValue, I18nProvider(), INTL_LOCALE, Lang, readStoredLang(), useLang(), useT()

### Community 16 - "Theme Provider"
Cohesion: 0.31
Nodes (7): readStoredPref(), resolveDark(), systemPrefersDark(), ThemeContext, ThemeContextValue, ThemePref, ThemeProvider()

### Community 17 - "Button & Spinner"
Cohesion: 0.25
Nodes (7): Button, ButtonProps, Size, sizeClasses, Variant, variantClasses, Spinner()

### Community 18 - "Auth Store"
Cohesion: 0.39
Nodes (7): emit(), getSnapshot(), listeners, signIn(), signOut(), subscribe(), useIsAuthenticated()

### Community 19 - "Contacts Repository"
Cohesion: 0.25
Nodes (3): ContactInput, ContactsQuery, list

### Community 20 - "Templates Repository"
Cohesion: 0.32
Nodes (5): createTemplate(), extractVariables(), list, TemplateInput, updateTemplate()

### Community 21 - "Marketing Homepage"
Cohesion: 0.25
Nodes (4): dict, featureIcons, SIM_POOL, SimMessage

### Community 22 - "Dropdown & Language Switcher"
Cohesion: 0.32
Nodes (6): LANGS, Dropdown(), DropdownItem(), DropdownProps, DropdownSeparator(), LangSwitcher()

### Community 23 - "Toast System"
Cohesion: 0.25
Nodes (7): ToastContext, ToastContextValue, ToastItem, ToastProvider(), ToastTone, toneIcon, useToast()

### Community 24 - "App Bootstrap & Router"
Cohesion: 0.38
Nodes (3): react, AppProviders(), router

### Community 25 - "Dashboard Overview"
Cohesion: 0.29
Nodes (4): fetchOverview(), OverviewData, dict, OverviewPage()

### Community 26 - "API Keys Page"
Cohesion: 0.38
Nodes (6): ALL_SCOPES, ApiPage(), dict, fetchKeys(), keyStore, randomToken()

### Community 27 - "Developer Docs Page"
Cohesion: 0.29
Nodes (3): CodeLang, dict, SEND_SNIPPETS

### Community 28 - "Segmented Control & Theme Toggle"
Cohesion: 0.33
Nodes (5): Segment, SegmentedControl(), SegmentedControlProps, ThemeSegmented(), ThemeToggle()

### Community 29 - "Favicon Brand Mark"
Cohesion: 0.53
Nodes (6): Checkmark Glyph, Xabarchi Favicon Logo Mark, Message Delivered / Verified Metaphor, Speech Bubble Shape, Teal Brand Color #0E9488, Xabarchi Brand Identity

### Community 30 - "Contacts Page"
Cohesion: 0.40
Nodes (4): ContactsPage(), dict, emptyForm, useDebounced()

### Community 31 - "Notifications Page"
Cohesion: 0.33
Nodes (4): dict, Filter, kindIcon, severityStyles

### Community 32 - "Mock API Client"
Cohesion: 0.40
Nodes (4): delay(), MockApiError, simulate(), SimulateOptions

### Community 33 - "Analytics Page"
Cohesion: 0.50
Nodes (4): AnalyticsData, AnalyticsPage(), dict, fetchAnalytics()

### Community 35 - "SMS Log Page"
Cohesion: 0.50
Nodes (4): dict, SmsPage(), StatusTab, useDebounced()

### Community 36 - "Templates Page"
Cohesion: 0.50
Nodes (3): dict, TemplatesPage(), useDebounced()

### Community 37 - "Chart Palette Tokens"
Cohesion: 0.40
Nodes (3): ChartPalette, dark, light

### Community 38 - "Dispatch Path & Empty State"
Cohesion: 0.50
Nodes (3): DispatchPath(), EmptyState(), EmptyStateProps

### Community 39 - "Billing Page"
Cohesion: 0.67
Nodes (3): BillingPage(), dict, fetchBilling()

### Community 40 - "Compose Page"
Cohesion: 0.67
Nodes (3): ComposePage(), dict, normalizePhone()

### Community 44 - "Avatar Component"
Cohesion: 0.50
Nodes (3): Avatar(), AvatarProps, sizes

### Community 45 - "Modal Component"
Cohesion: 0.50
Nodes (3): Modal(), ModalProps, sizes

### Community 46 - "Progress Bar"
Cohesion: 0.50
Nodes (3): ProgressBar(), ProgressBarProps, toneClass

### Community 47 - "Tabs Component"
Cohesion: 0.50
Nodes (3): Tab, Tabs(), TabsProps

## Knowledge Gaps
- **229 isolated node(s):** `$schema`, `typescript`, `oxc`, `react/rules-of-hooks`, `warn` (+224 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App Bootstrap & Router` to `App Layouts & Navigation`, `Core UI Kit (Card, Logo)`, `Devices Feature`, `Badge & Message Status`, `Form Fields`, `Oxlint Config`, `Notifications Store`, `i18n Provider`, `Theme Provider`, `Button & Spinner`, `Auth Store`, `Marketing Homepage`, `Dropdown & Language Switcher`, `Toast System`, `API Keys Page`, `Developer Docs Page`, `Segmented Control & Theme Toggle`, `Contacts Page`, `Notifications Page`, `Analytics Page`, `Settings Page`, `SMS Log Page`, `Templates Page`, `Dispatch Path & Empty State`, `Billing Page`, `Compose Page`, `Help Page`, `FAQ Page`, `Pricing Page`, `Modal Component`, `Tabs Component`, `Forgot Password Page`, `Login Page`, `Register Page`, `Profile Page`, `Contact Page`, `Chart Tooltip`, `useAsync Hook`, `Code Block`, `Page Header`, `Reveal Animation`?**
  _High betweenness centrality (0.272) - this node is a cross-community bridge._
- **Why does `plugins` connect `Oxlint Config` to `App Bootstrap & Router`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `$schema`, `typescript`, `oxc` to the rest of the system?**
  _229 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Layouts & Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.0553306342780027 - nodes in this community are weakly interconnected._
- **Should `Mock Database Seed` be split into smaller, more focused modules?**
  _Cohesion score 0.07152496626180836 - nodes in this community are weakly interconnected._
- **Should `TypeScript App Config` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Package Dev Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._