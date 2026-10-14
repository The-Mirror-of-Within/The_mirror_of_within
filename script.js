/* Armazenamento */

const CHAVES = {
    saves: 'mow:saves',
    config: 'mow:config',
    atual: 'mow:slotAtual',
    voltar: 'mow:voltar'
};

const TECLAS_PADRAO = { frente: 'W', tras: 'S', esquerda: 'A', direita: 'D', interagir: 'R', inventario: 'G' };
const CONFIG_PADRAO = { musica: 100, efeitos: 100, telaCheia: false, idioma: 'pt-BR', teclas: TECLAS_PADRAO };

function ler(chave, padrao, storage = localStorage) {
    try {
        const valor = storage.getItem(chave);
        return valor === null ? padrao : JSON.parse(valor);
    } catch {
        return padrao;
    }
}

function gravar(chave, valor, storage = localStorage) {
    try {
        storage.setItem(chave, JSON.stringify(valor));
        return true;
    } catch {
        return false;
    }
}

function lerConfig() {
    const c = ler(CHAVES.config, {});
    const idiomaOk = c.idioma === 'en' || c.idioma === 'pt-BR';
    return {
        musica: Number.isFinite(c.musica) ? c.musica : CONFIG_PADRAO.musica,
        efeitos: Number.isFinite(c.efeitos) ? c.efeitos : CONFIG_PADRAO.efeitos,
        telaCheia: c.telaCheia === true,
        idioma: idiomaOk ? c.idioma : CONFIG_PADRAO.idioma,
        teclas: { ...TECLAS_PADRAO, ...(c.teclas && typeof c.teclas === 'object' ? c.teclas : {}) }
    };
}

function lerSaves() {
    const s = ler(CHAVES.saves, []);
    const lista = Array.isArray(s) ? s : [];
    return [0, 1, 2].map(i => {
        const x = lista[i];
        return x && Number.isFinite(x.segundos) ? { segundos: x.segundos, capitulo: x.capitulo || 1 } : null;
    });
}

function novoSave() {
    return { segundos: 0, capitulo: 1 };
}


/* Idioma */

const TEXTOS = {
    'pt-BR': {
        'titulo.menu': 'The Mirror of Within',
        'titulo.salvamento': 'The Mirror of Within — Salvamento',
        'titulo.jogo': 'The Mirror of Within — Jogo',
        'titulo.opcoes': 'The Mirror of Within — Opções',
        'menu.novo': 'Novo Jogo', 'menu.carregar': 'Carregar Jogo', 'menu.opcoes': 'Opções', 'menu.sair': 'Sair',
        'menu.sair-aviso': 'O navegador não deixa o site fechar a aba. Feche manualmente.',
        'salv.titulo': 'Selecione um jogo', 'salv.inicio': 'Início', 'salv.novo': 'Novo Jogo',
        'salv.capitulo': 'Capítulo', 'salv.slot': 'Jogo',
        'salv.criado': 'Novo jogo criado.', 'salv.jogar': 'Jogar', 'salv.voltar': 'Voltar',
        'salv.carregar': 'Carregar jogo', 'salv.reiniciar': 'Reiniciar jogo', 'salv.apagar': 'Apagar jogo',
        'salv.confirma-reiniciar': 'Reiniciar este jogo? O progresso será perdido.',
        'salv.confirma-apagar': 'Apagar este jogo? Não dá pra desfazer.',
        'salv.sim': 'Sim', 'salv.nao': 'Não',
        'salv.reiniciado': 'Jogo reiniciado.', 'salv.apagado': 'Jogo apagado.',
        'salv.sem-storage': 'Não foi possível salvar neste navegador.',
        'jogo.rodando': 'jogo rodando',
        'jogo.dica': '(pressione “ESC” para pausar e “Tab” para o inventário)',
        'jogo.inventario': 'Inventário ainda não está pronto.',
        'jogo.salvo': 'Jogo salvo.',
        'pausa.titulo': 'Pausado', 'pausa.continuar': 'CONTINUAR', 'pausa.opcoes': 'OPÇÕES',
        'pausa.salvar': 'SALVAR', 'pausa.carregar': 'CARREGAR', 'pausa.sair': 'SAIR DO JOGO',
        'op.titulo': 'Opções', 'op.voltar': 'Voltar', 'op.controles': 'Controles', 'op.sistema': 'Sistema',
        'op.salvar': 'SALVAR', 'op.cancelar': 'CANCELAR', 'op.restaurar': 'RESTAURAR',
        'op.legenda': 'Tecla do teclado e botão do controle de cada ação',
        'op.acoes': 'AÇÕES', 'op.teclado': 'TECLADO', 'op.controle': 'CONTROLE', 'op.fechar': 'Fechar',
        'op.salvo': 'Configurações salvas.', 'op.cancelado': 'Alterações descartadas.',
        'op.restaurado': 'Padrão restaurado. Clique em SALVAR para confirmar.',
        'op.pressione': 'Pressione uma tecla…', 'op.repetida': 'Essa tecla já está em uso.',
        'op.sem-storage': 'Não foi possível salvar neste navegador.',
        'acao.frente': 'Movimento (Frente)', 'acao.tras': 'Movimento (Trás)',
        'acao.esquerda': 'Movimento (Esquerda)', 'acao.direita': 'Movimento (Direita)',
        'acao.interagir': 'Interagir', 'acao.inventario': 'Abrir Inventário',
        'sis.musica': 'Música:', 'sis.efeitos': 'Efeitos Sonoros:', 'sis.tela': 'Tela Cheia:',
        'sis.idioma': 'Idioma:', 'sis.idioma-titulo': 'Idioma', 'sis.on': 'ON', 'sis.off': 'OFF',
        'sis.nome-idioma': 'Português (BR)'
    },
    en: {
        'titulo.menu': 'The Mirror of Within',
        'titulo.salvamento': 'The Mirror of Within — Save slots',
        'titulo.jogo': 'The Mirror of Within — Game',
        'titulo.opcoes': 'The Mirror of Within — Options',
        'menu.novo': 'New Game', 'menu.carregar': 'Load Game', 'menu.opcoes': 'Options', 'menu.sair': 'Quit',
        'menu.sair-aviso': 'Browsers do not let a site close its own tab. Close it manually.',
        'salv.titulo': 'Select a game', 'salv.inicio': 'Home', 'salv.novo': 'New Game',
        'salv.capitulo': 'Chapter', 'salv.slot': 'Game',
        'salv.criado': 'New game created.', 'salv.jogar': 'Play', 'salv.voltar': 'Back',
        'salv.carregar': 'Load game', 'salv.reiniciar': 'Restart game', 'salv.apagar': 'Delete game',
        'salv.confirma-reiniciar': 'Restart this game? Progress will be lost.',
        'salv.confirma-apagar': 'Delete this game? This cannot be undone.',
        'salv.sim': 'Yes', 'salv.nao': 'No',
        'salv.reiniciado': 'Game restarted.', 'salv.apagado': 'Game deleted.',
        'salv.sem-storage': 'Could not save in this browser.',
        'jogo.rodando': 'game running',
        'jogo.dica': '(press “ESC” to pause and “Tab” for the inventory)',
        'jogo.inventario': 'Inventory is not ready yet.',
        'jogo.salvo': 'Game saved.',
        'pausa.titulo': 'Paused', 'pausa.continuar': 'CONTINUE', 'pausa.opcoes': 'OPTIONS',
        'pausa.salvar': 'SAVE', 'pausa.carregar': 'LOAD', 'pausa.sair': 'QUIT GAME',
        'op.titulo': 'Options', 'op.voltar': 'Back', 'op.controles': 'Controller', 'op.sistema': 'System',
        'op.salvar': 'SAVE', 'op.cancelar': 'CANCEL', 'op.restaurar': 'RESTART',
        'op.legenda': 'Keyboard key and controller button for each action',
        'op.acoes': 'ACTIONS', 'op.teclado': 'KEYBOARD', 'op.controle': 'CONTROLLER', 'op.fechar': 'Close',
        'op.salvo': 'Settings saved.', 'op.cancelado': 'Changes discarded.',
        'op.restaurado': 'Defaults restored. Click SAVE to confirm.',
        'op.pressione': 'Press a key…', 'op.repetida': 'That key is already in use.',
        'op.sem-storage': 'Could not save in this browser.',
        'acao.frente': 'Move (Forward)', 'acao.tras': 'Move (Back)',
        'acao.esquerda': 'Move (Left)', 'acao.direita': 'Move (Right)',
        'acao.interagir': 'Interact', 'acao.inventario': 'Open Inventory',
        'sis.musica': 'Music:', 'sis.efeitos': 'Sound Effects:', 'sis.tela': 'Fullscreen:',
        'sis.idioma': 'Language:', 'sis.idioma-titulo': 'Language', 'sis.on': 'ON', 'sis.off': 'OFF',
        'sis.nome-idioma': 'English'
    }
};

let idiomaAtual = 'pt-BR';

function t(chave) {
    return (TEXTOS[idiomaAtual] && TEXTOS[idiomaAtual][chave]) || TEXTOS['pt-BR'][chave] || chave;
}

function aplicarIdioma(idioma) {
    idiomaAtual = TEXTOS[idioma] ? idioma : 'pt-BR';
    document.documentElement.lang = idiomaAtual;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    document.title = t('titulo.' + document.body.dataset.tela);
}

function mostrarAviso(texto) {
    const aviso = document.getElementById('aviso');
    if (aviso) aviso.textContent = texto;
}


/* Janela de confirmação (dialog) */

function perguntar(texto, textoOk, textoCancelar) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-texto').textContent = texto;
    document.getElementById('modal-ok').textContent = textoOk;
    document.getElementById('modal-cancelar').textContent = textoCancelar;
    modal.returnValue = 'cancel';
    return new Promise(resolve => {
        modal.addEventListener('close', () => resolve(modal.returnValue === 'ok'), { once: true });
        modal.showModal();
        document.getElementById('modal-cancelar').focus();
    });
}


/* Menu */

function iniciarMenu() {
    const itens = document.querySelectorAll('.item');
    const setinha = document.getElementById('setinha');
    const links = Array.from(itens).map(i => i.querySelector('.item-link'));
    let atual = 0;

    function ativar(idx) {
        atual = idx;
        itens.forEach((it, i) => it.classList.toggle('ativo', i === idx));
        const pos = itens[idx].getBoundingClientRect();
        setinha.style.left = (pos.right + 14) + 'px';
        setinha.style.top = (pos.top + pos.height / 2 - setinha.offsetHeight / 2) + 'px';
        setinha.classList.add('show');
    }

    itens.forEach((item, idx) => {
        item.addEventListener('mouseenter', () => ativar(idx));
        links[idx].addEventListener('focus', () => ativar(idx));
    });

    document.addEventListener('keydown', e => {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        e.preventDefault();
        const passo = e.key === 'ArrowDown' ? 1 : -1;
        const prox = (atual + passo + itens.length) % itens.length;
        links[prox].focus();
    });

    document.getElementById('sair').addEventListener('click', () => {
        mostrarAviso(t('menu.sair-aviso'));
    });

    window.addEventListener('resize', () => ativar(atual));
    setTimeout(() => links[0].focus({ preventScroll: true }), 1100);
}


/* Salvamento */

function iniciarSalvamento() {
    const lista = document.getElementById('slots');
    let saves = lerSaves();

    function formatarTempo(seg) {
        const h = String(Math.floor(seg / 3600)).padStart(2, '0');
        const m = String(Math.floor((seg % 3600) / 60)).padStart(2, '0');
        const s = String(seg % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    function criar(tag, classe, texto) {
        const el = document.createElement(tag);
        if (classe) el.className = classe;
        if (texto !== undefined) el.textContent = texto;
        return el;
    }

    function iconeBotao(classe, arquivo, rotulo, idx) {
        const btn = criar('button', 'icone-acao ' + classe);
        btn.type = 'button';
        btn.dataset.slot = idx;
        btn.setAttribute('aria-label', `${rotulo} ${idx + 1}`);
        const img = criar('img');
        img.src = arquivo;
        img.alt = '';
        btn.append(img);
        return btn;
    }

    function desenhar() {
        lista.querySelectorAll('.slot').forEach((li, idx) => {
            const save = saves[idx];
            li.replaceChildren();

            const moldura = criar('img', 'slot-moldura');
            moldura.src = 'imagens/moldura-slot.png';
            moldura.alt = '';

            const acao = criar('button', 'slot-acao');
            acao.type = 'button';
            acao.dataset.slot = idx;
            acao.dataset.acao = save ? 'carregar' : 'novo';
            acao.setAttribute('aria-label', save
                ? `${t('salv.carregar')} ${idx + 1}: ${formatarTempo(save.segundos)}, ${t('salv.capitulo')} ${save.capitulo}`
                : `${t('salv.novo')} — ${t('salv.slot')} ${idx + 1}`);

            li.append(moldura, acao, criar('span', 'slot-numero', `${idx + 1}.`));

            if (save) {
                li.append(
                    criar('p', 'slot-tempo', formatarTempo(save.segundos)),
                    criar('p', 'slot-capitulo', `${t('salv.capitulo')} ${save.capitulo}`),
                    iconeBotao('icone-reiniciar', 'imagens/icone-reiniciar.png', t('salv.reiniciar'), idx),
                    iconeBotao('icone-lixeira', 'imagens/icone-lixeira.png', t('salv.apagar'), idx)
                );
            } else {
                li.append(criar('p', 'slot-novo-jogo', t('salv.novo')));
            }
        });
    }

    function persistir() {
        if (!gravar(CHAVES.saves, saves)) mostrarAviso(t('salv.sem-storage'));
    }

    lista.addEventListener('click', async e => {
        e.preventDefault();
        const alvo = e.target.closest('button');
        if (!alvo) return;
        const idx = Number(alvo.dataset.slot);

        if (alvo.classList.contains('slot-acao')) {
            if (alvo.dataset.acao === 'carregar') {
                gravar(CHAVES.atual, idx, sessionStorage);
                location.href = 'jogo-rodando.html';
                return;
            }
            saves[idx] = novoSave();
            persistir();
            desenhar();
            gravar(CHAVES.atual, idx, sessionStorage);
            const jogar = await perguntar(t('salv.criado'), t('salv.jogar'), t('salv.voltar'));
            if (jogar) location.href = 'jogo-rodando.html';
            else lista.querySelector(`.slot-acao[data-slot="${idx}"]`).focus();
            return;
        }

        const reiniciar = alvo.classList.contains('icone-reiniciar');
        const ok = await perguntar(
            reiniciar ? t('salv.confirma-reiniciar') : t('salv.confirma-apagar'),
            t('salv.sim'), t('salv.nao'));
        if (!ok) return;
        saves[idx] = reiniciar ? novoSave() : null;
        persistir();
        desenhar();
        mostrarAviso(reiniciar ? t('salv.reiniciado') : t('salv.apagado'));
        lista.querySelector(`.slot-acao[data-slot="${idx}"]`).focus();
    });

    desenhar();
}


/* Jogo rodando */

function iniciarJogo() {
    const pausa = document.getElementById('pausa');
    const idx = ler(CHAVES.atual, null, sessionStorage);
    let saves = lerSaves();
    let sujo = false;

    function salvar() {
        if (idx === null || !saves[idx]) return true;
        sujo = false;
        return gravar(CHAVES.saves, saves);
    }

    setInterval(() => {
        if (pausa.open || document.hidden || idx === null || !saves[idx]) return;
        saves[idx].segundos++;
        sujo = true;
        if (saves[idx].segundos % 5 === 0) salvar();
    }, 1000);

    window.addEventListener('pagehide', () => { if (sujo) salvar(); });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !pausa.open) {
            e.preventDefault();
            mostrarAviso('');
            pausa.showModal();
        } else if (e.key === 'Tab' && !pausa.open) {
            e.preventDefault();
            mostrarAviso(t('jogo.inventario'));
        }
    });

    document.getElementById('p-continuar').addEventListener('click', () => pausa.close());
    document.getElementById('p-salvar').addEventListener('click', () => {
        const ok = salvar();
        pausa.close();
        mostrarAviso(ok ? t('jogo.salvo') : t('salv.sem-storage'));
    });
    document.getElementById('p-opcoes').addEventListener('click', () => {
        salvar();
        gravar(CHAVES.voltar, 'jogo-rodando.html', sessionStorage);
    });
}


/* Opções */

function iniciarOpcoes() {
    const form = document.getElementById('form-opcoes');
    const abas = Array.from(document.querySelectorAll('.aba'));
    const paineis = [document.getElementById('painel-controles'), document.getElementById('painel-sistema')];
    const botoesTecla = Array.from(document.querySelectorAll('.tecla'));
    const musica = document.getElementById('musica');
    const efeitos = document.getElementById('efeitos');
    const telaCheia = document.getElementById('tela-cheia');
    const abrirIdioma = document.getElementById('abrir-idioma');
    const dlgIdioma = document.getElementById('dlg-idioma');

    let salva = lerConfig();
    let rascunho = structuredClone(salva);
    let esperando = null;

    // volta para o jogo se veio dele
    const voltarPara = ler(CHAVES.voltar, null, sessionStorage);
    if (voltarPara) {
        document.getElementById('voltar').href = voltarPara;
        sessionStorage.removeItem(CHAVES.voltar);
    }

    function nomeTecla(k) {
        return k === ' ' ? 'SPACE' : k.length === 1 ? k.toUpperCase() : k;
    }

    function desenhar() {
        botoesTecla.forEach(b => { b.textContent = nomeTecla(rascunho.teclas[b.dataset.acao]); b.classList.remove('esperando'); });
        musica.value = rascunho.musica;
        efeitos.value = rascunho.efeitos;
        document.getElementById('musica-val').textContent = rascunho.musica + '%';
        document.getElementById('efeitos-val').textContent = rascunho.efeitos + '%';
        telaCheia.textContent = rascunho.telaCheia ? t('sis.on') : t('sis.off');
        telaCheia.setAttribute('aria-checked', String(rascunho.telaCheia));
        abrirIdioma.textContent = TEXTOS[rascunho.idioma]['sis.nome-idioma'];
    }

    function trocarIdioma(idioma) {
        aplicarIdioma(idioma);
        desenhar();
    }

    function selecionarAba(idx) {
        abas.forEach((a, i) => {
            a.classList.toggle('aba-ativa', i === idx);
            a.setAttribute('aria-selected', String(i === idx));
            a.tabIndex = i === idx ? 0 : -1;
            paineis[i].hidden = i !== idx;
        });
        abas[idx].focus();
    }

    abas.forEach((aba, i) => {
        aba.addEventListener('click', () => selecionarAba(i));
        aba.addEventListener('keydown', e => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                selecionarAba((i + 1) % abas.length);
            }
        });
    });

    botoesTecla.forEach(btn => {
        btn.addEventListener('click', () => {
            if (esperando) esperando.classList.remove('esperando');
            esperando = btn;
            btn.classList.add('esperando');
            btn.textContent = t('op.pressione');
        });
    });

    document.addEventListener('keydown', e => {
        if (!esperando) return;
        if (['Tab', 'Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
        e.preventDefault();
        if (e.key === 'Escape') {
            esperando = null;
            desenhar();
            return;
        }
        const tecla = e.key.length === 1 ? e.key.toUpperCase() : e.key;
        const acao = esperando.dataset.acao;
        const emUso = Object.entries(rascunho.teclas).some(([a, k]) => a !== acao && k === tecla);
        if (emUso) {
            mostrarAviso(t('op.repetida'));
        } else {
            rascunho.teclas[acao] = tecla;
            mostrarAviso('');
        }
        const btn = esperando;
        esperando = null;
        desenhar();
        btn.focus();
    });

    musica.addEventListener('input', () => {
        rascunho.musica = Number(musica.value);
        document.getElementById('musica-val').textContent = rascunho.musica + '%';
    });
    efeitos.addEventListener('input', () => {
        rascunho.efeitos = Number(efeitos.value);
        document.getElementById('efeitos-val').textContent = rascunho.efeitos + '%';
    });
    telaCheia.addEventListener('click', () => {
        rascunho.telaCheia = !rascunho.telaCheia;
        desenhar();
    });

    abrirIdioma.addEventListener('click', () => dlgIdioma.showModal());
    document.getElementById('fechar-idioma').addEventListener('click', () => dlgIdioma.close());
    dlgIdioma.querySelectorAll('[data-lang]').forEach(btn => {
        btn.addEventListener('click', () => {
            rascunho.idioma = btn.dataset.lang;
            trocarIdioma(rascunho.idioma);
            dlgIdioma.close();
            abrirIdioma.focus();
        });
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const ok = gravar(CHAVES.config, rascunho);
        salva = structuredClone(rascunho);
        if (rascunho.telaCheia && !document.fullscreenElement && document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else if (!rascunho.telaCheia && document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }
        mostrarAviso(ok ? t('op.salvo') : t('op.sem-storage'));
    });

    document.getElementById('cancelar').addEventListener('click', () => {
        rascunho = structuredClone(salva);
        trocarIdioma(rascunho.idioma);
        mostrarAviso(t('op.cancelado'));
    });

    document.getElementById('restaurar').addEventListener('click', () => {
        rascunho = structuredClone(CONFIG_PADRAO);
        trocarIdioma(rascunho.idioma);
        mostrarAviso(t('op.restaurado'));
    });

    desenhar();
}


/* Início */

document.addEventListener('DOMContentLoaded', () => {
    const config = lerConfig();
    aplicarIdioma(config.idioma);

    const telas = {
        menu: iniciarMenu,
        salvamento: iniciarSalvamento,
        jogo: iniciarJogo,
        opcoes: iniciarOpcoes
    };
    const iniciar = telas[document.body.dataset.tela];
    if (iniciar) iniciar();
});

