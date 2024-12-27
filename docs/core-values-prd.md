Here is the **updated and detailed PRD** for the Core Values Application, incorporating feedback and all requested revisions:

---

# Core Values Application: Product Requirements Document (PRD)

## **1. Introduction**

### **1.1 Purpose**
The Core Values Application helps individuals and teams identify and prioritise their core values through an engaging, interactive card-sorting exercise. The tool promotes self-reflection, enhances decision-making, and aligns personal and organisational actions with clearly defined values.

### **1.2 Scope**
This application will support individuals, teams, and organisations by offering features for value discovery, customisation, progress tracking, and sharing. It is designed to work across devices with a focus on data privacy, accessibility, and ease of use.

### **1.3 Audience**
- **Individuals:** Personal development enthusiasts, freelancers, students.
- **Teams and Leaders:** HR professionals, managers, project leads.
- **Organisations:** Focusing on fostering a values-driven culture.

---

## **2. Business Rationale**

### **2.1 Problem Statement**
Many individuals and organisations lack the tools to articulate and align their values with goals, leading to misaligned priorities and missed opportunities for cohesion.

### **2.2 Goals**
- Provide an interactive, accessible platform for value discovery.
- Enhance team cohesion by identifying shared values.
- Deliver a privacy-first, data-secure experience to build user trust.

### **2.3 Benefits**
- **Individuals:** Gain clarity on priorities for better decision-making.
- **Teams:** Foster collaboration and shared understanding.
- **Organisations:** Build a strong, values-driven culture.

---

## **3. Product Overview**

### **3.1 Key Features**
1. **Card Sorting Mechanism:** Drag-and-drop interface for sorting value cards.
2. **Progress Tracking:** Automatically save progress locally.
3. **Export and Import Sessions:** Export results to clipboard or JSON; import data on another device.
4. **Social Sharing:** Share results directly on social media.
5. **Customisation Options:** Add user-defined values or organisation-specific sets.
6. **Accessibility:** Full compliance with WCAG 2.1 AA standards.
7. **Offline Functionality:** Operate seamlessly as a Progressive Web App (PWA).

### **3.2 Use Cases**
- **Personal Use:** An individual reflects on personal values and shares results with a mentor.
- **Team Workshops:** Teams identify shared values to enhance collaboration.
- **Organisational Training:** HR professionals align employees with corporate values.

---

## **4. Functional Requirements**

### **4.1 Core Features**
#### **Card Sorting Mechanism**
- Drag-and-drop functionality for categorising values.
- Ability to reorder cards within categories.
- Keyboard navigation for accessibility.

#### **Progress Tracking**
- Save progress automatically using IndexedDB.
- Provide visual indicators for saved sessions.

#### **Export and Import**
- **Export Options:**
  - Copy session data to clipboard as JSON or plain text.
  - Download JSON file of session details.
- **Import Options:**
  - Upload a JSON file to restore progress.
  - Paste session data from the clipboard.

#### **Social Sharing**
- Pre-defined templates for Facebook, LinkedIn, and Twitter:
  - Example: “Discover your core values! Here are mine: [list of values].”
- Include app branding and links to encourage user engagement.

#### **Printing Results**
- Provide a "Print Results" button to open the browser’s print dialogue.
- Ensure print formatting aligns with the app’s design for readability.

---

### **4.2 Non-Functional Requirements**
1. **Performance:**
   - Load time < 2 seconds on broadband connections.
   - Smooth animations with response times < 100ms.
2. **Scalability:**
   - Support up to 1,000 concurrent users.
3. **Security:**
   - Data encryption using AES-256 for local storage.
   - Ensure GDPR compliance for user data handling.
4. **Accessibility:**
   - Fully navigable via keyboard.
   - Support for screen readers with ARIA attributes.

---

## **5. Technical Specifications**

### **5.1 Architecture**
- **Frontend Framework:** Next.js
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Database:** IndexedDB for local storage
- **Progressive Web App (PWA):** Offline capability with service workers

### **5.2 APIs and Integrations**
- **Clipboard API:** For copying results and session data.
- **Social Media APIs:** Share results using platform-specific URLs:
  - Facebook: `https://www.facebook.com/sharer/sharer.php?u=[URL]&quote=[TEXT]`
  - Twitter: `https://twitter.com/intent/tweet?text=[TEXT]&url=[URL]`
  - LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=[URL]`

---

## **6. Development Roadmap**

### **6.1 Phase 1: MVP Development (Months 1-3)**
- Card sorting mechanism
- Progress tracking
- Social sharing features
- Accessibility compliance

### **6.2 Phase 2: Enhancements (Months 4-6)**
- Export and import functionality
- Customisation of value sets
- Printing results

### **6.3 Phase 3: Enterprise Features (Months 7-9)**
- Multi-user team collaboration
- Aggregated team insights
- Organisation-specific branding

---

## **7. Metrics and KPIs**

1. **Adoption Metrics:**
   - 500 Monthly Active Users (MAUs) within 3 months.
2. **Engagement Metrics:**
   - 70% of users complete the card-sorting exercise.
3. **Accessibility Metrics:**
   - Achieve 100% WCAG 2.1 AA compliance.

---

## **8. Risks and Mitigation**

### **8.1 Risks**
1. **Scope Creep:**
   - Risk: Expanding features beyond the MVP.
   - Mitigation: Use MoSCoW prioritisation.
2. **Technical Challenges:**
   - Risk: Implementing drag-and-drop and multi-device support.
   - Mitigation: Prototype early and conduct regular testing.

### **8.2 Contingency Plan**
Allocate a 15% buffer in the budget for unforeseen challenges.

---

## **9. Testing and Quality Assurance**

### **9.1 Testing Procedures**
1. **Unit Testing:** Validate individual components (e.g., card-sorting logic).
2. **Integration Testing:** Ensure smooth interaction between components (e.g., saving and exporting sessions).
3. **Accessibility Testing:** Use automated tools (e.g., Axe) and manual testing with screen readers.

### **9.2 Quality Criteria**
- Error rate: < 1 per 100 sessions.
- Crash-free sessions: 99.9% or higher.

---

## **10. Compliance and Regulatory Requirements**

### **10.1 GDPR Compliance**
- Data is stored locally using IndexedDB with encryption.
- Users explicitly control all exported or shared data.

### **10.2 Accessibility Standards**
- Full compliance with WCAG 2.1 AA.
- All interactive elements navigable via keyboard.

---

## **11. Appendices**

### **11.1 Version History**
| Version | Date       | Changes                              | Approved By    |
|---------|------------|--------------------------------------|----------------|
| 1.0     | 2024-12-27 | Initial PRD created                  | Product Owner  |
| 1.1     | 2024-12-28 | Added export/import and social sharing details | Product Owner  |

---

This updated PRD reflects all discussed details, providing a clear guide for development, testing, and deployment of the Core Values Application. Let me know if there are additional tweaks or refinements needed!