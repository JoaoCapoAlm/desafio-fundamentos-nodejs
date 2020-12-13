import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    const transction = transactionsRepository.all();
    const ballance = transactionsRepository.getBalance();

    return response.json({ transction, ballance });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    const { title, value, type } = request.body;

    if (type !== 'outcome' && type !== 'income') {
      return response
        .status(400)
        .json({ error: 'Tipo incorreto! É aceito apenas outcome ou income.' });
    }

    const createTransaction = new CreateTransactionService(
      transactionsRepository,
    );

    if (type === 'outcome') {
      const { total } = transactionsRepository.getBalance();
      if (value > total) {
        return response.status(400).json({ error: 'Saldo insuficiente!' });
      }
    }

    const transaction = createTransaction.execute({
      title,
      value,
      type,
    });

    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
