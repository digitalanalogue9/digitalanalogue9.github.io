# Core Values Application

## Overview
The **Core Values Application** is a tool designed to help individuals and teams identify and prioritise their core values through an interactive card-sorting exercise. It facilitates self-reflection and meaningful decision-making by allowing users to define, sort, and reflect on the values that matter most to them.

### Purpose
The application’s goal is to:
- **Encourage Reflection:** Provide a structured process to help users clarify their values.
- **Enhance Decision-Making:** Support individuals in aligning their actions with their most important values.
- **Build Self-Awareness:** Promote deeper understanding of personal priorities and motivations.

The tool is suitable for both personal development and team-building exercises in professional settings. It aligns with modern self-help practices and organisational psychology principles.

## Business Rationale
### Why Core Values Matter
In today’s fast-paced world, clarity around core values can:
- Enhance individual performance by aligning goals with personal values.
- Strengthen team cohesion by highlighting shared principles.
- Support organisations in fostering a values-driven culture.

### Target Audience
The app is aimed at:
1. **Individuals** seeking personal development.
2. **Teams and Leaders** focused on improving collaboration.
3. **Organisations** aiming to embed a strong values-based culture.

### Differentiation
- **Interactive Process:** Uses a drag-and-drop card-sorting interface.
- **Progress Saving:** Allows users to save their work and return to it later.
- **Mobile Compatibility:** Ensures accessibility across devices.
- **Data Privacy:** User data is stored locally, ensuring full privacy and GDPR compliance.

## Developer Notes
### Technology Stack
- **Framework:** Next.js
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Database:** IndexedDB for local storage
- **PWA:** Fully supports offline capabilities

### Folder Structure
The project adheres to a modular structure, organised as follows:
- `src/app`: Contains Next.js pages.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions, hooks, and global contexts.
- `src/styles`: Global styling configurations.
- `tests`: Unit tests and Lighthouse reports.

### Key Files
- **Interactive Features:**
  - `src/components/features/Home/components/StartScreen/index.tsx`: Entry screen for starting the value discovery process.
  - `src/components/features/Cards/components`: Manages drag-and-drop card functionality.
  - `src/components/features/Categories`: Handles categorisation of values.

- **Utilities:**
  - `src/lib/utils`: Includes helpers for animations, local storage, and configuration.

- **Hooks:**
  - `src/lib/hooks`: Provides reusable hooks for managing app state and context.

### Environment Variables
The application uses the following environment variables for configuration:
- `NEXT_PUBLIC_SERVER_URL`: The base URL for the application.
- `NEXT_PUBLIC_VERSION`: The current version of the application.
- `GA_MEASUREMENT_ID`: Google Analytics Measurement ID (optional, for tracking purposes).
- `CARDS_IN_GAME`: Number of cards in the initial game setup.
- `DEBUG`: Boolean flag to enable or disable debug mode.

To configure these variables, create a `.env.local` file in the root directory with the appropriate values:
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_VERSION=1.0.0
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CARDS_IN_GAME=35
NEXT_PUBLIC_DEBUG=false
```

### Getting Started
#### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

#### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/digitalanalogue9/digitalanalogue9.github.io.git
   ```
2. Navigate to the project directory:
   ```bash
   cd digitalanalogue9.github.io
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

#### Running the Development Server
Start the development server:
```bash
npm run dev
```
Access the application at `http://localhost:3000`.

#### Building for Production
To create a production build:
```bash
npm run build
```
Serve the built files locally:
```bash
npm start
```

### Developer Guidelines
1. **Adding New Features:**
   - Use the existing modular folder structure.
   - Follow the established naming conventions and coding standards.

2. **Testing:**
   - Run `npm test` to execute unit tests.
   - Use Lighthouse for performance and accessibility audits.

3. **Performance Optimisation:**
   - Optimise components for both desktop and mobile views.
   - Use Tailwind’s utility-first classes to minimise CSS bloat.

4. **Accessibility:**
   - Ensure all new features include ARIA attributes where necessary.
   - Test UI components with screen readers.

5. **Data Privacy:**
   - Maintain the local storage-based approach for storing user data.
   - Avoid integrating third-party services that compromise privacy.

### Known Issues and Future Enhancements
#### Current Limitations
- Limited analytics capabilities due to local-first data handling.
- Lack of collaborative features for teams.

#### Planned Enhancements
- Add support for exporting and importing progress.
- Introduce more sophisticated animations during transitions.
- Enable a multi-user/team mode for collaborative exercises.

## Contributing
1. Fork the repository.
2. Create a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Submit a pull request.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contact
For questions or contributions, please email: `dan.hibbert@example.com`.