import { useUser } from './User';
import SingIn from './SingIn';

export default function ({ children }) {
  const me = useUser();
  if (!me) return <SingIn />;
  return children;
}
