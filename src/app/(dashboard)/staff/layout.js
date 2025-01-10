import React from 'react';
import SideBar from '../../components/SideBar';

const StaffLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <SideBar style={{ width: '250px', flexShrink: 0 }} />
            <main style={{ flex: 1, padding: '20px', marginLeft: '250px' }}>
                {children}
            </main>
        </div>
    );
};

export default StaffLayout;