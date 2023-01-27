const Picture = require("../models/Picture");

//Esta controller tem como objetivo controlar as ações da api, então é aqui que declaramos oque um GET, POST, PUT, DELETE faz,e assim ser chamado externamente pela VIEW.

const fs = require("fs");// fs(file system) é um modulo nativo do NodeJS para trabalhar com arquivos e tem vários métodos!

//Aqui estamos descrevendo o método POST que é o método http onde se cria novos dados!
exports.create = async (req, res) => {
    //O método create já diz ao node então que se trata de um método POST e ele recebe por padrão os parâmetros req(requisição) e res(resposta)
    // try catch é uma forma de criarmos um if(try) else(catch) porém voltado ao NodeJS e também com suporte a atividade assíncrona.
    try {
        //Ao declarar essa constante preenchemos o valor dela com o corpo da requisição, por isso utiliza essa forma de pegar os dados via json req.body.
        // observe que ao usar o nome da constante dentro de chaves isso a torna automaticamente é um objeto, fazendo então que os dados do objeto body seja passado para uma constante do mesmo tipo.
        const {name} = req.body
        //Aqui está constante está declarada diferente de um objeto porque o modelo de informação que vai chegar a ela, não será em forma de objeto da mesma forma que const telefone = req.body.telefone
        const file = req.file
        //A constatnte picture agora se torna uma instância de um objeto onde que Picture é um objeto exportado no começo deste arquivo.
        //Porém observe que essa nova instância esta recebendo duas constantes criadas aqui mesmo, a name e uma variável criada em tempo de execução src recebendo o path contido em file.path que é uma req.file
        const picture = new Picture({
            name,
            src: file.path,
        });
        //É um operador javascript que impede um trecho de código rodar até que satisfaça alguma condição, nesse caso antes de vir a resposta do json o código para no await e espera ele rodar o metodo save para assim ir para a próxima etapa.
        await picture.save();
        //Aqui então estamos mandando na res uma mensagem, utilizamos o json que é para definir oque vamos mandar na estrutura de objeto, então passamos picture que é a foto e tmbm uma msg cujo value é mensagem de salvamento da imagem.
        res.json({ picture, msg: "Imagem salva com sucesso!" });
    } catch (error) {
        //caso o bloco try não aconteça então a execução chega no catch(else) e manda alguma coisa no res que seria o status 500 e uma mensagem de erro!
        res.status(500).json({ message: "Erro ao salvar imagem." })
    }
};

exports.findAll = async (req, res) => {
    try {
        const pictures = await Picture.find();

        res.json(pictures);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar imagem." });
    }
};

exports.remove = async (req, res) => {
    try {

        const picture = await Picture.findById(req.params.id);

        if (!picture) {
            return res.status(404).json({ message: "Imagem não encontrada." });
        }

        fs.unlinkSync(picture.src); //Este método unlinkSync serve para desfazer o caminho de um arquivo dentro do projeto!

        await picture.remove();

        res.json({ message: "Imagem removida com sucesso!" });

    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir imagem." });
    }
}