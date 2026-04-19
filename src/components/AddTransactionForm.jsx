import React, { useState } from 'react';

const AddTransactionForm = ({ addTransaction }) => {
  const [transactionDescription, setTransactionDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (transactionDescription) {
      addTransaction(transactionDescription);
      setTransactionDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={transactionDescription}
        onChange={(e) => setTransactionDescription(e.target.value)}
        placeholder="Indique la transacción"
      />
      <button type="submit">Añadir</button>
    </form>
  );
};

export default AddTransactionForm;