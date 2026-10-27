# ColourGradient.md --- KaamSetu Colour System

## Brand direction

KaamSetu should feel trustworthy, humane, modern, and action-oriented.
Use deep navy/teal for trust and stability, green for positive outcomes,
amber for caution, and red only for urgent hazards or errors. Avoid a
flashy, multicolor gradient across every component; use gradients
sparingly for brand moments and hero areas.

## Core palette

  Token              Hex         Usage
  ------------------ ----------- ----------------------------------------
  `brand-950`        `#102A43`   Deep brand background, dark navigation
  `brand-800`        `#164E63`   Primary brand teal
  `brand-700`        `#0F766E`   Primary buttons and links
  `brand-600`        `#0D9488`   Accent and active states
  `brand-100`        `#CCFBF1`   Soft teal surfaces
  `surface`          `#FFFFFF`   Main light surface
  `surface-muted`    `#F4F8FA`   App background
  `text-primary`     `#102A43`   Primary text
  `text-secondary`   `#526777`   Supporting text
  `border`           `#D8E3E8`   Dividers and outlines
  `success`          `#15803D`   Resolved, verified, successful
  `warning`          `#B45309`   Needs review, overtime warning
  `danger`           `#B91C1C`   Urgent hazard, failed action
  `info`             `#1D4ED8`   Informational notices

## Recommended gradients

### Primary brand gradient

`linear-gradient(135deg, #164E63 0%, #0F766E 55%, #0D9488 100%)`

Use for: landing-page hero, brand banner, limited highlight areas.

### Deep dashboard gradient

`linear-gradient(135deg, #102A43 0%, #164E63 100%)`

Use for: admin dashboard top banner or dark navigation header.

### Positive outcome gradient

`linear-gradient(135deg, #166534 0%, #15803D 100%)`

Use sparingly for success summary cards; keep body text contrast strong.

### Worker welcome gradient

`linear-gradient(135deg, #E6FFFA 0%, #F0FDFA 55%, #FFFFFF 100%)`

Use for: worker home welcome surface. Use dark text, not white text, on
this light gradient.

## Usage rules

-   Use the primary gradient for no more than one or two major surfaces
    per screen.
-   Do not place small white text on pale gradients.
-   Body text should use `#102A43` or `#526777` on light backgrounds.
-   Buttons must have visible hover, focus, disabled, and pressed
    states.
-   Do not communicate status through color alone; always include a
    label/icon.
-   Keep danger red for genuine safety urgency, destructive actions, and
    errors.
-   Maintain accessible contrast; verify actual text/background
    combinations with a contrast checker.
-   Charts should use a limited palette and include labels/legends.
-   Avoid gradients behind dense tables or long text.

## CSS variables

``` css
:root {
  --brand-950: #102A43;
  --brand-800: #164E63;
  --brand-700: #0F766E;
  --brand-600: #0D9488;
  --brand-100: #CCFBF1;
  --surface: #FFFFFF;
  --surface-muted: #F4F8FA;
  --text-primary: #102A43;
  --text-secondary: #526777;
  --border: #D8E3E8;
  --success: #15803D;
  --warning: #B45309;
  --danger: #B91C1C;
  --info: #1D4ED8;
}
```

## Tailwind mapping

Map these tokens into Tailwind theme extensions instead of scattering
hex values throughout components. If the project uses a different design
system, preserve the same semantic roles.
