---
post_title: Product Requirements Document – Core Values Application
author1: Product Team
post_slug: prd-core-values-app
microsoft_alias: n/a
featured_image: ''
categories: ['product', 'requirements', 'core-values']
tags: ['PRD', 'values', 'card-sorting', 'React', 'Vite', 'team', 'individual']
ai_note: true
summary: Comprehensive PRD for the Core Values Application, detailing user stories, acceptance criteria, technical considerations, and success metrics.
post_date: 2025-08-03
---

## PRD: Core Values Application

## 1. Product overview

### 1.1 Document title and version

* PRD: Core Values Application
* Version: 1.0

### 1.2 Product summary

The Core Values Application enables individuals and teams to distil a long list of personal or organisational values into a concise set of core values through a card-sorting game. It is designed for self-reflection workshops, team-building sessions, and organisational culture exercises. The MVP supports both individual and team modes, with local-first data storage and a focus on accessibility and privacy.

## 2. Goals

### 2.1 Business goals

- Provide an interactive, accessible platform for value discovery
- Enhance team cohesion by identifying shared values
- Deliver a privacy-first, data-secure experience
- Support workshops and organisational development

### 2.2 User goals

- Easily identify and prioritise core values
- Save, export, and share results
- Experience a smooth, accessible UI on both desktop and mobile
- Use the app in both individual and team settings

### 2.3 Non-goals

- Real-time multi-user collaboration (future enhancement)
- Remote data sync (future enhancement)
- Organisation-specific branding (future enhancement)

## 3. User personas

### 3.1 Key user types

- Individuals (personal development, students, freelancers)
- Teams (HR, managers, project leads)
- Facilitators (workshop leaders)

### 3.2 Basic persona details

- **Individual User**: Seeks personal growth and clarity on values
- **Team Member**: Participates in team-building and alignment exercises
- **Facilitator**: Guides groups through value discovery

### 3.3 Role-based access

- **Individual**: Access to personal mode, local data
- **Team**: Access to team mode, local data
- **Facilitator**: Can set up sessions for groups

## 4. Functional requirements

* **Card sorting game** (Priority: High)
  - Drag-and-drop (desktop) and tap (mobile) for sorting cards
  - Five importance columns, dynamically reduced as rounds progress
  - Discard cards in "Not Important" at round end
  - Pre-populate replay option

* **Mode selection** (Priority: High)
  - Choose between individual and team mode
  - Select target number of core values (3–15)

* **Progress tracking** (Priority: High)
  - Save session state to IndexedDB after each action
  - Visual indicator for saved progress

* **Export/import** (Priority: Medium)
  - Export session as JSON or text
  - Import session from JSON or clipboard

* **Accessibility** (Priority: High)
  - Keyboard navigation, ARIA roles, visible focus ring
  - WCAG 2.1 AA compliance

* **Responsive UI/UX** (Priority: High)
  - Drag-and-drop for desktop, tap for mobile
  - Tailwind CSS for theming
  - Framer Motion for animations

* **Privacy & terms** (Priority: High)
  - Terms of use and privacy policy pages
  - No remote storage unless user opts in (future)

## 5. User experience

### 5.1 Entry points & first-time user flow

- Home page: Choose team or individual mode
- Select number of core values
- Start game: Begin round 1

### 5.2 Core experience

- Card sorting: User moves each card to one of five columns
- End of round: Discard "Not Important" cards
- Next round: Repeat until "Very Important" matches target
- Save/export/share results

### 5.3 Advanced features & edge cases

- Pre-populate replay for faster sorting
- Error handling for import/export failures
- Accessibility for keyboard-only users
- Mobile tap interaction for sorting

### 5.4 UI/UX highlights

- Responsive design for desktop and mobile
- Tailwind CSS for consistent theming
- Framer Motion for smooth animations
- Visible focus ring and high-contrast palette

## 6. Narrative

Users begin by selecting their mode and target value count, then sort value cards through multiple rounds, progressively narrowing their choices. The experience is designed to be engaging, accessible, and privacy-focused, supporting both personal reflection and team alignment.

## 7. Success metrics

### 7.1 User-centric metrics

- Number of completed sessions
- User satisfaction (feedback)
- Accessibility compliance rate

### 7.2 Business metrics

- Adoption rate in workshops/teams
- Export/share feature usage
- Repeat usage rate

### 7.3 Technical metrics

- IndexedDB save reliability
- Error rate for import/export
- Performance on mobile/desktop

## 8. Technical considerations

### 8.1 Integration points

- Local IndexedDB for session storage
- JSON import/export
- Future: Supabase integration

### 8.2 Data storage & privacy

- Local-first storage
- No remote sync in MVP
- Terms of use and privacy policy required

### 8.3 Scalability & performance

- Efficient state management for large card sets
- Responsive UI for all device sizes
- Fast load and save operations

### 8.4 Potential challenges

- Ensuring accessibility across devices
- Handling large sessions in local storage
- Error handling for import/export

## 9. Milestones & sequencing

### 9.1 Project estimate

- MVP: 4–6 weeks

### 9.2 Team size & composition

- 2–3 developers (React, TypeScript, Vite)
- 1 designer (UX/UI)
- 1 product manager

### 9.3 Suggested phases

* **Phase 1**: Core game mechanics, individual mode (2 weeks)
  - Card sorting, rounds, local save
* **Phase 2**: Team mode, export/import, accessibility (2 weeks)
  - Team data, session export/import, keyboard navigation
* **Phase 3**: UI polish, privacy/terms pages, testing (2 weeks)
  - Responsive design, Framer Motion, compliance

## 10. User stories

### 10.1. Start a new session

* **ID**: GH-001
* **Description**: As a user, I want to start a new session and choose between individual or team mode so I can begin sorting values.
* **Acceptance criteria**:
  - User can select mode on home page
  - User can choose target core value count
  - Session starts with correct card set

### 10.2. Sort value cards

* **ID**: GH-002
* **Description**: As a user, I want to sort value cards into columns using drag-and-drop (desktop) or tap (mobile) so I can prioritise my values.
* **Acceptance criteria**:
  - Cards can be moved to columns via drag-and-drop or tap
  - Keyboard navigation is supported
  - Columns dynamically reduce as rounds progress

### 10.3. Save progress

* **ID**: GH-003
* **Description**: As a user, I want my progress to be saved automatically so I can resume my session later.
* **Acceptance criteria**:
  - Session state is saved to IndexedDB after each action
  - Visual indicator confirms save
  - User can resume session from saved state

### 10.4. Export and import sessions

* **ID**: GH-004
* **Description**: As a user, I want to export my session as JSON or text and import it on another device so I can continue my progress.
* **Acceptance criteria**:
  - Export to clipboard and file supported
  - Import from clipboard and file supported
  - Error handling for invalid data

### 10.5. Accessibility compliance

* **ID**: GH-005
* **Description**: As a user, I want the app to be fully accessible so I can use it regardless of ability.
* **Acceptance criteria**:
  - Keyboard navigation for all actions
  - ARIA roles implemented
  - Visible focus ring and high-contrast palette

### 10.6. Privacy and terms

* **ID**: GH-006
* **Description**: As a user, I want to view terms of use and privacy policy so I understand how my data is handled.
* **Acceptance criteria**:
  - Terms and privacy pages accessible from home page
  - Clear explanation of local data storage
  - No remote sync unless user opts in (future)

### 10.7. Team mode

* **ID**: GH-007
* **Description**: As a team user, I want to run sessions with team-specific value sets so we can align on shared values.
* **Acceptance criteria**:
  - Team mode selectable on home page
  - Team value set loaded from JSON
  - Team results saved separately

### 10.8. Print results

* **ID**: GH-008
* **Description**: As a user, I want to print my results so I can share them in workshops or meetings.
* **Acceptance criteria**:
  - Print button available after session
  - Print formatting matches app design
  - Print preview supported

### 10.9. Error handling

* **ID**: GH-009
* **Description**: As a user, I want clear error messages for failed imports, saves, or exports so I can resolve issues easily.
* **Acceptance criteria**:
  - User-friendly error messages displayed
  - Recovery options provided
  - Errors logged for debugging

### 10.10. Authentication (future)

* **ID**: GH-010
* **Description**: As a user, I want to authenticate and sync my data remotely so I can access sessions across devices (future enhancement).
* **Acceptance criteria**:
  - Authentication flow implemented
  - Supabase integration for remote sync
  - User consent required for remote storage
