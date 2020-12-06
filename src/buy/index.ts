import { InternalConfig } from "../+internal/+types";
import { browseFactory } from "./browse";

export function buyFactory(config: InternalConfig) {
  return {
    browse: browseFactory(config),
  };
}
