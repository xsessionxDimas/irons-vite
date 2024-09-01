/* eslint-disable */
import Dexie, { IndexableType } from "dexie";

export const includeSingleQuery = async (db: Dexie, tableName: string, filters: string[]) => {
  const table = db.table(tableName)
  return await table.filter((f) => {
    return filters.includes(f.bindingKey) && f.syncStatus == 'Pending'
  }).first()
}

export const excludeSingleQuery = async (db: Dexie, tableName: string, filters: string[]) => {
  const table = db.table(tableName)
  return await table.filter((f) => {
    return !filters.includes(f.bindingKey) && f.syncStatus == 'Pending' 
  }).first()
}

export const includeQuery = async (db: Dexie, tableName: string, filters: string[]) => {
  const table = db.table(tableName)
  return await table.filter((f) => {
    return filters.includes(f.bindingKey) && f.syncStatus == 'Pending'
  }).toArray()
}

export const excludeQuery = async (db: Dexie, tableName: string, filters: string[]) => {
  const table = db.table(tableName)
  return await table.filter((f) => {
    return !filters.includes(f.bindingKey) && f.syncStatus == 'Pending'
  }).toArray()
}

export const getRecordByKey = async (db: Dexie, tableName: string, key: IndexableType) => {
  const table = db.table(tableName)
  return await table.get(key)
}

export const deleteRecordByKey = async (db: Dexie, tableName: string, key: IndexableType) => {
  const table = db.table(tableName)
  return await table.delete(key)
}

export const addRecord = async <TData> (db: Dexie, tableName: string, data: TData) => {
  const table = db.table(tableName)
  return await table.add(data)
}

export const updateRecord = async <TData> (db: Dexie, tableName: string, data: TData) => {
  const table = db.table(tableName)
  return await table.put(data)
}

export const addBulkRecords = async <TData> (db: Dexie, tableName: string, datas: TData[]) => {
  const table = db.table(tableName)
  return await table.bulkAdd(datas)
}

export const deleteBulkRecords = async (db: Dexie, tableName: string, keys: IndexableType[]) => {
  const table = db.table(tableName)
  return await table.bulkDelete(keys)
}

export const clearRecords = async (db: Dexie, tableName: string) => {
  const table = db.table(tableName)
  return await table.clear()
}

export const getPrimaryKeys = async (db: Dexie, tableName: string) => {
  const table = db.table(tableName)
  return await table.toCollection().primaryKeys()
}

export const tableToArray = async <TData>(db: Dexie, tableName: string): Promise<TData[]> => {
  const table = db.table(tableName)
  return await table.toArray()
}

export const tableCount = async (db: Dexie, tableName: string) => {
  const table = db.table(tableName)
  return (await table.toArray()).length
}
