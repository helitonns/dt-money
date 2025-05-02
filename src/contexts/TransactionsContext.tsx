import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../lib/axios";

export interface Transaction {
  id: number;
  description: string;
  type: "income" | "outcome";
  category: string;
  price: number;
  createdAt: string;
}

interface CreateTransactionInput {
  description: string;
  price: number;
  category: string;
  type: "income" | "outcome";
}
interface TransactionContextType {
  transactions: Transaction[];
  fetchTransactions: (query?: string) => Promise<void>;
  createTransaction: (data: CreateTransactionInput) => Promise<void>;
}
interface TransactionProviderProps {
  children: ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
export const TransactionsContext = createContext({} as TransactionContextType);

export function TransactionsProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
    async function fetchTransactions(query?: string) {
      const response = await api.get("transactions", {
        params: {
          q: query,
        },
      });

      setTransactions(response.data);
    }

    async function createTransaction(data: CreateTransactionInput) {
      const { description, price, category, type } = data;
      const response = await api.post("transactions", {
        description,
        price,
        category,
        type,
        createdAt: new Date().toISOString(),
      });

      setTransactions(state => [response.data, ...state]);
    }
  
    useEffect(()=>{
      fetchTransactions();
    }, []);

  return (
    <TransactionsContext.Provider value={{ transactions, fetchTransactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
}