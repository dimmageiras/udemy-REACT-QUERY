import { useToast } from "@chakra-ui/react";

// a wrapper around Chakra UI's useToast that has my default options applied
export const useCustomToast = () => {
  return useToast({
    isClosable: true,
    position: "bottom",
    variant: "subtle",
  });
};
