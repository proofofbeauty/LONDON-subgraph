import { TransferSingle, TransferBatch } from "../generated/Hash/ERC1155";
import { handleTransferSingle, handleTransferBatch } from "./mapping";

export function handleTransferSingleHash(event: TransferSingle): void {
  handleTransferSingle(event);
}

export function handleTransferBatchHash(event: TransferBatch): void {
  handleTransferBatch(event);
}