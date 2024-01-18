import { useState, useEffect } from "react";
import { AccountForm } from "../features/accounts";
import api from "../lib/apiFacade";

const Accounts = () => {
  const [accounts, setAccounts] = useState(null);
  const [newAccount, setNewAccount] = useState({
    _id: crypto.randomUUID(),
    name: "",
    username: "",
    email: "",
    password: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  const [displayedAccounts, setDisplayedAccounts] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAccount, setEditingAccount] = useState(null);
  const [showPasswordId, setShowPasswordId] = useState(null);
  const [newAccountSuccessMessage, setNewAccountSuccessMessage] = useState("");
  const [newAccountErrorMessage, setNewAccountErrorMessage] = useState("");
  const [editAccountSuccessMessage, setEditAccountSuccessMessage] =
    useState("");
  const [editAccountErrorMessage, setEditAccountErrorMessage] = useState("");
  const [messageAccountId, setMessageAccountId] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const token = localStorage.getItem("token");

  const fetchAccounts = async () => {
    const response = await api.getAccounts(token);
    if (response && response.accounts) {
      const sortedAccounts = response.accounts.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setAccounts(sortedAccounts);
      setDisplayedAccounts(sortedAccounts);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (accounts) {
      const results = accounts.filter((account) =>
        account.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDisplayedAccounts(results);
    }
  }, [searchTerm]);

  const handleInputChange = (e) => {
    setNewAccount({ ...newAccount, [e.target.name]: e.target.value });
  };

  const addAccount = async () => {
    try {
      const account = { ...newAccount, password: newAccount.password };
      const data = await api.addAccountToUser(account, token);

      if (data.message) {
        setNewAccountSuccessMessage(data.message);
        fetchAccounts();
        setNewAccount({
          _id: crypto.randomUUID(),
          name: "",
          username: "",
          email: "",
          password: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      setNewAccountErrorMessage(error.message);
    }
  };

  const deleteAcc = async (accountId) => {
    try {
      accounts.find((acc) => acc._id === accountId);
      const confirmation = window.confirm(
        "Willst du deinen Account wirklich löschen?"
      );
      if (confirmation) {
        const data = await api.deleteAccount(accountId, token);

        if (data.message) {
          setEditAccountSuccessMessage(data.message);
          fetchAccounts();
        }
      }
    } catch (error) {
      setEditAccountErrorMessage(error.message);
    }
  };

  const handleEditInputChange = (index, e) => {
    const updatedAccounts = [...accounts];
    updatedAccounts[index][e.target.name] = e.target.value;
    setAccounts(updatedAccounts);
  };

  const cancelEdit = () => {
    setEditingAccount(null);
    setShowPasswordId(null);
  };

  const handleEditSubmit = async (e, accountId) => {
    try {
      e.preventDefault();
      const accountToEdit = {
        ...accounts.find((acc) => acc._id === accountId),
        updated_at: new Date().toISOString(),
      };
      const data = await api.editAccount(accountId, accountToEdit, token);

      if (data.message) {
        setEditAccountSuccessMessage(data.message);
        setIsEditing(null);
        setEditingAccount(null);
        fetchAccounts();
      }
    } catch (error) {
      setEditAccountErrorMessage(error.message);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await addAccount();
  };

  return (
    <AccountForm
      handleInputChange={handleInputChange}
      deleteAcc={deleteAcc}
      handleEditInputChange={handleEditInputChange}
      cancelEdit={cancelEdit}
      handleEditSubmit={handleEditSubmit}
      handleFormSubmit={handleFormSubmit}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      displayedAccounts={displayedAccounts}
      newAccount={newAccount}
      editingAccount={editingAccount}
      setEditingAccount={setEditingAccount}
      showPasswordId={showPasswordId}
      setShowPasswordId={setShowPasswordId}
      newAccountSuccessMessage={newAccountSuccessMessage}
      setNewAccountSuccessMessage={setNewAccountSuccessMessage}
      newAccountErrorMessage={newAccountErrorMessage}
      setNewAccountErrorMessage={setNewAccountErrorMessage}
      editAccountSuccessMessage={editAccountSuccessMessage}
      setEditAccountSuccessMessage={setEditAccountSuccessMessage}
      editAccountErrorMessage={editAccountErrorMessage}
      setEditAccountErrorMessage={setEditAccountErrorMessage}
      messageAccountId={messageAccountId}
      setMessageAccountId={setMessageAccountId}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
    />
  );
};

export default Accounts;
