import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createAnecdote = async (content) => {
  const anecdoteObject = {
    content,
    votes: 0,
  };
  const response = await axios.post(baseUrl, anecdoteObject);
  return response.data;
};

const modifyAnecdote = async (anecdote) => {
  const response = await axios.put(baseUrl + "/" + anecdote.id, anecdote);
  return response.data;
};

export default { getAll, createAnecdote, modifyAnecdote };
