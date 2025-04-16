import React from 'react';
import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import '../index.css';

interface AppLayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="app-layout flex h-screen">
            <Sidebar />
            <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 overflow-auto p-4">{children}</main>
            </div>
        </div>
    );
}
