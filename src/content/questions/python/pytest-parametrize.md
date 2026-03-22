---
ua_question: "Як працює parametrize: комбінації, indirect?"
en_question: "How does parametrize work: combinations, indirect?"
ua_answer: |
  `@pytest.mark.parametrize` дозволяє запускати один тест з різними наборами даних. Кожен набір параметрів створює окремий тест-кейс з унікальним ID.

  **Комбінації:** кілька `@parametrize` декораторів створюють декартів добуток -- кожна комбінація параметрів запускається окремо. **indirect** дозволяє передати параметри не в тест, а у fixture -- fixture отримує значення через `request.param`.

  Parametrize підтримує маркери для окремих кейсів (через `pytest.param`), що дозволяє позначити конкретні комбінації як xfail або skip.

  ```python
  import pytest

  # Basic parametrize
  @pytest.mark.parametrize("input,expected", [
      ("hello", 5),
      ("", 0),
      ("world", 5),
  ])
  def test_string_length(input, expected):
      assert len(input) == expected

  # Parametrize with IDs
  @pytest.mark.parametrize("status_code,is_success", [
      pytest.param(200, True, id="ok"),
      pytest.param(404, False, id="not-found"),
      pytest.param(500, False, id="server-error"),
  ])
  def test_status_check(status_code, is_success):
      assert (status_code < 400) == is_success

  # Cartesian product -- multiple parametrize decorators
  @pytest.mark.parametrize("method", ["GET", "POST", "PUT"])
  @pytest.mark.parametrize("auth", [True, False])
  def test_api_endpoint(method, auth):
      # Runs 6 times: GET+True, GET+False, POST+True, ...
      response = make_request(method, authenticated=auth)
      ...

  # Mark specific combinations
  @pytest.mark.parametrize("x,y,expected", [
      (2, 3, 5),
      (0, 0, 0),
      pytest.param(-1, 1, 0, id="negative"),
      pytest.param(1e308, 1e308, float("inf"),
                   marks=pytest.mark.xfail(reason="overflow")),
  ])
  def test_add(x, y, expected):
      assert add(x, y) == expected

  # indirect -- pass params to fixture
  @pytest.fixture
  def user(request):
      """Create user based on role parameter."""
      role = request.param
      return create_user(role=role)

  @pytest.mark.parametrize("user", ["admin", "editor", "viewer"],
                           indirect=True)
  def test_permissions(user):
      assert user.can_view()

  # Partial indirect
  @pytest.fixture
  def browser(request):
      return create_browser(request.param)

  @pytest.mark.parametrize(
      "browser,url",
      [("chrome", "/home"), ("firefox", "/about")],
      indirect=["browser"]  # only browser goes to fixture
  )
  def test_page(browser, url):
      browser.get(url)
      assert browser.status == 200

  # Dynamic parametrize
  def load_test_data():
      import json
      with open("test_data.json") as f:
          return json.load(f)

  @pytest.mark.parametrize("case", load_test_data())
  def test_from_file(case):
      assert process(case["input"]) == case["expected"]
  ```

  Parametrize -- потужний інструмент для data-driven тестування. Використовуйте `pytest.param` для ID та маркерів, `indirect` для делегування створення об'єктів fixture'ам, і динамічне завантаження даних для великих наборів тест-кейсів.
en_answer: |
  `@pytest.mark.parametrize` allows running one test with different data sets. Each parameter set creates a separate test case with a unique ID.

  **Combinations:** multiple `@parametrize` decorators create a Cartesian product -- every combination of parameters runs separately. **indirect** allows passing parameters not to the test but to a fixture -- the fixture receives the value through `request.param`.

  Parametrize supports markers for individual cases (via `pytest.param`), allowing you to mark specific combinations as xfail or skip.

  ```python
  import pytest

  # Basic parametrize
  @pytest.mark.parametrize("input,expected", [
      ("hello", 5),
      ("", 0),
      ("world", 5),
  ])
  def test_string_length(input, expected):
      assert len(input) == expected

  # Parametrize with IDs
  @pytest.mark.parametrize("status_code,is_success", [
      pytest.param(200, True, id="ok"),
      pytest.param(404, False, id="not-found"),
      pytest.param(500, False, id="server-error"),
  ])
  def test_status_check(status_code, is_success):
      assert (status_code < 400) == is_success

  # Cartesian product -- multiple parametrize decorators
  @pytest.mark.parametrize("method", ["GET", "POST", "PUT"])
  @pytest.mark.parametrize("auth", [True, False])
  def test_api_endpoint(method, auth):
      # Runs 6 times: GET+True, GET+False, POST+True, ...
      response = make_request(method, authenticated=auth)
      ...

  # Mark specific combinations
  @pytest.mark.parametrize("x,y,expected", [
      (2, 3, 5),
      (0, 0, 0),
      pytest.param(-1, 1, 0, id="negative"),
      pytest.param(1e308, 1e308, float("inf"),
                   marks=pytest.mark.xfail(reason="overflow")),
  ])
  def test_add(x, y, expected):
      assert add(x, y) == expected

  # indirect -- pass params to fixture
  @pytest.fixture
  def user(request):
      """Create user based on role parameter."""
      role = request.param
      return create_user(role=role)

  @pytest.mark.parametrize("user", ["admin", "editor", "viewer"],
                           indirect=True)
  def test_permissions(user):
      assert user.can_view()

  # Partial indirect
  @pytest.fixture
  def browser(request):
      return create_browser(request.param)

  @pytest.mark.parametrize(
      "browser,url",
      [("chrome", "/home"), ("firefox", "/about")],
      indirect=["browser"]  # only browser goes to fixture
  )
  def test_page(browser, url):
      browser.get(url)
      assert browser.status == 200

  # Dynamic parametrize
  def load_test_data():
      import json
      with open("test_data.json") as f:
          return json.load(f)

  @pytest.mark.parametrize("case", load_test_data())
  def test_from_file(case):
      assert process(case["input"]) == case["expected"]
  ```

  Parametrize is a powerful tool for data-driven testing. Use `pytest.param` for IDs and markers, `indirect` for delegating object creation to fixtures, and dynamic data loading for large test case sets.
section: "python"
order: 31
tags:
  - pytest
  - data-driven
type: "basic"
---
