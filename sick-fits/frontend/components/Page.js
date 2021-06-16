import PropTypes from 'prop-types';

export default function Page({ children }) {
  return (
    <div>
      <h2>Page component</h2>
      {children}
    </div>
  );
}
Page.propTypes = {
  children: PropTypes.oneOf([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.nodes),
  ]),
};
