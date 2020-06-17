import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function Login() {
  const history = useHistory();
  useEffect(() => {
    const searchParams = new URL(window.location).searchParams;
    const accessToken = searchParams.get('access_token');
    if (accessToken) {
      localStorage.setItem('GITHUB_ACCESS_TOKEN', accessToken);
    }
    console.log(accessToken);
    history.push('/');
  });

  return null;
}

export default Login;
