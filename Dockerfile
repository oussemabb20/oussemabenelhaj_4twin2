FROM node:20-alpine
WORKDIR /app
COPY dist/oussemabenelhaj_4twin2 ./dist/oussemabenelhaj_4twin2
EXPOSE 4000
CMD ["node", "dist/oussemabenelhaj_4twin2/server.mjs"]