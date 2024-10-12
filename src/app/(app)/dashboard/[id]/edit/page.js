'use client';
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
import { useEffect, useState } from "react";
import axios from "@/lib/axios"; // Import Axios
import { useRouter } from "next/navigation"; // Import useRouter
import { usePathname } from "next/navigation"; // Import usePathname

// Define the schema for form validation
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
    street_address: z.string().nonempty({ message: "Street Address is required." }),
    is_active: z.boolean().optional(),
  })
  .strict();

const EditSupplier = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      island_id: 0,
      province_id: 0,
      municipality_id: 0,
      brgy_id: 0,
      street_address: "",
      is_active: false,
    },
  });

  // Fetch supplier data when the component mounts
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const segments = pathname.split("/");
        const id = segments[segments.length - 2];

        if (id) {
          const response = await axios.get(`/dashboard/${id}/edit`);
          if (response.status === 200) {
            setSupplier(response.data);
            form.reset({
              ...response.data,
              island_id: Number(response.data.island_id),
              province_id: Number(response.data.province_id),
              municipality_id: Number(response.data.municipality_id),
              brgy_id: Number(response.data.brgy_id),
            });
          } else {
            setError("Supplier not found");
          }
        } else {
          setError("Supplier ID is not available");
        }
      } catch (error) {
        setError("Error fetching supplier data: " + error.message);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [pathname, form]);

  const submitForm = async (data) => {
    if (!supplier) return;
  
    const segments = pathname.split("/");
    const id = segments[segments.length - 2];
  
    const numericData = {
      name: data.name,
      street_address: data.street_address,
      island_id: Number(data.island_id),
      province_id: Number(data.province_id),
      municipality_id: Number(data.municipality_id),
      brgy_id: Number(data.brgy_id),
      is_active: data.is_active,
    };
  
    try {
      const response = await axios.put(`/dashboard/${id}`, numericData);
  
      if (response.status === 204) {
        setSuccess("Supplier updated successfully!");
        setError(null);
        setSupplier({ ...supplier, ...numericData });
        form.reset(numericData);
        router.push("/dashboard");
      } else {
        setError("Update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during update:", error);
      if (error.response) {
        // Display validation errors
        if (error.response.status === 422) {
          const validationErrors = error.response.data.errors;
          setError(`Validation errors: ${JSON.stringify(validationErrors)}`);
        } else {
          setError(`Failed to update supplier: ${error.response.data.message}`);
        }
      } else {
        setError("Failed to update supplier due to a network error");
      }
    }
  };
  

  const onSubmit = (data) => {
    submitForm(data);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
        <div className="overflow-hidden shadow-sm sm:rounded-lg">
          <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
            <h1 className="mt-10 mb-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Edit Supplier
            </h1>
            <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
              {/* Name Field */}
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
              {/* Island ID Field */}
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
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Province ID Field */}
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
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Municipality ID Field */}
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
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Barangay ID Field */}
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
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Street Address Field */}
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
                Update
              </Button>
            </Form>
            {success && <div className="text-green-500 mt-4">{success}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSupplier;
