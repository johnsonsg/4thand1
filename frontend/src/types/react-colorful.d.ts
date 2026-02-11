declare module "react-colorful" {
  import * as React from "react";

  export type HexColorPickerProps = {
    color: string;
    onChange: (color: string) => void;
  };

  export const HexColorPicker: React.FC<HexColorPickerProps>;
}
