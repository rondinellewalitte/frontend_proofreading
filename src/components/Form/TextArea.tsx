import { FormControl, FormErrorMessage, FormLabel, Input as ChakraInput, TextareaProps as ChakraTextareaProps, Textarea } from "@chakra-ui/react";
import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";

interface TextareaProps extends ChakraTextareaProps {
  error?: FieldError;
}

const TextareaBase: ForwardRefRenderFunction<HTMLInputElement, TextareaProps>
  = ({ error, ...rest }, ref) => {
    return (

      <FormControl isInvalid={!!error}>
        <Textarea
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