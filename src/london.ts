import { Transfer } from "../generated/London/ERC20";
import { handleTransferSingle } from "./mapping";

export function handleTransferLondon(event: Transfer): void {
  handleTransferSingle(event);
}