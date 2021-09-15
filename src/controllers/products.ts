import { Request, Response } from 'express';
import Product from '../models/products';

export class ProductsController {
  private readonly _product = Product;
  public async get(request: Request, response: Response): Promise<void> {
    try {
      const products = await this._product.find({});
      response.send(products);
    } catch (error) {
      response.status(400).send((error as Error).message);
    }
  }

  public async getById(request: Request, response: Response): Promise<void> {
    try {
      const {
        params: { id },
      } = request;
      const product = await this._product.findOne({ _id: id });
      response.send(product);
    } catch (error) {
      response.status(400).send((error as Error).message);
    }
  }

  public async create(request: Request, response: Response): Promise<void> {
    try {
      const product = await this._product.create(request.body);
      response.status(201);
      response.send(product);
    } catch (error) {
      response.status(422).send((error as Error).message);
    }
  }

  public async update(request: Request, response: Response): Promise<void> {
    try {
      const {
        body,
        params: { id },
      } = request;

      await this._product.updateOne({ _id: id }, body);
      response.status(200).send();
    } catch (error) {
      response.status(422).send((error as Error).message);
    }
  }

  public async remove(request: Request, response: Response): Promise<void> {
    try {
      const {
        params: { id },
      } = request;
      await this._product.deleteOne({ _id: id });
      response.status(204).send();
    } catch (error) {
      response.status(400).send((error as Error).message);
    }
  }
}
