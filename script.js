//Informações
const input = document.querySelector('#fileInput');
const infoArea = document.querySelector('.infoText');
const infoTitle = document.querySelector('.Title');

//Informações cabeçalho
let numeroNF;
let emitenteInfo;
let destinatarioInfo;
let produtos;

//Botões Auxiliares
const botaoInput = document.querySelector('.inputButton');
const botaoProximo = document.querySelector('.proximoButton');
const botaoAnterior = document.querySelector('.anteriorButton');
const botaoVerTudo = document.querySelector('.verTudoButton');

const infoEmitenteButton = document.querySelector('.infoEmitenteButton');
const infoDestinatarioButton = document.querySelector('.infoDestinatarioButton');

const socialButton = document.querySelector('.socialIMG');

//Leitores de Evento
input.addEventListener('change', function () {
    
    numeroNF = '';
    emitenteInfo = '';
    destinatarioInfo = '';

    const arquivo = this.files[0];
    const leitor = new FileReader();

    leitor.addEventListener('load', function () {
        infoArea.value = leitor.result;

        mudarVisibilidade(infoArea);
        mudarVisibilidade(infoEmitenteButton);
        mudarVisibilidade(infoDestinatarioButton);

        ajustarAlturaTextArea(infoArea);
        fornecedorEmitente(leitor.result);
    });

    if (arquivo) {
        leitor.readAsText(arquivo);
    } else {
        alert('Selecione um arquivo!');
    }
});

botaoInput.addEventListener('click', function () {
    input.click();
});

socialButton.addEventListener('click', function () {
    document.querySelector('.social').click();
});

infoEmitenteButton.addEventListener('click', function () {
    mostrarInformacao('infoEmitenteButton');
});

infoDestinatarioButton.addEventListener('click', function () {
    mostrarInformacao('infoDestinatarioButton');
});

function mostrarInformacao(id) {
    let auxiliar = '';

    switch (id) {
        case "infoEmitenteButton":
            auxiliar = emitenteInfo;
            break;
        case "infoDestinatarioButton":
            auxiliar = destinatarioInfo;
            break;
    }

    if (auxiliar.length > 1) {
        infoArea.value = auxiliar;
        ajustarAlturaTextArea(infoArea);
    }
}

//Funções auxiliares
function mudarVisibilidade(elemento) {
    if (elemento.style.display === 'none' || elemento.style.display === '') {
        elemento.style.display = 'block';
    }
}

//Funções principais
function extrairInformacoes(xmlDoc, tag, namespace) {
    const elementos = xmlDoc.getElementsByTagNameNS(namespace, tag);
    if (elementos.length > 0) {
        const enderElement = elementos[0].getElementsByTagNameNS(namespace, 'enderEmit')[0] || elementos[0].getElementsByTagNameNS(namespace, 'enderDest')[0];
        return {
            nome: elementos[0].getElementsByTagNameNS(namespace, 'xNome')[0]?.textContent || 'NOME não disponível',
            cnpj: elementos[0].getElementsByTagNameNS(namespace, 'CNPJ')[0]?.textContent || 'CNPJ não disponível',
            logradouro: enderElement?.getElementsByTagNameNS(namespace, 'xLgr')[0]?.textContent || 'LOGRADOURO não disponível',
            numero: enderElement?.getElementsByTagNameNS(namespace, 'nro')[0]?.textContent || 'NÚMERO não disponível',
            bairro: enderElement?.getElementsByTagNameNS(namespace, 'xBairro')[0]?.textContent || 'BAIRRO não disponível',
            municipio: enderElement?.getElementsByTagNameNS(namespace, 'xMun')[0]?.textContent || 'MUNICÍPIO não disponível',
            uf: enderElement?.getElementsByTagNameNS(namespace, 'UF')[0]?.textContent || 'UF não disponível',
            cep: enderElement?.getElementsByTagNameNS(namespace, 'CEP')[0]?.textContent || 'CEP não disponível',
            pais: enderElement?.getElementsByTagNameNS(namespace, 'xPais')[0]?.textContent || 'PAÍS não disponível'
        };
    }
    return {
        nome: 'Não encontrado',
        cnpj: 'Não encontrado',
        logradouro: 'Não encontrado',
        numero: 'Não encontrado',
        bairro: 'Não encontrado',
        municipio: 'Não encontrado',
        uf: 'Não encontrado',
        cep: 'Não encontrado',
        pais: 'Não encontrado'
    };
}

function fornecedorEmitente(xmlString) {
    const namespace = "http://www.portalfiscal.inf.br/nfe";
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

    const emitente = extrairInformacoes(xmlDoc, 'emit', namespace);
    const destinatario = extrairInformacoes(xmlDoc, 'dest', namespace);

    const auxNumeroNF = xmlDoc.getElementsByTagNameNS(namespace, 'ide');
    let numeroNF = 'Não encontrado';
    if (auxNumeroNF.length > 0) {
        const nNFElement = auxNumeroNF[0].getElementsByTagNameNS(namespace, 'nNF')[0];
        if (nNFElement) {
            numeroNF = nNFElement.textContent;
        }
    }
    
    emitenteInfo = `Emitente: ${emitente.nome}\nCNPJ: ${emitente.cnpj}\nLogradouro: ${emitente.logradouro}\nNúmero: ${emitente.numero}\nBairro: ${emitente.bairro}\nMunicípio: ${emitente.municipio}\nUF: ${emitente.uf}\nCEP: ${emitente.cep}\nPaís: ${emitente.pais}`;
    destinatarioInfo = `Destinatário: ${destinatario.nome}\nCNPJ: ${destinatario.cnpj}\nLogradouro: ${destinatario.logradouro}\nNúmero: ${destinatario.numero}\nBairro: ${destinatario.bairro}\nMunicípio: ${destinatario.municipio}\nUF: ${destinatario.uf}\nCEP: ${destinatario.cep}\nPaís: ${destinatario.pais}`;

    infoTitle.innerText = `NF: ${numeroNF}`;
}

function ajustarAlturaTextArea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

/*
function extrairICMS(produto) {
    const icmsTags = ['ICMS00', 'ICMS10', 'ICMS20', 'ICMS30', 'ICMS40', 'ICMS51', 'ICMS60', 'ICMS70', 'ICMS90'];
    let icms = null;

    for (let tag of icmsTags) {
        icms = produto.getElementsByTagName(tag)[0];
        if (icms) break;
    }

    if (icms) {
        return {
            icmsProduto: parseFloat(icms.getElementsByTagName("vICMS")[0] ? .textContent || 0),
            aliquotaProduto: parseFloat(icms.getElementsByTagName("pICMS")[0] ? .textContent || 0),
            valorIcmsProduto: parseFloat(icms.getElementsByTagName("vICMS")[0] ? .textContent || 0)
        };
    } else {
        return {
            icmsProduto: 0,
            aliquotaProduto: 0,
            valorIcmsProduto: 0
        };
    }
}*/ 