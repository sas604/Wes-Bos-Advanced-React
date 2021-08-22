import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Product from './Product';

export const ALL_PRODUCT_QUERY = gql`
  query ALL_PRODUCTS_QUERY {
    allProducts {
      id
      name
      description
      price
      photo {
        id
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;
const ProductsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
`;

export default function Products() {
  const { data, error, loading } = useQuery(ALL_PRODUCT_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error {error}</p>;
  return (
    <div>
      <ProductsList>
        {data.allProducts.map((product) => (
          <Product product={product} key={product.id} />
        ))}
      </ProductsList>
    </div>
  );
}