#Usar la imagen de JDK
FROM openjdk:17-jdk
#VOLUME sirve para persistir los datos
VOLUME /tmp
#Copiar el .jar
ARG JAR_FILE=build/libs/*.jar
#Copiar el archivo .jar
COPY ${JAR_FILE} app.jar
#Ejecutar el .jar
ENTRYPOINT ["java","-jar","/app.jar"]
#Exponer el puerto
EXPOSE 8080
