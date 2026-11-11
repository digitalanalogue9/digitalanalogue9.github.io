---
name: Core Values
description: A calm editorial interface for reflecting on personal values.
colors:
  ink: '#3c2a38'
  plum: '#613d60'
  rose: '#d8a2bb'
  paper: '#faf5f8'
  warm: '#efe0d8'
  line: '#d6bdcc'
typography:
  heading:
    fontFamily: 'DM Sans, Arial, sans-serif'
    fontWeight: 600
    lineHeight: 1.08
  body:
    fontFamily: 'Source Serif 4, Georgia, Times New Roman, serif'
rounded:
  card: '8px'
spacing:
  panel: 'clamp(1.5rem, 3vw, 2.5rem)'
---

# Design System: Core Values

## Overview

The public site has a quiet, warm editorial character. Clear sans-serif headings and readable serif copy support
reflection, while sans-serif controls keep the exercise practical.

## Colors

Deep plum anchors the header, links and primary actions. Rose provides a softer accent; dark ink carries text. Pale
paper and warm tones form the background, with muted rose lines separating sections. Use the existing semantic surface
and text tokens for application controls.

## Typography

DM Sans gives page and exercise headings a clear, modern hierarchy; Source Serif 4 carries body copy and reflection
text. Source Sans 3 remains on navigation and compact interface controls. Standard public page titles follow the About
page scale, with sizes of 2.25rem, 3rem and 3.75rem at the existing responsive breakpoints. Section headings use DM Sans
at 1.875rem, rising to 2.25rem at 640px. Page introductions use Source Serif 4 at 1.125rem with 1.6 line height, ink
color, and a consistent 1rem gap below the title. The home page retains its own heading and hero introduction. Keep
headings readable as they wrap on small screens.

## Layout

Public content pages use a centered, bordered panel up to 56rem wide, with responsive inner padding. Separate major
sections with one fine horizontal rule above each section and generous space; card outlines continue to group controls
and results. Keep long-form copy to a comfortable measure. The home page has a wider composition and its own hero
layout; the guide's example views stack on narrow screens.

## Elevation & Depth

Panels use a subtle shadow (`0 1px 3px rgb(23 50 77 / 10%)`) and a fine border. Depth is restrained so the content
remains the focus.

## Shapes

Panels use gently rounded corners. Thin borders and dividers define surfaces and section boundaries without heavy
decoration.

## Components

### Navigation

The plum header and footer use light text. Navigation links have a 44px minimum target height, an underline or
translucent background for active and hover states, and a visible focus outline.

### Buttons and links

Use the established primary button and link styles. Primary actions use the plum and rose palette; secondary actions use
bordered or text treatments. Preserve visible keyboard focus and disabled states.

### Panels and cards

Use the shared page panel for public content pages and the existing card styles for grouped exercise content. Keep form
controls and saved-session actions legible within their containers.

## Do's and Don'ts

- **Do** use the About page heading scale for standard public page titles.
- **Do** use the existing editorial palette and section rules to connect related pages.
- **Don't** reduce the home hero to the standard page-title scale.
