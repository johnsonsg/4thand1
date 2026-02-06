export type Field<T> = {
  value: T;
};

export type ComponentRendering = {
  uid?: string;
  componentName: string;
  fields?: Record<string, Field<unknown>>;
  params?: Record<string, string>;
  placeholders?: Record<string, ComponentRendering[]>;
};

export type RouteData = {
  name?: string;
  displayName?: string;
  fields?: Record<string, Field<unknown>>;
  placeholders?: Record<string, ComponentRendering[]>;
};

export type CmsLayoutData = {
  cms: {
    context: Record<string, unknown>;
    route: RouteData | null;
  };
};
