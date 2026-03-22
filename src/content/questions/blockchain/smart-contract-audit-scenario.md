---
ua_question: "Як провести аудит безпеки DeFi-протоколу перед запуском у mainnet?"
en_question: "How to conduct a security audit of a DeFi protocol before mainnet launch?"
ua_answer: |
  **Scenario:** Команда розробила lending-протокол (аналог Compound/Aave) і готується до запуску на Ethereum mainnet. TVL очікується $10M+. Потрібно провести комплексний аудит безпеки перед деплоєм, виявити критичні вразливості та забезпечити максимальну надійність.

  **Approach:**
  1. Статичний аналіз автоматизованими інструментами (Slither, Mythril) для виявлення відомих патернів вразливостей
  2. Ручний review за чеклістом (reentrancy, access control, oracle manipulation, flash loan attacks)
  3. Fuzz-тестування з Foundry для перевірки інваріантів та пошуку edge cases
  4. Формальна верифікація критичних функцій (опціонально, для high-value протоколів)

  **Solution:**
  ```bash
  # Step 1: Static analysis with Slither
  pip install slither-analyzer
  slither . --print human-summary
  slither . --detect reentrancy-eth,reentrancy-no-eth,unprotected-upgrade
  slither . --detect arbitrary-send-eth,controlled-delegatecall
  slither . --detect unchecked-transfer,locked-ether

  # Step 2: Symbolic execution with Mythril
  myth analyze contracts/LendingPool.sol --solc-json mythril.config.json

  # Step 3: Fuzz testing with Foundry
  forge test --match-test testFuzz -vvv
  forge test --match-test invariant -vvv
  ```

  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  // Foundry invariant test for lending protocol
  import "forge-std/Test.sol";

  contract LendingInvariantTest is Test {
      LendingPool pool;
      ERC20Mock token;

      function setUp() public {
          token = new ERC20Mock();
          pool = new LendingPool(address(token));
          token.mint(address(this), 1000000e18);
          token.approve(address(pool), type(uint256).max);
      }

      // Invariant: total deposits >= total borrows
      function invariant_solvency() public view {
          assert(pool.totalDeposits() >= pool.totalBorrows());
      }

      // Invariant: user cannot borrow more than collateral allows
      function invariant_collateralization() public view {
          // Check all users maintain required collateral ratio
          assert(pool.isProtocolSolvent());
      }

      // Fuzz test: deposit and withdraw should be symmetric
      function testFuzz_depositWithdraw(uint256 amount) public {
          amount = bound(amount, 1e18, 100000e18);

          uint256 balanceBefore = token.balanceOf(address(this));
          pool.deposit(amount);
          pool.withdraw(amount);
          uint256 balanceAfter = token.balanceOf(address(this));

          assertEq(balanceBefore, balanceAfter, "Deposit/withdraw not symmetric");
      }

      // Fuzz test: flash loan should not leave protocol insolvent
      function testFuzz_flashLoan(uint256 amount) public {
          amount = bound(amount, 1e18, pool.totalDeposits());

          uint256 totalBefore = pool.totalDeposits();
          // Flash loan must repay amount + fee
          pool.flashLoan(amount, address(this));
          uint256 totalAfter = pool.totalDeposits();

          assertGe(totalAfter, totalBefore, "Flash loan drained funds");
      }
  }
  ```

  Повний процес аудиту включає: автоматичний аналіз (Slither виявляє ~30% вразливостей), ручний review (знаходить бізнес-логіку та oracle-атаки), fuzz-тестування (edge cases), та bug bounty програму після запуску. Для протоколів з TVL > $1M рекомендується зовнішній аудит від 2+ незалежних фірм.
en_answer: |
  **Scenario:** A team has developed a lending protocol (similar to Compound/Aave) and is preparing for launch on Ethereum mainnet. Expected TVL is $10M+. A comprehensive security audit needs to be conducted before deployment to identify critical vulnerabilities and ensure maximum reliability.

  **Approach:**
  1. Static analysis with automated tools (Slither, Mythril) to detect known vulnerability patterns
  2. Manual review using a checklist (reentrancy, access control, oracle manipulation, flash loan attacks)
  3. Fuzz testing with Foundry to verify invariants and find edge cases
  4. Formal verification of critical functions (optional, for high-value protocols)

  **Solution:**
  ```bash
  # Step 1: Static analysis with Slither
  pip install slither-analyzer
  slither . --print human-summary
  slither . --detect reentrancy-eth,reentrancy-no-eth,unprotected-upgrade
  slither . --detect arbitrary-send-eth,controlled-delegatecall
  slither . --detect unchecked-transfer,locked-ether

  # Step 2: Symbolic execution with Mythril
  myth analyze contracts/LendingPool.sol --solc-json mythril.config.json

  # Step 3: Fuzz testing with Foundry
  forge test --match-test testFuzz -vvv
  forge test --match-test invariant -vvv
  ```

  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  // Foundry invariant test for lending protocol
  import "forge-std/Test.sol";

  contract LendingInvariantTest is Test {
      LendingPool pool;
      ERC20Mock token;

      function setUp() public {
          token = new ERC20Mock();
          pool = new LendingPool(address(token));
          token.mint(address(this), 1000000e18);
          token.approve(address(pool), type(uint256).max);
      }

      // Invariant: total deposits >= total borrows
      function invariant_solvency() public view {
          assert(pool.totalDeposits() >= pool.totalBorrows());
      }

      // Invariant: user cannot borrow more than collateral allows
      function invariant_collateralization() public view {
          // Check all users maintain required collateral ratio
          assert(pool.isProtocolSolvent());
      }

      // Fuzz test: deposit and withdraw should be symmetric
      function testFuzz_depositWithdraw(uint256 amount) public {
          amount = bound(amount, 1e18, 100000e18);

          uint256 balanceBefore = token.balanceOf(address(this));
          pool.deposit(amount);
          pool.withdraw(amount);
          uint256 balanceAfter = token.balanceOf(address(this));

          assertEq(balanceBefore, balanceAfter, "Deposit/withdraw not symmetric");
      }

      // Fuzz test: flash loan should not leave protocol insolvent
      function testFuzz_flashLoan(uint256 amount) public {
          amount = bound(amount, 1e18, pool.totalDeposits());

          uint256 totalBefore = pool.totalDeposits();
          // Flash loan must repay amount + fee
          pool.flashLoan(amount, address(this));
          uint256 totalAfter = pool.totalDeposits();

          assertGe(totalAfter, totalBefore, "Flash loan drained funds");
      }
  }
  ```

  A complete audit process includes: automated analysis (Slither detects ~30% of vulnerabilities), manual review (catches business logic and oracle attacks), fuzz testing (edge cases), and a bug bounty program after launch. For protocols with TVL > $1M, external audits from 2+ independent firms are recommended.
section: "blockchain"
order: 27
tags:
  - security
  - audit
  - tools
type: "practical"
---
