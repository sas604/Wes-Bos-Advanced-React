import styled from 'styled-components';
import RequestReset from '../components/RequestReset';
import SingIn from '../components/SingIn';
import SignUp from '../components/SingUp';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

export default function SignInPage() {
  return (
    <Grid>
      <SingIn />
      <SignUp />
      <RequestReset />
    </Grid>
  );
}
