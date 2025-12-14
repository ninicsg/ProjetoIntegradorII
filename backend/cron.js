import cron from 'node-cron';
import { Agendamento, Usuario, Tratamento, Cliente } from './models/index.js';
import { Op } from 'sequelize';
console.log('⏰ Cron de agendamentos carregado');

// todo dia as 21:30 roda
cron.schedule('30 21 * * *', async () => {
    console.log('Rodando job de agendas...');

    const agendas = await Agendamento.findAll({
        where: {
            status: 'marcado',
            data: { [Op.lt]: new Date() }
        },
        include: [{
            model: Tratamento,
            as: 'tratamento',
            attributes: ['preco']
        }]
    });

    for (const agenda of agendas) {
         const preco = Number(agenda.tratamento.preco);
        const pontos = Math.floor(preco); // 1 ponto por real

        await Cliente.increment(
            { pontos_fidelidade: pontos },
            { where: { id_usuario: agenda.id_cliente } }
        );

        await agenda.update({ status: 'realizado' });
    }

    await Agendamento.update(
        { status: 'cancelado' },
        {
            where: {
                status: 'agendado',
                data: { [Op.lt]: new Date() }
            }
        }
    );

});
