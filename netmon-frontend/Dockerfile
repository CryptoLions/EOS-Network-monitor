FROM node:9.8.0-alpine

# RUN apk add --no-cache gcc make libpng-dev openssl bash

# Copy app source
COPY . /www

# Set work directory to /www
WORKDIR /www

# set env variables
ENV API_URL https://eos.com

# Install Node.js dependencies
RUN cd /www
RUN npm install
RUN yarn run build

# set env variables
ENV NODE_ENV production
ENV PORT 8090

# expose the port to outside world
EXPOSE 8090

CMD ["yarn", "start:prod"]


