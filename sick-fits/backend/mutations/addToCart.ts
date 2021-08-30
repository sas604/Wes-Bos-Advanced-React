/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

export default async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  // Query the current user and see if they are signed in
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You mast be logged in to do this');
  }
  // Query the current user cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: sesh.itemId }, product: { id: productId } },
    resolveFields: 'id, quantity',
  });
  // Check if the current item exist in the cart icrement if true create new if false
  const [existindCartItem] = allCartItems;
  console.log(allCartItems);
  if (existindCartItem) {
    return await context.lists.CartItem.updateOne({
      id: existindCartItem.id,
      data: { quantity: existindCartItem.quantity + 1 },
    });
  }
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } },
    },
  });
}
