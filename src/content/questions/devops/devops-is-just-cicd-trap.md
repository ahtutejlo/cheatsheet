---
ua_question: "DevOps — це просто CI/CD?"
en_question: "Is DevOps just CI/CD?"
ua_answer: |
  > **Trap:** "DevOps = setting up Jenkins/GitHub Actions and writing pipelines." Це найбільш поширений непорозуміння — і саме воно ламає інтерв'ю на DevOps & Test Automation позиціях.

  CI/CD — це **один з інструментів** DevOps, не сама дисципліна. DevOps — це культура і практика, які скорочують відстань між "розробник написав код" і "код працює у проді надійно", з фокусом на спільну відповідальність розробників і операцій.

  **Ширше визначення (CALMS framework):**
  - **C**ulture — shared ownership, blameless post-mortems
  - **A**utomation — CI/CD, IaC, configuration management, тестова інфраструктура
  - **L**ean — потокова робота, мінімальний WIP, fast feedback
  - **M**easurement — DORA metrics, SLOs, MTTR, error budgets
  - **S**haring — internal docs, runbooks, post-mortem знання

  **Що насправді охоплює DevOps:**
  - Infrastructure as Code (Terraform/Pulumi/Crossplane)
  - Containerization і orchestration (Docker, K8s)
  - Cloud platforms (GCP/AWS/Azure)
  - Observability (logs/metrics/traces, on-call alerting)
  - Reliability engineering (SLO/SLI, error budgets, incident response)
  - Security & compliance (secrets management, image scanning, SOC2)
  - Test infrastructure (ephemeral envs, test data management)
  - Cost engineering (FinOps)
  - Developer Experience (internal platforms, golden paths)

  **Чому це важливо для тестового автоматизатора:**
  Роль "DevOps & Test Automation Engineer" буквально живе на стику цих двох світів. Питання на інтерв'ю не обмежуться "напиши GitHub Action" — зайдуть про:
  - Як ефемерне середовище створюється і знищується (IaC)
  - Як тестова БД seedиться і маскується (data engineering)
  - Які SLO ви ставите для test pipeline reliability
  - Як observability у тест-pipelin'ах допомагає debug-ити flake

  **Перевірка інтерв'юера:** "Розкажіть про останню incident, де тест-pipeline впав. Що змінили?" Якщо відповідь зводиться до "поправили YAML" — це червоний прапор. Хороша відповідь зачіпає monitoring, IaC, change management, і root cause beyond pipeline.
en_answer: |
  > **Trap:** "DevOps = setting up Jenkins/GitHub Actions and writing pipelines." This is the most common misconception — and it's exactly what tanks interviews for DevOps & Test Automation roles.

  CI/CD is **one tool** of DevOps, not the discipline itself. DevOps is a culture and a practice that shortens the distance between "developer wrote code" and "code runs reliably in prod", with shared responsibility between dev and ops.

  **A broader definition (CALMS framework):**
  - **C**ulture — shared ownership, blameless post-mortems
  - **A**utomation — CI/CD, IaC, configuration management, test infrastructure
  - **L**ean — flow work, minimal WIP, fast feedback
  - **M**easurement — DORA metrics, SLOs, MTTR, error budgets
  - **S**haring — internal docs, runbooks, post-mortem knowledge

  **What DevOps actually covers:**
  - Infrastructure as Code (Terraform/Pulumi/Crossplane)
  - Containerization and orchestration (Docker, K8s)
  - Cloud platforms (GCP/AWS/Azure)
  - Observability (logs/metrics/traces, on-call alerting)
  - Reliability engineering (SLO/SLI, error budgets, incident response)
  - Security & compliance (secrets management, image scanning, SOC2)
  - Test infrastructure (ephemeral envs, test data management)
  - Cost engineering (FinOps)
  - Developer Experience (internal platforms, golden paths)

  **Why this matters for a test automation engineer:**
  A "DevOps & Test Automation Engineer" role literally lives at the intersection of these two worlds. Interview questions won't stop at "write a GitHub Action" — they will dig into:
  - How an ephemeral environment is created and destroyed (IaC)
  - How a test database is seeded and masked (data engineering)
  - What SLOs you set for test pipeline reliability
  - How observability in test pipelines helps debug flake

  **Interviewer's tell:** "Tell me about a recent incident where your test pipeline broke. What did you change?" If the answer is "we fixed the YAML", that's a red flag. A good answer touches monitoring, IaC, change management, and root cause beyond the pipeline.
section: "devops"
order: 12
tags: [devops, culture, sre, fundamentals]
type: "trick"
---
