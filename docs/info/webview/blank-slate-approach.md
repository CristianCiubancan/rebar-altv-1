# Blank Slate Approach

The Rebar framework follows a "blank slate" approach for its webview implementation. This means that the framework provides minimal default UI components, giving plugin developers maximum flexibility to create their own UI designs.

## Benefits

The blank slate approach offers several benefits:

1. **Maximum Flexibility**: Plugin developers have complete freedom to design their UI without having to override or work around pre-existing components.
2. **Reduced Complexity**: The minimal starting point is easier to understand and modify.
3. **Custom Styling**: Developers can implement their own styling approach without conflicts.

## Available Components

While the framework follows a blank slate approach, it does provide a few utility components that can be useful for plugin development:

### MinimalLayout

A minimal layout component that provides only the basic structure needed for the webview:

```tsx
import MinimalLayout from '../../components/MinimalLayout.tsx';

// In your Astro component
<MinimalLayout>
  <YourContent />
</MinimalLayout>
```

### Draggable

A utility component for creating draggable UI elements, useful for inventory systems and other drag-and-drop interfaces:

```tsx
import Draggable from '../../components/Draggable.tsx';

// In your React component
<Draggable
  onDrag={(fromId, toId) => console.log(`Dragged from ${fromId} to ${toId}`)}
  onLeftClick={(id) => console.log(`Clicked on ${id}`)}
>
  <div id="draggable-item" className="bg-blue-500 p-4">
    Drag me!
  </div>
</Draggable>
```

## Creating Your Own UI

With the blank slate approach, you're encouraged to create your own UI components that fit your specific needs. You can use any React components or libraries that are compatible with Astro.

Here's a simple example of a custom UI component:

```tsx
// src/plugins/your-plugin/components/CustomUI.tsx
import React from 'react';

export default function CustomUI() {
  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Your Custom UI</h1>
      <p>Build your UI exactly how you want it!</p>
    </div>
  );
}
```

Then use it in your plugin's Page component:

```tsx
// src/plugins/your-plugin/Page.tsx
import React from 'react';
import CustomUI from './components/CustomUI';

export default function Page() {
  return (
    <div className="p-4">
      <CustomUI />
    </div>
  );
}
```

## Styling

The framework includes Tailwind CSS for styling, which works well with the blank slate approach as it allows for rapid UI development without writing custom CSS. You can use Tailwind classes directly in your components.

If you prefer a different styling approach, you're free to use CSS modules, styled-components, or any other styling solution that works with React and Astro.
