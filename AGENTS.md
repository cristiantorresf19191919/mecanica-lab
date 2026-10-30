# Course website

The user requests Anatomy illustrations for this project's educational visuals. Use the Anatomy skill (https://github.com/wheresryan22/anatomy), read its SKILL.md before adding or changing figures, and follow ILLUSTRATION-GUIDE.md. Keep illustrations interactive, accessible, and consistent with their physical models. Preserve the existing Three.js laboratories.

Static site: serve dist/. Validate changes with `node scripts/check-course.mjs` and browser checks of affected interactions. Do not require Netlify: the user currently wants to keep working locally.

## Releases and hosting costs
- Use `develop` or a feature branch for routine work. Commit and push there; do not automatically push updates to `main`.
- Preview locally on port 8765. Do not create Netlify preview/production deploys for routine edits.
- Netlify is manual-release only: keep Git continuous deployment disconnected and builds stopped. Never enable it or add deployment CI without an explicit user request.
- Deploy only when the user explicitly asks to release/deploy. Run local checks, review the diff, and publish `dist/` once using the documented release procedure. A push alone must not publish.
- Main represents reviewed releases. Do not merge develop into main merely because an editing task is complete.
