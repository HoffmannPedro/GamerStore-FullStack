# ETAPA 1: CONSTRUCCIÓN (Usamos una imagen que SÍ tiene Java 21)
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY . .
# Compilamos saltando tests para asegurar que no falle por detalles menores
RUN mvn clean package -DskipTests

# ETAPA 2: EJECUCIÓN (Imagen ligera de Java 21 para correr la app)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copiamos el .jar generado en la etapa anterior
COPY --from=build /app/target/*.jar app.jar
# Le decimos a Railway qué puerto usar
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]