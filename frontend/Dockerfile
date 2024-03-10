FROM node:18

# Create a directory in container
WORKDIR /app

# copy file package.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy all files from our folder inside container
COPY . .

# build react app
RUN npm run build

# delete all ussles files
RUN rm -rf node_modules

# open port 3000 for react app
EXPOSE 3000

# команда для запуска приложения
CMD npm run dev