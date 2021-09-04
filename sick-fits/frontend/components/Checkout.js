import { CardElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import styled from 'styled-components';
import SickButton from './styles/SickButton';

const CheckoutFormStyles = styled.form`
  box-shadow: 0 1px 2px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: grid;
  gap: 1rem;
`;
const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
export default function Checkout() {
  function handleSubmit(e) {
    // 1. Stop the form from submiting
    // 2. Start Page transition
    // 3. Create the payment via stripe
    // 4. Handle any errors from stripe
    // 5. Send the token to Keystone via custom mutation
    // 6. Change the page to view the order
    // 7. Close the cart
    // 8. Turn the loader off
    e.preventDefault();
  }
  return (
    <Elements stripe={stripeLib}>
      <CheckoutFormStyles onSubmit={handleSubmit}>
        <p>BOO</p>
        <CardElement />
        <SickButton>Checkout now</SickButton>
      </CheckoutFormStyles>
    </Elements>
  );
}
