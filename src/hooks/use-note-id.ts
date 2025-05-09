import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";


export const useNoteId = () => {
  const params = useParams();

  return params.id as Id<"note">;
};