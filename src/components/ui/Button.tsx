import React from "react";
import { Button as CoreButton, ButtonProps } from "./index";

// Passthrough to the shared Button definition in ui/index.ts for consistency.
const Button: React.FC<ButtonProps> = (props) => <CoreButton {...props} />;

export type { ButtonProps };
export default Button;
