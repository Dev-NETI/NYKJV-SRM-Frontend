"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "@/lib/axios";

// Define your validation schema with Zod
const FormSchema = z
  .object({
    name: z.string().nonempty({ message: "Name is required." }),
    island_id: z
      .number()
      .int({ message: "Island ID must be an integer." })
      .max(100, { message: "Island ID must be 100 or fewer." }),
    province_id: z
      .number()
      .int({ message: "Province ID must be an integer." })
      .max(100, { message: "Province ID must be 100 or fewer." }),
    municipality_id: z
      .number()
      .int({ message: "Municipality ID must be an integer." })
      .max(100, { message: "Municipality ID must be 100 or fewer." }),
    brgy_id: z
      .number()
      .int({ message: "Barangay ID must be an integer." })
      .max(100, { message: "Barangay ID must be 100 or fewer." }),
    street_address: z
      .string()
      .nonempty({ message: "Street Address is required." }),
    is_active: z.boolean().optional(), // Make is_active optional
  })
  .strict();

const Store = () => {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      island_id: 0, // Set as number
      province_id: 0, // Set as number
      municipality_id: 0, // Set as number
      brgy_id: 0, // Set as number
      street_address: "",
      is_active: false, // Default value
    },
  });

  const submitForm = async (data) => {
    console.log("Form data to be sent:", data); // Log the form data

    // Ensure the ID fields are treated as numbers
    data.island_id = Number(data.island_id);
    data.province_id = Number(data.province_id);
    data.municipality_id = Number(data.municipality_id);
    data.brgy_id = Number(data.brgy_id);

    try {
      // Send POST request using Axios
      const response = await axios.post("/dashboard/store", data);
      console.table("Supplier Created Successfully", response.data);
      form.reset(); // Reset form after successful submission
    } catch (error) {
      if (error.response) {
        console.error("Error:", error.response.data.message);
      } else {
        console.error("Error submitting the form:", error);
      }
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
      <h2 className="mt-10 mb-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Register a Supplier
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="grid w-full max-w-sm items-center gap-1.5"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="island_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Island ID</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Island ID"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="province_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province ID</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Province ID"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="municipality_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Municipality ID</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Municipality ID"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brgy_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barangay ID</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Barangay ID"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="street_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Street Address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-5" type="submit">
            Register
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Store;
