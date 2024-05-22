const input = document.querySelector('#fileInput');
const infoArea = document.querySelector('.infoText');
const infoTitle = document.querySelector('.Title');
const botaoInput = document.querySelector('.customButton');
const socialButton = document.querySelector('.socialIMG');

input.addEventListener('change', function () {
    const arquivo = this.files[0];
    const leitor = new FileReader();

    leitor.addEventListener('load', function () {
        infoArea.value = leitor.result;
        mudarVisibilidade(infoArea);
        ajustarAlturaTextArea(infoArea);
        fornecedorEmitente(leitor.result);
    })

    if (arquivo) {
        leitor.readAsText(arquivo);
    } else {
        alert('Selecione um arquivo!');
    }
})


function mudarVisibilidade(elemento) {
    if (elemento.style.display === 'none') {
        elemento.style.display = 'block';
    }
}

function extrairInformacoes(xmlDoc, tag, namespace) {
    const elementos = xmlDoc.getElementsByTagNameNS(namespace, tag);
    if (elementos.length > 0) {
        return {
            nome: elementos[0].getElementsByTagNameNS(namespace, 'xNome')[0] ?.textContent || 'NOME não disponível',
            cnpj: elementos[0].getElementsByTagNameNS(namespace, 'CNPJ')[0] ?.textContent || 'CNPJ não disponível'
        };
    }
    return {
        nome: 'Não encontrado',
        cnpj: 'Não encontrado'
    };
}

function fornecedorEmitente(xmlString) {
    const namespace = "http://www.portalfiscal.inf.br/nfe";
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

    // Extração das informações de emitente e destinatário usando a função auxiliar
    const emitente = extrairInformacoes(xmlDoc, 'emit', namespace);
    const destinatario = extrairInformacoes(xmlDoc, 'dest', namespace);

    // Extração da informação do número da NF
    const auxNumeroNF = xmlDoc.getElementsByTagNameNS(namespace, 'ide');
    let numeroNF = 'Não encontrado';
    if (auxNumeroNF.length > 0) {
        const nNFElement = auxNumeroNF[0].getElementsByTagNameNS(namespace, 'nNF')[0];
        if (nNFElement) {
            numeroNF = nNFElement.textContent;
        }
    }

    // Configurando a string HTML a ser colocada no elemento infoTitle
    infoTitle.innerHTML = `NF: ${numeroNF} <br> Emitente: ${emitente.nome}<br> CNPJ: ${emitente.cnpj} <br> Destinatário: ${destinatario.nome} <br> CNPJ: ${destinatario.cnpj}`;
}


function manipularXML(xmlString) {
}


socialButton.addEventListener('click', function () {
    document.querySelector('.social').click();
})

botaoInput.addEventListener('click', function () {
    input.click();
})

function ajustarAlturaTextArea(textarea) {
    textarea.style.height = 'auto'; // Reseta a altura para calcular o novo tamanho
    textarea.style.height = textarea.scrollHeight + 'px'; // Ajusta a altura para o scrollHeight
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