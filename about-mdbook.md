# Installing mdbook on Kubuntu 22.04

```sh
sudo snap install rustup --classic

rustup default stable

## linker `cc` was not found
sudo apt install gcc

cargo install mdbook
cargo install mdbook-pandoc
sudo apt install pandoc

# Append `:/home/djalil/.cargo/bin/` to `PATH`
# Reboot or re-login to apply the new config
sudo nano /etc/environment
```


## About footnotes in markdown

**mdbook-pandoc** complains:
`[2024-08-05T07:13:20Z WARN  mdbook_pandoc::pandoc::renderer] Cannot use Pandoc extension footnotes, which may result in degraded output (introduced in version 2.10.1, but using 2.9.2)`

The current Ubuntu LTS is 24.04, which contains pandoc 3.1.
Ubuntu 22.04 (installed on my laptop) contains pandoc 2.9.
https://launchpad.net/ubuntu/+source/pandoc

Meaning, we just need to use a Docker/action image of Ubuntu 24.04.

### Local workaround

Install from releases:
```sh
# Remove pandoc 2.9
sudo apt remove pandoc

# Download from https://github.com/jgm/pandoc/releases
sudo dpkg -i pandoc-3.3-1-amd64.deb

pandoc --version
# pandoc 3.3
```

`book.toml`:
```toml
[book]
title = "ProntoPlan"
authors = ["Abdeldjalil Hebal"]
src = "content"

[output.html]
default-theme = "dark"
preferred-dark-theme = "ayu"

[output.pandoc.profile.docx]
from = "commonmark+autolink_bare_uris"
filters = ["book-pagebreaks.lua"]
output-file = "output.docx"
```

`book-pagebreaks.lua`:
```lua
function Header(elem)
  if elem.level == 1 then
    return { pandoc.RawBlock('openxml', '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'), elem }
  end
end
```


## CI

Using GitHub Actions.

As of 2024-08-07, GitHub Free provides **500 MB storage** and **2,000 minutes (per month)**.
https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions

---

END.
