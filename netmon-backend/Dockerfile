FROM node:9.5

# RUN apk add --update bash git python2
# RUN apk add --update bash git python2
# Copy app source
COPY . /www

# Set work directory to /www
WORKDIR /www

RUN cd /www
RUN npm i -g pm2
RUN npm i

# set env variables
ENV NODE_ENV sandbox
ENV PORT 3000

# expose the port to outside world
EXPOSE 3000

CMD ["pm2-runtime", "--raw", "ecosystem.config.js", "--env", "sandbox"]
