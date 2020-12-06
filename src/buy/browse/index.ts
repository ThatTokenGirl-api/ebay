import { InternalConfig } from "../../+internal/+types";
import searchFactory from "./search";

export function browseFactory(config: InternalConfig) {
  return {
    search: searchFactory(config),
  };
}
