# tela

HTML → screenshot CLI (png/jpeg/jpg) powered by Playwright + system Chromium.

**Current status:** Debian only (.deb packaging).

## Usage

```bash
tela -i ./page.html -r 1080x1080 -o post.png
tela -i ./page.html                  # defaults: 390x844 → out.png
```

Flags: `-i` input HTML (required), `-r` resolution WxH, `-o` output (png/jpeg/jpg).

## For AI agents

tela is designed to be driven by coding agents (Claude Code, opencode, etc.): the agent generates the HTML and runs the CLI to produce images. A `SKILL.md` is planned for this repo — check it for agent-ready instructions once available.

## Install (from source)

```bash
git clone https://github.com/Gabrielito666/tela.git
cd tela
make build
sudo apt install ./dist/tela_0.1.1_all.deb
```

`make build` needs node + pnpm + esbuild on the build machine; the installed package only needs chromium and recommends nodejs >= 18 or bun.

## Requirements

- chromium at /usr/bin/chromium (override with `CHROMIUM_PATH` env var)
- node >= 18 or bun (runtime, recommended)
