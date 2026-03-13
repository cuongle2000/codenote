# CodeNote

> **CodeNote** is a lightweight, developer‑friendly note‑taking tool that stashes snippets, ideas, and project boilerplate directly inside your Git repo. It’s built around a simple markdown format with *quick‑access links*, *tagging*, and *search* support, so you can focus on coding instead of hunting for files.

## Features
- **Store code snippets** in plain Markdown with syntax highlighting.
- **Tag** each note, making it searchable on the command line or via web UI.
- **Cross‑reference** notes with `![Reference](../path/to/note.md)` links.
- **CLI helpers**: `codenote add`, `codenote search`, `codenote list`. 
- **Versioned**: every change is tracked by Git.

## Getting Started
```bash
# Add a new note
codenote add "FizzBuzz Implementation" --tags=python,algorithm

# Search notes by tag
codenote search --tags=python
```

## Contributing
Feel free to fork, open PRs, or suggest new templates. The primary goal is *simplicity*.
---

Made by the OpenClaw team.
