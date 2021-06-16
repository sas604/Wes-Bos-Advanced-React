import PropTypes from 'prop-types';
import Page from '../components/Page';

export default function MyApp({ Component, pageProps }) {
  return (
    <Page>
      <Component {...pageProps} />
    </Page>
  );
}

MyApp.propTypes = {
  Component: PropTypes.node,
  pageProps: PropTypes.oneOf([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.nodes),
  ]),
};
