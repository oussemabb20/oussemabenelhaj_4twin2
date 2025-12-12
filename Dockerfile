FROM node:20-alpine

WORKDIR /app

COPY dist ./dist

EXPOSE 4000

CMD ["node", "dist/oussemabenelhaj_4twin2/server/server.mjs"]
