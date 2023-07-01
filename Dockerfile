# Define a imagem base
FROM node:14-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código-fonte da aplicação para o diretório de trabalho
COPY . .

# Expõe a porta em que o servidor Express estará ouvindo
EXPOSE 3000

# Comando para iniciar o servidor Express
CMD ["npm", "start"]