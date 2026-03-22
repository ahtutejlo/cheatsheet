---
ua_question: "Як реалізувати лінійний вестинг токенів з cliff-періодом?"
en_question: "How to implement linear token vesting with a cliff period?"
ua_answer: |
  **Scenario:** Стартап розподіляє токени команді з умовами: 2-річний лінійний вестинг з 6-місячним cliff. До закінчення cliff жоден токен не доступний для зняття. Після cliff токени розблоковуються пропорційно часу щосекунди. Потрібно реалізувати контракт, який безпечно зберігає та розподіляє токени.

  **Approach:**
  1. Зберегти параметри вестингу: загальна сума, початок, тривалість cliff, загальна тривалість
  2. Розрахувати доступну суму за формулою: `vested = total * (elapsed - cliff) / (duration - cliff)` (тільки після cliff)
  3. Відстежувати вже зняті токени, щоб дозволити часткове зняття
  4. Додати захист від повторного зняття та перевірку часових умов

  **Solution:**
  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  interface IERC20 {
      function transfer(address to, uint256 amount) external returns (bool);
      function balanceOf(address account) external view returns (uint256);
  }

  contract TokenVesting {
      struct VestingSchedule {
          uint256 totalAmount;     // Total tokens to vest
          uint256 startTime;       // Vesting start timestamp
          uint256 cliffDuration;   // Cliff period in seconds
          uint256 vestingDuration; // Total vesting period in seconds
          uint256 released;        // Already withdrawn tokens
          bool revoked;            // Whether vesting was revoked
      }

      IERC20 public immutable token;
      address public owner;
      mapping(address => VestingSchedule) public schedules;

      event TokensReleased(address indexed beneficiary, uint256 amount);
      event VestingRevoked(address indexed beneficiary, uint256 returned);

      constructor(address _token) {
          token = IERC20(_token);
          owner = msg.sender;
      }

      function createVesting(
          address beneficiary,
          uint256 totalAmount,
          uint256 cliffMonths,
          uint256 vestingMonths
      ) external {
          require(msg.sender == owner, "Not owner");
          require(schedules[beneficiary].totalAmount == 0, "Already exists");

          schedules[beneficiary] = VestingSchedule({
              totalAmount: totalAmount,
              startTime: block.timestamp,
              cliffDuration: cliffMonths * 30 days,
              vestingDuration: vestingMonths * 30 days,
              released: 0,
              revoked: false
          });

          token.transfer(address(this), totalAmount);
      }

      function vestedAmount(address beneficiary) public view returns (uint256) {
          VestingSchedule memory s = schedules[beneficiary];
          if (s.revoked) return s.released;

          uint256 elapsed = block.timestamp - s.startTime;

          // Before cliff: nothing vested
          if (elapsed < s.cliffDuration) {
              return 0;
          }

          // After full vesting: everything vested
          if (elapsed >= s.vestingDuration) {
              return s.totalAmount;
          }

          // Linear vesting after cliff
          return (s.totalAmount * elapsed) / s.vestingDuration;
      }

      function releasable(address beneficiary) public view returns (uint256) {
          return vestedAmount(beneficiary) - schedules[beneficiary].released;
      }

      function release() external {
          uint256 amount = releasable(msg.sender);
          require(amount > 0, "Nothing to release");

          schedules[msg.sender].released += amount;
          token.transfer(msg.sender, amount);

          emit TokensReleased(msg.sender, amount);
      }

      // Owner can revoke unvested tokens (e.g., employee leaves)
      function revoke(address beneficiary) external {
          require(msg.sender == owner, "Not owner");
          VestingSchedule storage s = schedules[beneficiary];
          require(!s.revoked, "Already revoked");

          uint256 vested = vestedAmount(beneficiary);
          uint256 unreleased = vested - s.released;
          uint256 refund = s.totalAmount - vested;

          s.revoked = true;
          s.released += unreleased;
          token.transfer(beneficiary, unreleased);
          token.transfer(owner, refund);

          emit VestingRevoked(beneficiary, refund);
      }
  }
  ```

  Важливі аспекти: використання `block.timestamp` безпечне для вестингу (маніпуляція валідатором -- секунди, вестинг -- місяці); revoke-функція дозволяє повернути невестовані токени при звільненні працівника; контракт слід аудитувати перед використанням з реальними коштами.
en_answer: |
  **Scenario:** A startup distributes tokens to the team with the following terms: 2-year linear vesting with a 6-month cliff. Before the cliff ends, no tokens are available for withdrawal. After the cliff, tokens unlock proportionally over time every second. A contract is needed to securely store and distribute tokens.

  **Approach:**
  1. Store vesting parameters: total amount, start time, cliff duration, total duration
  2. Calculate available amount using the formula: `vested = total * (elapsed - cliff) / (duration - cliff)` (only after cliff)
  3. Track already withdrawn tokens to allow partial withdrawals
  4. Add protection against double withdrawal and time condition checks

  **Solution:**
  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  interface IERC20 {
      function transfer(address to, uint256 amount) external returns (bool);
      function balanceOf(address account) external view returns (uint256);
  }

  contract TokenVesting {
      struct VestingSchedule {
          uint256 totalAmount;     // Total tokens to vest
          uint256 startTime;       // Vesting start timestamp
          uint256 cliffDuration;   // Cliff period in seconds
          uint256 vestingDuration; // Total vesting period in seconds
          uint256 released;        // Already withdrawn tokens
          bool revoked;            // Whether vesting was revoked
      }

      IERC20 public immutable token;
      address public owner;
      mapping(address => VestingSchedule) public schedules;

      event TokensReleased(address indexed beneficiary, uint256 amount);
      event VestingRevoked(address indexed beneficiary, uint256 returned);

      constructor(address _token) {
          token = IERC20(_token);
          owner = msg.sender;
      }

      function createVesting(
          address beneficiary,
          uint256 totalAmount,
          uint256 cliffMonths,
          uint256 vestingMonths
      ) external {
          require(msg.sender == owner, "Not owner");
          require(schedules[beneficiary].totalAmount == 0, "Already exists");

          schedules[beneficiary] = VestingSchedule({
              totalAmount: totalAmount,
              startTime: block.timestamp,
              cliffDuration: cliffMonths * 30 days,
              vestingDuration: vestingMonths * 30 days,
              released: 0,
              revoked: false
          });

          token.transfer(address(this), totalAmount);
      }

      function vestedAmount(address beneficiary) public view returns (uint256) {
          VestingSchedule memory s = schedules[beneficiary];
          if (s.revoked) return s.released;

          uint256 elapsed = block.timestamp - s.startTime;

          // Before cliff: nothing vested
          if (elapsed < s.cliffDuration) {
              return 0;
          }

          // After full vesting: everything vested
          if (elapsed >= s.vestingDuration) {
              return s.totalAmount;
          }

          // Linear vesting after cliff
          return (s.totalAmount * elapsed) / s.vestingDuration;
      }

      function releasable(address beneficiary) public view returns (uint256) {
          return vestedAmount(beneficiary) - schedules[beneficiary].released;
      }

      function release() external {
          uint256 amount = releasable(msg.sender);
          require(amount > 0, "Nothing to release");

          schedules[msg.sender].released += amount;
          token.transfer(msg.sender, amount);

          emit TokensReleased(msg.sender, amount);
      }

      // Owner can revoke unvested tokens (e.g., employee leaves)
      function revoke(address beneficiary) external {
          require(msg.sender == owner, "Not owner");
          VestingSchedule storage s = schedules[beneficiary];
          require(!s.revoked, "Already revoked");

          uint256 vested = vestedAmount(beneficiary);
          uint256 unreleased = vested - s.released;
          uint256 refund = s.totalAmount - vested;

          s.revoked = true;
          s.released += unreleased;
          token.transfer(beneficiary, unreleased);
          token.transfer(owner, refund);

          emit VestingRevoked(beneficiary, refund);
      }
  }
  ```

  Important aspects: using `block.timestamp` is safe for vesting (validator manipulation is seconds, vesting is months); the revoke function allows returning unvested tokens when an employee leaves; the contract should be audited before using with real funds.
section: "blockchain"
order: 29
tags:
  - tokenomics
  - vesting
  - solidity
type: "practical"
---
