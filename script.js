const input = document.querySelector('#fileInput');
const infoArea = document.querySelector('.infoText');
const infoTitle = document.querySelector('.Title');
const divBotoes = document.querySelector('.infoNfeContainer');
const dropZone = document.getElementById('dropZone');
const closeButton = document.querySelector('.closeButton'); // Corrigido para usar querySelector
const buttonIds = [
    'infoEmitenteButton',
    'infoDestinatarioButton',
    'infoProdsButton',
    'InfoIpiProdsButton',
    'infoIcmsProdsButton',
    'infoIcmsStProdsButton',
    'infoPisButton',
    'infoCofinsButton',
    'infoFcpButton',
    'infoFcpStButton'
];

let produtos;
let numeroNF = '';
let emitenteInfo;
let destinatarioInfo;

// Botões Auxiliares
const botaoInput = document.querySelector('.inputButton');
const socialButton = document.querySelector('.socialIMG');
const btnHelp = document.querySelector(".titleInfo img[alt='Ajuda']"); // Botão de ajuda

// Modal elements
const modal = document.getElementById("helpModal");
const spanClose = document.querySelector(".modal-content .close");

// Leitores de Evento
closeButton.addEventListener('click', function() {
    mudarVisibilidade(divBotoes);
    mudarVisibilidade(document.querySelector('.InfoHeadContainer'));
});

input.addEventListener('change', function() {
    processFile(this.files[0]);
});

botaoInput.addEventListener('click', function() {
    input.value = ''; // Resetar o input de arquivo para garantir que o change sempre seja acionado
    input.click();
});

socialButton.addEventListener('click', function() {
    document.querySelector('.social').click();
});

// Eventos de arrastar e soltar
dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropZone.classList.remove('dragover');

    const files = event.dataTransfer.files;
    if (files.length) {
        processFile(files[0]);
    }
});

dropZone.addEventListener('click', (event) => {
    if (event.target !== input) {
        input.click();
    }
});

buttonIds.forEach(id => {
    document.getElementById(id).addEventListener('click', function() {
        mostrarInformacao(id);
    });
});

function processFile(file) {
    if (!file.name.endsWith('.xml'||'.XML')) {
        alert('Por favor, selecione um arquivo XML.');
        return;
    }

    const leitor = new FileReader();

    leitor.addEventListener('load', function() {
        const xmlString = leitor.result;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");

        if (divBotoes.style.display === 'none') {
            mudarVisibilidade(divBotoes);
            mudarVisibilidade(document.querySelector('.InfoHeadContainer'));
        }
        ajustarAlturaTextArea(infoArea);

        const auxiliar = fornecedorEmitente(xmlDoc);
        emitenteInfo = auxiliar.emitente;
        destinatarioInfo = auxiliar.destinatario;
        numeroNF = auxiliar.numeroNF;
        document.getElementById('infoEmitenteButton').click();

        produtos = extrairProdutos(xmlDoc, "http://www.portalfiscal.inf.br/nfe");
        infoTitle.innerText = `NF: ${numeroNF}`;
    });

    if (file) {
        leitor.readAsText(file);
    } else {
        alert('Selecione um arquivo!');
    }
}

// Modal functionality
btnHelp.addEventListener('click', function() {
    modal.style.display = "flex";
});

spanClose.addEventListener('click', function() {
    modal.style.display = "none";
});

window.addEventListener('click', function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

// Funções auxiliares
function mudarVisibilidade(elemento) {
    if (elemento.style.display === 'none' || elemento.style.display === '') {
        elemento.style.display = 'block';
    } else {
        elemento.style.display = 'none';
    }
}

function ajustarAlturaTextArea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function mostrarInformacao(id) {
    let auxiliar = '';
    let auxiliarTable = '';
    infoArea.value = '';
    let i = 0;
    const tableAux = document.querySelector('.infoTable');
    let hasData = false;

    switch (id) {
        case "infoEmitenteButton":
            auxiliarTable = `<table><thead><tr><th>Emitente</th><th>Informações</th></tr></thead><tbody>
                                <tr><td>Nome / Razão Social:</td><td>${emitenteInfo.nome}</td></tr>
                                <tr><td>CNPJ:</td><td>${emitenteInfo.cnpj}</td></tr>
                                <tr><td>Endereço:</td><td> ${emitenteInfo.bairro}, ${emitenteInfo.logradouro}, N° ${emitenteInfo.numero}</td></tr>
                            </tbody></table>`; 
            hasData = true;
            break;
    
        case "infoDestinatarioButton":
            auxiliarTable = `<table><thead><tr><th>Destinatário</th><th>Informações</th></tr></thead><tbody>
                                <tr><td>Nome / Razão Social:</td><td>${destinatarioInfo.nome}</td></tr>
                                <tr><td>CNPJ / CPF:</td><td>${destinatarioInfo.cnpj}</td></tr>
                                <tr><td>Endereço:</td><td>${destinatarioInfo.bairro}, ${destinatarioInfo.logradouro}, ${destinatarioInfo.numero}</td></tr>
                            </tbody></table>`; 
            hasData = true;
            break;
    
        case "infoProdsButton":
            if (produtos && produtos.length > 0) {
                auxiliarTable = '<table><thead><tr><th>N°</th><th>Produto</th><th>NCM</th><th>EMB</th><th>Qnt</th><th>Vlr Unt.</th><th>Valor Total</th></tr></thead><tbody>';
                for (i = 0; i < produtos.length; i++) {
                    auxiliarTable += `<tr><td>${i+1}</td><td>${produtos[i].xProd}</td><td>${produtos[i].NCM}</td><td>${produtos[i].uCom}</td><td>${produtos[i].qCom}</td><td>${produtos[i].vUnCom}</td><td>${produtos[i].vProd}</td></tr>`;
                }
                auxiliarTable += '</tbody></table>';
                hasData = true;
            } else {
                auxiliar = 'Não há produtos disponíveis.';
            }
            break;
    
        case "InfoIpiProdsButton":
            if (produtos && produtos.length > 0) {
                auxiliarTable = '<table><thead><tr><th>N°</th><th>Produto</th><th>Base IPI</th><th>Alíquota IPI</th><th>Valor IPI</th></tr></thead><tbody>';
                for (i = 0; i < produtos.length; i++) {
                    if (produtos[i].impostos && produtos[i].impostos.IPI) {
                        const ipiData = produtos[i].impostos.IPI;
                        if (ipiData.vIPI != null) {
                            auxiliarTable += `<tr><td>${i+1}</td><td>${produtos[i].xProd}</td><td>${ipiData.vBC}</td><td>${ipiData.pIPI}</td><td>${ipiData.vIPI}</td></tr>`;
                            hasData = true;
                        }
                    }
                }
                auxiliarTable += '</tbody></table>';
            } else {
                auxiliar = 'Não há produtos disponíveis.';
            }
            break;
    
            case "infoIcmsProdsButton":
                if (produtos && produtos.length > 0) {
                    auxiliarTable = '<table><thead><tr><th>N°</th><th>Produto</th><th>Base ICMS</th><th>Alíquota ICMS</th><th>Valor ICMS</th><th>Valor produto</th></tr></thead><tbody>';
                    for (let i = 0; i < produtos.length; i++) {
                        if (produtos[i].impostos && produtos[i].impostos.ICMS) {
                            const icmsData = produtos[i].impostos.ICMS;
                            if (icmsData.vICMS != null && icmsData.vBC != null) {
                                const vBC = parseFloat(icmsData.vBC.replace(',', '.')) || 0;
                                const vProd = parseFloat(produtos[i].vProd.replace(',', '.')) || 0;
                                const valorProduto = (vProd - vBC).toFixed(2).replace('.', ',');
                                auxiliarTable += `<tr><td>${i+1}</td><td>${produtos[i].xProd}</td><td>${icmsData.vBC}</td><td>${icmsData.pICMS}</td><td>${parseFloat(icmsData.vICMS).toFixed(2).replace('.', ',')}</td><td>R$ ${valorProduto}</td></tr>`;
                                hasData = true;
                            }
                        }
                    }
                    auxiliarTable += '</tbody></table>';
                } else {
                    auxiliar = 'Não há produtos disponíveis.';
                }
                break;
            
        case "infoIcmsStProdsButton":
            if (produtos && produtos.length > 0) {
                auxiliarTable = '<table><thead><tr><th>N°</th><th>Produto</th><th>Base ICMS ST</th><th>% ICMS ST</th><th>Valor ICMS ST</th></tr></thead><tbody>';
                for (i = 0; i < produtos.length; i++) {
                    if (produtos[i].impostos && produtos[i].impostos.ICMS && produtos[i].impostos.ICMS.vICMSST != null) {
                        const icmsSTData = produtos[i].impostos.ICMS;
                        auxiliarTable += `<tr><td>${i+1}</td><td>${produtos[i].xProd}</td><td>${icmsSTData.vBCST}</td><td>${icmsSTData.pICMSST}</td><td>${icmsSTData.vICMSST}</td></tr>`;
                        hasData = true;
                    }
                }
                auxiliarTable += '</tbody></table>';
            } else {
                auxiliar = 'Não há produtos disponíveis.';
            }
            break;
    
        case "infoPisButton":
            if (produtos && produtos.length > 0) {
                auxiliarTable = '<table><thead><tr><th>N°</th><th>Produto</th><th>Base PIS</th><th>Alíquota PIS</th><th>Valor PIS</th></tr></thead><tbody>';
                for (i = 0; i < produtos.length; i++) {
                    if (produtos[i].impostos && produtos[i].impostos.PIS) {
                        const pisData = produtos[i].impostos.PIS;
                        if (pisData.vPIS != null) {
                            auxiliarTable += `<tr><td>${i+1}</td><td>${produtos[i].xProd}</td><td>${pisData.vBC}</td><td>${pisData.pPIS}</td><td>${pisData.vPIS}</td></tr>`;
                            hasData = true;
                        }
                    }
                }
                auxiliarTable += '</tbody></table>';
            } else {
                auxiliar = 'Não há produtos disponíveis.';
            }
            break;
    
        case "infoCofinsButton":
            if (produtos && produtos.length > 0) {
                auxiliarTable = '<table><thead><tr><th>N°</th><th>Produto</th><th>Base COFINS</th><th>Alíquota COFINS</th><th>Valor COFINS</th></tr></thead><tbody>';
                for (i = 0; i < produtos.length; i++) {
                    if (produtos[i].impostos && produtos[i].impostos.COFINS) {
                        const cofinsData = produtos[i].impostos.COFINS;
                        if (cofinsData.vCOFINS != null) {
                            auxiliarTable += `<tr><td>${i+1}</td><td>${produtos[i].xProd}</td><td>${cofinsData.vBC}</td><td>${cofinsData.pCOFINS}</td><td>${cofinsData.vCOFINS}</td></tr>`;
                            hasData = true;
                        }
                    }
                }
                auxiliarTable += '</tbody></table>';
            } else {
                auxiliar = 'Não há produtos disponíveis.';
            }
            break;
    
        case "infoFcpButton":
            if (produtos && produtos.length > 0) {
                auxiliarTable = '<table><thead><tr><th>N°</th><th>Produto</th><th>Base FCP</th><th>Alíquota FCP</th><th>Valor FCP</th></tr></thead><tbody>';
                for (i = 0; i < produtos.length; i++) {
                    if (produtos[i].impostos && produtos[i].impostos.ICMS) {
                        const fcpData = produtos[i].impostos.ICMS;
                        if (fcpData.vFCP != null) {
                            auxiliarTable += `<tr><td>${i + 1}</td><td>${produtos[i].xProd}</td><td>${fcpData.vBC}</td><td>${fcpData.pFCP}</td><td>${fcpData.vFCP}</td></tr>`;
                            hasData = true;
                        }
                    }
                }
                auxiliarTable += '</tbody></table>';
            } else {
                auxiliar = 'Não há produtos disponíveis.';
            }
            break;
    
        case "infoFcpStButton":
            if (produtos && produtos.length > 0) {
                auxiliarTable = '<table><thead><tr><th>N°</th><th>Produto</th><th>Base FCP ST</th><th>Alíquota FCP ST</th><th>Valor FCP ST</th></tr></thead><tbody>';
                for (i = 0; i < produtos.length; i++) {
                    if (produtos[i].impostos && produtos[i].impostos.ICMS) {
                        const fcpSTData = produtos[i].impostos.ICMS;
                        if (fcpSTData.vFCPST != null) {
                            auxiliarTable += `<tr><td>${i + 1}</td><td>${produtos[i].xProd}</td><td>${fcpSTData.vBCFCPST}</td><td>${fcpSTData.vBCFCPST}</td><td>${fcpSTData.vFCPST}</td></tr>`;
                            hasData = true;
                        }
                    }
                }
                auxiliarTable += '</tbody></table>';
            } else {
                auxiliar = 'Não há produtos disponíveis.';
            }
            break;
    
        default:
            auxiliar = 'Selecione uma opção válida.';
            break;
    }

    if (hasData) {
        tableAux.innerHTML = auxiliarTable;
        infoArea.style.display = 'none';
        tableAux.style.display = 'table';
        infoArea.scrollIntoView({ behavior: 'smooth'});
        ajustarAlturaTextArea(infoArea);
    } else {
        alert('Nenhuma informação a ser exibida');
    }
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

    return {
        emitente,
        destinatario,
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
            const qCom = parseFloat(prodElement.getElementsByTagNameNS(namespace, 'qCom')[0]?.textContent.replace(',', '.') || '0').toFixed(2).replace('.', ',');
            const vUnCom = parseFloat(prodElement.getElementsByTagNameNS(namespace, 'vUnCom')[0]?.textContent.replace(',', '.') || '0').toFixed(2).replace('.', ',');
            const vProd = parseFloat(prodElement.getElementsByTagNameNS(namespace, 'vProd')[0]?.textContent.replace(',', '.') || '0').toFixed(2).replace('.', ',');
            const cEANTrib = prodElement.getElementsByTagNameNS(namespace, 'cEANTrib')[0]?.textContent || 'Não encontrado';
            const uTrib = prodElement.getElementsByTagNameNS(namespace, 'uTrib')[0]?.textContent || 'Não encontrado';
            const qTrib = parseFloat(prodElement.getElementsByTagNameNS(namespace, 'qTrib')[0]?.textContent.replace(',', '.') || '0').toFixed(2).replace('.', ',');
            const vUnTrib = parseFloat(prodElement.getElementsByTagNameNS(namespace, 'vUnTrib')[0]?.textContent.replace(',', '.') || '0').toFixed(2).replace('.', ',');
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
    if (ICMS.children.length === 0) {
        return {};
    }

    const icmsType = ICMS.children[0].nodeName;
    const icmsNode = ICMS.children[0];

    return {
        type: icmsType,
        orig: icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'orig')[0]?.textContent ?? 'Não disponível',
        CST: icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'CST')[0]?.textContent ?? 'Não disponível',
        modBC: icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'modBC')[0]?.textContent ?? null,
        vBC: icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'vBC')[0]?.textContent != null ? parseFloat(icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'vBC')[0]?.textContent.replace(',', '.')).toFixed(2).replace('.', ',') : null,
        pICMS: icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'pICMS')[0]?.textContent != null ? parseFloat(icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'pICMS')[0]?.textContent.replace(',', '.')).toFixed(2).replace('.', ',') : null,
        vICMS: icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'vICMS')[0]?.textContent != null ? parseFloat(icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'vICMS')[0]?.textContent.replace(',', '.')).toFixed(2).replace('.', ',') : null,
        vBCST: icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'vBCST')[0]?.textContent != null ? parseFloat(icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'vBCST')[0]?.textContent.replace(',', '.')).toFixed(2).replace('.', ',') : null,
        pICMSST: icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'pICMSST')[0]?.textContent != null ? parseFloat(icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'pICMSST')[0]?.textContent.replace(',', '.')).toFixed(2).replace('.', ',') : null,
        vICMSST: icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'vICMSST')[0]?.textContent != null ? parseFloat(icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'vICMSST')[0]?.textContent.replace(',', '.')).toFixed(2).replace('.', ',') : null,
        vBCFCP: icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'vFCP')[0]?.textContent != null ? parseFloat(icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'vFCP')[0]?.textContent.replace(',', '.')).toFixed(2).replace('.', ',') : null,
        vFCPST: icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'vFCPST')[0]?.textContent != null ? parseFloat(icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'vFCPST')[0]?.textContent.replace(',', '.')).toFixed(2).replace('.', ',') : null,
        pFCP: icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'pFCP')[0]?.textContent != null ? parseFloat(icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'pFCP')[0]?.textContent.replace(',', '.')).toFixed(2).replace('.', ',') : null,
        pFCPST: icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'pFCPST')[0]?.textContent != null ? parseFloat(icmsNode.getElementsByTagNameNS(ICMS.namespaceURI, 'pFCPST')[0]?.textContent.replace(',', '.')).toFixed(2).replace('.', ',') : null
    };
}

function extractIPIData(IPI) {
    const ipiTrib = IPI.getElementsByTagNameNS(IPI.namespaceURI, 'IPITrib')[0];
    return {
        cEnq: IPI.getElementsByTagNameNS(IPI.namespaceURI, 'cEnq')[0]?.textContent ?? 'Não disponível',
        vBC: ipiTrib?.getElementsByTagNameNS(IPI.namespaceURI, 'vBC')[0]?.textContent != null ? parseFloat(ipiTrib.getElementsByTagNameNS(IPI.namespaceURI, 'vBC')[0]?.textContent.replace(',', '.')).toFixed(2).replace('.', ',') : null,
        pIPI: ipiTrib?.getElementsByTagNameNS(IPI.namespaceURI, 'pIPI')[0]?.textContent != null ? parseFloat(ipiTrib.getElementsByTagNameNS(IPI.namespaceURI, 'pIPI')[0]?.textContent.replace(',', '.')).toFixed(2).replace('.', ',') : null,
        vIPI: ipiTrib?.getElementsByTagNameNS(IPI.namespaceURI, 'vIPI')[0]?.textContent != null ? parseFloat(ipiTrib.getElementsByTagNameNS(IPI.namespaceURI, 'vIPI')[0]?.textContent.replace(',', '.')).toFixed(2).replace('.', ',') : null
    };
}

function extractPISData(PIS) {
    const pisAliq = PIS.getElementsByTagNameNS(PIS.namespaceURI, 'PISAliq')[0];
    return {
        CST: pisAliq?.getElementsByTagNameNS(PIS.namespaceURI, 'CST')[0]?.textContent ?? 'Não disponível',
        vBC: pisAliq?.getElementsByTagNameNS(PIS.namespaceURI, 'vBC')[0]?.textContent != null ? parseFloat(pisAliq.getElementsByTagNameNS(PIS.namespaceURI, 'vBC')[0]?.textContent.replace(',', '.')).toFixed(2).replace('.', ',') : null,
        pPIS: pisAliq?.getElementsByTagNameNS(PIS.namespaceURI, 'pPIS')[0]?.textContent != null ? parseFloat(pisAliq.getElementsByTagNameNS(PIS.namespaceURI, 'pPIS')[0]?.textContent.replace(',', '.')).toFixed(2).replace('.', ',') : null,
        vPIS: pisAliq?.getElementsByTagNameNS(PIS.namespaceURI, 'vPIS')[0]?.textContent != null ? parseFloat(pisAliq.getElementsByTagNameNS(PIS.namespaceURI, 'vPIS')[0]?.textContent.replace(',', '.')).toFixed(2).replace('.', ',') : null
    };
}

function extractCOFNSData(COFINS) {
    const cofinsAliq = COFINS.getElementsByTagNameNS(COFINS.namespaceURI, 'COFINSAliq')[0];
    return {
        CST: cofinsAliq?.getElementsByTagNameNS(COFINS.namespaceURI, 'CST')[0]?.textContent ?? 'Não disponível',
        vBC: cofinsAliq?.getElementsByTagNameNS(COFINS.namespaceURI, 'vBC')[0]?.textContent != null ? parseFloat(cofinsAliq.getElementsByTagNameNS(COFINS.namespaceURI, 'vBC')[0]?.textContent.replace(',', '.')).toFixed(2).replace('.', ',') : null,
        pCOFINS: cofinsAliq?.getElementsByTagNameNS(COFINS.namespaceURI, 'pCOFINS')[0]?.textContent != null ? parseFloat(cofinsAliq.getElementsByTagNameNS(COFINS.namespaceURI, 'pCOFINS')[0]?.textContent.replace(',', '.')).toFixed(2).replace('.', ',') : null,
        vCOFINS: cofinsAliq?.getElementsByTagNameNS(COFINS.namespaceURI, 'vCOFINS')[0]?.textContent != null ? parseFloat(cofinsAliq.getElementsByTagNameNS(COFINS.namespaceURI, 'vCOFINS')[0]?.textContent.replace(',', '.')).toFixed(2).replace('.', ',') : null
    };
}