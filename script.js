const CHAVE_SAVES = 'mirror_saves';
const CHAVE_CONFIG = 'mirror_config';
const CHAVE_SLOT = 'mirror_slot_atual';
const CHAVE_ITENS = 'mirror_itens'; // nome antigo, não usado nos novos salvamentos

/* Armazenamento */

function pegarJSON(chave, padrao) {
    const valor = localStorage.getItem(chave);

    if (valor === null) {
        return padrao;
    }

    try {
        return JSON.parse(valor);
    } catch (erro) {
        return padrao;
    }
}

function salvarJSON(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
}

function formatarTempo(segundos) {
    const horas = String(Math.floor(segundos / 3600)).padStart(2, '0');
    const minutos = String(Math.floor((segundos % 3600) / 60)).padStart(2, '0');
    const resto = String(segundos % 60).padStart(2, '0');

    return horas + ':' + minutos + ':' + resto;
}

function configPadrao() {
    return {
        musica: 100,
        efeitos: 100,
        telaCheia: true,
        teclas: { cima: 'w', baixo: 's', esquerda: 'a', direita: 'd', interagir: 'r', inventario: 'g' }
    };
}

function lerConfig() {
    const config = pegarJSON(CHAVE_CONFIG, configPadrao());
    const padrao = configPadrao();
    if (!config.teclas) config.teclas = padrao.teclas;
    for (let acao in padrao.teclas) {
        if (!config.teclas[acao]) config.teclas[acao] = padrao.teclas[acao];
    }
    return config;
}

function mostrarTecla(tecla) {
    if (tecla === ' ') return 'Espaço';
    return tecla.toUpperCase();
}

function criarNovoJogo() {
    return { segundos: 0, capitulo: 1, x: 51, y: 74, versaoQuarto: 3,
             chaPego: false, curativoPego: false, itens: [] };
}

/* Menu */

function iniciarMenu() {
    const itens = document.querySelectorAll('.item');
    const links = document.querySelectorAll('.item-link');
    const aviso = document.getElementById('aviso');
    let selecionado = 0;

    function selecionar(indice) {
        selecionado = indice;
        aviso.textContent = '';

        itens.forEach(function (item) {
            item.classList.remove('ativo');
        });

        itens[indice].classList.add('ativo');
    }

    itens.forEach(function (item, indice) {
        item.addEventListener('mouseenter', function () {
            selecionar(indice);
        });
    });

    document.addEventListener('keydown', function (evento) {
        if (evento.key === 'ArrowDown') {
            evento.preventDefault();
            selecionado++;

            if (selecionado >= itens.length) {
                selecionado = 0;
            }

            selecionar(selecionado);
            links[selecionado].focus();
        }

        if (evento.key === 'ArrowUp') {
            evento.preventDefault();
            selecionado--;

            if (selecionado < 0) {
                selecionado = itens.length - 1;
            }

            selecionar(selecionado);
            links[selecionado].focus();
        }
    });

    document.getElementById('sair').addEventListener('click', function () {
        aviso.textContent = 'Para sair, feche esta aba.';
    });
}

/* Salvamento */

function iniciarSalvamento() {
    const slots = document.getElementById('slots');
    const aviso = document.getElementById('aviso');
    let saves = pegarJSON(CHAVE_SAVES, [null, null, null]);

    function desenharSlots() {
        slots.innerHTML = '';

        saves.forEach(function (save, indice) {
            const slot = document.createElement('li');
            slot.className = 'slot slot-' + (indice + 1);

            const moldura = document.createElement('img');
            moldura.className = 'slot-moldura';
            moldura.src = 'imagens/moldura-slot.png';
            moldura.alt = '';
            slot.appendChild(moldura);

            const abrir = document.createElement('button');
            abrir.className = 'slot-acao';
            abrir.type = 'button';
            abrir.setAttribute('aria-label', 'Abrir jogo ' + (indice + 1));
            slot.appendChild(abrir);

            const numero = document.createElement('span');
            numero.className = 'slot-numero';
            numero.textContent = (indice + 1) + '.';
            slot.appendChild(numero);

            if (save === null) {
                const novo = document.createElement('p');
                novo.className = 'slot-novo-jogo';
                novo.textContent = 'New game';
                slot.appendChild(novo);
            } else {
                const tempo = document.createElement('p');
                tempo.className = 'slot-tempo';
                tempo.textContent = formatarTempo(save.segundos);
                slot.appendChild(tempo);

                const capitulo = document.createElement('p');
                capitulo.className = 'slot-capitulo';
                capitulo.innerHTML = 'Capítulo atual<br><strong>' + save.capitulo + '</strong>';
                slot.appendChild(capitulo);

                const reiniciar = document.createElement('button');
                reiniciar.className = 'icone-acao icone-reiniciar';
                reiniciar.type = 'button';
                reiniciar.setAttribute('aria-label', 'Reiniciar jogo ' + (indice + 1));
                reiniciar.innerHTML = '<img src="imagens/icone-reiniciar-novo.png" alt="">';
                slot.appendChild(reiniciar);

                const apagar = document.createElement('button');
                apagar.className = 'icone-acao icone-lixeira';
                apagar.type = 'button';
                apagar.setAttribute('aria-label', 'Apagar jogo ' + (indice + 1));
                apagar.innerHTML = '<img src="imagens/icone-lixeira.png" alt="">';
                slot.appendChild(apagar);

                reiniciar.addEventListener('click', function (evento) {
                    evento.stopPropagation();

                    if (confirm('Reiniciar este jogo?')) {
                        saves[indice] = criarNovoJogo();
                        salvarJSON(CHAVE_SAVES, saves);
                        desenharSlots();
                        aviso.textContent = 'Jogo reiniciado.';
                    }
                });

                apagar.addEventListener('click', function (evento) {
                    evento.stopPropagation();

                    if (confirm('Apagar este jogo?')) {
                        saves[indice] = null;
                        salvarJSON(CHAVE_SAVES, saves);
                        desenharSlots();
                        aviso.textContent = 'Jogo apagado.';
                    }
                });
            }

            abrir.addEventListener('click', function () {
                if (saves[indice] === null) {
                    saves[indice] = criarNovoJogo();
                    salvarJSON(CHAVE_SAVES, saves);
                }

                localStorage.setItem(CHAVE_SLOT, indice);
                window.location.href = 'jogo-rodando.html';
            });

            slots.appendChild(slot);
        });
    }

    desenharSlots();
}

/* Jogo */

function iniciarJogo() {
    const personagem = document.getElementById('personagem-jogo');
    const sprite = document.getElementById('sprite-personagem');
    const pausa = document.getElementById('pausa');
    const dica = document.getElementById('dica-interacao');
    const mensagem = document.getElementById('mensagem-jogo');
    const tempo = document.getElementById('tempo-jogo');
    const controles = lerConfig().teclas;
    const cha = document.getElementById('cha-chao');
    const curativo = document.getElementById('curativo-chao');

    let saves = pegarJSON(CHAVE_SAVES, [null, null, null]);
    let indice = Number(localStorage.getItem(CHAVE_SLOT));
    if (!Number.isInteger(indice) || indice < 0 || indice > 2) indice = 0;
    if (!saves[indice]) saves[indice] = criarNovoJogo();
    let jogo = saves[indice];

    // Novos objetos e tamanhos, mantendo o tempo dos salvamentos antigos.
    if (jogo.versaoQuarto !== 3) {
        jogo.x = 51;
        jogo.y = 74;
        jogo.versaoQuarto = 3;
        jogo.chaPego = false;
        jogo.curativoPego = false;
        jogo.itens = [];
    }
    if (!Array.isArray(jogo.itens)) jogo.itens = [];

    let x = jogo.x;
    let y = jogo.y;
    let direcao = 'frente';
    let olhandoDireita = false;
    let teclas = { cima: false, baixo: false, esquerda: false, direita: false };

    // Os limites seguem as posições dos móveis definidas no CSS.
    const obstaculos = [
        { x1: 6, x2: 19, y1: 11, y2: 42 },     // Armário
        { x1: 38, x2: 66, y1: 10, y2: 25 },    // Estante
        { x1: 80, x2: 95, y1: 19, y2: 49 },    // Cômoda e televisão
        { x1: 14, x2: 26, y1: 57, y2: 81 }    // Cama
    ];
    const objetos = [
        { nome: 'Chá de Camomila', x: 70, y: 60, elemento: cha, pego: 'chaPego' },
        { nome: 'Curativo', x: 34, y: 69, elemento: curativo, pego: 'curativoPego' }
    ];

    function salvarProgresso() {
        jogo.x = x;
        jogo.y = y;
        saves[indice] = jogo;
        salvarJSON(CHAVE_SAVES, saves);
    }

    function atualizarPersonagem(andando) {
        personagem.style.left = x + '%';
        personagem.style.top = y + '%';
        personagem.style.zIndex = Math.round(y) + 20;
        personagem.classList.toggle('andando', andando);
        if (sprite.dataset.direcao !== direcao) {
            sprite.src = 'imagens/personagem-' + direcao + '.png';
            sprite.dataset.direcao = direcao;
        }
        sprite.style.transform = direcao === 'lado' && olhandoDireita ? 'scaleX(-1)' : '';
    }

    function podeAndar(novoX, novoY) {
        if (novoX < 5 || novoX > 95 || novoY < 21 || novoY > 95) return false;
        for (let obstaculo of obstaculos) {
            if (novoX > obstaculo.x1 - 1.5 && novoX < obstaculo.x2 + 1.5 &&
                novoY > obstaculo.y1 - 1.5 && novoY < obstaculo.y2 + 1.5) return false;
        }
        return true;
    }

    function objetoProximo() {
        for (let objeto of objetos) {
            if (!jogo[objeto.pego] && Math.abs(x - objeto.x) < 8 && Math.abs(y - objeto.y) < 9) {
                return objeto;
            }
        }
        return null;
    }

    function atualizarObjetos() {
        objetos.forEach(function (objeto) {
            objeto.elemento.classList.toggle('escondido', jogo[objeto.pego] === true);
        });
        const proximo = objetoProximo();
        dica.classList.toggle('escondido', !proximo || !pausa.classList.contains('escondido'));
        if (proximo) dica.textContent = 'Pressione ' + mostrarTecla(controles.interagir) + ' para pegar ' + proximo.nome;
    }

    function mostrarMensagem(texto) {
        mensagem.textContent = texto;
        mensagem.classList.remove('escondido');
    }

    function interagir() {
        if (!pausa.classList.contains('escondido')) return;
        const objeto = objetoProximo();
        if (!objeto) {
            mostrarMensagem('Aproxime-se do chá ou do curativo para pegar.');
            return;
        }
        jogo[objeto.pego] = true;
        const encontrado = jogo.itens.find(function (item) { return item.nome === objeto.nome; });
        if (encontrado) encontrado.quantidade++;
        else jogo.itens.push({ nome: objeto.nome, quantidade: 1 });
        salvarProgresso();
        atualizarObjetos();
        mostrarMensagem('Você pegou ' + objeto.nome + '!');
    }

    function limparMovimento() {
        teclas = { cima: false, baixo: false, esquerda: false, direita: false };
        personagem.classList.remove('andando');
    }

    function abrirPausa() {
        pausa.classList.remove('escondido');
        limparMovimento();
        dica.classList.add('escondido');
        mensagem.classList.add('escondido');
        salvarProgresso();
        document.getElementById('continuar').focus();
    }

    function fecharPausa() {
        pausa.classList.add('escondido');
        mensagem.classList.add('escondido');
        atualizarObjetos();
    }

    function moverPersonagem() {
        if (!pausa.classList.contains('escondido') || document.hidden) return;
        let moverX = 0;
        let moverY = 0;
        if (teclas.esquerda) moverX--;
        if (teclas.direita) moverX++;
        if (teclas.cima) moverY--;
        if (teclas.baixo) moverY++;
        if (moverX === 0 && moverY === 0) {
            personagem.classList.remove('andando');
            return;
        }
        const velocidade = 0.38;
        if (podeAndar(x + moverX * velocidade, y)) x += moverX * velocidade;
        if (podeAndar(x, y + moverY * velocidade)) y += moverY * velocidade;
        if (moverY > 0) direcao = 'frente';
        if (moverY < 0) direcao = 'costas';
        if (moverX !== 0) {
            direcao = 'lado';
            olhandoDireita = moverX > 0;
        }
        mensagem.classList.add('escondido');
        atualizarPersonagem(true);
        atualizarObjetos();
    }

    function direcaoDaTecla(tecla) {
        if (tecla === 'arrowup' || tecla === controles.cima) return 'cima';
        if (tecla === 'arrowdown' || tecla === controles.baixo) return 'baixo';
        if (tecla === 'arrowleft' || tecla === controles.esquerda) return 'esquerda';
        if (tecla === 'arrowright' || tecla === controles.direita) return 'direita';
        return null;
    }

    document.addEventListener('keydown', function (evento) {
        const tecla = evento.key.toLowerCase();
        if (tecla === 'escape') {
            evento.preventDefault();
            if (pausa.classList.contains('escondido')) abrirPausa();
            else fecharPausa();
            return;
        }
        if (!pausa.classList.contains('escondido')) return;
        if (tecla === controles.inventario || tecla === 'tab') {
            evento.preventDefault();
            salvarProgresso();
            window.location.href = 'inventario.html';
            return;
        }
        if (tecla === controles.interagir || tecla === 'e') {
            evento.preventDefault();
            if (!evento.repeat) interagir();
            return;
        }
        const dir = direcaoDaTecla(tecla);
        if (dir) {
            evento.preventDefault();
            teclas[dir] = true;
        }
    });

    document.addEventListener('keyup', function (evento) {
        const dir = direcaoDaTecla(evento.key.toLowerCase());
        if (dir) teclas[dir] = false;
    });
    window.addEventListener('blur', limparMovimento);
    document.addEventListener('visibilitychange', function () { if (document.hidden) limparMovimento(); });
    document.querySelectorAll('[data-direcao]').forEach(function (botao) {
        const dir = botao.dataset.direcao;
        botao.addEventListener('pointerdown', function (evento) {
            evento.preventDefault();
            teclas[dir] = true;
            botao.setPointerCapture(evento.pointerId);
        });
        botao.addEventListener('pointerup', function () { teclas[dir] = false; });
        botao.addEventListener('pointercancel', function () { teclas[dir] = false; });
        botao.addEventListener('lostpointercapture', function () { teclas[dir] = false; });
    });

    document.getElementById('botao-pausar').addEventListener('click', abrirPausa);
    document.getElementById('botao-pegar').addEventListener('click', interagir);
    document.getElementById('continuar').addEventListener('click', fecharPausa);
    document.getElementById('salvar-jogo').addEventListener('click', function () {
        salvarProgresso();
        fecharPausa();
        mostrarMensagem('Jogo salvo!');
    });
    document.querySelectorAll('.pausa a, .controles-toque a').forEach(function (link) {
        link.addEventListener('click', salvarProgresso);
    });
    document.getElementById('dica-mover').textContent =
        mostrarTecla(controles.cima) + ' ' + mostrarTecla(controles.esquerda) + ' ' +
        mostrarTecla(controles.baixo) + ' ' + mostrarTecla(controles.direita) + ' / Setas · Andar';
    document.getElementById('dica-pegar').textContent = mostrarTecla(controles.interagir) + ' / E · Interagir';
    document.getElementById('dica-inventario').textContent = mostrarTecla(controles.inventario) + ' / Tab · Inventário';

    setInterval(moverPersonagem, 30);
    setInterval(function () {
        if (pausa.classList.contains('escondido') && !document.hidden) {
            jogo.segundos++;
            tempo.textContent = formatarTempo(jogo.segundos);
            salvarProgresso();
        }
    }, 1000);
    window.addEventListener('beforeunload', salvarProgresso);
    tempo.textContent = formatarTempo(jogo.segundos);
    atualizarPersonagem(false);
    atualizarObjetos();
    salvarProgresso();
}

/* Opções */

function iniciarOpcoes() {
    const abaControles = document.getElementById('aba-controles');
    const abaSistema = document.getElementById('aba-sistema');
    const painelControles = document.getElementById('painel-controles');
    const painelSistema = document.getElementById('painel-sistema');
    const form = document.getElementById('form-opcoes');
    const musica = document.getElementById('musica');
    const efeitos = document.getElementById('efeitos');
    const musicaVal = document.getElementById('musica-val');
    const efeitosVal = document.getElementById('efeitos-val');
    const telaCheia = document.getElementById('tela-cheia');
    const cancelar = document.getElementById('cancelar');
    const restaurar = document.getElementById('restaurar');
    const aviso = document.getElementById('aviso');
    const botoesTecla = document.querySelectorAll('.tecla-config');
    let config = lerConfig();
    let esperando = '';

    if (window.location.search.includes('voltar=jogo')) {
        document.getElementById('voltar-opcoes').href = 'jogo-rodando.html';
    }

    function desenhar() {
        musica.value = config.musica;
        efeitos.value = config.efeitos;
        musicaVal.textContent = config.musica + '%';
        efeitosVal.textContent = config.efeitos + '%';
        telaCheia.textContent = config.telaCheia ? 'ON' : 'OFF';
        botoesTecla.forEach(function (botao) {
            botao.textContent = esperando === botao.dataset.acao ? 'Pressione...' : mostrarTecla(config.teclas[botao.dataset.acao]);
        });
    }

    function limparAviso() { aviso.textContent = ''; }
    function abrirControles() {
        limparAviso();
        esperando = '';
        abaControles.classList.add('aba-ativa');
        abaSistema.classList.remove('aba-ativa');
        painelControles.classList.remove('escondido');
        painelSistema.classList.add('escondido');
        desenhar();
    }
    function abrirSistema() {
        limparAviso();
        esperando = '';
        abaSistema.classList.add('aba-ativa');
        abaControles.classList.remove('aba-ativa');
        painelSistema.classList.remove('escondido');
        painelControles.classList.add('escondido');
        desenhar();
    }
    abaControles.addEventListener('click', abrirControles);
    abaSistema.addEventListener('click', abrirSistema);

    botoesTecla.forEach(function (botao) {
        botao.addEventListener('click', function () {
            esperando = botao.dataset.acao;
            aviso.textContent = 'Pressione uma tecla para: ' + botao.getAttribute('aria-label').replace('Mudar tecla para ', '') + '.';
            desenhar();
        });
    });
    document.addEventListener('keydown', function (evento) {
        if (!esperando) return;
        evento.preventDefault();
        const tecla = evento.key.toLowerCase();
        if (tecla === 'escape') { esperando = ''; desenhar(); limparAviso(); return; }
        if (tecla === 'tab' || tecla === 'e' || tecla.startsWith('arrow') || tecla === 'enter' || tecla === 'shift' || tecla === 'control' || tecla === 'alt' || tecla === 'meta') {
            aviso.textContent = 'Essa tecla é reservada. Escolha outra.';
            return;
        }
        let repetida = false;
        for (let acao in config.teclas) {
            if (acao !== esperando && config.teclas[acao] === tecla) repetida = true;
        }
        if (repetida) {
            aviso.textContent = 'Tecla já usada em outro comando.';
            return;
        }
        config.teclas[esperando] = tecla;
        esperando = '';
        aviso.textContent = 'Tecla alterada. Clique em SALVAR para confirmar.';
        desenhar();
    });

    musica.addEventListener('input', function () { limparAviso(); musicaVal.textContent = musica.value + '%'; });
    efeitos.addEventListener('input', function () { limparAviso(); efeitosVal.textContent = efeitos.value + '%'; });
    telaCheia.addEventListener('click', function () {
        limparAviso();
        config.telaCheia = !config.telaCheia;
        telaCheia.textContent = config.telaCheia ? 'ON' : 'OFF';
    });
    form.addEventListener('submit', function (evento) {
        evento.preventDefault();
        esperando = '';
        config.musica = Number(musica.value);
        config.efeitos = Number(efeitos.value);
        salvarJSON(CHAVE_CONFIG, config);
        desenhar();
        aviso.textContent = 'Configurações e teclas salvas.';
    });
    cancelar.addEventListener('click', function () {
        esperando = '';
        config = lerConfig();
        desenhar();
        aviso.textContent = 'Alterações canceladas.';
    });
    restaurar.addEventListener('click', function () {
        esperando = '';
        config = configPadrao();
        desenhar();
        aviso.textContent = 'Padrão restaurado. Clique em SALVAR.';
    });
    desenhar();
}

/* Inventário */

function criarItensPadrao() {
    return [
        { nome: 'Chá de Camomila', imagem: 'imagens/cha-camomila.png', descricao: 'Um chá morno que acalma o corpo e a mente. Restaura 20 de PV.', frase: 'Às vezes, tudo que precisamos é de calma.', consumivel: true },
        { nome: 'Curativo', imagem: 'imagens/curativo.png', descricao: 'Um curativo simples. Restaura 30 de PV.', frase: 'Melhor ter um por perto.', consumivel: true }
    ];
}

function iniciarInventario() {
    const abas = document.querySelectorAll('.aba-inventario');
    const listaItens = document.getElementById('lista-itens');
    const mensagem = document.getElementById('mensagem-inventario');
    const usar = document.getElementById('usar-item');
    const examinar = document.getElementById('examinar-item');
    const descartar = document.getElementById('descartar-item');



    const missoes = [
        {
            titulo: 'A Florista Silenciosa',
            resumo: 'Encontre um jeito de fazê-la sorrir.',
            descricao: 'Ela mora sozinha na floricultura no fim da rua e quase não fala com ninguém.',
            local: 'Floricultura Violeta',
            objetivos: ['Descobrir por que ela evita a estufa', 'Conversar com o jardineiro antigo', 'Encontrar o antigo caderno de receitas'],
            pista: 'Ela sempre olha para a velha estufa quando pensa que ninguém está vendo.'
        },
        {
            titulo: 'O Menino da Estação',
            resumo: 'Descubra por que ele nunca embarca.',
            descricao: 'Um garoto aparece todos os dias na estação, mas nunca entra no trem.',
            local: 'Estação',
            objetivos: ['Conversar com o menino', 'Perguntar ao bilheteiro', 'Encontrar a passagem antiga'],
            pista: 'Ele aperta uma passagem amassada sempre que o trem chega.'
        }
    ];

    const diario = [
        { data: '12 de Agosto', titulo: 'Hoje conheci a florista', texto: 'Hoje conheci uma florista. Ela fala tão baixinho...', pista: 'Ela sempre olha para a velha estufa. Por quê?' },
        { data: '9 de Agosto', titulo: 'Sobre a biblioteca', texto: 'Passei mais tempo do que esperava na biblioteca.', pista: 'Alguns livros parecem ter sido movidos recentemente.' },
        { data: '23 de Julho', titulo: 'Um sonho estranho', texto: 'Tive o mesmo sonho outra vez. Aquele corredor parecia maior.', pista: 'No fim dele havia uma porta violeta.' },
        { data: '14 de Julho', titulo: 'O menino da estação', texto: 'O menino estava na plataforma de novo.', pista: 'Ele nunca embarca.' },
        { data: '2 de Julho', titulo: 'Sobre meu poder', texto: 'Ainda não entendo direito o que acontece comigo.', pista: 'Talvez minhas emoções mudem mais do que eu percebo.' },
        { data: '24 de Junho', titulo: 'Chá de Camomila', texto: 'O chá ajudou. Pelo menos por alguns minutos.', pista: 'Talvez eu devesse guardar outro.' }
    ];

    let saves = pegarJSON(CHAVE_SAVES, [null, null, null]);
    let indice = Number(localStorage.getItem(CHAVE_SLOT));
    if (!Number.isInteger(indice) || indice < 0 || indice > 2) indice = 0;
    let jogo = saves[indice];
    if (!jogo) {
        jogo = criarNovoJogo();
        saves[indice] = jogo;
    }
    if (!Array.isArray(jogo.itens)) jogo.itens = [];
    const catalogo = criarItensPadrao();
    let itens = [];
    jogo.itens.forEach(function (salvo) {
        const info = catalogo.find(function (item) { return item.nome === salvo.nome; });
        if (info && salvo.quantidade > 0) {
            itens.push({ nome: info.nome, quantidade: salvo.quantidade, imagem: info.imagem,
                         descricao: info.descricao, frase: info.frase, consumivel: true });
        }
    });
    let itemAtual = 0;

    function salvarItens() {
        jogo.itens = itens.map(function (item) { return { nome: item.nome, quantidade: item.quantidade }; });
        saves[indice] = jogo;
        salvarJSON(CHAVE_SAVES, saves);
    }

    function limparMensagem() {
        mensagem.textContent = '';
    }

    function abrirPainel(nome) {
        document.getElementById('painel-itens').classList.add('escondido');
        document.getElementById('painel-missoes').classList.add('escondido');
        document.getElementById('painel-diario').classList.add('escondido');
        document.getElementById('painel-' + nome).classList.remove('escondido');
        limparMensagem();

        abas.forEach(function (aba) {
            aba.classList.remove('ativa');

            if (aba.dataset.painel === nome) {
                aba.classList.add('ativa');
            }
        });
    }

    abas.forEach(function (aba) {
        aba.addEventListener('click', function () {
            abrirPainel(aba.dataset.painel);
        });
    });

    function mostrarSemItens() {
        document.getElementById('item-ilustracao').textContent = '';
        document.getElementById('item-nome').textContent = 'Inventário vazio';
        document.getElementById('item-descricao').textContent = 'Procure o Chá de Camomila e o Curativo no quarto. Aproxime-se e pressione a tecla de interação para coletá-los.';
        document.getElementById('item-frase').textContent = '';
        usar.disabled = true;
        examinar.disabled = true;
        descartar.disabled = true;
    }

    function mostrarItem(indice) {
        itemAtual = indice;
        limparMensagem();

        const item = itens[indice];
        document.getElementById('item-ilustracao').innerHTML = '<img class="imagem-item" src="' + item.imagem + '" alt="' + item.nome + '">';
        document.getElementById('item-nome').textContent = item.nome;
        document.getElementById('item-descricao').textContent = item.descricao;
        document.getElementById('item-frase').textContent = item.frase;

        const botoes = listaItens.querySelectorAll('.linha-item');
        botoes.forEach(function (botao) {
            botao.classList.remove('selecionado');
        });

        if (botoes[indice]) {
            botoes[indice].classList.add('selecionado');
        }
    }

    function desenharItens() {
        listaItens.innerHTML = '';
        usar.disabled = false;
        examinar.disabled = false;
        descartar.disabled = false;

        itens.forEach(function (item, indice) {
            const botao = document.createElement('button');
            botao.type = 'button';
            botao.className = 'linha-item';
            botao.innerHTML = '<span class="nome-item-lista"><img src="' + item.imagem + '" alt="">' + item.nome + '</span><strong>x' + item.quantidade + '</strong>';
            botao.addEventListener('click', function () {
                mostrarItem(indice);
            });
            listaItens.appendChild(botao);
        });

        if (itens.length === 0) {
            mostrarSemItens();
            return;
        }

        if (itemAtual >= itens.length) {
            itemAtual = 0;
        }

        mostrarItem(itemAtual);
    }

    function desenharMissoes() {
        const lista = document.getElementById('lista-missoes');
        lista.innerHTML = '';

        missoes.forEach(function (missao, indice) {
            const botao = document.createElement('button');
            botao.type = 'button';
            botao.className = 'cartao-missao';
            botao.innerHTML = '<strong>' + missao.titulo + '</strong><span>' + missao.resumo + '</span>';
            botao.addEventListener('click', function () {
                mostrarMissao(indice);
            });
            lista.appendChild(botao);
        });

        mostrarMissao(0);
    }

    function mostrarMissao(indice) {
        const missao = missoes[indice];
        const objetivos = document.getElementById('missao-objetivos');
        const botoes = document.querySelectorAll('.cartao-missao');

        botoes.forEach(function (botao) {
            botao.classList.remove('selecionado');
        });

        if (botoes[indice]) {
            botoes[indice].classList.add('selecionado');
        }

        document.getElementById('missao-titulo').textContent = missao.titulo;
        document.getElementById('missao-descricao').textContent = missao.descricao;
        document.getElementById('missao-local').textContent = missao.local;
        document.getElementById('missao-pista').textContent = missao.pista;

        objetivos.innerHTML = '';
        missao.objetivos.forEach(function (objetivo) {
            const li = document.createElement('li');
            li.textContent = objetivo;
            objetivos.appendChild(li);
        });
    }

    function desenharDiario() {
        const lista = document.getElementById('lista-diario');
        lista.innerHTML = '';

        diario.forEach(function (entrada, indice) {
            const botao = document.createElement('button');
            botao.type = 'button';
            botao.className = 'entrada-diario';
            botao.innerHTML = '<strong>' + entrada.data + '</strong><span>' + entrada.titulo + '</span>';
            botao.addEventListener('click', function () {
                mostrarDiario(indice);
            });
            lista.appendChild(botao);
        });

        mostrarDiario(0);
    }

    function mostrarDiario(indice) {
        const entrada = diario[indice];
        const botoes = document.querySelectorAll('.entrada-diario');

        botoes.forEach(function (botao) {
            botao.classList.remove('selecionado');
        });

        if (botoes[indice]) {
            botoes[indice].classList.add('selecionado');
        }

        document.getElementById('diario-data').textContent = entrada.data;
        document.getElementById('diario-texto').textContent = entrada.texto;
        document.getElementById('diario-pista').textContent = entrada.pista;
    }

    usar.addEventListener('click', function () {
        if (itens.length === 0) {
            return;
        }

        if (!itens[itemAtual].consumivel) {
            mensagem.textContent = 'Este item não pode ser usado agora.';
            return;
        }

        const nome = itens[itemAtual].nome;
        itens[itemAtual].quantidade--;
        mensagem.textContent = nome + ' usado.';

        if (itens[itemAtual].quantidade <= 0) {
            itens.splice(itemAtual, 1);
            itemAtual = 0;
        }

        salvarItens();
        desenharItens();
        mensagem.textContent = nome + ' usado.';
    });

    examinar.addEventListener('click', function () {
        if (itens.length > 0) {
            mensagem.textContent = itens[itemAtual].frase;
        }
    });

    descartar.addEventListener('click', function () {
        if (itens.length === 0) {
            return;
        }

        const nome = itens[itemAtual].nome;

        if (confirm('Descartar uma unidade de ' + nome + '?')) {
            itens[itemAtual].quantidade--;

            if (itens[itemAtual].quantidade <= 0) {
                itens.splice(itemAtual, 1);
                itemAtual = 0;
            }

            salvarItens();
            desenharItens();
            mensagem.textContent = nome + ' descartado.';
        }
    });

    desenharItens();
    desenharMissoes();
    desenharDiario();
}

/* Início */

if (document.body.id === 'menu') {
    iniciarMenu();
}

if (document.body.id === 'salvamento') {
    iniciarSalvamento();
}

if (document.body.id === 'jogo') {
    iniciarJogo();
}

if (document.body.id === 'opcoes') {
    iniciarOpcoes();
}

if (document.body.id === 'inventario') {
    iniciarInventario();
}
