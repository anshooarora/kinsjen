FROM eclipse-temurin:11.0.22_7-jre-focal
VOLUME /tmp
ARG KINSJEN_JAR
COPY ${KINSJEN_JAR} kinsjen.jar
ENTRYPOINT ["java", "-jar", "/kinsjen.jar"]
