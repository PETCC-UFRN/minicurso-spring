---
layout: layoutConteudo
title: Minicurso de Spring
---

# Introdução à Lógica de Negócio no Spring

## Resumo do terceiro dia

Hoje iremos nos aprofundar um pouco mais no desenvolvimento de um sistema com Spring, entendendo um pouco mais sobre como funciona a camada `Service`. Ao final dessa aula você deve compreender o papel da camada bem como entender como implementar regras de negócio e entender como é feita a comunicação entre a camada `Service` e a camada `Controller`.

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
