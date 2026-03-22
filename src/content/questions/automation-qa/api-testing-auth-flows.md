---
ua_question: "Як тестувати OAuth2/JWT автентифікацію через API?"
en_question: "How do you test OAuth2/JWT authentication flows via API?"
ua_answer: |
  Тестування автентифікації через API вимагає розуміння життєвого циклу токенів: отримання, використання, оновлення та інвалідація. Основні виклики -- правильне управління станом токенів між тестами та тестування edge cases (протермінований токен, відкликаний refresh token).

  **Ключові аспекти тестування auth-потоків:**
  - **Token lifecycle:** отримання access token через credentials або authorization code, перевірка TTL, оновлення через refresh token
  - **Негативні сценарії:** протермінований токен повертає 401, невалідний -- 403, відкликаний refresh token не дає новий access token
  - **Тестові фікстури:** попередньо створені користувачі з різними ролями для перевірки авторизації

  ```java
  class AuthApiTest {

      private static final String AUTH_URL = "/api/auth/token";
      private static final String REFRESH_URL = "/api/auth/refresh";
      private static final String PROTECTED_URL = "/api/users/me";

      @Test
      void shouldObtainAccessTokenWithValidCredentials() {
          Response response = given()
              .contentType(ContentType.JSON)
              .body(Map.of(
                  "username", "testuser@example.com",
                  "password", "SecurePass123!"
              ))
              .post(AUTH_URL);

          response.then()
              .statusCode(200)
              .body("access_token", notNullValue())
              .body("refresh_token", notNullValue())
              .body("expires_in", equalTo(3600));
      }

      @Test
      void shouldRefreshExpiredAccessToken() {
          String refreshToken = obtainRefreshToken();

          Response response = given()
              .contentType(ContentType.JSON)
              .body(Map.of("refresh_token", refreshToken))
              .post(REFRESH_URL);

          response.then()
              .statusCode(200)
              .body("access_token", notNullValue())
              .body("refresh_token", not(equalTo(refreshToken))); // rotation
      }

      @Test
      void shouldReject401WithExpiredToken() {
          String expiredToken = generateExpiredJwt();

          given()
              .header("Authorization", "Bearer " + expiredToken)
              .get(PROTECTED_URL)
              .then()
              .statusCode(401)
              .body("error", equalTo("token_expired"));
      }

      private String generateExpiredJwt() {
          return Jwts.builder()
              .setSubject("testuser")
              .setExpiration(Date.from(
                  Instant.now().minus(1, ChronoUnit.HOURS)))
              .signWith(TEST_KEY)
              .compact();
      }
  }
  ```

  Тестування auth-потоків -- це фундамент безпеки API. Пропуск негативних сценаріїв (протермінований токен, rate limiting) залишає критичні вразливості непокритими.
en_answer: |
  Testing API authentication requires understanding the token lifecycle: obtaining, using, refreshing, and invalidating tokens. The main challenges are proper token state management between tests and testing edge cases (expired token, revoked refresh token).

  **Key aspects of testing auth flows:**
  - **Token lifecycle:** obtaining access token via credentials or authorization code, verifying TTL, refreshing via refresh token
  - **Negative scenarios:** expired token returns 401, invalid returns 403, revoked refresh token cannot produce a new access token
  - **Test fixtures:** pre-created users with different roles for authorization verification

  ```java
  class AuthApiTest {

      private static final String AUTH_URL = "/api/auth/token";
      private static final String REFRESH_URL = "/api/auth/refresh";
      private static final String PROTECTED_URL = "/api/users/me";

      @Test
      void shouldObtainAccessTokenWithValidCredentials() {
          Response response = given()
              .contentType(ContentType.JSON)
              .body(Map.of(
                  "username", "testuser@example.com",
                  "password", "SecurePass123!"
              ))
              .post(AUTH_URL);

          response.then()
              .statusCode(200)
              .body("access_token", notNullValue())
              .body("refresh_token", notNullValue())
              .body("expires_in", equalTo(3600));
      }

      @Test
      void shouldRefreshExpiredAccessToken() {
          String refreshToken = obtainRefreshToken();

          Response response = given()
              .contentType(ContentType.JSON)
              .body(Map.of("refresh_token", refreshToken))
              .post(REFRESH_URL);

          response.then()
              .statusCode(200)
              .body("access_token", notNullValue())
              .body("refresh_token", not(equalTo(refreshToken))); // rotation
      }

      @Test
      void shouldReject401WithExpiredToken() {
          String expiredToken = generateExpiredJwt();

          given()
              .header("Authorization", "Bearer " + expiredToken)
              .get(PROTECTED_URL)
              .then()
              .statusCode(401)
              .body("error", equalTo("token_expired"));
      }

      private String generateExpiredJwt() {
          return Jwts.builder()
              .setSubject("testuser")
              .setExpiration(Date.from(
                  Instant.now().minus(1, ChronoUnit.HOURS)))
              .signWith(TEST_KEY)
              .compact();
      }
  }
  ```

  Testing auth flows is the foundation of API security. Skipping negative scenarios (expired tokens, rate limiting) leaves critical vulnerabilities uncovered.
section: "automation-qa"
order: 20
tags:
  - api-testing
  - authentication
type: "deep"
---
