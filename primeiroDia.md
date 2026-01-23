---
layout: layoutConteudo
title: Minicurso de Spring
---

<div id="sumario" class="sumario-git">

    <h1>Dia 1</h1>

    <details>
        <summary><a href="#revisando-java">Revisando Java</a></summary>
        <ul>
            <li><a href="#classes-e-objetos">Classes e Objetos</a></li>
            <li><a href="#encapsulamento">Encapsulamento</a></li>
            <li><a href="#organizando-código-em-java">Organizando Código em Java</a></li>
            <li><a href="#verificação-e-testes">Verificação e testes</a></li>
        </ul>
    </details>
    <details>
         <summary><a href="#introduzindo-o-spring">Introduzindo o Spring</a></summary>
        <ul>
            <li><a href="#ecossistema-spring">Ecossistema Spring</a></li>
            <li><a href="#entendendo-dependências">Entendendo Dependências</a>
                <ul> 
                    <li><a href='#spring-como-injetor-de-dependências'>Spring como Injetor de Dependências</a>
                        <ul>
                            <li><a href='#applicationcontext'>ApplicationContext</a></li>
                            <li><a href='#bean'>Bean</a></li>
                            <li><a href='#annotations'>Annotations</a></li>
                            <li><a href='#applicationproperties-ou-yml'>Applicationproperties ou yml</a></li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li><a href="#spring-initialzr">Spring Initialzr</a></li>
            <li><a href="#gerenciadores-de-projeto">Gerenciadores de Projeto</a>
                <ul> 
                    <li><a href="#maves">Maven</a></li>
                    <li><a href="#gradle">Gradle</a></li>
                </ul>
            </li>
            <li><a href="#colocando-em-prática">Colocando em Prática</a></li>
        </ul>
    </details>

  <button class="toggle-button" id="toggle-button">
  
      Esconder Sumário
  
  </button>

</div>

<br>

# Resumo do primeiro dia

Bem vindo ao minicurso **Introdução ao desenvolvimento back-end com Spring!**

Esta é a primeira aula do nosso curso, portanto, será uma aula mais introdutória. Começaremos com uma revisão rápida de Java, pois é a linguagem base do framework, além de conceitos básicos de Programação Orientada a Objetos (POO). Logo após, vamos falar um pouco sobre o **Ecossistema Spring** e as diferentes aplicações das suas ferramentas, além de explicar como o Spring Framework funciona e, o mais importante: "Porque Spring Framework?". Por fim, encerraremos a aula com um exercício onde você irá iniciar o seu primeiro projeto Spring utilizando a ferramenta Spring Initializr, além de alguns extras. Boa aula!

# Revisando Java

Antes de começarmos a estudar Spring é mais do que necessário darmos uma revisada na linguagem na qual o Spring se baseia, o Java!

<div style="text-align: center;"> <img alt="Meme muito engraçado sobre arquivos do sistema" src="assets/images/java.png" width="40%">
</div>

### Classes e Objetos

Em Java, classes são moldes que definem a estrutura e o comportamento de objetos que sejam criados a partir dos mesmos. Por outro lado, objetos são instâncias das classes e se comportam conforme as regrinhas que foram estabelecidas em sua classe. Um exêmplo famoso que ajuda a lembrar bem desses dois conceitos é o da forma e do bolo: a forma é a classe que molda o bolo, o bolo é o objeto moldado pela forma.

As classes também possuem **métodos**, que consistem em funções que podem ser chamadas por qualquer instância daquela classe.

```java
public class FormaQuadrada{ //a forma do bolo
    float profundidade = 6;
    float altura = 20;
    float largura = 20;

    public float calcularVolume(){
      return this.profundidade * this.altura * this.largura;
  }
}
```

```java
public class Main {
    public static void main(String[] args) {
        FormaQuadrada bolo = new FormaQuadrada;
        //bolo é a instância da nossa classe, ou seja, o objeto
        volumeBolo = bolo.calcularVolume()
        System.out.println(volumeBolo) // o valor printado será 20 * 20 * 6 = 2400
    }
}

```

**Exercício:** Para ajudar a relembrar, ou ter certeza que já conhecemos classes, crie uma classe "User" em Java com atributos e métodos à sua escolha e instancie essa classe na classe Main. Sua classe pode ser oganizada da maneira que quiser, mas coloque um atributo booleano "ativo".

### Encapsulamento

Encapsular é o ato de agrupar dados (atributos) e comportamentos (métodos) dentro de uma classe, e restringir o acesso direto aos componentes internos de um objeto. Isso permite que os atributos de uma classe só possam ser acessados ou alterados em situações específicas.

Imagine a classe contaBancaria:

```java
public class contaBancaria {
    double dinheiroEmConta;
    String senhaDoCliente;
}
```

Qualquer parte do código que tentar acessar o atributo senhaDoCliente de uma instância dessa classe, vai conseguir!

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

**Exercício:** Agora que finalmente revimos o conceito de encapsulamento, volte nas classes "User" que você programou mais cedo e reveja se esses conceitos foram seguidos de maneira satisfatória!

#### Herança

<div style="text-align: center;"> <img alt="Meme muito engraçado sobre arquivos do sistema" src="assets/images/java-study.png" width="40%">
</div>

Uma classe pode herdar todos os atributos e métodos de uma outra classe. Esse conceito é conhecido como herança, vamos ver um exemplo:

```java
public class FormaRedonda{ //a forma do bolo
    float profundidade = 6;
    float raio = 15;

    public float calcularVolume(){
      return 3.14 * (raio * raio) * profundidade;

  }
}

public class FormaRedondaComFuroNoMeio extends FormaRedonda {
    float profundidade = 6; 
    float raio = 15;
    float raioDoFuro = 4;
    
    // aqui estamos sobreescrevendo o método "calcularVolume"
    // para manter a corretude na forma com um furo no meio.
    public float calcularVolume (){
      volumeTotal = 3.14 * (raio * raio) * profundidade;
      volumeFuro = 3.14 * (raioDoFuro * raioDoFuro) * profundidade;
      return volumeTotal - volumeFuro;
  }
}
```

**Exercício:** Agora que relembramos o conceito de Herança, crie a classe "Admin" a partir da classe usuário. Objetos instanciados dessa classe devem poder chamar um método que desativa um usuário (muda o valor do atributo "Ativo" do usuário alvo para *false*).

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

**Exercício:** A partir da interface abaixo, implemente uma classe "AdminService" que atenda todos os requisitos de "GenericUserService".

```java
public interface GenericUserService {
    void verificarUserStatus(User usuario); 
    void reativarUser(User usuario);
}

```

### Organizando Código em Java

#### Pacotes

É a principal maneira de se organizar código em Java, como se fosse em pastas. Eles evitam conflitos de nomes entre classes e refletem a modularização do sistema (ex.: com.exemplo.demo.controller).

#### Group Id

O Group Id identifica a organização do projeto, é similar ao domínio de uma empresa, mas ao contrário (ex.: com.exemplo).

#### Artifact Id

É o nome do projeto/aplicação e geralmente vira o nome do arquivo .jar (ex.: api-clientes).

#### Version

De maneira bem simples, version é a versão identificadora do artefato publicado.

## Introduzindo o Spring

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

O ecossistema Spring é um conjunto de mais de 20 ferramentas, módulos e projetos que trabalham juntos, de maneira em que cada projeto resolve um problema específico. Sendo assim, dentro de uma aplicação podemos utilizar diferentes ferramentas. Considere portanto o contexto de uma aplicação de pedidos de comida para *delivery*:

- Spring Boot — Facilita iniciar aplicações rapidamente.
  - É uma versão opinativa do Spring Framework, isto é, com depedências já pré-instaladas e outras configurações já estabelecidas para tornar a inicialização de um projeto mais rápida e produtiva. No contexto da aplicação tem tanto um forte impacto no desenvolvimento quanto um impacto na velocidade de incialização, por exemplo.
- Spring Data — Abstração para acesso a dados
  - Traz interfaces que podem ser utilizadas para implementar muito rapidamente os métodos de acesso ao banco de dados da aplicação. No contexto da aplicação, o Spring Data seria utilizado para "puxar" do banco de dados (via *Queries*) coisas como nomes de restaurantes, avaliações, itens do cardápio de cada restaurante, etc.
- Spring Security — autenticação, autorização, criptografia.
  - Seria utilizado para a criação de usuários para clientes e criação de restaurantes no contexto da aplicação, tudo de forma robusta e evitando problemas como vazamentos de dados, etc.
- Spring AI — recursos para integrar modelos de IA (LLMs).
  - Poderia ser usado para a integração de um chatbot com a API da OpenAI que orientasse o usuário a como utilizar a aplicação.
- Spring Cloud — soluções para microsserviços.
  - Poderia ser utilizado para integração da aplicação com outros serviços já existentes como o iFood, por exemplo.
- Spring Batch — processamento em lote.
  - Otimização da aplicação.
- Spring Web / WebFlux — APIs REST.
  - Estabelece o meio de comunicação entre Back-End, Front-End e Banco de dados.
- Spring HATEOAS, Spring Integration, Spring AMQP, entre muitos outros.

Nosso foco nesse minicurso será direcionado principalmente ao Spring Boot e Spring Web.

## Entendendo Dependências

Podemos entender como dependências as classes e objetos que um componente do projeto precisa para funcionar.

Elas podem ser úteis quando instanciar objetos manualmente pode ser custoso ou confuso, ou então quando temos configurações que precisam ser reaproveitadas. Por exemplo:

- Conexões de banco
- Serviços com lógica complexa
<!--aumentar o número de exemplos-->

Sem injeção de dependências nesses casos, teriamos que criar tudo na mão, gerenciar ciclo de vida, conexões, configurações...

Já com injeções nossa vida fica mais fácil, o Spring controla a criação, destruição e fornecimento dos objetos, deixando o fluxo de trabalho mais fluido e organizado. Imagina ter que reiniciar manualmente a conexão de banco de dados toda vez que um serviço é criado!

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

- @Component. *Utilidade: indica que a classe é gerida automaticamente pelo Spring*
- @Service. *Utilidade: indica que a classe implementa lógicas de negócio*
- @Repository. *Utilidade: abstrai o acesso ao banco de dados*
- @Autowired. *Utilidade: injeta as dependências automaticamente*
- @Configuration. *Utilidade: demarca que a classe define e configura os beans*
- @Bean. *Utilidade: Declara que um método produz um bean gerenciado pelo Spring*

#### Applicationproperties ou yml

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

## POO no Spring

  No início dessa aula tivemos uma revisão básica de Java e de Programação Orientada a Objetos (POO). Sendo assim, agora vamos entender como podemos aplicar esses conceitos no desenvolvimento da nossa aplicação.

### Camadas de um projeto Spring

  Um projeto Spring geralmente é dividido em quatro camadas:

- Model (ou Entity) - Objetos/Entidades do nosso site;
- Controller - Camada onde desenvolveremos nossa API;
- Service - Lógica de Negócio ;
- Repository - Comunicação direta com o Banco de Dados;

***OBS.: Como o foco desse curso é apenas desenvolvimento Web, as soluções relacionadas à camada Repository serão sempre disponibilizadas previamente***

  Sendo cada uma dessas camadas responsável por uma parte do sistema. Ao longo desse curso vamos focar no desenvolvimento das camadas Model, Controller e Service e, na aula de hoje, vamos nos aprofundar na camada Model.

  Aqui está a estrutura resumida de um projeto Spring:

  ```terminal

  ProjetoSpring/
  ├── diferentes arquivos de configuração, arquivos de documentação, etc.
  └── src
    ├── controller
    │   └── EntidadeController.java
    ├── model
    │   └── Entidade.java
    ├── repository
    │   └── EntidadeRepository.java
    └── service
        └── EntidadeService.java
  ```

Vamos ver essa estrutura em prática no final dessa aula.

### A camada Model

  Voltemos um pouco ao exemplo da aplicação de delivery: para a implementação de uma operação como "Fazer Pedido", precisamos implementar uma série de classes como a classe Usuário, a classe Cliente que herda de Usuário, a classe Restaurante, além de diversas outras classes que serão utilizadas no processamento do pagamento, uma classe para armazenar o pedido, etc.

  Todas essas classes são chamadas, no contexto do projeto, de *entidades*, e é na camada Model que elas residem. Sendo assim, esta camada é a que mais se assemelha com a programação de qualquer outro projeto em Java.

  Se você já estudou Banco de Dados alguma vez então você provavelmente está achando o nome "entidade" muito familiar, e você está no caminho certo! Todas as classes que são implementadas na camada model possuem ligação direta com as entidades do Banco de Dados da aplicação, e essa ligação é feita a partir de *Annotations*. Aqui está um exemplo de implementação de uma classe User na camada Model:

```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name="nome", columnDefinition = "VARCHAR(255)")
    private String name;

    @Column(name="email", columnDefinition = "VARCHAR(255)")
    private String email;

    @ManyToOne
    @JoinColumn(name = "user_type_id")
    @JsonProperty("user_type")
    private User_Type user_type;
}
```

  Não se preocupe e entender agora cada uma dessas *Annotations*, apenas perceba que, antes da classe utilizamos `@Entity` para indicar ao compilador que aquela classe representa uma entidade do Banco de Dados, bem como antes de cada atributo utilizamos `@Column` para indicar que aquele atributo representa uma coluna específica da entidade (tabela). A partir dessas *Annotations* as classes do sistema e as entidades do banco se tornam 100% ligadas umas as outras.

## Spring Initialzr

<div style="text-align: center;"> <img alt="Meme muito engraçado sobre arquivos do sistema" src="assets/images/spring-initilzr.png" width="100%">
</div>

## Gerenciadores de Projeto

Gerenciadores de projeto tem como função principal resolver dependências automaticamente, controlar o ciclo de build (compilar, testar, empacotar e rodar) e padronizar o projeto para qualquer desenvolvedor.

### Maven

<div style="text-align: center;"> <img alt="Meme muito engraçado sobre arquivos do sistema" src="assets/images/maven-logo-fundo-branco.png" width="60%">
</div>

- XML-based (usa pom.xml)
- Padronizado e opinativo
- Gerencia dependencias, ciclo de build, plugins e empacotamento
- Grande quantidade de bibliotecas disponível

### Gradle

<div style="text-align: center;"> <img alt="Meme muito engraçado sobre arquivos do sistema" src="assets/images/Gradle-logo-fundo-branco.png" width="60%">
</div>

- DSL baseada em Groovy/Kotlin
- Mais rápido
- Flexível e altamente configurável
- Muito usado em projetos modernos (Spring, Android)

## Criando um Projeto na Prática

Agora que vimos toda a parte teórica finalmente podemos começar a mexer com a parte prática da coisa. Iremos aprender a como usar o [Spring Initialzr](https://start.spring.io/) para iniciar um projeto!

#### Passo a Passo

- 1º passo: Abra o site do Spring Initialzr clicando [aqui](https://start.spring.io/) 
- 2º passo: Na parte "Project" selecione o gerenciador de projetos **Maven**.
- 3º passo: Na parte Language selecione a linguagem que estamos utilizando nesse minicurso.
- 4º passo: Na seção Group, coloque ufrn.petcc.
- 5º passo: Na seção Artifact, coloque meu-primeiro-projeto.
- 6º passo: Selecione **Jar** na seção Packaging.
- 7º passo: Selecione a versão 21 do Java.
- 8º passo: Clique em **Generate**, baixe, extraia e abra o projeto no vscode.
- 9º passo: Abra o PrimeiroprojetoApplication.java em src/main/java/ufrn/petcc/primeiroprojeto.
- 10º passo: Por fim, aperte no botão "Run" do vscode e seu projeto estará rodando!