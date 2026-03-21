---
ua_question: "Що таке Gas в Ethereum?"
en_question: "What is Gas in Ethereum?"
ua_answer: |
  **Gas** -- це одиниця виміру обчислювальної роботи, необхідної для виконання операцій у мережі Ethereum. Кожна операція (переказ ETH, виклик смарт-контракту, створення токена) споживає певну кількість Gas.

  **Gas Price** -- це ціна, яку користувач готовий заплатити за одиницю Gas. Вимірюється у **Gwei** (1 Gwei = 0.000000001 ETH). Вища ціна Gas означає швидшу обробку транзакції.

  Після оновлення **EIP-1559** (London Hard Fork) модель комісій змінилась:
  - **Base Fee** -- базова комісія, що автоматично регулюється мережею та спалюється
  - **Priority Fee (Tip)** -- додаткова комісія для валідатора, що стимулює пріоритетну обробку
  - **Max Fee** -- максимальна сума, яку користувач готовий заплатити

  **Вартість транзакції** = Gas Used * (Base Fee + Priority Fee)

  **Gas Limit** -- це максимальна кількість Gas, яку транзакція може спожити. Для простого переказу ETH Gas Limit становить 21,000. Складні операції зі смарт-контрактами можуть споживати сотні тисяч одиниць Gas.
en_answer: |
  **Gas** is a unit of measurement for the computational work required to execute operations on the Ethereum network. Every operation (ETH transfer, smart contract call, token creation) consumes a certain amount of Gas.

  **Gas Price** is the price a user is willing to pay per unit of Gas. It is measured in **Gwei** (1 Gwei = 0.000000001 ETH). A higher Gas price means faster transaction processing.

  After the **EIP-1559** (London Hard Fork) update, the fee model changed:
  - **Base Fee** -- a base fee automatically adjusted by the network and burned
  - **Priority Fee (Tip)** -- an additional fee for the validator that incentivizes priority processing
  - **Max Fee** -- the maximum amount the user is willing to pay

  **Transaction cost** = Gas Used * (Base Fee + Priority Fee)

  **Gas Limit** is the maximum amount of Gas a transaction can consume. For a simple ETH transfer, the Gas Limit is 21,000. Complex smart contract operations can consume hundreds of thousands of Gas units.
section: "blockchain"
order: 9
tags:
  - ethereum
---
