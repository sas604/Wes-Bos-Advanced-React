import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/dist/client/link';
import styled from 'styled-components';
import DisplayError from '../components/ErrorMessage';
import formatMoney from '../lib/formatMoney';
import OrderItemStyles from '../components/styles/OrderItemStyles';

const USER_ORDER_QUERY = gql`
  query USER_ORDER_QUERY {
    allOrders {
      total
      id
      charge
      user {
        id
      }
      items {
        id
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
const OrderUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 4rem;
`;

const countItems = (order) =>
  order.items.reduce((acc, item) => acc + item.quantity, 0);

export default function OrdersPage() {
  const { data, error, loading } = useQuery(USER_ORDER_QUERY);
  if (loading) return null;
  if (error) return <DisplayError error={error} />;
  const { allOrders } = data;

  return (
    <div>
      <Head>
        <title>Sick Fits - Order history</title>
      </Head>
      <h2>Your order history</h2>
      <OrderUl>
        {allOrders.map((order) => (
          <OrderItemStyles key={order.id}>
            <Link href={`/order?id=${order.id}`}>
              <a>
                <div className="order-meta">
                  <p>
                    {countItems(order)} Item{countItems(order) > 1 && 's'}
                  </p>
                  <p>
                    {order.items.length} Product{order.items.length > 1 && 's'}{' '}
                  </p>
                  <p>{formatMoney(order.total)}</p>
                </div>
                <div className="images">
                  {order.items.map((item) => (
                    <img
                      key={`image- ${item.id}`}
                      src={item?.photo?.image?.publicUrlTransformed}
                      alt={item.name}
                    />
                  ))}
                </div>
              </a>
            </Link>
          </OrderItemStyles>
        ))}
      </OrderUl>
    </div>
  );
}
