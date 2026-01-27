---
layout: layoutConteudo
title: Minicurso de Spring
---

# Projeto Final

Esta é a última etapa do nosso minicurso, onde procuramos testar todos os conhecimentos adquiridos ao longo dos últimos dias no desenvolvimento de um projeto simulando um cenário real.

## Contextualização

Seu Armando, o dono de um restaurante percebeu que poderia impulsionar o alcance de sua marca desenvolvendo uma aplicação própria para pedidos de delivery, e para isso contratou um desenvolvedor. Acontece que, graças a um imprevisto, o desenvolvedor só teve tempo de desenvolver o Front-End e o banco de dados do sistema, e Armando saiu desesperado atrás de alguém para terminar a aplicação a tempo, e este é você!. Por sorte, o desenvolvedor anterior teve a empatia de escrever um documento explicando como funciona o que foi implementado por ele e qual será o trabalho necessário para desenvolver o Back.

## Explicando as tarefas

---INÍCIO DO DOCUMENTO

Caro dev que estiver lendo isso, vou tentar ao máximo resumir o que fiz da aplicação e explicar como você pode continuar meu trabalho.

O Front-End da aplicação é feito com React e já possui toda a conexão necessária com a API, bastando apenas desenvolvê-la . O site consiste nas páginas:

- Início: página inicial com informações de contato da marca;
- Cardápio: página onde serão mostrados os itens com **título, preço e imagem** disponíveis no cardápio do restaurante, e que podem ser atualizados **por um administrador**;
- Cadastrar Comida: página onde um novo item pode ser adicionado ao cardápio **por um administrador**;
- Login: página para logar como **administrador** e adicionar, atualizar e remover itens do cardápio.

Para o banco de dados estou atualmente utilizando o H2. É super simples de rodar e utilizar, e inclusive já preparei um arquivo application.properties para você utilizar, com todas as conexões já configuradas pro banco:

```
spring.datasource.url=jdbc:h2:mem:foodDB
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=fonseca
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect

# visualizar os dados em localhost:8080/h2-console
spring.h2.console.enabled=true
spring.jpa.hibernate.ddl-auto=create-drop
spring.sql.init.mode=always
spring.jpa.defer-datasource-initialization=true

spring.security.user.name=admin
spring.security.user.password=12345
```

Como você pode ver no código, os dados podem ser visualizados acessando `localhost:8080/h2-console`. Aqui vai também um script SQL para você popular as tabelas com produtos teste:

```sql
DROP TABLE IF EXISTS food;

CREATE TABLE food;

INSERT INTO food (title, price, image) VALUES
('Hambúrguer', 29.90, 'https://www.allrecipes.com/thmb/_OKqViGmlNaa9GV_c4cpwpwApGk=/0x512/filters:no_upscale():max_bytes(150000):strip_icc()/25473-the-perfect-basic-burger-DDMFS-4x3-56eaba3833fd4a26a82755bcd0be0c54.jpg'),
('Pizza Margherita', 45.00, 'https://media.istockphoto.com/id/1442417585/pt/foto/person-getting-a-piece-of-cheesy-pepperoni-pizza.webp?s=2048x2048&w=is&k=20&c=iUzcFvd1hTa6yr_gZP_xFcOovMp7R9UfM5ik1EzV57A='),
('Batata Frita', 18.50, 'https://images.themodernproper.com/production/posts/2022/Homemade-French-Fries_8.jpg?w=800&q=82&auto=format&fit=crop&dm=1662474181&s=70c29a2dbd0cfbac22bb3fdedf6fbd29'),
('Sorvete', 5.90, 'https://becs-table.com.au/wp-content/uploads/2014/01/ice-cream-1.jpg'),
('Bolo', 30.99, 'https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/beirario/media/uploads/produtos/foto/xrwupuqt/file.jpg'),
('Bife Oswaldo Aranha', 20.87, 'https://cdn.panrotas.com.br/portal-panrotas-statics/media-files-original/2013/07/16/bifeaoswaldoaranha.jpg'),
('Macarrão', 12.00, 'https://s.lightorangebean.com/media/20240914160809/Spicy-Penne-Pasta_-done.png.webp');
```

Por fim, seguem todos os endpoints que idealizei para a aplicação:

**Para os produtos:** /foods/get, /foods/delete, /foods/update, /foods/save
**Para o Login:** /auth/login

Conto com você para continuar o meu legado. Boa sorte.

--- FIM DO DOCUMENTO

## Entrega do Projeto

Explicar sobre como entregar o projeto

