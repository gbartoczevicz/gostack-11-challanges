import { getCustomRepository, getRepository } from 'typeorm';

// import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepostiory = getRepository(Category);

    if (type === 'outcome') {
      const { total } = await transactionsRepository.getBalance();

      if (total < value) {
        throw new AppError('You do not have enough balance');
      }
    }

    let categoryModel = await categoriesRepostiory.findOne({
      where: {
        title: category,
      },
    });

    if (!categoryModel) {
      categoryModel = categoriesRepostiory.create({
        title: category,
      });

      await categoriesRepostiory.save(categoryModel);
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id: categoryModel.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
