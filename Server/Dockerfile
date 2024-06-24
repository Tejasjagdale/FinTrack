FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY Server/target/fintrack-0.0.1-SNAPSHOT.jar fintrack-0.0.1-SNAPSHOT.jar
EXPOSE 8089
CMD ["java","-jar","fintrack-0.0.1-SNAPSHOT.jar"]