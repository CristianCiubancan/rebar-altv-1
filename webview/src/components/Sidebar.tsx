import React from 'react';
import { pluginPages } from '../data/pluginPages';
import '../index.css';

export default function Sidebar() {
    return (
        <aside className="w-64 bg-gray-800 p-4 text-white">
            <h2 className="mb-4 text-lg font-bold">Plugins</h2>
            <ul className="space-y-2">
                {pluginPages.map((page) => (
                    <li key={page} className="rounded p-2 hover:bg-gray-700">
                        {page}
                    </li>
                ))}
            </ul>
        </aside>
    );
}
