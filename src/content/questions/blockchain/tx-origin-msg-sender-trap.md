---
ua_question: "Чи можна використовувати tx.origin замість msg.sender для авторизації?"
en_question: "Can you use tx.origin instead of msg.sender for authorization?"
ua_answer: |
  > **Trap:** tx.origin та msg.sender -- це одне й те саме, і їх можна використовувати взаємозамінно для перевірки прав доступу.

  Насправді `tx.origin` та `msg.sender` мають принципово різну семантику. **`tx.origin`** завжди вказує на EOA (Externally Owned Account), яка ініціювала транзакцію -- тобто оригінального підписанта. **`msg.sender`** вказує на безпосереднього викликача поточної функції, яким може бути як EOA, так і інший контракт.

  Використання `tx.origin` для авторизації створює критичну вразливість -- **phishing attack**. Зловмисник може створити контракт, який викликає ваш контракт від імені жертви. Оскільки `tx.origin` залишається адресою жертви (вона підписала транзакцію), перевірка `require(tx.origin == owner)` буде пройдена, хоча жертва не мала наміру викликати вашу функцію.

  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  // VULNERABLE contract using tx.origin
  contract VulnerableWallet {
      address public owner;

      constructor() {
          owner = msg.sender;
      }

      function withdraw(address to, uint256 amount) public {
          // DANGEROUS: tx.origin check can be bypassed
          require(tx.origin == owner, "Not owner");
          payable(to).transfer(amount);
      }
  }

  // Attacker's phishing contract
  contract PhishingAttack {
      VulnerableWallet public target;

      constructor(address _target) {
          target = VulnerableWallet(_target);
      }

      // Owner is tricked into calling this function
      function claimReward() external {
          // tx.origin is still the owner (they signed the tx)
          // msg.sender is this contract (immediate caller)
          target.withdraw(msg.sender, address(target).balance);
      }
  }

  // SAFE contract using msg.sender
  contract SafeWallet {
      address public owner;

      constructor() {
          owner = msg.sender;
      }

      function withdraw(address to, uint256 amount) public {
          // SAFE: msg.sender is the immediate caller
          require(msg.sender == owner, "Not owner");
          payable(to).transfer(amount);
      }
  }
  ```

  Ця помилка настільки поширена, що Solidity-лінтери та аудит-інструменти (Slither, MythX) автоматично позначають використання `tx.origin` як потенційну вразливість. Завжди використовуйте `msg.sender` для авторизації.
en_answer: |
  > **Trap:** tx.origin and msg.sender are the same thing and can be used interchangeably for access control.

  In reality, `tx.origin` and `msg.sender` have fundamentally different semantics. **`tx.origin`** always points to the EOA (Externally Owned Account) that initiated the transaction -- the original signer. **`msg.sender`** points to the immediate caller of the current function, which can be either an EOA or another contract.

  Using `tx.origin` for authorization creates a critical vulnerability -- a **phishing attack**. An attacker can create a contract that calls your contract on behalf of the victim. Since `tx.origin` remains the victim's address (they signed the transaction), the `require(tx.origin == owner)` check will pass even though the victim did not intend to call your function.

  ```solidity
  // SPDX-License-Identifier: MIT
  pragma solidity ^0.8.0;

  // VULNERABLE contract using tx.origin
  contract VulnerableWallet {
      address public owner;

      constructor() {
          owner = msg.sender;
      }

      function withdraw(address to, uint256 amount) public {
          // DANGEROUS: tx.origin check can be bypassed
          require(tx.origin == owner, "Not owner");
          payable(to).transfer(amount);
      }
  }

  // Attacker's phishing contract
  contract PhishingAttack {
      VulnerableWallet public target;

      constructor(address _target) {
          target = VulnerableWallet(_target);
      }

      // Owner is tricked into calling this function
      function claimReward() external {
          // tx.origin is still the owner (they signed the tx)
          // msg.sender is this contract (immediate caller)
          target.withdraw(msg.sender, address(target).balance);
      }
  }

  // SAFE contract using msg.sender
  contract SafeWallet {
      address public owner;

      constructor() {
          owner = msg.sender;
      }

      function withdraw(address to, uint256 amount) public {
          // SAFE: msg.sender is the immediate caller
          require(msg.sender == owner, "Not owner");
          payable(to).transfer(amount);
      }
  }
  ```

  This mistake is so common that Solidity linters and audit tools (Slither, MythX) automatically flag the use of `tx.origin` as a potential vulnerability. Always use `msg.sender` for authorization.
section: "blockchain"
order: 21
tags:
  - solidity
  - security
  - pitfalls
type: "trick"
---
