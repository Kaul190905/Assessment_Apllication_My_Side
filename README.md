# Student Dashboard Redesign

This project is a React-based web application designed to provide a comprehensive student dashboard experience. It features assessment management, performance tracking, activity feeds, and a customizable user interface. The application is built using Vite for fast development and build performance.

## Features

- **Dashboard Overview**: View activity feeds, upcoming assessments, and performance summaries.
- **Assessment Interface**: A full-featured test-taking interface with timers, question palettes, and progress tracking.
- **Performance Analytics**: Visual graphs and counters to track student progress.
- **Profile Management**: User profile settings and customization.
- **Theme Support**: Dark/Light mode toggle and accent color customization.
- **Responsive Design**: Mobile-friendly layout with adaptive sidebars and navigation.

## Project Structure

The following is the complete file structure of the project:

```text
assessment-application-master/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── logo-dark.png
│   ├── logo.png
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── AccentColorPicker.jsx       # Component for selecting UI accent colors
│   │   ├── ActivityFeed.jsx            # Displays recent student activity
│   │   ├── AnimatedCounter.jsx         # Animated number counter for stats
│   │   ├── Breadcrumb.jsx              # Navigation breadcrumbs
│   │   ├── CalendarView.jsx            # Calendar widget for events/tests
│   │   ├── FloatingActionButton.jsx    # Floating action button for quick actions
│   │   ├── Header.jsx                  # Main application header
│   │   ├── Icons.jsx                   # Centralized icon components
│   │   ├── MobileSidebar.jsx           # Sidebar navigation for mobile view
│   │   ├── NavigationButtons.jsx       # Next/Prev buttons for assessments
│   │   ├── OptionItem.jsx              # Single option component for multiple choice questions
│   │   ├── PerformanceGraph.jsx        # Graph visualization of student performance
│   │   ├── ProgressBar.jsx             # Progress indicator
│   │   ├── QuestionCard.jsx            # Display card for a single quiz question
│   │   ├── QuestionPalette.jsx         # Grid view of question status (answered, skipped, etc.)
│   │   ├── Skeleton.jsx                # Loading skeleton states
│   │   ├── SubmissionModal.jsx         # Modal for submitting assessments
│   │   ├── SubmitButton.jsx            # Styled submit button
│   │   ├── SummaryLegend.jsx           # Legend for performance summary charts
│   │   ├── ThemeProvider.jsx           # Context provider for theming
│   │   ├── ThemeToggle.jsx             # Toggle switch for light/dark mode
│   │   └── Toast.jsx                   # Notification toast component
│   ├── data/
│   │   ├── assessments.js              # Mock data for assessments
│   │   └── questions.js                # Mock data for questions
│   ├── hooks/
│   │   ├── useSound.js                 # Custom hook for sound effects
│   │   └── useTestTimer.js             # Custom hook for managing test timers
│   ├── pages/
│   │   ├── Dashboard.jsx               # Main dashboard page
│   │   ├── Login.jsx                   # User login page
│   │   ├── Profile.jsx                 # User profile page
│   │   ├── RulesPage.jsx               # Instructions/Rules page before starting a test
│   │   └── TestPage.jsx                # Active test-taking page
│   ├── styles/
│   │   └── global.css                  # Global utility styles
│   ├── utils/
│   │   └── formatTime.js               # Utility function for time formatting
│   ├── App.css                         # App-level styles
│   ├── App.jsx                         # Root application component
│   ├── index.css                       # Global CSS reset and styles
│   └── index.jsx                       # Entry point
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1.  Clone the repository or download the source code.
2.  Navigate to the project directory:
    ```bash
    cd assessment-application-master
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

To start the development server:

```bash
npm run dev
```

This will start the application usually on `http://localhost:5173` (Vite's default port). Open your browser to view the application.

### Building for Production

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Technologies Used

- **React**: UI library
- **Vite**: Build tool and development server
- **React Router**: Client-side routing
- **CSS3**: Styling (Modules/Global)

## Scripts

- `dev`: Starts the development server.
- `build`: Builds the app for production.
- `preview`: Locally preview the production build.
