import { Message } from "../schema/Message"
import { SyncMessage } from "../schema/SyncMessage"

export interface ISyncDBService {
  addSyncTask(data: SyncMessage): Promise<void>
  pullSyncTask(currentKey: number): Promise<Message | undefined>
  createSyncTask(module: string, section: string, type: string, payload: string)
}
