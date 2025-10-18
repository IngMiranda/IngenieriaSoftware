const reservaService = require('../services/reservaService');
const validatorUtil = require('../utils/ValidatorUtil');
const Logger = require('../utils/Logger');

exports.getReservas = async (req, res) => {
    const { companyId, selectDate } = req.params;

    if (!companyId || !selectDate) {
        Logger.warn('companyId or selectDate missing in request parameters');
        return res.status(400).json({ message: 'companyId and selectDate are required' });
    }

    if (!validatorUtil.isValidDate(selectDate)) {
        Logger.warn('Invalid date format for selectDate');
        return res.status(400).json({ message: 'Invalid date format. Expected YYYY-MM-DD' });
    }

    if (!validatorUtil.isNumber(Number(companyId))) {
        Logger.warn('Invalid companyId format');
        return res.status(400).json({ message: 'Invalid companyId format' });
    }

    try {
        const reservas = await reservaService.getReservas(companyId, selectDate);
        res.status(200).json({ reservas });
    } catch (error) {
        Logger.error(`Error fetching reservas: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }

}


exports.getReservasByUser = async (req, res) => {
    const { companyId, selectDate } = req.params;
    const userId = req.user.id; // si se verifico, esta informacion debe venir en el JWT

    if (!userId) {
        Logger.warn('User not authenticated');
        return res.status(401).json({ message: 'Authentication required' });
    }

    if (!companyId || !selectDate) {
        Logger.warn('companyId or selectDate missing in request parameters');
        return res.status(400).json({ message: 'companyId and selectDate are required' });
    }

    if (!validatorUtil.isValidDate(selectDate)) {
        Logger.warn('Invalid date format for selectDate');
        return res.status(400).json({ message: 'Invalid date format. Expected YYYY-MM-DD' });
    }

    try {
        const reservas = await reservaService.getReservas(companyId, selectDate, userId);
        res.status(200).json({ reservas });
    } catch (error) {
        Logger.error(`Error fetching reservas for user ${userId}: ${error.message}`);
        res.status(500).json({ message: 'Internal server error' });
    }

};