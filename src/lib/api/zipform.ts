import api from "./axios";

/**
 * Fetch transactions
 * @param contextId - The context ID
 * @returns Transaction data
 */
export const authUser = async () => {
  const response = await api.get(`/login`);  
  return response.data;
};

/**
 * Fetch transactions
 * @param contextId - The context ID
 * @returns Transaction data
 */
export const fetchTransactions = async (contextId: string) => {
  try {
    const response = await api.get(`/transactions`, {
      headers: {
        'X-Auth-ContextId': contextId,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    throw error;
  }
};

/**
 * Create a transaction
 * @param contextId - The context ID
 * @param transactionData - The transaction data
 * @returns Created transaction data
 */
export const createTransaction = async (contextId: string, transactionData: any) => {
  try {
    const response = await api.post(`/transaction/${contextId}`, transactionData, {
      headers: {
        'X-Auth-ContextId': contextId,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create transaction:', error);
    throw error;
  }
};

/**
 * Delete a transaction
 * @param contextId - The context ID
 * @param transactionId - The transaction ID
 * @returns Deletion response
 */
export const deleteTransaction = async (contextId: string, transactionId: string) => {
  try {
    const response = await api.delete(`/transactions/${contextId}/${transactionId}`, {
      headers: {
        'X-Auth-ContextId': contextId,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    throw error;
  }
};

/**
 * Fetch forms for a transaction
 * @param contextId - The context ID
 * @param transactionId - The transaction ID
 * @returns Forms data
 */
export const fetchTransactionForms = async (contextId: string, transactionId: string) => {
  try {
    const response = await api.get(`/transactions/${transactionId}/forms`, {
      headers: {
        'X-Auth-ContextId': contextId,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch transaction forms:', error);
    throw error;
  }
};

/**
 * Update document status
 * @param contextId - The context ID
 * @param transactionId - The transaction ID
 * @param documentData - The document data (id and status)
 * @returns Update response
 */
export const updateDocumentStatus = async (
  contextId: string,
  transactionId: string,
  documentData: { id: string; status: number },
) => {
  try {
    const response = await api.post(
      `/transactions/${transactionId}/documents/form`,
      documentData,
      {
        headers: {
          'X-Auth-ContextId': contextId,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update document status:', error);
    throw error;
  }
};

/**
 * Fetch documents of a transaction
 * @param contextId - The context ID
 * @param sharedKey - The shared authentication key
 * @param transactionId - The transaction ID
 * @returns List of documents for the transaction
 */
export const fetchTransactionDocuments = async (
  contextId: string,
  transactionId: string,
) => {
  try {
    const response = await api.get('/documentsOfTransaction', {
      headers: {
        'X-Auth-ContextId': contextId,
        'X-Auth-SharedKey': process.env.NEXT_PUBLIC_ZIPFORM_SHARED_KEY || "1B6341EE-C30B-466D-851F-36AFED6F4847",
      },
      params: {
        transactionId,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch transaction documents:', error);
    throw error;
  }
};

/**
 * Add a form document to a transaction
 * @param contextId - The context ID
 * @param transactionId - The transaction ID
 * @param documentData - The document details (JSON)
 * @returns API response for the document update
 */
export const addFormToTransaction = async (
  contextId: string,
  transactionId: string,
  documentData: any
) => {
  try {
    const response = await api.post(
      `/transactions/${contextId}/${transactionId}/documents/form`,
      documentData
    );

    return response.data;
  } catch (error) {
    console.error('Failed to add form document to transaction:', error);
    throw error;
  }
};
