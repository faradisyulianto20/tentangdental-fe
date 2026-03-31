import { useQuery } from "@tanstack/react-query";
import { getTestimonials } from "../services/testimonialService";

export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: getTestimonials,
  })
}