# Manual releases: keep development inexpensive

Repository: https://github.com/cristiantorresf19191919/mecanica-lab

Production: https://mecanica-lab-academy.netlify.app
Netlify site ID: `3ac0fb18-edf6-4c3e-9e69-cb2bf9a8742b`

For a new checkout, link the CLI (this does not enable Git deployment):
`netlify link --id 3ac0fb18-edf6-4c3e-9e69-cb2bf9a8742b`

## Everyday work
Work on `develop` or a feature branch. Commit and push for backup, then preview locally:

```sh
python3 -m http.server 8765 --directory dist
```

No routine Netlify previews or production deploys. GitHub pushes do not publish this project. Do not connect Git continuous deployment or turn builds back on.

## Explicit releases only
When the user requests a release:

1. Review the diff and run `node scripts/check-course.mjs`, `node scripts/check-teaching-guides.mjs`, and `node scripts/check-lesson-practice.mjs`, plus checks relevant to the change.
2. Check affected pages locally. Confirm the working tree is clean.
3. Merge the reviewed work into `main` and push the release commit. This does not deploy.
4. Publish once with `netlify deploy --prod --dir=dist --no-build`. The CLI folder link identifies the intended site; verify `netlify status` before deploying.
5. Check the public pages, then switch back to `develop` for continued work.

Manual deploys and serving traffic can still consume credits. This workflow avoids deployments on every edit; it does not make Netlify usage free. Stopping auto-publishing alone is insufficient because builds can still run. This site has no Git build configuration: Git deployment is disconnected, so there are no automatic builds to stop. If Git deployment is ever connected, explicitly stop builds before routine pushes. Reconnecting Git can reactivate builds.

Reference: https://docs.netlify.com/build/configure-builds/stop-or-activate-builds/
