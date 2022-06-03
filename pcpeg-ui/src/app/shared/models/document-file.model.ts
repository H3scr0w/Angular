import { DocumentModel } from './document.model';

export class DocumentFileModel {
  constructor(public document: DocumentModel, public file: File) {}
}
