import { useMutation } from '@apollo/client';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import gql from 'graphql-tag';
import { useRouter } from 'next/dist/client/router';
import nProgress from 'nprogress';
import { useState } from 'react';
import styled from 'styled-components';
import { useCart } from '../lib/cartState';
import SickButton from './styles/SickButton';
import { CURRENT_USER_QUERY } from './User';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: grid;
  gap: 1rem;
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    checkout(token: $token) {
      id
      charge
      total
      items {
        id
        name
      }
    }
  }
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { closeCart } = useCart();
  const [checkout, { error: graphQLError }] = useMutation(
    CREATE_ORDER_MUTATION,
    { refetchQueries: [{ query: CURRENT_USER_QUERY }] }
  );
  async function handleSubmit(e) {
    // 1. Stop the form from submiting
    e.preventDefault();
    setLoading(true);

    // 2. Start Page transition
    nProgress.start();
    // 3. Create the payment via stripe
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    // 4. Handle any errors from stripe
    if (error) {
      setError(error);
      nProgress.done();
      return;
    }
    // 5. Send the token to Keystone via custom mutation
    const order = await checkout({
      variables: { token: paymentMethod.id },
    }).catch((err) => {
      setLoading(false);
      nProgress.done();
    });
    if (!order) return;
    // 6. Change the page to view the order

    router.push({
      pathname: '/order',
      query: { id: order.data.checkout.id },
    });

    // 7. Close the cart
    closeCart();
    // 8. Turn the loader off
    setLoading(false);
    nProgress.done();
  }
  return (
    <CheckoutFormStyles onSubmit={handleSubmit}>
      <p>BOO</p>
      {error && <p>{error.message}</p>}
      {graphQLError && <p>{graphQLError.message}</p>}
      <CardElement />
      <SickButton>Checkout now</SickButton>
    </CheckoutFormStyles>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  );
}
