#Usa la imagen oficial de Nginx como base
FROM nginx:alpine

#Borra la configuración default de Nginx
RUN rm /etc/nginx/conf.d/default.conf

#Copia tu configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/

#Copia los archivos buildados (tu carpeta dist) al directorio donde Nginx sirve los estáticos
COPY dist /usr/share/nginx/html

#Expone el puerto 80 para acceso HTTP
EXPOSE 80

#Comando por defecto para arrancar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
