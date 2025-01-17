const { v4: generateId } = require("uuid");

const { NotFoundError } = require("../util/errors");
const { readData, writeData } = require("./util");

async function getAll() {
  const storedData = await readData();
  if (!storedData.cards) {
    throw new NotFoundError("Could not find any cards.");
  }
  return storedData.cards;
}

async function get(id) {
  const storedData = await readData();
  if (!storedData.cards || storedData.cards.length === 0) {
    throw new NotFoundError("Could not find any cards.");
  }

  const card = storedData.cards.find((ev) => ev.id === id);
  if (!card) {
    throw new NotFoundError("Could not find card for id " + id);
  }

  return card;
}

async function add(data) {
  const storedData = await readData();
  storedData.cards.unshift({ ...data, id: generateId() });
  await writeData(storedData);
}

async function replace(id, data) {
  const storedData = await readData();
  if (!storedData.cards || storedData.cards.length === 0) {
    throw new NotFoundError("Could not find any cards.");
  }

  const index = storedData.cards.findIndex((ev) => ev.id === id);
  if (index < 0) {
    throw new NotFoundError("Could not find card for id " + id);
  }

  storedData.cards[index] = { ...data, id };

  await writeData(storedData);
}

async function remove(id) {
  const storedData = await readData();
  const updatedData = storedData.cards.filter((card) => card.id !== id);
  await writeData({ ...storedData, cards: updatedData });
}

exports.getAll = getAll;
exports.get = get;
exports.add = add;
exports.replace = replace;
exports.remove = remove;
