# from base image node
FROM node:14.18.0

WORKDIR /app
COPY ./package.json ./

# install all dependencies
RUN npm install

# copy oter files as well
COPY ./ .

# command to run when intantiate an image
CMD ["npm", "run", "start"]
