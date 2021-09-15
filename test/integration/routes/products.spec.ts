import { IUser } from '../../../src/models/users';
import defaultRequest from '../global';
import Product from './../../../src/models/products';
import { AuthService } from './../../../src/services/auth.service';

describe('Routes: Products', () => {
  const expectedAdminUser = {
    name: 'Jhon Doe',
    email: 'jhon@mail.com',
    password: '123password',
    role: 'admin',
  } as IUser;

  const defaultProduct = {
    name: 'Default product',
    description: 'product description',
    price: 100,
  };

  const expectedProduct = {
    __v: 0,
    _id: '',
    ...defaultProduct,
  };

  let request: any;
  let authToken: any;
  beforeAll(async () => {
    request = await defaultRequest();
    const authService = new AuthService();
    const token = authService.generateToken(expectedAdminUser);
    authToken = { Authorization: `Bearer ${token}` };
  });

  beforeEach(async () => {
    await Product.deleteMany();
    const product = new Product(defaultProduct);
    expectedProduct._id = product._id;
    await product.save();
  });

  afterEach(async () => {
    await Product.deleteMany();
  });

  describe('GET /products', () => {
    describe('when getting products', () => {
      it('should return a list of products with status 200', async () => {
        const res = await request.get('/products').set(authToken);
        expect(res.statusCode).toEqual(200);
        const products = res.body;
        expect(products[0].name).toEqual(expectedProduct.name);
        expect(products[0].description).toEqual(expectedProduct.description);
        expect(products[0].price).toEqual(expectedProduct.price);
        expect(products[0]._id).toMatch(/^[a-fA-F0-9]{24}$/);
      });
    });

    describe('when an id is specified', () => {
      it('should return one product with status 200', async () => {
        const id = expectedProduct._id;
        const res = await request.get(`/products/${id}`).set(authToken);
        expect(res.statusCode).toEqual(200);
        const product = res.body;
        expect(product.name).toEqual(expectedProduct.name);
        expect(product.description).toEqual(expectedProduct.description);
        expect(product.price).toEqual(expectedProduct.price);
        expect(product._id).toMatch(/^[a-fA-F0-9]{24}$/);
      });
    });
  });

  describe('POST /products', () => {
    describe('when posting a product', () => {
      it('should return a new product with status 201', async () => {
        const newProduct = Object.assign({}, defaultProduct);
        const res = await request.post(`/products`).set(authToken).send(newProduct);
        expect(res.statusCode).toEqual(201);
        const expectedSavedProduct = res.body;
        expect(expectedSavedProduct.name).toEqual(newProduct.name);
        expect(expectedSavedProduct.description).toEqual(newProduct.description);
        expect(expectedSavedProduct.price).toEqual(newProduct.price);
        expect(expectedSavedProduct._id).toMatch(/^[a-fA-F0-9]{24}$/);
      });
    });
  });

  describe('PUT /products/:id', () => {
    describe('when editing a product', () => {
      it('should update the product and return 200 as status code', async () => {
        const customProduct = {
          name: 'Custom name',
        };
        const updateProduct = Object.assign({}, customProduct, defaultProduct);
        const id = expectedProduct._id;
        const res = await request.put(`/products/${id}`).set(authToken).send(updateProduct);
        expect(res.statusCode).toEqual(200);
      });
    });
  });

  describe('DELETE /products/:id', () => {
    describe('when deleting a product', () => {
      it('should delete a product and return 204 as status code', async () => {
        const id = expectedProduct._id;
        const res = await request.delete(`/products/${id}`).set(authToken);
        expect(res.statusCode).toEqual(204);
      });
    });
  });
});
