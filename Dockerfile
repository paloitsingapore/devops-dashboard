FROM node:alpine

RUN npm upgrade --global yarn

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Set environment variable
ENV NODE_ENV production

# Install app dependencies
# Bundle app source
COPY . /usr/src/app
RUN yarn && yarn cache clean
RUN yarn build

RUN rm -rf pages
RUN rm -rf styles
RUN rm -rf components

# Port
EXPOSE 3000

# Start
CMD [ "yarn", "start" ]
