const Transaction = artifacts.require("Transaction");

module.exports = async function(callback) {
    try {
        const accounts = await web3.eth.getAccounts();
        const transaction = await Transaction.deployed();

        // Obtém o saldo do endereço do comprador
        const buyerAddress = await transaction.buyerAddress();
        const balance = await transaction.getAddressAccountValues();
        console.log(`Saldo do comprador (${buyerAddress}): ${web3.utils.fromWei(balance.toString(), 'ether')} ETH`);

        // Verifica se a conta do comprador está presente
        if (accounts[1] !== buyerAddress) {
            console.error(`A conta atual não é a conta do comprador (${buyerAddress}).`);
            callback();
            return;
        }

        // Envia ETH do comprador para o vendedor
        console.log('Enviando ETH...');
        await transaction.sendEther({ from: buyerAddress, value: web3.utils.toWei('2', 'ether') });
        console.log('ETH enviado com sucesso!');

        // Verifica o saldo novamente após a transação
        const updatedBalance = await transaction.getAddressAccountValues();
        console.log(`Saldo atualizado do comprador (${buyerAddress}): ${web3.utils.fromWei(updatedBalance.toString(), 'ether')} ETH`);
        
    } catch (error) {
        console.error(error);
    }
    callback();
};
