import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import CategoryList from './components/CategoryList';

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return (
      <div>
        <h2>Admin page - welcome back {session.user.username}</h2>
        <CategoryList />
      </div>
    );
  }

  return <h2>Please login to see this admin page</h2>;
};

export default Page;
