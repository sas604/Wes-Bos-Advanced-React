import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';

const RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION(
    $email: String!
    $password: String!
    $token: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      token: $token
      password: $password
    ) {
      code
      message
    }
  }
`;
export default function Reset({ token }) {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token,
  });

  const [reset, { loading, data, error }] = useMutation(RESET_MUTATION, {
    variables: inputs,
    // refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  const successfulError = data?.redeemUserPasswordResetToken?.code
    ? data?.redeemUserPasswordResetToken
    : undefined;
  async function handleSubmit(e) {
    e.preventDefault();
    // Send the email and the password to the graphQL API
    await reset().catch(console.error);
    resetForm();
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Reset your Password</h2>
      <DisplayError error={error || successfulError} />
      <fieldset>
        {data?.redeemUserPasswordResetToken === null && <p>Success!</p>}
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
            // onchange
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="Type your password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
            // onchange
            // value
            // onchange
          />
        </label>

        <button type="submit">Reset</button>
      </fieldset>
    </Form>
  );
}
Reset.propTypes = {
  token: PropTypes.string,
};
