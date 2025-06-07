import Batch from "../../models/Batch";
import { CreateBatchDto, UpdateBatchDto } from "../../dto/BatchDto";

export interface IBatchRepository {
    findAll(): Promise<Batch[]>;
    findById(id: string): Promise<Batch | null>;
    create(batch: CreateBatchDto, options?: {}): Promise<Batch>;
    update(id: string, batch: UpdateBatchDto): Promise<Batch>;
    delete(id: string): Promise<void>;
    search(query: string): Promise<Batch[]>;
}
