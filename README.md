
# The Mirror Within

**The Mirror Within** é um RPG narrativo em desenvolvimento, com foco na representatividade positiva e na construção da empatia por meio dos jogos digitais.

A versão web apresenta um protótipo jogável, no qual o jogador pode explorar o quarto da protagonista, interagir com objetos, gerenciar seu inventário e acessar diferentes menus.

## Funcionalidades

- Menu inicial e três espaços de salvamento.
- Movimentação da protagonista pelo cenário.
- Interação e coleta de objetos.
- Inventário com itens, missões e diário.
- Menu de pausa.
- Salvamento do progresso do jogador.
- Personalização dos controles de movimentação e interação.
- Controles adaptados para computadores e dispositivos móveis.

## Checklist dos critérios técnicos

| Critério | Como o projeto atende |
| --- | --- |
| **1. Publicação da aplicação** | O projeto está publicado no **GitHub Pages**, podendo ser acessado por meio de um link público. A aplicação apresenta uma versão web jogável, com menus, cenário e funcionalidades implementadas em HTML, CSS e JavaScript. |
| **2. Interatividade com JavaScript** | O jogo utiliza JavaScript para controlar a movimentação da protagonista, a interação com objetos, o inventário, os menus e a personalização das teclas. Essas interações ocorrem dinamicamente, sem recarregar a página inteira. O código também utiliza `preventDefault()` quando necessário. |
| **3. Persistência de dados** | O projeto utiliza `localStorage` para armazenar informações dos salvamentos e configurações do jogador. Os dados podem ser recuperados mesmo após atualizar a página com **F5**, conforme teste realizado. |
| **4. Ausência de erros no console** | A aplicação foi testada durante a navegação e a jogabilidade, sem apresentar erros vermelhos no console do **DevTools** durante o uso normal. |
| **5. Responsividade e acessibilidade** | O projeto utiliza regras de responsividade no CSS para adaptar as interfaces a diferentes resoluções, incluindo dispositivos móveis. Também possui controles por toque, elementos HTML semânticos e textos alternativos nas imagens pertinentes. |

## Melhorias realizadas

Após os testes de usabilidade, foi implementada a possibilidade de **personalizar as teclas de movimentação e interação**, que anteriormente eram fixas.

Essa alteração permite que o jogador adapte os comandos às suas preferências, melhorando a experiência de utilização.

## Tecnologias utilizadas

- **HTML5:** estrutura das páginas e organização dos elementos.
- **CSS3:** estilização, animações e responsividade.
- **JavaScript:** movimentação, interatividade e funcionalidades do jogo.
- **localStorage:** armazenamento de salvamentos e configurações.
- **Git e GitHub:** versionamento e gerenciamento do código.
- **GitHub Pages:** publicação da aplicação.

## Links do projeto

- **Aplicação:** [Jogar The Mirror Within](https://the-mirror-of-within.github.io/The_mirror_of_within/)
- **Repositório:** [GitHub - The Mirror Within](https://github.com/The-Mirror-of-Within/The_mirror_of_within)

---

**Status:** Protótipo web jogável em desenvolvimento.
