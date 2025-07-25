import { InputProps } from "../@types/types";

const Input: React.FC<InputProps> = ({
  value,
  placeholder,
  onChange,
  type = "text",
  maxLength,
  className,
  style,
  onKeyDown,
  rightIcon,
}) => {
  return (
    <div>
      <input
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        type={type}
        maxLength={maxLength}
        style={style}
        onKeyDown={() => onKeyDown && onKeyDown()}
        className={`border outline-none border-[#dedede] rounded-sm h-[50px] px-3 text-sm ${
          className ?? ""
        }`}
      />
      {rightIcon && <div className="h-0 flex justify-end z-10">{rightIcon()}</div>}
    </div>
  );
};

export default Input;
