import { makeCrud } from "@/lib/crud";
const crud = makeCrud("caseStudy");
export const GET = crud.GET;
export const POST = crud.POST;
export const PATCH = crud.PATCH;
export const DELETE = crud.DELETE;
