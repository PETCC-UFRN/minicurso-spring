---
layout: layoutConteudo
title: Minicurso de Spring
---

## Resumo do segundo dia

Nesta aula, veremos um pouco mais sobre conceitos base do desenvolvimento Back End, além de iniciar nossas primeiras implementações. Começaremos a aula explicando o que são APIs e, logo após, falaremos um pouco sobre protocolo HTTP e APIs RESTful, que são o foco do nosso minicurso. Após isto, falaremos sobre duas camadas muito importantes de um sistema back-end, a camada *model* e a camada *controller*, e discorreremos sobre como o Spring lida com essas camadas.

## O que são APIs

<div style="text-align: center;"> <img alt="Analogia para explicar o funcionamento de uma API utilizando o exemplo de um restaurante" src="assets/images/analogia_api.png" width="60%">
</div>

API é uma sigla para *Application Programming Interface*, e é basicamente uma série de "regras", implementadas em uma linguagem de programação específica, que permite que diferentes sistemas se comuniquem.

Mas porque precisamos dessas regras?

## Comunicação entre sistemas e computadores

Sabemos que computadores interpretam dados de forma 100% lógica e literal, portanto, precisam de regras bem definidas para conversar entre si numa mesma **rede**. Um dos exemplos mais famosos desse tipo de "regra" (que chamamos de protocolo) é o **protocolo HTTP**

### Protocolo HTTP

O protocolo HTTP é baseado em um modelo chamado **modelo cliente-servidor**, onde um computador (cliente) faz *requisições* a outro computador (servidor). Estas requisições são as tais mensagens que estávamos falando na seção anterior, e elas possuem um formato bem específico:

- 1. O método (*method*)
  - O que queremos fazer
- 2. O caminho (*path*)
  - Onde, na aplicação, queremos fazer
- 3. O cabeçalho (*header*)
  - Onde, na internet, queremos fazer
  - Informações adicionais

Entender como funciona o protocolo HTTP é muito importante para aspirantes do desenvolvimento Web, pois muitos assuntos giram em torno dele nessa área, um deles sendo o tipo específico de API que iremos estudar nesse curso: a **API RESTful**.

## APIs RESTful

APIs RESTful são APIs que seguem o estilo de arquitetura REST, que é definido no livro *Microservice APIs* como *"um estilo arquitetural para a construção de APIs fracamente acopladas e altamente escaláveis. As APIs REST são estruturadas em torno de recursos, entidades que podem ser manipuladas por meio da API."*.

Sendo assim, as APIs RESTful baseiam se em definir regras para a manipulação de recursos dentro de um sistema, e esses recursos estão diretamente localizados em um lugar chamado *endpoint*, dentro do servidor.

Vamos ver um exemplo para facilitar as coisas:

Digamos que você (cliente) esteja acessando um site de compras, e adicionando várias coisas no seu carrinho. Depois de escolher mil e uma coisas desnecessárias que você nunca vai comprar, você decide visualizar a sua grande lista de futilidades clicando em "Meu Carrinho", e assim aparece uma lista de vários produtos. Esses produtos muito provavelmente estão guardados em um *endpoint* com o seguinte formato: `/api/clientes/seu_id/carrinho/`

Portanto, temos um **lugar na aplicação** (*endpoint*), um **lugar na internet** (site de compras) e uma **ação específica que queremos fazer** (visualizar).

Veja que isso é muito parecido com o protocolo HTTP! Entende porque falamos dele no início da aula?

<div style="text-align: center;"> <img alt="Funcionamento de uma API RESTful" src="assets/images/restful_apis_diagrama.png" width="60%">
</div>

OBS.: É importante lembrar que APIs RESTful são *baseadas* no protocolo HTTP (utilizam muitos métodos do protocolo), mas que não *seguem-o* à risca.
