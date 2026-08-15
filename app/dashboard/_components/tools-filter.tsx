import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useState } from "react";

const ToolsFilter = () => {
  const [isSelected, setIsSelected] = useState("tools");

  return (
    <section className="flex py-4 mt-10 border-y-2">
      <ButtonGroup className="overflow-x-scroll md:overflow-x-hidden">
        <Button
          onClick={() => setIsSelected("tools")}
          variant="secondary"
          size="lg"
          className={`border cursor-pointer ${isSelected === "tools" ? "bg-[#d8d8d8] dark:bg-[#171616] duration-775 hover:bg-[#d8d8d8]" : ""} `}
        >
          Saved Tools
        </Button>

        <Button
          onClick={() => setIsSelected("collections")}
          variant="secondary"
          size="lg"
          className={`border cursor-pointer ${isSelected === "collections" ? "bg-[#d8d8d8] dark:bg-[#171616] hover:bg-[#d8d8d8]" : ""} `}
        >
          Collections
        </Button>
        <Button
          onClick={() => setIsSelected("saved-collections")}
          variant="secondary"
          size="lg"
          className={`border cursor-pointer ${isSelected === "saved-collections" ? "bg-[#d8d8d8] dark:bg-[#171616] hover:bg-[#d8d8d8]" : ""} `}
        >
          Saved Collections
        </Button>
      </ButtonGroup>
    </section>
  );
};

export default ToolsFilter;
