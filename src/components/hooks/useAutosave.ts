import { useCallback, useEffect, useMemo, useRef } from "react";

import { useState } from "react";
import { debounce } from "lodash";

function useAutosave(saveFunction: () => Promise<boolean>) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const saveFunctionRef = useRef(saveFunction);
  const saveGeneration = useRef(0); // Track change generations
  saveFunctionRef.current = saveFunction;

  const triggerSave = useMemo(() => {
    return debounce(() => {
      const thisGeneration = saveGeneration.current; // Capture current generation

      void (async () => {
        try {
          setStatus("saving");
          await saveFunctionRef.current();
          if (thisGeneration === saveGeneration.current) {
            setStatus("saved");
          }
        } catch (err) {
          if (thisGeneration === saveGeneration.current) {
            setStatus("error");
            console.error("Autosave failed:", err);
          }
        }
      })();
    }, 2000);
  }, []);

  // Increment generation before triggering save
  const save = useCallback(() => {
    saveGeneration.current += 1;
    triggerSave();
  }, [triggerSave]);

  useEffect(() => {
    return () => triggerSave.cancel();
  }, [triggerSave]);

  return { status, triggerSave: save };
}

export default useAutosave;
