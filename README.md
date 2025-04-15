# Profit & Lost Frontend

## Overview

Frontend application for Profit & Lost, a financial management tool that helps users track income, expenses, and financial accounts. This application is built with React, TypeScript, and Material UI.

## Project Structure

```
PL-front-v2/
├── src/
│   ├── contexts/           # React context providers
│   ├── i18n/               # Translation files
│   ├── pages/              # Page components
│   │   ├── blog/           # Blog-related pages
│   │   ├── dashboard/      # Dashboard pages (protected)
│   │   ├── landing/        # Public landing pages
│   ├── services/           # API service modules 
│   ├── theme/              # Theme definitions
│   ├── types/              # TypeScript type definitions
│   │   ├── api/            # API response and request types
│   │   ├── supabase/       # Database model types
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application component
│   ├── i18n.js             # Internationalization configuration
│   ├── index.css           # Global styles
│   ├── main.tsx            # Application entry point
```

## Key Components

### App.tsx

The main application component that defines the routing structure and authentication flow. It:
- Sets up the primary routing system with protected and public routes
- Manages authentication state through UserProvider context
- Implements route protection with redirect logic for unauthorized access
- Handles loading states during authentication checks
- Applies theme context to authenticated dashboard routes

### main.tsx

Application entry point that initializes the React application with all required providers:
- GoogleOAuthProvider for authentication
- GlobalThemeProvider for consistent UI styling
- BrowserRouter for navigation
- Toaster for notifications

## Dashboard

The dashboard is the main application interface after authentication, providing a comprehensive financial management system.

### Directory Structure

```
dashboard/
├── Dashboard.tsx           # Main dashboard container component
├── components/             # Shared dashboard components
│   ├── DashboardContent.tsx # Content area renderer for different sections
│   ├── DashboardHeader.tsx  # Header with user profile and global controls
│   ├── DashboardNav.tsx     # Navigation sidebar with menu items
│   ├── GlobalOnboardingDialog.tsx  # Onboarding wizard for new users
│   ├── LoadingScreen.tsx    # Loading indicator during auth checks
│   ├── SectionIntroDialog.tsx # Introduction dialogs for each section
│   ├── ui/                  # Reusable UI components
│       ├── DrawerBase.tsx   # Responsive drawer base component
├── features/               # Feature-specific components
    ├── dashHome/           # Dashboard home page components
    ├── annualReport/       # Annual financial report components
    ├── transactions/       # Transaction management components
    ├── accounts/           # Account management components
    ├── notes/              # Notes management components
    ├── settings/           # User settings components
```

### Key Components

#### Dashboard (Dashboard.tsx)
- Main container that structures the authenticated application UI
- Manages navigation between different application sections
- Verifies user authentication state and redirects if necessary
- Handles onboarding process for new users
- Provides transaction creation workflow
- Structures global layout with header, navigation, and content areas

#### Dashboard Components

##### DashboardContent
- Renders the appropriate feature component based on the active section
- Manages section introduction dialogs for first-time users
- Handles smooth transitions between sections
- Provides loading indicators during component loading
- Uses lazy loading for optimized performance

##### DashboardHeader
- Displays user profile and account access controls
- Manages theme toggling between dark/light modes
- Controls currency visibility throughout the application
- Provides access to user settings and preferences
- Handles user logout functionality

##### DashboardNav
- Renders different layouts based on screen size (desktop/mobile)
- Displays the application logo with theme awareness
- Manages navigation menu items with proper highlighting
- Provides quick access to transaction creation
- Filters menu items based on user role

##### GlobalOnboardingDialog
- Multi-step wizard that guides new users through initial setup
- Collects user preferences (language, currency, date format)
- Facilitates selection of financial tracking categories
- Persists progress across browser sessions
- Communicates with backend services to save preferences

##### LoadingScreen
- Displays a full-screen loading visual with application branding
- Shows during authentication verification and initial data loading
- Adapts to the current theme via background color

##### SectionIntroDialog
- Displays welcome information for each section of the dashboard
- Presents section-specific features and instructions
- Creates a consistent onboarding experience across the application
- Adapts content based on the current language
- Provides animated transitions for better user experience

##### DrawerBase
- Responsive drawer component that adapts to different screen sizes
- On mobile devices, appears from the bottom with rounded corners
- On desktop devices, slides in from the right side
- Provides consistent drawer behavior throughout the application

### Dashboard Features

The dashboard contains several main feature sections:

#### Dashboard Home
- Overview of current financial status
- Recent transactions list
- Quick summary of account balances
- Financial health indicators

#### Annual Report
- Yearly financial data visualization
- Monthly comparison charts
- Income vs. expense analysis
- Category distribution graphs

#### Transactions
- Transaction list with filtering and search
- Transaction creation and editing
- Category-based organization
- Date and amount filtering

#### Accounts
- Financial account management
- Account balance tracking
- Year record management
- Account history visualization

#### Notes
- Personal financial notes
- Secure note storage
- Note organization and search

#### Settings
- User profile management
- Security and privacy controls
- Application preferences
- Account management

## Landing Pages

The `/pages/landing` directory contains all public-facing pages that are accessible without authentication:

### Directory Structure

```
landing/
├── Home.tsx                # Main landing page with marketing content
├── Home.css                # Styles for the landing page
├── components/             # Shared components for landing pages
│   ├── Header.tsx          # Navigation header with logo and links
│   ├── Footer.tsx          # Site-wide footer with links and copyright
│   ├── LanguageSelector.tsx# Language toggle component
├── auth/                   # Authentication pages
│   ├── AuthPage.tsx        # Container for all auth flows
│   ├── components/         # Auth-specific components
│       ├── AuthLayout.tsx  # Consistent layout for auth forms
│       ├── LoginForm.tsx   # User login form
│       ├── RegisterForm.tsx# User registration form
│       ├── ResetPasswordForm.tsx # Password recovery form
├── legal/                  # Legal and policy pages
    ├── Contact.tsx         # Contact information page
    ├── CookiePolicy.tsx    # Cookie usage policy
    ├── LegalNotice.tsx     # Legal information
    ├── PrivacyPolicy.tsx   # Privacy policy
    ├── TermsOfService.tsx  # Terms of service
    ├── components/         # Legal page components
        ├── LegalLayout.tsx # Consistent layout for legal pages
```

### Key Features

#### Home Page (Home.tsx)
- Marketing-focused landing page that showcases the application
- Responsive design with mobile and desktop layouts
- Features a hero section, "how it works" walkthrough, and features showcase
- Implements a bento grid layout for feature cards
- Uses CSS animations for visual appeal
- Fully internationalized with translation keys

#### Authentication Flow (auth/)
- Unified `AuthPage.tsx` that handles login, registration, and password recovery
- Clean separation of concerns with component-based architecture
- Google OAuth integration for single-click authentication
- Robust form validation with descriptive error handling
- Multi-step password recovery flow
- Comprehensive error handling for all authentication scenarios
- Analytics tracking for conversion metrics

#### Legal Pages (legal/)
- Consistent styling across all legal documents
- Shared layout component (`LegalLayout.tsx`) for visual consistency
- Fully internationalized content with translation keys
- Structured content with proper hierarchy and navigation
- Mobile-optimized reading experience

#### Shared Components
- **Header**: Responsive navigation with conditional links based on authentication
- **Footer**: Site-wide footer with legal links and company information
- **LanguageSelector**: Floating language toggle with flag icons and smooth transitions

### Theming and Styling
- Brand-consistent color palette with orange primary colors
- Responsive design principles throughout all landing pages
- CSS animations for enhanced user experience
- Material UI components with custom styling
- Support for light and dark modes

### Internationalization
All landing pages fully support multiple languages through the i18next system:
- English (default) and Spanish translations
- Dynamic content loading based on user language preference
- Persistent language selection with localStorage

## Blog Section

The `/pages/blog` directory contains the educational and marketing blog for the application:

### Directory Structure

```
blog/
├── BlogPage.tsx           # Main blog listing page with filtering and search
├── components/            # Blog-specific components
│   ├── BlogPost.tsx       # Card component for blog post previews
│   ├── BlogPostDetail.tsx # Full article page with content rendering
├── data/                  # Blog content data
    ├── blogData.ts        # Collection of blog posts with i18n translation keys
```

### Key Features

#### Blog List Page (BlogPage.tsx)
- Responsive grid layout for blog post cards
- Category-based filtering with interactive chips
- Full-text search across all blog content
- Pagination for improved performance with large numbers of posts
- Sorting by publication date (newest first)
- SEO-friendly headings and metadata

#### Blog Post Components
- **BlogPost**: Preview card with:
  - Featured image with hover effects
  - Category label
  - Truncated title and excerpt
  - Author and publication date metadata
  - Animated hover effects
  
- **BlogPostDetail**: Full article page with:
  - Breadcrumb navigation for easy site traversal
  - Featured image with category badge
  - Author information and publication date
  - Fully formatted content with responsive styling
  - Support for images, lists, headings, and formatted text

#### Content Management (blogData.ts)
- Structured content model with translation key support
- HTML content with translation placeholders (`{{key}}`)
- Support for multiple post categories (tutorials, tips, introduction)
- Cloudinary integration for image hosting
- Future-dated posts for content scheduling

### Internationalization
The blog system is fully internationalized:
- All blog content (titles, excerpts, body) uses translation keys
- Content processing utility (`useProcessBlogContent`) that replaces translation placeholders
- Date formatting based on user's language preference
- Category labels and UI elements translated via i18n system

### Content Rendering
- HTML content rendering with security considerations
- Custom styling for various HTML elements (headings, lists, links)
- Responsive typography for optimal reading experience
- Support for embedded links and external resources

## Internationalization (i18n)

The application supports multiple languages using the i18next library:

- Configured in `i18n.js`
- Supports English and Spanish through translation files in the `/i18n` directory:
  - `en.json`: Contains all English translations
  - `es.json`: Contains all Spanish translations
- Translations are organized in nested objects with keys for different sections of the application
- Automatically detects user's preferred language
- Normalizes language codes for consistency (e.g., 'es-ES' → 'es')
- Persists language preference in localStorage

### Translation Structure

Translation files are structured hierarchically by feature and component, including:
- Dashboard components
- Landing page sections
- Authentication forms
- Legal documents (Terms, Privacy Policy)
- Error messages and notifications
- Form labels and validation messages

### Usage Example

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('welcome.title')}</h1>;
}
```

## Theme System

The application implements a customizable theming system using Material UI's theme provider. The `/theme` directory contains:

- **lightTheme.ts**: Defines the light mode color palette, typography, and component overrides
- **darkTheme.ts**: Defines the dark mode color palette, typography, and component overrides

### Theme Features

- **Custom Palette Extensions**: Extends MUI's default palette with application-specific colors:
  - Chart colors for financial visualizations
  - Status indicators for success/error states
  - Custom color tokens for consistent UI

- **Component Style Overrides**: Consistent styling for common components:
  - Custom button styles with brand colors
  - Form controls with appropriate styling for each theme
  - Card and paper components with optimized shadows and backgrounds

- **Responsive Typography**: Typography scales optimized for all device sizes

- **Accessibility Considerations**: Ensures proper contrast ratios and focus states

- **Theme Toggling**: Users can switch between light and dark themes with preferences saved to localStorage

## Services

The `/services` directory contains service modules that handle API communication and data management:

- **auth.service.ts**: Handles user authentication flows including:
  - Login/logout
  - Registration
  - Password reset
  - OAuth with Google

- **user.service.ts**: Manages user profile operations:
  - Profile data retrieval and updates
  - Preference management
  - Theme preferences
  - Onboarding flow

- **transaction.service.ts**: Handles financial transaction CRUD operations:
  - Transaction creation, retrieval, updates, and deletion
  - Transaction filtering by year/month
  - Dashboard data retrieval
  - Transaction statistics

- **category.service.ts**: Manages transaction categories:
  - Category creation and management
  - Default category setup
  - Category color management

- **account.service.ts**: Handles financial account operations:
  - Account creation and management
  - Account balance tracking
  - Year record management

- **note.service.ts**: Manages user notes:
  - Note creation, editing, and deletion
  - Secure note storage with encryption

### Service Pattern

Each service module:
- Uses a consistent error-handling pattern
- Implements type-safe API responses
- Manages authentication headers automatically
- Handles network errors gracefully
- Provides descriptive JSDoc documentation

## Utility Functions

The `/utils` directory contains reusable utility functions:

- **apiHeaders.ts**: Functions for generating API request headers, handling iOS token management
- **blogUtils.ts**: Tools for blog content processing with internationalization support
- **currencyUtils.ts**: Currency formatting and visibility management
- **dateUtils.ts**: Date conversion between local time and Supabase UTC formats
- **deviceDetection.ts**: Device and browser detection utilities
- **events.ts**: Custom event system for application-wide communication
- **sectionIconUtils.tsx**: Icon mapping utilities for UI components

## Type Definitions

The `/types` directory contains TypeScript type definitions:

- **api/**: API-related types (responses, requests, errors)
  - **common.ts**: Common API types and interfaces
  - **errors.ts**: Error types for API responses
  - **responses.ts**: Response and request types for all API endpoints

- **supabase/**: Database model types
  - **accounts.ts**: Financial account models
  - **categories.ts**: Transaction category models
  - **common.ts**: Shared types across models
  - **notes.ts**: User notes models
  - **preferences.ts**: User preference models
  - **roles.ts**: User role definitions
  - **transactions.ts**: Financial transaction models
  - **users.ts**: User models
  - **user_roles.ts**: User-role assignments
  - **year_records.ts**: Yearly financial record models

- **blogPost.ts**: Blog content type definitions

## Global Styles

The `index.css` file contains global styles including:
- Custom scrollbar styling
- Text selection highlighting
- Link hover effects
- Loading animations
- UI element styling

## Authentication and Authorization

The application handles user authentication through:
- JWT token-based authentication
- Role-based access control
- Protected routes for authenticated users
- OAuth integration with Google

## Development

*This section will be expanded with setup and development instructions.*
