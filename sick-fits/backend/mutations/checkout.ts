/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import {
  CartItemCreateInput,
  OrderCreateInput,
} from '../.keystone/schema-types';
import stripeConfig from '../lib/stripe';
const graphql = String.raw;
export default async function checkout(
  root: any,
  { token }: { token: string },
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // 1. Make sure user is signed in
  const userId = context.session.itemId;
  if (!userId) {
    throw new Error('Sorry you mast be signed in to create an order!');
  }
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
        id
        name
        email
        cart {
            id
            quantity
            product {
                name
                price
                description
                id
                photo {
                    id
                    image {
                        id
                        publicUrlTransformed
                    }
                }
            }
        }
        `,
  });
  // 2. Calculate the total price
  const cartItems = user.cart.filter((cartItem) => cartItem.product);
  const amount = cartItems.reduce(function (
    tally: number,
    cartItem: CartItemCreateInput
  ) {
    return tally + cartItem.quantity * cartItem.product.price;
  },
  0);
  console.log(amount);
  // 3. Create the payment with the Stripe library
  const charge = await stripeConfig.paymentIntents
    .create({
      amount,
      currency: 'USD',
      confirm: true,
      payment_method: token,
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err.message);
    });
  console.log(charge);
  // 4. Convert the cartItems to OrderItems
  const orderItems = cartItems.map((cartItem) => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: { id: cartItem.product.photo.id } },
    };
    return orderItem;
  });
  // 5. Create the Order and return it
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId } },
    },
  });
  // 6. Cleanup any old cart items
  const cartItemsIds = user.cart.map((cartItem) => cartItem.id);
  await context.lists.CartItem.deleteMany({ ids: cartItemsIds });

  return order;
}
