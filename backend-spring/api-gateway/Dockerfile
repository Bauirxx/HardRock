FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml ./pom.xml
COPY gym-common/pom.xml ./gym-common/pom.xml
COPY eureka-server/pom.xml ./eureka-server/pom.xml
COPY api-gateway/pom.xml ./api-gateway/pom.xml
COPY auth-service/pom.xml ./auth-service/pom.xml
COPY member-service/pom.xml ./member-service/pom.xml
COPY gym-service/pom.xml ./gym-service/pom.xml
COPY store-service/pom.xml ./store-service/pom.xml
COPY notification-service/pom.xml ./notification-service/pom.xml
COPY history-service/pom.xml ./history-service/pom.xml
COPY payment-service/pom.xml ./payment-service/pom.xml

RUN mvn dependency:go-offline -pl api-gateway -B 2>/dev/null || true

COPY gym-common/src ./gym-common/src
COPY api-gateway/src ./api-gateway/src

RUN mvn clean package -pl api-gateway -DskipTests -B

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/api-gateway/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
