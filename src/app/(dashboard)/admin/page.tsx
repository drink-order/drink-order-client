// import { getServerSession } from "next-auth";
// import { authOptions } from "../../lib/auth";
// import SignOutButton from "../../components/SignOut";

// const Page = async () => {
//   const session = await getServerSession(authOptions);

//   if (session?.user) {
//     return (
//       <div>
//         <h2>Admin page - welcome back {session.user.username}</h2>
//         {/* <Dashboard /> */}
//         <SignOutButton />
//       </div>
//     );
//   }
//   // return <h2>Please login to see this admin page</h2>; 
// };

// export default Page;

import React from 'react'
import CategoryList from './components/CategoryList';

export default function() {
  return (
    <div>
      <CategoryList/>
    </div>
  );
}
