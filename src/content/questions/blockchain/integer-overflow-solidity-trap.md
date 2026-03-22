---
ua_question: "Чи є переповнення цілих чисел проблемою в Solidity?"
en_question: "Is integer overflow a problem in Solidity?"
ua_answer: |
  > **Trap:** Переповнення цілих чисел не є проблемою в Solidity, оскільки мова автоматично обробляє такі випадки.

  Реальність складніша і залежить від версії компілятора. У **Solidity < 0.8.0** цілочисельні операції тихо переповнювались (wrapping): `uint8(255) + 1` давало `0`, а `uint8(0) - 1` давало `255`. Це призвело до численних експлойтів, включаючи знаменитий BEC Token hack ($900M), де зловмисник використав overflow для створення токенів з нічого.

  **Solidity >= 0.8.0** додав автоматичну перевірку overflow/underflow -- операції, що призводять до переповнення, тепер викликають revert. Однак є важливий виняток: блок **`unchecked {}`** вимикає ці перевірки для економії gas. Розробники можуть свідомо використовувати `unchecked` для оптимізації, але це повертає ризик overflow.

  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  contract OverflowDemo {
      // Solidity 0.8+ automatically reverts on overflow
      function safeAdd() public pure returns (uint8) {
          uint8 a = 255;
          // This will REVERT with "arithmetic underflow or overflow"
          // return a + 1;
          return a;
      }

      // unchecked block disables overflow checks (saves ~120 gas)
      function unsafeAdd() public pure returns (uint8) {
          uint8 a = 255;
          unchecked {
              return a + 1; // Returns 0 (wraps around!)
          }
      }

      // Common safe pattern for gas-optimized loops
      function sum(uint256[] calldata arr) public pure returns (uint256 total) {
          for (uint256 i = 0; i < arr.length;) {
              total += arr[i];
              unchecked { i++; } // Safe: i < arr.length prevents overflow
          }
      }

      // Pre-0.8.0 vulnerable pattern (DO NOT USE)
      // function vulnerableTransfer(address to, uint256 amount) public {
      //     // If balances[msg.sender] is 0 and amount is 1:
      //     // 0 - 1 = 2^256 - 1 (massive balance!)
      //     balances[msg.sender] -= amount;
      //     balances[to] += amount;
      // }
  }
  ```

  На співбесіді важливо знати: 1) версія 0.8+ захищає за замовчуванням; 2) `unchecked` повертає старі ризики; 3) бібліотека SafeMath від OpenZeppelin була критичною для версій < 0.8, але зараз вбудовані перевірки її замінили.
en_answer: |
  > **Trap:** Integer overflow is not a problem in Solidity because the language automatically handles such cases.

  The reality is more nuanced and depends on the compiler version. In **Solidity < 0.8.0**, integer operations silently wrapped around: `uint8(255) + 1` produced `0`, and `uint8(0) - 1` produced `255`. This led to numerous exploits, including the famous BEC Token hack ($900M), where an attacker used overflow to create tokens out of nothing.

  **Solidity >= 0.8.0** added automatic overflow/underflow checks -- operations that cause overflow now trigger a revert. However, there is an important exception: the **`unchecked {}`** block disables these checks to save gas. Developers may intentionally use `unchecked` for optimization, but this reintroduces the overflow risk.

  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  contract OverflowDemo {
      // Solidity 0.8+ automatically reverts on overflow
      function safeAdd() public pure returns (uint8) {
          uint8 a = 255;
          // This will REVERT with "arithmetic underflow or overflow"
          // return a + 1;
          return a;
      }

      // unchecked block disables overflow checks (saves ~120 gas)
      function unsafeAdd() public pure returns (uint8) {
          uint8 a = 255;
          unchecked {
              return a + 1; // Returns 0 (wraps around!)
          }
      }

      // Common safe pattern for gas-optimized loops
      function sum(uint256[] calldata arr) public pure returns (uint256 total) {
          for (uint256 i = 0; i < arr.length;) {
              total += arr[i];
              unchecked { i++; } // Safe: i < arr.length prevents overflow
          }
      }

      // Pre-0.8.0 vulnerable pattern (DO NOT USE)
      // function vulnerableTransfer(address to, uint256 amount) public {
      //     // If balances[msg.sender] is 0 and amount is 1:
      //     // 0 - 1 = 2^256 - 1 (massive balance!)
      //     balances[msg.sender] -= amount;
      //     balances[to] += amount;
      // }
  }
  ```

  In interviews, key points are: 1) version 0.8+ protects by default; 2) `unchecked` reintroduces old risks; 3) OpenZeppelin's SafeMath library was critical for versions < 0.8, but built-in checks have now replaced it.
section: "blockchain"
order: 22
tags:
  - solidity
  - security
  - overflow
type: "trick"
---
