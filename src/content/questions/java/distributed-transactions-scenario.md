---
ua_question: "Як забезпечити консистентність даних між мікросервісами при обробці замовлення?"
en_question: "How would you ensure data consistency across microservices when processing an order?"
ua_answer: |
  **Scenario:** Сервіс замовлень повинен координувати оплату (Payment Service) та інвентар (Inventory Service) при створенні замовлення. Якщо оплата пройшла, але інвентар не зарезервовано -- гроші списані без товару. Якщо інвентар зарезервовано, але оплата не пройшла -- товар заблоковано без причини. Потрібна консистентність без розподілених транзакцій (2PC).

  **Approach:**
  1. Відмовитись від 2PC (Two-Phase Commit) через його блокуючу природу та single point of failure
  2. Реалізувати Saga Pattern з оркестратором для координації кроків та компенсаційних транзакцій
  3. Використати transactional outbox для гарантованої доставки подій між сервісами

  **Solution:**
  ```java
  // Saga Orchestrator
  public class OrderSaga {
      enum State { STARTED, PAYMENT_PENDING, PAYMENT_DONE,
                   INVENTORY_PENDING, INVENTORY_DONE, COMPLETED, FAILED }

      @Transactional
      public void execute(Order order) {
          SagaState saga = new SagaState(order.getId(), State.STARTED);
          sagaRepository.save(saga);

          try {
              // Step 1: Reserve payment
              saga.setState(State.PAYMENT_PENDING);
              PaymentResult payment = paymentService.reserve(order);
              saga.setState(State.PAYMENT_DONE);
              saga.setPaymentId(payment.getId());

              // Step 2: Reserve inventory
              saga.setState(State.INVENTORY_PENDING);
              inventoryService.reserve(order.getItems());
              saga.setState(State.INVENTORY_DONE);

              // Step 3: Confirm all
              paymentService.confirm(payment.getId());
              saga.setState(State.COMPLETED);

          } catch (PaymentException e) {
              saga.setState(State.FAILED);
              // No compensation needed -- nothing was done
          } catch (InventoryException e) {
              saga.setState(State.FAILED);
              // Compensate: release payment
              paymentService.refund(saga.getPaymentId());
          }
          sagaRepository.save(saga);
      }
  }

  // Transactional Outbox for reliable messaging
  @Entity
  public class OutboxEvent {
      @Id private UUID id;
      private String aggregateType; // "Order"
      private String eventType;     // "OrderCreated"
      private String payload;       // JSON
      private boolean published;
  }

  // CDC (Change Data Capture) or polling reads outbox table
  // and publishes events to Kafka/RabbitMQ
  @Scheduled(fixedDelay = 1000)
  public void publishOutboxEvents() {
      List<OutboxEvent> events = outboxRepository.findUnpublished();
      for (OutboxEvent event : events) {
          messageBroker.publish(event);
          event.setPublished(true);
      }
  }
  ```

  Порівняння підходів: 2PC гарантує ACID, але блокує ресурси та не масштабується. Saga забезпечує eventual consistency з компенсаціями -- складніша логіка, але надійніша у розподілених системах. Transactional Outbox вирішує проблему "dual write" (запис у БД + відправка повідомлення) -- подія зберігається у тій самій транзакції, що і бізнес-дані.
en_answer: |
  **Scenario:** An Order Service must coordinate Payment Service and Inventory Service when creating an order. If payment succeeds but inventory is not reserved -- money is charged without product. If inventory is reserved but payment fails -- product is blocked without reason. Consistency is needed without distributed transactions (2PC).

  **Approach:**
  1. Reject 2PC (Two-Phase Commit) due to its blocking nature and single point of failure
  2. Implement the Saga Pattern with an orchestrator for coordinating steps and compensating transactions
  3. Use transactional outbox for guaranteed event delivery between services

  **Solution:**
  ```java
  // Saga Orchestrator
  public class OrderSaga {
      enum State { STARTED, PAYMENT_PENDING, PAYMENT_DONE,
                   INVENTORY_PENDING, INVENTORY_DONE, COMPLETED, FAILED }

      @Transactional
      public void execute(Order order) {
          SagaState saga = new SagaState(order.getId(), State.STARTED);
          sagaRepository.save(saga);

          try {
              // Step 1: Reserve payment
              saga.setState(State.PAYMENT_PENDING);
              PaymentResult payment = paymentService.reserve(order);
              saga.setState(State.PAYMENT_DONE);
              saga.setPaymentId(payment.getId());

              // Step 2: Reserve inventory
              saga.setState(State.INVENTORY_PENDING);
              inventoryService.reserve(order.getItems());
              saga.setState(State.INVENTORY_DONE);

              // Step 3: Confirm all
              paymentService.confirm(payment.getId());
              saga.setState(State.COMPLETED);

          } catch (PaymentException e) {
              saga.setState(State.FAILED);
              // No compensation needed -- nothing was done
          } catch (InventoryException e) {
              saga.setState(State.FAILED);
              // Compensate: release payment
              paymentService.refund(saga.getPaymentId());
          }
          sagaRepository.save(saga);
      }
  }

  // Transactional Outbox for reliable messaging
  @Entity
  public class OutboxEvent {
      @Id private UUID id;
      private String aggregateType; // "Order"
      private String eventType;     // "OrderCreated"
      private String payload;       // JSON
      private boolean published;
  }

  // CDC (Change Data Capture) or polling reads outbox table
  // and publishes events to Kafka/RabbitMQ
  @Scheduled(fixedDelay = 1000)
  public void publishOutboxEvents() {
      List<OutboxEvent> events = outboxRepository.findUnpublished();
      for (OutboxEvent event : events) {
          messageBroker.publish(event);
          event.setPublished(true);
      }
  }
  ```

  Comparison of approaches: 2PC guarantees ACID but blocks resources and does not scale. Saga provides eventual consistency with compensations -- more complex logic but more reliable in distributed systems. Transactional Outbox solves the "dual write" problem (writing to DB + sending message) -- the event is saved in the same transaction as business data.
section: "java"
order: 30
tags:
  - microservices
  - transactions
  - patterns
type: "practical"
---
