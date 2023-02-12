export const handleMascararReal = (event, setValue) => {
    let inputValue = event.target.value;

    // Remove tudo que não for número
    let onlyNumbers = inputValue.replace(/[^\d]+/g, "");

    // Se o valor for maior que 999 milhões, não atualiza o estado
    if (onlyNumbers.length > 11) {
        return;
    }

    // Adiciona a vírgula separando os centavos
    let maskedValue = onlyNumbers;
    if (onlyNumbers.length >= 2) {
        maskedValue = onlyNumbers.slice(0, -2) + "," + onlyNumbers.slice(-2);
    }

    // Adiciona os pontos separando os milhares
    let numberOfPoints = Math.floor(onlyNumbers.length / 3);
    for (let i = 1; i <= numberOfPoints; i++) {
        maskedValue = maskedValue.replace(/^(\d+)(\d{3})/, "$1.$2");
    }

    setValue(maskedValue);
};

export const brlToFloat = (brl) => {
    // Remove pontos e vírgulas
    let onlyNumbers = brl.replace(/[^\d]+/g, "");
    // Verifica se há apenas 2 números no final da string
    if (onlyNumbers.length % 100 === 2) {
        // Se sim, adiciona dois zeros no final
        onlyNumbers = onlyNumbers + "00";
    }
    // Converte para float
    return parseFloat(onlyNumbers) / 100;
};

export const floatToBrl = (str) => {
    return parseFloat(str).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}).replace('R$', '').trim();
};
