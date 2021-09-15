import { ProductsController } from './../../../src/controllers/products';
import Product, { IProduct } from './../../../src/models/products';

describe('Controllers: Products', () => {
  const defaultProduct = {
    name: 'Default product',
    description: 'product description',
    price: 100,
  } as unknown as IProduct;

  const defaultProducts = [defaultProduct];

  const defaultRequest: any = {
    params: {},
  };

  let productsController: ProductsController;
  beforeEach(() => {
    productsController = new ProductsController();
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
  });

  describe('get() products', () => {
    it('should return a list of products', async () => {
      const findSpy = jest.spyOn(Product, 'find').mockReturnValue(defaultProducts as any);
      const response: any = { send: jest.fn(), status: jest.fn() };
      const spy = jest.spyOn(response, 'send');

      await productsController.get(defaultRequest, response);

      expect(findSpy).toHaveBeenLastCalledWith({});
      findSpy.mockRestore();

      expect(spy).toHaveBeenCalled();
      expect(response.send).toHaveBeenCalledWith(defaultProducts);
      spy.mockRestore();
    });

    it('should return 400 when an error occurs', async () => {
      const findSpy = jest.spyOn(Product, 'find').mockRejectedValue({ message: 'Error' });
      const response: any = { send: jest.fn(), status: (code: number) => ({ send: jest.fn() }) };
      const spy = jest.spyOn(response, 'status');

      await productsController.get(defaultRequest, response);

      expect(findSpy).toHaveBeenLastCalledWith({});
      findSpy.mockRestore();

      expect(spy).toHaveBeenLastCalledWith(400);
      spy.mockRestore();
    });
  });

  describe('getById() product', () => {
    it('should return one product', async () => {
      const findSpy = jest.spyOn(Product, 'findOne').mockReturnValue(defaultProduct as any);
      const response: any = { send: jest.fn(), status: jest.fn() };
      const spy = jest.spyOn(response, 'send');
      const fakeId = 'a-fake-id';
      const request: any = {
        params: { id: fakeId },
      };

      await productsController.getById(request, response);

      expect(findSpy).toHaveBeenLastCalledWith({ _id: fakeId });
      findSpy.mockRestore();

      expect(spy).toHaveBeenLastCalledWith(defaultProduct);
      spy.mockRestore();
    });

    it('should return 400 when an error occurs', async () => {
      const findSpy = jest.spyOn(Product, 'findOne').mockRejectedValue({ message: 'Error' });
      const response: any = { send: jest.fn(), status: (code: number) => ({ send: jest.fn() }) };
      const spy = jest.spyOn(response, 'status');
      const fakeId = 'a-fake-id';
      const request: any = {
        params: { id: fakeId },
      };

      await productsController.getById(request, response);

      expect(findSpy).toHaveBeenLastCalledWith({ _id: fakeId });
      findSpy.mockRestore();

      expect(spy).toHaveBeenLastCalledWith(400);
      spy.mockRestore();
    });
  });

  describe('create() product', () => {
    it('should save a new product successfully', async () => {
      const findSpy = jest.spyOn(Product, 'create').mockReturnValue(defaultProduct as any);
      const response: any = { send: jest.fn(), status: jest.fn() };
      const spy = jest.spyOn(response, 'send');
      const request: any = {
        body: defaultProduct,
      };

      await productsController.create(request, response);

      expect(findSpy).toHaveBeenLastCalledWith(defaultProduct);
      findSpy.mockRestore();

      expect(spy).toHaveBeenLastCalledWith(defaultProduct);
      spy.mockRestore();
    });

    it('should return 422 when an error occurs', async () => {
      const findSpy = jest
        .spyOn(Product, 'create')
        .mockRejectedValue({ message: 'Error' } as never);
      const response: any = { send: jest.fn(), status: (code: number) => ({ send: jest.fn() }) };
      const spy = jest.spyOn(response, 'status');
      const request: any = {
        body: defaultProduct,
      };

      await productsController.create(request, response);

      expect(findSpy).toHaveBeenLastCalledWith(defaultProduct);
      findSpy.mockRestore();

      expect(spy).toHaveBeenLastCalledWith(422);
      spy.mockRestore();
    });
  });

  describe('update() product', () => {
    it('should respond with 200 when the product has been updated', async () => {
      const fakeId = 'a-fake-id';
      const updatedProduct = {
        _id: fakeId,
        name: 'Updated product',
        description: 'Updated description',
        price: 150,
      } as unknown as IProduct;
      const request: any = {
        params: {
          id: fakeId,
        },
        body: updatedProduct,
      };
      const findSpy = jest.spyOn(Product, 'updateOne').mockReturnValue(updatedProduct as any);
      const response: any = { status: (code: number) => ({ send: jest.fn() }) };
      const spy = jest.spyOn(response, 'status');

      await productsController.update(request, response);

      expect(findSpy).toHaveBeenLastCalledWith({ _id: fakeId }, updatedProduct);
      findSpy.mockRestore();

      expect(spy).toHaveBeenLastCalledWith(200);
      spy.mockRestore();
    });

    it('should return 422 when an error occurs', async () => {
      const fakeId = 'a-fake-id';
      const updatedProduct = {
        _id: fakeId,
        name: 'Updated product',
        description: 'Updated description',
        price: 150,
      } as unknown as IProduct;
      const request: any = {
        params: {
          id: fakeId,
        },
        body: updatedProduct,
      };
      jest.spyOn(Product, 'updateOne').mockRejectedValue({ message: 'Error' });

      const response: any = { status: (code: number) => ({ send: jest.fn() }) };
      const spy = jest.spyOn(response, 'status');

      await productsController.update(request, response);

      expect(spy).toHaveBeenLastCalledWith(422);
      spy.mockRestore();
    });
  });

  describe('delete() product', () => {
    it('should respond with 204 when the product has been deleted', async () => {
      const fakeId = 'a-fake-id';
      const findSpy = jest.spyOn(Product, 'deleteOne').mockReturnValue({} as any);
      const response: any = { status: (code: number) => ({ send: jest.fn() }) };
      const spy = jest.spyOn(response, 'status');
      const request: any = {
        params: {
          id: fakeId,
        },
      };

      await productsController.remove(request, response);

      expect(findSpy).toHaveBeenLastCalledWith({ _id: fakeId });
      findSpy.mockRestore();

      expect(spy).toHaveBeenLastCalledWith(204);
      spy.mockRestore();
    });

    it('should return 400 when an error occurs', async () => {
      const fakeId = 'a-fake-id';
      const request: any = {
        params: {
          id: fakeId,
        },
      };
      jest.spyOn(Product, 'deleteOne').mockRejectedValue({ message: 'Error' });

      const response: any = { status: (code: number) => ({ send: jest.fn() }) };
      const spy = jest.spyOn(response, 'status');

      await productsController.remove(request, response);

      expect(spy).toHaveBeenLastCalledWith(400);
      spy.mockRestore();
    });
  });
});
