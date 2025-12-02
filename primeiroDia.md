---
layout: layoutConteudo
title: Minicurso de Spring
---

<div id="sumario" class="sumario-git">

    <h1>Dia 1</h1>

  <button class="toggle-button" id="toggle-button">
  
      Esconder Sumário
  
  </button>

</div>

<!--<div style="text-align: center;"> <img alt="Meme muito engraçado sobre arquivos do sistema" src="assets/images/funny-math-meme.png" width="50%">
</div>
-->

<br>



## Revisando Java

Antes de começarmos a estudar Spring é mais do que necessário darmos uma revisada na linguagem na qual o Spring se baseia, o Java!

<div style="text-align: center;"> <img alt="Meme muito engraçado sobre arquivos do sistema" src="assets/images/java.png" width="40%">
</div>

### Classes e Objetos

Em Java, classes são moldes que definem a estrutura e o comportamento de objetos que sejam criados a partir dos mesmos. Por outro lado, objetos são instâncias das classes e se comportam conforme as regrinhas que foram estabelecidas em sua classe. Um exêmplo famoso que ajuda a lembrar bem desses dois conceitos é o da forma e do bolo: a forma é a classe que molda o bolo, o bolo é o objeto moldado pela forma.

```java
public class FormaQuadrada{ //a forma do bolo
    float profundidade = 6;
    float tamanhoLado = 20;
}
```

```java
public class Main {
    public static void main(String[] args) {
        FormaQuadrada bolo = new FormaQuadrada; 
        //bolo é a instância da nossa classe, ou seja, o objeto
    }
}

```

#### Herança e Polimorfismo

<div style="text-align: center;"> <img alt="Meme muito engraçado sobre arquivos do sistema" src="assets/images/java-study.png" width="40%">
</div>


Uma classe pode herdar todos os atributos e métodos de uma outra classe. Esse conceito é conhecido como herança, vamos ver um exemplo:

```java
public class FormaRedonda{ //a forma do bolo
    float profundidade = 6;
    float raio = 15;
}

public class FormaRedondaComFuroNoMeio extends FormaRedonda {
    float raioDoFuro = 4;
}
```
#### Interfaces

Em Java podemos criar classes que servem como "molde" para outras classes, dizendo o que devem implementar:

```java
public interface PagamentoService {
    void processarPagamento(double valor);
}

public class CartaoCreditoService implements PagamentoService {
    @Override
    public void processarPagamento(double valor) {
        // Lógica específica
    }
}
```
### Encapsulamento

Encapsular é o ato de agrupar dados (atributos) e comportamentos (métodos) dentro de uma classe, e restringir o acesso direto aos componentes internos de um objeto. Isso permite que os atributos de uma classe só possam ser acessados ou alterados em situações específicas.

Imagine a classe contaBancaria:

```java
public class contaBancaria {
    double dinheiroEmConta;
    String senhaDoCliente;
}
```

Qualquer parte do código que tentar acessar o atributo senhaDoCliente de uma instancia dessa classe, vai conseguir!

E da mesma maneira, qualquer parte do nosso código conseguiria adicionar e remover dinheiro sem nenhum tipo de checagem ou aviso.

Podemos, então, usar os conceitos de encapsulamento para proibir que esses atributos sejam acessados de qualquer maneira pelo resto do código:

```java
public class contaBancaria {
    private double dinheiroEmConta;
    private String senhaDoCliente;
}
```

Agora, apenas métodos da própria classe podem checar ou alterar esses valores!

Aqui vai uma tabelinha que mostra quais permissões de acesso são concedidas para cada modificador de acesso:

<div style="text-align: center;"> <img alt="Meme muito engraçado sobre arquivos do sistema" src="assets/images/access-modifiers.png" width="60%">
</div>

### Pacotes, Grupos e Artefatos

#### Pacotes

É a principal maneira de se organizar código em Java, como se fosse em pastas. Eles evitam conflitos de nomes entre classes e refletem a modularização do sistema (ex.: com.exemplo.demo.controller).

#### Group Id

O Group Id identifica a organização do projeto, é similar ao domínio de uma empresa, mas ao contrário (ex.: com.exemplo).

#### Artifact Id

É o nome do projeto/aplicação e geralmente vira o nome do arquivo .jar (ex.: api-clientes).

#### Version

De maneira bem simples, version é a versão identificadora do artefato publicado.

## O Que é Spring?

<div style="text-align: center;"> <img alt="Meme muito engraçado sobre arquivos do sistema" src="assets/images/spring-logo.png" width="40%">
</div>

Spring é um framework Java para criação de aplicações modernas, robustas e escaláveis. Ele facilita o desenvolvimento, fornecendo funcionalidades prontas para serem implementadas no projeto, dentre elas:


- Injeção de dependências (IoC)
- Controle de ciclo de vida dos objetos
- Acesso simplificado a banco de dados
- Integração com APIs, segurança, web, mensagens etc.


O principal objetivo do Spring é, então, ajudar o densenvolvedor a construir aplicações rapidamente e com código menos repetivivo.

## Ecossistema Spring

<div style="text-align: center;"> <img alt="Meme muito engraçado sobre arquivos do sistema" src="assets/images/green-spring.png" width="60%">
</div>

O ecossistema Spring é um conjunto de várias ferramentas, módulos e projetos que trabalham juntos, de maneira em que cada projeto resolve um problema específico.

No ecossistema Spring temos:

- Spring Boot — facilita iniciar aplicações rapidamente
- Spring Data — abstração para acesso a dados (JPA, Mongo, Redis…)
- Spring Security — autenticação, autorização, criptografia.
- Spring AI — recursos para integrar modelos de IA (LLMs).
- Spring Cloud — soluções para microsserviços.
- Spring Batch — processamento em lote.
- Spring Web / WebFlux — APIs REST.
- Spring HATEOAS, Spring Integration, Spring AMQP, entre muitos outros.

## Entendendo Dependências

### O que são dependências?

Podemos entender como dependências as classes e objetos que um componente do projeto precisa para funcionar.

Elas podem ser úteis quando instanciar objetos manualmente pode ser custoso ou confuso, ou então quando temos configurações que precisam ser reaproveitadas. Por exemplo:

- Conexões de banco
- Serviços com lógica complexa
<!--aumentar o número de exemplos-->

Sem injeção de dependências nesses casos, teriamos que criar tudo na mão, gerenciar ciclo de vida, conexões, configurações...

Já com injeções nossa vida fica mais fácil, o Spring controla a criaçãoo, destruição e fornecimento dos objetos, deixando o fluxo de trabalho mais fluido e organizado. Imagina ter que reiniciar manualmente a conexão de banco de dados toda vez que um serviço é criado!

### Spring como Injetor de Dependências

<div style="text-align: center;"> <img alt="Meme muito engraçado sobre arquivos do sistema" src="assets/images/possum-coffee.png" width="40%">
</div>

#### ApplicationContext

É o contêiner principal do Spring, responsável por criar objetos, armazená-los, gerenciar seu ciclo de vida e injetar dependências onde for preciso.

#### Bean

São os objetos controlados pelo Spring. É o componente gerenciado pelo ApplicationContext. Exemplos comuns de beans são:

- Services
- Controllers
- Repositories
- Configurações

#### Annotations

São as instrução para o Spring, que dizem o que criar, quando criar, onde injetar e como configurar tudo. Como exemplos, temos:

- @Component
- @Service
- @Repository
- @Autowired
- @Configuration
- @Bean

## Spring Initialzr

<div style="text-align: center;"> <img alt="Meme muito engraçado sobre arquivos do sistema" src="assets/images/spring-initilzr.png" width="100%">
</div>

## Gerenciadores de Projeto

Gerenciadores de projeto tem como função principal resolver dependências automaticamente, controlar o ciclo de build (compilar, testar, empacotar e rodar) e padronizar o projeto para qualquer desenvolvedor.

### Maven

<div style="text-align: center;"> <img alt="Meme muito engraçado sobre arquivos do sistema" src="assets/images/maven-logo.png" width="60%">
</div>

- XML-based (usa pom.xml)
- Padronizado e opinativo
- Gerencia dependencias, ciclo de build, plugins e empacotamento
- Grande quantidade de bibliotecas disponível

### Gradle

<div style="text-align: center;"> <img alt="Meme muito engraçado sobre arquivos do sistema" src="assets/images/Gradle-logo.png" width="60%">
</div>

- DSL baseada em Groovy/Kotlin
- Mais rápido
- Flexível e altamente configurável
- Muito usado em projetos modernos (Spring, Android)

#### Application.properties (.yml)

O Application.properties serve como o arquivo central de configuração do Spring Boot, definindo compotamentos da aplicação sem alterar o código.

Exemplo do .properties:

```java
server.port=8081
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.show-sql=true
```

Exemplo do .yml:

```yml
server:
  port: 8081
spring:
  datasource:
    url: jdbc:h2:mem:testdb
  jpa:
    show-sql: true
```