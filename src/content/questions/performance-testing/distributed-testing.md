---
ua_question: "Як працює розподілене навантажувальне тестування у Locust?"
en_question: "How does distributed load testing work in Locust?"
ua_answer: |
  Один процес Locust обмежений одним CPU-ядром через Python GIL та gevent. Для генерації великого навантаження використовується **розподілена архітектура master/worker**: master координує тест та збирає статистику, а workers генерують навантаження.

  **Master** не генерує навантаження -- він лише розподіляє користувачів між workers, агрегує метрики та надає веб-інтерфейс. **Workers** виконують User-класи та відправляють статистику на master. Кількість workers зазвичай дорівнює кількості CPU-ядер на машині.

  Для масштабування на кілька машин workers запускаються на окремих серверах, вказуючи IP-адресу master. У Kubernetes це спрощується через Helm chart або простий Deployment з кількома репліками.

  ```python
  # locustfile.py - same file for master and workers
  from locust import HttpUser, task, between

  class DistributedUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def browse(self):
          self.client.get("/api/products")
  ```

  ```bash
  # Terminal 1: Start master
  locust -f locustfile.py --master --expect-workers 4

  # Terminal 2-5: Start workers (on same or different machines)
  locust -f locustfile.py --worker --master-host=192.168.1.100

  # Or run all on one machine using multiple CPU cores:
  locust -f locustfile.py --master --expect-workers 4 &
  for i in $(seq 1 4); do
      locust -f locustfile.py --worker &
  done
  ```

  ```yaml
  # docker-compose.yml for distributed Locust
  version: "3"
  services:
    master:
      image: locustio/locust
      ports:
        - "8089:8089"
      volumes:
        - ./locustfile.py:/mnt/locust/locustfile.py
      command: -f /mnt/locust/locustfile.py --master --expect-workers 4

    worker:
      image: locustio/locust
      volumes:
        - ./locustfile.py:/mnt/locust/locustfile.py
      command: -f /mnt/locust/locustfile.py --worker --master-host master
      deploy:
        replicas: 4
  ```

  Кожен worker може підтримувати приблизно 500-5000 віртуальних користувачів залежно від складності сценарію. Для 50,000 користувачів зазвичай потрібно 10-20 workers.
en_answer: |
  A single Locust process is limited to one CPU core due to Python's GIL and gevent. For generating heavy load, a **distributed master/worker architecture** is used: the master coordinates the test and collects statistics, while workers generate the load.

  The **master** does not generate load -- it only distributes users among workers, aggregates metrics, and provides the web interface. **Workers** execute User classes and send statistics to the master. The number of workers typically equals the number of CPU cores on the machine.

  For scaling across multiple machines, workers are started on separate servers, pointing to the master's IP address. In Kubernetes, this is simplified through a Helm chart or a simple Deployment with multiple replicas.

  ```python
  # locustfile.py - same file for master and workers
  from locust import HttpUser, task, between

  class DistributedUser(HttpUser):
      wait_time = between(1, 3)

      @task
      def browse(self):
          self.client.get("/api/products")
  ```

  ```bash
  # Terminal 1: Start master
  locust -f locustfile.py --master --expect-workers 4

  # Terminal 2-5: Start workers (on same or different machines)
  locust -f locustfile.py --worker --master-host=192.168.1.100

  # Or run all on one machine using multiple CPU cores:
  locust -f locustfile.py --master --expect-workers 4 &
  for i in $(seq 1 4); do
      locust -f locustfile.py --worker &
  done
  ```

  ```yaml
  # docker-compose.yml for distributed Locust
  version: "3"
  services:
    master:
      image: locustio/locust
      ports:
        - "8089:8089"
      volumes:
        - ./locustfile.py:/mnt/locust/locustfile.py
      command: -f /mnt/locust/locustfile.py --master --expect-workers 4

    worker:
      image: locustio/locust
      volumes:
        - ./locustfile.py:/mnt/locust/locustfile.py
      command: -f /mnt/locust/locustfile.py --worker --master-host master
      deploy:
        replicas: 4
  ```

  Each worker can support approximately 500-5,000 virtual users depending on scenario complexity. For 50,000 users, you typically need 10-20 workers.
section: "performance-testing"
order: 10
tags:
  - locust
  - infrastructure
type: "basic"
---
