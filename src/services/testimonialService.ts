const BASE_URL = "http://127.0.0.1:8000/";

const getTestimonials = async () => {
  const response = await fetch(`${BASE_URL}api/testimonials`);
    if (!response.ok) {
        throw new Error("Failed to fetch testimonials");
    }
    return response.json();
}

export { getTestimonials }