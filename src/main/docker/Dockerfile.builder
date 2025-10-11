# Stage 1: Build the app
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

# 1️⃣ Copy only the pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# 2️⃣ Copy the rest of the project and build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the final runtime image
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copy the built app from the previous stage
COPY --from=build /build/target/quarkus-app /app/

EXPOSE 8080
CMD ["java", "-jar", "/app/quarkus-run.jar"]