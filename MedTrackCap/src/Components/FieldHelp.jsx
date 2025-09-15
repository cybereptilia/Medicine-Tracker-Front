import React from "react";
import { useEffect, useState } from "react";
import { staticTips } from "../MedAssistant/staticTips";
import { getAssistantTip } from "../MedAssistant/client";

export default function FieldHelp({ fieldKey, id }) {
  const [tip, setTip] = useState(staticTips[fieldKey]);

  useEffect(() => {
    let mounted = true;
    getAssistantTip(fieldKey).then(t => { if (mounted) setTip(t); });
    return () => { mounted = false; };
  }, [fieldKey]);

  return (
    <p id={id} role="note" className="text-sm text-gray-600 mt-1">
      {tip}
    </p>
  );
}
