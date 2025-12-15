FROM nginx:alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy ONLY the browser build
COPY dist/oussemabenelhaj_4twin2/browser /usr/share/nginx/html

# Angular SPA routing fix
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
