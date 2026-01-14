# Beta Pages for A/B Testing

This directory contains beta versions of all application pages using **shadcn/ui** components for A/B testing purposes.

## Overview

The `/beta` route contains reimplemented versions of all major pages using modern shadcn/ui components instead of custom Tailwind CSS styles. This allows for A/B testing to compare user engagement and preference between the original design and the shadcn-based design.

## Structure

```
/beta
├── page.tsx                    # Beta home page
├── layout.tsx                  # Beta layout with navigation
├── jobs/
│   ├── page.tsx               # Job listings
│   └── [id]/
│       └── page.tsx           # Job details
├── dashboard/
│   └── page.tsx               # User dashboard
├── profile/
│   └── page.tsx               # User profile
├── auth/
│   ├── signin/
│   │   └── page.tsx           # Sign in page
│   └── signup/
│       └── page.tsx           # Sign up page
└── admin/
    ├── dashboard/
    │   └── page.tsx           # Admin dashboard
    ├── users/
    │   └── page.tsx           # User management
    └── jobs/
        └── page.tsx           # Job moderation
```

## shadcn/ui Components Used

The beta pages utilize the following shadcn/ui components:

- **Button** - Primary, secondary, outline, and ghost variants
- **Card** - For content containers with header, content, and footer
- **Input** - Form input fields with consistent styling
- Additional components can be added as needed

## Features

### Design Improvements
- ✅ Consistent design system using shadcn/ui
- ✅ Better accessibility with ARIA labels
- ✅ Improved mobile responsiveness
- ✅ Modern UI patterns and interactions
- ✅ Dark mode support (via CSS variables)

### Pages Implemented
- ✅ Home page with hero, categories, and featured jobs
- ✅ Job listings with filters and pagination
- ✅ Job detail view with apply functionality
- ✅ User dashboard with saved jobs and applications
- ✅ Profile management
- ✅ Authentication pages (sign in/sign up)
- ✅ Admin dashboard with statistics
- ✅ Admin user management
- ✅ Admin job moderation

## A/B Testing Strategy

### Accessing Beta Pages

Users can access beta pages by navigating to routes prefixed with `/beta`:

- Original: `/` → Beta: `/beta`
- Original: `/jobs` → Beta: `/beta/jobs`
- Original: `/dashboard` → Beta: `/beta/dashboard`

### Switching Between Versions

A link in the beta footer allows users to switch back to the original version at any time.

## Configuration

### Tailwind CSS

The tailwind configuration has been updated to support shadcn/ui with CSS variables for theming:

```typescript
// tailwind.config.ts
export default {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // ... more colors
      },
    },
  },
}
```

### Global Styles

CSS variables are defined in `src/app/globals.css` for consistent theming across the application.

## Development

### Adding New Beta Pages

1. Create a new page file in the `/beta` directory structure
2. Import shadcn/ui components:
   ```typescript
   import { Button } from '@/components/ui/button';
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
   ```
3. Use the components to build your page
4. Maintain API compatibility with original pages

### Adding New shadcn Components

To add more shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tabs
```

## Testing

### Manual Testing

1. Navigate to `/beta` routes
2. Test all functionality matches original pages
3. Verify responsive design on different screen sizes
4. Test all user interactions and API calls

### Metrics to Track

For A/B testing, consider tracking:
- User engagement (time on page, bounce rate)
- Conversion rates (sign-ups, job applications)
- User feedback and preferences
- Performance metrics (load times, interactions)

## Future Enhancements

- [ ] Add more shadcn components (Dialog, Dropdown, Tabs, etc.)
- [ ] Implement dark mode toggle
- [ ] Add skeleton loaders for better loading states
- [ ] Implement toast notifications using shadcn Toast
- [ ] Add data tables for admin pages
- [ ] Implement form validation with react-hook-form and zod

## Dependencies

Additional packages installed for shadcn/ui support:

```json
{
  "dependencies": {
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.263.1",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7",
    "@radix-ui/react-slot": "^1.0.2"
  }
}
```

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)

## Notes

- All beta pages maintain the same API endpoints as original pages
- Authentication and authorization work the same way
- Database operations are identical to original pages
- Only the UI/UX layer is different for A/B testing

---

For questions or issues with beta pages, please refer to the main project documentation or contact the development team.
