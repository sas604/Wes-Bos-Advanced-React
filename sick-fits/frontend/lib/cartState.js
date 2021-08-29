import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;
function CartStateProvider({ children }) {
  // This is our own custom provider we will store data(state) and functionality(updaters) in here and anyone can access it via consumer!

  const [cartOpen, setCartOpen] = useState(false);

  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  function closeCart() {
    setCartOpen(false);
  }

  function openCart() {
    setCartOpen(true);
  }

  return (
    <LocalStateProvider value={{ cartOpen, toggleCart, closeCart, openCart }}>
      {children}
    </LocalStateProvider>
  );
}

function useCart() {
  // use consumer to acces the local state
  const all = useContext(LocalStateContext);
  return all;
}

export { CartStateProvider, useCart };

CartStateProvider.propTypes = {
  children: PropTypes.node,
};
