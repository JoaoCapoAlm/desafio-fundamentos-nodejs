import { Router } from 'express';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();
    const balance = transactionsRepository.getBalance();

    return response.json({ transactions, balance });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    const { title, value, type } = request.body;

    if (type !== 'outcome' && type !== 'income') {
      throw Error('Tipo incorreto! É aceito apenas outcome ou income.');
    }

    const createTransaction = new CreateTransactionService(
      transactionsRepository,
    );

    if (type === 'outcome') {
      const { total } = transactionsRepository.getBalance();
      if (value > total) {
        throw Error('Saldo insuficiente!');
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
