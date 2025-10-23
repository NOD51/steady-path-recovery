# Recovery Companion App - Developer Documentation

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Feature Locations](#feature-locations)
- [How to Modify Features](#how-to-modify-features)
- [Adding New Features](#adding-new-features)
- [Design System](#design-system)
- [Data Management](#data-management)
- [Deployment](#deployment)

---

## 🎯 Project Overview

This is a **Recovery Companion App** designed to help users overcome addiction through:
- Daily progress tracking with a "Life Tree" metaphor
- Urge management toolkit with coping strategies
- Relapse recovery support
- Achievement system and streak tracking
- Crisis support resources

The app is built for web and can be compiled to Android/iOS using Capacitor.

---

## 🛠 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: React hooks + localStorage (guest mode)
- **Backend** (optional): Supabase integration available
- **Mobile**: Capacitor for Android/iOS builds

---

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components (buttons, cards, etc.)
│   ├── LandingPage.tsx  # First screen users see
│   ├── OnboardingQuiz.tsx # Initial user questionnaire
│   ├── Dashboard.tsx    # Main app hub with progress tracking
│   ├── UrgeToolkit.tsx  # Coping strategies for urges
│   ├── RelapseRecovery.tsx # Support for relapse situations
│   ├── Timer.tsx        # Countdown timer for urges
│   ├── MessageBuddy.tsx # AI companion messages
│   ├── DistractionGame.tsx # Simple game distraction
│   └── CrisisSupport.tsx # Emergency support resources
│
├── pages/
│   ├── Index.tsx        # Main app controller (state management)
│   └── NotFound.tsx     # 404 page
│
├── hooks/
│   ├── useGuestProgress.ts # Guest user data management
│   ├── useAuth.ts       # Authentication (if using Supabase)
│   └── useProgress.ts   # Progress tracking utilities
│
├── lib/
│   └── utils.ts         # Utility functions
│
├── integrations/
│   └── supabase/        # Supabase configuration (optional)
│
├── index.css            # Global styles + design tokens
├── App.tsx              # Root component with routing
└── main.tsx             # Entry point

.github/workflows/       # CI/CD workflows
├── build-android.yml    # Automated Android builds
└── main.yml            # Main CI workflow
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Git

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Building for Production

```bash
# Build web version
npm run build

# Preview production build
npm run preview
```

### Building for Android
See `.github/workflows/build-android.yml` for automated builds, or run locally with Capacitor CLI.

---

## 📍 Feature Locations

### Where to Find Specific Features

| Feature | File Location | Description |
|---------|--------------|-------------|
| **Landing Page** | `src/components/LandingPage.tsx` | Hero section, app intro, "Start Journey" button |
| **Onboarding Quiz** | `src/components/OnboardingQuiz.tsx` | Initial questionnaire for new users |
| **Main Dashboard** | `src/components/Dashboard.tsx` | Progress tracking, life tree, daily tasks, streaks |
| **Urge Toolkit** | `src/components/UrgeToolkit.tsx` | Coping strategies during urges |
| **Relapse Recovery** | `src/components/RelapseRecovery.tsx` | Support after a relapse |
| **Crisis Support** | `src/components/CrisisSupport.tsx` | Emergency resources and hotlines |
| **Timer Tool** | `src/components/Timer.tsx` | Countdown timer for urge management |
| **Distraction Game** | `src/components/DistractionGame.tsx` | Simple clicker game |
| **Message Buddy** | `src/components/MessageBuddy.tsx` | Supportive AI messages |
| **Progress Data** | `src/hooks/useGuestProgress.ts` | All user data logic (tasks, streaks, achievements) |
| **App Navigation** | `src/pages/Index.tsx` | Main state management and routing |
| **Design System** | `src/index.css` + `tailwind.config.ts` | Colors, fonts, spacing |
| **UI Components** | `src/components/ui/` | Buttons, cards, dialogs, etc. |

---

## 🔧 How to Modify Features

### 1. Changing the Landing Page Content

**File**: `src/components/LandingPage.tsx`

```tsx
// To change the hero title
<h1 className="text-5xl md:text-7xl font-bold mb-6">
  Your New Title Here
</h1>

// To change the subtitle
<p className="text-xl md:text-2xl mb-8">
  Your new description here
</p>

// To modify feature cards, find the array:
const features = [
  {
    icon: Heart,
    title: "Your Feature",
    description: "Your description"
  },
  // Add more features here
]
```

### 2. Modifying Daily Tasks

**File**: `src/hooks/useGuestProgress.ts`

Find the `createDefaultTasks` function around line 60:

```tsx
const createDefaultTasks = (date: string): DailyTask[] => {
  return [
    {
      id: 'task-1',
      title: 'Your New Task Title',
      description: 'Task description',
      is_completed: false,
      task_date: date,
      points: 10
    },
    // Add more tasks here
  ]
}
```

### 3. Changing Achievements

**File**: `src/hooks/useGuestProgress.ts`

Find `defaultAchievements` array around line 85:

```tsx
const defaultAchievements: Achievement[] = [
  {
    id: 'achievement-1',
    title: 'Your Achievement Name',
    description: 'Achievement description',
    icon: '🏆',
    requirement: 'Complete 1 day clean',
    points: 50
  },
  // Add more achievements
]
```

### 4. Modifying the Urge Toolkit Strategies

**File**: `src/components/UrgeToolkit.tsx`

Find the strategies array (around line 15):

```tsx
const strategies = [
  {
    id: 'strategy-1',
    title: 'Your Strategy',
    description: 'Strategy description',
    icon: Brain,
    action: () => {
      // What happens when clicked
    }
  },
  // Add more strategies
]
```

### 5. Customizing Colors and Themes

**File**: `src/index.css`

```css
:root {
  /* Change primary color (main brand color) */
  --primary: 221 83% 53%;  /* HSL values */
  
  /* Change background color */
  --background: 0 0% 100%;
  
  /* Add custom colors */
  --success: 142 71% 45%;
  --warning: 38 92% 50%;
}
```

**File**: `tailwind.config.ts`

```ts
theme: {
  extend: {
    colors: {
      // Use your custom colors from index.css
      success: 'hsl(var(--success))',
      warning: 'hsl(var(--warning))',
    }
  }
}
```

### 6. Editing Crisis Support Resources

**File**: `src/components/CrisisSupport.tsx`

Find the resources array:

```tsx
const resources = [
  {
    name: 'Hotline Name',
    number: '1-800-XXX-XXXX',
    description: 'Available 24/7',
    icon: Phone
  },
  // Add more resources
]
```

### 7. Changing Onboarding Questions

**File**: `src/components/OnboardingQuiz.tsx`

Find the `questions` array around line 17:

```tsx
const questions: Question[] = [
  {
    id: 1,
    question: "Your question here?",
    type: "multiple-choice",
    options: ["Option 1", "Option 2", "Option 3"]
  },
  // Add or modify questions
]
```

### 8. Modifying the Life Tree Progress Visualization

**File**: `src/components/Dashboard.tsx`

Find the tree status calculation around line 60:

```tsx
const getTreeStatus = () => {
  if (overallProgress < 25) return { 
    status: 'Seedling', 
    emoji: '🌱' 
  };
  if (overallProgress < 50) return { 
    status: 'Sprout', 
    emoji: '🌿' 
  };
  // Add more growth stages
}
```

---

## ➕ Adding New Features

### Adding a New Page

1. **Create the component** in `src/pages/` or `src/components/`:

```tsx
// src/pages/NewFeature.tsx
export const NewFeature = () => {
  return (
    <div className="container mx-auto p-6">
      <h1>New Feature</h1>
    </div>
  );
};
```

2. **Add routing** in `src/App.tsx`:

```tsx
import { NewFeature } from "./pages/NewFeature";

// In the Routes section:
<Route path="/new-feature" element={<NewFeature />} />
```

3. **Add navigation** from Dashboard or other components:

```tsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

<Button onClick={() => navigate('/new-feature')}>
  Go to New Feature
</Button>
```

### Adding a New Daily Task Category

In `src/hooks/useGuestProgress.ts`, modify `createDefaultTasks`:

```tsx
{
  id: 'new-category-task',
  title: 'New Category Task',
  category: 'wellness', // Add category field
  // ... rest of task
}
```

### Adding Local Storage Data

In `src/hooks/useGuestProgress.ts`:

```tsx
// Save data
localStorage.setItem('my-data', JSON.stringify(myData));

// Load data
const loadedData = JSON.parse(
  localStorage.getItem('my-data') || '{}'
);
```

---

## 🎨 Design System

### Using Design Tokens

**Always use semantic tokens** instead of hardcoded colors:

```tsx
// ❌ DON'T DO THIS
<div className="bg-blue-500 text-white">

// ✅ DO THIS
<div className="bg-primary text-primary-foreground">
```

### Available Semantic Tokens

From `src/index.css`:

- `--background` / `--foreground` - Page background and text
- `--primary` / `--primary-foreground` - Main brand color
- `--secondary` / `--secondary-foreground` - Secondary actions
- `--accent` / `--accent-foreground` - Highlights
- `--destructive` / `--destructive-foreground` - Errors, danger
- `--muted` / `--muted-foreground` - Subtle backgrounds
- `--card` / `--card-foreground` - Card backgrounds
- `--border` - Border colors

### Using shadcn/ui Components

All UI components are in `src/components/ui/`. Import and use them:

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="default">Click Me</Button>
  </CardContent>
</Card>
```

Button variants: `default`, `secondary`, `outline`, `ghost`, `destructive`, `link`

---

## 💾 Data Management

### Current State: Guest Mode (localStorage)

The app currently stores all data in the browser's localStorage via `useGuestProgress.ts`.

**Data includes**:
- User profile (name, streak count)
- Daily tasks and completion status
- Achievement unlocks
- Progress history by date

**Limitations**:
- Data is device-specific
- Clearing browser data loses everything
- No sync across devices

### Future: Supabase Backend

To enable multi-device sync and user accounts:

1. Set up Supabase tables for:
   - `profiles` (user info)
   - `daily_tasks` (tasks)
   - `achievements` (unlocked achievements)
   - `daily_progress` (historical data)

2. Replace `useGuestProgress.ts` with Supabase queries
3. Implement authentication via `src/hooks/useAuth.ts`

---

## 🚢 Deployment

### Lovable Hosting (Easiest)

1. Visit [Lovable Project](https://lovable.dev/projects/94c2be83-a880-4945-9742-700bf2884dfb)
2. Click **Share → Publish**
3. Your app is live!

### Custom Domain

1. Navigate to **Project > Settings > Domains**
2. Click **Connect Domain**
3. Follow DNS instructions
4. [More info](https://docs.lovable.dev/tips-tricks/custom-domain)

### Self-Hosting

```bash
# Build the project
npm run build

# Deploy the 'dist' folder to:
# - Vercel
# - Netlify
# - GitHub Pages
# - Your own server
```

### Android Build (GitHub Actions)

Push to GitHub and the workflow in `.github/workflows/build-android.yml` will automatically build an APK.

---

## 📝 Common Customization Scenarios

### Scenario 1: Change App Name and Branding

1. **Title**: Edit `index.html` `<title>` tag
2. **Landing page**: Edit `src/components/LandingPage.tsx`
3. **Colors**: Edit `src/index.css` CSS variables
4. **Logo**: Replace `src/assets/hero-image.png`

### Scenario 2: Add a New Support Resource

Edit `src/components/CrisisSupport.tsx` and add to the resources array.

### Scenario 3: Change Progress Calculation

Edit `src/components/Dashboard.tsx`, find the progress calculation logic around line 44.

### Scenario 4: Add Social Sharing

Install a library like `react-share`:
```bash
npm install react-share
```

Then use in any component:
```tsx
import { FacebookShareButton } from 'react-share';

<FacebookShareButton url="https://your-app.com">
  Share on Facebook
</FacebookShareButton>
```

### Scenario 5: Add Analytics

1. Install analytics library
2. Add tracking in `src/App.tsx` or individual components
3. Track page views, button clicks, etc.

---

## 🤝 Contributing

When making changes:
1. Test thoroughly in dev mode (`npm run dev`)
2. Check responsive design (mobile/tablet/desktop)
3. Ensure dark mode compatibility if applicable
4. Keep code clean and commented
5. Update this README if adding major features

---

## 📞 Support

- **Lovable Documentation**: [docs.lovable.dev](https://docs.lovable.dev)
- **Project URL**: [lovable.dev/projects/94c2be83-a880-4945-9742-700bf2884dfb](https://lovable.dev/projects/94c2be83-a880-4945-9742-700bf2884dfb)
- **Feature Suggestions**: See `feature-suggestions.json` for planned enhancements

---

## 📄 License

This project is open source and available for modification and distribution.
