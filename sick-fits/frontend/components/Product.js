import Link from 'next/link';
import PropTypes from 'prop-types';
import Item from './styles/ItemStyles';
import Title from './styles/Title';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';

export default function Product({ product }) {
  return (
    <Item>
      <img src={product.photo?.image.publicUrlTransformed} alt={product.name} />
      <Title>
        <Link href={`/products/${product.id}`}>{product.name}</Link>
      </Title>
      {product.name}
      <PriceTag>{formatMoney(product.price)}</PriceTag>
      <p>{product.description}</p>
    </Item>
  );
}

Product.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string,
    photo: PropTypes.object,
    id: PropTypes.string,
    price: PropTypes.number,
    description: PropTypes.string,
  }),
};
