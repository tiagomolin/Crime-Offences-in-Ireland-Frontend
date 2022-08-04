import axios from "axios";
import { useEffect, useState } from "react";

interface Offence {
  offence: {
    category: string;
    category_description: string;
    group_category: string;
  };
}

export function Offence(props: Offence) {
  return (
    <li>
      <strong>{props.offence.category}</strong>
      <p>{props.offence.category_description}</p>
    </li>
  );
}
