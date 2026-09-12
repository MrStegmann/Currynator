# Interface Contract: CV Dashboard UI Components

## 1. Navbar Link Component Interface

- **Navigation Item**: Added to `RightNavBar` (or main header navigation).
- **Label**: `CV Dashboard`
- **Icon**: `FileText` or `LayoutDashboard` (Lucide React)
- **Props**:
  - `activeView: string`
  - `onSelectView: (view: 'Home' | 'CV Dashboard') => void`

## 2. Empty Dashboard State Component Interface (`CvDashboardEmptyState.tsx`)

- **Role**: Rendered inside `CvDashboard` when `cvItems.length === 0`.
- **Props**:
  - `onCreateNewCv: () => void`
- **UI Elements**:
  - Centered layout container.
  - Message text: `"No has creado todavía ningún curriculum personalizado para ninguna vacante. Empieza ahora pulsando en el botón de abajo."`
  - Button text: `"Crear nuevo CV"`

## 3. CV Card Component Interface (`CvItemCard.tsx`)

- **Role**: Individual card rendered inside the 3-column / 1-column grid.
- **Props**:
  - `cvItem: ApplicationCv`
  - `onView: (id: string) => void`
  - `onEdit: (id: string) => void`
  - `onDelete: (id: string) => void`
- **Rendered Attributes**:
  - Target vacancy title (`targetVacancyTitle`)
  - Job description snippet (`jobDescriptionSnippet`)
  - Creation timestamp (`createdAt` formatted)
  - Last updated timestamp (`updatedAt` formatted)
- **Action Icons**:
  - Eye icon button (View)
  - Pencil icon button (Edit)
  - Trash icon button (Delete)

## 4. Custom Delete Confirmation Modal Interface (`DeleteCvModal.tsx`)

- **Role**: Confirmation modal displayed when user clicks Delete icon.
- **Props**:
  - `isOpen: boolean`
  - `targetCvTitle: string | null`
  - `onConfirm: () => void`
  - `onCancel: () => void`
- **Constraints**:
  - Must NOT use `window.alert` or `window.confirm`.
