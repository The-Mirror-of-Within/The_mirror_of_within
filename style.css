const CHAVE_SAVES = 'mirror_saves';
const CHAVE_CONFIG = 'mirror_config';
const CHAVE_SLOT = 'mirror_slot_atual';
const CHAVE_ITENS = 'mirror_itens';

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
        telaCheia: true
    };
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
                reiniciar.innerHTML = '<img src="imagens/icone-reiniciar.png" alt="Reiniciar jogo">';
                slot.appendChild(reiniciar);

                const apagar = document.createElement('button');
                apagar.className = 'icone-acao icone-lixeira';
                apagar.type = 'button';
                apagar.innerHTML = '<img src="imagens/icone-lixeira.png" alt="Apagar jogo">';
                slot.appendChild(apagar);

                reiniciar.addEventListener('click', function (evento) {
                    evento.stopPropagation();

                    if (confirm('Reiniciar este jogo?')) {
                        saves[indice] = { segundos: 0, capitulo: 1 };
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
                    saves[indice] = { segundos: 0, capitulo: 1 };
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
    const pausa = document.getElementById('pausa');
    const continuar = document.getElementById('continuar');
    const salvarJogo = document.getElementById('salvar-jogo');
    const aviso = document.getElementById('aviso');
    const tempoJogo = document.getElementById('tempo-jogo');

    let saves = pegarJSON(CHAVE_SAVES, [null, null, null]);
    let indice = Number(localStorage.getItem(CHAVE_SLOT));

    if (!Number.isInteger(indice) || !saves[indice]) {
        indice = 0;
        saves[0] = { segundos: 0, capitulo: 1 };
    }

    function salvarProgresso() {
        salvarJSON(CHAVE_SAVES, saves);
    }

    function atualizarTempo() {
        tempoJogo.textContent = formatarTempo(saves[indice].segundos);
    }

    function fecharPausa() {
        pausa.classList.add('escondido');
        aviso.textContent = '';
    }

    setInterval(function () {
        if (pausa.classList.contains('escondido')) {
            saves[indice].segundos++;
            atualizarTempo();
        }
    }, 1000);

    document.addEventListener('keydown', function (evento) {
        if (evento.key === 'Escape') {
            evento.preventDefault();
            aviso.textContent = '';
            pausa.classList.toggle('escondido');
        }

        if ((evento.key === 'Tab' || evento.key.toLowerCase() === 'g') && pausa.classList.contains('escondido')) {
            evento.preventDefault();
            salvarProgresso();
            window.location.href = 'inventario.html';
        }
    });

    continuar.addEventListener('click', fecharPausa);

    salvarJogo.addEventListener('click', function () {
        salvarProgresso();
        fecharPausa();
        aviso.textContent = 'Jogo salvo.';
    });

    window.addEventListener('beforeunload', salvarProgresso);
    window.addEventListener('pageshow', fecharPausa);
    atualizarTempo();
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

    let config = pegarJSON(CHAVE_CONFIG, configPadrao());

    function limparAviso() {
        aviso.textContent = '';
    }

    function desenhar() {
        musica.value = config.musica;
        efeitos.value = config.efeitos;
        musicaVal.textContent = config.musica + '%';
        efeitosVal.textContent = config.efeitos + '%';
        telaCheia.textContent = config.telaCheia ? 'ON' : 'OFF';
    }

    function abrirControles() {
        limparAviso();
        abaControles.classList.add('aba-ativa');
        abaSistema.classList.remove('aba-ativa');
        painelControles.classList.remove('escondido');
        painelSistema.classList.add('escondido');
    }

    function abrirSistema() {
        limparAviso();
        abaSistema.classList.add('aba-ativa');
        abaControles.classList.remove('aba-ativa');
        painelSistema.classList.remove('escondido');
        painelControles.classList.add('escondido');
    }

    abaControles.addEventListener('click', abrirControles);
    abaSistema.addEventListener('click', abrirSistema);

    musica.addEventListener('input', function () {
        limparAviso();
        musicaVal.textContent = musica.value + '%';
    });

    efeitos.addEventListener('input', function () {
        limparAviso();
        efeitosVal.textContent = efeitos.value + '%';
    });

    telaCheia.addEventListener('click', function () {
        limparAviso();
        config.telaCheia = !config.telaCheia;
        telaCheia.textContent = config.telaCheia ? 'ON' : 'OFF';
    });

    form.addEventListener('submit', function (evento) {
        evento.preventDefault();

        config.musica = Number(musica.value);
        config.efeitos = Number(efeitos.value);
        salvarJSON(CHAVE_CONFIG, config);
        aviso.textContent = 'Configurações salvas.';
    });

    cancelar.addEventListener('click', function () {
        config = pegarJSON(CHAVE_CONFIG, configPadrao());
        desenhar();
        aviso.textContent = 'Alterações canceladas.';
    });

    restaurar.addEventListener('click', function () {
        config = configPadrao();
        desenhar();
        aviso.textContent = 'Valores padrão restaurados. Clique em SALVAR.';
    });

    desenhar();
}

/* Inventário */

function iniciarInventario() {
    const abas = document.querySelectorAll('.aba-inventario');
    const listaItens = document.getElementById('lista-itens');
    const mensagem = document.getElementById('mensagem-inventario');
    const usar = document.getElementById('usar-item');
    const examinar = document.getElementById('examinar-item');
    const descartar = document.getElementById('descartar-item');

    const itensPadrao = [
        { nome: 'Chá de Camomila', quantidade: 3, simbolo: '✿', descricao: 'Um chá morno que acalma o corpo e a mente. Restaura 20 de PV.', frase: '“Às vezes, tudo que a gente precisa é de um pouco de calma.”', consumivel: true },
        { nome: 'Curativo', quantidade: 4, simbolo: '✚', descricao: 'Um curativo velho encontrado pelo caminho. Parece improvisado, mas ainda serve. Restaura 30 de PV.', frase: '“Melhor usar com cuidado.”', consumivel: true },
        { nome: 'Chave Antiga', quantidade: 1, simbolo: '⚿', descricao: 'Uma chave antiga. Você ainda não sabe qual porta ela abre.', frase: '“A ferrugem cobre quase toda a chave.”', consumivel: false },
        { nome: 'Pingente de Vidro', quantidade: 1, simbolo: '◇', descricao: 'Um pequeno pingente de vidro violeta. Parece importante.', frase: '“Ele parece guardar uma lembrança.”', consumivel: false }
    ];

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

    let itens = pegarJSON(CHAVE_ITENS, itensPadrao);
    let itemAtual = 0;

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
        document.getElementById('item-descricao').textContent = 'Você não está carregando nenhum item.';
        document.getElementById('item-frase').textContent = '';
        usar.disabled = true;
        examinar.disabled = true;
        descartar.disabled = true;
    }

    function mostrarItem(indice) {
        itemAtual = indice;
        limparMensagem();

        const item = itens[indice];
        document.getElementById('item-ilustracao').textContent = item.simbolo;
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
            botao.innerHTML = '<span>' + item.nome + '</span><strong>x' + item.quantidade + '</strong>';
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

        salvarJSON(CHAVE_ITENS, itens);
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

            salvarJSON(CHAVE_ITENS, itens);
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
