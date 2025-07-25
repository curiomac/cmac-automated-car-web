import { ButtonProps } from "../@types/types";

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  style,
  className,
  type = "button",
  disabled,
}) => {
  return (
    <button
      type={type}
      className={`bg-primary h-[45px] text-sm px-4 rounded-sm text-secondary ${
        className ?? ""
      }`}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
