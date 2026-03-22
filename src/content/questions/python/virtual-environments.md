---
ua_question: "Як працюють venv, poetry та управління залежностями?"
en_question: "How do venv, poetry, and dependency management work?"
ua_answer: |
  **Віртуальне середовище** -- ізольована копія інтерпретатора Python з власним набором пакетів. Це запобігає конфліктам залежностей між проєктами. `venv` -- вбудований модуль (Python 3.3+), `poetry` -- сучасний інструмент управління проєктами та залежностями.

  **venv + pip** -- базовий підхід: `venv` створює середовище, `pip` встановлює пакети, `requirements.txt` фіксує версії. Просто, але не вирішує конфлікти залежностей автоматично.

  **Poetry** -- all-in-one інструмент: управління залежностями з автоматичним розв'язанням версій, lock-файл для відтворюваних збірок, збірка та публікація пакетів, керування середовищами.

  ```python
  # venv -- built-in virtual environment
  # python -m venv .venv
  # source .venv/bin/activate  (Linux/Mac)
  # .venv\Scripts\activate     (Windows)

  # pip: install and freeze
  # pip install requests pytest
  # pip freeze > requirements.txt
  # pip install -r requirements.txt

  # requirements.txt with pinned versions
  # requests==2.31.0
  # pytest==8.0.0
  # httpx>=0.25.0,<0.27.0

  # Poetry: modern dependency management
  # pip install poetry
  # poetry new myproject       # create new project
  # poetry init                # init in existing project

  # pyproject.toml (Poetry)
  # [tool.poetry]
  # name = "myproject"
  # version = "1.0.0"
  # python = "^3.11"
  #
  # [tool.poetry.dependencies]
  # requests = "^2.31"
  # pydantic = "^2.0"
  #
  # [tool.poetry.group.dev.dependencies]
  # pytest = "^8.0"
  # pytest-cov = "^4.0"
  # mypy = "^1.0"
  # ruff = "^0.3"

  # Poetry commands
  # poetry install             # install all deps from lock file
  # poetry add requests        # add dependency
  # poetry add --group dev pytest  # add dev dependency
  # poetry remove requests     # remove dependency
  # poetry update              # update deps within constraints
  # poetry lock                # regenerate lock file
  # poetry run pytest          # run command in venv
  # poetry shell               # activate venv

  # pip-tools: middle ground
  # pip install pip-tools
  # Create requirements.in:
  #   requests
  #   pytest
  # pip-compile requirements.in  -> requirements.txt with pinned versions
  # pip-sync requirements.txt    -> install exact versions

  # pyproject.toml (standard, without Poetry)
  # [project]
  # name = "myproject"
  # version = "1.0.0"
  # requires-python = ">=3.11"
  # dependencies = [
  #     "requests>=2.31",
  #     "pydantic>=2.0",
  # ]
  #
  # [project.optional-dependencies]
  # dev = ["pytest>=8.0", "mypy>=1.0"]
  ```

  Рекомендації: завжди використовуйте віртуальне середовище (навіть для маленьких проєктів), фіксуйте версії через lock-файл, розділяйте production та dev залежності, додавайте `.venv` в `.gitignore`. Poetry або pip-tools -- для серйозних проєктів, venv + pip -- для швидких прототипів.
en_answer: |
  A **virtual environment** is an isolated copy of the Python interpreter with its own set of packages. This prevents dependency conflicts between projects. `venv` is a built-in module (Python 3.3+), `poetry` is a modern project and dependency management tool.

  **venv + pip** -- the basic approach: `venv` creates the environment, `pip` installs packages, `requirements.txt` pins versions. Simple but does not resolve dependency conflicts automatically.

  **Poetry** -- an all-in-one tool: dependency management with automatic version resolution, lock file for reproducible builds, package building and publishing, environment management.

  ```python
  # venv -- built-in virtual environment
  # python -m venv .venv
  # source .venv/bin/activate  (Linux/Mac)
  # .venv\Scripts\activate     (Windows)

  # pip: install and freeze
  # pip install requests pytest
  # pip freeze > requirements.txt
  # pip install -r requirements.txt

  # requirements.txt with pinned versions
  # requests==2.31.0
  # pytest==8.0.0
  # httpx>=0.25.0,<0.27.0

  # Poetry: modern dependency management
  # pip install poetry
  # poetry new myproject       # create new project
  # poetry init                # init in existing project

  # pyproject.toml (Poetry)
  # [tool.poetry]
  # name = "myproject"
  # version = "1.0.0"
  # python = "^3.11"
  #
  # [tool.poetry.dependencies]
  # requests = "^2.31"
  # pydantic = "^2.0"
  #
  # [tool.poetry.group.dev.dependencies]
  # pytest = "^8.0"
  # pytest-cov = "^4.0"
  # mypy = "^1.0"
  # ruff = "^0.3"

  # Poetry commands
  # poetry install             # install all deps from lock file
  # poetry add requests        # add dependency
  # poetry add --group dev pytest  # add dev dependency
  # poetry remove requests     # remove dependency
  # poetry update              # update deps within constraints
  # poetry lock                # regenerate lock file
  # poetry run pytest          # run command in venv
  # poetry shell               # activate venv

  # pip-tools: middle ground
  # pip install pip-tools
  # Create requirements.in:
  #   requests
  #   pytest
  # pip-compile requirements.in  -> requirements.txt with pinned versions
  # pip-sync requirements.txt    -> install exact versions

  # pyproject.toml (standard, without Poetry)
  # [project]
  # name = "myproject"
  # version = "1.0.0"
  # requires-python = ">=3.11"
  # dependencies = [
  #     "requests>=2.31",
  #     "pydantic>=2.0",
  # ]
  #
  # [project.optional-dependencies]
  # dev = ["pytest>=8.0", "mypy>=1.0"]
  ```

  Recommendations: always use a virtual environment (even for small projects), pin versions via lock file, separate production and dev dependencies, add `.venv` to `.gitignore`. Poetry or pip-tools -- for serious projects, venv + pip -- for quick prototypes.
section: "python"
order: 37
tags:
  - core-language
  - tooling
type: "basic"
---
