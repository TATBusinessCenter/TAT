import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';
import { v4 as uuidv4 } from 'uuid';
import { api } from './api';

const db = SQLite.openDatabase('tat.db');

export function initDB() {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY NOT NULL,
        remoteId INTEGER,
        name TEXT,
        price REAL,
        stock INTEGER
      )`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS local_sales (
        id TEXT PRIMARY KEY NOT NULL,
        payload TEXT,
        status TEXT,
        created_at INTEGER
      )`
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS sales_items (
        id INTEGER PRIMARY KEY NOT NULL,
        sale_id TEXT,
        product_id INTEGER,
        qty INTEGER,
        unit_price REAL
      )`
    );
  });
}

export function saveLocalSale(payload: object) {
  const id = uuidv4();
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO local_sales (id, payload, status, created_at) values (?, ?, ?, ?)',
      [id, JSON.stringify(payload), 'pending', Date.now()]
    );
  });
  return id;
}

export async function trySync() {
  const state = await NetInfo.fetch();
  if (!state.isConnected) return;

  return new Promise<void>((resolve) => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM local_sales WHERE status = ?', ['pending'], async (_, { rows }) => {
        const sales: any[] = [];
        for (let i = 0; i < rows.length; i++) {
          const r = rows.item(i);
          sales.push({ id: r.id, payload: JSON.parse(r.payload) });
        }
        if (sales.length === 0) return resolve();

        try {
          await api.post('/sales/sync', { sales: sales.map(s => s.payload) });
          db.transaction(tx2 => {
            for (const s of sales) {
              tx2.executeSql('UPDATE local_sales SET status = ? WHERE id = ?', ['synced', s.id]);
            }
          });
        } catch (err) {
          console.log('Sync failed', err);
        }
        resolve();
      });
    });
  });
}