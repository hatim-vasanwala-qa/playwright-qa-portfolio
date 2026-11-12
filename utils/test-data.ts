import { faker } from '@faker-js/faker';
import type { CreateProductRequest } from '../api/types';
import type { CustomerDetails } from '../pages/CheckoutPage';

/** Generates realistic randomized checkout customer details via Faker. */
export function buildCustomerDetails(): CustomerDetails {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode('#####'),
  };
}

/** Generates a randomized product payload for API CRUD tests. */
export function buildProductPayload(): CreateProductRequest {
  return {
    title: `${faker.commerce.productAdjective()} ${faker.commerce.product()}`,
    description: faker.commerce.productDescription(),
    category: 'electronics',
    price: Number(faker.commerce.price({ min: 15, max: 499, dec: 2 })),
    stock: faker.number.int({ min: 5, max: 100 }),
    brand: faker.company.name(),
  };
}
