---
ua_question: "Які загрози безпеці існують у блокчейні?"
en_question: "What security threats exist in blockchain?"
ua_answer: |
  Безпека блокчейну має кілька рівнів: протокол мережі, смарт-контракти та взаємодія з користувачем. Кожний рівень має свої загрози.

  **Загрози на рівні мережі:**
  - **Атака 51%** -- контроль більшості обчислювальної потужності дозволяє переписувати історію транзакцій
  - **Sybil Attack** -- створення великої кількості фальшивих вузлів для впливу на мережу
  - **Eclipse Attack** -- ізоляція вузла від решти мережі шляхом контролю його з'єднань

  **Загрози смарт-контрактів:**
  - **Reentrancy** -- повторний виклик функції до завершення попереднього (атака на DAO у 2016)
  - **Integer Overflow/Underflow** -- переповнення числових змінних
  - **Front-running** -- виконання транзакції перед іншою, спостерігаючи mempool
  - **Flash Loan Attack** -- використання миттєвих позик для маніпуляції цінами

  **Загрози на рівні користувача:**
  - **Фішинг** -- підробні сайти та застосунки для крадіжки ключів
  - **Соціальна інженерія** -- маніпуляція для отримання seed phrase
  - **Компрометація приватних ключів** -- недбале зберігання ключів

  **Захист**: аудит смарт-контрактів, використання перевірених бібліотек (OpenZeppelin), hardware wallets, мультипідпис.
en_answer: |
  Blockchain security operates on multiple levels: network protocol, smart contracts, and user interaction. Each level has its own threats.

  **Network-level threats:**
  - **51% Attack** -- controlling the majority of computational power allows rewriting transaction history
  - **Sybil Attack** -- creating a large number of fake nodes to influence the network
  - **Eclipse Attack** -- isolating a node from the rest of the network by controlling its connections

  **Smart contract threats:**
  - **Reentrancy** -- calling a function again before the previous call completes (DAO attack in 2016)
  - **Integer Overflow/Underflow** -- numeric variable overflow
  - **Front-running** -- executing a transaction before another by observing the mempool
  - **Flash Loan Attack** -- using instant loans to manipulate prices

  **User-level threats:**
  - **Phishing** -- fake websites and applications to steal keys
  - **Social engineering** -- manipulation to obtain seed phrases
  - **Private key compromise** -- careless key storage

  **Protection**: smart contract audits, using verified libraries (OpenZeppelin), hardware wallets, multisig.
section: "blockchain"
order: 15
tags:
  - security
---
