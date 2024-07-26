# Check diff action

This actions checks if there's a git diff (for instance after build), and optionally creates a PR with changes.

## Usage

### Prerequisites

You'll need to set up a workflow file in your repository's `.github/workflows` directory which triggers on for instance `push` or `pull_request`:

```yml
on:
  - pull_request
```

### Update build output

In some cases, we commit our build outputs to Git.
When we do that, it's crucial that the build output is updated after changes to the source code.
This workflow will check the build output and crash if the newest build output is not commited.

```yml
name: Check build output

on:
  - pull_request

jobs:
  check-build-output:
    name: Check build output
    runs-on: ubuntu-latest
    steps:
      # Check out the repository
      - uses: actions/checkout@v4

      # Install dependencies
      - run: npm install

      # Build the project
      - run: npm run build

      # Check if the build output has changed
      - uses: boyum/check-diff-action@v1
```

### Check linting or formatting

If you have a linter or formatter in your build process, you can use this workflow to create a PR if the linter or formatter finds (auto-fixable) issues.

> [!IMPORTANT]
> The `contents: read` and `pull-requests: write` permissions are required to create a PR.

```yml
name: Check linting

on:
  - pull_request

permissions:
  contents: read
  pull-requests: write

jobs:
  check-linting:
    name: Check linting
    runs-on: ubuntu-latest
    steps:
      # Check out the repository
      - uses: actions/checkout@v4

      # Install dependencies
      - run: npm install

      # Run the linter
      - run: npm run lint

      # Check if the linter has changed the files
      - uses: boyum/check-diff-action@v1
        with:
          create-pr: true
          pr-title: Fix linting issues # The PR title is optional
```

### Options

| Name                | Required | Default value                         | Description                                                                        |
| ------------------- | -------- | ------------------------------------- | ---------------------------------------------------------------------------------- |
| `github-token`      | false    | `github.token`                        | GITHUB_TOKEN or a repo scoped PAT.                                                 |
| `working-directory` | false    | `.`                                   | The directory where the library.json file is located, relative to the Git project. |
| `create-pr`         | false    | `false`                               | If a PR should be created if the diff is not empty.                                |
| `pr-title`          | false    | `check-diff-action found differences` | The title of the PR.                                                               |

## Development

### Validating PRs

To test this action, a workflow is set up which will build and verify the test fixtures.
Each fixture will crash the build and create a PR _if everything's ok_.
This is counter-intuitive, but it's the only way to test the action in a real-world scenario (which I can think of).

### Releasing new versions

#### Create release

Each release has its own Git _tag_. Do these steps to create a new release:

1. Create the tag: `git tag <version>`
1. Push the tag to origin: `git push origin <version>`

#### Update release

Because the release is now tagged to a specific commit, if you want to update the release, the tag has to be destroyed and re-created:

1. Delete the tag: `git push origin --delete <version>`
1. Delete the local tag: `git tag -d <version>`
1. Create the tag again: `git tag <version>`
1. Push the tag to origin: `git push origin <version>`
