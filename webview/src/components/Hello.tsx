import React from 'react';

interface HelloProps {}

export default function Hello(_props: HelloProps) {
  return (
    <div>
      <h1>Hello, World!</h1>
      <p>This is a React island rendered by Astro.</p>
    </div>
  );
}