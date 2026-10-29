import { PeopleDirectory } from "../components/PeopleDirectory";

/** Comparison route shares the approved directory, without changing its live variant. */
export default function PeopleGridPrototype({ variant }: { variant: "grid" | "compact" }) {
  return <PeopleDirectory variant={variant} preview />;
}
