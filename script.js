// Informações
const input = document.querySelector('#fileInput');
const infoArea = document.querySelector('.infoText');
const infoTitle = document.querySelector('.Title');
const divBotoes = document.querySelector('.customButton');

let produtos;
let numeroNF = '';
let emitenteInfo = '';
let destinatarioInfo = '';

// Botões Auxiliares
const botaoInput = document.querySelector('.inputButton');
const socialButton = document.querySelector('.socialIMG');

// Botões de informações
const infoEmitenteButton = document.querySelector('.infoEmitenteButton');
const infoDestinatarioButton = document.querySelector('.infoDestinatarioButton');
const infoIcmsProdsButton = document.querySelector('.infoIcmsProdsButton');
const InfoIpiProdsButton = document.querySelector('.InfoIpiProdsButton');
const infoProdsButton = document.querySelector('.infoProdsButton');
const infoIcmsStProdsButton = document.querySelector('.infoIcmsStProdsButton');
// Leitores de Evento

input.addEventListener('change', function() {
    mudarVisibilidade(divBotoes);
    const arquivo = this.files[0];
    const leitor = new FileReader();

    leitor.addEventListener('load', function() {
        const xmlString = leitor.result;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");

        infoArea.value = xmlString;

        mudarVisibilidade(infoArea);
        mudarVisibilidade(divBotoes);

        ajustarAlturaTextArea(infoArea);
        const emitenteDest = fornecedorEmitente(xmlDoc);
        emitenteInfo = emitenteDest.emitenteInfo;
        destinatarioInfo = emitenteDest.destinatarioInfo;
        numeroNF = emitenteDest.numeroNF;

        produtos = extrairProdutos(xmlDoc, "http://www.portalfiscal.inf.br/nfe");
        console.log(produtos);
        infoTitle.innerText = `NF: ${numeroNF}`;
    });

    if (arquivo) {
        leitor.readAsText(arquivo);
    } else {
        alert('Selecione um arquivo!');
    }
});

botaoInput.addEventListener('click', function() {
    input.click();
});

socialButton.addEventListener('click', function() {
    document.querySelector('.social').click();
});

infoEmitenteButton.addEventListener('click', function() {
    mostrarInformacao('infoEmitenteButton');
});

infoDestinatarioButton.addEventListener('click', function() {
    mostrarInformacao('infoDestinatarioButton');
});

infoProdsButton.addEventListener('click', function() {
    mostrarInformacao('infoProdsButton');
});

InfoIpiProdsButton.addEventListener('click', function() {
    mostrarInformacao('InfoIpiProdsButton');
});

infoIcmsProdsButton.addEventListener('click', function() {
    mostrarInformacao('infoIcmsProdsButton');
});

infoIcmsStProdsButton.addEventListener('click', function() {
    mostrarInformacao('infoIcmsStProdsButton');
});


function mostrarInformacao(id) {
    let auxiliar = '';
    let auxiliarTable = '';
    infoArea.value = '';
    const tableAux = document.querySelector('.infoTable');

    switch (id) {
        case "infoEmitenteButton":
            auxiliar = emitenteInfo;
            break;

        case "infoDestinatarioButton":
            auxiliar = destinatarioInfo;
            break;

        case "infoProdsButton":
            auxiliarTable = '<table><thead><tr><th>N°</th><th>Produto</th><th>NCM</th><th>EMB</th><th>Qnt</th><th>Vlr Unt.</th><th>Valor Total</th></tr></thead><tbody>';
            for (let i = 0; i < produtos.length; i++) {
                auxiliarTable += `<tr><td>${produtos[i].cProd}</td><td>${produtos[i].xProd}</td><td>${produtos[i].NCM}</td><td>${produtos[i].uCom}</td><td>${produtos[i].qCom}</td><td>${produtos[i].vUnCom}</td><td>${produtos[i].vProd}</td></tr>`;
            }
            auxiliarTable += '</tbody></table>';
            break;


        case "InfoIpiProdsButton":
            auxiliarTable = '<table><thead><tr><tr><th>N°</th><th>Produto</th><th>Base IPI</th><th>Alíquota IPI</th><th>Valor IPI</th></tr></thead><tbody>';
            for (let i = 0; i < produtos.length; i++) {
                if (produtos[i].impostos && produtos[i].impostos.IPI) {
                    const ipiData = produtos[i].impostos.IPI;
                    auxiliarTable += `<tr><tr><td>${produtos[i].cProd}</td><td>${produtos[i].xProd}</td><td>${ipiData.vBC}</td><td>${ipiData.pIPI}</td><td>${ipiData.vIPI}</td></tr>`;
                }
            }
            auxiliarTable += '</tbody></table>';
            break;

        case "infoIcmsProdsButton":
            auxiliarTable = '<table><thead><tr><tr><th>N°</th><th>Produto</th><th>Base ICMS</th><th>Alíquota ICMS</th><th>Valor ICMS</th></tr></thead><tbody>';
            for (let i = 0; i < produtos.length; i++) {
                if (produtos[i].impostos && produtos[i].impostos.ICMS) {
                    const icmsData = produtos[i].impostos.ICMS;
                    auxiliarTable += `<tr><tr><td>${produtos[i].cProd}</td><td>${produtos[i].xProd}</td><td>${icmsData.vBC}</td><td>${icmsData.pICMS}</td><td>${icmsData.vICMS}</td></tr>`;
                }
            }
            auxiliarTable += '</tbody></table>';
            break;

        case "infoIcmsStProdsButton":
            auxiliarTable = '<table><thead><tr><th>N°</th><th>Produto</th><th>Base ICMS ST</th><th>% ICMS ST</th><th>Valor ICMS ST</th></tr></thead><tbody>';
            for (let i = 0; i < produtos.length; i++) {
                if (produtos[i].impostos && produtos[i].impostos.ICMS && produtos[i].impostos.ICMS.type === 'ICMSST') {
                    const icmsSTData = produtos[i].impostos.ICMS;
                    auxiliarTable += `<tr><td>${produtos[i].nItem}</td><td>${produtos[i].xProd}</td><td>${icmsSTData.vBCST}</td><td>${icmsSTData.pICMSST}</td><td>${icmsSTData.vICMSST}</td></tr>`;
                }
            }
            auxiliarTable += '</tbody></table>';
            break;
    }

    if (auxiliar.length > 0) {
        mudarVisibilidade(infoArea);
        infoArea.value = auxiliar;
        tableAux.innerHTML = '';
    }

    if (auxiliarTable.length > 0) {

        tableAux.innerHTML = auxiliarTable; // Inserimos a tabela dentro da div com a classe infoTable
        infoArea.style.display = 'none';
    }

    ajustarAlturaTextArea(infoArea);
}

// Funções auxiliares
function mudarVisibilidade(elemento) {
    if (elemento.style.display === 'none' || elemento.style.display === '') {
        elemento.style.display = 'block';
    }
}

function ajustarAlturaTextArea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

// Funções principais
function extrairInformacoesEmitenteDestinatario(xmlDoc, tag, namespace) {
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

function fornecedorEmitente(xmlDoc) {
    const namespace = "http://www.portalfiscal.inf.br/nfe";
    const emitente = extrairInformacoesEmitenteDestinatario(xmlDoc, 'emit', namespace);
    const destinatario = extrairInformacoesEmitenteDestinatario(xmlDoc, 'dest', namespace);

    const auxNumeroNF = xmlDoc.getElementsByTagNameNS(namespace, 'ide');
    let numeroNF = 'Não encontrado';
    if (auxNumeroNF.length > 0) {
        const nNFElement = auxNumeroNF[0].getElementsByTagNameNS(namespace, 'nNF')[0];
        if (nNFElement) {
            numeroNF = nNFElement.textContent;
        }
    }

    const emitenteInfo = `Emitente: ${emitente.nome}\nCNPJ: ${emitente.cnpj}\nLogradouro: ${emitente.logradouro}\nNúmero: ${emitente.numero}\nBairro: ${emitente.bairro}\nMunicípio: ${emitente.municipio}\nUF: ${emitente.uf}\nCEP: ${emitente.cep}\nPaís: ${emitente.pais}`;
    const destinatarioInfo = `Destinatário: ${destinatario.nome}\nCNPJ: ${destinatario.cnpj}\nLogradouro: ${destinatario.logradouro}\nNúmero: ${destinatario.numero}\nBairro: ${destinatario.bairro}\nMunicípio: ${destinatario.municipio}\nUF: ${destinatario.uf}\nCEP: ${destinatario.cep}\nPaís: ${destinatario.pais}`;

    return {
        emitenteInfo,
        destinatarioInfo,
        numeroNF
    };
}

function extrairProdutos(xmlDoc, namespace) {
    const produtos = xmlDoc.getElementsByTagNameNS(namespace, 'det');
    const listaProdutos = [];

    for (let i = 0; i < produtos.length; i++) {
        const det = produtos[i];
        const nItem = det.getAttribute("nItem");

        const prodElement = det.getElementsByTagNameNS(namespace, 'prod')[0];
        if (prodElement) {
            const cProd = prodElement.getElementsByTagNameNS(namespace, 'cProd')[0]?.textContent || 'Não encontrado';
            const cEAN = prodElement.getElementsByTagNameNS(namespace, 'cEAN')[0]?.textContent || 'Não encontrado';
            const xProd = prodElement.getElementsByTagNameNS(namespace, 'xProd')[0]?.textContent || 'Não encontrado';
            const NCM = prodElement.getElementsByTagNameNS(namespace, 'NCM')[0]?.textContent || 'Não encontrado';
            const CFOP = prodElement.getElementsByTagNameNS(namespace, 'CFOP')[0]?.textContent || 'Não encontrado';
            const uCom = prodElement.getElementsByTagNameNS(namespace, 'uCom')[0]?.textContent || 'Não encontrado';
            const qCom = prodElement.getElementsByTagNameNS(namespace, 'qCom')[0]?.textContent || 'Não encontrado';
            const vUnCom = prodElement.getElementsByTagNameNS(namespace, 'vUnCom')[0]?.textContent || 'Não encontrado';
            const vProd = prodElement.getElementsByTagNameNS(namespace, 'vProd')[0]?.textContent || 'Não encontrado';
            const cEANTrib = prodElement.getElementsByTagNameNS(namespace, 'cEANTrib')[0]?.textContent || 'Não encontrado';
            const uTrib = prodElement.getElementsByTagNameNS(namespace, 'uTrib')[0]?.textContent || 'Não encontrado';
            const qTrib = prodElement.getElementsByTagNameNS(namespace, 'qTrib')[0]?.textContent || 'Não encontrado';
            const vUnTrib = prodElement.getElementsByTagNameNS(namespace, 'vUnTrib')[0]?.textContent || 'Não encontrado';
            const indTot = prodElement.getElementsByTagNameNS(namespace, 'indTot')[0]?.textContent || 'Não encontrado';

            // Extrair dados de impostos
            const impostoElement = det.getElementsByTagNameNS(namespace, 'imposto')[0];
            const ICMS = impostoElement.getElementsByTagNameNS(namespace, 'ICMS')[0];
            const IPI = impostoElement.getElementsByTagNameNS(namespace, 'IPI')[0];
            const PIS = impostoElement.getElementsByTagNameNS(namespace, 'PIS')[0];
            const COFINS = impostoElement.getElementsByTagNameNS(namespace, 'COFINS')[0];

            const icmsData = ICMS ? extractICMSData(ICMS) : {};
            const ipiData = IPI ? extractIPIData(IPI) : {};
            const pisData = PIS ? extractPISData(PIS) : {};
            const cofinsData = COFINS ? extractCOFNSData(COFINS) : {};

            const auxiliar = {
                nItem,
                cProd,
                cEAN,
                xProd,
                NCM,
                CFOP,
                uCom,
                qCom,
                vUnCom,
                vProd,
                cEANTrib,
                uTrib,
                qTrib,
                vUnTrib,
                indTot,
                impostos: {
                    ICMS: icmsData,
                    IPI: ipiData,
                    PIS: pisData,
                    COFINS: cofinsData
                }
            };

            listaProdutos.push(auxiliar);
        }
    }

    return listaProdutos;
}

function extractICMSData(ICMS) {
    // Primeiro, garantimos que o ICMS tem filhos antes de tentar acessá-los.
    if (ICMS.children.length === 0) {
        return {}; // Retorna um objeto vazio se não houver informações de ICMS.
    }

    const icmsType = ICMS.children[0].nodeName;
    const icmsNode = ICMS.children[0];

    // Utilizamos o operador optional chaining (?.) e o operador de coalescência nula (??) para lidar com casos onde os elementos são undefined.
    return {
        type: icmsType,
        orig: icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'orig')[0]?.textContent ?? 'Não disponível',
        CST: icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'CST')[0]?.textContent ?? 'Não disponível',
        modBC: icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'modBC')[0]?.textContent ?? null,
        vBC: icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'vBC')[0]?.textContent ?? null,
        pICMS: icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'pICMS')[0]?.textContent ?? null,
        vICMS: icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'vICMS')[0]?.textContent ?? null,
    };
}


function extractIPIData(IPI) {
    const ipiTrib = IPI.getElementsByTagNameNS(IPI.namespaceURI, 'IPITrib')[0];
    return {
        cEnq: IPI.getElementsByTagNameNS(IPI.namespaceURI, 'cEnq')[0].textContent,
        vBC: ipiTrib.getElementsByTagNameNS(IPI.namespaceURI, 'vBC')[0]?.textContent || null,
        pIPI: ipiTrib.getElementsByTagNameNS(IPI.namespaceURI, 'pIPI')[0]?.textContent || null,
        vIPI: ipiTrib.getElementsByTagNameNS(IPI.namespaceURI, 'vIPI')[0]?.textContent || null,
        // Adicione outras propriedades relevantes conforme necessário
    };
}

function extractPISData(PIS) {
    const pisAliq = PIS.getElementsByTagNameNS(PIS.namespaceURI, 'PISAliq')[0];
    return {
        CST: pisAliq.getElementsByTagNameNS(PIS.namespaceURI, 'CST')[0].textContent,
        vBC: pisAliq.getElementsByTagNameNS(PIS.namespaceURI, 'vBC')[0].textContent,
        pPIS: pisAliq.getElementsByTagNameNS(PIS.namespaceURI, 'pPIS')[0].textContent,
        vPIS: pisAliq.getElementsByTagNameNS(PIS.namespaceURI, 'vPIS')[0].textContent,
        // Adicione outras propriedades relevantes conforme necessário
    };
}

function extractCOFNSData(COFINS) {
    const cofinsAliq = COFINS.getElementsByTagNameNS(COFINS.namespaceURI, 'COFINSAliq')[0];
    return {
        CST: cofinsAliq.getElementsByTagNameNS(COFINS.namespaceURI, 'CST')[0].textContent,
        vBC: cofinsAliq.getElementsByTagNameNS(COFINS.namespaceURI, 'vBC')[0].textContent,
        pCOFINS: cofinsAliq.getElementsByTagNameNS(COFINS.namespaceURI, 'pCOFINS')[0].textContent,
        vCOFINS: cofinsAliq.getElementsByTagNameNS(COFINS.namespaceURI, 'vCOFINS')[0].textContent,
        // Adicione outras propriedades relevantes conforme necessário
    };
}