import { UpdatedDocument } from "../generated/HashMetadataRegistry/HashMetadataRegistry";
import { Hash, HashDocument } from "../generated/schema";

export function handleUpdatedDocument(event: UpdatedDocument): void {
  let hashTokenId = event.params.tokenId.toHexString();
  let hash = Hash.load(hashTokenId);
  if (hash == null) {
    throw new Error("Hash does not exist");
  }
  let hashDocumentId = hashTokenId + '/' + event.params.key.toHexString();
  let hashDocument = HashDocument.load(hashDocumentId);
  if (hashDocument == null) {
    hashDocument = new HashDocument(hashDocumentId);
  } 
  hashDocument.key = event.params.key.toHexString(); // DOES THIS WORK?
  hashDocument.writer = event.params.writer;
  hashDocument.text = event.params.text;
  hashDocument.salt = event.params.salt;
  hashDocument.signature = event.params.signature;
  hashDocument.hash = event.params.tokenId.toHexString();
  hashDocument.createdAt = event.block.timestamp;
  hashDocument.save();
}