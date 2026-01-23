---
layout: layoutConteudo
title: Minicurso de Spring
---

# Boas práticas e recursos úteis no desenvolvimento Spring

## Resumo do quarto dia
Neste dia, aprofundaremos o desenvolvimento em Spring abordando duas ferramentas fundamentais para produção: documentação automatizada com Swagger e segurança com Spring Security. Veremos como documentar endpoints de forma profissional, facilitando o consumo por outros times, e implementaremos um sistema básico de autenticação e autorização, compreendendo os princípios de segurança em aplicações web. Ao final do dia, os alunos serão capazes de documentar suas APIs e criar mecanismos de controle de acesso baseados em perfis de usuário.

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

### Utilizando o Swagger no Spring Boot
No ecossistema Spring, utilizamos principalmente a biblioteca SpringDoc OpenAPI, que integra perfeitamente com Spring Boot e gera automaticamente a documentação Swagger a partir das anotações já existentes nos controllers. A configuração básica envolve:

1. Adicionar a dependência `springdoc-openapi-starter-webmvc-ui` no `pom.xml`

2. Acessar a interface em `http://localhost:8080/swagger-ui.html`

3. Personalizar a documentação através da classe de configuração OpenAPI

4. Enriquecer os endpoints com anotações específicas como `@Operation`, `@Parameter` e `@ApiResponse`

### Prática 
Documentando os projetos dos dias anteriores usando swagger

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

## Projeto Final
### Contextualização
### Explicando como funciona o front-end
### Objetivos