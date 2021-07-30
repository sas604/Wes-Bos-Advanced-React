import Link from 'next/link';
import PropTypes from 'prop-types';
import Item from './styles/ItemStyles';
import Title from './styles/Title';
import PriceTag from './styles/PriceTag';

export default function Product({ product }) {
  return (
    <Item>
      <img src={product.photo?.image.publicUrlTransformed} alt={product.name} />
      <Title>
        <Link href={`/products/${product.id}`}>{product.name}</Link>
      </Title>
      {product.name}
      <PriceTag>{product.price}</PriceTag>
    </Item>
  );
}

Product.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string,
    photo: PropTypes.object,
    id: PropTypes.string,
    price: PropTypes.number,
  }),
};
