// import Link from 'next/link'
// import React from 'react'

// export default function NavBar() {
//   return (
//     <nav className="flex justify-between bg-yellow-400 px-8 py-3">
//       <Link className="text-white font-bold" href='/admin'>Category Name</Link>
//       <Link className="bg-white p-2" href='/addCategory'>Add Category</Link> 
//     </nav>
//   );
// }

import Link from 'next/link'
import React from 'react'

export default function NavBar() {
  return (
    <nav className='flex justify-between items-center bg-yellow-400 px-8 py-4'>
      <Link
        className="text-white font-bold"
        href="/admin">Caegories</Link>
      <Link
        className="bg-white p-2 border rounded-lg"
        href="/admin/addCategory">Add Category</Link>
    </nav>
  )
}

