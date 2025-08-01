import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from 'utils/styleUtilities';
import { FieldError, UseFormRegister, Path } from 'react-hook-form';

type ITextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  labelClassName?: string;
  inputClassName?: string;
  name?: Path<any>;
  register?: UseFormRegister<any>;
  error?: FieldError | undefined;
};

export interface useFormInput {
  name?: Path<any>;
  register?: UseFormRegister<any>;
  error?: FieldError | undefined;
}

const TextInput: React.FC<ITextInputProps> = ({
  className,
  label,
  labelClassName,
  inputClassName,
  name,
  register,
  error,
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={cn('relative h-11 w-full', className)}>
      <input
        {...props}
        {...register?.(name)}
        type={isPassword && showPassword ? 'text' : type}
        className={cn(
          'peer h-full w-full font-satoshi border-[#D5D9DC] bg-transparent pt-4 pb-1.5 text-sm font-normal text-[#0B1D2E] outline-none transition-all placeholder-shown:border-[#D5D9DC] focus:border-[#FF8700] disabled:border-0 disabled:bg-[#ACACAC]',
          inputClassName,
          isPassword && 'pr-10' // padding for icon space
        )}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}

      {label ? (
        <label
          className={cn(
            `after:content[' '] pointer-events-none absolute left-0 -top-2.5 flex h-full w-full select-none !overflow-visible truncate text-sm font-normal leading-tight text-[#D5D9DC] transition-all peer-placeholder-shown:text-blue-gray-500 peer-focus:text-sm peer-focus:leading-tight peer-focus:text-[#FF8700] peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-[#ACACAC] after:absolute after:-bottom-2.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-[#FF8700] after:transition-transform after:duration-300 peer-placeholder-shown:leading-tight peer-focus:after:scale-x-100`,
            labelClassName
          )}
        >
          {label}
        </label>
      ) : null}

      {error?.message && (
        <p className="text-xs text-red-800 mt-1">{error.message}</p>
      )}
    </div>
  );
};

export { TextInput };
