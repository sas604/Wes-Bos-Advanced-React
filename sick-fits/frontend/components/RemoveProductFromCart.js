import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const RemoveBtn = styled.button`
  background: none;
  border: 0;
  padding: 1rem;
  cursor: pointer;
`;
const DELETE_CART_ITEM_MUTATION = gql`
  mutation DELETE_CART_ITEM_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;
function update(cache, payload) {
  cache.evict({ id: cache.identify(payload.data.deleteCartItem) });
}

export default function RemoveProductFromCart({ id }) {
  const [deleteProduct, { loading }] = useMutation(DELETE_CART_ITEM_MUTATION, {
    variables: { id },
    update,
    // optimisticResponse: {
    //   deleteCartItem: {
    //     __typename: 'CartItem',
    //     id,
    //   },
    // },
  });
  return (
    <RemoveBtn
      type="button"
      disabled={loading}
      onClick={() => {
        deleteProduct().catch((err) => alert(err.message));
      }}
    >
      ❌
    </RemoveBtn>
  );
}

RemoveProductFromCart.propTypes = {
  id: PropTypes.string,
};
