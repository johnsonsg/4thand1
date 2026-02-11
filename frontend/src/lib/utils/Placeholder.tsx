import * as React from 'react';
import { getComponent } from '@/lib/utils/componentFactory';
import type { ComponentRendering, RouteData } from '@/lib/types/cms';

type PlaceholderProps = {
  name: string;
  rendering: RouteData;
};

export default function Placeholder({ name, rendering }: PlaceholderProps) {
  const components = rendering.placeholders?.[name] ?? [];

  return (
    <>
      {components.map((component, index) => {
        const Component = getComponent(component.componentName);
        if (!Component) return null;

        const key = component.uid ?? `${component.componentName}-${index}`;
        return <Component key={key} rendering={component} />;
      })}
    </>
  );
}