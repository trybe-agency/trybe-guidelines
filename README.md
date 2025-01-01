# Arched Door (POC)

**Arched Door** is a POC of how an internal documentation website could be made.

Demo:
- Website: https://arched-door.netlify.app/
- Default password: `somepassword`


## Overview

It's not about a specific tech, it's about the process:

- Write in plain markdown (or GitHub Flavored Markdown).

- Generate a static website.

- Add auth.


## Technologies

- [mdBook](https://github.com/rust-lang/mdBook).
    * Why? Simple and works perfectly.
    * Supports plugins (inc. `pandoc`).

- GitHub Actions
  * [x] [Quickstart for GitHub Actions | GitHub Docs](https://docs.github.com/en/actions/writing-workflows/quickstart)
  * [ ] [GitHub Action: Install Rust Toolchain](https://github.com/actions-rust-lang/setup-rust-toolchain)
  * [ ] `act` https://github.com/nektos/act
    + Running GitHub Actions locally.

- Netlify
    * Why? We're more used to Netlify. It's straightforward to use.
    * Alternatives:
        + Vercel.


## Arched Door: Branding

Main theme: Desert.

**Arched**, literally an arched door
Arched as in architecture, suggestion it is a tech-related.

**Door**:  Charles Dickens' door quote.
Think: Door of knowledge.

### Name

The name was gonna be either Chickadee, Secretarybird, or some other bird
(but not ravens/crows though, they are way smarter than this thing).

Possible names:

- [x] Chickadee (code name)

- [ ] Secretarybird

- [ ] Stellar Almanac (astronomy-related)

- [ ] Red coral

- [x] Arched Door


## Technical details

### About mdBook

See: [About mdbook](./about-mdbook.md).

### About the GitHub Action

The GitHub Action expects the following environment secrets:
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

It uses a prebuilt binary (fast) and falls back to building from source (slow).


## License

WTFPL
