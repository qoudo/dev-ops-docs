FROM nginx:1.21.3-alpine

WORKDIR /usr/share/nginx/html

COPY index.html .

RUN apk add --no-cache curl

CMD ["nginx", "-g", "daemon off;"]
