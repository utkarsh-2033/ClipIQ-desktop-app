import { ZodTypeAny  } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';


const useZodForm = (
  schema: ZodTypeAny ,
  // mutation: UseMutateFunction,
  defaultValue?: any
) => {
  const {
    reset,
    register,
    // handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValue },
  });

  // const onSubmit=handleSubmit(async (values) => mutation({ ...values }))

  return {
    register,
    // handleSubmit: onSubmit,
    watch,
    errors,
    reset
  };
};

export default useZodForm;
