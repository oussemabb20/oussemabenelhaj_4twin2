FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY dist/oussemabenelhaj_4twin2/browser /usr/share/nginx/html

# Rename for Nginx
RUN mv /usr/share/nginx/html/index.csr.html /usr/share/nginx/html/index.html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
