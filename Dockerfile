# Build Stage
FROM node:22-alpine AS build_image
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install --force
RUN npm i --force
COPY . .
RUN yarn run build


# Production Stage
FROM node:22-alpine AS production_stage
WORKDIR /app
COPY --from=BUILD_IMAGE /app/package*.json ./
COPY --from=BUILD_IMAGE /app/.next ./.next
COPY --from=BUILD_IMAGE /app/public ./public
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
ENV NODE_ENV=production
EXPOSE 3000
CMD ["yarn", "start"]
