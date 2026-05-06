---
ua_question: "Як генерувати typed synthetic data з Faker + Pydantic?"
en_question: "How to generate typed synthetic data with Faker + Pydantic?"
ua_answer: |
  **Сценарій:** ваш integration-test потребує реалістичних, але fake даних: адреси, імена, email, дати, IBAN. У вас є API з Pydantic-моделями і ви хочете щоб synthetic data автоматично відповідала цим contract'ам.

  **Підхід:**
  1. Faker для random realistic values
  2. Pydantic для type contracts
  3. Factory pattern, що поєднує обидва — type-safe data

  **Рішення:**

  **Базовий приклад:**

  ```python
  from pydantic import BaseModel, EmailStr, Field
  from faker import Faker
  from datetime import datetime
  from decimal import Decimal

  fake = Faker()

  class Address(BaseModel):
      street: str
      city: str
      postal_code: str = Field(pattern=r"^\d{5}$")
      country: str

  class Customer(BaseModel):
      id: str
      email: EmailStr
      full_name: str
      birth_date: datetime
      balance: Decimal = Field(ge=0)
      address: Address
      tags: list[str] = []

  def make_customer() -> Customer:
      return Customer(
          id=f"cust_{fake.uuid4()[:8]}",
          email=fake.email(),
          full_name=fake.name(),
          birth_date=fake.date_of_birth(minimum_age=18, maximum_age=80),
          balance=Decimal(str(round(fake.random.uniform(0, 10000), 2))),
          address=Address(
              street=fake.street_address(),
              city=fake.city(),
              postal_code=fake.numerify("#####"),
              country=fake.country_code()
          ),
          tags=fake.random_choices(elements=("vip", "trial", "active"), length=2)
      )
  ```

  Pydantic валідує одразу — якщо `email` не EmailStr-сумісний або `balance` < 0, ValidationError одразу. Помилки у data-generator знаходяться при першому виклику, а не у тесті через 5 хвилин.

  **Polyfactory — type-safe factories:**

  Найкращий tooling — `polyfactory`, що автоматично генерує factories з Pydantic-моделей:

  ```python
  from polyfactory.factories.pydantic_factory import ModelFactory
  from polyfactory import Use

  class CustomerFactory(ModelFactory[Customer]):
      __model__ = Customer
      __faker__ = fake

      # Override defaults для конкретних полів
      id = Use(lambda: f"cust_{fake.uuid4()[:8]}")
      tags = Use(fake.random_choices, elements=("vip", "trial", "active"), length=2)

  class AddressFactory(ModelFactory[Address]):
      __model__ = Address
      postal_code = Use(fake.numerify, "#####")

  # Використання у тестах
  customer = CustomerFactory.build()                    # один customer
  customers = CustomerFactory.batch(size=100)           # 100 customers
  vip_customer = CustomerFactory.build(tags=["vip"])    # override field
  ```

  **Hypothesis для property-based testing:**

  Якщо ви хочете не "random sample", а "property holds for all inputs":

  ```python
  from hypothesis import given, strategies as st
  from hypothesis.provisional import urls

  @given(
      email=st.emails(),
      age=st.integers(min_value=0, max_value=150),
      balance=st.decimals(min_value=0, max_value=1_000_000, places=2)
  )
  def test_customer_validation(email, age, balance):
      customer = Customer(
          id="cust_test",
          email=email,
          full_name="Test User",
          birth_date=datetime(2024, 1, 1),
          balance=balance,
          address=AddressFactory.build()
      )
      assert customer.balance >= 0
  ```

  Hypothesis буде намагатись знаходити edge cases (empty strings, max integers, special chars), що Faker випадково ніколи не вибере.

  **Detrministic seeding — reproducible flakes:**

  ```python
  fake = Faker()
  fake.seed_instance(42)  # seed на рівні Faker

  # Або у polyfactory
  CustomerFactory.__faker__.seed_instance(42)
  ```

  Це критично для **reproducing flaky tests**. Faker без seed → нові дані кожен run → flake тільки в одному з 100 runs неможливо налагодити.

  **Множинні locales:**

  ```python
  # Multi-language data — для перевірки i18n
  uk_fake = Faker("uk_UA")
  ja_fake = Faker("ja_JP")

  ukrainian_customer = Customer(
      id="...",
      full_name=uk_fake.name(),       # "Олександр Іванович Петренко"
      address=Address(
          city=uk_fake.city(),          # "Київ"
          street=uk_fake.street_address(),
          ...
      ),
      ...
  )
  ```

  **Поради:**
  - Використовуйте Pydantic v2 — швидший, кращі error messages
  - factory_boy теж має FactoryBoy + Faker integration, але polyfactory native to Pydantic
  - Для DB seeds — генеруйте 10k записів через batch і `bulk_write` / `executemany`
  - Завжди заводіть `__faker__.seed_instance` у CI tests — для reproducibility
  - Уникайте `random.choice` напряму — використовуйте Faker.random_element для consistency

  **Anti-pattern:** inline `{"email": "test@example.com", "name": "John"}` у кожному тесті. Через рік — refactor моделі, ламає 200 тестів.
en_answer: |
  **Scenario:** your integration test needs realistic-but-fake data — addresses, names, emails, dates, IBANs. You have an API with Pydantic models and want synthetic data to satisfy those contracts automatically.

  **Approach:**
  1. Faker for random realistic values
  2. Pydantic for type contracts
  3. Factory pattern combining both — type-safe data

  **Solution:**

  **Basic example:**

  ```python
  from pydantic import BaseModel, EmailStr, Field
  from faker import Faker
  from datetime import datetime
  from decimal import Decimal

  fake = Faker()

  class Address(BaseModel):
      street: str
      city: str
      postal_code: str = Field(pattern=r"^\d{5}$")
      country: str

  class Customer(BaseModel):
      id: str
      email: EmailStr
      full_name: str
      birth_date: datetime
      balance: Decimal = Field(ge=0)
      address: Address
      tags: list[str] = []

  def make_customer() -> Customer:
      return Customer(
          id=f"cust_{fake.uuid4()[:8]}",
          email=fake.email(),
          full_name=fake.name(),
          birth_date=fake.date_of_birth(minimum_age=18, maximum_age=80),
          balance=Decimal(str(round(fake.random.uniform(0, 10000), 2))),
          address=Address(
              street=fake.street_address(),
              city=fake.city(),
              postal_code=fake.numerify("#####"),
              country=fake.country_code()
          ),
          tags=fake.random_choices(elements=("vip", "trial", "active"), length=2)
      )
  ```

  Pydantic validates immediately — if `email` isn't EmailStr-compatible or `balance` < 0, you get a ValidationError at once. Bugs in the data generator surface on the first call, not five minutes into a test.

  **Polyfactory — type-safe factories:**

  The best tooling is `polyfactory`, which auto-generates factories from Pydantic models:

  ```python
  from polyfactory.factories.pydantic_factory import ModelFactory
  from polyfactory import Use

  class CustomerFactory(ModelFactory[Customer]):
      __model__ = Customer
      __faker__ = fake

      # Override defaults for specific fields
      id = Use(lambda: f"cust_{fake.uuid4()[:8]}")
      tags = Use(fake.random_choices, elements=("vip", "trial", "active"), length=2)

  class AddressFactory(ModelFactory[Address]):
      __model__ = Address
      postal_code = Use(fake.numerify, "#####")

  # Use in tests
  customer = CustomerFactory.build()                    # one customer
  customers = CustomerFactory.batch(size=100)           # 100 customers
  vip_customer = CustomerFactory.build(tags=["vip"])    # override a field
  ```

  **Hypothesis for property-based testing:**

  When you don't want a "random sample" but "property holds for all inputs":

  ```python
  from hypothesis import given, strategies as st
  from hypothesis.provisional import urls

  @given(
      email=st.emails(),
      age=st.integers(min_value=0, max_value=150),
      balance=st.decimals(min_value=0, max_value=1_000_000, places=2)
  )
  def test_customer_validation(email, age, balance):
      customer = Customer(
          id="cust_test",
          email=email,
          full_name="Test User",
          birth_date=datetime(2024, 1, 1),
          balance=balance,
          address=AddressFactory.build()
      )
      assert customer.balance >= 0
  ```

  Hypothesis hunts for edge cases (empty strings, max integers, special chars) Faker would never pick.

  **Deterministic seeding — reproducible flakes:**

  ```python
  fake = Faker()
  fake.seed_instance(42)  # seed at Faker level

  # Or in polyfactory
  CustomerFactory.__faker__.seed_instance(42)
  ```

  Critical for **reproducing flaky tests**. Faker without a seed → fresh data every run → a flake that fires in 1 out of 100 runs is impossible to debug.

  **Multiple locales:**

  ```python
  # Multi-language data — useful for i18n checks
  uk_fake = Faker("uk_UA")
  ja_fake = Faker("ja_JP")

  ukrainian_customer = Customer(
      id="...",
      full_name=uk_fake.name(),       # "Олександр Іванович Петренко"
      address=Address(
          city=uk_fake.city(),          # "Київ"
          street=uk_fake.street_address(),
          ...
      ),
      ...
  )
  ```

  **Tips:**
  - Use Pydantic v2 — faster, better error messages
  - factory_boy also has FactoryBoy + Faker integration, but polyfactory is native to Pydantic
  - For DB seeds — generate 10k rows via batch and `bulk_write` / `executemany`
  - Always set `__faker__.seed_instance` in CI tests for reproducibility
  - Avoid `random.choice` directly — use Faker.random_element for consistency

  **Anti-pattern:** inline `{"email": "test@example.com", "name": "John"}` in every test. A year later, refactoring the model breaks 200 tests.
section: "python"
order: 53
tags: [test-data, pydantic, faker, fixtures]
type: "practical"
---
