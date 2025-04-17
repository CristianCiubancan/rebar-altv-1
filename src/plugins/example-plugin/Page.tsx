import React from 'react';

export default function Page() {
    return (
        <div className="p-4">
            <h1 className="mb-4 text-2xl font-bold">Example Plugin</h1>
            <p className="mb-4">This is a simple example plugin page with minimal styling.</p>
            <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
                Example Button
            </button>
        </div>
    );
}
