import { Search } from "lucide-react";
import Input from "./Input";

export default function SearchInput(props) {
  return (
    <Input leftIcon={<Search size={18} />} placeholder="Search..." {...props} />
  );
}
