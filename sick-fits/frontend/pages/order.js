import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import DisplayError from '../components/ErrorMessage';
import formatMoney from '../lib/formatMoney';
import OrderStyles from '../components/styles/OrderStyles';

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    Order(where: { id: $id }) {
      total
      id
      charge
      user {
        id
      }
      items {
        name
        price
        quantity
        description
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

export default function OrderPage({ query }) {
  const { data, error, loading } = useQuery(SINGLE_ORDER_QUERY, {
    variables: { id: query.id },
  });
  if (loading) return null;
  if (error) return <DisplayError error={error} />;
  const { Order } = data;
  const { items } = data?.Order;
  return (
    <>
      <OrderStyles>
        <Head>
          <title>Sick Fits - {Order.id}</title>
        </Head>
        <p>
          <span>Order id</span>
          <span>{Order.id}</span>
        </p>
        <p>
          <span>Charge</span>
          <span>{Order.charge}</span>
        </p>
        <p>
          <span>Order Total:</span>
          <span>{formatMoney(Order.total)}</span>
        </p>
        <p>
          <span>Item count:</span>
          <span>{items.length}</span>
        </p>
        <div className="items">
          {items.map((item, i) => (
            <div className="order-item" key={i}>
              <img
                src={item.photo.image.publicUrlTransformed}
                alt={item.name}
              />
              <div className="item-details">
                <h2>{item.name}</h2>
                <p>Qty: {item.quantity}</p>
                <p>Each: {formatMoney(item.price)}</p>
                <p>Sub Total: {formatMoney(item.price * item.quantity)}</p>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </OrderStyles>
    </>
  );
}

OrderPage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string,
  }),
};
