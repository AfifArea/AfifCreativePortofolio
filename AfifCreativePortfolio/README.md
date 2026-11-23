# Afif Portofolio

Personal portfolio for Afif Maulana — Graphic Designer.
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion (motion.dev) for all animation · Lenis smooth scroll.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Editing content

| What | Where |
| --- | --- |
| Name, bio, email, socials, expertise, experience, tools | `src/lib/site.ts` |
| Projects (titles, copy, metadata, image list, order) | `src/lib/projects.ts` |
| Project images | `public/work/<folder>/` (max ~2400px JPG) |
| About image | `public/about/mark.webp` |
| Phone, WhatsApp | `phone` / `phoneDisplay` in `src/lib/site.ts` |

Adding a project to `projects.ts` automatically adds it to the 3D line, the index, the gallery table and gives it its own `/work/<slug>` page.

## Structure

- `/` — Hero → **Selected Works** (scroll-driven 3D clothesline, `components/home/LineGallery.tsx`) → Project → About → Contact
- `/work` — project index with hover-lift previews
- `/work/[slug]` — plate viewer, metadata, full-bleed plate sequence, next project
- `/gallery` — draggable table of every plate, with filters, zoom and lightbox

Page transitions live in `components/transition/`, the custom cursor and nav in `components/chrome/`.

## Motion & accessibility

- Respects `prefers-reduced-motion`; visitors can also switch to reduced motion or the system cursor from **Settings** (bottom-left). In reduced mode the 3D line becomes a plain grid and smooth scrolling is off.
- The custom cursor only runs on fine pointers; elements with `data-cursor="label"` show a label.
- The enquiry form opens the visitor's email app with the message pre-filled (no backend needed).
