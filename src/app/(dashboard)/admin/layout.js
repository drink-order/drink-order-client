import React from 'react';
import SideNav from './components/SideNav';
import NavBar from './components/NavBar';

const AdminLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <SideNav style={{ width: '250px', flexShrink: 0 }} />
            <main style={{ flex: 1, padding: '20px', marginLeft: '250px' }}>
                <div style={{ maxWidth: '768px', marginLeft: 'auto', marginRight: 'auto', padding: '25px'}}>
                    <NavBar />
                    <div className="mt-5">{children}</div>
                </div>
            </main>
            
           
        </div>
    );
};

export default AdminLayout;