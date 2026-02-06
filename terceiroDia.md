---
layout: layoutConteudo
title: Minicurso de Spring
---

# Regras de negócio e Documentação

## Resumo do terceiro dia

Hoje iremos nos aprofundar um pouco mais no desenvolvimento de um sistema com Spring, entendendo um pouco mais sobre como funciona a camada `Service`, bem como entender a importância da Documentação. Ao final dessa aula você deve compreender o papel da camada bem como entender como implementar regras de negócio e entender como é feita a comunicação entre a camada `Service` e a camada `Controller`, além de como documentar ambas.

## Revisão do segundo dia

No segundo dia aprendemos o que é e como funciona a camada `Controller`, portanto vimos que ela cumpre o papel de um "porteiro", que valida a entrada e direciona o tráfego de dados dentro do sistema. Sendo assim, uma vez que já estamos lidando com os dados, por que não inserir logo a lógica na camada `Controller`?

Existem algumas respostas à essa pergunta, mas as principais são que a inserção da lógica direto na camada `Controller` violaria o SRP (Princípio da Responsabilidade Única) e tornaria os testes e o reuso de certas partes do código bem mais desafiadores.

Sendo assim, precisamos de uma nova camada para as regras de negócio da aplicação, e esta é a camada `Service`.

## Camada `Service`

### O que são regras de negócio

Regras de negócio são as condições, restrições e procedimentos lógicos que definem como uma empresa opera e como os dados devem ser manipulados para atender aos objetivos da organização. No contexto de software, elas representam o "mundo real" traduzido em código, como: determinar quem tem direito a um desconto, validar se um estoque é suficiente para uma venda ou impedir que um aluno se matricule em duas disciplinas no mesmo horário, garantindo que a aplicação não apenas armazene dados, mas siga fielmente as normas e processos que regem aquele modelo de negócio específico.

### Fluxo de dados em uma aplicação Spring

O fluxo de dados dentro de uma aplicação Spring se dá dessa forma:

- `Controller` recebe uma requisição do usuário e manda dados para `Service`;
- `Service` extrai informações dos dados vindos do `Controller` e realiza comunicações com `Repository` (buscas, etc)
- `Repository` retorna uma Entidade ao `Service` depois da busca;
- `Service` processa e realiza operações entre os dados vindos do `Controller` e os dados vindos do `Repository`;
- `Service` manda os dados processados para o `Controller` e, se necessário, manda os dados para o `Repository` salvar no banco;
- `Controller` devolve os dados processados em resposta ao usuário.

Sendo assim, a camada `Service` cumpre um papel de constante comunicação entre as camadas `Controller` e `Repository` assumindo uma posição quase que "central" dentro do fluxo de dados do sistema. Sendo assim, deve-se buscar o maior nível de eficiência e segurança na manipulação dos dados, e por isso um conceito muito importante para a camada `Service` são as classes DTO.

### Classes DTO (Data Transfer Object)

As classes DTO (Data Transfer Object) são objetos simples, sem lógica de negócio, utilizados exclusivamente para transportar dados entre diferentes camadas de um sistema ou entre o cliente e o servidor. No Spring, eles funcionam como "pacotes" que carregam apenas as informações necessárias para uma operação específica, evitando que a estrutura interna do banco de dados (as Entidades) seja exposta diretamente na API.

Sua principal serventia é garantir o desacoplamento e a segurança da aplicação. Com um DTO, você pode filtrar quais campos deseja receber ou enviar (ocultando senhas, por exemplo), agrupar dados de múltiplas fontes em um único objeto e adaptar o formato dos dados para o que o front-end espera, sem precisar alterar a tabela original no banco de dados.

Aqui está um exemplo de uso de uma classe DTO:

### Classe User

```java
@Entity
@Table(name = "usuarios")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    
    @Column(unique = true)
    private String email;

    private String senha; // dado sensível

    private boolean ativo;
    
    private LocalDateTime dataCriacao; // dado inútil para o usuaŕio
}
```

### DTO da Classe User

```java
public class UserDTO {

    private Long id;
    private String nome;
    private String email;

    public UserDTO(User user) {
        this.id = user.getId();
        this.nome = user.getNome();
        this.email = user.getEmail();
    }
}
```

Sendo assim, vamos ver agora um exemplo prático utilizando tudo que foi aprendido até agora:

### Exemplo prático <!--Podemos talvez fazer essa parte como live coding-->

```java
@Service
public class AutenticacaoService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    // Construtor para injeção dos dados da camada Repository 
    public AutenticacaoService(UsuarioRepository usuarioRepository, 
                               PasswordEncoder passwordEncoder, 
                               TokenService tokenService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    public String realizarLogin(LoginDTO dados) {
        // 1. o usuário deve existir no banco (lança uma exceção caso contrário)
        Usuario usuario = usuarioRepository.findByEmail(dados.getEmail())
                .orElseThrow(() -> new AuthenticationException(
      "Usuário não encontrado."));

        // 2. a senha enviada deve coincidir com o hash do banco 
        //(lança uma exceção caso contrário)
        if (!passwordEncoder.matches(dados.getSenha(), usuario.getSenha())) {
            throw new AuthenticationException("Senha incorreta.");
        }

        // 3. usuários bloqueados não podem logar (lança uma exceção caso contrário)
        if (!usuario.isAtivo()) {
            throw new BusinessException("Sua conta está inativa.
        Entre em contato com o suporte.");
        }

        // se tudo estiver OK, gera o token (JWT ou similar)
        return tokenService.gerarToken(usuario);
    }
}
```

## Documentação de projeto

Note como em vários pontos que representam regras de negócio dentro do código, foram inseridos comentários explicando como a lógica implementada se relaciona com essas regras. Obviamente, se tratando de um exemplo didático, foram inseridos mais comentários do que normalmente você encontraria em um código qualquer, mas uma coisa é fato: se tratando de lógica de negócio, diferentes negócios/aplicações podem implementar uma mesma lógica de uma forma completamente diferente, e para isso precisamos de uma documentação que deixe claro como estamos realizando essa implementação.

Acontece que documentar o código com comentários simples ao longo do arquivo pode dificultar o entendimento geral do sistema todo, visto que você precisa acessar cada arquivo do sistema para entender seu funcionamento. Sendo assim, vamos utilizar duas ferramentas diferentes: JavaDoc (Documentação de Código) e Swagger (Documentação de API). Mas antes, vamos entender a diferença entre ambas:

#### Documentação de API ≠ Documentação de Código

Apesar de terem a mesma função (documentar), servem a propósitos diferentes: uma está mais ligada a contrados de entrada e saída e a outra está mais ligada ao funcionamento interno de algum pedaço de código. Vejamos uma tabelinha para melhorar o entendimento

![Comparativo entre Documentação de API e Documentação de código](assets/images/comparacao-api-x-codigo.png)

Entretanto, ambas as documentações acabam tendo o mesmo propósito de ilustrar como funcionam as regras de seu negócio. Um exemplo simples seria a documentação de dois sistemas sobre seu estilo de autenticação. Ambos os sistemas provavelmente usariam um endpoint muito parecido como `/api/auth/sign-in`, mas poderiam ter lógicas de login completamente diferentes (um usa email, o outro cpf, por exemplo). Sendo assim é importante que a documentação da API funcione também para deixar claras as regras de negócio.

Vamos então aprender como utilizar as ferramentas citadas para nossa documentação.

## Documentação com JavaDoc

### O que é o JavaDoc

JavaDoc é um gerador de documentação nativo do JDK a partir de estilos específicos de blocos de comentário e tags dentro do código. Ele gera um arquivo html que pode ser acessado para visualizar a documentação do sistema.

### Adicionando o JavaDoc ao Spring

O JavaDoc é nativo do JDK mas pode ser integrado ao processo de compilação de um projeto Spring, basta adicionar o seguinte à seu arquivo de gerenciamento de projeto (no nosso caso, pom.xml):

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-javadoc-plugin</artifactId>
            <version>3.6.0</version>
            <configuration>
                <show>private</show> </configuration>
        </plugin>
    </plugins>
</build>
```

### Principais tags do JavaDoc

- @param : Descreve um parâmetro de entrada do método.

- @return : Explica o que o método retorna.

- @throws : Indica quais exceções podem ser lançadas e por quê.

- @see : Cria um link "Veja também" para outra parte do código.

- @link : Cria um link inline para outra classe ou método.

### Exemplo Prático

```java
/**
 * Serviço responsável pelo fluxo de autenticação e segurança dos usuários.
 * Esta classe valida credenciais, verifica o status da conta e emite tokens de acesso.
 * * @author Seu Nome
 * @version 1.0
 */
@Service
public class AutenticacaoService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    /**
     * Construtor para injeção de dependências.
     * * @param usuarioRepository Repositório para consulta de dados do usuário.
     * @param passwordEncoder Componente para validação de hashes de senha.
     * @param tokenService Serviço responsável pela geração de JWT.
     */
    public AutenticacaoService(UsuarioRepository usuarioRepository, 
                               PasswordEncoder passwordEncoder, 
                               TokenService tokenService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenService = tokenService;
    }

    /**
     * Realiza a autenticação de um usuário no sistema.
     * O processo valida a existência do e-mail, a integridade da senha e se a 
     * conta do usuário possui permissão de acesso (ativa).
     * * @param dados Objeto DTO contendo email e senha para tentativa de login.
     * @return String contendo o token de autenticação gerado (ex: JWT).
     * @throws AuthenticationException Caso o e-mail não exista ou a senha seja inválida.
     * @throws BusinessException Caso o usuário esteja com o status inativo.
     * @see TokenService#gerarToken(Usuario)
     */
    public String realizarLogin(LoginDTO dados) {
        // 1. Validação de existência
        Usuario usuario = usuarioRepository.findByEmail(dados.getEmail())
                .orElseThrow(() -> new AuthenticationException("Usuário não encontrado."));

        // 2. Validação de senha
        if (!passwordEncoder.matches(dados.getSenha(), usuario.getSenha())) {
            throw new AuthenticationException("Senha incorreta.");
        }

        // 3. Validação de regra de negócio (status da conta)
        if (!usuario.isAtivo()) {
            throw new BusinessException("Sua conta está inativa. Entre em contato com o suporte.");
        }

        return tokenService.gerarToken(usuario);
    }
}
```

Você pode visualizar a documentação rodando o seguinte comando no diretório raiz do projeto:

```terminal
mvn javadoc:javadoc
```

## Documentação com Swagger

### O que é o Swagger

Swagger é um conjunto de ferramentas open-source para documentação de APIs REST baseadas no padrão OpenAPI. Ele consiste em:

1. Especificação OpenAPI: Formato YAML/JSON que descreve de forma estruturada todos os aspectos de uma API (endpoints, parâmetros, respostas, autenticação)

2. Swagger UI: Interface web interativa que gera automaticamente uma página de documentação a partir da especificação OpenAPI, permitindo testar os endpoints diretamente no navegador

3. Swagger Codegen: Ferramenta para gerar código cliente (SDKs) em várias linguagens a partir da documentação

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

## Exercício Prático (Live Coding) <!--Acredito que esse exemplo ainda vai ser adaptado para a ideia do restaurante, que é o projeto final-->

Daremos continuidade ao exercício feito no final do último dia, adicionando uma regra de negócio para a biblioteca e documentando seu código e sua API.

### Regra de negócio

- Um usuário não pode alugar um livro se tiver multas pendentes.
- Um usuário não pode alugar um livro indisponível.

<!--Spoiler box clicável para caso o aluno queira saber o que fazer-->
<details>
<summary><strong>Dica</strong></summary>

<ul>
  <li>Criar o <code>LivroService</code></li>
  <li>Injetar o <code>LivroRepository</code></li>
  <li>Criar o método <code>AlugarLivro()</code></li>
  <li>Verificar se o usuário possui multas pendentes</li>
  <li>Verificar se o livro está disponível</li>
  <li>Lançar exceção ou retornar erro caso a regra falhe</li>
</ul>

</details>

### Funcionalidades esperadas ao fim do exercício

- Cadastro de livros
- Listagem de livros
- Aluguel de livros
  - Com regras de negócio para checagem de erros
- Integração com banco de dados
- Documentação dos endpoints com Swagger
- Documentação do código com JavaDoc

### Exemplo de código documentado com Swagger

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
