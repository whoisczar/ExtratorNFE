const input = document.querySelector('#fileInput');
const infoArea = document.querySelector('.infoText');
const infoTitle = document.querySelector('.Title');
const botaoInput = document.querySelector('.customButton');
const socialButton = document.querySelector('.socialIMG');


socialButton.addEventListener('click',function(){
    document.querySelector('.social').click();
})

botaoInput.addEventListener('click',function(){
    input.click();
})

input.addEventListener('change', function () {
    const arquivo = this.files[0];
    const leitor = new FileReader();

    leitor.addEventListener('load', function () {
        infoArea.value = leitor.result;
        ajustarAlturaTextArea(infoArea);
    })

    if (arquivo) {
        infoTitle.textContent = arquivo.name;
        leitor.readAsText(arquivo);
    } else {
        alert('Selecione um arquivo!');
    }
})

function ajustarAlturaTextArea(textarea) {
    textarea.style.height = 'auto'; // Reseta a altura para calcular o novo tamanho
    textarea.style.height = textarea.scrollHeight + 'px'; // Ajusta a altura para o scrollHeight
}



function extrairICMS(produto) {
    const icmsTags = ['ICMS00', 'ICMS10', 'ICMS20', 'ICMS30', 'ICMS40', 'ICMS51', 'ICMS60', 'ICMS70', 'ICMS90'];
    let icms = null;

    for (let tag of icmsTags) {
        icms = produto.getElementsByTagName(tag)[0];
        if (icms) break;
    }

    if (icms) {
        return {
            icmsProduto: parseFloat(icms.getElementsByTagName("vICMS")[0] ?.textContent || 0),
            aliquotaProduto: parseFloat(icms.getElementsByTagName("pICMS")[0] ?.textContent || 0),
            valorIcmsProduto: parseFloat(icms.getElementsByTagName("vICMS")[0] ?.textContent || 0)
        };
    } else {
        return {
            icmsProduto: 0,
            aliquotaProduto: 0,
            valorIcmsProduto: 0
        };
    }
}