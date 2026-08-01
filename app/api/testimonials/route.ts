import { makeCrud } from "@/lib/crud";
const crud = makeCrud("testimonial");
export const GET = crud.GET;
export const POST = crud.POST;
export const PATCH = crud.PATCH;
export const DELETE = crud.DELETE;
