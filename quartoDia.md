---
layout: layoutConteudo
title: Minicurso de Spring
---

# Segurança e Banco de Dados no Spring

## Resumo do quarto dia

Neste dia, aprofundaremos o desenvolvimento em Spring abordando um tópico essencial para qualquer sistema Back-End: Segurança e Banco de Dados. Utilizando a dependência Spring Security e o banco de dados H2, implementaremos um sistmea básico de autenticação e autorização, compreendendo os princípios de segurança em aplicações web. Ao final do dia, os alunos serão capazes de criar mecanismos de controle de acesso baseados em perfis de usuário e estarão aptos a realizar o projeto final do minicurso.

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
- Documentação de Código e API
  - Aprendemos a utilizar Swagger para documentação de API e JavaDoc para documentação de código.

## Segurança com Spring Security

### Por que é importante ter um sistema sólido

Uma boa segurança é uma necessidade para qualquer aplicação web que vá lidar com dados pessoais de usuários. Devido a LGPD (Lei Geral de Proteção de Dados) é legalmente necessário que as organizações (ou seja, as empresas) protejam os dados pessoais de usuários no Brasil. Muitas empresas tem times específicos para lidar com a segurança, mas em muitas outras essa responsabilidade cai diretamente nos desenvolvedores, então é importante ter conhecimentos nisso. Porém, é nosso dever informar que uma solução completa para segurança das informações de uma aplicação web real está muito além do que podemos fazer neste curso.

A **Autenticação** garante que o usuário é realmente quem diz ser (através de diversas formas diferentes, sendo email e senha os mais comuns métodos de autenticação), enquanto a **Autorização** garante que os usuários tenham acesso apenas aquilo que podem fazer, impedindo que um usuário comum tenha privilégios de admnistrador, por exemplo. Seguir padrões rigorosos de **autenticação** e **autorização** é uma forma simples e direta de fazer um sistema sólido e relativamente seguro, e o Spring Security serve justamente para isso.

### Como utilizar o Spring Security

Spring Security é um framework extensível que fornece autenticação e autorização para aplicações Java. Seu funcionamento baseia-se em:

1. Cadeia de Filtros (Filter Chain): Cada requisição HTTP passa por uma cadeia de filtros de segurança

2. AuthenticationManager: Gerencia o processo de autenticação usando provedores configurados

3. UserDetailsService: Interface para carregar dados do usuário a partir de uma fonte (banco de dados, LDAP, etc.)

4. PasswordEncoder: Responsável por criptografar e verificar senhas (BCrypt é o mais recomendado)

5. Configuração via SecurityFilterChain: Define regras de autorização, formulários de login, tratamento de logout e CSRF

A implementação típica envolve: configurar um `SecurityFilterChain`, criar um serviço que implementa `UserDetailsService`, definir entidades de usuário com permissões e proteger *endpoints* baseado em *roles* utilizando anotações como `@PreAuthorize` ou configurações no filtro de segurança.

1. Adicionar a dependência `spring-security` no `pom.xml`

```xml
<dependencies>
    ...
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    ...
</dependencies>
```

2. Criar um arquivo `SecurityConfig.java` com as configurações de segurança

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                // Regra de Negócio: Qualquer um pode ver a documentação da API
                .requestMatchers(
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html").permitAll()
                
                // Regra de Negócio: Qualquer um pode ver os livros
                .requestMatchers(HttpMethod.GET, "/livros/**").permitAll()
                
                // Regra de Negócio: Só ADMIN pode alterar o banco
                .requestMatchers(HttpMethod.POST, "/livros/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/livros/**").hasRole("ADMIN")
                
                // O resto exige login
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        PasswordEncoder enc = PasswordEncoderFactories.createDelegatingPasswordEncoder();

        UserDetails user = User.builder()
            .username("usuario")
            .password(enc.encode("123456"))
            .roles("USER")
            .build();

        UserDetails admin = User.builder()
            .username("admin")
            .password(enc.encode("admin123"))
            .roles("ADMIN")
            .build();

        return new InMemoryUserDetailsManager(user, admin);
    }
}
```

#### Entendendo a Lógica por trás

- `.requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()`
  - Permite que todos que acessarem os caminhos `/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html` serão liberados
- `.requestMatchers(HttpMethod.GET, "/livros/**").permitAll()`
  - Todos os `GETs` em `/livros/**` serão liberados
- `.requestMatchers(HttpMethod.POST, "/livros/**").hasRole("ADMIN")`
  - Os POSTs em `/livros/**` só podem ser feitos por `ADMINs`
- `userDetailsService()`
  - Esta implementação é apenas um recurso temporário para acelerar o processo. Quandoo formos para a parte de conexão com o BD, isso será explicado de uma forma mais apropriada

### Prática

Agora vamos ver como o Spring Security irá funcionar se aplicado nos códigos que vinham sendo desenvolvidos. Após isso, cada um irá adicionar esses mecanismos de segurança em seus projetos.

## Utilizando bancos de dados no Spring

Uma aplicação precisa de um Banco de Dados, afinal de contas não teria de onde a API puxar os dados caso contrário. Como o foco desse curso é especificamente o desenvolvimento Back-End, focaremos em ensinar somente como realizar a conexão com um banco de dados dentro do Spring, a partir do arquivo `application.properties`. Nesse exemplo estaremos usando o banco de dados H2, que é o mesmo banco de dados que utilizaremos no **Projeto Final**.

Para os próximos passos, vamos conectar o h2 ao projeto que vínhamos desenvolvendo.

### 1. Verificando se o H2 está no projeto

- A primeira coisa que precisamos fazer é verificar se nosso arquivo `pom.xml` já possui a dependência do H2.
- Caso não esteja, baixa adicionar o seguinte código no arquivo `pom.xml`:

```xml
<dependencies>
    ...
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
    ...
</dependencies>
```

- Após isso, precisamos reiniciar o maven
  - `mvn clean install -U`

### 2. Modificando o `application.properties`

- O `application.properties` é um arquivo onde ficam várias configurações do projeto
- Ele está localizado em `/src/main/resources/application.properties`
- O que estiver escrito lá **precisa** continuar. Vamos apenas adicionar novas linhas de código

    ```properties
    # --- 1. CONFIGURAÇÃO DA CONEXÃO ---
    spring.datasource.url=jdbc:h2:mem:testdb
    spring.datasource.driverClassName=org.h2.Driver
    spring.datasource.username=sa
    spring.datasource.password=

    # --- 2. CONFIGURAÇÃO DO CONSOLE (A Interface Visual) ---
    spring.h2.console.enabled=true
    spring.h2.console.path=/h2-console

    # --- 3. INTEGRAÇÃO JPA ---
    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.show-sql=true
    ```

#### Explicando o código

- `spring.datasource.url=jdbc:h2:mem:testdb`
  - Define a URL de conexão para o banco de dados H2 em memória.
  - `jdbc` = protocolo Java
  - `h2` = tipo do banco
  - `mem` = em memória (se fechar o app, os dados somem)
  - `testdb` = nome do banco de dados
- `spring.datasource.driverClassName=org.h2.Driver`
  - Driver que 'ensina' o Java a falar com o H2
- `spring.datasource.username=sa`
  - Usuário padrão do H2
- `spring.datasource.password=`
  - Senha padrão do H2. Fica em branco para facilitar os testes em aula
- `spring.h2.console.enabled=true`
  - Habilita a página web de gerenciamento do banco
- `spring.h2.console.path=/h2-console`
  - Define o link de acesso (<http://localhost:8080/h2-console>)
- `spring.jpa.hibernate.ddl-auto=update`
  - Faz o Spring olhar suas classes @Entity e criar/atualizar as tabelas automaticamente
- `spring.jpa.show-sql=true`
  - Mostra no terminal os comandos (INSERT, SELECT) que o Spring está fazendo por trás dos panos

### 3. Ajustando `SecurityConfig.java`

- Agora que o terreno está preparado, podemos partir para ajustes mais específicos.
- Precisamos 'liberar' o H2 dentro do `SecurityConfig.java`, para que ele saiba que o h2 existe e não peça a senha

```java
//Novo import que precisa ser feito
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            // Libera frames para o H2 funcionar
            .headers(headers -> headers.frameOptions(frame -> frame.disable())) 
            .authorizeHttpRequests(auth -> auth
                // Adicionando o caminho para o h2-console
                .requestMatchers(new AntPathRequestMatcher("/h2-console/**")).permitAll()
                
                //Manter as outras rotas
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }
    //Manter o código anterior
}
```

### 4. Reiniciando o projeto

- Caso o projeto esteja em execução durante as mudanças, é necessário reiniciá-lo, para garantir que as mudanças serão aplicadas corretamente
  - Se o projeto estiver rodando
    - `Ctrl+C` para parar a execução
  - `mvn spring-boot:run` para iniciar o projeto
  - OBS: Se necessário `mvn clean install spring-boot:run -DskipTests` para limpar absolutamente tudo antes de rodar

### 5. Testar o banco

- Acessar <http://localhost:8080/h2-console>
  - JDBC URL: jdbc:h2:mem:testdb
  - Username: sa
  - Password:
  - Clique em **Connect**
  - Ver a tela de gerenciamento do BD
  - Inserir o teste sugerido

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

### 6. BÔNUS: Fazendo a autenticação via Banco de Dados

...
