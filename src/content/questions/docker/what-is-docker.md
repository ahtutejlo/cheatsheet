---
ua_question: "Що таке Docker?"
en_question: "What is Docker?"
ua_answer: |
  Docker -- це платформа для контейнеризації, яка дозволяє упаковувати додаток разом з його залежностями в ізольований контейнер.

  Контейнери легші за віртуальні машини, оскільки вони використовують спільне ядро ОС хоста.

  ```dockerfile
  FROM openjdk:17-slim
  WORKDIR /app
  COPY target/app.jar app.jar
  EXPOSE 8080
  CMD ["java", "-jar", "app.jar"]
  ```
en_answer: |
  Docker is a containerization platform that allows you to package an application together with its dependencies into an isolated container.

  Containers are lighter than virtual machines because they share the host OS kernel.

  ```dockerfile
  FROM openjdk:17-slim
  WORKDIR /app
  COPY target/app.jar app.jar
  EXPOSE 8080
  CMD ["java", "-jar", "app.jar"]
  ```
section: "docker"
order: 1
tags:
  - fundamentals
  - containers
---
