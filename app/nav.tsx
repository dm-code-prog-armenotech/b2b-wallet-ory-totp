import Navbar from './navbar';

interface Session {
  user: {
    name: string;
    image: string
  };
}

export default async function Nav() {
  const session: Session = {
    user: {
      name: 'Mitya',
      image: ''
    }
  };
  return <Navbar user={session?.user} />;
}
