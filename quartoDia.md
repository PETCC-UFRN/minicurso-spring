---
layout: layoutConteudo
title: Minicurso de Spring
---

# Boas práticas e recursos úteis no desenvolvimento Spring

## Resumo do quarto dia

Neste dia, aprofundaremos o desenvolvimento em Spring abordando duas ferramentas fundamentais para produção: documentação automatizada com Swagger, segurança com Spring Security e uma breve introdução a utilização de banco de dados no Spring (neste caso utilizaremos o H2). Veremos como documentar endpoints de forma profissional, facilitando o consumo por outros times, e implementaremos um sistema básico de autenticação e autorização, compreendendo os princípios de segurança em aplicações web. Ao final do dia, os alunos serão capazes de documentar suas APIs, criar mecanismos de controle de acesso baseados em perfis de usuário e estarão aptos a realizar o projeto final do minicurso.

## Revisão do terceiro dia

- `Controller` e `Service`:
  - `Controller` deve atuar apenas como um "porteiro" (recebendo e devolvendo requisições).
  - A lógica pesada e as regras de negócio devem ficar na camada `Service` para respeitar o Princípio da Responsabilidade Única (SRP) e facilitar testes.
- Regras de Negócio
  - Validações e procedimentos que traduzem o "mundo real" para o código
  - Ex: Verificar se há estoque suficiente ou se um aluno pode se matricular.
- Fluxo de Dados no Spring:
  - Controller $\leftrightarrow$ Service (processamento) $\leftrightarrow$ Repository (banco de dados).
- DTOs (Data Transfer Objects)
  - Aprendemos a usar DTOs para transportar dados de forma segura e desacoplada, evitando expor nossas Entidades diretamente na API e escondendo dados sensíveis como senhas

## Documentação com Swagger

### Por que é importante fazer uma boa documentação

Imagine que você é um desenvolvedor, e foi recém contratado por uma empresa para ajudar no desenvolvimento de um sistema, substituindo um outro desenvolvedor que deixou a empresa. Como o desenvolvedor anterior não deixou nenhuma documentação, você vai precisar estudar o código cru do sistema para entender como ele está arquitetado, o que cada função e classe faz e como elas se relacionam entre si, isso deve levar um longuíssimo tempo, que poderia ser gasto trabalhando no sistema de fato, corrigindo bugs e implementando novas funcionalidades. Se ao invés disso, o antigo desenvolvedor deixasse um documento explicando detalhadamente o funcionamento do sistema, o tempo de estudo seria muito mais curto.

Uma boa documentação é essencial para qualquer projeto de escala de mercado (onde vários desenvolvedores trabalham), já que facilita consideravelmente a comunicação entre times (front-end, back-end, etc) e permite uma ciclagem de desenvolvedores muito mais rápida e eficiente. Além disso, uma documentação viva (que se atualiza automaticamente com o código) previne inconsistências e desalinhamentos que frequentemente ocorrem com documentação estática.

### O que é o Swagger

Swagger é um conjunto de ferramentas open-source para documentação de APIs REST baseadas no padrão OpenAPI. Ele consiste em:

1. Especificação OpenAPI: Formato YAML/JSON que descreve de forma estruturada todos os aspectos de uma API (endpoints, parâmetros, respostas, autenticação)

2. Swagger UI: Interface web interativa que gera automaticamente uma página de documentação a partir da especificação OpenAPI, permitindo testar os endpoints diretamente no navegador

3. Swagger Codegen: Ferramenta para gerar código cliente (SDKs) em várias linguagens a partir da documentação

#### Documentação de API ≠ Documentação de Código

Apesar de terem a mesma função (documentar), servem a propósitos diferentes: uma está mais ligada a contrados de entrada e saída e a outra está mais ligada ao funcionamento interno de algum pedaço de código. Vejamos uma tabelinha para melhorar o entendimento

![Comparativo entre Documentação de API e Documentação de código](assets/images/comparacao-api-x-codigo.png)

### Utilizando o Swagger no Spring Boot

No ecossistema Spring, utilizamos principalmente a biblioteca SpringDoc OpenAPI, que integra perfeitamente com Spring Boot e gera automaticamente a documentação Swagger a partir das anotações já existentes nos controllers. A configuração básica envolve:

1. Adicionar a dependência `springdoc-openapi-starter-webmvc-ui` no `pom.xml`

```xml
    <dependencies>
        ...
  <dependency>
   <groupId>org.springdoc</groupId>
   <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
   <version>2.2.0</version>
  </dependency>
        ...
    </dependencies>
```

2. Personalizar a documentação através da classe de configuração OpenAPI

3. Enriquecer os endpoints com anotações específicas como `@Operation`, `@Parameter` e `@ApiResponse`

4. Rodar a aplicação

5. Acessar a interface em `http://localhost:8080/swagger-ui.html`

### Prática

Agora que vimos a teoria, vamos para a prática. Iremos utilizar o Swagger para documentar o código do sistema de biblioteca que fizemos nos últimos dias. Aqui está um exemplo de código documentado com Swagger

```java
//swagger imports
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/livros")
@Tag(
    name = "LivroController",
    description = "Endpoints para gerenciamento de livros")
public class LivroController {
    @Autowired
    private LivroService livroService;

//método listarLivros
    @Operation(
        summary = "Listar todos os livros",
        description = "Retorna uma lista com todos os livros cadastrados")

    @ApiResponse(
        responseCode = "200",
        description = "Lista de livros retornada com sucesso")
    
    @GetMapping
    public List<Livro> listarLivros() {
        return livroService.listarLivros();
    }
// método listarLivros

// método cadastrarLivro
    @Operation(
        summary = "Cadastrar um novo livro",
        description = "Adiciona um novo livro à biblioteca.")
    @ApiResponses(
        value = {
            @ApiResponse(
                responseCode = "200",
                description = "Livro cadastrado com sucesso"),
            @ApiResponse(
                responseCode = "422",
                description = "Dados de entrada inválidos")
    })
    @PostMapping
    public Livro cadastrarLivro(@RequestBody Livro livro) {
        return livroService.cadastrarLivro(livro);
    }
// método cadastrarLivro

// método alugarLivro
    @Operation(
        summary = "Alugar um livro",
        description = "Realiza o aluguel de um livro para um usuário.")
    @ApiResponses(
        value = {
            @ApiResponse(
                responseCode = "200",
                description = "Livro alugado com sucesso"),
            @ApiResponse(
                responseCode = "400",
                description = "Erro ao alugar o livro")
    })
    @PostMapping("/alugar")
    public ResponseEntity<?> alugarLivro(@RequestBody AluguelDTO dadosAluguel) {
        try {
            Livro livroAlugado = livroService.alugarLivro(dadosAluguel);
            return ResponseEntity.ok(livroAlugado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
// método alugarLivro
```

```java
import io.swagger.v3.oas.annotations.media.Schema;

public class AluguelDTO {
    @Schema(
        description = "ID do usuário que vai alugar",
        example = "5")
    private Long usuarioId;
    
    @Schema(
        description = "ID do livro a ser alugado",
        example = "12")
    private Long livroId;
    
    // getters e setters
}
```

#### O que queremos que seja documentado via Swagger

- *Controllers*
- *DTOs*

## Segurança com Spring Security

### Por que é importante ter um sistema sólido

Uma boa segurança é uma necessidade para qualquer aplicação web que vá lidar com dados pessoais de usuários, devido a LGPD (Lei Geral de Proteção de Dados) é legalmente necessário que as organizações (ou seja, as empresas) protejam os dados pessoais de usuários no Brasil. Muitas empresas tem times específicos para lidar com a segurança, mas em muitas outras essa responsabilidade cai diretamente nos desenvolvedores, então é importante ter conhecimentos nisso.

A **Autenticação** garante que o usuário é realmente quem diz ser (através de diversas formas diferentes, sendo email e senha os mais comuns métodos de autenticação), enquanto a **Autorização** garante que os usuários tenham acesso apenas aquilo que podem fazer, impedindo que um usuário comum tenha privilégios de admnistrador, por exemplo. Seguir padrões rigorosos de **autenticação** e **autorização** é uma forma simples e direta de fazer um sistema sólido e relativamente seguro, e o Spring Security serve justamente para isso.

### Como utilizar o Spring Security

Spring Security é um framework extensível que fornece autenticação e autorização para aplicações Java. Seu funcionamento baseia-se em:

1. Filtro Chain (Filter Chain): Cada requisição HTTP passa por uma cadeia de filtros de segurança

2. AuthenticationManager: Gerencia o processo de autenticação usando provedores configurados

3. UserDetailsService: Interface para carregar dados do usuário a partir de uma fonte (banco de dados, LDAP, etc.)

4. PasswordEncoder: Responsável por criptografar e verificar senhas (BCrypt é o mais recomendado)

5. Configuração via SecurityFilterChain: Define regras de autorização, formulários de login, tratamento de logout e CSRF

A implementação típica envolve: configurar um `SecurityFilterChain`, criar um serviço que implementa `UserDetailsService`, definir entidades de usuário com roles/permissões, e proteger endpoints baseado em roles utilizando anotações como `@PreAuthorize` ou configurações no filtro de segurança.

### Prática

Aplicando spring security aos projetos dos dias anteriores

### Utilizando bancos de dados no Spring

Uma aplicação precisa de um Banco de Dados, afinal de contas não teria de onde a API puxar os dados caso contrário. Como o foco desse curso é especificamente o desenvolvimento Back-End, focaremos em ensinar somente como realizar a conexão com um banco de dados dentro do Spring, a partir do arquivo `application.properties`. Nesse exemplo estaremos usando o banco de dados H2, que é o mesmo banco de dados que utilizaremos no **Projeto Final**.

Aqui está um exemplo de uma seção arquivo `application.properties` de configuração para o banco de dados H2:

```properties
# URL de conexão (testdb é o nome do banco)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# Ativa o console web para você ver as tabelas
spring.h2.console.enabled=true
# Define o caminho para acessar o console (ex: localhost:8081/h2-console)
spring.h2.console.path=/h2-console

# Cria/Atualiza as tabelas automaticamente com base nas suas classes @Entity
spring.jpa.hibernate.ddl-auto=update
# Mostra os comandos SQL no console para debug
spring.jpa.show-sql=true
```

Lembre-se que para o banco funcionar no seu projeto, você precisa adicionar a dependência do H2 no arquivo `pom.xml` ou `bulid.gradle`

### Exercício

Adicionar a dependência do H2 a um projeto já existente e testar o banco com o seguinte comando:

```sql
DROP TABLE IF EXISTS teste;

CREATE TABLE teste (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255)
);

INSERT INTO teste(titulo) VALUES 
  ('Isso é um teste'), 
  ('Isso é outro teste');
```
