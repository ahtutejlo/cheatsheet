---
ua_question: "Як використовувати matrix builds і reusable workflows у GitHub Actions?"
en_question: "How to use matrix builds and reusable workflows in GitHub Actions?"
ua_answer: |
  Matrix і reusable workflows — це два механізми, які перетворюють GitHub Actions з "копіпейст YAML" на масштабовану CI-платформу.

  **Matrix builds** запускають той самий job на різних комбінаціях параметрів паралельно. Класика — крос-платформне тестування:

  ```yaml
  jobs:
    test:
      strategy:
        fail-fast: false
        matrix:
          python: ["3.10", "3.11", "3.12"]
          os: [ubuntu-latest, macos-latest]
          include:
            - python: "3.13"
              os: ubuntu-latest
              experimental: true
          exclude:
            - python: "3.10"
              os: macos-latest
      runs-on: ${{ matrix.os }}
      continue-on-error: ${{ matrix.experimental || false }}
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-python@v5
          with: { python-version: "${{ matrix.python }}" }
        - run: pytest
  ```

  **`fail-fast: false`** — критично для тестових пайплайнів: якщо одна комбінація впала, інші мають догнатися, інакше ви не бачите повної картини.

  **Reusable workflows** — workflow, який викликається з іншого workflow як функція. Замінюють повторюваний YAML між репозиторіями.

  ```yaml
  # .github/workflows/test-suite.yml (reusable)
  on:
    workflow_call:
      inputs:
        python-version: { required: true, type: string }
      secrets:
        gcp-key: { required: true }
  jobs:
    test:
      runs-on: ubuntu-latest
      steps: ...

  # .github/workflows/pr.yml (caller)
  jobs:
    pytest:
      uses: ./.github/workflows/test-suite.yml
      with: { python-version: "3.12" }
      secrets: { gcp-key: ${{ secrets.GCP_KEY }} }
  ```

  **Composite actions** — простіша альтернатива reusable workflows для послідовності кроків. Не дають окремих jobs, але добре заміняють повторювані шматки `setup`.

  **Anti-pattern:** matrix із 50+ комбінацій без потреби. Кожна job запускає окремий runner, тож вартість і час лінійно ростуть. Ділимо матрицю на "smoke на PR" і "full на main/nightly".
en_answer: |
  Matrix and reusable workflows turn GitHub Actions from "copy-pasted YAML" into a scalable CI platform.

  **Matrix builds** run the same job in parallel across parameter combinations. Classic use is cross-platform testing:

  ```yaml
  jobs:
    test:
      strategy:
        fail-fast: false
        matrix:
          python: ["3.10", "3.11", "3.12"]
          os: [ubuntu-latest, macos-latest]
          include:
            - python: "3.13"
              os: ubuntu-latest
              experimental: true
          exclude:
            - python: "3.10"
              os: macos-latest
      runs-on: ${{ matrix.os }}
      continue-on-error: ${{ matrix.experimental || false }}
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-python@v5
          with: { python-version: "${{ matrix.python }}" }
        - run: pytest
  ```

  **`fail-fast: false`** is critical for test pipelines: if one combination fails, the rest must still finish, otherwise you can't see the full picture.

  **Reusable workflows** — a workflow called from another workflow like a function. They replace duplicated YAML across repos.

  ```yaml
  # .github/workflows/test-suite.yml (reusable)
  on:
    workflow_call:
      inputs:
        python-version: { required: true, type: string }
      secrets:
        gcp-key: { required: true }
  jobs:
    test:
      runs-on: ubuntu-latest
      steps: ...

  # .github/workflows/pr.yml (caller)
  jobs:
    pytest:
      uses: ./.github/workflows/test-suite.yml
      with: { python-version: "3.12" }
      secrets: { gcp-key: ${{ secrets.GCP_KEY }} }
  ```

  **Composite actions** — simpler alternative for a sequence of steps. They don't give separate jobs but are great for repeated `setup` chunks.

  **Anti-pattern:** matrix with 50+ combinations for no reason. Each job spins up its own runner, so cost and time grow linearly. Split into "smoke on PR" and "full on main/nightly".
section: "devops"
order: 4
tags: [github-actions, ci-cd, automation]
---
