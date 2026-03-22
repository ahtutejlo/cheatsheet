---
ua_question: "Як працює модель виконання EVM і що таке стекова машина?"
en_question: "How does the EVM execution model work and what is a stack machine?"
ua_answer: |
  **Ethereum Virtual Machine (EVM)** -- це стекова віртуальна машина, яка виконує байт-код смарт-контрактів. На відміну від регістрових машин (x86, ARM), EVM використовує стек глибиною до 1024 елементів, де кожен елемент має розмір 256 біт (32 байти).

  Коли Solidity-код компілюється, він перетворюється на послідовність **опкодів** (opcodes) -- низькорівневих інструкцій EVM. Кожен опкод має фіксовану вартість у **gas**, що запобігає нескінченним циклам та обмежує обчислювальні ресурси. Наприклад, `ADD` коштує 3 gas, `SSTORE` (запис у storage) -- 20,000 gas для нового слоту. Модель gas є ключовим механізмом захисту мережі від зловживань.

  EVM має три області пам'яті: **stack** (тимчасовий, для операцій), **memory** (тимчасова, розширювана лінійна пам'ять для поточного виклику) та **storage** (постійне сховище контракту на блокчейні). Storage є найдорожчим ресурсом, оскільки дані зберігаються назавжди у всіх вузлах мережі.

  ```solidity
  // Solidity code
  function add(uint256 a, uint256 b) public pure returns (uint256) {
      return a + b;
  }

  // Compiled to EVM bytecode (simplified):
  // PUSH1 0x00    -- push 0 to stack
  // CALLDATALOAD  -- load first argument
  // PUSH1 0x20
  // CALLDATALOAD  -- load second argument
  // ADD           -- pop two values, push sum (costs 3 gas)
  // RETURN        -- return result
  ```

  Розуміння EVM як стекової машини пояснює багато обмежень Solidity: максимум 16 локальних змінних (глибина стеку), вартість операцій зі storage, та чому оптимізація gas вимагає знання опкодів.
en_answer: |
  **Ethereum Virtual Machine (EVM)** is a stack-based virtual machine that executes smart contract bytecode. Unlike register-based machines (x86, ARM), the EVM uses a stack up to 1024 elements deep, where each element is 256 bits (32 bytes) in size.

  When Solidity code is compiled, it transforms into a sequence of **opcodes** -- low-level EVM instructions. Each opcode has a fixed cost in **gas**, which prevents infinite loops and limits computational resources. For example, `ADD` costs 3 gas, while `SSTORE` (writing to storage) costs 20,000 gas for a new slot. The gas model is a key mechanism protecting the network from abuse.

  The EVM has three memory areas: **stack** (temporary, for operations), **memory** (temporary, expandable linear memory for the current call), and **storage** (permanent contract storage on the blockchain). Storage is the most expensive resource since data is stored permanently across all network nodes.

  ```solidity
  // Solidity code
  function add(uint256 a, uint256 b) public pure returns (uint256) {
      return a + b;
  }

  // Compiled to EVM bytecode (simplified):
  // PUSH1 0x00    -- push 0 to stack
  // CALLDATALOAD  -- load first argument
  // PUSH1 0x20
  // CALLDATALOAD  -- load second argument
  // ADD           -- pop two values, push sum (costs 3 gas)
  // RETURN        -- return result
  ```

  Understanding the EVM as a stack machine explains many Solidity limitations: maximum 16 local variables (stack depth), the cost of storage operations, and why gas optimization requires knowledge of opcodes.
section: "blockchain"
order: 16
tags:
  - evm
  - internals
  - gas
type: "deep"
---
