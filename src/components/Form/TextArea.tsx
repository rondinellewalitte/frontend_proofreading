import { FormControl, FormErrorMessage, Textarea as ChakraTextarea, TextareaProps as ChakraTextareaProps } from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

interface TextareaProps extends ChakraTextareaProps {
  error?: FieldError;
}

const TextareaBase: ForwardRefRenderFunction<HTMLTextAreaElement, TextareaProps>
  = ({ error, ...rest }, ref) => {
    return (

      <FormControl isInvalid={!!error}>
        <ChakraTextarea
          ref={ref}
          {...rest}
        />

        {!!error && (
          <FormErrorMessage>
            {error.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  }

export const TextArea = forwardRef(TextareaBase);