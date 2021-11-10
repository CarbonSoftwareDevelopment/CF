FROM node:14.18-alpine as builder
WORKDIR '/app'
RUN npm cache clean --force
COPY . .
RUN npm i @angular/cli --no-progress --loglevel=error
RUN npm i --only=production --no-progress --loglevel=error
RUN npm run build-prod
############
### prod ###
############
FROM nginx
## From 'builder' copy website to default nginx public folder
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
