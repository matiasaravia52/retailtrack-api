import { CreateBatchDto, UpdateBatchDto } from "../../dto/BatchDto";
import Batch from "../../models/Batch";

export interface IBatchService {
    getAllBatches(): Promise<Batch[]>;
    getBatchById(id: string): Promise<Batch | null>;
    createBatch(batchData: CreateBatchDto): Promise<Batch>;
    updateBatch(id: string, batchData: UpdateBatchDto): Promise<Batch>;
    deleteBatch(id: string): Promise<void>;
    searchBatches(query: string): Promise<Batch[]>;
}