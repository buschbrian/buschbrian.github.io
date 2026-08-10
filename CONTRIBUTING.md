# Contribute to the portfolio

## Before you change a file

1. Read `AGENTS.md`.
2. Read `docs/language-style.md` before you change text.
3. Confirm each project fact with a source in the repository or with the owner.
4. Make one focused change.

## Preview the site

Run a local static server from the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`.

## Check the change

Run these commands:

```sh
node --check assets/js/site.js
git diff --check
```

Check all changed links and image paths. If you change the interface, test keyboard navigation and these widths:

- 320 CSS pixels
- 768 CSS pixels
- 1024 CSS pixels
- 1440 CSS pixels

## Write the pull request

- Use the language style for the title and description.
- Explain the problem.
- Explain the result.
- List the checks that you ran.
- Add images for a visual change.
