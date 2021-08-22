import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { perPage } from '../config';
import Product from './Product';

export const ALL_PRODUCT_QUERY = gql`
  query ALL_PRODUCTS_QUERY($skip: Int = 0, $first: Int) {
    allProducts(first: $first, skip: $skip) {
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

export default function Products({ page }) {
  const { data, error, loading } = useQuery(ALL_PRODUCT_QUERY, {
    variables: {
      skip: page * perPage - perPage,
      first: perPage,
    },
  });

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

Products.propTypes = {
  page: PropTypes.number,
};
