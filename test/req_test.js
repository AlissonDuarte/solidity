const Required = artifacts.require("Required");
const truffleAssert = require('truffle-assertions');

contract("Required", (accounts) => {
    let contractInstance;
    const [hvgateway, buyer, seller] = accounts;
    const price = web3.utils.toWei("1", "ether");

    beforeEach(async () => {
        // Desdobra uma nova instância do contrato antes de cada teste
        contractInstance = await Required.new(buyer, seller, price, { from: hvgateway });
    });

    it("Deve confirmar a compra e transferir o valor para o vendedor e gateway", async () => {
        // Verifica o saldo inicial do comprador, vendedor e gateway
        const buyerInitialBalance = await web3.eth.getBalance(buyer);
        const sellerInitialBalance = await web3.eth.getBalance(seller);
        const hvgatewayInitialBalance = await web3.eth.getBalance(hvgateway);

        // Simula a confirmação da compra pelo comprador
        const result = await contractInstance.confimSell({ from: buyer, value: price });

        // Verifica se o evento foi emitido corretamente
        truffleAssert.eventEmitted(result, 'Transfer', (ev) => {
            return ev.from === buyer && ev.to === seller && ev.value.toString() === price;
        });

        // Verifica o saldo final do comprador, vendedor e gateway
        const buyerFinalBalance = await web3.eth.getBalance(buyer);
        const sellerFinalBalance = await web3.eth.getBalance(seller);
        const hvgatewayFinalBalance = await web3.eth.getBalance(hvgateway);

        // Calcula os valores esperados
        const expectedSellerValue = web3.utils.toBN(sellerInitialBalance).add(web3.utils.toBN((price * 98) / 100));
        const expectedHvgatewayValue = web3.utils.toBN(hvgatewayInitialBalance).add(web3.utils.toBN((price * 2) / 100));

        // Verifica se os saldos foram atualizados corretamente
        assert.equal(buyerFinalBalance, buyerInitialBalance - price, "Saldo do comprador incorreto");
        assert.equal(sellerFinalBalance.toString(), expectedSellerValue.toString(), "Saldo do vendedor incorreto");
        assert.equal(hvgatewayFinalBalance.toString(), expectedHvgatewayValue.toString(), "Saldo do gateway incorreto");
    });

    it("Deve falhar se não for o comprador confirmando a compra", async () => {
        await truffleAssert.reverts(
            contractInstance.confimSell({ from: seller, value: price }),
            "Only the buyer can confirm that operation"
        );
    });

    it("Deve falhar se o valor enviado for insuficiente", async () => {
        const insufficientValue = web3.utils.toWei("0.5", "ether");
        await truffleAssert.reverts(
            contractInstance.confimSell({ from: buyer, value: insufficientValue }),
            "Incorrect amount sent"
        );
    });
});
